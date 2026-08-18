'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@/components/providers/SessionContext';
import { Flame, Feather, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ProcessingStage() {
  const {
    scanResult,
    answers,
    setExtractedData,
    setRootsData,
    setBlessing,
    setStage,
    triggerBurst,
    language,
  } = useSession();

  const [activeStep, setActiveStep] = useState(0);
  const [revealedKeywords, setRevealedKeywords] = useState<string[]>([
    'Lineage',
    'Hearth',
    'Sanctuary',
    'Migration',
    'Devotion',
  ]);
  const [showOverrideButton, setShowOverrideButton] = useState(false);

  const hasStartedRef = useRef(false);

  const steps = [
    { label: 'Deciphering oral memory & emotional resonance...', icon: Feather },
    { label: 'Unearthing regional craft traditions & archival roots...', icon: Compass },
    { label: 'Synthesizing the three-fold provenance blessing...', icon: Flame },
  ];

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Safety fallback timer: show manual skip after 4 seconds
    const fallbackTimer = setTimeout(() => {
      setShowOverrideButton(true);
    }, 4000);

    async function executeCeremony() {
      const activeObject = scanResult?.object || 'Ancestral Heirloom';
      const answersList = (answers || []).map((a) => ({
        question: a.question,
        answer: a.answer,
      }));

      try {
        // STEP 1: Extract Memory Insights
        setActiveStep(0);
        let extractedData: any = {
          concreteDetails: answersList.length
            ? answersList.map((a) => a.answer)
            : ['Family sanctuary memories', 'Cherished generational love'],
          emotionalTone: 'Reverent Devotion & Nostalgia',
          keywords: ['Lineage', 'Hearth', 'Sanctuary', 'Migration', 'Continuity', 'Devotion'],
        };

        try {
          const extractRes = await fetch('/api/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              object: activeObject,
              answers: answersList,
              language: language?.name || 'English',
            }),
          });
          if (extractRes.ok) {
            extractedData = await extractRes.json();
          }
        } catch (e) {
          console.warn('Extract API non-fatal notice:', e);
        }

        setExtractedData(extractedData);
        if (extractedData.keywords?.length) {
          setRevealedKeywords(extractedData.keywords);
        }

        // Brief breathing delay for visual rhythm
        await new Promise((r) => setTimeout(r, 1000));

        // STEP 2: Lookup Roots Context
        setActiveStep(1);
        let rootsData: any = {
          region: 'Ancestral Cultural Crossroads & Guild Lineages',
          historicalEra: 'Early 20th Century Craft Guilds',
          fact: `Traditional heirlooms like this ${activeObject} were blessed by elders and preserved near the family hearth to anchor lineage across migrations.`,
          source: 'Living Traditions Heritage Archives & Guild Records',
        };

        try {
          const rootsRes = await fetch('/api/roots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              object: activeObject,
              keywords: extractedData.keywords || [],
              details: scanResult?.details || [],
              language: language?.name || 'English',
            }),
          });
          if (rootsRes.ok) {
            rootsData = await rootsRes.json();
          }
        } catch (e) {
          console.warn('Roots API non-fatal notice:', e);
        }

        setRootsData(rootsData);

        // Brief breathing delay
        await new Promise((r) => setTimeout(r, 1000));

        // STEP 3: Synthesize Blessing
        setActiveStep(2);
        let blessingData: any = {
          memory: [
            `You remembered how ${extractedData.concreteDetails?.[0] || 'your family tended to this sacred relic'}.`,
            `In your words, this heirloom represents ${extractedData.concreteDetails?.[1] || 'an unbroken bond across migrations'}.`,
          ],
          context: `Rooted in the living traditions of ${rootsData.region}: ${rootsData.fact}`,
          telling: `By the eternal hearth of the Ancestors, this ${activeObject} stands witness. The hands that shaped it and the hearts that guarded it speak through you now. May the flame of your memory guide the steps of all who follow.`,
          usedDetails: extractedData.concreteDetails?.slice(0, 2) || ['Sanctuary', 'Family Roots'],
          badgeTitle: 'Keeper of the Ancestral Flame',
          badgeDescription: 'Honoring the living oral history woven across generations.',
        };

        try {
          const blessingRes = await fetch('/api/blessing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              object: activeObject,
              concreteDetails: extractedData.concreteDetails || [],
              rootsFact: rootsData.fact,
              rootsRegion: rootsData.region,
              emotionalTone: extractedData.emotionalTone || 'Reverent Devotion',
              language: language?.name || 'English',
            }),
          });
          if (blessingRes.ok) {
            blessingData = await blessingRes.json();
          }
        } catch (e) {
          console.warn('Blessing API non-fatal notice:', e);
        }

        setBlessing(blessingData);
        triggerBurst();

        // Final transition to Blessing Stage
        setTimeout(() => {
          setStage('blessing');
        }, 1200);
      } catch (fatalErr) {
        console.error('Fatal processing pipeline error, auto-recovering:', fatalErr);
        triggerBurst();
        setStage('blessing');
      }
    }

    executeCeremony();

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [scanResult, answers, setExtractedData, setRootsData, setBlessing, setStage, triggerBurst, language]);

  const handleForceProceed = () => {
    triggerBurst();
    setStage('blessing');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto min-h-[85vh] flex flex-col items-center justify-center p-4 text-center z-10">
      {/* Weaving Loom Animation in Pink & Purple */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-8 flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-aurora-pink/40 shadow-glow-pink"
        />

        {/* Counter-rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 rounded-full border border-aurora-purple/50 shadow-glow-purple"
        />

        {/* Pulsing loom core */}
        <motion.div
          animate={{ scale: [0.95, 1.08, 0.95] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-28 h-28 rounded-full glass-panel-ember flex items-center justify-center border-2 border-aurora-pink shadow-glow-pink"
        >
          <Flame className="w-12 h-12 text-pink-200 animate-flicker" />
        </motion.div>

        {/* Concentric Weaving Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 animate-pulse-slow">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#E100FF" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#E100FF" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="15%" y1="15%" x2="85%" y2="85%" stroke="#C084FC" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="85%" y1="15%" x2="15%" y2="85%" stroke="#C084FC" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* Stage Title */}
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mb-2">
        Weaving Your Memory Tapestry...
      </h2>
      <p className="text-xs sm:text-sm text-pink-200/80 font-sans max-w-md mx-auto mb-8">
        The Ancestor binds your spoken words with ancient regional heritage and craft history.
      </p>

      {/* Pipeline Step Progress List */}
      <div className="w-full space-y-3 mb-8 text-left">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`p-4 rounded-xl glass-panel border transition-all flex items-center gap-3 ${
                isCurrent
                  ? 'border-aurora-pink shadow-glow-pink bg-obsidian-card'
                  : isDone
                  ? 'border-emerald-500/40 text-neutral-300'
                  : 'border-white/10 opacity-40 text-neutral-500'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isCurrent
                    ? 'bg-aurora-pink/20 text-pink-200'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 text-neutral-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className={`w-4 h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
                )}
              </div>
              <span className="text-xs sm:text-sm font-sans font-medium">{step.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Materializing Keyword Badges */}
      {revealedKeywords.length > 0 && (
        <div className="w-full mb-6">
          <div className="text-[11px] font-mono uppercase tracking-widest text-pink-300 mb-2 font-semibold">
            ✦ Ancestral Resonance Tokens:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {revealedKeywords.map((kw, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="px-3.5 py-1 rounded-full bg-white/5 border border-aurora-pink/30 text-xs font-serif text-pink-200 shadow-sm"
              >
                ✦ {kw}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Fallback Button (Appears if network takes longer than 4s) */}
      {showOverrideButton && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2"
        >
          <button
            onClick={handleForceProceed}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-aurora-pink text-xs font-serif uppercase tracking-widest text-pink-200 hover:text-white border border-aurora-pink/40 shadow-glow-pink transition-all cursor-pointer"
          >
            <span>Proceed to Blessing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
