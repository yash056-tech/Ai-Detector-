import {
  AIEngineId,
  DetectorResult,
  GrammarResult,
  HumanizeIntensity,
  HumanizeResult,
  HumanizeTone,
} from "@/types";

export interface DetectApiParams {
  text: string;
  engine?: AIEngineId;
  apiKey?: string;
}

export interface GrammarApiParams {
  text: string;
}

export interface HumanizeApiParams {
  text: string;
  tone: HumanizeTone;
  intensity: HumanizeIntensity;
  engine: AIEngineId;
  apiKey?: string;
}

export async function checkAiDetection(params: DetectApiParams): Promise<DetectorResult> {
  const response = await fetch("/api/detect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `AI Detector error: ${response.statusText}`);
  }

  return response.json();
}

export async function checkGrammar(params: GrammarApiParams): Promise<GrammarResult> {
  const response = await fetch("/api/grammar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Grammar check error: ${response.statusText}`);
  }

  return response.json();
}

export async function humanizeText(params: HumanizeApiParams): Promise<HumanizeResult> {
  const response = await fetch("/api/humanize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Humanizer error: ${response.statusText}`);
  }

  return response.json();
}
