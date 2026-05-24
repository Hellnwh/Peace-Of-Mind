"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SketchCharacterProps {
  stage: "idle" | "getting-up" | "walking" | "tree-growing" | "eating" | "free";
  onClick?: () => void;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

/**
 * SketchCharacter - A human-like hand-drawn spirit.
 * Optimized scaling and edge-locked mystic trees.
 */
export function SketchCharacter({ stage, onClick, sentiment = 'neutral' }: SketchCharacterProps) {
  // Speed multiplier based on sentiment (Vibe Mimicry)
  const speed = sentiment === 'negative' ? 1.4 : sentiment === 'positive' ? 0.75 : 1;

  return (
    <div 
      className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center cursor-pointer group"
      onClick={onClick}
    >
      <AnimatePresence>
        {(stage === "tree-growing" || stage === "eating" || stage === "free" || stage === "walking") && (
          <>
            <motion.svg
              key="tree-left"
              viewBox="0 0 200 200"
              className="fixed left-0 top-1/2 -translate-y-1/2 w-48 h-48 md:w-96 md:h-96 opacity-30 pointer-events-none"
              initial={{ opacity: 0, x: -150 }}
              animate={{ opacity: 0.35, x: 0 }}
              transition={{ duration: 4 * speed, ease: "easeOut" }}
            >
              <motion.path
                d="M50 200 Q40 140 60 100 T30 20"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
              <motion.circle cx="30" cy="20" r="5" fill="rgba(112, 161, 175, 0.5)" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 * speed }} />
            </motion.svg>

            <motion.svg
              key="tree-right"
              viewBox="0 0 200 200"
              className="fixed right-0 top-1/2 -translate-y-1/2 w-48 h-48 md:w-96 md:h-96 opacity-30 pointer-events-none"
              initial={{ opacity: 0, x: 150 }}
              animate={{ opacity: 0.35, x: 0 }}
              transition={{ duration: 4 * speed, ease: "easeOut" }}
            >
              <motion.path
                d="M150 200 Q160 140 140 100 T170 20"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
              <motion.circle cx="170" cy="20" r="5" fill="rgba(112, 161, 175, 0.5)" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 * speed, delay: 1 }} />
            </motion.svg>
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 w-full h-full"
        animate={
          stage === "walking" 
            ? { x: [0, 30], y: [0, -2, 0] }
            : stage === "eating"
            ? { x: 30, y: [0, -4, 0], rotate: [0, -0.5, 0] }
            : stage === "free"
            ? { x: [30, 60, -20, 0], y: [0, -10, 10, 0], rotate: [0, 5, -5, 0] }
            : { y: [-2, 2, -2] }
        }
        transition={{ 
          duration: (stage === "walking" ? 1.8 : stage === "free" ? 18 : 5) * speed, 
          repeat: stage === "walking" ? 0 : Infinity, 
          ease: "easeInOut" 
        }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
        >
          <circle cx="100" cy="45" r="10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M100 55 L100 100" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          <path 
            d={stage === "eating" ? "M100 70 L115 65 L125 55" : "M100 70 L80 85 M100 70 L120 85"} 
            stroke="white" strokeWidth="1.2" strokeLinecap="round" 
          />
          <path 
            d={stage === "idle" ? "M100 100 L90 130 M100 100 L110 130" : "M100 100 L95 140 M100 100 L105 140"} 
            stroke="white" strokeWidth="1.8" strokeLinecap="round"
            animate={stage === "walking" ? { d: ["M100 100 L85 140 M100 100 L105 140", "M100 100 L105 140 M100 100 L85 140"] } : {}}
            transition={{ repeat: Infinity, duration: 1.2 * speed }}
          />
          <circle cx="97" cy="43" r="0.8" fill="white" />
          <circle cx="103" cy="43" r="0.8" fill="white" />
        </svg>
      </motion.div>
    </div>
  );
}