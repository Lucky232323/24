'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { Screen } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type CaptainDocumentsPageProps = {
    navigateTo: (screen: Screen) => void;
    onDocumentsComplete: () => void;
};

export default function CaptainDocumentsPage({ navigateTo, onDocumentsComplete }: CaptainDocumentsPageProps) {
    const [dlFile, setDlFile] = useState<File | null>(null);
    const [rcFile, setRcFile] = useState<File | null>(null);
    const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dlFile || !rcFile || !aadhaarFile) {
            toast({
                variant: 'destructive',
                title: "Missing Documents",
                description: "Please upload all required documents to proceed."
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate upload delay
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Documents Verified",
                description: "Your documents have been successfully verified."
            });
            onDocumentsComplete();
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            <header className="flex items-center p-4 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => navigateTo('captain-login')} className="mr-2">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-lg font-bold">Captain Verification</h1>
            </header>

            <div className="flex-grow p-4 md:p-8 flex items-center justify-center">
                <Card className="w-full max-w-lg shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-yellow-500" />
                            Upload Documents
                        </CardTitle>
                        <CardDescription>
                            We need to verify your details before you can start riding.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Driving License */}
                        <div className="space-y-2">
                            <Label>Driving License (Front & Back)</Label>
                            <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${dlFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-300'}`}>
                                <input type="file" className="hidden" id="dl-upload" onChange={(e) => handleFileChange(e, setDlFile)} accept="image/*,.pdf" />
                                <label htmlFor="dl-upload" className="flex flex-col items-center cursor-pointer w-full h-full">
                                    {dlFile ? (
                                        <>
                                            <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-400">{dlFile.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                            <span className="text-sm text-slate-500">Tap to upload / Drag & drop</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* RC Book */}
                        <div className="space-y-2">
                            <Label>Vehicle RC</Label>
                            <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${rcFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-300'}`}>
                                <input type="file" className="hidden" id="rc-upload" onChange={(e) => handleFileChange(e, setRcFile)} accept="image/*,.pdf" />
                                <label htmlFor="rc-upload" className="flex flex-col items-center cursor-pointer w-full h-full">
                                    {rcFile ? (
                                        <>
                                            <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-400">{rcFile.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                            <span className="text-sm text-slate-500">Tap to upload / Drag & drop</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Aadhaar Card */}
                        <div className="space-y-2">
                            <Label>Aadhaar Card</Label>
                            <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${aadhaarFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-300'}`}>
                                <input type="file" className="hidden" id="aadhaar-upload" onChange={(e) => handleFileChange(e, setAadhaarFile)} accept="image/*,.pdf" />
                                <label htmlFor="aadhaar-upload" className="flex flex-col items-center cursor-pointer w-full h-full">
                                    {aadhaarFile ? (
                                        <>
                                            <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-400">{aadhaarFile.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                            <span className="text-sm text-slate-500">Tap to upload / Drag & drop</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button className="w-full h-12 text-lg bg-yellow-500 text-black hover:bg-yellow-400 font-bold" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                                </>
                            ) : (
                                "Submit & Continue"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
