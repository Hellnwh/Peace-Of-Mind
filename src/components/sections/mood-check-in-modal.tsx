
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getToolRecommendations } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";

const moodEmojis = ["😔", "😕", "😐", "🙂", "😄"];

export function MoodCheckInModal() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState([50]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (user) { // Only show modal if user is logged in
        const hasCheckedIn = localStorage.getItem(`hasCheckedInToday_${user.uid}`);
        if (!hasCheckedIn) {
          const timer = setTimeout(() => setOpen(true), 2000);
          return () => clearTimeout(timer);
        }
    }
  }, [user]);

  const saveMoodEntry = () => {
    if (!user || !db) return;

    const moodEntryData = {
        userId: user.uid,
        moodScore: mood[0],
        moodEmoji: moodEmojis[Math.floor(mood[0] / 20.1)],
        timestamp: serverTimestamp()
    };
    
    const moodCollection = collection(db, `users/${user.uid}/moodEntries`);
    addDocumentNonBlocking(moodCollection, moodEntryData);
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
        saveMoodEntry();
        const { recommendedTools } = await getToolRecommendations(mood[0]);
        
        if (user) {
            const today = new Date().toDateString();
            localStorage.setItem(`hasCheckedInToday_${user.uid}`, today);
        }
        setOpen(false);

        toast({
            title: "Here are some suggestions for you:",
            description: (
                <ul className="list-disc pl-5 mt-2">
                    {recommendedTools.map(tool => <li key={tool}>{tool}</li>)}
                </ul>
            ),
            duration: 10000,
        });

        const toolsSection = document.getElementById("tools");
        if (toolsSection) {
            toolsSection.scrollIntoView({ behavior: "smooth" });
        }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get recommendations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaybeLater = () => {
    if (user) {
        const today = new Date().toDateString();
        localStorage.setItem(`hasCheckedInToday_${user.uid}`, today);
    }
    setOpen(false);
  }

  const currentEmoji = moodEmojis[Math.floor(mood[0] / 20.1)];

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-headline">How are you feeling right now?</DialogTitle>
          <DialogDescription className="text-center">
            Your mood helps us personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-8">
            <div className="text-6xl transition-transform duration-300 transform scale-100 hover:scale-110">
                {currentEmoji}
            </div>
            <Slider
                value={mood}
                onValueChange={setMood}
                max={100}
                step={1}
                className="w-[80%]"
                aria-label={`Mood slider, current value ${mood[0]}`}
            />
        </div>
        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log Mood & Get Recommendations
            </Button>
            <Button variant="ghost" onClick={handleMaybeLater}>Maybe later</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
