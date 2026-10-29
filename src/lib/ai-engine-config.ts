import { AIEngineOption, AIEngineId } from "@/types";

export const AI_ENGINES: AIEngineOption[] = [
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    badge: "Recommended",
    description: "Industry-leading natural prose, nuance, and human burstiness. Unsurpassed detector bypass rate.",
    isDefault: true,
  },
  {
    id: "gpt-4o",
    name: "ChatGPT (GPT-4o)",
    provider: "OpenAI",
    badge: "Recommended",
    description: "Fast, versatile, and highly articulate. Excellent for tone adaptation and structured edits.",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    badge: "Popular",
    description: "High-intelligence open reasoning model. Exceptional for technical, coding, and academic prose.",
  },
  {
    id: "gemini-1-5-pro",
    name: "Google Gemini 1.5 Pro",
    provider: "Google",
    badge: "Fast",
    description: "Extremely capable with large context and rich creative vocabulary.",
  },
];

export const DEFAULT_AI_ENGINE: AIEngineId = "claude-3-5-sonnet";

export function getEngineById(id: AIEngineId): AIEngineOption {
  return AI_ENGINES.find((e) => e.id === id) || AI_ENGINES[0];
}
