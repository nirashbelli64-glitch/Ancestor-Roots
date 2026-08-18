'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScanReticleProps {
  isScanning?: boolean;
  statusText?: string;
}

export default function ScanReticle({
  isScanning = true,
  statusText = 'Aligning Ancestral Lens...',
}: ScanReticleProps) {
  const [telemetryValues, setTelemetryValues] = useState({
    resonance: 96.4,
    flux: 1.12,
    frequency: 432,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryValues({
        resonance: Number((94 + Math.random() * 5).toFixed(1)),
        flux: Number((1.0 + Math.random() * 0.25).toFixed(2)),
        frequency: 430 + Math.floor(Math.random() * 5),
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Corner Brackets in Neon Magenta / Pink */}
      <div className="absolute inset-8 sm:inset-16 md:inset-24">
        {/* Top-Left */}
        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-aurora-pink shadow-glow-pink" />
        <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-aurora-purple" />

        {/* Top-Right */}
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-aurora-pink shadow-glow-pink" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-aurora-purple" />

        {/* Bottom-Left */}
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-aurora-pink shadow-glow-pink" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-aurora-purple" />

        {/* Bottom-Right */}
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-aurora-pink shadow-glow-pink" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-aurora-purple" />
      </div>

      {/* Laser Sweep Beam in Radiant Pink/Magenta */}
      {isScanning && (
        <motion.div
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-aurora-pink to-transparent shadow-glow-pink z-20"
          initial={{ top: '10%', opacity: 0 }}
          animate={{
            top: ['10%', '90%', '10%'],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Central Rotating Glyphs */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Outer dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-aurora-pink/40 shadow-glow-pink"
        />

        {/* Middle segmented ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-6 rounded-full border border-aurora-purple/35 border-t-aurora-purple/80 border-b-aurora-purple/80"
        />

        {/* Inner lock-on ring */}
        <motion.div
          animate={{
            scale: isScanning ? [1, 1.05, 1] : 1,
            opacity: isScanning ? [0.7, 1, 0.7] : 0.4,
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-16 rounded-full border-2 border-aurora-pink/70 shadow-glow-pink flex items-center justify-center"
        >
          <div className="absolute w-full h-[1px] bg-aurora-pink/50" />
          <div className="absolute h-full w-[1px] bg-aurora-pink/50" />
          <div className="w-4 h-4 rounded-full bg-aurora-pink/30 border border-white shadow-glow-pink" />
        </motion.div>
      </div>

      {/* HUD Telemetry Overlay */}
      <div className="absolute top-12 left-12 hidden md:flex flex-col gap-1 text-[11px] font-mono tracking-widest text-purple-200 bg-obsidian-card px-4 py-2.5 rounded-2xl border border-aurora-pink/25 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-aurora-pink animate-ping" />
          <span>SPECTRAL RESONANCE: {telemetryValues.resonance}%</span>
        </div>
        <div>CULTURAL HARMONIC: {telemetryValues.frequency} Hz</div>
        <div>LINEAGE FLUX: {telemetryValues.flux}x</div>
      </div>

      {/* Status Banner */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-2.5 rounded-full bg-obsidian-card border border-aurora-pink/40 backdrop-blur-xl text-sm font-medium tracking-wider text-pink-200 shadow-glow-pink">
        <span className="w-2 h-2 rounded-full bg-aurora-pink animate-pulse" />
        <span className="font-serif uppercase tracking-widest text-xs">{statusText}</span>
      </div>
    </div>
  );
}
