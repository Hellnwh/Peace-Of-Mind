"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { interactWithSketchMan } from "@/app/actions";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { Loader2, Send, X, Sparkles } from "lucide-react";

interface SketchInteractionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onStageChange: (stage: any) => void;
  onSentimentChange: (sentiment: 'positive' | 'negative' | 'neutral') => void;
}

export function SketchInteractionOverlay({ isOpen, onClose, onStageChange, onSentimentChange }: SketchInteractionOverlayProps) {
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user', text: string, wisdomSeed?: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<'greeting' | 'reflection' | 'assessment'>('greeting');
  
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleInitialGreeting();
    }
  }, [isOpen]);

  const handleInitialGreeting = async () => {
    setIsLoading(true);
    try {
      const response = await interactWithSketchMan({ 
        userMessage: "Peace", 
        interactionStage: 'greeting',
        history: []
      });
      
      setMessages([{ sender: 'bot', text: response.botMessage, wisdomSeed: response.wisdomSeed }]);
      onStageChange("walking");
      setTimeout(() => onStageChange("eating"), 2000);
      onSentimentChange(response.sentiment);
    } catch (e) {
      setMessages([{ sender: 'bot', text: "I'm resting briefly... Please, feel free to sit with me for a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await interactWithSketchMan({ 
        userMessage: userText, 
        interactionStage: currentStage,
        history: []
      });

      setMessages(prev => [...prev, { sender: 'bot', text: response.botMessage, wisdomSeed: response.wisdomSeed }]);
      onSentimentChange(response.sentiment);
      
      if (response.nextStage === 'complete') {
        onStageChange("free");
        setTimeout(onClose, 15000);
      } else {
        setCurrentStage(response.nextStage as any);
      }
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'bot', text: "The sanctuary is very quiet right now. Let's just sit for a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
      <div className="relative w-full h-full max-w-5xl p-8 md:p-12 flex flex-col justify-end">
        
        <div className="flex-1 relative flex flex-col justify-center items-center pointer-events-auto">
          <AnimatePresence mode="popLayout">
            {messages.slice(-2).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -40 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`relative mb-8 group ${msg.sender === 'bot' ? 'self-start ml-4 md:ml-12' : 'self-end mr-4 md:mr-12'}`}
              >
                <div className={`p-8 md:p-10 rounded-[3rem] shadow-2xl relative ${
                  msg.sender === 'bot' 
                    ? 'bg-white/10 text-accent backdrop-blur-2xl border border-white/20' 
                    : 'bg-accent/15 text-white backdrop-blur-2xl border border-accent/30'
                }`}>
                   <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-inherit" />
                   <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full bg-inherit" />
                   
                   <p className="relative z-10 text-xl md:text-2xl font-light italic leading-relaxed max-w-xl">
                     {msg.text}
                   </p>

                   {msg.wisdomSeed && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 pt-6 border-t border-white/10 text-xs md:text-sm text-accent font-bold tracking-[0.2em] uppercase flex items-center gap-3"
                     >
                       <Sparkles className="h-5 w-5 text-accent animate-pulse" /> {msg.wisdomSeed}
                     </motion.div>
                   )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start ml-12">
                <div className="p-8 rounded-full bg-white/5 backdrop-blur-md border border-white/5">
                  <Loader2 className="h-6 w-6 animate-spin text-accent/60" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative pointer-events-auto mt-6">
          <div className="flex justify-center gap-6 mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12 text-white/30 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </Button>
          </div>

          {currentStage !== 'complete' && (
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-6 max-w-3xl mx-auto mb-4"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your unspoken thoughts..."
                className="h-16 bg-white/5 border-white/10 rounded-full text-lg md:text-xl px-12 focus:ring-accent backdrop-blur-xl transition-all"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()}
                className="h-16 w-16 min-w-[4rem] rounded-full bg-accent text-accent-foreground shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="h-6 w-6" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
