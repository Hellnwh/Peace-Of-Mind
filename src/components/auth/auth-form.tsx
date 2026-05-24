"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    updateProfile,
    getAdditionalUserInfo,
} from "firebase/auth";
import { doc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface AuthFormProps {
    mode: 'login' | 'signup';
}

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.3 109.8 11.8 244 11.8c70.3 0 129.8 27.8 174.4 72.4l-66.3 64.4c-21.3-20.2-49.8-32.4-82.1-32.4-60.3 0-109.3 49-109.3 109.3s49 109.3 109.3 109.3c53.2 0 92.4-22.3 100.8-51.8H244v-69.2h236.3c2.3 12.7 3.7 26.1 3.7 40.5z"></path>
    </svg>
);

export function AuthForm({ mode }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (!isUserLoading && user) {
            router.push('/profile');
        }
    }, [user, isUserLoading, router]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth || !db) return;
        
        setIsLoading(true);
        try {
            if (mode === 'signup') {
                if (displayName.trim() === '') {
                    toast({ variant: "destructive", title: "Validation Error", description: "Please enter a display name." });
                    setIsLoading(false);
                    return;
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName });

                const userProfileRef = doc(db, "users", userCredential.user.uid);
                const userProfileData = {
                    userId: userCredential.user.uid,
                    displayName: displayName,
                    email: userCredential.user.email,
                    phoneNumber: phoneNumber,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };
                setDocumentNonBlocking(userProfileRef, userProfileData, { merge: false });
                toast({ title: "Account Created!", description: "Welcome to PeaceMind Sanctuary." });
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                toast({ title: "Welcome Back!", description: "Logged in successfully." });
            }
        } catch (error: any) {
            let message = error.message;
            if (error.code === 'auth/email-already-in-use') message = "This email is already registered.";
            if (error.code === 'auth/invalid-credential') message = "Invalid email or password.";
            toast({ variant: "destructive", title: "Authentication Error", description: message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        if (!auth || !db) return;
        setIsGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const additionalInfo = getAdditionalUserInfo(result);
            
            if (additionalInfo?.isNewUser) {
                const user = result.user;
                const userProfileRef = doc(db, "users", user.uid);
                const userProfileData = {
                    userId: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    phoneNumber: user.phoneNumber || '',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };
                setDocumentNonBlocking(userProfileRef, userProfileData, { merge: false });
            }
            toast({ title: "Success!", description: "Logged in with Google." });
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                toast({ variant: "destructive", title: "Google Sign-In Error", description: error.message });
            }
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <section className="container py-12 md:py-24 flex justify-center">
            <Card className="w-full max-w-md shadow-2xl glass border-white/5">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</CardTitle>
                    <CardDescription>
                        {mode === 'login' 
                            ? 'Sign in to access your personal sanctuary.' 
                            : 'Join us to begin your healing journey.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {mode === 'signup' && (
                            <>
                                <div>
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input
                                        id="displayName"
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Your Name"
                                        required
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phoneNumber">Phone Number (for emergency support)</Label>
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+1234567890"
                                        required
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading || isGoogleLoading || isUserLoading}>
                            {(isLoading || isUserLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === 'login' ? 'Login' : 'Sign Up'}
                        </Button>
                    </form>
                    
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full glass border-white/10 hover:bg-white/5" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading || isUserLoading}>
                        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                        Google
                    </Button>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        {mode === 'login' ? (
                            <>
                                Don't have an account?{' '}
                                <Link href="/signup" className="underline hover:text-accent">Sign up</Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <Link href="/login" className="underline hover:text-accent">Login</Link>
                            </>
                        )}
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}
