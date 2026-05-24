"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser, useFirestore, addDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";
import { ChevronRight, ChevronLeft, ShieldCheck, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmergencyModal } from "../emergency-modal";

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that others could have noticed — or being fidgety or restless",
  "Thoughts that you would be better off dead, or of hurting yourself"
];

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
];

const EXTRA_QUESTIONS = [
  { q: "How would you rate your sleep quality over the past 2 weeks?", opts: ["Good", "Fair", "Poor", "Very poor"] },
  { q: "How would you rate your overall stress level?", opts: ["Low", "Moderate", "High", "Very high"] }
];

const FREQUENCY_SCALE = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

export function ClinicalScreening() {
  const [step, setStep] = useState(0); // 0: Age, 1: Consent, 2-10: PHQ9, 11-17: GAD7, 18-19: Extra, 20: Results
  const [answers, setAnswers] = useState<number[]>(new Array(18).fill(-1));
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const totalSteps = 21;
  const progress = (step / (totalSteps - 1)) * 100;

  const handleNext = () => {
    // PHQ9 Q9 (Self-harm) safety check - index 8 in answers
    if (step === 10 && answers[8] >= 2) { 
      setIsEmergency(true);
      createDistressAlert("High PHQ-9 Q9 score detected during clinical screening.");
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => Math.max(0, prev - 1));

  const handleAnswer = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[step - 2] = val;
    setAnswers(newAnswers);
    handleNext();
  };

  const createDistressAlert = (reason: string) => {
    if (!user || !db) return;
    const alertRef = collection(db, "distressAlerts");
    addDocumentNonBlocking(alertRef, {
      userId: user.uid,
      triggerContent: reason,
      status: 'pending',
      timestamp: serverTimestamp()
    });
  };

  const calculateScores = () => {
    const phq9 = answers.slice(0, 9).reduce((a, b) => a + (b === -1 ? 0 : b), 0);
    const gad7 = answers.slice(9, 16).reduce((a, b) => a + (b === -1 ? 0 : b), 0);
    
    let level = "minimal";
    const maxScore = Math.max(phq9, gad7);
    if (answers[8] >= 2 || maxScore >= 20) level = "emergency";
    else if (maxScore >= 15) level = "severe";
    else if (maxScore >= 10) level = "moderate";
    else if (maxScore >= 5) level = "mild";

    return { phq9, gad7, level };
  };

  const saveResults = async () => {
    if (!user || !db) return;
    setIsSaving(true);
    const scores = calculateScores();
    
    try {
      const resultRef = collection(db, `users/${user.uid}/screeningResults`);
      addDocumentNonBlocking(resultRef, {
        userId: user.uid,
        phq9Score: scores.phq9,
        gad7Score: scores.gad7,
        triageLevel: scores.level,
        timestamp: serverTimestamp()
      });
      toast({ title: "Results Saved", description: "Your clinical profile has been updated." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save results." });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (step === 20) {
      saveResults();
    }
  }, [step]);

  const renderStep = () => {
    if (step === 0) return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
        <ShieldCheck className="mx-auto h-20 w-20 text-accent opacity-80" />
        <h2 className="text-3xl font-headline font-bold text-white/90">Age Verification</h2>
        <p className="text-white/50 text-lg font-light leading-relaxed">Clinical screening is designed for adults. Please verify your age to proceed with the scientific assessment.</p>
        <div className="flex gap-6 justify-center mt-10">
          <Button size="lg" className="rounded-full px-10 h-16 bg-accent text-accent-foreground font-bold" onClick={handleNext}>I am 18+</Button>
          <Button size="lg" variant="outline" className="rounded-full px-10 h-16 glass text-white/60 border-white/10" onClick={() => toast({ title: "Restricted", description: "Please ask a guardian for assistance." })}>Under 18</Button>
        </div>
      </motion.div>
    );

    if (step === 1) return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <h2 className="text-3xl font-headline font-bold text-white/90">Clinical Consent</h2>
        <div className="p-8 glass border-white/5 rounded-[2rem] space-y-6">
          <p className="text-sm font-bold text-accent uppercase tracking-widest">Read Carefully</p>
          <ul className="text-white/60 space-y-4 font-light leading-relaxed">
            <li className="flex gap-3"><span className="text-accent">•</span> Screening is a starting point, not a medical diagnosis.</li>
            <li className="flex gap-3"><span className="text-accent">•</span> Your data is secured but shared with our support algorithms.</li>
            <li className="flex gap-3"><span className="text-accent">•</span> Professional care should always follow high-severity results.</li>
            <li className="flex gap-3"><span className="text-accent">•</span> Crisis helplines (AASRA) are linked throughout the process.</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <Button size="lg" className="rounded-full h-16 bg-accent text-accent-foreground font-bold" onClick={handleNext}>I Understand & Consent</Button>
          <Button variant="ghost" className="text-white/40" onClick={handleBack}>Go Back</Button>
        </div>
      </motion.div>
    );

    if (step >= 2 && step <= 10) {
      const qIndex = step - 2;
      return (
        <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-bold text-accent uppercase tracking-[0.3em]">PHQ-9 • Depression Band ({qIndex + 1}/9)</p>
            <h3 className="text-2xl font-headline leading-tight text-white/90">Over the last 2 weeks, how often have you been bothered by:</h3>
            <p className="text-xl font-light text-white/60 italic">{PHQ9_QUESTIONS[qIndex]}</p>
          </div>
          <div className="grid gap-4">
            {FREQUENCY_SCALE.map((opt, i) => (
              <Button key={i} variant="outline" className="h-20 rounded-[1.5rem] glass text-lg font-light border-white/5 hover:border-accent hover:bg-accent/5 transition-all text-white/80" onClick={() => handleAnswer(i)}>
                {opt}
              </Button>
            ))}
          </div>
        </motion.div>
      );
    }

    if (step >= 11 && step <= 17) {
      const qIndex = step - 11;
      return (
        <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-bold text-accent uppercase tracking-[0.3em]">GAD-7 • Anxiety Band ({qIndex + 1}/7)</p>
            <h3 className="text-2xl font-headline leading-tight text-white/90">Over the last 2 weeks, how often have you been bothered by:</h3>
            <p className="text-xl font-light text-white/60 italic">{GAD7_QUESTIONS[qIndex]}</p>
          </div>
          <div className="grid gap-4">
            {FREQUENCY_SCALE.map((opt, i) => (
              <Button key={i} variant="outline" className="h-20 rounded-[1.5rem] glass text-lg font-light border-white/5 hover:border-accent hover:bg-accent/5 transition-all text-white/80" onClick={() => handleAnswer(i)}>
                {opt}
              </Button>
            ))}
          </div>
        </motion.div>
      );
    }

    if (step >= 18 && step <= 19) {
      const q = EXTRA_QUESTIONS[step - 18];
      return (
        <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-bold text-accent uppercase tracking-[0.3em]">Insights</p>
            <h3 className="text-2xl font-headline leading-tight text-white/90">{q.q}</h3>
          </div>
          <div className="grid gap-4">
            {q.opts.map((opt, i) => (
              <Button key={i} variant="outline" className="h-20 rounded-[1.5rem] glass text-lg font-light border-white/5 hover:border-accent hover:bg-accent/5 transition-all text-white/80" onClick={() => handleNext()}>
                {opt}
              </Button>
            ))}
          </div>
        </motion.div>
      );
    }

    if (step === 20) {
      const { phq9, gad7, level } = calculateScores();
      const labels: Record<string, string> = {
        minimal: "Minimal Support Recommended",
        mild: "Guided Self-Care Recommended",
        moderate: "Consultation Recommended",
        severe: "Urgent Professional Help",
        emergency: "Immediate Crisis Support"
      };

      return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10">
          <div className={`inline-flex items-center gap-3 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-[0.2em] ${
            level === 'emergency' || level === 'severe' ? 'bg-red-500/10 text-red-400' : 'bg-accent/10 text-accent'
          }`}>
            <CheckCircle2 className="h-5 w-5" /> {labels[level]}
          </div>
          
          <h2 className="text-5xl font-headline font-bold text-white/95">Screening <span className="text-accent text-glow">Results</span></h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 glass rounded-[2.5rem] border-white/5">
                <p className="text-xs font-bold uppercase text-white/30 tracking-widest mb-3">Depression (PHQ-9)</p>
                <p className="text-6xl font-headline font-bold text-accent">{phq9}</p>
                <p className="text-sm mt-3 text-white/40 font-light">Self-reported severity</p>
            </div>
            <div className="p-8 glass rounded-[2.5rem] border-white/5">
                <p className="text-xs font-bold uppercase text-white/30 tracking-widest mb-3">Anxiety (GAD-7)</p>
                <p className="text-6xl font-headline font-bold text-accent">{gad7}</p>
                <p className="text-sm mt-3 text-white/40 font-light">Self-reported severity</p>
            </div>
          </div>

          <div className="p-8 glass border-white/5 rounded-[2rem] text-left text-sm text-white/40 leading-relaxed font-light">
            <strong>Note:</strong> These scores reflect your state over the past 14 days. While scientifically derived, they do not replace a face-to-face evaluation by a medical professional.
          </div>

          <div className="flex flex-col gap-6 mt-12">
             <Button size="lg" className="h-18 rounded-full bg-accent text-accent-foreground text-xl font-bold shadow-2xl shadow-accent/20" onClick={() => window.location.href = "/profile"}>
               Explore My Dashboard
             </Button>
             <Button variant="ghost" className="text-white/30 hover:text-red-400" onClick={() => setIsEmergency(true)}>Need crisis support now?</Button>
          </div>
        </motion.div>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-16 space-y-3">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
          <span>{step < 2 ? "Foundation" : step < 11 ? "Depression Band" : step < 18 ? "Anxiety Band" : "Synthesis"}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1 bg-white/5 [&>*]:bg-accent transition-all duration-1000" />
      </div>

      <Card className="glass shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-white/5 rounded-[3.5rem] overflow-hidden">
        <CardContent className="p-12 md:p-20">
            <AnimatePresence mode="wait">
                {renderStep()}
            </AnimatePresence>
        </CardContent>
      </Card>
      
      <EmergencyModal open={isEmergency} onOpenChange={setIsEmergency} />
    </div>
  );
}