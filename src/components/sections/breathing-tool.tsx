"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface BreathingToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const breathingCycle = [
  { text: "Breathe In", duration: 4000 },
  { text: "Hold", duration: 7000 },
  { text: "Breathe Out", duration: 8000 },
];

export function BreathingTool({ open, onOpenChange }: BreathingToolProps) {
  const [cycleIndex, setCycleIndex] = useState(-1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (open && !audioContextRef.current) {
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioCtx();
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.gain.value = 0;
            gainNodeRef.current.connect(audioContextRef.current.destination);
            
            oscillatorRef.current = audioContextRef.current.createOscillator();
            oscillatorRef.current.type = "sine";
            oscillatorRef.current.frequency.value = 220;
            oscillatorRef.current.connect(gainNodeRef.current);
            oscillatorRef.current.start();
        } catch (e) {
            console.error("Audio initialization failed");
        }
    }

    if (!open) {
      setCycleIndex(-1);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    if (cycleIndex === -1) {
        setTimeout(() => setCycleIndex(0), 500);
        return;
    }

    const currentCycle = breathingCycle[cycleIndex];
    
    // Play sound swelling
    if (gainNodeRef.current && audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        if (currentCycle.text === "Breathe In") {
            gainNodeRef.current.gain.linearRampToValueAtTime(0.2, now + currentCycle.duration / 1000);
        } else if (currentCycle.text === "Breathe Out") {
            gainNodeRef.current.gain.linearRampToValueAtTime(0, now + currentCycle.duration / 1000);
        }
    }

    const timer = setTimeout(() => {
      setCycleIndex((prevIndex) => (prevIndex + 1) % breathingCycle.length);
    }, currentCycle.duration);

    return () => clearTimeout(timer);
  }, [open, cycleIndex]);

  const currentCycle = cycleIndex === -1 ? { text: "Get Ready...", duration: 1000 } : breathingCycle[cycleIndex];
  const scale = currentCycle.text === "Breathe In" ? 1 : currentCycle.text === "Get Ready..." ? 0.5 : currentCycle.text === "Hold" ? 1 : 0.5;
  const transitionDuration = currentCycle.text === "Hold" ? 0.5 : currentCycle.duration / 1000;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) setCycleIndex(-1);
    }}>
      <DialogContent className="sm:max-w-md bg-black/80 border-white/10 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center text-white">Moon Breath</DialogTitle>
          <DialogDescription className="text-center text-white/40">
            A procedural audio-visual experience for nervous system regulation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center h-64 gap-8 my-4">
          <div className="relative h-40 w-40 flex items-center justify-center">
            <motion.div
              className="absolute h-full w-full rounded-full bg-accent/20 blur-xl"
              animate={{ scale }}
              transition={{ duration: transitionDuration, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute h-full w-full rounded-full border border-accent/40"
              animate={{ scale }}
              transition={{ duration: transitionDuration, ease: "easeInOut" }}
            />
            <motion.p
              key={currentCycle.text}
              className="text-2xl font-semibold text-accent z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {currentCycle.text}
            </motion.p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
