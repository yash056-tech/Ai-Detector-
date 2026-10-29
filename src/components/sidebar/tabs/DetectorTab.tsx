"use client";

import { useAppStore } from "@/store/useAppStore";
import { ScoreGauge } from "../ScoreGauge";
import {
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Info,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

export function DetectorTab() {
  const {
    text,
    isDetecting,
    detectorResult,
    runDetector,
    setActiveTab,
    selectedSentenceId,
    setSelectedSentenceId,
  } = useAppStore();

  const [filter, setFilter] = useState<"all" | "ai" | "human">("all");

  if (!detectorResult) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 h-full">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            No Analysis Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            Scan your text to inspect AI generation probabilities, sentence burstiness, and machine cadence.
          </p>
        </div>
        <button
          onClick={runDetector}
          disabled={isDetecting || !text.trim()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
        >
          {isDetecting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Scanning Patterns...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Scan for AI Content
            </>
          )}
        </button>
      </div>
    );
  }

  const { overallScore, classification, sentences, perplexityScore, burstinessScore, vocabularyRichness } =
    detectorResult;

  const filteredSentences = sentences.filter((s) => {
    if (filter === "ai") return s.label === "ai";
    if (filter === "human") return s.label === "human";
    return true;
  });

  const aiSentenceCount = sentences.filter((s) => s.label === "ai").length;
  const humanSentenceCount = sentences.filter((s) => s.label === "human").length;
  const mixedSentenceCount = sentences.filter((s) => s.label === "mixed").length;

  return (
    <div className="space-y-5 p-4 sm:p-5">
      {/* Top Header Card */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-3 right-3">
          <button
            onClick={runDetector}
            disabled={isDetecting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Re-run detector"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDetecting ? "animate-spin" : ""}`} />
          </button>
        </div>

        <ScoreGauge
          score={overallScore}
          type="ai"
          label="AI Probability"
          size={135}
        />

        <div className="mt-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              overallScore >= 75
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300"
                : overallScore >= 40
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
            }`}
          >
            {overallScore >= 75 ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : overallScore >= 40 ? (
              <Info className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            {classification}
          </span>
        </div>

        {overallScore >= 40 && (
          <button
            onClick={() => setActiveTab("humanizer")}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all group"
          >
            <Zap className="w-3.5 h-3.5" />
            Bypass Detection with Humanizer
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Activity className="w-3 h-3 text-indigo-500" />
            Burstiness
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">
            {burstinessScore}%
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {burstinessScore > 50 ? "Varied rhythm" : "Uniform length"}
          </span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Layers className="w-3 h-3 text-teal-500" />
            Perplexity
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">
            {perplexityScore}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {perplexityScore > 60 ? "Unpredictable" : "Predictable"}
          </span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Vocabulary
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">
            {vocabularyRichness}%
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Unique words
          </span>
        </div>
      </div>

      {/* Sentence Breakdown Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Sentence-by-Sentence Breakdown
          </h4>
          <span className="text-xs text-slate-400">
            {sentences.length} sentences
          </span>
        </div>

        {/* Legend pills & filter */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            All ({sentences.length})
          </button>
          <button
            onClick={() => setFilter("ai")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              filter === "ai"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            AI ({aiSentenceCount})
          </button>
          <button
            onClick={() => setFilter("human")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              filter === "human"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Human ({humanSentenceCount})
          </button>
        </div>

        {/* Sentence Cards */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {filteredSentences.map((sent) => {
            const isSelected = selectedSentenceId === sent.id;
            const borderBadge =
              sent.label === "ai"
                ? "border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                : sent.label === "mixed"
                ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                : "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400";

            return (
              <div
                key={sent.id}
                onClick={() => setSelectedSentenceId(isSelected ? null : sent.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-indigo-500 bg-white dark:bg-slate-900 border-indigo-400 shadow-md"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${borderBadge}`}>
                    {sent.aiProbability}% {sent.label.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Perplexity: {sent.perplexity}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  &ldquo;{sent.text.trim()}&rdquo;
                </p>
                {isSelected && sent.reason && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                    <p className="italic">💡 {sent.reason}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
