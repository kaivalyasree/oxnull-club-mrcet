'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import DimensionalGlassEmblem from './DimensionalGlassEmblem';
import { RotateCcw, Sparkles } from 'lucide-react';

interface HeroAnimationProps {
  onComplete?: () => void;
  standalone?: boolean;
}

export default function HeroAnimation({ onComplete, standalone = false }: HeroAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  const [animationKey, setAnimationKey] = useState(0);
  const [sequenceStep, setSequenceStep] = useState<number>(1);

  const handleReplay = () => {
    setSequenceStep(1);
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div
      key={animationKey}
      className={`relative flex flex-col items-center justify-center text-center select-none w-full overflow-hidden ${
        standalone ? 'min-h-[580px] py-16' : 'py-8'
      }`}
    >
      {/* ==============================================================
          STEP 1: Soft Premium Background Radiance
          ============================================================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-[#F7E7E9]/35 via-[#F5EBDD]/40 to-[#EBE1F0]/30 rounded-full blur-3xl" />
      </motion.div>

      {/* ==============================================================
          STEP 2: Very subtle translucent wave entering from the LEFT
          (Only Pink, Lilac, Champagne, Gold, Ivory Palette)
          ============================================================== */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '0%', opacity: [0, 0.55, 0.35] }}
        transition={{ duration: 2.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/3 left-0 w-2/3 h-48 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(247, 231, 233, 0.45) 0%, rgba(235, 225, 240, 0.25) 45%, transparent 75%)',
          filter: 'blur(32px)'
        }}
      />

      {/* ==============================================================
          STEP 3: Very subtle translucent wave entering from the RIGHT
          (Only Champagne, Gold, Blush Palette)
          ============================================================== */}
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: '0%', opacity: [0, 0.55, 0.35] }}
        transition={{ duration: 2.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 right-0 w-2/3 h-52 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 50%, rgba(229, 195, 120, 0.32) 0%, rgba(247, 231, 233, 0.3) 50%, transparent 75%)',
          filter: 'blur(34px)'
        }}
      />

      {/* ==============================================================
          STEPS 4 - 8: 3D GLASS 0XNULL SYMBOL EMERGES & SETTLES
          - Step 4: 3D Glass Symbol emerges/pops up into center
          - Step 5: Dimensional O continuous 3D surface animation activates
          - Step 6: X settles into position
          - Step 7: Orbital ring appears
          - Step 8: Star travels into position along orbit
          ============================================================== */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.82, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 1.4,
          delay: 0.6,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="relative z-10 flex justify-center"
      >
        <DimensionalGlassEmblem
          size={290}
          animateSurface={true}
          showOrbit={true}
          showStar={true}
          priority={true}
        />
      </motion.div>

      {/* ==============================================================
          STEP 9: THE WORDMARK ANIMATION
          "0X" enters elegantly from the LEFT
          "NULL" enters elegantly from the RIGHT
          They converge and lock together: 0XNULL
          (NO EXPLORE / SECURE / BUILD under the logo lockup!)
          (NO THE CYBERSECURITY CLUB under the logo lockup!)
          ============================================================== */}
      <div className="relative z-20 mt-3 flex items-center justify-center overflow-visible px-4 py-2">
        {/* Soft gold glint sweep across convergence point */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.7, 0], scaleX: [0.1, 1.3, 0.8] }}
          transition={{ duration: 1.4, delay: 2.1, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5C378]/35 to-transparent blur-md pointer-events-none"
        />

        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {/* '0X' entering elegantly from the LEFT */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { x: -140, opacity: 0, filter: 'blur(8px)' }}
            animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{
              duration: 1.1,
              delay: 1.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative h-12 sm:h-16 md:h-20 w-32 sm:w-44 md:w-56"
          >
            <Image
              src="/assets/0xnull-wm-0x.png"
              alt="0X"
              fill
              className="object-contain object-right drop-shadow-sm"
              priority
            />
          </motion.div>

          {/* 'NULL' entering elegantly from the RIGHT */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { x: 140, opacity: 0, filter: 'blur(8px)' }}
            animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{
              duration: 1.1,
              delay: 1.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            onAnimationComplete={() => {
              setSequenceStep(10);
              if (onComplete) onComplete();
            }}
            className="relative h-12 sm:h-16 md:h-20 w-44 sm:w-60 md:w-80"
          >
            <Image
              src="/assets/0xnull-wm-null.png"
              alt="NULL"
              fill
              className="object-contain object-left drop-shadow-sm"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* ==============================================================
          STEP 10: REPLAY CONTROL & LUXURY SIGNATURE
          Notice: ABSOLUTELY NO TAGLINE LOCKUP!
          ============================================================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.5 }}
        className="mt-3 flex items-center justify-center gap-2"
      >
        <button
          onClick={handleReplay}
          title="Replay 0XNULL Emblem Motion"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold text-[#8C6B1B] hover:text-[#151417] bg-[#FAF7F2] hover:bg-[#F5EBDD] transition-all cursor-pointer border border-[#E8D8C3]/80 shadow-xs group"
        >
          <RotateCcw className="w-2.8 h-2.8 group-hover:-rotate-90 transition-transform duration-300" />
          <span>Replay Intro</span>
        </button>
      </motion.div>
    </div>
  );
}
