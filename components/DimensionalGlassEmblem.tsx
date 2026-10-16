'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useSpring } from 'framer-motion';

interface DimensionalGlassEmblemProps {
  size?: number;
  className?: string;
  animateSurface?: boolean;
  showOrbit?: boolean;
  showStar?: boolean;
  priority?: boolean;
  interactiveTilt?: boolean;
}

export default function DimensionalGlassEmblem({
  size = 320,
  className = '',
  animateSurface = true,
  showOrbit = true,
  showStar = true,
  priority = true,
  interactiveTilt = true
}: DimensionalGlassEmblemProps) {
  const shouldReduceMotion = useReducedMotion();
  const [starAngle, setStarAngle] = useState(0.85); // initial celestial angle near top-right
  const animFrameRef = useRef<number | null>(null);

  // Mouse interactive tilt state for subtle 3D physical glass depth (without rotating the O off-axis)
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 25 });
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !interactiveTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Keep tilt subtle (+- 6 degrees max) so the O maintains fixed visual orientation
    setRotateX((-y / (rect.height / 2)) * 6);
    setRotateY((x / (rect.width / 2)) * 6);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Continuous celestial orbit for the 4-point star along the tilted ellipse
  useEffect(() => {
    if (shouldReduceMotion || !showStar) return;

    let startTime: number | null = null;
    const duration = 18000; // 18 seconds for an intentional, slow, luxurious celestial glide

    const animateStar = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const angle = 0.85 + (elapsed / duration) * (2 * Math.PI);
      setStarAngle(angle);
      animFrameRef.current = requestAnimationFrame(animateStar);
    };

    animFrameRef.current = requestAnimationFrame(animateStar);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [shouldReduceMotion, showStar]);

  // Ellipse parameters matching the orbital ring in the official logo
  // Viewport: 300 x 300, Center: (150, 150)
  // Semi-major axis: 132, Semi-minor axis: 48, Tilted at -23 degrees
  const cx = 150;
  const cy = 150;
  const rx = 132;
  const ry = 48;
  const tiltDeg = -23;
  const tiltRad = (tiltDeg * Math.PI) / 180;

  // Parametric coordinates on tilted ellipse
  const cosT = Math.cos(starAngle);
  const sinT = Math.sin(starAngle);
  const cosTilt = Math.cos(tiltRad);
  const sinTilt = Math.sin(tiltRad);

  const starX = cx + rx * cosT * cosTilt - ry * sinT * sinTilt;
  const starY = cy + rx * cosT * sinTilt + ry * sinT * cosTilt;

  // 3D Depth: Star is in front when sinT >= 0 (lower half of orbit), behind when sinT < 0
  const isStarInFront = sinT >= 0;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 1. Ambient luxury aura (Pink/Lilac glass + Champagne gold reflections from primary brand palette) */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(247, 231, 233, 0.45) 0%, rgba(223, 195, 229, 0.32) 28%, rgba(229, 195, 120, 0.22) 55%, transparent 72%)',
          filter: 'blur(30px)',
          transform: 'scale(1.2)'
        }}
      />

      {/* 2. Official High-Resolution 3D Glass Symbol Raster Base
          Preserves 100% authentic geometry, champagne bevels, glass reflections, and metallic X */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[85%] h-[85%] transition-transform duration-700">
          <Image
            src="/assets/0xnull-symbol.png"
            alt="0XNULL 3D Glass Symbol"
            fill
            sizes={`${size}px`}
            className="object-contain drop-shadow-[0_12px_32px_rgba(200,157,60,0.18)]"
            priority={priority}
          />
        </div>
      </div>

      {/* 3. Dynamic Vector / SVG Layer for CONTINUOUS 3D SURFACE & ORBITAL MOTION
          - 0/O remains locked in the same position (NO tumbling, NO flipping, NO 2D spin)
          - X remains locked firmly in the center
          - 3D curved outer surface flows continuously around the fixed axis */}
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible relative z-10 pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          {/* Metallic Gold Gradient for Orbit */}
          <linearGradient id="orbitGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2D1" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#C89D3C" />
            <stop offset="100%" stopColor="#967223" />
          </linearGradient>

          {/* Continuous Traveling 3D Glass Refraction Gradient (Pink + Lilac + Champagne) */}
          <linearGradient id="glassWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="20%" stopColor="rgba(247, 231, 233, 0.65)" />
            <stop offset="45%" stopColor="rgba(223, 195, 229, 0.7)" />
            <stop offset="75%" stopColor="rgba(229, 195, 120, 0.55)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.9)" />
          </linearGradient>

          {/* Specular Gold Rim Glint */}
          <linearGradient id="goldRimGlint" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="45%" stopColor="#FFF5D6" />
            <stop offset="55%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Star Sparkle Radial Core */}
          <radialGradient id="starCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FFF2D1" />
            <stop offset="80%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Star Glow Filter */}
          <filter id="starGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#D4AF37" floodOpacity="0.9" />
          </filter>

          {/* Caustic Glow Filter for Glass Ribbon */}
          <filter id="causticGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ==============================================================
            A. THE 3D GLASS O: CONTINUOUS SURFACE ANIMATION
            - O position remains locked in place (NO tumbling, NO coin-flip)
            - Curvature surface reflection sweeps continuously around the 3D loop
            ============================================================== */}
        {animateSurface && !shouldReduceMotion && (
          <g id="o-surface-fluid-dynamics">
            {/* 1. Volumetric Glass Caustic Wave (travels continuously along loop) */}
            <motion.path
              d="M 150 48
                 C 192 48, 206 78, 206 150
                 C 206 222, 192 252, 150 252
                 C 108 252, 94 222, 94 150
                 C 94 78, 108 48, 150 48 Z"
              fill="none"
              stroke="url(#glassWaveGradient)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="170 370"
              animate={{
                strokeDashoffset: [0, -540]
              }}
              transition={{
                repeat: Infinity,
                duration: 8.5,
                ease: 'linear'
              }}
              style={{
                mixBlendMode: 'screen',
                opacity: 0.72,
                filter: 'url(#causticGlow)'
              }}
            />

            {/* 2. Specular Gold Edge Light Traveling Along Outer Ribbon Rim */}
            <motion.path
              d="M 150 44
                 C 195 44, 211 76, 211 150
                 C 211 224, 195 256, 150 256
                 C 105 256, 89 224, 89 150
                 C 89 76, 105 44, 150 44 Z"
              fill="none"
              stroke="#FFF5D6"
              strokeWidth="2.4"
              strokeDasharray="80 470"
              animate={{
                strokeDashoffset: [-550, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6.8,
                ease: 'linear'
              }}
              style={{
                filter: 'drop-shadow(0 0 5px #D4AF37)',
                opacity: 0.85
              }}
            />

            {/* 3. Inner Rim Glass Highlight (Flowing counter-phase to emphasize internal 3D twist) */}
            <motion.path
              d="M 150 82
                 C 174 82, 183 105, 183 150
                 C 183 195, 174 218, 150 218
                 C 126 218, 117 195, 117 150
                 C 117 105, 126 82, 150 82 Z"
              fill="none"
              stroke="rgba(247, 231, 233, 0.8)"
              strokeWidth="2.8"
              strokeDasharray="95 315"
              animate={{
                strokeDashoffset: [0, 410]
              }}
              transition={{
                repeat: Infinity,
                duration: 8.8,
                ease: 'linear'
              }}
              style={{
                mixBlendMode: 'overlay',
                opacity: 0.75
              }}
            />

            {/* 4. Traveling Focal Glint (Simulates a traveling light reflection across the 3D twist) */}
            <motion.circle
              r="3.5"
              fill="#FFFFFF"
              filter="drop-shadow(0 0 6px #FFF2D1)"
              animate={{
                cx: [150, 204, 150, 96, 150],
                cy: [48, 150, 252, 150, 48],
                opacity: [0.3, 0.95, 0.4, 0.9, 0.3]
              }}
              transition={{
                repeat: Infinity,
                duration: 8.5,
                ease: 'easeInOut'
              }}
            />
          </g>
        )}

        {/* ==============================================================
            B. THE ORBITAL RING & CELESTIAL STAR
            - Elegant elliptical orbit tilted at -23 degrees
            - 4-point star smoothly glides along the orbital curve
            - True 3D depth layering: Behind O on upper arc, in front on lower arc
            ============================================================== */}
        {showOrbit && (
          <g id="orbital-system">
            {/* 1. Subtle glowing elliptical path */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="none"
              stroke="url(#orbitGold)"
              strokeWidth="1.8"
              transform={`rotate(${tiltDeg} ${cx} ${cy})`}
              className="opacity-80"
            />

            {/* 2. Soft outer aura on the orbit */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="none"
              stroke="rgba(212, 175, 55, 0.35)"
              strokeWidth="4"
              transform={`rotate(${tiltDeg} ${cx} ${cy})`}
              style={{ filter: 'blur(2.5px)' }}
            />

            {/* 3. Delicate dashed celestial navigation ticks */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx - 3}
              ry={ry - 2}
              fill="none"
              stroke="rgba(212, 175, 55, 0.45)"
              strokeWidth="0.8"
              strokeDasharray="3 9"
              transform={`rotate(${tiltDeg} ${cx} ${cy})`}
            />

            {/* 4. THE CELESTIAL STAR: Glides continuously along the orbit */}
            {showStar && (
              <g
                id="the-celestial-star"
                transform={`translate(${starX}, ${starY})`}
                filter="url(#starGlow)"
                style={{
                  opacity: isStarInFront ? 1 : 0.6,
                  transition: 'opacity 0.25s ease-out'
                }}
              >
                {/* 4-Point Celestial Diamond Star */}
                <path
                  d="M 0 -11 Q 0 -1.5 10 0 Q 0 1.5 0 11 Q 0 1.5 -10 0 Q 0 -1.5 0 -11 Z"
                  fill="url(#starCoreGlow)"
                />

                {/* Sparkling Cross Accent */}
                <line x1="-7" y1="0" x2="7" y2="0" stroke="#FFFFFF" strokeWidth="0.85" />
                <line x1="0" y1="-7" x2="0" y2="7" stroke="#FFFFFF" strokeWidth="0.85" />

                {/* Pure White Core Light Center */}
                <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
              </g>
            )}
          </g>
        )}
      </svg>
    </motion.div>
  );
}
