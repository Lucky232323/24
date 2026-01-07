'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Clock, Heart, MapPin, Mic, LocateFixed } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

type SearchSheetProps = {
  onClose: () => void;
  onDestinationSelect: (pickup: string, destination: string) => void;
};

const savedPlaces = [
  { name: 'Home', address: '123, Dream Avenue, Bengaluru', icon: Heart },
  { name: 'Work', address: '456, Tech Park, Whitefield', icon: Heart },
];
const recentSearches = [
  { name: 'Koramangala 5th Block', address: 'Bengaluru, Karnataka', icon: Clock },
  { name: 'Indiranagar Metro Station', address: 'Bengaluru, Karnataka', icon: Clock },
];

export default function SearchSheet({ onClose, onDestinationSelect }: SearchSheetProps) {
  const [pickup, setPickup] = useState('Your Current Location');
  const [destination, setDestination] = useState('');
  const [isChoosingOnMap, setIsChoosingOnMap] = useState(false);

  const handleConfirm = () => {
    if (destination) {
      onDestinationSelect(pickup, destination);
    }
  };
  
  const handleMapSelect = () => {
    if(isChoosingOnMap) {
        onDestinationSelect(pickup, "Selected on Map");
    } else {
        setIsChoosingOnMap(true);
    }
  }

  if (isChoosingOnMap) {
    return (
        <div className="absolute inset-x-0 bottom-0 z-30 p-4">
             <Button onClick={handleMapSelect} className="w-full h-14 text-lg">
                Confirm Destination
            </Button>
        </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-background z-20 flex flex-col">
      <header className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft />
        </Button>
        <h2 className="text-xl font-semibold ml-4">Set destination</h2>
      </header>
      <div className="p-4 space-y-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          <Input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="h-14 pl-10 bg-secondary border-none"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
          <Input
            placeholder="Enter drop location"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="h-14 pl-10 bg-secondary border-none focus-visible:ring-primary"
          />
          <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
            <Mic className="h-5 w-5 text-muted-foreground"/>
          </Button>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
            <button className="flex items-center text-left w-full gap-4 text-primary" onClick={handleMapSelect}>
                <div className="p-2 bg-secondary rounded-full">
                    <LocateFixed className="h-5 w-5"/>
                </div>
                <div>
                    <p className="font-semibold">Choose on map</p>
                </div>
            </button>
          <section>
            <h3 className="font-semibold mb-4 text-muted-foreground">Saved Places</h3>
            <div className="space-y-4">
              {savedPlaces.map((place, index) => (
                <button key={index} className="flex items-start text-left w-full gap-4" onClick={() => onDestinationSelect(pickup, place.name)}>
                  <div className="p-2 bg-secondary rounded-full">
                    <place.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{place.name}</p>
                    <p className="text-sm text-muted-foreground">{place.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
          <Separator />
          <section>
            <h3 className="font-semibold mb-4 text-muted-foreground">Recent Searches</h3>
            <div className="space-y-4">
              {recentSearches.map((place, index) => (
                <button key={index} className="flex items-start text-left w-full gap-4" onClick={() => onDestinationSelect(pickup, place.name)}>
                  <place.icon className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div>
                    <p>{place.name}</p>
                    <p className="text-sm text-muted-foreground">{place.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
      {destination && (
        <div className="p-4 border-t">
            <Button onClick={handleConfirm} className="w-full h-14 text-lg">
            Confirm Destination
            </Button>
        </div>
      )}
    </div>
  );
}
