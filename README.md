# ScribeHuman — AI Content Detector, Grammar Checker & AI Humanizer

A comprehensive, production-grade text-analysis SaaS platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

---

## ✨ Features

### 1. 🔍 AI Content Detector
- **Real-Time & On-Demand Analysis:** Calculates overall likelihood of machine generation (0–100%).
- **Sentence-by-Sentence Highlighting:**
  - 🔴 **Red:** High AI Probability ($\ge 75\%$)
  - 🟡 **Amber:** Mixed / Moderate Probability ($40\% - 74\%$)
  - 🟢 **Green:** Likely Human-Written ($< 40\%$)
- **Deep Linguistic Telemetry:** Real-time metrics for **Burstiness** (sentence length variance), **Perplexity** (unpredictability), and **Vocabulary Richness** (Type-Token Ratio).
- **Interactive Sentence Inspector:** Click any highlighted sentence in the editor to view its individual perplexity, AI probability, and linguistic diagnosis.

### 2. ✍️ Grammar & Syntax Checker
- **Multi-Category Proofreading:** Identifies spelling errors, subject-verb disagreements, homophone confusions, comma splices, awkward phrasing, and punctuation flaws.
- **Interactive Inline Tooltips:** Click any wavy-underlined error in the editor to open a popover with 1-click replacement and rule explanations.
- **One-Click Batch Fix:** "Accept All Suggestions" button with confetti celebration to resolve all errors in optimal topological order.

### 3. ⚡ AI-to-Human Text Converter (Humanizer)
- **High-Bypass Rewriting Engine:** Eliminates formulaic AI clichés (*"delve"*, *"testament"*, *"tapestry"*, *"furthermore"*, *"in conclusion"*, *"interplay"*), injects human cadence, and elevates burstiness.
- **Engine Selection:**
  - **Claude 3.5 Sonnet** (Default & Recommended)
  - **ChatGPT (GPT-4o)** (Recommended)
  - **DeepSeek V3** (Popular)
  - **Google Gemini 1.5 Pro** (Fast)
- **Tone Personalization:** Professional, Casual, Academic, Creative, Direct.
- **Bypass Intensity:** Subtle (Light Polish), Balanced (High-Bypass), Aggressive (Ultra Human).
- **Visual Diff Viewer:** Word-level diff viewer (Inline and Split View) showing additions in soft green and removed AI clichés in red strike-through.
- **Detection Delta:** Visual gauge showcasing the drop in AI probability (e.g., $94\% \rightarrow 7\%$).

---

## 🚀 Quickstart

### Prerequisites
- Node.js $\ge 18$
- npm, pnpm, or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── detect/route.ts       # AI detection engine
│   │   ├── grammar/route.ts      # Grammar & proofreading engine
│   │   └── humanize/route.ts     # Humanization & rewriting engine
│   ├── globals.css               # Theming & custom scrollbars
│   ├── layout.tsx                # Theme provider & root HTML
│   └── page.tsx                  # Split-screen responsive layout
├── components/
│   ├── editor/
│   │   ├── EditorPane.tsx        # Multi-layer rich text editor
│   │   ├── EditorToolbar.tsx     # Undo/redo, clear, paste, word counts
│   │   ├── GrammarTooltip.tsx    # Inline 1-click correction popover
│   │   └── SentenceDetailModal.tsx # Sentence diagnostic inspector
│   ├── header/
│   │   ├── EngineSelector.tsx    # Claude 3.5 (Default) & GPT-4o selector
│   │   ├── Navbar.tsx            # Global header & mode switchers
│   │   └── ThemeToggle.tsx       # Light / Dark mode toggle
│   ├── modals/
│   │   ├── ApiKeyModal.tsx       # Custom API key settings
│   │   └── SampleTextModal.tsx   # Pre-built testing scenarios
│   ├── providers/
│   │   └── ThemeProvider.tsx     # Next-themes wrapper
│   └── sidebar/
│       ├── DiffViewer.tsx        # Inline / split word-level diff viewer
│       ├── ScoreGauge.tsx        # SVG animated circular score gauge
│       ├── SidebarContainer.tsx  # Dynamic right pane container
│       └── tabs/
│           ├── DetectorTab.tsx   # AI detector metrics & sentence feed
│           ├── GrammarTab.tsx    # Cleanliness score & issue cards
│           └── HumanizerTab.tsx  # Engine, tone, bypass & diff comparison
├── lib/
│   ├── ai-engine-config.ts       # Claude (Recommended Default) config
│   ├── api-client.ts             # Type-safe API client wrappers
│   ├── readability.ts            # Flesch-Kincaid & sentence tokenizers
│   ├── samples.ts                # Real-world test datasets
│   └── utils.ts                  # Tailwind merge & formatting helpers
├── store/
│   └── useAppStore.ts            # Zustand unified application store
└── types/
    └── index.ts                  # TypeScript domain models & interfaces
```

---

## 🎨 Design System & Theming

- **Light Mode:** Stark white (`#FFFFFF`) and airy off-white (`#F9FAFB`) with crisp slate gray typography (`text-slate-900`, `text-slate-600`), accented with soft indigo (`#6366F1`) and emerald/teal highlights.
- **Dark Mode:** Deep charcoal (`#0B0F19`) and slate surfaces (`#1E293B`) with desaturated text (`text-slate-100`, `text-slate-300`) preventing eye strain.
- **Typography:** Modern clean sans-serif system stack styled after Notion and Grammarly.
