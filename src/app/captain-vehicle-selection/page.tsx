'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike, Car, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { setDoc, doc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import type { User as FirebaseUser } from 'firebase/auth';
import VehicleIcon from '@/components/app/VehicleIcon';

type CaptainVehicleSelectionPageProps = {
  onVehicleSelected: (user: User, firebaseUser: FirebaseUser) => void;
};

const vehicles = [
  { id: 'Bike', name: 'Bike' },
  { id: 'Auto', name: 'Auto' },
  { id: 'Cab', name: 'Cab' },
] as const;

type VehicleType = typeof vehicles[number]['id'];

export default function CaptainVehicleSelectionPage({ onVehicleSelected }: CaptainVehicleSelectionPageProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { firestore, user: firebaseUser, auth } = useFirebase();

  const handleFinish = async () => {
    if (!selectedVehicle) {
      toast({ variant: 'destructive', title: "No Vehicle Selected", description: "Please choose a vehicle type to continue." });
      return;
    }
    
    if (!firestore || !firebaseUser) {
       toast({ variant: 'destructive', title: "Error", description: "Could not save data. User not found." });
       return
    }

    setIsSubmitting(true);
    try {
        const captainProfileRef = doc(firestore, "captainProfiles", firebaseUser.uid);

        await setDoc(captainProfileRef, { vehicleType: selectedVehicle }, { merge: true });
        
        toast({ title: "Setup Complete!", description: "You are now ready to go online." });
        
        // This is where we do the "final" login success call
        let storedUser = null;
        if(typeof window !== "undefined") {
          try {
            storedUser = localStorage.getItem('rider-app-user');
          } catch(e) { console.error(e); }
        }

        if (storedUser) {
           onVehicleSelected(JSON.parse(storedUser), firebaseUser);
        } else {
            // Fallback if local storage fails
            const fallbackUser: User = { name: "Captain", email: "", phone: "" };
            onVehicleSelected(fallbackUser, firebaseUser);
        }

    } catch (error: any) {
        toast({ variant: 'destructive', title: "Failed to save vehicle", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 p-4">
       <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="relative items-center text-center pt-10">
            <div className="p-2 border-2 border-primary rounded-full w-fit">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="pt-2">Select Your Vehicle</CardTitle>
            <CardDescription>Choose the vehicle you will be using for rides.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            {vehicles.map(vehicle => (
                <Card 
                    key={vehicle.id}
                    className={`flex items-center p-4 gap-4 cursor-pointer transition-all ${selectedVehicle === vehicle.id ? 'border-primary ring-2 ring-primary' : 'border'}`}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                >
                   <VehicleIcon service={vehicle.id} className="h-12 w-12" />
                   <div className="flex-1">
                     <h3 className="font-bold text-lg">{vehicle.name}</h3>
                   </div>
                </Card>
            ))}
          </CardContent>
          <CardFooter className="p-6">
            <Button className="w-full h-12 text-base" onClick={handleFinish} disabled={!selectedVehicle || isSubmitting}>
              {isSubmitting ? "Saving..." : "Finish Setup"}
            </Button>
          </CardFooter>
      </Card>
    </div>
  );
}
