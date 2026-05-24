"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { ExternalLink, Brain, Zap, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const resources = {
    "ADHD & Neurodiversity": [
        { title: "Understanding ADHD Executive Function", content: "Strategies for managing task paralysis, time blindness, and dopamine-seeking behaviors. Focus on working with your brain, not against it." },
        { title: "Sensory Overload Management", content: "Identifying triggers and creating a sensory-friendly environment. Tips on using noise-canceling tools and grounding techniques." },
        { title: "Neuro-Inclusive Workplace Tips", content: "How to advocate for accommodations and structure your workday to align with your natural focus patterns." },
    ],
    "Anxiety & Panic Support": [
        { title: "Grounding for Panic Attacks", content: "The 5-4-3-2-1 technique and deep pressure therapy principles to de-escalate acute anxiety." },
        { title: "CBT for Chronic Worry", content: "Structured ways to challenge intrusive thoughts and reduce the weight of future-focused anxiety." },
        { title: "Sleep Hygiene for Raced Minds", content: "Practical routines to quiet the internal noise before bed, specifically for those with neuro-related insomnia." },
    ],
    "Professional Care in India": [
        { title: "Finding a Neuro-Inclusive Therapist", content: "How to look for therapists specializing in ADHD and Autism in India. Recommended directories and what questions to ask." },
        { title: "AASRA & Crisis Services", content: "24/7 helplines for immediate emotional support across the country." }
    ]
};

const professionalConsultation = [
    { title: "BetterLYF", content: "Qualified psychologists with experience in ADHD and Anxiety. Secure chat, call, or video.", link: "https://www.betterlyf.com/" },
    { title: "YourDOST", content: "Access to experts specializing in neuro-wellness and emotional resilience. Anonymous.", link: "https://yourdost.com/" },
    { title: "Manastha", content: "Online therapy services with a focus on specialized clinical care.", link: "https://www.manastha.com/" },
];

export function ResourceHub() {
  return (
    <section id="resources" className="py-12 md:py-24 bg-primary/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight font-headline">Clinical & Restorative Guide</h2>
            <p className="mt-4 text-lg text-muted-foreground">
            Specialized resources for ADHD, Anxiety, and Neuro-inclusive wellness.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="glass border-white/5">
                <CardContent className="p-8 flex flex-col items-center text-center">
                    <Brain className="h-10 w-10 text-accent mb-4" />
                    <h3 className="font-bold text-xl mb-2">Neuro-Support</h3>
                    <p className="text-sm text-muted-foreground">Dedicated modules for ADHD management and sensory processing.</p>
                </CardContent>
            </Card>
            <Card className="glass border-white/5">
                <CardContent className="p-8 flex flex-col items-center text-center">
                    <Zap className="h-10 w-10 text-accent mb-4" />
                    <h3 className="font-bold text-xl mb-2">Anxiety Care</h3>
                    <p className="text-sm text-muted-foreground">Evidence-based techniques for panic and social anxiety reduction.</p>
                </CardContent>
            </Card>
            <Card className="glass border-white/5">
                <CardContent className="p-8 flex flex-col items-center text-center">
                    <ShieldAlert className="h-10 w-10 text-red-400 mb-4" />
                    <h3 className="font-bold text-xl mb-2">Crisis Safety</h3>
                    <p className="text-sm text-muted-foreground">Immediate connection to 24/7 helplines and professional care.</p>
                </CardContent>
            </Card>
        </div>

        <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full bg-background p-6 rounded-[2rem] shadow-sm">
                {Object.entries(resources).map(([category, items]) => (
                    <AccordionItem value={category} key={category} className="border-b-secondary">
                        <AccordionTrigger className="text-xl font-headline hover:no-underline py-6">{category}</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-6 p-4">
                            {items.map(item => (
                                <div key={item.title}>
                                    <h4 className="font-semibold text-base">{item.title}</h4>
                                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.content}</p>
                                </div>
                            ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>

        <div className="mx-auto mt-24 max-w-4xl text-center">
            <h2 className="text-3xl font-bold font-headline">Professional Consultation</h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Verified platforms for clinical therapy and psychiatric support.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
                {professionalConsultation.map(item => (
                    <Card key={item.title} className="hover:border-accent transition-colors">
                        <CardContent className="p-6">
                            <h4 className="font-semibold text-lg">{item.title}</h4>
                            <p className="text-muted-foreground mt-2 text-xs leading-relaxed h-20">{item.content}</p>
                             {item.link && (
                                <Button asChild variant="link" className="px-0 h-auto mt-4 text-accent">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                                        View Providers <ExternalLink className="ml-2 h-3 w-3" />
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
