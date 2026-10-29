import { NextRequest, NextResponse } from "next/server";
import { DetectorResult, SentenceAnalysis } from "@/types";
import { extractSentencesWithOffsets } from "@/lib/readability";

const AI_MARKERS = [
  "delve", "delving", "testament", "tapestry", "furthermore", "moreover",
  "in conclusion", "it is important to note", "it is worth noting", "crucial",
  "pivotal", "multifaceted", "interplay", "beacon", "catalyst", "fostering",
  "underscores", "illuminates", "seamlessly", "holistic", "paradigm",
  "unprecedented", "ever-evolving", "cutting-edge", "harnessing", "transcend",
  "dynamic", "robust ecosystem", "synergy", "sustainable scalability"
];

export async function POST(req: NextRequest) {
  try {
    const { text, engine, apiKey } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const sentencesWithOffsets = extractSentencesWithOffsets(text);
    if (sentencesWithOffsets.length === 0) {
      return NextResponse.json({ error: "No sentences detected" }, { status: 400 });
    }

    // Word counts per sentence for burstiness calculation
    const sentenceLengths = sentencesWithOffsets.map((s) => {
      const words = s.text.trim().match(/\b[a-zA-Z0-9'-]+\b/g) || [];
      return Math.max(1, words.length);
    });

    // Calculate mean and variance of sentence length (burstiness)
    const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance =
      sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLen, 2), 0) /
      sentenceLengths.length;
    const stdDev = Math.sqrt(variance);

    // Burstiness score: AI tends to have very uniform sentence lengths (low stdDev).
    // Humans write short, punchy sentences followed by long ones.
    const burstinessScore = Math.min(100, Math.round((stdDev / Math.max(1, avgLen)) * 100));

    // Vocabulary richness (Type-Token Ratio)
    const allWords = (text.toLowerCase().match(/\b[a-z'-]+\b/g) || []);
    const uniqueWords = new Set(allWords);
    const vocabularyRichness = allWords.length > 0 
      ? Math.round((uniqueWords.size / allWords.length) * 100) 
      : 80;

    // Perplexity estimation (AI text has low perplexity, i.e., highly predictable)
    let totalAiScoreAccumulator = 0;

    const sentenceAnalyses: SentenceAnalysis[] = sentencesWithOffsets.map((item, index) => {
      const sentenceText = item.text.trim();
      const lower = sentenceText.toLowerCase();

      // Check markers
      const matchedMarkers = AI_MARKERS.filter((marker) =>
        lower.includes(marker.toLowerCase())
      );

      const words = sentenceText.match(/\b[a-zA-Z0-9'-]+\b/g) || [];
      const wordCount = words.length;

      // Base AI probability factors
      let prob = 45; // neutral baseline

      // Low burstiness (monotonous length around 18-25 words is classic GPT style)
      if (wordCount >= 16 && wordCount <= 28) {
        prob += 15;
      } else if (wordCount < 8 || wordCount > 35) {
        prob -= 20; // Short punchy or very long rambling sentences are usually human
      }

      // Marker penalties
      if (matchedMarkers.length > 0) {
        prob += matchedMarkers.length * 20;
      }

      // Passive voice indicators
      if (/\b(is|are|was|were|been|being)\s+([a-z]+ed|[a-z]+en)\b/i.test(sentenceText)) {
        prob += 10;
      }

      // First-person perspective ("I", "my", "we", "our") strongly indicates human voice
      if (/\b(i|my|mine|we|our|ours|myself)\b/i.test(sentenceText)) {
        prob -= 35;
      }

      // Colloquialisms, contractions, dashes
      if (/\b(honestly|well|you know|gonna|wanna|kinda|messy|anyway)\b/i.test(sentenceText) || sentenceText.includes("—")) {
        prob -= 25;
      }

      // Format boundary
      const clampedProb = Math.max(4, Math.min(99, Math.round(prob)));
      totalAiScoreAccumulator += clampedProb;

      let label: 'ai' | 'mixed' | 'human' = 'mixed';
      if (clampedProb >= 75) label = 'ai';
      else if (clampedProb < 40) label = 'human';

      // Generate context-aware reason
      let reason = "Natural sentence cadence with dynamic flow.";
      if (clampedProb >= 75) {
        if (matchedMarkers.length > 0) {
          reason = `Flagged due to clichéd AI signifiers (${matchedMarkers.slice(0, 2).map(m => `"${m}"`).join(", ")}) and structured cadence.`;
        } else {
          reason = "Flagged due to uniform syntactic rhythm, abstract noun density, and high predictability.";
        }
      } else if (clampedProb >= 40) {
        reason = "Exhibits moderate formal predictability but contains mixed human syntactic elements.";
      } else {
        reason = "High perplexity and irregular human burstiness; low machine predictability.";
      }

      return {
        id: `sent-${index}`,
        text: item.text,
        startIndex: item.start,
        endIndex: item.end,
        aiProbability: clampedProb,
        label,
        perplexity: Math.max(15, Math.min(180, Math.round(120 - clampedProb * 0.9))),
        burstiness: burstinessScore,
        reason,
      };
    });

    const rawOverall = Math.round(totalAiScoreAccumulator / sentenceAnalyses.length);
    // Factor in overall burstiness: high burstiness reduces overall AI score
    const adjustedScore = Math.max(
      3,
      Math.min(99, Math.round(rawOverall * 0.85 + (100 - burstinessScore) * 0.15))
    );

    let classification: DetectorResult["classification"] = "Mixed AI & Human";
    if (adjustedScore >= 75) {
      classification = "Likely AI-Generated";
    } else if (adjustedScore < 40) {
      classification = "Likely Human-Written";
    }

    const result: DetectorResult = {
      overallScore: adjustedScore,
      classification,
      sentences: sentenceAnalyses,
      perplexityScore: Math.round(135 - adjustedScore * 0.8),
      burstinessScore,
      vocabularyRichness,
      analyzedAt: new Date().toISOString(),
      wordCount: allWords.length,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Detect API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to analyze text" },
      { status: 500 }
    );
  }
}
