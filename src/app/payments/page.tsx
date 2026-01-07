'use client';
import { useState } from 'react';
import Layout from '@/components/app/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Screen } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Wallet, Landmark, Tag, Ticket, ChevronRight, Circle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';

type PaymentsPageProps = {
  navigateTo: (screen: Screen) => void;
};

const AmazonPayIcon = () => (
    <svg width="40" height="24" viewBox="0 0 49 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.993 21.922h4.153v1.89H5.72V7.16h4.273v14.762z" fill="#000"></path>
        <path d="M21.19 22.06c2.618 0 4.23-1.428 4.23-3.692 0-2.22-1.57-3.623-4.13-3.623h-2.58v7.315h2.48zm-2.48-8.834h2.41c1.55 0 2.617.773 2.617 2.11 0 1.355-1.023 2.132-2.595 2.132h-2.432v-4.242z" fill="#000"></path>
        <path d="M43.08 7.16v16.73h-3.958L34.33 9.475l.182 14.415h-4.04V7.16h3.957l4.774 14.38.18-14.38h3.655v.025z" fill="#000"></path>
        <path d="M43.08 7.16v16.73h-3.958L34.33 9.475l.182 14.415h-4.04V7.16h3.957l4.774 14.38.18-14.38h3.655v.025z" fill="#FF9900"></path>
        <path d="M43.344 23.89c.14-.3.21-.6.21-.93v-1.89h1.76v1.9c0 .8-.26 1.43-.8 1.9-.53.47-1.25.7-2.15.7-.93 0-1.68-.23-2.24-.7-.56-.47-.85-1.1-.85-1.9v-1.9h1.76v1.89c0 .33.07.63.2.89.14.27.35.4.65.4.3 0 .5-.13.62-.4z" fill="#000"></path>
        <path d="M43.344 23.89c.14-.3.21-.6.21-.93v-1.89h1.76v1.9c0 .8-.26 1.43-.8 1.9-.53.47-1.25.7-2.15.7-.93 0-1.68-.23-2.24-.7-.56-.47-.85-1.1-.85-1.9v-1.9h1.76v1.89c0 .33.07.63.2.89.14.27.35.4.65.4.3 0 .5-.13.62-.4z" fill="#FF9900"></path>
    </svg>
)

const UpiIcon = () => (
    <svg width="40" height="24" viewBox="0 0 62 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.775 20.354V.948h5.922c1.871 0 3.327.429 4.368 1.287 1.04 0.858 1.56 2.052 1.56 3.582 0 1.23-.332 2.274-.994 3.132-0.662 0.858-1.576 1.47-2.742 1.836v.156c1.47.312 2.613 1.002 3.429 2.07 0.816 1.068 1.224 2.418 1.224 4.05 0 1.704-.546 3.036-1.638 3.996-1.092 0.96-2.613 1.44-4.563 1.44H3.775zm3.831-10.98c1.326 0 2.28-.195 2.862-.585 0.582-0.39 0.873-1.03 0.873-1.92 0-0.874-.273-1.524-.819-1.95-.546-0.429-1.443-0.643-2.691-0.643H6.42v5.1H7.606zm.063 8.19c1.625 0 2.829-.273 3.612-.819 0.783-0.546 1.175-1.411 1.175-2.583 0-1.14-.383-1.998-1.149-2.574-0.767-0.576-1.892-0.864-3.375-0.864H6.42v6.84h1.311v-0.001zM28.098 1.04h3.64V20.4H28.1V1.04zM36.19 1.04h15.933v3.024H39.83V9.22h11.4v3.023H39.83v5.254h12.3V20.4H36.19V1.04z" fill="url(#paint0_linear_1_2)"></path>
        <path d="M28.098 1.04h3.64V20.4H28.1V1.04z" fill="url(#paint1_linear_1_2)"></path>
        <path d="M36.19 1.04h15.933v3.024H39.83V9.22h11.4v3.023H39.83v5.254h12.3V20.4H36.19V1.04z" fill="url(#paint2_linear_1_2)"></path>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="32.595" y1="10.676" x2="32.595" y2="20.4" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F58721"></stop><stop offset="1" stopColor="#FCAF19"></stop>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="29.918" y1="10.72" x2="29.918" y2="20.4" gradientUnits="userSpaceOnUse">
                <stop stopColor="#254390"></stop><stop offset="1" stopColor="#0E9445"></stop>
            </linearGradient>
            <linearGradient id="paint2_linear_1_2" x1="44.156" y1="10.72" x2="44.156" y2="20.4" gradientUnits="userSpaceOnUse">
                <stop stopColor="#254390"></stop><stop offset="1" stopColor="#0E9445"></stop>
            </linearGradient>
        </defs>
    </svg>
)

