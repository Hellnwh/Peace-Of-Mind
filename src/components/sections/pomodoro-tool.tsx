
"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface PomodoroToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PomodoroTool({ open, onOpenChange }: PomodoroToolProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      handleCycleComplete();
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, timeLeft]);

  const handleCycleComplete = () => {
    setIsActive(false);
    if (!isBreak) {
      setCyclesCompleted(c => c + 1);
      setIsBreak(true);
      setTimeLeft(5 * 60);
    } else {
      setIsBreak(false);
      setTimeLeft(25 * 60);
    }
    // Play sound notification if needed
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (isBreak ? 5 * 60 : 25 * 60)) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-black/95 border-white/5 backdrop-blur-3xl rounded-[3rem] p-0 overflow-hidden">
        <DialogHeader className="pt-10 px-8 text-center">
          <DialogTitle className="text-4xl font-headline text-white flex items-center justify-center gap-3">
            <Timer className="text-accent h-8 w-8" />
            Zen Pomodoro
          </DialogTitle>
          <DialogDescription className="text-white/40 text-lg font-light mt-2">
            Structured focus sessions. Nourish your mind, then rest.
          </DialogDescription>
        </DialogHeader>

        <div className="p-12 flex flex-col items-center">
          <div className="relative w-64 h-64 flex items-center justify-center mb-12">
             <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx="50%" cy="50%" r="48%" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="4" 
                />
                <motion.circle 
                  cx="50%" cy="50%" r="48%" 
                  fill="none" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth="4" 
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 * (progress / 100)}
                  strokeLinecap="round"
                  transition={{ duration: 1, ease: "linear" }}
                />
             </svg>
             <div className="text-center">
                <p className="text-7xl font-headline font-bold text-white tabular-nums leading-none">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-accent mt-4 font-bold">
                  {isBreak ? 'Rest Phase' : 'Focus Phase'}
                </p>
             </div>
          </div>

          <div className="flex gap-6">
            <Button 
              onClick={toggleTimer} 
              className="h-16 px-10 rounded-2xl bg-accent text-accent-foreground font-bold text-lg hover:scale-105 transition-transform"
            >
              {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isActive ? 'Pause' : 'Start Focus'}
            </Button>
            <Button 
              onClick={resetTimer} 
              variant="outline" 
              className="h-16 w-16 rounded-2xl glass border-white/10 text-white/40 hover:text-white"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-4">
             <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center ${i < cyclesCompleted ? 'bg-accent' : 'bg-white/5'}`}>
                    <Sparkles className={`h-4 w-4 ${i < cyclesCompleted ? 'text-accent-foreground' : 'text-white/10'}`} />
                  </div>
                ))}
             </div>
             <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Seeds Earned</p>
          </div>
        </div>

        <div className="px-12 pb-10 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">
                Gamified Motivation &middot; Productivity Suite
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
