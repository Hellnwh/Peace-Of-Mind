
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Timer, Trophy, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface ReactionGameToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReactionGameTool({ open, onOpenChange }: ReactionGameToolProps) {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'early'>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTone = useCallback((freq: number, dur: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }, []);

  const startGame = () => {
    setGameState('waiting');
    const delay = 1500 + Math.random() * 3500;
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      setStartTime(performance.now());
      playTone(440, 0.5);
    }, delay);
  };

  const handleInteraction = () => {
    if (gameState === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
      playTone(220, 0.3);
    } else if (gameState === 'ready') {
      const endTime = performance.now();
      const time = Math.round(endTime - startTime);
      setReactionTime(time);
      if (!bestTime || time < bestTime) setBestTime(time);
      setGameState('result');
      playTone(880, 0.2);
    }
  };

  useEffect(() => {
    if (!open) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('idle');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-black/95 border-white/5 backdrop-blur-3xl rounded-[3rem] p-0 overflow-hidden">
        <DialogHeader className="pt-10 px-8 text-center">
          <DialogTitle className="text-4xl font-headline text-white flex items-center justify-center gap-3">
            <Zap className="text-accent h-8 w-8" />
            Reaction Focus
          </DialogTitle>
          <DialogDescription className="text-white/40 text-lg font-light mt-2">
            Train your impulse control. Tap immediately when the screen glows.
          </DialogDescription>
        </DialogHeader>

        <div 
          className={`h-[400px] m-8 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer relative overflow-hidden ${
            gameState === 'waiting' ? 'bg-red-500/5' :
            gameState === 'ready' ? 'bg-accent/20' :
            'bg-white/5'
          }`}
          onClick={gameState === 'idle' || gameState === 'result' || gameState === 'early' ? startGame : handleInteraction}
        >
          <AnimatePresence mode="wait">
            {gameState === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <Button variant="ghost" className="text-accent text-2xl font-headline hover:bg-transparent">
                  Tap to Start
                </Button>
              </motion.div>
            )}

            {gameState === 'waiting' && (
              <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <p className="text-white/40 text-xl font-light">Wait for the glow...</p>
              </motion.div>
            )}

            {gameState === 'ready' && (
              <motion.div key="ready" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} className="text-center">
                <p className="text-accent text-6xl font-bold font-headline">TAP!</p>
              </motion.div>
            )}

            {gameState === 'result' && (
              <motion.div key="result" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-accent">
                  <Timer className="h-6 w-6" />
                  <span className="text-5xl font-headline font-bold">{reactionTime}ms</span>
                </div>
                <p className="text-white/40">Tap anywhere to try again</p>
              </motion.div>
            )}

            {gameState === 'early' && (
              <motion.div key="early" initial={{ x: [10, -10, 10, 0] }} animate={{ x: 0 }} className="text-center">
                <p className="text-red-400 text-3xl font-headline font-bold">Too Early!</p>
                <p className="text-white/40 mt-2">Wait for the signal</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-6 left-8 flex items-center gap-3">
             <Trophy className="h-4 w-4 text-white/20" />
             <span className="text-xs uppercase tracking-widest text-white/20 font-bold">Best: {bestTime ? `${bestTime}ms` : '--'}</span>
          </div>
        </div>

        <div className="px-12 pb-10 flex items-center justify-between">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">
                Impulse Control Training &middot; Low Latency
            </p>
            <Button onClick={() => setBestTime(null)} variant="ghost" className="text-white/20 hover:text-white/40 text-[10px] uppercase tracking-widest">
              Reset Best
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
