"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Save, Loader2, Sparkles } from "lucide-react";
import { getJournalPrompt, checkDistress } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { EmergencyModal } from "../emergency-modal";
import { useUser, useFirestore, addDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface JournalToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InsightGlowflies() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-accent/40 blur-[2px]"
          animate={{
            x: [Math.random() * 400, Math.random() * 400],
            y: [Math.random() * 300, Math.random() * 300],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function JournalTool({ open, onOpenChange }: JournalToolProps) {
  const [entry, setEntry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [diversionText, setDiversionText] = useState("");
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const profileRef = useMemoFirebase(() => 
    user && db ? doc(db, "users", user.uid) : null
  , [user, db]);
  const { data: profile } = useDoc(profileRef);

  useEffect(() => {
    if (!open) {
        setEntry(""); 
        setDiversionText("");
    }
  }, [open]);

  useEffect(() => {
    if (!entry || entry.length < 20) return;
    
    const handler = setTimeout(async () => {
        const { isSevereDistress, diversionMessage } = await checkDistress(entry);
        if (isSevereDistress) {
            setIsEmergency(true);
            setDiversionText(diversionMessage || "");
            
            if (user && db) {
                const alertRef = collection(db, "distressAlerts");
                addDocumentNonBlocking(alertRef, {
                    userId: user.uid,
                    userPhone: profile?.phoneNumber || 'Not provided',
                    triggerContent: entry,
                    status: 'pending',
                    timestamp: serverTimestamp()
                });
            }
        }
    }, 2000);

    return () => clearTimeout(handler);
  }, [entry, user, db, profile]);
  
  const handleGetPrompt = async () => {
    setIsLoading(true);
    try {
      const result = await getJournalPrompt(entry);
      setEntry(prev => `${prev}\n\n[Restorative Prompt]: ${result.aiPrompt}`);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not retrieve prompt." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!user || !db || entry.trim() === "") return;
    const notesCollection = collection(db, `users/${user.uid}/stickyNotes`);
    addDocumentNonBlocking(notesCollection, {
        userId: user.uid,
        content: entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    toast({ title: "Saved!", description: "Your journal entry has been saved securely." });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl overflow-hidden glass border-white/5">
          <InsightGlowflies />
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Private Journal</DialogTitle>
            <DialogDescription>A clinical space for self-reflection and tracking neuro-patterns.</DialogDescription>
          </DialogHeader>
          
          {isUserLoading ? (
            <div className="min-h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent"/>
            </div>
          ) : user ? (
            <>
                <AnimatePresence>
                {diversionText && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg mb-4 text-red-400 font-medium relative z-10"
                    >
                        {diversionText}
                    </motion.div>
                )}
                </AnimatePresence>
                <Textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="Write freely... track your thoughts, focus levels, and moods."
                    className="min-h-[300px] my-4 text-base relative z-10 bg-white/5 border-white/10"
                />
                <DialogFooter className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
                    <Button onClick={handleGetPrompt} disabled={isLoading} variant="outline" className="glass border-accent/20">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                      New Prompt
                    </Button>
                    <Button onClick={handleSave} className="bg-accent text-accent-foreground">
                      <Save className="mr-2 h-4 w-4" /> Save Entry
                    </Button>
                    <Button variant="secondary" onClick={() => setEntry("")}>
                      <Trash2 className="mr-2 h-4 w-4" /> Clear
                    </Button>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </>
          ) : (
             <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6 bg-secondary rounded-md my-4 relative z-10">
                <p className="text-muted-foreground mb-4">Please log in to save your clinical reflections.</p>
                <Button asChild onClick={() => onOpenChange(false)}>
                    <Link href="/login">Login or Sign Up</Link>
                </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <EmergencyModal open={isEmergency} onOpenChange={setIsEmergency} />
    </>
  );
}
