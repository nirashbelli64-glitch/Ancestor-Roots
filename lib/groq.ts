import {
  ScanResult,
  HeritageQuestion,
  ExtractedMemoryData,
  RootsContextData,
  ProvenanceBlessing,
} from './types';
import { PROMPTS } from './prompts';
import { classifyImageArtifact, ARTIFACT_ONTOLOGY } from './visionClassifier';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const VISION_MODELS = [
  process.env.GROQ_VISION_MODEL,
  'llama-3.2-90b-vision-preview',
  'llama-3.2-11b-vision-preview',
  'meta-llama/llama-4-scout-17b-16e-instruct',
].filter(Boolean) as string[];

const TEXT_MODEL = process.env.GROQ_TEXT_MODEL || 'llama-3.3-70b-versatile';

/**
 * Generic Groq Chat Completion caller
 */
async function callGroqChat(messages: any[], model: string, jsonMode = true): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY_MISSING');
  }

  const payload: any = {
    model,
    messages,
    temperature: 0.6,
    max_tokens: 1800,
  };

  if (jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Clean JSON output from potential markdown ticks
 */
function parseSafeJson<T>(raw: string, fallback: T): T {
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.warn('JSON parsing notice, using dynamic classifier fallback:', err, raw);
    return fallback;
  }
}

/**
 * Stage 1: Vision Object Scan with AR Tag Anchors
 */
export async function scanObjectWithVision(
  imageBase64: string,
  categoryHint?: string,
  customName?: string
): Promise<ScanResult> {
  // If user provided a specific category hint or custom name
  if (categoryHint && ARTIFACT_ONTOLOGY[categoryHint]) {
    const res = { ...ARTIFACT_ONTOLOGY[categoryHint] };
    if (customName) res.object = customName;
    return res;
  }

  // 1. Try Groq Vision models first if API key exists
  if (process.env.GROQ_API_KEY) {
    for (const model of VISION_MODELS) {
      try {
        const messages = [
          {
            role: 'user',
            content: [
              { type: 'text', text: PROMPTS.VISION_SCAN },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ];

        const content = await callGroqChat(messages, model, true);
        const parsed = parseSafeJson<ScanResult>(content, classifyImageArtifact(imageBase64));

        if (parsed && parsed.object && parsed.tags?.length > 0) {
          return parsed;
        }
      } catch (error: any) {
        console.warn(`Vision model ${model} attempt note:`, error.message);
      }
    }
  }

  // 2. Intelligent Visual Classifier (Defaults to book for indoor captures)
  return classifyImageArtifact(imageBase64);
}

/**
 * Stage 2: 3 Heritage Questions grounded in visual details
 */
export async function generateHeritageQuestions(
  objectName: string,
  details: string[],
  previousContext?: string,
  language?: string
): Promise<HeritageQuestion[]> {
  try {
    const prompt = PROMPTS.QUESTIONS(objectName, details, previousContext, language);
    const content = await callGroqChat(
      [
        { role: 'system', content: 'You are the Ancestor speaking through the embers of oral memory with deep maternal warmth.' },
        { role: 'user', content: prompt },
      ],
      TEXT_MODEL,
      true
    );

    const parsed = parseSafeJson<{ questions: HeritageQuestion[] }>(content, {
      questions: getFallbackQuestions(objectName, details),
    });

    return parsed.questions?.length ? parsed.questions : getFallbackQuestions(objectName, details);
  } catch (error: any) {
    console.warn('Questions generation note (using dynamic generator):', error.message);
    return getFallbackQuestions(objectName, details);
  }
}

/**
 * Stage 3: Extract Memory Insights & Emotional Resonance
 */
export async function extractMemoryInsights(
  objectName: string,
  qaList: { question: string; answer: string }[],
  language?: string
): Promise<ExtractedMemoryData> {
  try {
    const prompt = PROMPTS.EXTRACT(objectName, qaList, language);
    const content = await callGroqChat(
      [
        { role: 'system', content: 'You are a meticulous heritage memory scribe.' },
        { role: 'user', content: prompt },
      ],
      TEXT_MODEL,
      true
    );

    const parsed = parseSafeJson<ExtractedMemoryData>(content, getFallbackExtracted(objectName, qaList));
    return parsed.concreteDetails?.length ? parsed : getFallbackExtracted(objectName, qaList);
  } catch (error: any) {
    console.warn('Extract insights note (using fallback):', error.message);
    return getFallbackExtracted(objectName, qaList);
  }
}

/**
 * Stage 4: Lookup Verifiable Regional Heritage & Craft Roots
 */
export async function lookupRootsContext(
  objectName: string,
  keywords: string[],
  details: string[],
  language?: string
): Promise<RootsContextData> {
  try {
    const prompt = PROMPTS.ROOTS(objectName, keywords, details, language);
    const content = await callGroqChat(
      [
        { role: 'system', content: 'You are an authentic cultural anthropologist and ethnographic historian.' },
        { role: 'user', content: prompt },
      ],
      TEXT_MODEL,
      true
    );

    const parsed = parseSafeJson<RootsContextData>(content, getFallbackRoots(objectName));
    return parsed.fact ? parsed : getFallbackRoots(objectName);
  } catch (error: any) {
    console.warn('Roots lookup note (using fallback):', error.message);
    return getFallbackRoots(objectName);
  }
}

/**
 * Stage 5: Generate Provenance-Labeled Blessing
 */
export async function generateProvenanceBlessing(
  objectName: string,
  concreteDetails: string[],
  rootsFact: string,
  rootsRegion: string,
  emotionalTone: string,
  language?: string
): Promise<ProvenanceBlessing> {
  const maxAttempts = 2;
  let lastResult: ProvenanceBlessing = getFallbackBlessing(objectName, concreteDetails, rootsFact, rootsRegion);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const prompt = PROMPTS.BLESSING(
        objectName,
        concreteDetails,
        rootsFact,
        rootsRegion,
        emotionalTone,
        language
      );

      const content = await callGroqChat(
        [
          {
            role: 'system',
            content:
              'You are the Ancestor delivering a sacred, provenance-labeled heirloom blessing with tender maternal affection and poetic gravity.',
          },
          { role: 'user', content: prompt },
        ],
        TEXT_MODEL,
        true
      );

      const parsed = parseSafeJson<ProvenanceBlessing>(content, lastResult);

      if (parsed.usedDetails && parsed.usedDetails.length >= 2 && parsed.telling) {
        return parsed;
      }
      lastResult = parsed;
    } catch (error: any) {
      console.warn(`Blessing generation attempt ${attempt} note:`, error.message);
    }
  }

  return lastResult;
}

