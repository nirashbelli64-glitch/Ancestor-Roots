'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  Stage,
  ScanResult,
  HeritageQuestion,
  QuestionAnswer,
  ExtractedMemoryData,
  RootsContextData,
  ProvenanceBlessing,
  MemoryThreadItem,
} from '@/lib/types';
import { HeritageLanguage, SUPPORTED_LANGUAGES } from '@/lib/languages';

interface SessionContextType {
  stage: Stage;
  setStage: (stage: Stage) => void;
  capturedImage: string | null;
  setCapturedImage: (img: string | null) => void;
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult | null) => void;
  questions: HeritageQuestion[];
  setQuestions: (q: HeritageQuestion[]) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  answers: QuestionAnswer[];
  recordAnswer: (questionId: number, question: string, answer: string) => void;
  extractedData: ExtractedMemoryData | null;
  setExtractedData: (data: ExtractedMemoryData | null) => void;
  rootsData: RootsContextData | null;
  setRootsData: (data: RootsContextData | null) => void;
  blessing: ProvenanceBlessing | null;
  setBlessing: (blessing: ProvenanceBlessing | null) => void;
  memoryThread: MemoryThreadItem[];
  addToMemoryThread: (item: MemoryThreadItem) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  processingStatus: string;
  setProcessingStatus: (status: string) => void;
  burstTrigger: number;
  triggerBurst: () => void;
  audioMuted: boolean;
  setAudioMuted: (val: boolean) => void;
  language: HeritageLanguage;
  setLanguage: (lang: HeritageLanguage) => void;
  resetForNewScan: () => void;
  resetEntireSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>('landing');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [questions, setQuestions] = useState<HeritageQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedMemoryData | null>(null);
  const [rootsData, setRootsData] = useState<RootsContextData | null>(null);
  const [blessing, setBlessing] = useState<ProvenanceBlessing | null>(null);
  const [memoryThread, setMemoryThread] = useState<MemoryThreadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('Summoning ancestral memory...');
  const [burstTrigger, setBurstTrigger] = useState<number>(0);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [language, setLanguage] = useState<HeritageLanguage>(SUPPORTED_LANGUAGES[0]); // Default English

  const triggerBurst = () => {
    setBurstTrigger((prev) => prev + 1);
  };

  const recordAnswer = (questionId: number, question: string, answer: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { questionId, question, answer, timestamp: Date.now() }];
    });
  };

  const addToMemoryThread = (item: MemoryThreadItem) => {
    setMemoryThread((prev) => [item, ...prev]);
  };

  const resetForNewScan = () => {
    setCapturedImage(null);
    setScanResult(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setExtractedData(null);
    setRootsData(null);
    setBlessing(null);
    setStage('camera');
  };

  const resetEntireSession = () => {
    resetForNewScan();
    setMemoryThread([]);
    setStage('landing');
  };

  return (
    <SessionContext.Provider
      value={{
        stage,
        setStage,
        capturedImage,
        setCapturedImage,
        scanResult,
        setScanResult,
        questions,
        setQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        recordAnswer,
        extractedData,
        setExtractedData,
        rootsData,
        setRootsData,
        blessing,
        setBlessing,
        memoryThread,
        addToMemoryThread,
        isProcessing,
        setIsProcessing,
        processingStatus,
        setProcessingStatus,
        burstTrigger,
        triggerBurst,
        audioMuted,
        setAudioMuted,
        language,
        setLanguage,
        resetForNewScan,
        resetEntireSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
