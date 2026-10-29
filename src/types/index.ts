export type ActiveTab = 'detector' | 'grammar' | 'humanizer';

export type AIEngineId = 'claude-3-5-sonnet' | 'gpt-4o' | 'deepseek-v3' | 'gemini-1-5-pro';

export interface AIEngineOption {
  id: AIEngineId;
  name: string;
  provider: 'Anthropic' | 'OpenAI' | 'DeepSeek' | 'Google';
  badge?: 'Recommended' | 'Default' | 'Fast' | 'Popular';
  description: string;
  isDefault?: boolean;
}

export type HumanizeTone = 'professional' | 'casual' | 'academic' | 'creative' | 'direct';

export type HumanizeIntensity = 'subtle' | 'balanced' | 'aggressive';

export interface SentenceAnalysis {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  aiProbability: number; // 0 to 100
  label: 'ai' | 'mixed' | 'human'; // ai: >=75, mixed: 40-74, human: <40
  perplexity: number;
  burstiness: number;
  reason?: string;
}

export interface DetectorResult {
  overallScore: number; // 0 to 100 (AI likelihood)
  classification: 'Likely AI-Generated' | 'Mixed AI & Human' | 'Likely Human-Written';
  sentences: SentenceAnalysis[];
  perplexityScore: number;
  burstinessScore: number;
  vocabularyRichness: number; // 0 to 100
  analyzedAt: string;
  wordCount: number;
}

export interface GrammarIssue {
  id: string;
  category: 'grammar' | 'spelling' | 'punctuation' | 'style';
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  originalText: string;
  replacements: string[];
  explanation: string;
  ruleId?: string;
}

export interface GrammarResult {
  issues: GrammarIssue[];
  cleanlinessScore: number; // 0 to 100
  summary: {
    grammarCount: number;
    spellingCount: number;
    punctuationCount: number;
    styleCount: number;
  };
  analyzedAt: string;
}

export interface HumanizeResult {
  originalText: string;
  humanizedText: string;
  tone: HumanizeTone;
  intensity: HumanizeIntensity;
  engineUsed: AIEngineId;
  beforeAiScore: number;
  afterAiScore: number;
  readabilityDelta: {
    beforeGrade: string;
    afterGrade: string;
  };
  changesCount: number;
  timestamp: string;
}

export interface TextMetrics {
  words: number;
  characters: number;
  charactersWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  fleschKincaidScore: number;
  readingLevel: string;
}
