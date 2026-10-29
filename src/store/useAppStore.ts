import { create } from 'zustand';
import {
  ActiveTab,
  AIEngineId,
  DetectorResult,
  GrammarIssue,
  GrammarResult,
  HumanizeIntensity,
  HumanizeResult,
  HumanizeTone,
  TextMetrics,
} from '@/types';
import { calculateTextMetrics } from '@/lib/readability';
import { checkAiDetection, checkGrammar, humanizeText } from '@/lib/api-client';
import { DEFAULT_AI_ENGINE } from '@/lib/ai-engine-config';
import { SAMPLE_TEXTS } from '@/lib/samples';

interface AppState {
  // Navigation & Config
  activeTab: ActiveTab;
  selectedEngine: AIEngineId;
  apiKeys: Record<string, string>;

  // Text & Metrics
  text: string;
  metrics: TextMetrics;
  history: string[];
  historyIndex: number;

  // AI Detector state
  isDetecting: boolean;
  detectorResult: DetectorResult | null;
  selectedSentenceId: string | null;

  // Grammar state
  isCheckingGrammar: boolean;
  grammarResult: GrammarResult | null;
  activeGrammarIssue: GrammarIssue | null;

  // Humanizer state
  isHumanizing: boolean;
  humanizeTone: HumanizeTone;
  humanizeIntensity: HumanizeIntensity;
  humanizeResult: HumanizeResult | null;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedEngine: (engine: AIEngineId) => void;
  setApiKey: (provider: string, key: string) => void;
  setText: (newText: string, recordHistory?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  loadSample: (sampleId: string) => void;
  clearText: () => void;

  // Analysis actions
  runDetector: () => Promise<void>;
  runGrammarCheck: () => Promise<void>;
  runHumanize: () => Promise<void>;

  // Grammar mutation actions
  applyGrammarFix: (issueId: string, replacement: string) => void;
  applyAllGrammarFixes: () => void;
  dismissGrammarIssue: (issueId: string) => void;
  setActiveGrammarIssue: (issue: GrammarIssue | null) => void;

  // Humanizer mutation actions
  setHumanizeTone: (tone: HumanizeTone) => void;
  setHumanizeIntensity: (intensity: HumanizeIntensity) => void;
  applyHumanizedText: () => void;
  setSelectedSentenceId: (id: string | null) => void;
}

const INITIAL_TEXT = SAMPLE_TEXTS[0].text;

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'detector',
  selectedEngine: DEFAULT_AI_ENGINE,
  apiKeys: {},

  text: INITIAL_TEXT,
  metrics: calculateTextMetrics(INITIAL_TEXT),
  history: [INITIAL_TEXT],
  historyIndex: 0,

  isDetecting: false,
  detectorResult: null,
  selectedSentenceId: null,

  isCheckingGrammar: false,
  grammarResult: null,
  activeGrammarIssue: null,

  isHumanizing: false,
  humanizeTone: 'professional',
  humanizeIntensity: 'balanced',
  humanizeResult: null,

  setActiveTab: (tab) => {
    set({ activeTab: tab });
    const { text, detectorResult, grammarResult } = get();

    // Auto-trigger analysis when switching if not already run
    if (tab === 'detector' && !detectorResult && text.trim().length > 20) {
      get().runDetector();
    } else if (tab === 'grammar' && !grammarResult && text.trim().length > 20) {
      get().runGrammarCheck();
    }
  },

  setSelectedEngine: (engine) => set({ selectedEngine: engine }),

  setApiKey: (provider, key) =>
    set((state) => ({
      apiKeys: { ...state.apiKeys, [provider]: key },
    })),

