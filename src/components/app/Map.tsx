'use client';
import VehicleIcon from './VehicleIcon';
import type { Ride, Service, CaptainProfile } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { GeoPoint, collection, query, where } from 'firebase/firestore';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';

type MapProps = {
  stage: 'idle' | 'searching' | 'selecting_service' | 'finding_captain' | 'in_ride' | 'trip_summary';
  activeRide?: Ride | null;
  selectedService?: Service['id'];
  center?: google.maps.LatLngLiteral | null;
  onCenterChange?: () => void;
  showOtherCaptains?: boolean;
};

const KPHB_COORDS = { lat: 17.4948, lng: 78.3996 };
const DEST_COORDS = { lat: 17.4483, lng: 78.3908 }; // A destination for simulation

// Convert lat/lng to a percentage on the map for simulation
const latLngToPercent = (lat: number, lng: number) => {
  // These are simplified bounds for Hyderabad area for simulation
  const minLat = 17.3, maxLat = 17.6;
  const minLng = 78.3, maxLng = 78.6;

  const left = ((lng - minLng) / (maxLng - minLng)) * 100;
  const top = 100 - (((lat - minLat) / (maxLat - minLat)) * 100);

  return { x: left, y: top };
}


const PICKUP_POS = latLngToPercent(KPHB_COORDS.lat, KPHB_COORDS.lng);
const DESTINATION_POS = latLngToPercent(DEST_COORDS.lat, DEST_COORDS.lng);

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export default function Map({ stage, activeRide, selectedService, center, onCenterChange, showOtherCaptains = true }: MapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { firestore } = useFirebase();
  const isUserOnline = useOnlineStatus();

  // Get captain's position from ride data if it exists
  const captainLatLng = activeRide?.captainLocation instanceof GeoPoint
    ? { lat: activeRide.captainLocation.latitude, lng: activeRide.captainLocation.longitude }
    : null;

  const captainPosition = captainLatLng ? latLngToPercent(captainLatLng.lat, captainLatLng.lng) : null;

  // --- Real-time Captains from Firestore ---
  const onlineCaptainsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    let q = query(collection(firestore, 'captainProfiles'), where('isOnline', '==', true));
    if (stage === 'selecting_service' && selectedService) {
      q = query(q, where('vehicleType', '==', selectedService));
    }
    return q;
  }, [firestore, stage, selectedService]);

  const { data: onlineCaptains } = useCollection<CaptainProfile>(onlineCaptainsQuery);

  // Filter out stale captains locally (e.g., no update in last 15 seconds)
  const activeVehicles = onlineCaptains?.filter(captain => {
    if (!isUserOnline) return false; // Hide all if user is offline
    if (!captain.isOnline) return false; // Double check
    if (!captain.location) return false;

    // Check for staleness
    if (!captain.lastLocationUpdate) return false; // Strict: Must have a timestamp

    // Handle Firestore Timestamp or Date or millis
    let lastUpdateMillis = 0;
    if (typeof captain.lastLocationUpdate.toMillis === 'function') {
      lastUpdateMillis = captain.lastLocationUpdate.toMillis();
    } else if (captain.lastLocationUpdate instanceof Date) {
      lastUpdateMillis = captain.lastLocationUpdate.getTime();
    } else if (typeof captain.lastLocationUpdate === 'number') {
      lastUpdateMillis = captain.lastLocationUpdate;
    }

    const now = Date.now();
    // If update is older than 15 seconds, consider it stale/offline
    if (now - lastUpdateMillis > 15000) {
      return false;
    }
    return true;
  });

  // --- End Real-time Captains ---


  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.panTo(center);
      onCenterChange?.();
    }
  }, [center, onCenterChange]);


  const showPickupToDestinationRoute = ['selecting_service', 'finding_captain', 'in_ride'].includes(stage);
  const showCaptainOnRide = stage === 'in_ride' && activeRide && captainPosition;

  // Only show nearby vehicles when idle or selecting a service and user is online
  const showNearbyVehicles = isUserOnline && (stage === 'idle' || stage === 'selecting_service' || showOtherCaptains);

  const getStatusText = () => {
    if (!activeRide || stage !== 'in_ride') return null;

    switch (activeRide.status) {
      case 'ACCEPTED':
        return 'Captain is arriving in ~5 min';
      case 'ARRIVED':
        return 'Captain has arrived at your pickup location';
      case 'STARTED':
        return 'You are on your way';
      default:
        return null;
    }
  }
  const statusText = getStatusText();

  const userPinPosition = () => {
    if (showCaptainOnRide && activeRide?.status === 'STARTED') {
      return DESTINATION_POS; // User pin is now at destination
    }
    return PICKUP_POS; // Default at pickup
  }

  const userPinStyle = {
    top: `${userPinPosition().y}%`,
    left: `${userPinPosition().x}%`
  }


  return (
    <div className="relative h-full w-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124413.9877478676!2d77.51860882772594!3d12.96998634914164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sus!4v1716382582193!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={cn((stage === 'idle' || stage === 'selecting_service') ? '' : 'grayscale opacity-80')}
      ></iframe>

      {/* User's location pin (Pickup/Destination) */}
      <div className={cn("absolute z-20 -translate-x-1/2 -translate-y-1/2", stage === 'searching' ? 'hidden' : '')} style={userPinStyle}>
        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
        <div className="w-8 h-8 bg-green-500/20 rounded-full absolute -top-2 -left-2 animate-ping"></div>
      </div>

      {/* Destination selection pin */}
      {stage === 'searching' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] z-20 pointer-events-none">
          <div className="flex flex-col items-center">
            <div className="p-2 bg-red-500 text-white rounded-md text-xs font-bold shadow-lg">Drop</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" className="-mt-1">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      )}

      {/* Nearby vehicles (Live from Firestore - Active & Online Only) */}
      {showNearbyVehicles && activeVehicles?.map(captain => {
        if (!captain.location || !(captain.location instanceof GeoPoint)) return null;
        const pos = latLngToPercent(captain.location.latitude, captain.location.longitude);
        return (
          <div
            key={captain.id}
            className="absolute transition-all duration-200 ease-linear z-20"
            style={{
              top: `${pos.y}%`,
              left: `${pos.x}%`,
            }}
          >
            <VehicleIcon service={captain.vehicleType} />
          </div>
        )
      })}

      {/* Simulated Route */}
      {showPickupToDestinationRoute && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" >
          <line
            x1={`${PICKUP_POS.x}%`} y1={`${PICKUP_POS.y}%`}
            x2={`${DESTINATION_POS.x}%`} y2={`${DESTINATION_POS.y}%`}
            stroke="hsl(var(--foreground))"
            strokeWidth="4"
            strokeDasharray="8 8"
          />
          <circle cx={`${DESTINATION_POS.x}%`} cy={`${DESTINATION_POS.y}%`} r="8" fill="hsl(var(--primary))" />
        </svg>
      )}

      {/* Captain's vehicle during ride */}
      {showCaptainOnRide && (
        <div className="absolute transition-all duration-100 ease-linear pointer-events-none z-20" style={{ top: `${captainPosition.y}%`, left: `${captainPosition.x}%` }}>
          <VehicleIcon service={activeRide!.service} />
        </div>
      )}

      {/* Status Text on Map */}
      {statusText && (
        <div
          className="absolute z-20 bg-background/80 backdrop-blur-sm p-2 px-4 rounded-full shadow-lg font-semibold top-20 left-1/2 -translate-x-1/2"
        >
          {statusText}
        </div>
      )}
    </div>
  );
}
