'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from '@/components/providers/SessionContext';

interface VoiceInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isSubmitting?: boolean;
}

export default function VoiceInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  isSubmitting = false,
}: VoiceInputProps) {
  const { language } = useSession();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language.code; // Dynamic regional language

    recognition.onresult = (event: any) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      onChange(fullTranscript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition notice:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onChange, language]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language.code;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start note:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };

  const dynamicPlaceholder =
    placeholder || `Speak in ${language.nativeName} or type your memory...`;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Microphone Main Control Button */}
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="relative">
          {/* Pulsing Ember Halo when Listening */}
          {isListening && (
            <>
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-3 rounded-full bg-ember/30 blur-md pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-6 rounded-full bg-gold/20 blur-lg pointer-events-none"
              />
            </>
          )}

          <button
            onClick={toggleListening}
            disabled={isSubmitting}
            className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${
              isListening
                ? 'bg-gradient-to-tr from-ember to-gold shadow-glow-ember scale-105 border-2 border-white'
                : 'bg-charcoal-light hover:bg-neutral-800 border border-ember/40 shadow-glow-gold hover:scale-105'
            }`}
            title={isListening ? 'Stop Recording' : `Speak in ${language.name}`}
            aria-label={isListening ? 'Stop Recording' : 'Speak into Microphone'}
          >
            <Mic className={`w-7 h-7 sm:w-8 sm:h-8 ${isListening ? 'text-white animate-pulse' : 'text-amber-300'}`} />
          </button>
        </div>

        {/* Listening Status & Active Language */}
        <div className="text-center flex flex-col items-center gap-1">
          <span className="text-xs font-serif uppercase tracking-widest text-amber-200 font-medium">
            {isListening ? 'The Ancestor is listening lovingly...' : `Tap mic to speak in ${language.nativeName}`}
          </span>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gold font-mono">
            <Globe className="w-3 h-3" />
            <span>Listening Mode: {language.name} ({language.code})</span>
          </div>
        </div>
      </div>

      {/* Transcript / Input Textarea */}
      <div className="relative w-full">
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={dynamicPlaceholder}
          className="w-full p-4 pr-14 rounded-2xl glass-panel text-sm text-neutral-100 placeholder-neutral-500 font-sans focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition-all resize-none shadow-inner"
        />

        {/* Action Submit Button */}
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isSubmitting}
          className="absolute right-3.5 bottom-4 p-2.5 rounded-xl bg-gradient-to-r from-ember to-gold text-white font-medium shadow-glow-ember hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          title="Share with the Ancestor"
          aria-label="Share memory"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
