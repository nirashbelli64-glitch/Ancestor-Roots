'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VolumeX, Play, Pause, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { useSession } from '@/components/providers/SessionContext';
import { findWarmFemaleVoice } from '@/lib/languages';

interface AncestorVoiceProps {
  text: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
  customTitle?: string;
}

export default function AncestorVoice({
  text,
  autoPlay = false,
  onEnded,
  className = '',
  customTitle,
}: AncestorVoiceProps) {
  const { language } = useSession();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [activeVoiceName, setActiveVoiceName] = useState<string>('Warm Maternal Voice');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const synth = window.speechSynthesis;

    const prepareUtterance = () => {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Humanized Warm Female Voice settings
      utterance.rate = 0.88; // Gentle, unhurried, reassuring maternal cadence
      utterance.pitch = 1.04; // Warm, melodious, feminine ancestral resonance
      utterance.lang = language.code;

      const voices = synth.getVoices();
      const femaleVoice = findWarmFemaleVoice(voices, language.code);

      if (femaleVoice) {
        utterance.voice = femaleVoice;
        setActiveVoiceName(femaleVoice.name.replace(/Microsoft|Google|Apple|Desktop|Online/gi, '').trim() || 'Warm Maternal Voice');
      } else {
        setActiveVoiceName('Warm Maternal Voice');
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        if (onEnded) onEnded();
      };

      utterance.onerror = (e) => {
        console.warn('TTS playback notice:', e);
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;

      if (autoPlay) {
        setTimeout(() => {
          try {
            synth.speak(utterance);
          } catch (err) {
            console.warn('Autoplay TTS prevented:', err);
          }
        }, 500);
      }
    };

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = prepareUtterance;
    } else {
      prepareUtterance();
    }

    return () => {
      synth.cancel();
    };
  }, [text, autoPlay, onEnded, language]);

  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    if (isSpeaking && !isPaused) {
      synth.pause();
      setIsPaused(true);
    } else if (isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      if (utteranceRef.current) {
        synth.cancel();
        synth.speak(utteranceRef.current);
      }
    }
  };

  const handleRestart = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    if (utteranceRef.current) {
      synth.speak(utteranceRef.current);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-xs text-neutral-400 italic">
        <VolumeX className="w-4 h-4 text-neutral-500" />
        <span>Voice synthesis not supported in this browser</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-3 rounded-2xl glass-panel-ember border border-ember/30 shadow-xl ${className}`}
    >
      {/* Voice Control Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleTogglePlay}
          className="p-2.5 rounded-full bg-gradient-to-r from-ember to-gold text-white hover:brightness-110 transition-all shadow-glow-ember active:scale-95 cursor-pointer"
          title={isSpeaking && !isPaused ? 'Pause Voice' : 'Hear Warm Maternal Voice'}
          aria-label={isSpeaking && !isPaused ? 'Pause Voice' : 'Hear Voice'}
        >
          {isSpeaking && !isPaused ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          )}
        </button>

        <button
          onClick={handleRestart}
          className="p-2 rounded-full bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Replay from beginning"
          aria-label="Replay voice recitation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Voice Description Label */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-ember fill-ember/40 animate-pulse" />
          <span className="text-[11px] uppercase tracking-widest text-amber-200 font-serif font-bold truncate">
            {customTitle || "Ancestor's Voice"}
          </span>
          <span className="text-[10px] text-gold font-mono">({language.nativeName})</span>
        </div>
        <span className="text-[10px] text-neutral-300 font-sans truncate">
          {isSpeaking && !isPaused
            ? 'Speaking with maternal warmth...'
            : isPaused
            ? 'Recitation paused'
            : `Warm Female Voice • ${activeVoiceName}`}
        </span>
      </div>

      {/* Dynamic Animated Soundwave Waveform Bars */}
      <div className="flex items-center gap-1 h-6 px-1 shrink-0">
        {[0.4, 0.9, 0.6, 1.0, 0.7, 0.85, 0.5, 0.95, 0.4].map((scale, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              isSpeaking && !isPaused
                ? 'bg-gradient-to-t from-ember via-ember-light to-gold shadow-glow-ember animate-pulse'
                : 'bg-neutral-600 h-1.5'
            }`}
            style={{
              height: isSpeaking && !isPaused ? `${Math.max(4, scale * 24)}px` : '4px',
              animationDelay: `${i * 110}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
