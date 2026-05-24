
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Trophy, Clock } from "lucide-react";
import { Button } from "../ui/button";

interface StroopGameToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS = [
  { name: 'Red', hex: 'hsl(0, 70%, 50%)' },
  { name: 'Blue', hex: 'hsl(210, 70%, 50%)' },
  { name: 'Green', hex: 'hsl(142, 70%, 40%)' },
  { name: 'Yellow', hex: 'hsl(45, 90%, 50%)' },
  { name: 'Purple', hex: 'hsl(270, 70%, 50%)' },
];

export function StroopGameTool({ open, onOpenChange }: StroopGameToolProps) {
  const [word, setWord] = useState(COLORS[0]);
  const [inkColor, setInkColor] = useState(COLORS[1]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextTask = useCallback(() => {
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    const inkIdx = Math.floor(Math.random() * COLORS.length);
    setWord(COLORS[wordIdx]);
    setInkColor(COLORS[inkIdx]);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    nextTask();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('result');
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChoice = (colorName: string) => {
    if (gameState !== 'playing') return;
    if (colorName === inkColor.name) {
      setScore(s => s + 10);
    } else {
      setScore(s => Math.max(0, s - 5));
    }
    nextTask();
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (!open) setGameState('idle');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-black/95 border-white/5 backdrop-blur-3xl rounded-[3rem] p-0 overflow-hidden">
        <DialogHeader className="pt-10 px-8 text-center">
          <DialogTitle className="text-4xl font-headline text-white flex items-center justify-center gap-3">
            <Gamepad2 className="text-accent h-8 w-8" />
            Stroop Balance
          </DialogTitle>
          <DialogDescription className="text-white/40 text-lg font-light mt-2">
            Match the <strong>color of the ink</strong>, not the word text itself.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8">
           <div className="flex justify-between items-center mb-8 px-4">
             <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Zen Score</span>
              <span className="text-2xl font-headline text-accent">{score}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Time</span>
              <div className="flex items-center gap-2 text-white">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-2xl font-headline">{timeLeft}s</span>
              </div>
            </div>
          </div>

          <div className="h-[200px] flex items-center justify-center bg-white/5 rounded-[2rem] border border-white/5 mb-8">
            <AnimatePresence mode="wait">
              {gameState === 'playing' ? (
                <motion.h3
                  key={`${word.name}-${inkColor.name}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="text-7xl font-headline font-bold uppercase tracking-tighter"
                  style={{ color: inkColor.hex }}
                >
                  {word.name}
                </motion.h3>
              ) : gameState === 'idle' ? (
                 <Button onClick={startGame} className="bg-accent text-accent-foreground h-16 px-12 rounded-2xl font-bold text-xl">
                  Start Training
                </Button>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                   <p className="text-white/40 mb-2 uppercase tracking-widest text-xs font-bold">Session Complete</p>
                   <p className="text-6xl font-headline font-bold text-accent">{score}</p>
                   <Button onClick={startGame} variant="ghost" className="mt-4 text-accent hover:bg-accent/10">Try Again</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {gameState === 'playing' && (
            <div className="grid grid-cols-3 gap-3">
              {COLORS.map(c => (
                <Button 
                  key={c.name} 
                  onClick={() => handleChoice(c.name)}
                  className="h-14 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold"
                >
                  {c.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="px-12 pb-10 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">
                Cognitive Interference Training &middot; No Friction
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
