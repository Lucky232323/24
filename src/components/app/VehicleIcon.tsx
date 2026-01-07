'use client';
import { Car, Bike } from 'lucide-react';
import type { Service } from '@/lib/types';

const AutoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 17h2v-5h-4V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7h2" />
    <path d="m12 17-2.12 2.12" />
    <path d="M10 17H2" />
    <circle cx="17" cy="17" r="2" />
    <circle cx="5" cy="17" r="2" />
  </svg>
);


type VehicleIconProps = {
  service: Service['id'];
  className?: string;
};

export default function VehicleIcon({ service, className }: VehicleIconProps) {
  const iconProps = {
    className: `h-5 w-5 text-primary-foreground`
  };

  const wrapperClass = `h-10 w-10 flex items-center justify-center bg-primary text-primary-foreground p-1.5 rounded-md ${className}`
  
  switch (service) {
    case 'Bike':
      return <div className={wrapperClass}><Bike {...iconProps} /></div>;
    case 'Auto':
      return <div className={wrapperClass}><AutoIcon {...iconProps} /></div>;
    case 'Cab':
      return <div className={wrapperClass}><Car {...iconProps} /></div>;
    default:
      return null;
  }
}
