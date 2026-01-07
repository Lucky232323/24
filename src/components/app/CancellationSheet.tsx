'use client';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState, useEffect } from 'react';

type CancellationSheetProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirmCancel: (reason: string) => void;
};

const cancellationReasons = [
    "Driver denied duty",
    "Driver asked to cancel",
    "Expected a shorter wait time",
    "Unable to contact driver",
    "My reason is not listed",
    "Changed my plans"
];

export default function CancellationSheet({ isOpen, onOpenChange, onConfirmCancel }: CancellationSheetProps) {
    const [selectedReason, setSelectedReason] = useState<string>("");

    // Reset selection when sheet opens
    useEffect(() => {
        if (isOpen) setSelectedReason("");
    }, [isOpen]);

    const handleConfirm = () => {
        if (selectedReason) {
            onConfirmCancel(selectedReason);
            onOpenChange(false);
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-6">
                <SheetHeader className="mb-4 text-left">
                    <SheetTitle className="text-xl font-bold">Cancel Ride?</SheetTitle>
                    <p className="text-sm text-muted-foreground">Please select a reason for cancellation</p>
                </SheetHeader>

                <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="space-y-3 mb-6">
                    {cancellationReasons.map((reason) => (
                        <div key={reason} className="flex items-center space-x-3 py-1">
                            <RadioGroupItem value={reason} id={reason} />
                            <Label htmlFor={reason} className="text-base font-medium cursor-pointer flex-1 py-1">{reason}</Label>
                        </div>
                    ))}
                </RadioGroup>

                <Button
                    className="w-full h-12 text-lg font-semibold"
                    variant="destructive"
                    disabled={!selectedReason}
                    onClick={handleConfirm}
                >
                    Cancel Ride
                </Button>
            </SheetContent>
        </Sheet>
    );
}
