'use client';
import Layout from '@/components/app/Layout';
import VehicleIcon from '@/components/app/VehicleIcon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import type { Ride, Screen } from '@/lib/types';
import { Star } from 'lucide-react';
import { format } from 'date-fns';

type RideHistoryPageProps = {
  rides: Ride[];
  navigateTo: (screen: Screen) => void;
};

export default function RideHistoryPage({ rides, navigateTo }: RideHistoryPageProps) {
  return (
    <Layout title="My Rides" navigateTo={navigateTo}>
      <div className="p-4 space-y-4">
        {rides.length > 0 ? (
          rides.map((ride) => (
            <Card key={ride.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">{format(new Date(ride.date), "dd MMM yyyy, p")}</p>
                    <p className="font-bold">{ride.destination}</p>
                    <p className="text-sm text-muted-foreground">From: {ride.pickup}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{ride.fare}</p>
                    <VehicleIcon service={ride.service} className="ml-auto mt-1" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                  <Avatar>
                    <AvatarFallback>{ride.captain.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{ride.captain.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span>{ride.captain.rating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">You have no past rides.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
