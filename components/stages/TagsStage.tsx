'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@/components/providers/SessionContext';
import FloatingTag from '@/components/ui/FloatingTag';
import AncestorVoice from '@/components/ui/AncestorVoice';
import { Sparkles, MessageSquare, RotateCcw, Clock, Layers, BookOpen, Edit2, Check, Eye } from 'lucide-react';

export default function TagsStage() {
  const {
    capturedImage,
    scanResult,
    setScanResult,
    setStage,
    setQuestions,
    memoryThread,
    language,
  } = useSession();

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [customObjectName, setCustomObjectName] = useState(scanResult?.object || '');

  const handleSaveTitle = () => {
    if (customObjectName.trim() && scanResult) {
      setScanResult({
        ...scanResult,
        object: customObjectName.trim(),
      });
    }
    setIsEditingTitle(false);
  };

  const handleProceedToDialogue = async () => {
    if (!scanResult) return;
    setIsLoadingQuestions(true);

    const activeName = customObjectName.trim() || scanResult.object;

    try {
      const previousContext =
        memoryThread.length > 0
          ? memoryThread.map((m) => `${m.objectName}: ${m.keyMemory}`).join('; ')
          : undefined;

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object: activeName,
          details: scanResult.details,
          previousContext,
          language: language.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Questions API error ${response.status}`);
      }

      const data = await response.json();
      setQuestions(data.questions || []);
      setStage('questions');
    } catch (err) {
      console.warn('Questions fallback notice:', err);
      setStage('questions');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleRescan = () => {
    setStage('camera');
  };

  if (!scanResult) {
    return (
      <div className="text-center py-12">
        <p className="text-pink-200">No scan result available. Please capture an heirloom.</p>
        <button
          onClick={handleRescan}
          className="mt-4 px-6 py-2 rounded-xl bg-aurora-pink text-white shadow-glow-pink"
        >
          Return to Camera
        </button>
      </div>
    );
  }

  const activeName = customObjectName.trim() || scanResult.object;
  const heirloomNarration = `My child, look closely at this ${activeName}. ${
    scanResult.culturalNote || 'Hands that loved deeply once tended to every curve of this craft.'
  } Notice ${scanResult.details.join(', and ')}. It carries the living heartbeat of your lineage.`;

  return (
    <div className="relative w-full max-w-5xl mx-auto min-h-[85vh] flex flex-col items-center justify-center p-4 z-10">
      {/* Top Identification Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mb-4 p-6 rounded-3xl glass-panel-ember border border-aurora-pink/35 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-pink-300 mb-1.5">
            <Sparkles className="w-4 h-4 text-aurora-pink animate-pulse" />
            <span>The Ancestor Identifies &amp; Remembers</span>
            <span className="text-neutral-500">•</span>
            <span className="text-emerald-400 font-semibold">
              {(scanResult.confidence * 100).toFixed(0)}% Spectral Match
            </span>
          </div>

          {/* Editable Object Title */}
          {isEditingTitle ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={customObjectName}
                onChange={(e) => setCustomObjectName(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-obsidian border border-aurora-pink text-xl font-serif text-white focus:outline-none shadow-glow-pink w-full max-w-md"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="p-2 rounded-xl bg-aurora-pink text-white shadow-glow-pink hover:scale-105"
                title="Save Title"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 group">
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-wide">
                {activeName}
              </h2>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-pink-300 transition-colors opacity-80 group-hover:opacity-100"
                title="Customize / Refine Name"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {scanResult.culturalNote && (
            <p className="text-xs sm:text-sm text-pink-100/90 font-serif mt-1.5 italic">
              “{scanResult.culturalNote}”
            </p>
          )}
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2 md:self-center shrink-0">
          {scanResult.estimatedEra && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-purple-200 font-sans">
              <Clock className="w-3.5 h-3.5 text-aurora-purple" />
              <span>{scanResult.estimatedEra}</span>
            </div>
          )}
          {scanResult.detectedMaterial && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-pink-200 font-sans">
              <Layers className="w-3.5 h-3.5 text-aurora-pink" />
              <span>{scanResult.detectedMaterial}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main AR Display Frame with Floating Tags */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[60vh] rounded-3xl overflow-hidden glass-panel border-2 border-aurora-pink/40 shadow-2xl bg-black">
        {capturedImage ? (
          <div
            className="w-full h-full bg-cover bg-center filter brightness-95 contrast-105"
            style={{ backgroundImage: `url(${capturedImage})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-obsidian to-neutral-900 flex items-center justify-center text-neutral-500">
            No image available
          </div>
        )}

        {/* Ambient Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-obsidian/40 pointer-events-none" />

        {/* Floating AR Annotation Tags */}
        {scanResult.tags?.map((tag, idx) => (
          <FloatingTag key={tag.id || idx} tag={tag} index={idx} />
        ))}
      </div>

      {/* Spoken Heirloom Heritage Narration in Warm Lady Voice */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full mt-4"
      >
        <AncestorVoice
          text={heirloomNarration}
          autoPlay={true}
          customTitle={`Heirloom Lore: ${activeName}`}
        />
      </motion.div>

      {/* Detailed Heirloom Craft Breakdown Dossier */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full mt-4 p-5 rounded-3xl glass-panel border border-white/10 text-left"
      >
        <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-widest text-pink-300">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Ancestral Visual Intelligence &amp; Craft Observations</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {scanResult.details.map((detail, index) => (
            <div
              key={index}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-neutral-200 font-sans"
            >
              <Eye className="w-4 h-4 text-aurora-pink shrink-0 mt-0.5" />
              <span className="leading-relaxed">{detail}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Footer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 w-full"
      >
        <button
          onClick={handleRescan}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass-panel border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white text-sm font-sans transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Rescan Different Photo</span>
        </button>

        <button
          onClick={handleProceedToDialogue}
          disabled={isLoadingQuestions}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-aurora-pink via-purple-500 to-indigo-500 text-white font-serif font-bold text-base tracking-wider uppercase shadow-glow-pink hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <MessageSquare className="w-5 h-5" />
          <span>{isLoadingQuestions ? 'Summoning Ancestor...' : 'Speak with the Ancestor'}</span>
        </button>
      </motion.div>
    </div>
  );
}
