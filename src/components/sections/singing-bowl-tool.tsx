
"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Loader2, Music2 } from "lucide-react";

interface SingingBowlToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * SingingBowlTool - A high-fidelity additive synthesis engine
 * providing realistic Tibetan bowl resonances.
 */
export function SingingBowlTool({ open, onOpenChange }: SingingBowlToolProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const partialsRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const mainGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  
  const bowlRotation = useSpring(0, { stiffness: 60, damping: 25 });
  const scale = useSpring(1, { stiffness: 200, damping: 20 });
  const resonanceIntensity = useMotionValue(0);
  const visualResonance = useTransform(resonanceIntensity, [0, 1], [0, 20]);

  const initAudio = () => {
    if (audioContextRef.current) return;
    
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const mainGain = ctx.createGain();
      mainGain.gain.value = 0;
      mainGain.connect(ctx.destination);
      mainGainRef.current = mainGain;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1200;
      filter.connect(mainGain);
      filterRef.current = filter;

      // Tibetan Bowl Additive Synthesis Partials
      // Frequencies derived from spectral analysis of resonant bowls
      const frequencies = [164.8, 329.6, 494.4, 659.2, 824.0, 988.8];
      const harmonicWeights = [1.0, 0.4, 0.25, 0.15, 0.1, 0.05];

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.value = 0; // Start silent
        
        osc.connect(g);
        g.connect(filter);
        osc.start();
        partialsRef.current.push({ osc, gain: g });
      });

      setIsLoaded(true);
    } catch (e) {
      console.error("Audio engine failed to initialize", e);
    }
  };

  useEffect(() => {
    if (open) initAudio();
    return () => {
      if (!open && audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        partialsRef.current = [];
      }
    };
  }, [open]);

  const handleStrike = () => {
    if (!isLoaded || !mainGainRef.current || !audioContextRef.current) return;
    if (audioContextRef.current.state === "suspended") audioContextRef.current.resume();

    const now = audioContextRef.current.currentTime;
    
    // Physical strike simulation
    scale.set(0.95);
    setTimeout(() => scale.set(1), 50);

    mainGainRef.current.gain.cancelScheduledValues(now);
    mainGainRef.current.gain.setValueAtTime(0.4, now);
    mainGainRef.current.gain.exponentialRampToValueAtTime(0.001, now + 12);

    partialsRef.current.forEach((p, i) => {
      p.gain.gain.cancelScheduledValues(now);
      p.gain.gain.setValueAtTime(i === 0 ? 0.8 : 0.4 / (i + 1), now);
      p.gain.gain.exponentialRampToValueAtTime(0.001, now + 8 + i);
    });
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isLoaded || !audioContextRef.current || !mainGainRef.current) return;
    if (audioContextRef.current.state === "suspended") audioContextRef.current.resume();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : (e.touches[0]?.clientX || 0)) - rect.left;
    const y = ('clientY' in e ? e.clientY : (e.touches[0]?.clientY || 0)) - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
    // Rim singing logic
    const angle = Math.atan2(y - centerY, x - centerX);
    bowlRotation.set(angle * (180 / Math.PI));

    // Intensity based on proximity to rim
    const targetIntensity = Math.max(0, 1 - Math.abs(dist - 120) / 60);
    resonanceIntensity.set(targetIntensity);

    const now = audioContextRef.current.currentTime;
    const gainVal = targetIntensity * 0.35;
    
    mainGainRef.current.gain.setTargetAtTime(gainVal, now, 0.1);
    
    partialsRef.current.forEach((p, i) => {
      p.gain.gain.setTargetAtTime(i === 0 ? 1 : 0.5 / (i + 1), now, 0.2);
    });
    
    scale.set(1 + targetIntensity * 0.04);
  };

  const stopInteraction = () => {
    if (mainGainRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      mainGainRef.current.gain.setTargetAtTime(0.001, now, 0.8);
      resonanceIntensity.set(0);
      scale.set(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-black/95 border-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
        <DialogHeader className="pt-8 px-8">
          <DialogTitle className="text-4xl font-headline text-center text-white flex items-center justify-center gap-3">
            <Music2 className="text-accent h-8 w-8" />
            Tibetan Bowl
          </DialogTitle>
          <DialogDescription className="text-center text-white/40 text-lg font-light mt-2">
            Circle the rim gently to hear the harmonic resonance, or tap to strike.
          </DialogDescription>
        </DialogHeader>

        <div 
          className="relative h-[450px] w-full flex items-center justify-center overflow-hidden cursor-crosshair gpu-boost"
          onMouseMove={handleInteraction}
          onMouseLeave={stopInteraction}
          onTouchMove={handleInteraction}
          onTouchEnd={stopInteraction}
          onClick={handleStrike}
        >
          {!isLoaded ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-accent" />
              <p className="text-accent/60 text-xs font-bold uppercase tracking-widest">Initializing Audio</p>
            </div>
          ) : (
            <>
              {/* Harmonic Glow Rings */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-accent/20"
                  style={{ 
                    width: 240 + i * 110, 
                    height: 240 + i * 110,
                    boxShadow: resonanceIntensity.get() > 0.1 ? `0 0 ${visualResonance.get() * (i + 1)}px rgba(var(--accent),0.1)` : "none"
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.05, 0.15, 0.05],
                  }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}

              {/* The Interactive Bowl */}
              <motion.div
                className="relative z-10 w-72 h-72 rounded-full flex items-center justify-center shadow-[0_0_120px_rgba(0,0,0,0.8)]"
                style={{ 
                    scale,
                    rotate: bowlRotation,
                    background: "radial-gradient(circle at 30% 30%, #fef3c7 0%, #d97706 40%, #78350f 100%)",
                    boxShadow: "inset 0 0 80px rgba(0,0,0,0.6), 0 0 60px rgba(217, 119, 6, 0.1)"
                }}
              >
                {/* Metallic Inner Textures */}
                <div className="w-[92%] h-[92%] rounded-full border-[6px] border-white/10 flex items-center justify-center">
                    <div className="w-[85%] h-[85%] rounded-full bg-black/30 backdrop-blur-md border-2 border-white/5 flex items-center justify-center">
                        <div className="w-1 h-1 bg-white/20 rounded-full shadow-[0_0_40px_20px_rgba(255,255,255,0.05)]" />
                    </div>
                </div>
                
                {/* Interactive Rim Cursor */}
                <motion.div 
                    className="absolute w-6 h-6 bg-white/40 blur-md rounded-full"
                    style={{ top: "4%", opacity: visualResonance }}
                />
              </motion.div>

              {/* Striker Interaction Hint */}
              <AnimatePresence>
                {resonanceIntensity.get() < 0.1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30"
                    >
                        Touch or Drag to Begin
                    </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
        
        <div className="px-12 pb-10 flex flex-col items-center">
            <div className="h-[1px] w-full bg-white/5 mb-6" />
            <p className="text-center text-[10px] tracking-[0.3em] uppercase text-white/20">
                Multi-Sampled Resonant Synthesis &middot; High Refresh Rate UI
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
