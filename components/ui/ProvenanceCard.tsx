'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Flame, Check, Copy } from 'lucide-react';

interface ProvenanceCardProps {
  type: 'memory' | 'context' | 'telling';
  title: string;
  badgeLabel: string;
  content: string | string[];
  sourceCitation?: string;
  usedDetails?: string[];
  delay?: number;
}

export default function ProvenanceCard({
  type,
  title,
  badgeLabel,
  content,
  sourceCitation,
  usedDetails,
  delay = 0,
}: ProvenanceCardProps) {
  const [copied, setCopied] = useState(false);

  const getStyle = () => {
    switch (type) {
      case 'memory':
        return {
          border: 'border-l-4 border-l-emerald-400 border-white/10 shadow-glow-green',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
          accentText: 'text-emerald-300',
        };
      case 'context':
        return {
          border: 'border-l-4 border-l-gold border-white/10 shadow-glow-gold',
          badgeBg: 'bg-gold/20 text-amber-200 border-gold/30',
          icon: <BookOpen className="w-4 h-4 text-gold" />,
          accentText: 'text-gold-light',
        };
      case 'telling':
        return {
          border: 'border-l-4 border-l-sky-400 border-white/10 shadow-glow-cyan',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          icon: <Flame className="w-4 h-4 text-sky-400" />,
          accentText: 'text-sky-300',
        };
    }
  };

  const style = getStyle();

  const handleCopy = () => {
    const textToCopy = Array.isArray(content) ? content.join('\n\n') : content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={`relative p-6 sm:p-7 rounded-2xl glass-panel ${style.border} transition-all duration-300 hover:scale-[1.01]`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            {style.icon}
          </div>
          <div>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-semibold border ${style.badgeBg} mb-1`}
            >
              {badgeLabel}
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
              {title}
            </h3>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          title="Copy this section"
          aria-label="Copy section text"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Card Body */}
      <div className="space-y-3">
        {Array.isArray(content) ? (
          content.map((paragraph, i) => (
            <p
              key={i}
              className={`text-sm sm:text-base leading-relaxed ${
                type === 'telling'
                  ? 'font-serif text-amber-100 italic'
                  : 'font-sans text-neutral-200'
              }`}
            >
              {type === 'telling' ? `“${paragraph}”` : paragraph}
            </p>
          ))
        ) : (
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              type === 'telling'
                ? 'font-serif text-amber-100 italic'
                : 'font-sans text-neutral-200'
            }`}
          >
            {type === 'telling' ? `“${content}”` : content}
          </p>
        )}
      </div>

      {/* Used Details Chips (For The Ancestor's Telling) */}
      {usedDetails && usedDetails.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
            Woven Oral Details ({usedDetails.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {usedDetails.map((detail, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-neutral-300 font-sans"
              >
                ✦ {detail}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Source Citation (For Regional Context) */}
      {sourceCitation && (
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-neutral-400 font-sans italic">
          <span className="font-semibold text-gold not-italic">Archival Lineage:</span>
          <span>{sourceCitation}</span>
        </div>
      )}
    </motion.div>
  );
}
