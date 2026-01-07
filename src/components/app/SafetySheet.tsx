'use client';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ShieldAlert, Share2, Phone, BellRing } from 'lucide-react';

type SafetySheetProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function SafetySheet({ isOpen, onOpenChange }: SafetySheetProps) {

    const handleShareDetails = () => {
        // Logic to share details
        alert("Share Ride Details Clicked (Simulation)");
        onOpenChange(false);
    }

    const handleSOS = () => {
        // Logic to trigger SOS
        alert("SOS Triggered (Simulation)");
        onOpenChange(false);
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8">
                <SheetHeader className="mb-6 text-left">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-primary" />
                        <SheetTitle className="text-xl font-bold">Safety Toolkit</SheetTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">We are here to help you during your ride.</p>
                </SheetHeader>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex-col gap-2 border-2 hover:border-primary/50 hover:bg-primary/5" onClick={handleShareDetails}>
                        <Share2 className="h-8 w-8 text-blue-500" />
                        <span className="font-semibold">Share Ride Details</span>
                    </Button>

                    <Button variant="outline" className="h-24 flex-col gap-2 border-2 hover:border-destructive/50 hover:bg-destructive/5" onClick={handleSOS}>
                        <BellRing className="h-8 w-8 text-red-500" />
                        <span className="font-semibold">Emergency SOS</span>
                    </Button>

                    <Button variant="outline" className="h-24 flex-col gap-2 border-2 hover:border-green-500/50 hover:bg-green-500/5">
                        <Phone className="h-8 w-8 text-green-600" />
                        <span className="font-semibold">Call Police (100)</span>
                    </Button>

                    <Button variant="outline" className="h-24 flex-col gap-2 border-2 hover:border-orange-500/50 hover:bg-orange-500/5">
                        <ShieldAlert className="h-8 w-8 text-orange-500" />
                        <span className="font-semibold">Safety Support</span>
                    </Button>
                </div>

            </SheetContent>
        </Sheet>
    );
}
