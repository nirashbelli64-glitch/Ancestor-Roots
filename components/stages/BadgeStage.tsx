'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@/components/providers/SessionContext';
import { Award, Camera, Share2, Download, Check, History, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BadgeStage() {
  const {
    scanResult,
    extractedData,
    rootsData,
    blessing,
    capturedImage,
    memoryThread,
    addToMemoryThread,
    resetForNewScan,
    triggerBurst,
  } = useSession();

  const [copied, setCopied] = useState(false);
  const [hasSavedToThread, setHasSavedToThread] = useState(false);

  const badgeTitle = blessing?.badgeTitle || 'Keeper of the Ancestral Flame';
  const badgeDesc =
    blessing?.badgeDescription ||
    'Awarded for preserving the sacred oral history and regional craft heritage of family heirlooms.';

  useEffect(() => {
    triggerBurst();
    try {
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#E100FF', '#F472B6', '#C084FC', '#F7F7F7', '#38BDF8'],
      });
    } catch (err) {
      // Ignored
    }

    // Save to memory thread once
    if (!hasSavedToThread && scanResult) {
      addToMemoryThread({
        id: `thread-${Date.now()}`,
        timestamp: Date.now(),
        objectName: scanResult.object,
        imagePreview: capturedImage || '',
        keyMemory: extractedData?.concreteDetails?.[0] || 'Cherished family memory',
        blessingExcerpt: blessing?.telling?.slice(0, 140) + '...' || 'May the flame guide you.',
        badgeTitle,
        region: rootsData?.region || 'Heritage Roots',
      });
      setHasSavedToThread(true);
    }
  }, [
    triggerBurst,
    hasSavedToThread,
    scanResult,
    capturedImage,
    extractedData,
    blessing,
    rootsData,
    badgeTitle,
    addToMemoryThread,
  ]);

  const handleShare = () => {
    const shareText = `🕊️ Ancestral Blessing Unlocked:\n"${badgeTitle}" for our family ${scanResult?.object || 'heirloom'}.\n\nRooted in ${rootsData?.region || 'living heritage'}.\n— The Ancestor's Test`;

    if (navigator.share) {
      navigator.share({
        title: badgeTitle,
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportScroll = () => {
    const content = `# The Ancestor's Test — Living Heritage Scroll
Object: ${scanResult?.object || 'Family Heirloom'}
Era: ${scanResult?.estimatedEra || 'Undated'}
Region: ${rootsData?.region || 'Global Heritage'}
Badge Unlocked: ${badgeTitle}

## Personal Oral Memory
${blessing?.memory?.join('\n\n') || 'Family memory recorded.'}

## Regional & Craft Lineage
${blessing?.context || 'Archival context recorded.'}
Source: ${rootsData?.source || 'Traditional Living Archives'}

## The Ancestor's Sacred Blessing
"${blessing?.telling || 'May the flame of memory guide all who follow.'}"
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ancestral-scroll-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[90vh] flex flex-col items-center justify-center p-4 py-8 z-10 text-center">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aurora-soft border border-aurora-pink/40 text-pink-200 text-xs font-mono tracking-widest uppercase mb-3 shadow-glow-pink">
          <Award className="w-3.5 h-3.5 text-aurora-pink animate-bounce" />
          <span>Sacred Honor Bestowed</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-wide">
          Ancestral Ember Badge
        </h1>
      </motion.div>

      {/* Central Shimmering Medallion in Pink, Violet & Crystal */}
      <motion.div
        initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 120 }}
        className="relative my-8 flex items-center justify-center"
      >
        {/* Glow Halos */}
        <div className="absolute w-64 h-64 rounded-full bg-aurora-pink/30 blur-3xl pointer-events-none" />
        <div className="absolute w-52 h-52 rounded-full bg-aurora-purple/35 blur-2xl pointer-events-none" />

        {/* Medallion Artwork */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full glass-panel-gold flex items-center justify-center border-4 border-aurora-pink shadow-glow-pink p-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Outer Laurel / Rays */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#E100FF"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke="#C084FC"
              strokeWidth="1.5"
            />

            {/* Radiant Starbursts */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="100"
                y1="12"
                x2="100"
                y2="22"
                stroke="#F7F7F7"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${angle} 100 100)`}
              />
            ))}

            {/* Inner Shield / Hearth */}
            <polygon
              points="100,45 145,70 145,125 100,155 55,125 55,70"
              fill="rgba(225, 0, 255, 0.25)"
              stroke="#C084FC"
              strokeWidth="2"
            />

            {/* Central Living Flame Icon */}
            <path
              d="M100 65 C108 80, 125 90, 120 115 C116 132, 100 140, 100 140 C100 140, 84 132, 80 115 C75 90, 92 80, 100 65 Z"
              fill="url(#auroraGrad)"
            />
            <path
              d="M100 95 C104 105, 112 110, 110 122 C108 130, 100 134, 100 134 C100 134, 92 130, 90 122 C88 110, 96 105, 100 95 Z"
              fill="#FFFFFF"
            />

            <defs>
              <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#E100FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Badge Name & Lore */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-pink-100 tracking-wide mb-2">
          {badgeTitle}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
          {badgeDesc}
        </p>
      </motion.div>

      {/* Primary Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-3 w-full max-w-lg mb-12"
      >
        <button
          onClick={resetForNewScan}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-aurora-pink via-purple-500 to-indigo-500 text-white font-serif font-bold text-sm tracking-wider uppercase shadow-glow-pink hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Scan Another Heirloom</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl glass-panel border border-white/20 text-neutral-200 hover:text-white hover:border-aurora-pink/50 text-sm font-serif transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>

        <button
          onClick={handleExportScroll}
          className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl glass-panel border border-white/20 text-neutral-200 hover:text-white hover:border-aurora-pink/50 text-sm font-serif transition-all cursor-pointer"
          title="Download Living Heritage Markdown Scroll"
        >
          <Download className="w-4 h-4" />
          <span>Export Scroll</span>
        </button>
      </motion.div>

      {/* Memory Thread Section */}
      {memoryThread.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full text-left pt-8 border-t border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-aurora-pink" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                Session Memory Thread ({memoryThread.length})
              </h3>
            </div>
            <span className="text-xs text-pink-300 font-mono">Interconnected Lineage</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memoryThread.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass-panel border border-white/10 flex items-start gap-3 hover:border-aurora-pink/40 transition-colors"
              >
                {item.imagePreview ? (
                  <div
                    className="w-14 h-14 rounded-xl bg-cover bg-center shrink-0 border border-white/20"
                    style={{ backgroundImage: `url(${item.imagePreview})` }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-obsidian-light flex items-center justify-center shrink-0 text-aurora-pink border border-aurora-pink/30">
                    <Shield className="w-6 h-6" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-serif font-bold text-pink-200 truncate">
                      {item.objectName}
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-300 font-mono mb-1">
                    🏅 {item.badgeTitle} • {item.region}
                  </div>
                  <p className="text-xs text-neutral-300 font-sans line-clamp-2 italic">
                    “{item.keyMemory}”
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
