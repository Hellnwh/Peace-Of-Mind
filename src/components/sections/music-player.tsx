"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const frequencies = [
  { value: 174, name: "174 Hz", benefit: "Pain Relief", description: "Deeply grounding frequency for physical comfort and security." },
  { value: 285, name: "285 Hz", benefit: "Tissue Repair", description: "Linked to cellular rejuvenation and bodily restoration." },
  { value: 396, name: "396 Hz", benefit: "Fear Release", description: "Powerful tone for liberating guilt and deep-seated anxiety." },
  { value: 417, name: "417 Hz", benefit: "Cleanse negativity", description: "Facilitates change and clears traumatic experiences." },
  { value: 528, name: "528 Hz", benefit: "DNA Healing", description: "The 'Miracle Tone' for transformation, love, and DNA repair." },
  { value: 639, name: "639 Hz", benefit: "Connect Souls", description: "Harmonizes relationships and enhances social empathy." },
  { value: 741, name: "741 Hz", benefit: "Detox Mind", description: "Awakens intuition and cleanses the mind of toxins." },
  { value: 852, name: "852 Hz", benefit: "Spiritual Order", description: "Returns the soul to spiritual order and cosmic unity." },
  { value: 963, name: "963 Hz", benefit: "Divine Connection", description: "The frequency of the Gods, connecting to Pure Light." },
];

export function MusicPlayer() {
  const [frequency, setFrequency] = useState(432);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState(frequencies[4]); // Default 528-ish

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) oscillatorRef.current.stop();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current.frequency.setTargetAtTime(frequency, audioContextRef.current.currentTime, 0.1);
    }

    const findClosestBenefit = () => {
      const closest = frequencies.reduce((prev, curr) => {
        return (Math.abs(curr.value - frequency) < Math.abs(prev.value - frequency) ? curr : prev);
      });
      setCurrentBenefit(closest);
    };

    const handler = setTimeout(findClosestBenefit, 200);
    return () => clearTimeout(handler);
  }, [frequency, isPlaying]);

  useEffect(() => {
    if (gainRef.current && audioContextRef.current) {
        gainRef.current.gain.setTargetAtTime(isMuted ? 0 : 0.25, audioContextRef.current.currentTime, 0.1);
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = context;
            const gain = context.createGain();
            gain.gain.setValueAtTime(isMuted ? 0 : 0.25, context.currentTime);
            gain.connect(context.destination);
            gainRef.current = gain;
        } catch (e) {
            toast({ variant: "destructive", title: "Audio Error", description: "Your device does not support audio generation." });
            return;
        }
    }
    
    if (audioContextRef.current?.state === "suspended") audioContextRef.current.resume();
    
    if (isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
    } else if (audioContextRef.current && gainRef.current) {
      const osc = audioContextRef.current.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      osc.connect(gainRef.current);
      osc.start();
      oscillatorRef.current = osc;
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="music" className="py-24 md:py-48 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--accent),0.05),transparent_70%)]" />
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-accent text-sm font-bold uppercase tracking-[0.5em] mb-6"
            >
              The Resonance Room
            </motion.div>
            <h2 className="text-5xl font-bold tracking-tight sm:text-8xl font-headline">Sound <span className="text-accent">Heals</span></h2>
            <p className="mt-8 text-2xl text-muted-foreground/60 font-light max-w-2xl mx-auto leading-relaxed">
                Experience pure harmonic resonance. Tune your mind to the ancient Solfeggio frequencies.
            </p>
        </div>

        <Card className="max-w-5xl mx-auto glass shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] overflow-hidden rounded-[3rem] border-white/5">
            <CardHeader className="text-center pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBenefit.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <CardTitle className="text-8xl md:text-9xl font-bold font-headline text-accent text-glow">{currentBenefit.value}</CardTitle>
                        <CardDescription className="text-3xl mt-6 font-light uppercase tracking-[0.3em] text-white/40">{currentBenefit.benefit}</CardDescription>
                    </motion.div>
                </AnimatePresence>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-16 p-12 md:p-24">
                 <div className="relative w-full flex justify-center items-center h-[28rem]">
                    <motion.div 
                        className="absolute h-full w-[28rem] rounded-full bg-accent/5 border border-accent/20"
                        animate={{
                            scale: isPlaying ? [1, 1.4, 1] : 0.8,
                            opacity: isPlaying ? [0.4, 0.05, 0.4] : 0,
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                        className="absolute h-[22rem] w-[22rem] rounded-full bg-accent/10 shadow-[0_0_100px_rgba(var(--accent),0.3)] border border-accent/30"
                        animate={{
                            scale: isPlaying ? [1, 1.25, 1] : 0.9,
                            opacity: isPlaying ? [0.6, 0.9, 0.6] : 0.3,
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative text-center z-10 flex flex-col items-center">
                        <motion.div 
                          animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
                          className="text-[12rem] md:text-[16rem] font-bold text-white leading-none tracking-tighter font-headline"
                        >
                          {frequency}
                        </motion.div>
                        <p className="text-3xl text-accent/50 font-light tracking-[0.4em] uppercase">Hertz</p>
                    </div>
                 </div>

                <div className="w-full max-w-2xl space-y-14">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center px-4 text-xs text-muted-foreground/40 uppercase tracking-[0.5em] font-bold">
                        <span>100 Hz</span>
                        <span>1000 Hz</span>
                      </div>
                      <Slider
                          min={100}
                          max={1000}
                          step={1}
                          value={[frequency]}
                          onValueChange={(value) => setFrequency(value[0])}
                          className="h-12 cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-center items-center gap-12">
                        <Button 
                          onClick={togglePlay} 
                          className="w-64 h-24 rounded-[2rem] shadow-2xl bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105 active:scale-95 text-2xl font-bold"
                        >
                            {isPlaying ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12 ml-2" />}
                            <span className="ml-4">{isPlaying ? "Pause" : "Listen"}</span>
                        </Button>
                        <Button 
                          onClick={() => setIsMuted(!isMuted)} 
                          variant="outline" 
                          className="rounded-[2rem] h-24 w-24 shadow-xl glass border-white/10 hover:bg-accent/10 transition-all"
                          disabled={!isPlaying}
                        >
                            {isMuted ? <VolumeX className="h-10 w-10" /> : <Volume2 className="h-10 w-10" />}
                        </Button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBenefit.description}
                        className="text-center text-xl text-muted-foreground/50 max-w-xl leading-relaxed font-light"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                       {currentBenefit.description}
                    </motion.div>
                </AnimatePresence>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-muted-foreground/30 hover:text-accent font-bold tracking-widest text-xs uppercase">
                        <Info className="h-4 w-4 mr-2" />
                        Learn about solfeggio
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md glass p-8 text-lg leading-relaxed rounded-[2rem]">
                      <p className="font-light">Solfeggio frequencies are an ancient 6-tone scale believed to have spiritual and physical healing properties. Each tone resonates at a specific frequency to help restore the balance of your mind and body.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}