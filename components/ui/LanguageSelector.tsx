'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from '@/components/providers/SessionContext';
import { SUPPORTED_LANGUAGES, HeritageLanguage } from '@/lib/languages';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSelector() {
  const { language, setLanguage } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: HeritageLanguage) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative z-50">
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-ember/30 hover:border-gold/60 text-xs font-serif text-amber-200 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
        title="Choose Heritage Language & Voice"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-gold" />
        <span className="font-sans font-medium">{language.flag} {language.nativeName}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 max-h-72 overflow-y-auto rounded-2xl glass-panel-gold border border-gold/40 shadow-2xl p-1.5 bg-charcoal-dark/95 backdrop-blur-xl"
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-gold/80 border-b border-white/10 mb-1">
              Select Heritage Tongue
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.id === language.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => handleSelect(lang)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-r from-ember/30 to-gold/30 text-amber-100 font-semibold border border-gold/40'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span className="font-serif">{lang.nativeName}</span>
                    <span className="text-[10px] text-neutral-400">({lang.name})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
