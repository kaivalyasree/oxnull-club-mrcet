'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import DimensionalGlassEmblem from './DimensionalGlassEmblem';

/**
 * 0XNULL Compact Non-Blocking Intro Sequence
 * - Target duration: ~2.2 seconds
 * - Never blocks page interaction (pointer-events-none)
 * - Automatically plays once per browser session (sessionStorage)
 * - Respects prefers-reduced-motion
 * - Sequential: (1) College Name Stamp -> (2) Elegant X -> (3) 0XNULL 3D Emblem & Wordmark
 */
export default function LoadingScreen() {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // Run intro sequence strictly once per browser session
    const hasSeenIntro = typeof window !== 'undefined' ? sessionStorage.getItem('0xnull_intro_seen') : null;
    if (!hasSeenIntro) {
      setIsVisible(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('0xnull_intro_seen', 'true');
      }

      if (shouldReduceMotion) {
        // Fast transition for reduced motion
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 500);
        return () => clearTimeout(timer);
      }

      // Compact, fast ~2.2 second progression:
      // Stage 1 (50ms): College name stamps down
      // Stage 2 (650ms): Luminous metallic X emerges
      // Stage 3 (1300ms): Official 0XNULL 3D emblem and wordmark assemble
      // Exit (2200ms): Smooth fade out into the active application
      const timers = [
        setTimeout(() => setStage(1), 50),
        setTimeout(() => setStage(2), 650),
        setTimeout(() => setStage(3), 1300),
        setTimeout(() => setIsVisible(false), 2200)
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [shouldReduceMotion]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2]/95 backdrop-blur-md select-none overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 30%, rgba(247, 231, 233, 0.55) 0%, transparent 55%),
              radial-gradient(circle at 20% 80%, rgba(245, 235, 221, 0.55) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(235, 225, 240, 0.45) 0%, transparent 50%)
            `
          }}
          aria-live="polite"
        >
          {/* Ambient Lighting & Refraction Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-radial from-[#F7E7E9]/45 via-[#F5EBDD]/35 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-3xl mx-auto px-6 flex flex-col items-center justify-center text-center">
            {/* STAGE 1: College Name — Physical descending stamp */}
            <AnimatePresence>
              {stage >= 1 && stage < 3 && (
                <motion.div
                  initial={{ opacity: 0, y: -45, scale: 1.05 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      y: { type: 'spring', damping: 20, stiffness: 220, mass: 0.9 },
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                    }
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    y: -10,
                    transition: { duration: 0.35, ease: 'easeInOut' }
                  }}
                  className="space-y-3"
                >
                  <div className="inline-block px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E8D8C3] shadow-xs">
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.24em] uppercase text-[#967223]">
                      Department of Cyber Security • Autonomous Institution
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#151417] tracking-tight leading-snug drop-shadow-xs max-w-2xl mx-auto">
                    Malla Reddy College of Engineering and Technology
                  </h1>

                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C89D3C] to-transparent mx-auto mt-2" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* STAGE 2: Elegant Metallic X */}
            <AnimatePresence>
              {stage === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.2, filter: 'blur(4px)' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 flex items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/90 border border-[#D4AF37]/50 shadow-[0_4px_16px_rgba(200,157,60,0.25)] flex items-center justify-center backdrop-blur-md">
                    <span className="font-serif italic font-light text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-[#D4AF37] via-[#C89D3C] to-[#8C6518] leading-none">
                      ✕
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STAGE 3: Original 0XNULL 3D Logo & Wordmark Assembly */}
            <AnimatePresence>
              {stage >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center"
                >
                  {/* Official 3D Glass Loop Emblem */}
                  <div className="relative">
                    <DimensionalGlassEmblem
                      size={220}
                      animateSurface={true}
                      showOrbit={true}
                      showStar={true}
                      priority={true}
                    />
                  </div>

                  {/* Wordmark Assembly (0X from LEFT, NULL from RIGHT) */}
                  <div className="relative mt-3 h-14 sm:h-16 flex items-center justify-center overflow-visible">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-1 sm:gap-2"
                    >
                      {/* 0X enters from LEFT */}
                      <motion.div
                        initial={shouldReduceMotion ? { opacity: 1 } : { x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="relative h-10 sm:h-14 w-24 sm:w-36"
                      >
                        <Image
                          src="/assets/0xnull-wm-0x.png"
                          alt="0X"
                          fill
                          className="object-contain object-right"
                          priority
                        />
                      </motion.div>

                      {/* NULL enters from RIGHT */}
                      <motion.div
                        initial={shouldReduceMotion ? { opacity: 1 } : { x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="relative h-10 sm:h-14 w-32 sm:w-48"
                      >
                        <Image
                          src="/assets/0xnull-wm-null.png"
                          alt="NULL"
                          fill
                          className="object-contain object-left"
                          priority
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
