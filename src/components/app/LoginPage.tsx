'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { User, Screen } from '@/lib/types';
import { ArrowLeft, Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Update prop type to accept role
type LoginPageProps = {
  onLoginSuccess: (user: User, firebaseUser: FirebaseUser, role?: 'rider' | 'captain' | 'admin') => void;
  navigateTo: (screen: Screen) => void;
};

export default function LoginPage({ onLoginSuccess, navigateTo }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const { toast } = useToast();
  const { auth, firestore } = useFirebase();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    setIsSubmitting(true);

    try {
      let userToUse: FirebaseUser;

      if (isSignUp) {
        // --- SIGN UP FLOW ---
        if (!name || !email || !password || !gender) {
          throw new Error("Please fill in all required fields (Name, Email, Password, Gender).");
        }

        // 1. Create Auth User
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        userToUse = credential.user;

        // 2. Update Display Name
        await updateProfile(userToUse, { displayName: name });

        // 3. Create Firestore Profile
        const newUser: User = { name, email, phone: phone || '', gender: gender as any };
        await setDoc(doc(firestore, "userProfiles", userToUse.uid), {
          id: userToUse.uid,
          name,
          email,
          phoneNumber: phone || '',
          gender,
          createdAt: new Date().toISOString(),
          isRider: true
        });

        toast({ title: "Account Created! 🎉", description: "Welcome to the family." });
        onLoginSuccess(newUser, userToUse, 'rider');

      } else {
        // --- LOGIN FLOW ---
        if (!email || !password) throw new Error("Please enter email and password.");

        const credential = await signInWithEmailAndPassword(auth, email, password);
        userToUse = credential.user;

        // Fetch Profile
        const userDoc = await getDoc(doc(firestore, 'userProfiles', userToUse.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data() as any;
          onLoginSuccess({
            name: userData.name || userToUse.displayName || 'User',
            email: userData.email || userToUse.email || '',
            phone: userData.phoneNumber || '',
            gender: userData.gender || ''
          }, userToUse, 'rider');
          toast({ title: "Welcome back!", description: `Good to see you, ${userData.name || 'Rider'}` });
        } else {
          // Fallback for older users or missing profiles
          toast({ title: "Profile Missing", description: "Please update your profile in settings." });
          onLoginSuccess({ name: userToUse.displayName || 'User', email: userToUse.email || '', phone: '' }, userToUse, 'rider');
        }
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      let msg = "Something went wrong.";

      // Detailed Error Handling
      if (error.code === 'auth/email-already-in-use') msg = "That email is already registered.";
      else if (error.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      else if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      else if (error.code === 'auth/network-request-failed') msg = "Network error. Check your connection.";
      else if (error.code === 'auth/operation-not-allowed') msg = "Email/Password login is not enabled in Firebase.";
      else if (error.message) msg = error.message;

      toast({ variant: 'destructive', title: "Login Error", description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ variant: 'destructive', title: "Email Required", description: "Please enter your email address first." });
      return;
    }
    if (!auth) return;
    setForgotPasswordLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Email Sent", description: "Check your inbox for password reset instructions." });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Error", description: err.message });
    } finally {
      setForgotPasswordLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="flex items-center p-4 bg-primary text-primary-foreground shadow-md sticky top-0 z-10 transition-all">
        <Button variant="ghost" size="icon" onClick={() => navigateTo('role-selection')} className="mr-2 hover:bg-primary/80 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">Rider Login</h1>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-purple-600 w-full" />

          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-primary">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-base">
              {isSignUp ? "Join us to start riding instantly" : "Enter your credentials to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleAuth} className="space-y-4">

              {/* --- SIGN UP FIELDS --- */}
              {isSignUp && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="pl-9 h-11" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone (Optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="tel" placeholder="987..." value={phone} onChange={e => setPhone(e.target.value)} className="pl-9 h-11" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup onValueChange={setGender} value={gender} className="flex gap-2">
                      <div className="flex items-center space-x-2 border p-2 rounded-lg flex-1 justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer font-medium">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-2 rounded-lg flex-1 justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer font-medium">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* --- COMMON FIELDS --- */}
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-9 h-12 text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label>Password</Label>
                  {!isSignUp && (
                    <button type="button" onClick={handleForgotPassword} disabled={forgotPasswordLoading} className="text-xs text-primary font-semibold hover:underline bg-transparent border-0 p-0 h-auto">
                      {forgotPasswordLoading ? "Sending..." : "Forgot Password?"}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-9 pr-9 h-12 text-base"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg mt-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  isSignUp ? "Create Account & Ride" : "Login"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <Button
                  variant="link"
                  className="font-bold text-base ml-1 text-primary p-0 h-auto"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Login here" : "Sign up here"}
                </Button>
              </p>
            </div>

          </CardContent>

          <CardFooter className="justify-center pb-6 bg-slate-50/50 dark:bg-slate-900/50 pt-4">
            <p className="text-xs text-muted-foreground text-center px-8">
              By {isSignUp ? "signing up" : "logging in"}, you verify that you are 18+ and agree to our <span className="underline cursor-pointer hover:text-primary">Terms</span>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
