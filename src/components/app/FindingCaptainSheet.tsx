import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import RadarPulse from '../ui/RadarPulse';

const messages = [
  "Searching for captains nearby...",
  "Finding best-rated captains for you...",
  "Connecting to the nearest ride...",
  "Confirming your ride, please wait..."
];

type FindingCaptainSheetProps = {
  onCancel: () => void;
};
export default function FindingCaptainSheet({ onCancel }: FindingCaptainSheetProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
      <Card className="rounded-2xl shadow-2xl border-none">
        <CardContent className="p-0 text-center space-y-4 pb-6">
          {/* Radar Animation */}
          <div className="bg-gradient-to-b from-background to-secondary/20 rounded-t-2xl pt-6">
            <RadarPulse />
          </div>

          <div className="px-6 space-y-2">
            <h2 className="text-xl font-bold">Finding your ride...</h2>
            <p className="text-muted-foreground animate-pulse transition-opacity duration-500 min-h-[1.5rem]">{messages[currentMessageIndex]}</p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="link" className="text-destructive">Cancel Ride</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your ride request will be cancelled and you will be returned to the home screen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Don't Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onCancel} className="bg-destructive hover:bg-destructive/90">Cancel Ride</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </CardContent>
      </Card>
    </div>
  );
}
