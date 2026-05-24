
"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles, Star, Moon, Sun, Cloud, Heart, RefreshCw, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

interface MemoryLanternToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const icons = [Sparkles, Star, Moon, Sun, Cloud, Heart];

export function MemoryLanternTool({ open, onOpenChange }: MemoryLanternToolProps) {
  const [cards, setCards] = useState<{id: number, Icon: any, isFlipped: boolean, isMatched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const { toast } = useToast();

  const initGame = useCallback(() => {
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((Icon, index) => ({
        id: index,
        Icon,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    if (open) initGame();
  }, [open, initGame]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;

      if (cards[first].Icon === cards[second].Icon) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            (i === first || i === second) ? { ...card, isMatched: true } : card
          ));
          setFlippedCards([]);
        }, 300);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            (i === first || i === second) ? { ...card, isFlipped: false } : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setIsWon(true);
      toast({
        title: "Magnificent Focus!",
        description: `You restored all lanterns in ${moves} moves.`,
      });
    }
  }, [cards, moves, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-black/95 border-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
        <DialogHeader className="pt-10 px-8">
          <DialogTitle className="text-4xl font-headline text-center text-white flex items-center justify-center gap-3">
            <RefreshCw className="text-accent h-8 w-8" />
            Memory Lanterns
          </DialogTitle>
          <DialogDescription className="text-center text-white/40 text-lg font-light mt-2">
            A restorative exercise for working memory and cognitive focus.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8 px-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Progress</span>
              <span className="text-xl font-headline text-accent">{cards.filter(c => c.isMatched).length / 2} / {icons.length} Matches</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Attempts</span>
              <span className="text-xl font-headline text-white">{moves}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 md:gap-6 perspective-1000">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative h-24 w-full cursor-pointer"
                onClick={() => handleCardClick(index)}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d transition-transform duration-500"
                  animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20" />
                  </div>

                  {/* Back Side */}
                  <div 
                    className={cn(
                      "absolute inset-0 backface-hidden rotate-y-180 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-colors",
                      card.isMatched ? "bg-accent/20 border-accent/50" : "bg-white/10 border-white/20"
                    )}
                  >
                    <card.Icon className={cn("h-10 w-10", card.isMatched ? "text-accent" : "text-white/80")} />
                    {card.isMatched && (
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            className="absolute inset-0 bg-accent rounded-full blur-xl"
                        />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {isWon && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 flex flex-col items-center gap-6"
                >
                    <div className="flex items-center gap-4 px-8 py-4 bg-accent/20 border border-accent/40 rounded-full text-accent font-bold">
                        <Trophy className="h-6 w-6" /> Game Complete
                    </div>
                    <Button onClick={initGame} className="bg-accent text-accent-foreground rounded-2xl h-14 px-10 font-bold text-lg">
                        Play Again
                    </Button>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="px-12 pb-10 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">
                Cognitive Performance Tool &middot; 60 FPS
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
