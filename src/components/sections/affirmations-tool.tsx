"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AffirmationsToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const allAffirmations = [
    "I am calm, peaceful, and centered.",
    "I release all tension and embrace tranquility.",
    "I am worthy of love and respect.",
    "I have the strength to overcome any challenge.",
    "I choose to focus on the positive.",
    "I am growing stronger every day.",
    "I am in control of my thoughts and feelings.",
    "I am resilient and can handle whatever comes my way.",
    "I deserve to be happy and at peace.",
    "I am grateful for this moment of calm.",
    "I let go of what I cannot control.",
    "I trust in my ability to navigate life's challenges.",
    "My mind is clear and my heart is at ease.",
    "I inhale peace and exhale worry.",
    "I am enough, just as I am.",
];

export function AffirmationsTool({ open, onOpenChange }: AffirmationsToolProps) {
    const [affirmations, setAffirmations] = useState(() => [...allAffirmations].sort(() => 0.5 - Math.random()).slice(0, 5));
    const audioContextRef = useRef<AudioContext | null>(null);

    const playChime = () => {
        if (!audioContextRef.current) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioCtx();
        }
        
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 1);
    }

    const getNewAffirmations = () => {
        playChime();
        const shuffled = [...allAffirmations].sort(() => 0.5 - Math.random());
        setAffirmations(shuffled.slice(0, 5));
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-black/90 border-white/5 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-white">Infinite Affirmations</DialogTitle>
          <DialogDescription className="text-white/40">
            Read, absorb, and repeat. Let these words of kindness sink in.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full my-4">
            <div className="space-y-4 pr-6">
                {affirmations.map((affirmation, index) => (
                    <div key={index} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white/90 text-center text-lg font-light">
                        {affirmation}
                    </div>
                ))}
            </div>
        </ScrollArea>
        <DialogFooter>
            <Button onClick={getNewAffirmations} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-12 px-8">
                <RefreshCw className="mr-2 h-4 w-4" />
                Show Me More
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
