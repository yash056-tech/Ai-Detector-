"use client";

import { useAppStore } from "@/store/useAppStore";
import { ScoreGauge } from "../ScoreGauge";
import {
  SpellCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  X,
  Check,
  Zap,
} from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";

export function GrammarTab() {
  const {
    text,
    isCheckingGrammar,
    grammarResult,
    runGrammarCheck,
    applyGrammarFix,
    applyAllGrammarFixes,
    dismissGrammarIssue,
    activeGrammarIssue,
    setActiveGrammarIssue,
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState<string>("all");

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleFixAll = () => {
    applyAllGrammarFixes();
    triggerConfetti();
  };

  if (!grammarResult) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 h-full">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
          <SpellCheck className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Proofreader Ready
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            Scan your text for typos, syntax flaws, subject-verb disagreements, punctuation, and awkward phrasing.
          </p>
        </div>
        <button
          onClick={runGrammarCheck}
          disabled={isCheckingGrammar || !text.trim()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
        >
          {isCheckingGrammar ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Proofreading...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Check Grammar & Spelling
            </>
          )}
        </button>
      </div>
    );
  }

  const { issues, cleanlinessScore, summary } = grammarResult;

  const filteredIssues = issues.filter((issue) => {
    if (activeCategory === "all") return true;
    return issue.category === activeCategory;
  });

  return (
    <div className="space-y-5 p-4 sm:p-5">
      {/* Top Cleanliness Gauge Card */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-3 right-3">
          <button
            onClick={runGrammarCheck}
            disabled={isCheckingGrammar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Re-check grammar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingGrammar ? "animate-spin" : ""}`} />
          </button>
        </div>

        <ScoreGauge
          score={cleanlinessScore}
          type="cleanliness"
          label="Score"
          size={125}
        />

        <div className="mt-3 flex items-center gap-2">
          {issues.length === 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              All Clear! No issues detected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300">
              {issues.length} {issues.length === 1 ? "issue" : "issues"} to review
            </span>
          )}
        </div>

        {issues.length > 0 && (
          <button
            onClick={handleFixAll}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            Accept All Suggestions ({issues.length})
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
            activeCategory === "all"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          All ({issues.length})
        </button>
        <button
          onClick={() => setActiveCategory("grammar")}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
            activeCategory === "grammar"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
          }`}
        >
          Grammar ({summary.grammarCount})
        </button>
        <button
          onClick={() => setActiveCategory("spelling")}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
            activeCategory === "spelling"
              ? "bg-rose-600 text-white"
              : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300"
          }`}
        >
          Spelling ({summary.spellingCount})
        </button>
        <button
          onClick={() => setActiveCategory("punctuation")}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
            activeCategory === "punctuation"
              ? "bg-amber-600 text-white"
              : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
          }`}
        >
          Punctuation ({summary.punctuationCount})
        </button>
        <button
          onClick={() => setActiveCategory("style")}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
            activeCategory === "style"
              ? "bg-cyan-600 text-white"
              : "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300"
          }`}
        >
          Style ({summary.styleCount})
        </button>
      </div>

      {/* Issues Feed */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredIssues.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No issues found in this category.
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isHighlight = activeGrammarIssue?.id === issue.id;
            return (
              <div
                key={issue.id}
                onMouseEnter={() => setActiveGrammarIssue(issue)}
                className={`p-3.5 rounded-xl border transition-all ${
                  isHighlight
                    ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      issue.category === "grammar"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                        : issue.category === "spelling"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : issue.category === "punctuation"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
                    }`}
                  >
                    {issue.category}
                  </span>
                  <button
                    onClick={() => dismissGrammarIssue(issue.id)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold line-through text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                      {issue.originalText}
                    </span>
                    <span className="text-xs text-slate-400">→</span>
                    {issue.replacements.map((rep, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyGrammarFix(issue.id, rep)}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        {rep}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                    {issue.message}
                  </p>
                </div>

                {issue.explanation && (
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-800/80 pt-1.5 mt-1.5">
                    {issue.explanation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
