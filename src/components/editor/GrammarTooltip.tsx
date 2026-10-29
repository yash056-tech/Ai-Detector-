"use client";

import { GrammarIssue } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { Check, X, Sparkles } from "lucide-react";

interface GrammarTooltipProps {
  issue: GrammarIssue;
  onClose: () => void;
  position?: { top: number; left: number };
}

export function GrammarTooltip({ issue, onClose, position }: GrammarTooltipProps) {
  const { applyGrammarFix, dismissGrammarIssue } = useAppStore();

  return (
    <div
      className="absolute z-50 w-72 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-3 text-left animate-in fade-in zoom-in-95 duration-150"
      style={{
        top: position ? `${position.top}px` : undefined,
        left: position ? `${position.left}px` : undefined,
      }}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
            issue.category === "grammar"
              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
              : issue.category === "spelling"
              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
              : issue.category === "punctuation"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              : "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
          }`}
        >
          {issue.category}: {issue.shortMessage}
        </span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-snug">
        {issue.message}
      </p>

      {/* Quick Replacements */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {issue.replacements.map((replacement, idx) => (
          <button
            key={idx}
            onClick={() => {
              applyGrammarFix(issue.id, replacement);
              onClose();
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            {replacement}
          </button>
        ))}

        <button
          onClick={() => {
            dismissGrammarIssue(issue.id);
            onClose();
          }}
          className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
