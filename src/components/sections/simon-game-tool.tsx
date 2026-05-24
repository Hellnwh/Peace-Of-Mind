
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, RefreshCw, Trophy } from "lucide-react";
import { Button } from "../ui/button";

interface SimonGameToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pads = [
  { id: 0, color: "bg-accent/40", activeColor: "bg-accent", tone: 261.63 }, // C4
  { id: 1, color: "bg-emerald-500/40", activeColor: "bg-emerald-500", tone: 293.66 }, // D4
  { id: 2, color: "bg-purple-500/40", activeColor: "bg-purple-500", tone: 329.63 }, // E4
  { id: 3, color: "bg-amber-500/40", activeColor: "bg-amber-500", tone: 349.23 }, // F4
];

export function SimonGameTool({ open, onOpenChange }: SimonGameToolProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'listening' | 'failed'>('idle');
  const [highScore, setHighScore] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTone = useCallback((freq: number) => {
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
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  const playSequence = useCallback(async (seq: number[]) => {
    setGameState('playing');
    for (const id of seq) {
      await new Promise(r => setTimeout(r, 400));
      setActivePad(id);
      playTone(pads[id].tone);
      await new Promise(r => setTimeout(r, 400));
      setActivePad(null);
    }
    setGameState('listening');
    setUserSequence([]);
  }, [playTone]);

  const startNewGame = () => {
    const first = Math.floor(Math.random() * 4);
    setSequence([first]);
    playSequence([first]);
  };

  const handlePadClick = (id: number) => {
    if (gameState !== 'listening') return;
    
    playTone(pads[id].tone);
    setActivePad(id);
    setTimeout(() => setActivePad(null), 200);

    const newUserSeq = [...userSequence, id];
    setUserSequence(newUserSeq);

    if (id !== sequence[userSequence.length]) {
      setGameState('failed');
      playTone(150);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      if (sequence.length > highScore) setHighScore(sequence.length);
      setTimeout(() => {
        const next = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(next);
        playSequence(next);
      }, 1000);
    }
  };

  useEffect(() => {
    if (!open) {
      setSequence([]);
      setGameState('idle');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-black/95 border-white/5 backdrop-blur-3xl rounded-[3rem] p-0 overflow-hidden">
        <DialogHeader className="pt-10 px-8 text-center">
          <DialogTitle className="text-4xl font-headline text-white flex items-center justify-center gap-3">
            <Brain className="text-accent h-8 w-8" />
            Simon's Echo
          </DialogTitle>
          <DialogDescription className="text-white/40 text-lg font-light mt-2">
            Build working memory. Repeat the sequence of light and sound.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8 px-4">
             <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Level</span>
              <span className="text-2xl font-headline text-accent">{sequence.length || 0}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Best</span>
              <span className="text-2xl font-headline text-white">{highScore}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-[320px] mx-auto aspect-square">
            {pads.map((pad) => (
              <motion.div
                key={pad.id}
                whileTap={{ scale: 0.95 }}
                className={`rounded-[2rem] transition-colors cursor-pointer border border-white/10 ${
                  activePad === pad.id ? pad.activeColor : pad.color
                }`}
                onClick={() => handlePadClick(pad.id)}
              />
            ))}
          </div>

          <AnimatePresence>
            {(gameState === 'idle' || gameState === 'failed') && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 text-center"
              >
                {gameState === 'failed' && <p className="text-red-400 mb-4 font-headline text-xl">Incorrect Sequence</p>}
                <Button onClick={startNewGame} className="bg-accent text-accent-foreground h-14 px-10 rounded-2xl font-bold">
                  {gameState === 'failed' ? 'Try Again' : 'Start Journey'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-12 pb-10 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">
                Cognitive Training &middot; 60 FPS
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
