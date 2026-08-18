'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@/components/providers/SessionContext';
import ProvenanceCard from '@/components/ui/ProvenanceCard';
import AncestorVoice from '@/components/ui/AncestorVoice';
import { Sparkles, Award, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BlessingStage() {
  const {
    scanResult,
    extractedData,
    rootsData,
    blessing,
    setStage,
    triggerBurst,
  } = useSession();

  useEffect(() => {
    triggerBurst();
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E100FF', '#F472B6', '#C084FC', '#F7F7F7', '#38BDF8'],
      });
    } catch (err) {
      // Ignored if confetti is not available
    }
  }, [triggerBurst]);

  const handleClaimBadge = () => {
    setStage('badge');
  };

  const safeBlessing = blessing || {
    memory: [
      'You spoke of the love and memories preserved across family gatherings.',
      'In your words, this heirloom stands as an enduring beacon of roots.',
    ],
    context: rootsData?.fact || 'Generations have kept this sacred craft unbroken across historical migrations.',
    telling: `By the eternal hearth of the Ancestors, this ${scanResult?.object || 'heirloom'} stands witness. The hands that shaped it and the hearts that guarded it speak through you now. May the flame of your memory guide the steps of all who follow.`,
    usedDetails: extractedData?.concreteDetails || ['Family Sanctuary', 'Living Memory'],
    badgeTitle: 'Keeper of the Ancestral Flame',
    badgeDescription: 'Honoring the living oral history woven across generations.',
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[90vh] flex flex-col items-center justify-center p-4 py-8 z-10">
      {/* Top Blessing Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aurora-soft border border-aurora-pink/30 text-pink-200 text-xs font-mono tracking-widest uppercase mb-3 shadow-glow-pink">
          <Sparkles className="w-3.5 h-3.5 text-aurora-pink" />
          <span>Provenance-Labeled Blessing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-white tracking-wide mb-2">
          The Ancestor&apos;s Covenant
        </h1>
        <p className="text-xs sm:text-sm text-pink-200/85 font-sans max-w-xl mx-auto">
          Every word has provenance. Three distinct voices weave together into a permanent family heirloom blessing.
        </p>
      </motion.div>

      {/* Spoken TTS Voice Controller */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-xl mb-8"
      >
        <AncestorVoice
          text={`${safeBlessing.telling} Spoken for the ${scanResult?.object || 'sacred heirloom'}.`}
          autoPlay={true}
        />
      </motion.div>

      {/* 3-Tier Provenance Sections */}
      <div className="w-full space-y-6 mb-10">
        {/* Tier 1: 🟢 Your Memory */}
        <ProvenanceCard
          type="memory"
          title="Your Spoken Oral Memory"
          badgeLabel="🟢 PERSONAL PROVENANCE"
          content={safeBlessing.memory}
          delay={0.3}
        />

        {/* Tier 2: 📚 Regional Context */}
        <ProvenanceCard
          type="context"
          title={`Archival Roots: ${rootsData?.region || 'Heritage Lineage'}`}
          badgeLabel="📚 REGIONAL CONTEXT"
          content={safeBlessing.context}
          sourceCitation={rootsData?.source}
          delay={0.5}
        />

        {/* Tier 3: 🔵 The Ancestor's Telling */}
        <ProvenanceCard
          type="telling"
          title="The Ancestor's Lyrical Blessing"
          badgeLabel="🔵 SACRED SYNTHESIS"
          content={safeBlessing.telling}
          usedDetails={safeBlessing.usedDetails}
          delay={0.7}
        />
      </div>

      {/* Provenance Legend Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="w-full p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-300 font-sans mb-8"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-aurora-purple" />
          <span className="font-semibold text-white">Provenance Guarantee:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Personal Truth (No hallucination)
          </span>
          <span className="flex items-center gap-1.5 text-purple-300">
            <span className="w-2 h-2 rounded-full bg-aurora-purple" />
            Verified Regional History
          </span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Ancestral Oral Narrative
          </span>
        </div>
      </motion.div>

      {/* CTA Button: Claim Badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
      >
        <button
          onClick={handleClaimBadge}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-aurora-pink via-purple-500 to-indigo-500 text-white font-serif font-bold text-base tracking-wider uppercase shadow-glow-pink hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Award className="w-5 h-5" />
          <span>Claim Ancestral Badge</span>
        </button>
      </motion.div>
    </div>
  );
}
