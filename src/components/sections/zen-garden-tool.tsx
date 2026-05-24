
"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Brush, Trash2, Download } from "lucide-react";
import { Button } from "../ui/button";

interface ZenGardenToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ZenGardenTool({ open, onOpenChange }: ZenGardenToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (audioContextRef.current) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    audioContextRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    gainNodeRef.current = gain;

    const noise = ctx.createBufferSource();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    noise.connect(filter);
    filter.connect(gain);
    noise.start();
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    initAudio();
    setIsActive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.05, audioContextRef.current.currentTime, 0.1);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'; // Sand "indent"
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.05)';
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsActive(false);
    if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.2);
    }
  };

  const clearGarden = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
      }, 100);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-black/95 border-white/5 backdrop-blur-3xl rounded-[3rem] p-0 overflow-hidden">
        <DialogHeader className="pt-10 px-8 text-center">
          <DialogTitle className="text-4xl font-headline text-white flex items-center justify-center gap-3">
            <Brush className="text-accent h-8 w-8" />
            Sand Scribble
          </DialogTitle>
          <DialogDescription className="text-white/40 text-lg font-light mt-2">
            A frictionless outlet for fidgeting. Draw slowly to hear the sand.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8">
          <div 
            className="h-[450px] w-full rounded-[2rem] bg-[#e5e7eb] relative overflow-hidden shadow-inner cursor-crosshair"
            style={{ 
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
              backgroundSize: '10px 10px'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          >
            <canvas 
              ref={canvasRef}
              className="w-full h-full touch-none"
            />
          </div>

          <div className="mt-8 flex justify-center gap-4">
             <Button onClick={clearGarden} variant="outline" className="rounded-xl glass border-white/10 h-12 px-8 text-white/40 hover:text-red-400">
               <Trash2 className="mr-2 h-4 w-4" /> Reset Garden
             </Button>
          </div>
        </div>

        <div className="px-12 pb-10 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">
                Low-Stimulation Fidget Tool &middot; Tactical Audio
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
