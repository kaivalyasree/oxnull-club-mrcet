'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import DimensionalGlassEmblem from '@/components/DimensionalGlassEmblem';

/**
 * 0XNULL Hero Section & Orchestrated Intro Sequence
 * 
 * Choreographed Staged Entrance:
 * - STEP 1 (0ms): College name stamps smoothly from above on one single desktop line
 * - STEP 2 (750ms): Separate, professionally styled X appears beneath college name
 * - STEP 3 (1450ms): OX enters from LEFT, NULL enters from RIGHT, converging into 0XNULL
 * - STEP 4 (2150ms): Complete 3D glass loop emblem reveals with continuous loop and star
 * - STEP 5 (2850ms): Transition smoothly into homepage (Four-line introduction & Join button)
 * - Settles around ~3.5 seconds total. Non-blocking, automatic on fresh visit.
 */
export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // If reduced motion is requested, render the completed composition immediately
    if (shouldReduceMotion) {
      setStage(5);
      return;
    }

    // Check if the user has already experienced the intro this browser session
    const hasSeenIntro = typeof window !== 'undefined' ? sessionStorage.getItem('oxnull_intro_seen') : null;
    if (hasSeenIntro) {
      setStage(5);
      return;
    }

    // Execute the choreographed sequence
    const timers = [
      setTimeout(() => setStage(1), 50),
      setTimeout(() => setStage(2), 750),
      setTimeout(() => setStage(3), 1450),
      setTimeout(() => setStage(4), 2150),
      setTimeout(() => setStage(5), 2850),
      setTimeout(() => {
        try {
          sessionStorage.setItem('oxnull_intro_seen', 'true');
        } catch (_) {}
      }, 3600)
    ];

    return () => timers.forEach(clearTimeout);
  }, [shouldReduceMotion]);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-8 pb-16 px-4 sm:px-6 select-none overflow-hidden">
      {/* Ambient background radiance layers */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[920px] h-[720px] bg-gradient-to-tr from-[#F7D8E0]/45 via-[#F5E2C8]/50 to-[#E8D4F0]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* ====================================================================
            STEP 1 — COLLEGE NAME ENTERS FROM ABOVE
            - Complete institution name on ONE SINGLE LINE on desktop
            - NO white box, NO card background, NO border, NO container fill
            - Rendered directly over the website's gradient background
            - Center horizontally above the X and 0XNULL logo
            - Smooth stamp-like entrance
            ==================================================================== */}
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 1.04 }}
          animate={stage >= 1 ? { y: 0, opacity: 1, scale: 1 } : { y: -80, opacity: 0, scale: 1.04 }}
          transition={{
            y: { type: 'spring', damping: 18, stiffness: 220, mass: 0.8 },
            opacity: { duration: 0.55 },
            scale: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
          }}
          className="w-full text-center px-2 sm:px-4"
        >
          <h1 className="text-[#151417] font-black uppercase text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] tracking-[0.05em] sm:tracking-[0.10em] lg:tracking-[0.15em] whitespace-normal lg:whitespace-nowrap transition-all drop-shadow-xs">
            MALLA REDDY COLLEGE OF ENGINEERING AND TECHNOLOGY
          </h1>
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89D3C]" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.24em] uppercase text-[#967223]">
              Department of Cyber Security • Autonomous Institution
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89D3C]" />
          </div>
        </motion.div>

        {/* ====================================================================
            STEP 2 — X APPEARS BELOW THE COLLEGE NAME
            - Professionally designed geometric / typographic symbol
            - Balanced proportions, appropriate visual weight
            - NO connecting line or stem to college name or logo
            - Does NOT distort or replace the original 0XNULL logo
            ==================================================================== */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0, rotate: -25 }}
          animate={stage >= 2 ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0.2, opacity: 0, rotate: -25 }}
          transition={{
            type: 'spring',
            damping: 18,
            stiffness: 240,
            mass: 0.85
          }}
          className="my-5 sm:my-6 flex items-center justify-center select-none"
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_4px_12px_rgba(200,157,60,0.32)]"
            aria-label="X delimiter"
          >
            <defs>
              <linearGradient id="luxuryGoldXGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5E2C8" />
                <stop offset="25%" stopColor="#D4AF37" />
                <stop offset="65%" stopColor="#C89D3C" />
                <stop offset="100%" stopColor="#8C6518" />
              </linearGradient>
            </defs>
            <path
              d="M7.5 10.5C6.4 9.4 6.4 7.6 7.5 6.5C8.6 5.4 10.4 5.4 11.5 6.5L20 15L28.5 6.5C29.6 5.4 31.4 5.4 32.5 6.5C33.6 7.6 33.6 9.4 32.5 10.5L24 19L32.5 27.5C33.6 28.6 33.6 30.4 32.5 31.5C31.4 32.6 29.6 32.6 28.5 31.5L20 23L11.5 31.5C10.4 32.6 8.6 32.6 7.5 31.5C6.4 30.4 6.4 28.6 7.5 27.5L16 19L7.5 10.5Z"
              fill="url(#luxuryGoldXGrad)"
            />
          </svg>
        </motion.div>

        {/* ====================================================================
            STEP 3 & STEP 4 — OXNULL EMBLEM REVEAL & WORDMARK CONVERGENCE
            - Step 4: Reveal original 3D glass loop emblem and orbiting star
            - Step 3: OX enters from the LEFT, NULL enters from the RIGHT
            - Both converge smoothly into exact final positions reading OXNULL
            - Original logo proportions, typography, and colors preserved
            ==================================================================== */}
        <div className="flex flex-col items-center justify-center w-full">
          {/* Authentic 3D Glass Emblem with Continuous Surface & Orbiting Star (Step 4 Reveal) */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, filter: 'blur(8px)' }}
            animate={stage >= 4 ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : { scale: 0.85, opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex items-center justify-center"
          >
            <DimensionalGlassEmblem
              size={270}
              animateSurface={true}
              showOrbit={true}
              showStar={true}
              priority={true}
              interactiveTilt={true}
            />
          </motion.div>

          {/* Official 0XNULL Wordmark Assembly from opposite directions (Step 3 Convergence) */}
          <div className="relative z-20 mt-2 sm:mt-3 flex items-center justify-center gap-1 sm:gap-2 overflow-hidden">
            {/* OX enters from the LEFT */}
            <motion.div
              initial={{ x: -160, opacity: 0 }}
              animate={stage >= 3 ? { x: 0, opacity: 1 } : { x: -160, opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-12 sm:h-16 md:h-18 w-28 sm:w-40 md:w-48"
            >
              <Image
                src="/assets/0xnull-wm-0x.png"
                alt="0X"
                fill
                className="object-contain object-right"
                priority
              />
            </motion.div>

            {/* NULL enters from the RIGHT */}
            <motion.div
              initial={{ x: 160, opacity: 0 }}
              animate={stage >= 3 ? { x: 0, opacity: 1 } : { x: 160, opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-12 sm:h-16 md:h-18 w-36 sm:w-52 md:w-64"
            >
              <Image
                src="/assets/0xnull-wm-null.png"
                alt="NULL"
                fill
                className="object-contain object-left"
                priority
              />
            </motion.div>
          </div>

          {/* Club Identity Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={stage >= 3 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-2"
          >
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.32em] uppercase text-[#967223]">
              CYBERSECURITY CLUB
            </span>
          </motion.div>

          {/* ====================================================================
              STEP 5 — TRANSITION INTO THE HOMEPAGE
              - Four-line club introduction
              - Followed by Join the Club button
              - Smooth fade and slide entrance into document flow
              ==================================================================== */}
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={stage >= 5 ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
            {/* EXACT FOUR-LINE CLUB INTRODUCTION */}
            <div className="mt-6 sm:mt-7 max-w-3xl mx-auto px-4 text-center space-y-2 select-text">
              <p className="text-xs sm:text-sm md:text-[15px] font-medium text-[#2A2830] leading-relaxed">
                OXNULL is a cybersecurity club dedicated to exploring security, building practical skills, and understanding the technologies that protect the digital world.
              </p>
              <p className="text-xs sm:text-sm md:text-[15px] font-medium text-[#2A2830] leading-relaxed">
                We encourage curiosity, ethical experimentation, collaborative learning, and hands-on technical growth.
              </p>
              <p className="text-xs sm:text-sm md:text-[15px] font-medium text-[#2A2830] leading-relaxed">
                From security testing and digital forensics to cryptography, cloud security, and security architecture, members can explore multiple areas of cybersecurity.
              </p>
              <p className="text-xs sm:text-sm md:text-[15px] font-medium text-[#2A2830] leading-relaxed">
                Learn together, develop practical expertise, and turn your interest in cybersecurity into meaningful technical experience.
              </p>
            </div>

            {/* PRIMARY JOIN THE CLUB BUTTON */}
            <div className="pt-7 sm:pt-8">
              <Link
                href="/domains"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C89D3C] transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.03] border border-[#D4AF37]/40 group cursor-pointer"
              >
                <span>Join the Club</span>
                <ArrowRight className="w-4 h-4 text-[#E5C378] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
