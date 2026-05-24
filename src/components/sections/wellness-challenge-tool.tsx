"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WellnessChallengeToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const challenges = [
    {
        id: "anxiety-reset",
        title: "7-Day Anxiety Reset",
        description: "A week-long challenge to calm your mind and build resilience against anxiety.",
        tasks: [
            "Day 1: Practice 5 minutes of mindful breathing.",
            "Day 2: Write down 3 things you are grateful for.",
            "Day 3: Go for a 15-minute walk without your phone.",
            "Day 4: Do a digital detox for 1 hour before bed.",
            "Day 5: Listen to a calming playlist or podcast.",
            "Day 6: Connect with a friend or family member.",
            "Day 7: Reflect on your week and acknowledge your progress.",
        ],
    },
];

export function WellnessChallengeTool({ open, onOpenChange }: WellnessChallengeToolProps) {
  const [activeChallenge] = useState(challenges[0]);
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const savedProgress = localStorage.getItem(`challenge_${activeChallenge.id}`);
      if (savedProgress) {
        setCompletedTasks(JSON.parse(savedProgress));
      } else {
        setCompletedTasks(new Array(activeChallenge.tasks.length).fill(false));
      }
    }
  }, [open, activeChallenge.id]);
  
  const handleTaskToggle = (index: number) => {
    const newCompletedTasks = [...completedTasks];
    newCompletedTasks[index] = !newCompletedTasks[index];
    setCompletedTasks(newCompletedTasks);
    localStorage.setItem(`challenge_${activeChallenge.id}`, JSON.stringify(newCompletedTasks));

    const newProgress = (newCompletedTasks.filter(Boolean).length / activeChallenge.tasks.length) * 100;
    if(newProgress === 100) {
        toast({
            title: "Challenge Complete!",
            description: `You've completed the ${activeChallenge.title}. Great job!`,
        });
        localStorage.setItem(`challenge_completed_${activeChallenge.id}`, "true");
    }
  };

  const progress = (completedTasks.filter(Boolean).length / activeChallenge.tasks.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Wellness Challenges</DialogTitle>
          <DialogDescription>
            Commit to a small challenge to build healthy habits.
          </DialogDescription>
        </DialogHeader>
        
        <Card className="my-4 border-accent">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                    <Trophy className="h-6 w-6" />
                    {activeChallenge.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">{activeChallenge.description}</p>
                <div className="space-y-4">
                    {activeChallenge.tasks.map((task, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <Checkbox 
                                id={`task-${index}`} 
                                checked={completedTasks[index]}
                                onCheckedChange={() => handleTaskToggle(index)}
                                className="border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                            />
                            <Label htmlFor={`task-${index}`} className={`flex-1 ${completedTasks[index] ? 'line-through text-muted-foreground' : ''}`}>
                                {task}
                            </Label>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <Label className="mb-2 block">Your Progress</Label>
                    <Progress value={progress} className="w-full [&>*]:bg-accent" />
                    <p className="text-sm text-muted-foreground mt-2 text-center">{Math.round(progress)}% complete</p>
                </div>
            </CardContent>
        </Card>

        <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
