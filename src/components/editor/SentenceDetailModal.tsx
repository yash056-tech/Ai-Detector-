"use client";

import { SentenceAnalysis } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { X, Sparkles, Zap, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";

interface SentenceDetailModalProps {
  sentence: SentenceAnalysis;
  onClose: () => void;
}

export function SentenceDetailModal({ sentence, onClose }: SentenceDetailModalProps) {
  const { setActiveTab } = useAppStore();

  const isAi = sentence.label === "ai";
  const isMixed = sentence.label === "mixed";

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-3rem)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center justify-center w-6 h-6 rounded-lg ${
              isAi
                ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                : isMixed
                ? "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
            }`}
          >
            {isAi ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : isMixed ? (
              <ShieldAlert className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
          </span>
          <div>
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
              Sentence Analysis
            </span>
            <span
              className={`ml-2 text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                isAi
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                  : isMixed
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {sentence.aiProbability}% AI Probability
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="my-3">
        <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 font-sans leading-relaxed">
          &ldquo;{sentence.text.trim()}&rdquo;
        </p>
      </div>

      {sentence.reason && (
        <div className="mb-3 text-xs text-slate-600 dark:text-slate-400 leading-snug">
          <strong className="text-slate-800 dark:text-slate-200">Diagnosis:</strong>{" "}
          {sentence.reason}
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-slate-500 py-1.5 border-t border-slate-100 dark:border-slate-800">
        <span>Perplexity: {sentence.perplexity}</span>
        <span>Sentence Length: {sentence.text.trim().split(/\s+/).length} words</span>
      </div>

      {sentence.aiProbability >= 40 && (
        <button
          onClick={() => {
            setActiveTab("humanizer");
            onClose();
          }}
          className="mt-3 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          Bypass in AI Humanizer
        </button>
      )}
    </div>
  );
}
