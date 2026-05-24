
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ShieldCheck, TrendingUp, Calendar } from "lucide-react";
import { MoodAnalysisChart } from "@/components/sections/mood-analysis-chart";
import { JournalInsights } from "@/components/sections/journal-insights";
import { formatDistanceToNow } from "date-fns";

interface MoodEntry {
    id: string;
    userId: string;
    moodScore: number;
    moodEmoji: string;
    timestamp: any;
}

interface ScreeningResult {
    id: string;
    phq9Score: number;
    gad7Score: number;
    triageLevel: string;
    timestamp: any;
}

interface StickyNote {
    id: string;
    userId: string;
    content: string;
    createdAt: any;
}

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();
    const db = useFirestore();

    const moodQuery = useMemoFirebase(() =>
        user && db ? query(collection(db, `users/${user.uid}/moodEntries`), orderBy("timestamp", "desc"), limit(30)) : null
    , [user, db]);
    const { data: moodEntries, isLoading: moodLoading } = useCollection<MoodEntry>(moodQuery);

    const screeningQuery = useMemoFirebase(() =>
        user && db ? query(collection(db, `users/${user.uid}/screeningResults`), orderBy("timestamp", "desc"), limit(5)) : null
    , [user, db]);
    const { data: screeningResults, isLoading: screeningLoading } = useCollection<ScreeningResult>(screeningQuery);

    const notesQuery = useMemoFirebase(() =>
        user && db ? query(collection(db, `users/${user.uid}/stickyNotes`), orderBy("createdAt", "desc"), limit(10)) : null
    , [user, db]);
    const { data: stickyNotes, isLoading: notesLoading } = useCollection<StickyNote>(notesQuery);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-accent" />
            </div>
        );
    }

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    const latestScreening = screeningResults?.[0];

    return (
        <section className="container py-12 md:py-24">
            <Card className="max-w-6xl mx-auto glass border-white/5 rounded-[3rem] overflow-hidden">
                <CardHeader className="text-center bg-accent/5 p-12">
                    <Avatar className="mx-auto h-32 w-32 mb-6 border-4 border-accent shadow-2xl">
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                        <AvatarFallback className="text-4xl">
                            {getInitials(user.displayName)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-5xl font-headline font-bold">{user.displayName ?? 'Welcome!'}</CardTitle>
                    <CardDescription className="text-xl font-light mt-2">{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 md:p-14 space-y-12">
                    
                    {/* Clinical Summary Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-accent/10 border-none rounded-[2rem] p-8 flex items-center gap-6">
                            <ShieldCheck className="h-12 w-12 text-accent" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Clinical Status</p>
                                <p className="text-xl font-headline font-bold">{latestScreening ? latestScreening.triageLevel.charAt(0).toUpperCase() + latestScreening.triageLevel.slice(1) : 'No Data'}</p>
                            </div>
                        </Card>
                        <Card className="glass border-white/5 rounded-[2rem] p-8 flex items-center gap-6">
                            <TrendingUp className="h-12 w-12 text-accent" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Mood Avg</p>
                                <p className="text-xl font-headline font-bold">
                                    {moodEntries && moodEntries.length > 0 
                                        ? Math.round(moodEntries.reduce((a, b) => a + b.moodScore, 0) / moodEntries.length) 
                                        : '--'}%
                                </p>
                            </div>
                        </Card>
                        <Card className="glass border-white/5 rounded-[2rem] p-8 flex items-center gap-6">
                            <Calendar className="h-12 w-12 text-accent" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Last Screen</p>
                                <p className="text-xl font-headline font-bold">
                                    {latestScreening?.timestamp?.seconds 
                                        ? formatDistanceToNow(new Date(latestScreening.timestamp.seconds * 1000), { addSuffix: true })
                                        : 'Never'}
                                </p>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                         <MoodAnalysisChart data={moodEntries} isLoading={moodLoading} />
                         <JournalInsights data={stickyNotes} isLoading={notesLoading} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-t border-white/5 pt-12">
                        <div>
                            <h3 className="text-3xl font-headline font-bold mb-4">Deepen Your Journey</h3>
                            <p className="text-muted-foreground text-lg font-light leading-relaxed">
                                Use our scientific screening tool to track clinical symptoms, or dive into the restoration suite for immediate relief.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="h-16 flex-1 rounded-2xl bg-accent text-lg font-bold">
                                <Link href="/intake">Start Clinical Screen</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-16 flex-1 rounded-2xl text-lg font-bold">
                                <Link href="/tools">Go to Healing Tools</Link>
                            </Button>
                        </div>
                    </div>

                     <div className="text-center pt-8">
                        <Button variant="ghost" className="text-muted-foreground hover:text-red-400" onClick={() => auth?.signOut()}>
                            Logout from Sanctuary
                        </Button>
                     </div>
                </CardContent>
            </Card>
        </section>
    );
}
