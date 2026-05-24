
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { motion } from "framer-motion";
import { useMemo } from "react";

function CornerVeins({ sentimentHistory }: { sentimentHistory: ('positive' | 'negative' | 'neutral')[] }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden gpu-boost">
      <svg className="absolute -top-10 -left-10 w-[35rem] h-[35rem] opacity-40" viewBox="0 0 100 100">
        <motion.path
          d="M0 0 Q30 10 10 50 T40 100"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 6 }}
        />
        {sentimentHistory.map((s, i) => {
          const x = 5 + (i * 15) % 30;
          const y = 15 + i * 8;
          return (
            <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transform={`translate(${x}, ${y})`}>
              {s === 'negative' ? (
                <path d="M0,0 L1,-12 L2,0 Z" fill="rgba(255,80,80,0.7)" className="drop-shadow-[0_0_8px_rgba(255,0,0,0.4)]" />
              ) : s === 'positive' ? (
                <circle r="3.5" fill="rgba(112, 161, 175, 0.6)" className="drop-shadow-[0_0_10px_rgba(112,161,175,0.5)]" />
              ) : null}
            </motion.g>
          );
        })}
      </svg>

      <svg className="absolute -bottom-10 -right-10 w-[35rem] h-[35rem] opacity-40" viewBox="0 0 100 100">
        <motion.path
          d="M100 100 Q70 90 90 50 T60 0"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 6 }}
        />
        {sentimentHistory.slice(-15).map((s, i) => {
          const x = 95 - (i * 15) % 30;
          const y = 85 - i * 8;
          return (
            <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transform={`translate(${x}, ${y})`}>
              {s === 'negative' ? (
                <path d="M0,0 L-1,12 L-2,0 Z" fill="rgba(255,80,80,0.7)" />
              ) : s === 'positive' ? (
                <path d="M0,0 Q-4,-6 -8,0 T0,0" fill="rgba(112, 161, 175, 0.6)" />
              ) : null}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-abstract");
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  
  const moodQuery = useMemoFirebase(() => 
    user && db ? query(collection(db, `users/${user.uid}/moodEntries`), orderBy("timestamp", "desc"), limit(10)) : null
  , [user, db]);
  const { data: moodEntries } = useCollection(moodQuery);

  const sentimentHistory = useMemo(() => {
    if (!moodEntries) return [];
    return moodEntries.map(m => {
        if (m.moodScore > 70) return 'positive';
        if (m.moodScore < 40) return 'negative';
        return 'neutral';
    }) as ('positive' | 'negative' | 'neutral')[];
  }, [moodEntries]);

  const skyColors = useMemo(() => {
    const recent = sentimentHistory.slice(-5);
    const negatives = recent.filter(s => s === 'negative').length;
    const positives = recent.filter(s => s === 'positive').length;

    if (negatives > positives) return { top: "#0a0014", bottom: "#1a0033" }; 
    if (positives > negatives) return { top: "#001a1a", bottom: "#003333" }; 
    return { top: "#000000", bottom: "#0a0a0f" }; 
  }, [sentimentHistory]);

  return (
    <section 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden sanctuary-sky"
      style={{ 
        '--sky-top': skyColors.top, 
        '--sky-bottom': skyColors.bottom 
      } as any}
    >
      {heroImage && (
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-[0.2] contrast-[1.2]"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        </motion.div>
      )}
      
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-background/20 to-background" />
      
      <CornerVeins sentimentHistory={sentimentHistory} />

      <div className="relative z-10 container flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="mb-8"
        >
          <div className="bg-accent/20 p-4 rounded-3xl border border-accent/30 shadow-[0_0_40px_rgba(var(--accent),0.1)] inline-block">
            <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-accent" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2" />
                <circle cx="12" cy="12" r="3" strokeWidth="2" />
                <motion.circle 
                    cx="12" cy="12" r="6" 
                    initial={{ pathLength: 0 }} 
                    animate={{ pathLength: 1 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            </svg>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="text-5xl font-bold tracking-tight md:text-8xl font-headline text-white/95 drop-shadow-2xl"
        >
          PeaceMind <br />
          <span className="text-accent/70 text-glow">Sanctuary</span>
        </motion.h1>
        
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-lg md:text-xl text-white font-light max-w-2xl leading-relaxed"
        >
            High-performance tele-health and restorative tools specifically designed for ADHD, Anxiety, and Neuro-related wellness.
        </motion.p>

        <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col sm:flex-row gap-8"
        >
            {!isUserLoading && (
              <Button asChild size="lg" className="h-16 px-12 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all text-sm font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(var(--accent),0.2)]">
                { user ? <Link href="/profile">My Dashboard</Link> : <Link href="/signup">Begin Journey</Link> }
              </Button>
            )}
            <Button asChild variant="ghost" size="lg" className="h-16 px-12 rounded-full glass hover:bg-white/5 text-white/70 text-sm tracking-widest uppercase">
              <Link href="/tools">Care Suite</Link>
            </Button>
        </motion.div>
      </div>
    </section>
  );
}