const PaytmIcon = () => (
    <svg width="60" height="20" viewBox="0 0 91 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M90.87 23.366V8.625h-5.91L75.39 20.36v-11.72h-6.04V23.37h5.91L84.81 11.64v11.73h6.06z" fill="#002E6E"></path>
        <path d="M48.273 23.366h6.35c4.7 0 7.82-2.3 7.82-5.98 0-3.67-3.13-5.97-7.82-5.97h-6.35v11.95zm6.05-1.95h.3c2.72 0 4.1-1.22 4.1-4.02 0-2.8-1.38-4.02-4.1-4.02h-.3v8.04z" fill="#00B9F1"></path>
        <path d="M31.64 8.625h13.23v2.85H37.6v11.9h-5.96V8.625zM17.76 8.625h10.9v2.85h-4.94v3.13h4.42v2.84h-4.42v3.07h4.94v2.85h-10.9V8.625z" fill="#002E6E"></path>
        <path d="M.48 8.625h6.34c4.7 0 7.82 2.3 7.82 5.97s-3.13 5.97-7.82 5.97H.48V8.625zm6.05 11.9c2.72 0 4.1-1.21 4.1-4.01 0-2.8-1.38-4.02-4.1-4.02h-.3v8.03h.3z" fill="#00B9F1"></path>
    </svg>
)

export default function PaymentsPage({ navigateTo }: PaymentsPageProps) {
  const [selectedPayment, setSelectedPayment] = useState('rapido-wallet');

  return (
    <Layout title="Payments" navigateTo={navigateTo}>
      <div className="p-4 space-y-4 bg-secondary/30 flex-1">
        <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-lg font-semibold">Total Fare</h2>
            <p className="text-lg font-bold">₹125</p>
        </div>
        <div className="w-full border-t border-dashed border-muted-foreground/50 mb-6"></div>
        
        <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
            <h3 className="font-semibold text-muted-foreground px-2 mb-2">Wallets</h3>
            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Wallet className="h-6 w-6 text-primary" />
                            <div>
                                <p className="font-semibold">RIDER APP Wallet</p>
                                <p className="text-sm text-destructive">Low Balance: ₹0.0</p>
                            </div>
                        </div>
                        <RadioGroupItem value="rapido-wallet" id="rapido-wallet" />
                    </div>
                     <Button variant="outline" className="w-fit" onClick={() => navigateTo('wallet')}>+ Add Money</Button>
                </CardContent>
            </Card>

             <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AmazonPayIcon />
                        <p className="font-semibold">AmazonPay</p>
                    </div>
                    <Button variant="link" className="text-primary p-0 h-auto">LINK</Button>
                </CardContent>
                 <div className="border-t p-3 bg-secondary/50">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Ticket className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                        <p>Cashback behind scratch card upto rs.25, assured rs.5 | min order value of rs.39 | once per month</p>
                    </div>
                </div>
            </Card>

            <h3 className="font-semibold text-muted-foreground px-2 mb-2 mt-6">
                <div className="flex items-center gap-2">
                    <UpiIcon />
                    <span>Pay by any UPI app</span>
                </div>
            </h3>

             <Card>
                <CardContent className="p-0">
                    <div className="p-4">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <PaytmIcon />
                            </div>
                            <RadioGroupItem value="paytm" id="paytm" />
                        </div>
                    </div>
                     <div className="border-t p-3 bg-secondary/50">
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Ticket className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                            <p>Upto ₹200 Cashback | Min. Txn ₹49 | + 1% Gold Coins | 1-31 Dec'25 | Not valid for users transacting via Paytm in the past 60 days.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/100px-Google_Pay_Logo.svg.png" width={40} height={20} alt="GPay" />
                            <p className="font-semibold">GPay</p>
                        </div>
                        <RadioGroupItem value="gpay" id="gpay" />
                    </div>
                 </CardContent>
            </Card>
             <Card>
                 <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" width={100} height={20} alt="PhonePe" className="w-20"/>
                        </div>
                        <RadioGroupItem value="phonepe" id="phonepe" />
                    </div>
                 </CardContent>
            </Card>
             <Card>
                 <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Landmark className="h-6 w-6 text-primary"/>
                            <p className="font-semibold">Pay by any UPI app</p>
                        </div>
                        <Button variant="link" className="text-primary">CHOOSE</Button>
                    </div>
                 </CardContent>
            </Card>


            <h3 className="font-semibold text-muted-foreground px-2 mb-2 mt-6">Pay Later</h3>
            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Tag className="h-6 w-6 text-primary" />
                        <p className="font-semibold">Cash</p>
                    </div>
                    <RadioGroupItem value="cash" id="cash" />
                </CardContent>
            </Card>

        </RadioGroup>

      </div>
    </Layout>
  );
}
