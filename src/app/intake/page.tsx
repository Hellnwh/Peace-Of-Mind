
"use client";

import { ClinicalScreening } from "@/components/sections/clinical-screening";
import { motion } from "framer-motion";

export default function IntakePage() {
  return (
    <div className="min-h-screen sanctuary-sky flex items-center justify-center p-4 py-24">
      <div className="container relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
        >
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-white mb-4">Clinical <span className="text-accent text-glow">Assessment</span></h1>
            <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">Validated screening to help you understand your emotional landscape with scientific clarity.</p>
        </motion.div>
        
        <ClinicalScreening />
      </div>
    </div>
  );
}
