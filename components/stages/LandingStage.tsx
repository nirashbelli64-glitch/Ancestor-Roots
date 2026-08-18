'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@/components/providers/SessionContext';
import { Sparkles, Camera, Flame, Shield, ArrowRight, Compass } from 'lucide-react';
import { SAMPLE_HEIRLOOMS } from '@/lib/samples';

export default function LandingStage() {
  const { setStage, setCapturedImage, setScanResult } = useSession();

  const handleStartWithCamera = () => {
    setStage('camera');
  };

  const handleStartWithSample = (sample = SAMPLE_HEIRLOOMS[0]) => {
    setCapturedImage(sample.imageUrl);
    setScanResult(sample.defaultScanResult);
    setStage('tags');
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 text-center z-10">
      {/* Top Ancestral Sigil Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aurora-soft border border-aurora-pink/40 text-pink-200 text-xs font-mono tracking-widest uppercase mb-6 shadow-glow-pink">
        <Flame className="w-3.5 h-3.5 text-aurora-pink animate-pulse" />
        <span>Living Heritage Oracle</span>
        <span className="text-aurora-purple">✦</span>
        <span>Roots Edition (AR)</span>
      </div>

      {/* Main Title with Liquid Crystal Effect in Pink & Purple */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold tracking-tight mb-4 max-w-4xl text-white">
        <span className="liquid-text block">The Ancestor&apos;s Test</span>
      </h1>

      {/* Opening Lore Invocation */}
      <p className="text-base sm:text-xl md:text-2xl font-serif text-pink-100/95 italic max-w-2xl mx-auto mb-8 leading-relaxed">
        “Every object remembers the hands that held it... the migrations it weathered, and the promises whispered across the hearth.”
      </p>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-12">
        <button
          onClick={handleStartWithCamera}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-aurora-pink via-purple-600 to-indigo-600 text-white font-serif font-bold text-base tracking-wider uppercase shadow-glow-pink hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <Camera className="w-5 h-5" />
          <span>Begin the Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleStartWithSample(SAMPLE_HEIRLOOMS[0])}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl glass-panel text-pink-200 hover:text-white hover:border-aurora-pink/60 font-serif text-sm tracking-wider uppercase transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-aurora-pink" />
          <span>Try Sample</span>
        </button>
      </div>

      {/* Feature Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl text-left">
        <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-aurora-pink/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-aurora-pink/20 border border-aurora-pink/30 flex items-center justify-center text-aurora-pink mb-3 shadow-glow-pink">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-serif font-bold text-pink-200 mb-1">
            AR Lens Vision
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            Point your camera at any family heirloom to detect aged patina, engravings, and craft relics.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-aurora-purple/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-aurora-purple/20 border border-aurora-purple/30 flex items-center justify-center text-aurora-purple mb-3 shadow-glow-purple">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-serif font-bold text-purple-200 mb-1">
            Oral Dialogue
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            Answer 3 ancestral questions using your live spoken voice in your regional mother tongue.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-sky-400/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 mb-3 shadow-glow-cyan">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-serif font-bold text-sky-200 mb-1">
            Roots &amp; Provenance
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            Woven with real ethnographic facts, preserving your exact memory with archival rigor.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-purple-400/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-3 shadow-glow-purple">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-serif font-bold text-purple-200 mb-1">
            Ancestral Ember
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            Unlock glowing lineage medallions and weave an intergenerational Memory Thread.
          </p>
        </div>
      </div>
    </div>
  );
}
