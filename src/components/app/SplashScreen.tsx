import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bike } from 'lucide-react';

export default function SplashScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-primary">
            <div className="flex flex-col items-center">
                <div className="bg-foreground rounded-full p-6 flex items-center justify-center mb-6 shadow-lg">
                    <Bike className="h-20 w-20 text-primary" />
                </div>
                <h1 className="text-5xl font-extrabold text-foreground tracking-tight">RIDER APP</h1>
                <p className="text-foreground/80 mt-2 text-lg">Fast. Affordable. Safe.</p>
            </div>
        </div>
    );
}
