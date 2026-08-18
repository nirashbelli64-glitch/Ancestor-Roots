'use client';

import React from 'react';
import { Stage } from '@/lib/types';
import { Sparkles, Camera, Tag, MessageCircle, Flame, Gift, Award } from 'lucide-react';

interface ProgressOrbsProps {
  currentStage: Stage;
  onSelectStage?: (stage: Stage) => void;
}

const STAGES_CONFIG: { id: Stage; name: string; icon: any; step: number }[] = [
  { id: 'landing', name: 'Awakening', icon: Sparkles, step: 0 },
  { id: 'camera', name: 'Scan', icon: Camera, step: 1 },
  { id: 'tags', name: 'AR Vision', icon: Tag, step: 2 },
  { id: 'questions', name: 'Dialogue', icon: MessageCircle, step: 3 },
  { id: 'processing', name: 'Weaving', icon: Flame, step: 4 },
  { id: 'blessing', name: 'Blessing', icon: Gift, step: 5 },
  { id: 'badge', name: 'Badge', icon: Award, step: 6 },
];

export default function ProgressOrbs({ currentStage, onSelectStage }: ProgressOrbsProps) {
  const currentIndex = STAGES_CONFIG.findIndex((s) => s.id === currentStage);

  return (
    <div className="w-full flex items-center justify-center py-4 px-2">
      <div className="flex items-center gap-1.5 sm:gap-3 px-4 sm:px-6 py-2.5 rounded-full glass-panel border border-white/10 shadow-2xl backdrop-blur-xl">
        {STAGES_CONFIG.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = stage.icon;

          return (
            <React.Fragment key={stage.id}>
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={`w-3 sm:w-6 h-[2px] transition-colors duration-500 ${
                    idx <= currentIndex
                      ? 'bg-gradient-to-r from-ember to-gold shadow-glow-ember'
                      : 'bg-neutral-800'
                  }`}
                />
              )}

              {/* Stage Orb */}
              <button
                disabled={!isCompleted && !isCurrent}
                onClick={() => isCompleted && onSelectStage && onSelectStage(stage.id)}
                className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-gradient-to-tr from-ember to-gold text-white shadow-glow-ember scale-110 border border-white'
                    : isCompleted
                    ? 'bg-charcoal-light text-gold border border-gold/40 hover:border-gold hover:scale-105 cursor-pointer'
                    : 'bg-neutral-900/80 text-neutral-600 border border-neutral-800 cursor-not-allowed'
                }`}
                title={`Stage ${idx + 1}: ${stage.name}`}
              >
                <Icon className="w-3.5 h-3.5" />

                {/* Pulsing indicator for active stage */}
                {isCurrent && (
                  <span className="absolute -inset-1 rounded-full bg-ember/30 animate-ping pointer-events-none" />
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
