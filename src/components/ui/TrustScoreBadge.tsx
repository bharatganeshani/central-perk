'use client';

import React, { useEffect, useState } from 'react';

interface TrustScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export default function TrustScoreBadge({ score, size = 'md', showLabel = true }: TrustScoreBadgeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Dimensions
  const sizes = {
    sm: { radius: 18, stroke: 3, text: 'text-xs', sizeClass: 'w-10 h-10' },
    md: { radius: 28, stroke: 4, text: 'text-sm font-bold font-mono', sizeClass: 'w-16 h-16' },
    lg: { radius: 48, stroke: 6, text: 'text-2xl font-bold font-mono', sizeClass: 'w-28 h-28' },
    xl: { radius: 70, stroke: 8, text: 'text-4xl font-extrabold font-mono', sizeClass: 'w-40 h-40' }
  };

  const currentSize = sizes[size];
  const circumference = 2 * Math.PI * currentSize.radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Colors
  const getColor = (s: number) => {
    if (s <= 40) return { stroke: 'stroke-danger', text: 'text-danger', bg: 'bg-danger/10' };
    if (s <= 70) return { stroke: 'stroke-warning', text: 'text-warning', bg: 'bg-warning/10' };
    return { stroke: 'stroke-success', text: 'text-success', bg: 'bg-success/10' };
  };

  const colors = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${currentSize.sizeClass} flex items-center justify-center`}>
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={currentSize.radius}
            className="stroke-slate-800"
            strokeWidth={currentSize.stroke}
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={currentSize.radius}
            className={`${colors.stroke} transition-all duration-1000 ease-out`}
            strokeWidth={currentSize.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        {/* Centered Score */}
        <span className={`absolute ${colors.text} font-mono font-bold`}>
          {animatedScore}
        </span>
      </div>
      {showLabel && size !== 'sm' && (
        <span className="text-[10px] font-mono tracking-widest text-slate-400 mt-1 uppercase">
          Trust Index
        </span>
      )}
    </div>
  );
}
