'use client';
import React from 'react';

export default function RadarPulse() {
    return (
        <div className="relative flex items-center justify-center w-full h-64 overflow-hidden bg-primary/5 rounded-xl border border-primary/10">
            {/* Pulse Circles */}
            <div className="absolute w-24 h-24 bg-primary/20 rounded-full animate-ping opacity-75"></div>
            <div className="absolute w-24 h-24 bg-primary/10 rounded-full animate-ping delay-150"></div>
            <div className="absolute w-24 h-24 bg-primary/5 rounded-full animate-ping delay-300"></div>

            {/* Center Icon */}
            <div className="relative z-10 bg-background rounded-full p-4 shadow-lg border-2 border-primary">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                </div>
            </div>

            <div className="absolute bottom-8 text-primary font-semibold tracking-wider animate-pulse">
                SEARCHING NEARBY...
            </div>
        </div>
    );
}
