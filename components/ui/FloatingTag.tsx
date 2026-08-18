'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ARTag } from '@/lib/types';
import { Sparkles, Eye, Hammer, History, ShieldAlert } from 'lucide-react';

interface FloatingTagProps {
  tag: ARTag;
  index: number;
  onSelect?: (tag: ARTag) => void;
}

export default function FloatingTag({ tag, index, onSelect }: FloatingTagProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'craft':
        return <Hammer className="w-3.5 h-3.5 text-amber-400" />;
      case 'era':
        return <History className="w-3.5 h-3.5 text-gold" />;
      case 'wear':
        return <Eye className="w-3.5 h-3.5 text-teal-provenance" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-ember-light" />;
    }
  };

  // Determine offsets based on quadrant to keep cards inside visible area
  const isRightSide = tag.x > 50;
  const isBottomSide = tag.y > 50;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.2, ease: 'easeOut' }}
      style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect && onSelect(tag)}
    >
      {/* Anchor Beacon on the Object */}
      <div className="relative flex items-center justify-center cursor-pointer group">
        <div className="w-3.5 h-3.5 rounded-full bg-ember border-2 border-white/90 shadow-glow-ember z-10" />
        <div className="absolute w-7 h-7 rounded-full bg-ember/30 animate-ping" />
        <div className="absolute w-10 h-10 rounded-full border border-gold/40 animate-pulse-slow" />
      </div>

      {/* Floating Tag Card */}
      <motion.div
        animate={{
          y: isHovered ? (isBottomSide ? -10 : 10) : 0,
          scale: isHovered ? 1.04 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`absolute w-52 sm:w-60 p-3.5 rounded-xl glass-panel shadow-2xl border transition-colors cursor-pointer ${
          isHovered
            ? 'border-ember-light shadow-glow-ember bg-charcoal/90'
            : 'border-white/15 bg-charcoal/70'
        } ${
          isRightSide
            ? '-left-56 sm:-left-64'
            : 'left-6 sm:left-8'
        } ${
          isBottomSide
            ? '-top-28 sm:-top-32'
            : 'top-2'
        }`}
      >
        {/* Header with Icon and Label */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 rounded-md bg-white/5 border border-white/10">
            {getCategoryIcon(tag.category)}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-200 font-serif">
            {tag.label}
          </span>
        </div>

        {/* Sensory Detail Body */}
        <p className="text-xs text-neutral-300 font-sans leading-relaxed line-clamp-3">
          {tag.detail}
        </p>

        {/* Small AR Coordinate indicator */}
        <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
          <span>AR ANCHOR #{index + 1}</span>
          <span className="text-gold/90">{tag.x}%, {tag.y}%</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
