'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, MessageCircle, ShieldAlert, Star } from 'lucide-react';
import type { Ride } from '@/lib/types';
import { useState } from 'react';
import CancellationSheet from './CancellationSheet';
import SafetySheet from './SafetySheet';

type RideStatusSheetProps = {
    ride: Ride;
    onCancel: () => void;
    openChat: (rideId: string) => void;
};

export default function RideStatusSheet({ ride, onCancel, openChat }: RideStatusSheetProps) {
    const [isCancelSheetOpen, setIsCancelSheetOpen] = useState(false);
    const [isSafetySheetOpen, setIsSafetySheetOpen] = useState(false);

    return (
        <div className="absolute bottom-0 left-0 right-0 z-30">
            <Card className="rounded-t-2xl rounded-b-none shadow-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-lg">{ride.captain?.name || "Captain"}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                <span>{ride.captain?.rating?.toFixed(1) || "5.0"}</span>
                                <span className="mx-1">•</span>
                                <span>{ride.captain?.vehicle || "Vehicle"}</span>
                            </div>
                        </div>
                        <Avatar className="h-16 w-16">
                            <AvatarFallback>{ride.captain?.name?.charAt(0) || "C"}</AvatarFallback>
                        </Avatar>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                    {ride.status !== 'STARTED' && (
                        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground">Start Ride PIN</p>
                            <p className="text-4xl font-bold tracking-[0.5em] text-primary">{ride.otp || "1234"}</p>
                        </div>
                    )}


                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-14 text-base">
                            <Phone className="mr-2" /> Call
                        </Button>
                        <Button variant="outline" className="h-14 text-base" onClick={() => openChat(ride.id)}>
                            <MessageCircle className="mr-2" /> Chat
                        </Button>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <Button variant="destructive" onClick={() => setIsCancelSheetOpen(true)}>Cancel Ride</Button>
                        <Button variant="outline" className="border-accent text-accent hover:bg-accent/10" onClick={() => setIsSafetySheetOpen(true)}>
                            <ShieldAlert className="mr-2" /> SOS
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <CancellationSheet
                isOpen={isCancelSheetOpen}
                onOpenChange={setIsCancelSheetOpen}
                onConfirmCancel={(reason) => {
                    console.log("Cancelled due to:", reason);
                    onCancel();
                }}
            />

            <SafetySheet
                isOpen={isSafetySheetOpen}
                onOpenChange={setIsSafetySheetOpen}
            />
        </div>
    );
}
