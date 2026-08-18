export type Stage =
  | 'landing'     // Stage 0: Hero intro with ember particles & lore invocation
  | 'camera'      // Stage 1: Live camera view + scanning reticle & sweep
  | 'tags'        // Stage 2: Floating AR annotation tags over frozen capture
  | 'questions'   // Stage 3: 3-question dialogue with Ancestor (STT / text)
  | 'processing'  // Stage 4: Weaving memory tapestry visualization
  | 'blessing'    // Stage 5: 3-tier provenance-labeled blessing reveal + TTS
  | 'badge';      // Stage 6: Ancestral Ember badge unlock & Memory Thread

export interface ARTag {
  id: string;
  label: string;
  detail: string;
  x: number; // percentage 0-100 for screen-space overlay
  y: number; // percentage 0-100 for screen-space overlay
  category?: 'material' | 'craft' | 'era' | 'wear';
}

export interface ScanResult {
  object: string;
  details: string[];
  tags: ARTag[];
  confidence: number;
  estimatedEra?: string;
  detectedMaterial?: string;
  culturalNote?: string;
}

export interface HeritageQuestion {
  id: number;
  question: string;
  focusDetail: string;
  contextHint?: string;
}

export interface QuestionAnswer {
  questionId: number;
  question: string;
  answer: string;
  timestamp?: number;
}

export interface ExtractedMemoryData {
  concreteDetails: string[];
  emotionalTone: string;
  keywords: string[];
  ancestralThemes: string[];
}

export interface RootsContextData {
  region: string;
  fact: string;
  source: string;
  historicalEra?: string;
  culturalSignificance?: string;
}

export interface ProvenanceBlessing {
  memory: string[];          // 🟢 Your Memory: verbatim or close-paraphrase of user's words
  context: string;           // 📚 Regional Context: real cultural/historical fact, sourced
  telling: string;           // 🔵 The Ancestor's Telling: AI narrative woven around both
  usedDetails: string[];     // Verified list of user details incorporated (>= 2)
  badgeTitle: string;        // Title of the earned ancestral badge
  badgeDescription: string;  // Lore description for the badge
}

export interface MemoryThreadItem {
  id: string;
  timestamp: number;
  objectName: string;
  imagePreview: string;
  keyMemory: string;
  blessingExcerpt: string;
  badgeTitle: string;
  region: string;
}

export interface SampleHeirloom {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  estimatedEra: string;
  origin: string;
  defaultScanResult: ScanResult;
}
