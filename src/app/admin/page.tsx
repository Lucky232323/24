'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LayoutDashboard, Loader2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Screen, User } from '@/lib/types';
import { useFirebase } from '@/firebase'; // Import Firebase hooks
import { signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth'; // Import Auth functions
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

type AdminLoginPageProps = {
  navigateTo: (screen: Screen) => void;
  onLoginSuccess: (user: User, firebaseUser: FirebaseUser) => void;
};

export default function AdminLoginPage({ navigateTo, onLoginSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Use the Firebase hook to get auth and firestore instances
  const { auth, firestore } = useFirebase();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) {
      toast({ variant: 'destructive', title: "System Error", description: "Firebase is not initialized." });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Authenticate with Email/Password (Firebase Auth)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Verify Role in Firestore (Security Check)
      // We check if a document exists in 'adminProfiles' with this User's UID
      const adminDocRef = doc(firestore, 'adminProfiles', firebaseUser.uid);
      const adminDocSnap = await getDoc(adminDocRef);

      if (adminDocSnap.exists()) {
        // --- SUCCESS ---
        const adminData = adminDocSnap.data();

        toast({
          title: "Welcome, Admin",
          description: "Access granted to dashboard."
        });

        // Create the App User object
        const appUser: User = {
          name: adminData.name || "Admin",
          email: adminData.email || email,
          phone: adminData.phone || "",
          gender: 'other' // Admins don't rigidly need gender
        };

        onLoginSuccess(appUser, firebaseUser);

      } else {
        // --- ACCESS DENIED ---
        // User exists in Auth, but is NOT an Admin in Firestore
        await signOut(auth); // Immediately log them out
        toast({
          variant: 'destructive',
          title: "Access Denied",
          description: "You do not have administrative privileges."
        });
      }

    } catch (error: any) {
      console.error("Admin Login Error:", error);
      let msg = "Login failed.";
      if (error.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      if (error.code === 'auth/user-not-found') msg = "No admin account found.";
      if (error.code === 'auth/wrong-password') msg = "Incorrect password.";

      toast({
        variant: 'destructive',
        title: "Login Failed",
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm shadow-2xl border-t-4 border-t-blue-600">
        <form onSubmit={handleAdminLogin}>
          <CardHeader className="relative items-center text-center pt-10">
            <Button variant="ghost" size="icon" onClick={() => navigateTo('role-selection')} className="absolute top-4 left-4" type="button">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mb-2">
              <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="pt-2 text-2xl">Admin Portal</CardTitle>
            <CardDescription>Secure access for management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-4">

            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md flex gap-3 items-start text-xs text-blue-700 dark:text-blue-300">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p>This area is restricted. All login attempts are logged for security purposes.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@rapido.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 p-6">
            <Button type="submit" className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : 'Authenticate'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
