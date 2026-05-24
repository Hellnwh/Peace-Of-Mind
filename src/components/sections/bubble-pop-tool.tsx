
"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Droplets, RefreshCw } from "lucide-react";

interface BubblePopToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
}

export function BubblePopTool({ open, onOpenChange }: BubblePopToolProps) {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [poppedCount, setPoppedCount] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);

    const playPopSound = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }, []);

    const createBubbles = useCallback(() => {
        const newBubbles: Bubble[] = Array.from({ length: 20 }).map((_, i) => ({
            id: Date.now() + i,
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 70,
            size: 40 + Math.random() * 60,
            hue: 160 + Math.random() * 40, // Accent-colored range
        }));
        setBubbles(newBubbles);
    }, []);

    useEffect(() => {
        if (open) {
            createBubbles();
            setPoppedCount(0);
        }
    }, [open, createBubbles]);

    const popBubble = (id: number) => {
        playPopSound();
        setBubbles(prev => prev.filter(b => b.id !== id));
        setPoppedCount(prev => prev + 1);
        
        if (bubbles.length === 1) {
            setTimeout(createBubbles, 1000);
        }
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-black/95 border-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden h-[85vh] flex flex-col p-0">
        <DialogHeader className="pt-10 px-8 text-center">
          <DialogTitle className="text-4xl font-headline text-white flex items-center justify-center gap-3">
            <Droplets className="text-accent h-8 w-8" />
            Bubble Pop Zen
          </DialogTitle>
          <DialogDescription className="text-white/40 text-lg font-light mt-2">
            A frictionless sensory game designed for high-refresh-rate stress relief.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 relative bg-accent/5 overflow-hidden m-8 rounded-[2rem] border border-white/5 cursor-crosshair gpu-boost">
            <AnimatePresence>
                {bubbles.map(bubble => (
                    <motion.div
                        key={bubble.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                            scale: 1, 
                            opacity: 0.6,
                            x: [0, Math.random() * 20 - 10, 0],
                            y: [0, Math.random() * 20 - 10, 0]
                        }}
                        exit={{ scale: 2.5, opacity: 0, filter: "blur(20px)" }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 200, 
                            damping: 20,
                            y: { duration: 4 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" },
                            x: { duration: 3 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] backdrop-blur-sm"
                        style={{
                            width: bubble.size,
                            height: bubble.size,
                            top: `${bubble.y}%`,
                            left: `${bubble.x}%`,
                            backgroundColor: `hsla(${bubble.hue}, 70%, 50%, 0.15)`,
                            border: `2px solid hsla(${bubble.hue}, 70%, 60%, 0.4)`,
                        }}
                        onPointerDown={() => popBubble(bubble.id)}
                    />
                ))}
            </AnimatePresence>

            <div className="absolute top-6 left-8">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Zen Level</span>
                <p className="text-3xl font-headline text-accent/40">{poppedCount}</p>
            </div>
        </div>

        <div className="px-12 pb-10 flex items-center justify-between">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">
                Optimized for High Latency &middot; Hardware Accelerated
            </p>
            <Button 
                onClick={createBubbles} 
                variant="ghost" 
                className="rounded-xl text-accent hover:bg-accent/10 font-bold"
            >
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useRef } from "react";
