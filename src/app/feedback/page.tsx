"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim() === "") {
        toast({ variant: "destructive", title: "Oops!", description: "Please enter your feedback before submitting." });
        return;
    }
    // In a real app, you'd send this to a server
    console.log("Feedback submitted:", feedback);
    toast({ title: "Thank You!", description: "Your feedback has been submitted." });
    setFeedback("");
  };

  return (
    <section className="container py-12 md:py-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Share Your Feedback</CardTitle>
          <CardDescription>We value your thoughts on how to make PeaceMind better. What can we improve?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <Label htmlFor="feedback-text">Your Feedback</Label>
                <Textarea
                    id="feedback-text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you think..."
                    className="min-h-[150px]"
                />
            </div>
            <Button type="submit" className="w-full">Submit Feedback</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
