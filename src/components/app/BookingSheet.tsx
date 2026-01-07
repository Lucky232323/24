'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ChevronRight, Tag, Wallet, Clock, Package } from 'lucide-react';
import type { Service, Screen } from '@/lib/types';
import VehicleIcon from './VehicleIcon';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useState } from 'react';
import Image from 'next/image';

type BookingSheetProps = {
    pickup: string;
    destination: string;
    selectedService: Service['id'];
    onServiceSelect: (serviceId: Service['id']) => void;
    onBack: () => void;
    onBook: (service: Service['id'], details?: any) => void;
    navigateTo: (screen: Screen) => void;
};

const serviceOptions: Service[] = [
    { id: 'Bike', name: 'Bike', description: 'Quickest way to travel', eta: 5, fare: 75 },
    { id: 'Auto', name: 'Auto', description: 'Economical & spacious', eta: 7, fare: 120 },
    { id: 'Cab', name: 'Cab', description: 'Comfortable & private', eta: 8, fare: 180 },
];

const paymentMethods = [
    { id: 'cash', name: 'Cash' },
    { id: 'wallet', name: 'RIDER APP Wallet', balance: 150 },
    { id: 'gpay', name: 'GPay' },
];

const offers = [
    { code: 'WELCOME50', description: 'Get 50% off up to ₹100 on your first ride.' },
    { code: 'AUTO30', description: 'Flat ₹30 off on Auto rides.' },
    { code: 'TRYNEW', description: '20% off on your first Cab ride.' },
    { code: 'EARLY', description: 'Save ₹15 on rides before 10 AM.' },
];

const rentalPackages = [
    { id: '1hr', name: '1 Hr / 10 km', fare: 150 },
    { id: '2hr', name: '2 Hr / 20 km', fare: 280 },
    { id: '4hr', name: '4 Hr / 40 km', fare: 550 },
    { id: '8hr', name: '8 Hr / 80 km', fare: 1000 },
];

