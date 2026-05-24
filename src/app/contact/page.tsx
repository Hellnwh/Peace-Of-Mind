"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const { toast } = useToast();
  const [formState, setFormState] = useState({ name: '', email: '', message: ''});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!formState.name || !formState.email || !formState.message) {
        toast({ variant: "destructive", title: "Oops!", description: "Please fill out all fields." });
        return;
    }
    // In a real app, you'd send this to a server
    console.log("Contact form submitted:", formState);
    toast({ title: "Message Sent!", description: "Thank you for reaching out. We'll get back to you soon." });
    setFormState({ name: '', email: '', message: ''});
  };

  return (
    <section className="container py-12 md:py-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Contact Us</CardTitle>
          <CardDescription>Have a question or a partnership inquiry? We'd love to hear from you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" placeholder="Your Name" value={formState.name} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="your.email@example.com" value={formState.email} onChange={handleChange} />
            </div>
             <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    className="min-h-[150px]"
                />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
