
"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Wind, 
  Droplets, 
  Music, 
  Bell, 
  ShieldCheck, 
  Zap, 
  Brain, 
  Timer, 
  Gamepad2,
  Brush,
  Lightbulb
} from "lucide-react";
import { JournalTool } from './journal-tool';
import { BreathingTool } from './breathing-tool';
import { BubblePopTool } from './bubble-pop-tool';
import { SingingBowlTool } from './singing-bowl-tool';
import { ReactionGameTool } from './reaction-game-tool';
import { SimonGameTool } from './simon-game-tool';
import { StroopGameTool } from './stroop-game-tool';
import { PomodoroTool } from './pomodoro-tool';
import { ZenGardenTool } from './zen-garden-tool';
import { MemoryLanternTool } from './memory-lantern-tool';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion } from "framer-motion";

const tools = [
  { id: 'screening', title: 'Clinical Screening', description: "Validated PHQ-9 & GAD-7 assessments for scientific mental health tracking.", icon: <ShieldCheck />, href: '/intake' },
  { id: 'reaction', title: 'Reaction Focus', description: "Fast-burst target game to train impulse control and rapid attention.", icon: <Zap />, component: ReactionGameTool },
  { id: 'simon', title: "Simon's Echo", description: "Pattern memory sequences using harmonic tones for working memory.", icon: <Brain />, component: SimonGameTool },
  { id: 'stroop', title: 'Stroop Balance', description: "Inhibitory control training by matching colors over word text.", icon: <Gamepad2 />, component: StroopGameTool },
  { id: 'pomodoro', title: 'Zen Pomodoro', description: "Gamified focus timer that rewards productivity with sanctuary growth.", icon: <Timer />, component: PomodoroTool },
  { id: 'lanterns', title: 'Memory Lanterns', description: 'Working memory training through harmonic visual sequences.', icon: <Lightbulb />, component: MemoryLanternTool },
  { id: 'zen-garden', title: 'Sand Scribble', description: "Low-stimulation Zen garden simulator for tactile stress relief.", icon: <Brush />, component: ZenGardenTool },
  { id: 'singing-bowl', title: 'Singing Bowl', description: "Harmonic resonance tool for grounding and sensory regulation.", icon: <Bell />, component: SingingBowlTool },
  { id: 'journal', title: 'Private Journal', description: "A high-fidelity space to document neuro-patterns and self-reflections.", icon: <BookOpen />, component: JournalTool },
  { id: 'breathing', title: 'Moon Breath', description: "Cinematic guided breathing exercise for nervous system regulation.", icon: <Wind />, component: BreathingTool },
  { id: 'bubble-pop', title: 'Bubble Pop Zen', description: "A satisfyingly smooth game for instant stress relief and focus.", icon: <Droplets />, component: BubblePopTool },
  { id: 'music', title: 'Sonic Sanctuary', description: 'Healing frequencies and ambient soundscapes for deep restoration.', icon: <Music />, href: '/music' },
];

export function Features() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOpenTool = (tool: (typeof tools)[0]) => {
    if (tool.component) {
      setActiveTool(tool.id);
    } else if (!tool.href) {
      toast({
        title: "Feature coming soon",
        description: `The '${tool.title}' clinical tool is currently in development.`,
      });
    }
  };

  const ActiveToolComponent = tools.find(t => t.id === activeTool)?.component;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <section id="tools" className="container py-24 md:py-40">
      <div className="mx-auto max-w-3xl text-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest"
        >
          Care Suite
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-bold tracking-tight sm:text-7xl font-headline"
        >
          Tools for <span className="text-accent">Wellness</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-xl text-muted-foreground font-light leading-relaxed"
        >
          A curated collection of restorative games and tools designed for ADHD focus, clinical tracking, and nervous system regulation.
        </motion.p>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {tools.map((tool) => (
          <motion.div key={tool.id} variants={item}>
            <Card className="group h-full flex flex-col transition-all duration-300 glass hover:-translate-y-1 border-accent/5 hover:border-accent/30 shadow-none hover:shadow-2xl overflow-hidden rounded-[2rem]">
              <CardHeader className="relative p-8 pb-4">
                <div className="flex items-center gap-5">
                  <div className="bg-accent/5 p-4 rounded-2xl text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                    {React.cloneElement(tool.icon as React.ReactElement, { className: "h-7 w-7" })}
                  </div>
                  <CardTitle className="font-headline text-xl font-bold">{tool.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-8 pt-0">
                <CardDescription className="flex-1 text-sm leading-relaxed text-muted-foreground/80 font-light">
                  {tool.description}
                </CardDescription>
                <div className="mt-8">
                  {tool.href ? (
                    <Button asChild className="w-full h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg text-sm font-bold">
                      <Link href={tool.href}>Access Feature</Link>
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleOpenTool(tool)} 
                      className="w-full h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg text-sm font-bold"
                    >
                      Open Tool
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {ActiveToolComponent && (
        <ActiveToolComponent open={!!activeTool} onOpenChange={() => setActiveTool(null)} />
      )}
    </section>
  );
}
