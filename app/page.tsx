'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from '@/components/providers/SessionContext';
import SoftAurora from '@/components/ui/SoftAurora';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import ProgressOrbs from '@/components/ui/ProgressOrbs';
import LanguageSelector from '@/components/ui/LanguageSelector';
import LandingStage from '@/components/stages/LandingStage';
import CameraStage from '@/components/stages/CameraStage';
import TagsStage from '@/components/stages/TagsStage';
import QuestionStage from '@/components/stages/QuestionStage';
import ProcessingStage from '@/components/stages/ProcessingStage';
import BlessingStage from '@/components/stages/BlessingStage';
import BadgeStage from '@/components/stages/BadgeStage';
import { Flame, RefreshCw } from 'lucide-react';

export default function Home() {
  const {
    stage,
    setStage,
    burstTrigger,
    resetEntireSession,
  } = useSession();

  const renderStage = () => {
    switch (stage) {
      case 'landing':
        return <LandingStage key="landing" />;
      case 'camera':
        return <CameraStage key="camera" />;
      case 'tags':
        return <TagsStage key="tags" />;
      case 'questions':
        return <QuestionStage key="questions" />;
      case 'processing':
        return <ProcessingStage key="processing" />;
      case 'blessing':
        return <BlessingStage key="blessing" />;
      case 'badge':
        return <BadgeStage key="badge" />;
      default:
        return <LandingStage key="default" />;
    }
  };

  return (
    <main className="relative min-h-screen bg-obsidian flex flex-col justify-between overflow-hidden">
      {/* React Bits <SoftAurora /> WebGL Background Layer (Pink & Purple Ethereal Shader) */}
      <SoftAurora
        speed={0.6}
        scale={1.5}
        brightness={1.0}
        color1="#f7f7f7"
        color2="#e100ff"
        noiseFrequency={2.5}
        noiseAmplitude={1.0}
        bandHeight={0.5}
        bandSpread={1.0}
        octaveDecay={0.1}
        layerOffset={0}
        colorSpeed={1.0}
        enableMouseInteraction={true}
        mouseInfluence={0.25}
      />

      {/* Dynamic Floating Ember Sparks & Fireworks Burst Layer */}
      <ParticleCanvas burstTrigger={burstTrigger} density="medium" />

      {/* Persistent Navigation Header */}
      <header className="relative z-40 w-full px-4 pt-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl mx-auto">
        {/* Brand Crest */}
        <button
          onClick={resetEntireSession}
          className="flex items-center gap-2.5 group cursor-pointer text-left"
          title="Return to Awakening"
        >
          <div className="w-8 h-8 rounded-lg glass-panel-ember flex items-center justify-center border border-ember/40 shadow-glow-ember group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4 text-amber-300 animate-flicker" />
          </div>
          <div>
            <div className="font-serif font-bold text-sm tracking-wider text-white uppercase group-hover:text-amber-200 transition-colors">
              The Ancestor&apos;s Test
            </div>
            <div className="text-[10px] font-mono tracking-widest text-gold/80">
              ROOTS EDITION • AR
            </div>
          </div>
        </button>

        {/* Stage Timeline Navigation */}
        <div className="order-3 sm:order-2 w-full sm:w-auto">
          <ProgressOrbs currentStage={stage} onSelectStage={setStage} />
        </div>

        {/* Header Right Utility Controls */}
        <div className="order-2 sm:order-3 flex items-center gap-2.5">
          {/* Multilingual Voice & Tongue Selector */}
          <LanguageSelector />

          {stage !== 'landing' && (
            <button
              onClick={resetEntireSession}
              className="p-2 rounded-full glass-panel border border-white/10 hover:border-gold/40 text-neutral-400 hover:text-white transition-all text-xs font-serif flex items-center gap-1.5 cursor-pointer"
              title="Restart session"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-xs">Restart</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Interactive Stage Container */}
      <div className="relative z-20 flex-1 flex items-center justify-center w-full max-w-6xl mx-auto px-4 py-4">
        {renderStage()}
      </div>

      {/* Atmospheric Footer */}
      <footer className="relative z-20 w-full py-3.5 text-center text-[11px] text-neutral-400 font-serif border-t border-white/10 bg-charcoal-dark/40 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>Oral History Preserved in the Digital Ember</span>
          <span className="text-gold">✦</span>
          <span>React Bits SoftAurora</span>
          <span className="text-gold">✦</span>
          <span>Multilingual Maternal Voice AI</span>
        </div>
      </footer>
    </main>
  );
}
