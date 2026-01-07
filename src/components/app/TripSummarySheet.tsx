'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star } from 'lucide-react';
import type { Ride } from '@/lib/types';
import { Textarea } from '../ui/textarea';

type TripSummarySheetProps = {
  ride: Ride;
  onDone: () => void;
};

const feedbackOptions = ["Good driving", "Clean vehicle", "Polite captain", "Took a good route", "Followed instructions"];

export default function TripSummarySheet({ ride, onDone }: TripSummarySheetProps) {
  const [rating, setRating] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);

  const toggleFeedback = (option: string) => {
    setSelectedFeedback(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    // In a real app, you would save the rating and feedback to Firestore here.
    // For example:
    // const rideRef = doc(firestore, 'rides', ride.id);
    // await updateDoc(rideRef, {
    //   rating: rating,
    //   feedback: selectedFeedback,
    //   comment: document.getElementById('comment-textarea').value
    // });
    onDone();
  }

  return (
    <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ride Completed!</CardTitle>
          <CardDescription>Payment successful via Cash</CardDescription>
          <p className="text-4xl font-bold pt-2">₹{ride.fare}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 rounded-lg bg-secondary/50">
            <p className="font-semibold">Rate your ride with {ride.captain.name}</p>
            <div className="flex justify-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          {rating > 0 && (
            <>
              <div className="flex flex-wrap gap-2 justify-center">
                {feedbackOptions.map(option => (
                    <Button 
                      key={option} 
                      variant={selectedFeedback.includes(option) ? "default" : "outline"} 
                      size="sm"
                      onClick={() => toggleFeedback(option)}
                    >
                      {option}
                    </Button>
                ))}
              </div>
               <Textarea id="comment-textarea" placeholder="Add a comment..."/>
            </>
          )}
          <Button className="w-full h-14 text-lg" onClick={handleSubmit}>
            Submit Rating
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
