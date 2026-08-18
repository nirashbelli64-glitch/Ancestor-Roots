'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/components/providers/SessionContext';
import VoiceInput from '@/components/ui/VoiceInput';
import AncestorVoice from '@/components/ui/AncestorVoice';
import { Flame, Sparkles } from 'lucide-react';
import { HeritageQuestion } from '@/lib/types';

export default function QuestionStage() {
  const {
    scanResult,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    recordAnswer,
    setStage,
  } = useSession();

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const objectTitle = scanResult?.object || 'heirloom';

  const activeQuestions: HeritageQuestion[] =
    questions && questions.length > 0
      ? questions
      : [
          {
            id: 1,
            question: `Looking closely at this ${objectTitle} — whose hands first gave this to your family, and what was the world like around them?`,
            focusDetail: 'Origin & Giver',
            contextHint: 'Recall whose loving voice or gentle hands first passed this down.',
          },
          {
            id: 2,
            question: `In what quiet room, journey, or sacred celebration did this ${objectTitle} keep watch over your loved ones?`,
            focusDetail: 'Living Memory & Sanctuary',
            contextHint: 'Think of where this object rested on quiet mornings or festival nights.',
          },
          {
            id: 3,
            question: `If this ${objectTitle} could whisper one eternal truth across the century to the children yet to come, what vow does it protect?`,
            focusDetail: 'Future Legacy & Vow',
            contextHint: 'Speak of the strength, love, or devotion you carry forward today.',
          },
        ];

  const currentQ = activeQuestions[currentQuestionIndex] || activeQuestions[0];

  useEffect(() => {
    const existing = answers.find((a) => a.questionId === currentQ.id);
    if (existing) {
      setCurrentAnswer(existing.answer);
    } else {
      setCurrentAnswer('');
    }
  }, [currentQuestionIndex, currentQ.id, answers]);

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    setIsSubmitting(true);

    recordAnswer(currentQ.id, currentQ.question, currentAnswer.trim());

    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
      setIsSubmitting(false);
    } else {
      setStage('processing');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto min-h-[85vh] flex flex-col items-center justify-center p-4 z-10">
      {/* Top Question Progress Bar */}
      <div className="w-full mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-aurora-pink animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-pink-300 font-semibold">
            Oral Dialogue • Question {currentQuestionIndex + 1} of {activeQuestions.length}
          </span>
        </div>

        {/* Mini progress dots */}
        <div className="flex items-center gap-1.5">
          {activeQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                i === currentQuestionIndex
                  ? 'bg-gradient-to-r from-aurora-pink to-purple-400 shadow-glow-pink w-12'
                  : i < currentQuestionIndex
                  ? 'bg-emerald-400'
                  : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Abstract Ancestor Flame Avatar in Glowing Violet / Pink */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Glow halos */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-28 h-28 rounded-full bg-aurora-pink/30 blur-xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-36 h-36 rounded-full bg-aurora-purple/25 blur-2xl pointer-events-none"
        />

        {/* Sacred Flame Core */}
        <div className="relative w-20 h-20 rounded-full glass-panel-ember flex items-center justify-center border-2 border-aurora-pink/60 shadow-glow-pink">
          <Flame className="w-10 h-10 text-pink-200 animate-flicker" />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5 }}
          className="w-full text-center mb-6"
        >
          {/* Target Detail Chip */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-pink-200 uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3 h-3 text-aurora-pink" />
            <span>Memory Focus: {currentQ.focusDetail}</span>
          </div>

          {/* The Question Text in Cinzel serif */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-white font-semibold leading-relaxed tracking-wide mb-4">
            “{currentQ.question}”
          </h2>

          {/* Context whisper */}
          {currentQ.contextHint && (
            <p className="text-xs sm:text-sm text-pink-200/80 font-sans italic max-w-xl mx-auto">
              ✦ {currentQ.contextHint}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Ancestor Voice Recitation Controller in Warm Maternal Voice */}
      <div className="mb-6 w-full max-w-md">
        <AncestorVoice text={currentQ.question} />
      </div>

      {/* Spoken STT / Text Input Section */}
      <div className="w-full">
        <VoiceInput
          value={currentAnswer}
          onChange={setCurrentAnswer}
          onSubmit={handleSubmitAnswer}
          isSubmitting={isSubmitting}
          placeholder={`Describe your memory of this ${objectTitle}...`}
        />
      </div>

      {/* Navigation helper */}
      <div className="mt-4 flex items-center justify-between w-full text-xs text-neutral-400 font-sans">
        <span>Press Enter or tap Send to submit</span>
        {currentQuestionIndex > 0 && (
          <button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            className="text-pink-300 hover:text-white transition-colors cursor-pointer"
          >
            ← Previous Question
          </button>
        )}
      </div>
    </div>
  );
}