  setText: (newText, recordHistory = true) => {
    const metrics = calculateTextMetrics(newText);
    const { history, historyIndex } = get();

    if (recordHistory) {
      const updatedHistory = history.slice(0, historyIndex + 1);
      updatedHistory.push(newText);
      // Keep last 30 states
      if (updatedHistory.length > 30) updatedHistory.shift();

      set({
        text: newText,
        metrics,
        history: updatedHistory,
        historyIndex: updatedHistory.length - 1,
      });
    } else {
      set({ text: newText, metrics });
    }
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevText = history[newIndex];
      set({
        text: prevText,
        metrics: calculateTextMetrics(prevText),
        historyIndex: newIndex,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextText = history[newIndex];
      set({
        text: nextText,
        metrics: calculateTextMetrics(nextText),
        historyIndex: newIndex,
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  loadSample: (sampleId) => {
    const sample = SAMPLE_TEXTS.find((s) => s.id === sampleId);
    if (!sample) return;

    get().setText(sample.text);
    // Reset analyses to freshly scan
    set({
      detectorResult: null,
      grammarResult: null,
      humanizeResult: null,
      selectedSentenceId: null,
      activeGrammarIssue: null,
    });

    const activeTab = get().activeTab;
    if (activeTab === 'detector') {
      get().runDetector();
    } else if (activeTab === 'grammar') {
      get().runGrammarCheck();
    }
  },

  clearText: () => {
    get().setText('');
    set({
      detectorResult: null,
      grammarResult: null,
      humanizeResult: null,
      selectedSentenceId: null,
      activeGrammarIssue: null,
    });
  },

  runDetector: async () => {
    const { text, selectedEngine, apiKeys } = get();
    if (!text.trim()) return;

    set({ isDetecting: true });
    try {
      const result = await checkAiDetection({
        text,
        engine: selectedEngine,
        apiKey: apiKeys[selectedEngine],
      });
      set({ detectorResult: result, isDetecting: false });
    } catch (err) {
      console.error('Detector error:', err);
      set({ isDetecting: false });
    }
  },

  runGrammarCheck: async () => {
    const { text } = get();
    if (!text.trim()) return;

    set({ isCheckingGrammar: true });
    try {
      const result = await checkGrammar({ text });
      set({ grammarResult: result, isCheckingGrammar: false });
    } catch (err) {
      console.error('Grammar check error:', err);
      set({ isCheckingGrammar: false });
    }
  },

  runHumanize: async () => {
    const { text, humanizeTone, humanizeIntensity, selectedEngine, apiKeys } = get();
    if (!text.trim()) return;

    set({ isHumanizing: true });
    try {
      const result = await humanizeText({
        text,
        tone: humanizeTone,
        intensity: humanizeIntensity,
        engine: selectedEngine,
        apiKey: apiKeys[selectedEngine],
      });
      set({ humanizeResult: result, isHumanizing: false });
    } catch (err) {
      console.error('Humanize error:', err);
      set({ isHumanizing: false });
    }
  },

  applyGrammarFix: (issueId, replacement) => {
    const { text, grammarResult } = get();
    if (!grammarResult) return;

    const issue = grammarResult.issues.find((i) => i.id === issueId);
    if (!issue) return;

    // Replace substring at offset
    const before = text.slice(0, issue.offset);
    const after = text.slice(issue.offset + issue.length);
    const newText = before + replacement + after;

    const lengthDelta = replacement.length - issue.length;

    // Update remaining issue offsets
    const remainingIssues = grammarResult.issues
      .filter((i) => i.id !== issueId)
      .map((i) => {
        if (i.offset > issue.offset) {
          return { ...i, offset: i.offset + lengthDelta };
        }
        return i;
      });

    const updatedResult: GrammarResult = {
      ...grammarResult,
      issues: remainingIssues,
      cleanlinessScore: Math.min(
        100,
        Math.round(100 - (remainingIssues.length * 100) / Math.max(1, get().metrics.words / 5))
      ),
      summary: {
        grammarCount: remainingIssues.filter((i) => i.category === 'grammar').length,
        spellingCount: remainingIssues.filter((i) => i.category === 'spelling').length,
        punctuationCount: remainingIssues.filter((i) => i.category === 'punctuation').length,
        styleCount: remainingIssues.filter((i) => i.category === 'style').length,
      },
    };

    set({
      grammarResult: updatedResult,
      activeGrammarIssue: null,
    });
    get().setText(newText);
  },

  applyAllGrammarFixes: () => {
    const { text, grammarResult } = get();
    if (!grammarResult || grammarResult.issues.length === 0) return;

    // Sort issues by offset descending so applying replacements doesn't corrupt subsequent offsets
    const sortedIssues = [...grammarResult.issues].sort((a, b) => b.offset - a.offset);

    let currentText = text;
    for (const issue of sortedIssues) {
      if (issue.replacements.length > 0) {
        const replacement = issue.replacements[0];
        const before = currentText.slice(0, issue.offset);
        const after = currentText.slice(issue.offset + issue.length);
        currentText = before + replacement + after;
      }
    }

    set({
      grammarResult: {
        ...grammarResult,
        issues: [],
        cleanlinessScore: 100,
        summary: {
          grammarCount: 0,
          spellingCount: 0,
          punctuationCount: 0,
          styleCount: 0,
        },
      },
      activeGrammarIssue: null,
    });
    get().setText(currentText);
  },

  dismissGrammarIssue: (issueId) => {
    const { grammarResult } = get();
    if (!grammarResult) return;

    const remaining = grammarResult.issues.filter((i) => i.id !== issueId);
    set({
      grammarResult: {
        ...grammarResult,
        issues: remaining,
      },
      activeGrammarIssue: null,
    });
  },

  setActiveGrammarIssue: (issue) => set({ activeGrammarIssue: issue }),

  setHumanizeTone: (tone) => set({ humanizeTone: tone }),
  setHumanizeIntensity: (intensity) => set({ humanizeIntensity: intensity }),

  applyHumanizedText: () => {
    const { humanizeResult } = get();
    if (!humanizeResult) return;

    get().setText(humanizeResult.humanizedText);
    // Switch to detector to let the user admire the 98% human score!
    set({
      activeTab: 'detector',
      detectorResult: null, // Clear to freshly scan
    });
    get().runDetector();
  },

  setSelectedSentenceId: (id) => set({ selectedSentenceId: id }),
}));