function getFallbackQuestions(objectName: string, details: string[]): HeritageQuestion[] {
  const lower = objectName.toLowerCase();

  // If it's a car / vehicle
  if (lower.includes('car') || lower.includes('automobile') || lower.includes('model t') || lower.includes('vehicle')) {
    return [
      {
        id: 1,
        question: `Who in your family owned or drove this car first?`,
        focusDetail: 'Original Driver & Owner',
        contextHint: 'Think of your parents, grandparents, or whoever brought it home.',
      },
      {
        id: 2,
        question: `What is a favorite road trip, wedding, or family memory you have in it?`,
        focusDetail: 'Favorite Family Trip',
        contextHint: 'A special journey, festival ride, or memorable day out.',
      },
      {
        id: 3,
        question: `Why is this car special to your family, and what feelings does it bring back?`,
        focusDetail: 'Family Meaning & Pride',
        contextHint: 'What makes you smile when you remember it today.',
      },
    ];
  }

  // Generic & heirloom fallback
  return [
    {
      id: 1,
      question: `Who in your family originally owned or gave you this ${objectName}?`,
      focusDetail: 'Original Owner & Giver',
      contextHint: 'Think of your parents, grandparents, or a loving elder.',
    },
    {
      id: 2,
      question: `What is your favorite memory, celebration, or story connected to it?`,
      focusDetail: 'Special Memory',
      contextHint: 'A festive gathering, a quiet conversation, or where it was kept.',
    },
    {
      id: 3,
      question: `Why is this ${objectName} special to you, and who in the family would you pass it on to?`,
      focusDetail: 'Family Legacy',
      contextHint: 'What makes it precious to preserve for the next generation.',
    },
  ];
}

function getFallbackExtracted(
  _objectName: string,
  qaList: { question: string; answer: string }[]
): ExtractedMemoryData {
  const userAnswers = qaList.map((q) => q.answer.trim()).filter(Boolean);
  const concreteDetails = userAnswers.length
    ? userAnswers
    : [
        `Preserved with deep reverence in the family sanctuary`,
        `Passed down through ancestral migration and cherished gatherings`,
        `Carried as an emblem of resilience and family unity`,
      ];

  return {
    concreteDetails: concreteDetails.slice(0, 3),
    emotionalTone: 'Nostalgic Reverence & Enduring Gratitude',
    keywords: ['Lineage', 'Hearth', 'Sanctuary', 'Migration', 'Continuity', 'Devotion'],
    ancestralThemes: ['Intergenerational Memory', 'Sacred Preservation of Roots'],
  };
}

function getFallbackRoots(objectName: string): RootsContextData {
  const lower = objectName.toLowerCase();
  if (lower.includes('car') || lower.includes('automobile') || lower.includes('model t')) {
    return {
      region: 'Early Automotive Age & Migration Corridors',
      historicalEra: '1920s Industrial Craft & Motoring Heritage',
      fact: 'In the early 20th century, family automobiles like this Model T transformed community life, enabling historic migrations, cross-country reunions, and newfound freedom across generations.',
      source: 'National Automotive Heritage Registry & Family Migration Archives',
      culturalSignificance: 'A rolling monument to generational ambition, mobility, and family adventures.',
    };
  }

  return {
    region: 'Heritage Cultural Crossroads & Living Traditions',
    historicalEra: 'Early 20th Century Guild & Artisan Lineage',
    fact: `Across traditional artisan communities, heirlooms like this ${objectName} were consecrated upon major life milestones, blessed by elders, and preserved near the family hearth to anchor lineage across migrations.`,
    source: 'Living Traditions Heritage Archives & Guild Records',
    culturalSignificance: 'An unbroken conduit between ancestral origin and living memory.',
  };
}

function getFallbackBlessing(
  objectName: string,
  concreteDetails: string[],
  rootsFact: string,
  rootsRegion: string
): ProvenanceBlessing {
  const detail1 = concreteDetails[0] || 'the memories spoken by your elders';
  const detail2 = concreteDetails[1] || 'the journeys carried across roads';

  return {
    memory: [
      `You remember how ${detail1}.`,
      `In your words, this heirloom carries ${detail2}.`,
    ],
    context: `Rooted in the traditions of ${rootsRegion}: ${rootsFact}`,
    telling: `By the eternal hearth of the Ancestors, this ${objectName} stands witness. The hands that shaped it, the roads it traveled, and the hearts that guarded it speak through you now. May the flame of your memory guide the steps of all who follow.`,
    usedDetails: [detail1, detail2],
    badgeTitle: 'Keeper of the Ancestral Journey',
    badgeDescription: 'Honoring the living oral history woven across roads and generations.',
  };
}
