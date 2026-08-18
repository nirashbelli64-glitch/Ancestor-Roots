export interface HeritageLanguage {
  id: string;
  name: string;
  nativeName: string;
  code: string;       // BCP-47 for Web Speech API (e.g. 'hi-IN', 'ta-IN', 'en-US')
  flag: string;
  greeting: string;
  warmthPromptName: string;
}

export const SUPPORTED_LANGUAGES: HeritageLanguage[] = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    code: 'en-US',
    flag: '🌍',
    greeting: 'Welcome, seeker of memories.',
    warmthPromptName: 'English with gentle maternal wisdom',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    code: 'hi-IN',
    flag: '🇮🇳',
    greeting: 'स्मृतियों के इस पावन आँगन में आपका स्वागत है।',
    warmthPromptName: 'Hindi with warm ancestral affection (मधुर वात्सल्य)',
  },
  {
    id: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    code: 'ta-IN',
    flag: '🇮🇳',
    greeting: 'நினைவுகளின் புனித முற்றத்திற்கு உங்களை வரவேற்கிறோம்.',
    warmthPromptName: 'Tamil with deep poetic maternal warmth',
  },
  {
    id: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    code: 'te-IN',
    flag: '🇮🇳',
    greeting: 'పూర్వీకుల జ్ఞాపకాల పవిత్ర వేదికకు స్వాగతం.',
    warmthPromptName: 'Telugu with soothing ancestral cadence',
  },
  {
    id: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    code: 'bn-IN',
    flag: '🇮🇳',
    greeting: 'স্মৃতির এই পবিত্র প্রাঙ্গণে আপনাকে স্বাগত।',
    warmthPromptName: 'Bengali with lyrical comforting tone',
  },
  {
    id: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    code: 'mr-IN',
    flag: '🇮🇳',
    greeting: 'पूर्वजांच्या आठवणींच्या या पवित्र दरबारात आपले स्वागत आहे.',
    warmthPromptName: 'Marathi with loving ancestral warmth',
  },
  {
    id: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    code: 'gu-IN',
    flag: '🇮🇳',
    greeting: 'યાદોના આ પવિત્ર આંગણામાં આપનું હાર્દિક સ્વાગત છે.',
    warmthPromptName: 'Gujarati with affectionate maternal embrace',
  },
  {
    id: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    code: 'kn-IN',
    flag: '🇮🇳',
    greeting: 'ಪೂರ್ವಜರ ನೆನಪುಗಳ ಪಾವನ ತಾಣಕ್ಕೆ ಸುಸ್ವಾಗತ.',
    warmthPromptName: 'Kannada with gentle ancestral affection',
  },
  {
    id: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    code: 'ml-IN',
    flag: '🇮🇳',
    greeting: 'പൂർവ്വിക സ്മരണകളുടെ വിശുദ്ധ തണലിലേക്ക് സ്വാഗതം.',
    warmthPromptName: 'Malayalam with soothing maternal resonance',
  },
  {
    id: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    code: 'pa-IN',
    flag: '🇮🇳',
    greeting: 'ਪੁਰਖਿਆਂ ਦੀਆਂ ਯਾਦਾਂ ਦੇ ਇਸ ਵਿਹੜੇ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ।',
    warmthPromptName: 'Punjabi with heartfelt ancestral love',
  },
  {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    code: 'es-ES',
    flag: '🇪🇸',
    greeting: 'Bienvenido al santuario de las memorias ancestrales.',
    warmthPromptName: 'Spanish with warm maternal embrace (abrazo maternal)',
  },
  {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
    code: 'fr-FR',
    flag: '🇫🇷',
    greeting: 'Bienvenue dans le sanctuaire des mémoires ancestrales.',
    warmthPromptName: 'French with poetic comforting elegance',
  },
  {
    id: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    code: 'ar-SA',
    flag: '🇸🇦',
    greeting: 'أهلاً بك في محراب ذكريات الأجداد.',
    warmthPromptName: 'Arabic with revered ancestral warmth',
  },
  {
    id: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    code: 'ja-JP',
    flag: '🇯🇵',
    greeting: '先祖の記憶が宿る聖なる地へようこそ。',
    warmthPromptName: 'Japanese with gentle respectful maternal warmth (温かい語り)',
  },
];

/**
 * Finds the most warm, soothing, and natural female voice for the target language.
 */
export function findWarmFemaleVoice(
  voices: SpeechSynthesisVoice[],
  langCode: string
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const baseLang = langCode.split('-')[0].toLowerCase();

  // Filter voices matching the language code or prefix
  const matchingVoices = voices.filter((v) => {
    const vLang = v.lang.toLowerCase();
    return vLang === langCode.toLowerCase() || vLang.startsWith(baseLang);
  });

  if (matchingVoices.length === 0) {
    // Fallback to any voice with language prefix or first voice
    return voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices[0];
  }

  // Keywords that identify warm, natural female voices
  const femaleKeywords = [
    'female', 'woman', 'natural', 'google', 'samantha', 'karen', 'moira',
    'serena', 'zira', 'lekha', 'swara', 'heera', 'kalpana', 'veena',
    'shree', 'victoria', 'siri', 'fiona', 'tessa', 'melina', 'paulina',
    'celine', 'audrey', 'amira', 'kyoko', 'yuna', 'hazuki', 'marlene'
  ];

  // 1. Check for known natural female voices in matching language
  for (const voice of matchingVoices) {
    const nameLower = voice.name.toLowerCase();
    for (const kw of femaleKeywords) {
      if (nameLower.includes(kw)) {
        return voice;
      }
    }
  }

  // 2. Return first matching language voice
  return matchingVoices[0];
}
