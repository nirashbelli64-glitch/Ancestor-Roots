# 🕊️ The Ancestor's Test — Roots Edition (AR)

> **A cinematic, AI-powered living heritage storytelling experience that awakens family heirlooms through AR lens vision, oral dialogue, ethnographic craft provenance, and warm humanized multilingual voice synthesis.**

---

## 🌟 Key Features

- **🌸 React Bits `<SoftAurora />` WebGL Shader**: GPU-accelerated Perlin noise aurora wave curtains in rich luminous crystal (`#f7f7f7`) and radiant magenta/purple (`#e100ff`) with interactive mouse physics.
- **👁️ Dynamic Multi-Category Visual Recognition**: Detects automobiles (Ford Model T, classic convertibles), timepieces, cameras, textiles, brassware, carved wooden boxes, ancestral jewelry, ledgers, and musical instruments.
- **🏷️ Screen-Space Floating AR Tags**: Interactive beacons highlighting craft techniques, material integrity, and historical patina.
- **🎙️ Warm Humanized Maternal Female Voice (TTS)**: Soothing storytelling voice with natural inflection and real-time audio waveform equalizer bars.
- **🌐 14+ Regional & Global Languages (STT + TTS)**: Supports Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Spanish, French, Arabic, Japanese, and English.
- **📜 Provenance-Labeled Blessing**: 3-tier synthesis weaving Personal Truth, Regional Archival Context, and the Ancestor's Lyrical Telling.
- **🏅 Ancestral Ember Badge & Memory Thread**: Unlockable digital heirloom medallions and an intergenerational session archive.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism
- **Shaders & 3D**: `ogl` (WebGL 3D Shader, Perlin Noise)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + Canvas Particle Engine + Canvas Confetti
- **Audio & Speech**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **AI Backend**: Groq API (`llama-3.2-90b-vision-preview`, `llama-3.3-70b-versatile`) + Zero-Downtime Fallback

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ancestors-test.git
cd ancestors-test
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Add your Groq API key (if you want live cloud LLM generation; the app includes realistic dynamic fallback simulation):
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
ancestors-test/
├── app/
│   ├── api/
│   │   ├── scan/route.ts         # Visual object & AR tag recognition
│   │   ├── questions/route.ts    # Tailored memory retrieval questions
│   │   ├── extract/route.ts      # Emotional resonance & keyword extraction
│   │   ├── roots/route.ts        # Archival craft & ethnographic context
│   │   └── blessing/route.ts     # Provenance blessing synthesis
│   ├── globals.css               # Cosmic obsidian & pink/purple glassmorphism
│   ├── layout.tsx                # Font imports & metadata
│   └── page.tsx                  # Main 7-stage orchestrator
├── components/
│   ├── stages/                   # 7 interactive pipeline stages
│   │   ├── LandingStage.tsx
│   │   ├── CameraStage.tsx
│   │   ├── TagsStage.tsx
│   │   ├── QuestionStage.tsx
│   │   ├── ProcessingStage.tsx
│   │   ├── BlessingStage.tsx
│   │   └── BadgeStage.tsx
│   ├── ui/                       # Glassmorphic components & SoftAurora WebGL
│   └── providers/                # SessionContext state management
└── lib/                          # Prompts, language definitions, vision ontology
```

---

## 📜 License
MIT
