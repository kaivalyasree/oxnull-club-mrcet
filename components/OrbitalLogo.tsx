'use client';

import React from 'react';
import DimensionalGlassEmblem from './DimensionalGlassEmblem';

interface OrbitalLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function OrbitalLogo({
  size = 280,
  className = '',
  showText = false
}: OrbitalLogoProps) {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <DimensionalGlassEmblem
        size={size}
        animateSurface={true}
        showOrbit={true}
        showStar={true}
        priority={false}
      />
      {showText && (
        <div className="mt-3 text-center">
          <div className="text-xl font-black tracking-[0.2em] text-[#151417]">
            0X<span className="text-[#C89D3C]">NULL</span>
          </div>
        </div>
      )}
    </div>
  );
}
