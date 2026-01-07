'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { User, Screen } from '@/lib/types';
import { ArrowLeft, Shield, Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type CaptainLoginPageProps = {
  onLoginSuccess: (user: User, firebaseUser: FirebaseUser) => void;
  navigateTo: (screen: Screen) => void;
  onDetailsComplete: () => void;
};

export default function CaptainLoginPage({ onLoginSuccess, navigateTo, onDetailsComplete }: CaptainLoginPageProps) {
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
        if (!name || !email || !password || !gender || !phone) {
          throw new Error("All fields are required for Captain Registration.");
        }

        // 1. Create Auth User
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        userToUse = credential.user;

        // 2. Update Display Name
        await updateProfile(userToUse, { displayName: name });

        // 3. Create Captain Profile
        // Note: Status is 'approved' for demo, 'pending' for real apps
        const newCaptainData = {
          id: userToUse.uid,
          name,
          email,
          phoneNumber: phone, // Phone is mandatory for captains usually
          gender,
          status: 'approved',
          vehicleType: 'Bike', // Default, will change in vehicle selection
          isOnline: false,
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(firestore, "captainProfiles", userToUse.uid), newCaptainData);

        toast({ title: "Welcome Captain! 🫡", description: "Let's set up your vehicle." });

        // Pass minimal user object and trigger next steps
        const userObj: User = { name, email, phone, gender: gender as any };
        onLoginSuccess(userObj, userToUse);
        onDetailsComplete(); // Move to vehicle selection

      } else {
        // --- LOGIN FLOW ---
        if (!email || !password) throw new Error("Please enter email and password.");

        const credential = await signInWithEmailAndPassword(auth, email, password);
        userToUse = credential.user;

        // Fetch Profile
        const captainDoc = await getDoc(doc(firestore, 'captainProfiles', userToUse.uid));

        if (captainDoc.exists()) {
          const data = captainDoc.data() as any;

          if (data.status === 'blocked') throw new Error("Your account has been blocked.");
          // if (data.status === 'pending') ... logic for pending

          onLoginSuccess({
            name: data.name,
            email: data.email,
            phone: data.phoneNumber,
            gender: data.gender
          }, userToUse);

          toast({ title: "Welcome back, Captain!", description: "Ready to take rides?" });
        } else {
          // Fallback / Error
          toast({ variant: 'destructive', title: "No Captain Profile Found", description: "This email is not registered as a Captain." });
        }
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      let msg = error.message;
      if (error.code === 'auth/email-already-in-use') msg = "Email already registered.";
      if (error.code === 'auth/invalid-credential') msg = "Invalid credentials.";
      toast({ variant: 'destructive', title: "Login Failed", description: msg });
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
      toast({ title: "Check your email", description: "Password reset link sent." });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Error", description: err.message });
    } finally {
      setForgotPasswordLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <header className="flex items-center p-4 bg-transparent absolute top-0 w-full z-10">
        <Button variant="ghost" size="icon" onClick={() => navigateTo('role-selection')} className="mr-2 hover:bg-white/10 text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl rounded-bl-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>

        <Card className="w-full max-w-md border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl relative z-10">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-2xl shadow-lg mb-4 w-16 h-16 flex items-center justify-center">
              <Shield className="h-8 w-8 text-black" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              {isSignUp ? "Join as Captain" : "Captain Login"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {isSignUp ? "Earn on your own schedule" : "Manage rides and earnings"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <form onSubmit={handleAuth} className="space-y-4">

              {/* --- SIGN UP FIELDS --- */}
              {isSignUp && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="pl-9 bg-slate-900 border-slate-800 text-white" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Mobile Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input type="tel" placeholder="987..." value={phone} onChange={e => setPhone(e.target.value)} className="pl-9 bg-slate-900 border-slate-800 text-white" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Gender</Label>
                      <RadioGroup onValueChange={setGender} value={gender} className="flex gap-2 pt-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-slate-700 cursor-pointer has-[:checked]:bg-yellow-500 has-[:checked]:text-black transition-colors">
                          <RadioGroupItem value="male" id="cm" className="sr-only" />
                          <Label htmlFor="cm" className="cursor-pointer text-xs font-bold">M</Label>
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-slate-700 cursor-pointer has-[:checked]:bg-yellow-500 has-[:checked]:text-black transition-colors">
                          <RadioGroupItem value="female" id="cf" className="sr-only" />
                          <Label htmlFor="cf" className="cursor-pointer text-xs font-bold">F</Label>
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-slate-700 cursor-pointer has-[:checked]:bg-yellow-500 has-[:checked]:text-black transition-colors">
                          <RadioGroupItem value="other" id="co" className="sr-only" />
                          <Label htmlFor="co" className="cursor-pointer text-xs font-bold">O</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* --- COMMON FIELDS --- */}
              <div className="space-y-2">
                <Label className="text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="captain@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-300">Password</Label>
                  {!isSignUp && (
                    <button type="button" onClick={handleForgotPassword} disabled={forgotPasswordLoading} className="text-xs text-yellow-500 hover:text-yellow-400 font-semibold hover:underline bg-transparent border-0 p-0 h-auto">
                      {forgotPasswordLoading ? "Sending..." : "Forgot Password?"}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-9 pr-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-yellow-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg mt-4 bg-yellow-500 text-black hover:bg-yellow-400" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  isSignUp ? "Register & Start Driving" : "Login to Dashboard"
                )}
              </Button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-400">
                {isSignUp ? "Have a Captain account?" : "New to driving with us?"}
                <Button
                  variant="link"
                  className="font-bold text-base ml-1 text-white hover:text-yellow-400 p-0 h-auto"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Login" : "Register"}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
