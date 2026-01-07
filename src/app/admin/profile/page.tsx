'use client';

import { useState } from 'react';
import type { User, Screen } from '@/lib/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Mail, Phone, Shield } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type AdminProfilePageProps = {
    user: User | null;
    onLogout: () => void;
    navigateTo: (screen: Screen) => void;
    currentScreen: Screen;
};

export default function AdminProfilePage({ user, onLogout, navigateTo, currentScreen }: AdminProfilePageProps) {
    const { firestore, user: authUser } = useFirebase();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Local state for editing - usually you'd verify password before sensitive changes
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    const handleUpdate = async () => {
        if (!firestore || !authUser) return;
        setLoading(true);
        try {
            const userRef = doc(firestore, 'adminProfiles', authUser.uid);
            await updateDoc(userRef, {
                name: formData.name,
                phone: formData.phone
            });
            toast({ title: "Profile Updated", description: "Your details have been saved." });
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Update Failed", description: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout user={user} onLogout={onLogout} navigateTo={navigateTo} currentScreen={currentScreen}>
            <div className="p-4 md:p-8 max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">Manage your administrative account details.</p>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                            <AvatarFallback className="text-2xl bg-blue-600 text-white">{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-xl">{user?.name || 'Administrator'}</CardTitle>
                            <CardDescription className="flex items-center gap-1"><Shield className="h-3 w-3" /> Super Admin Access</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input id="name" className="pl-9" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input id="email" className="pl-9 bg-muted" value={formData.email} disabled readOnly />
                            </div>
                            <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input id="phone" className="pl-9" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91..." />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button onClick={handleUpdate} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AdminLayout>
    );
}
