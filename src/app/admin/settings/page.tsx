'use client';
import { useState, useEffect } from 'react';
import type { User, Screen } from '@/lib/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Save, Settings as SettingsIcon, Shield } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

type AdminSettingsPageProps = {
  user: User | null;
  onLogout: () => void;
  navigateTo: (screen: Screen) => void;
  currentScreen: Screen;
};

export default function AdminSettingsPage({ user, onLogout, navigateTo, currentScreen }: AdminSettingsPageProps) {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    baseFare: 40,
    perKmRate: 12,
    platformFee: 5, // Percentage
    maintenanceMode: false,
    autoApproveCaptains: false,
    supportPhone: '+91 99999 99999'
  });

  useEffect(() => {
    if (!firestore) return;
    const fetchConfig = async () => {
      try {
        const docRef = doc(firestore, 'config', 'platform');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setConfig(snap.data() as any);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchConfig();
  }, [firestore]);

  const handleSave = async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      // Convert numeric strings to numbers if necessary, though Input type='number' passes strings usually
      const dataToSave = {
        ...config,
        baseFare: Number(config.baseFare),
        perKmRate: Number(config.perKmRate),
        platformFee: Number(config.platformFee)
      };

      await setDoc(doc(firestore, 'config', 'platform'), dataToSave);
      toast({ title: "Settings Saved", description: "Platform configuration updated successfully." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Error", description: "Failed to save settings." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout user={user} onLogout={onLogout} navigateTo={navigateTo} currentScreen={currentScreen}>
      <div className="p-4 md:p-8 max-w-[1000px] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Manage global application configuration and parameters.</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><SettingsIcon className="h-5 w-5" /> Pricing Configuration</CardTitle>
              <CardDescription>Set the baseline pricing model for all rides.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Base Fare (₹)</Label>
                  <Input type="number" value={config.baseFare} onChange={e => setConfig({ ...config, baseFare: Number(e.target.value) })} />
                  <p className="text-xs text-muted-foreground">Minimum charge per ride</p>
                </div>
                <div className="space-y-2">
                  <Label>Per KM Rate (₹)</Label>
                  <Input type="number" value={config.perKmRate} onChange={e => setConfig({ ...config, perKmRate: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Platform Fee (%)</Label>
                  <Input type="number" value={config.platformFee} onChange={e => setConfig({ ...config, platformFee: Number(e.target.value) })} />
                  <p className="text-xs text-muted-foreground">Commission deducted from captains</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Operations & Security</CardTitle>
              <CardDescription>Control system access and workflows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Approve Captains</Label>
                  <p className="text-sm text-muted-foreground">Automatically verify new captain registrations (Not recommended)</p>
                </div>
                <Switch checked={config.autoApproveCaptains} onCheckedChange={(c) => setConfig({ ...config, autoApproveCaptains: c })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-red-600">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Disable all app access for users (Admin only)</p>
                </div>
                <Switch checked={config.maintenanceMode} onCheckedChange={(c) => setConfig({ ...config, maintenanceMode: c })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-w-md">
                <Label>Support Helpline</Label>
                <Input value={config.supportPhone} onChange={e => setConfig({ ...config, supportPhone: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