export default function BookingSheet({ pickup, destination, selectedService, onServiceSelect, onBack, onBook, navigateTo }: BookingSheetProps) {
    const [selectedPayment, setSelectedPayment] = useState('cash');
    const [appliedOffer, setAppliedOffer] = useState<string | null>(null);
    const [bookingMode, setBookingMode] = useState<'daily' | 'rentals' | 'parcel'>('daily');
    const [selectedPackage, setSelectedPackage] = useState(rentalPackages[0].id);

    const selectedFare = bookingMode === 'rentals'
        ? rentalPackages.find(p => p.id === selectedPackage)?.fare
        : serviceOptions.find(s => s.id === selectedService)?.fare;

    const paymentMethodName = paymentMethods.find(p => p.id === selectedPayment)?.name || 'Cash';

    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');

    const handleBookClick = () => {
        const details = {
            bookingMode,
            rentalPackage: bookingMode === 'rentals' ? rentalPackages.find(p => p.id === selectedPackage) : null,
            receiverName: bookingMode === 'parcel' ? receiverName : null,
            receiverPhone: bookingMode === 'parcel' ? receiverPhone : null,
            fare: selectedFare
        };
        onBook(selectedService, details);
    }

    return (
        <div className="absolute bottom-0 left-0 right-0 z-30">
            <Card className="rounded-t-2xl rounded-b-none shadow-2xl bg-background">
                <CardContent className="p-4 space-y-4">
                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-secondary rounded-xl mb-2">
                        {['daily', 'rentals', 'parcel'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setBookingMode(mode as any)}
                                className={`flex-1 py-1.5 text-sm font-semibold rounded-lg capitalize transition-all ${bookingMode === mode ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* Location Header */}
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                            <ArrowLeft />
                        </Button>
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-500/30"></div>
                                <p className="font-medium text-sm truncate">{pickup}</p>
                            </div>
                            {bookingMode !== 'rentals' && (
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-500/30"></div>
                                    <p className="font-medium text-sm truncate">{bookingMode === 'parcel' ? 'Receiver Location (Select)' : destination}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DAILY Content */}
                    {bookingMode === 'daily' && (
                        <div className="space-y-3">
                            {serviceOptions.map(service => (
                                <Card
                                    key={service.id}
                                    className={`flex items-center p-3 gap-4 cursor-pointer transition-all border-2 ${selectedService === service.id ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                                    onClick={() => onServiceSelect(service.id)}
                                >
                                    <VehicleIcon service={service.id} className="h-10 w-10 p-1" />
                                    <div className="flex-1">
                                        <h3 className="font-bold">{service.name}</h3>
                                        <p className="text-xs text-muted-foreground">{service.description}, ~{service.eta} min</p>
                                    </div>
                                    <p className="font-bold text-base">₹{service.fare}</p>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* RENTALS Content */}
                    {bookingMode === 'rentals' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                {rentalPackages.map(pkg => (
                                    <Card
                                        key={pkg.id}
                                        className={`p-3 cursor-pointer transition-all border-2 text-center ${selectedPackage === pkg.id ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                                        onClick={() => setSelectedPackage(pkg.id)}
                                    >
                                        <Clock className="w-6 h-6 mx-auto text-primary mb-2" />
                                        <h3 className="font-bold text-sm">{pkg.name}</h3>
                                        <p className="font-bold text-lg mt-1">₹{pkg.fare}</p>
                                    </Card>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground text-center">Fuel included. Extra km fare applies.</p>
                        </div>
                    )}

                    {/* PARCEL Content */}
                    {bookingMode === 'parcel' && (
                        <div className="space-y-3 p-2">
                            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                                <Package className="w-8 h-8 text-orange-500" />
                                <div>
                                    <h3 className="font-bold text-sm">Send a Package</h3>
                                    <p className="text-xs text-muted-foreground">Door-to-door delivery</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Receiver Name</Label>
                                <Input
                                    placeholder="Enter name"
                                    className="h-10"
                                    value={receiverName}
                                    onChange={(e) => setReceiverName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Receiver Phone</Label>
                                <Input
                                    placeholder="Enter phone number"
                                    className="h-10"
                                    value={receiverPhone}
                                    onChange={(e) => setReceiverPhone(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        {/* Payment Method Sheet */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="h-11 justify-between text-left font-normal">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="h-4 w-4" />
                                        <span className="truncate">{paymentMethodName}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-2xl">
                                <SheetHeader>
                                    <SheetTitle>Select a payment method</SheetTitle>
                                </SheetHeader>
                                <div className="py-4">
                                    <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="space-y-3">
                                        {paymentMethods.map(method => (
                                            <Label key={method.id} htmlFor={method.id} className="flex items-center p-4 border rounded-md cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                                                <RadioGroupItem value={method.id} id={method.id} />
                                                <span className="ml-4 font-medium">{method.name}</span>
                                                {method.balance !== undefined && <span className="ml-auto text-sm text-muted-foreground">₹{method.balance}</span>}
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                    <SheetClose asChild>
                                        <Button className="w-full mt-6 h-12">Confirm</Button>
                                    </SheetClose>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Offers Sheet */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="h-11 border-dashed border-primary/50 text-primary bg-primary/5 hover:bg-primary/10">
                                    <Tag className="mr-2 h-4 w-4" />
                                    <span className="font-medium truncate">{appliedOffer ? appliedOffer : 'Offers'}</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-2xl">
                                <SheetHeader>
                                    <SheetTitle>Apply Coupon</SheetTitle>
                                </SheetHeader>
                                <div className="py-4 space-y-4">
                                    <div className="flex gap-2">
                                        <Input placeholder="Enter coupon code" className="h-12" />
                                        <Button className="h-12">Apply</Button>
                                    </div>
                                    <Separator />
                                    <div className="space-y-3">
                                        {offers.map(offer => (
                                            <Card key={offer.code} className="p-4 border-dashed hover:border-primary transition-colors cursor-pointer" onClick={() => setAppliedOffer(offer.code)}>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{offer.code}</span>
                                                        </div>
                                                        <p className="text-sm text-foreground/80">{offer.description}</p>
                                                    </div>
                                                    <SheetClose asChild>
                                                        <Button variant="ghost" size="sm" className="text-primary font-bold hover:text-primary hover:bg-primary/10">
                                                            APPLY
                                                        </Button>
                                                    </SheetClose>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Button className="w-full h-12 text-base shadow-lg shadow-primary/20" onClick={handleBookClick}>
                        {bookingMode === 'parcel' ? 'Proceed to Parcel Details' : `Book ${selectedService === 'Bike' && bookingMode === 'rentals' ? 'Bike Rental' : selectedService} (₹${selectedFare})`}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
