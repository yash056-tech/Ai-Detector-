"use client";

import { useMemo, useState } from "react";
import { diffWords } from "diff";
import { Eye, Columns, ArrowRight } from "lucide-react";

interface DiffViewerProps {
  originalText: string;
  humanizedText: string;
}

export function DiffViewer({ originalText, humanizedText }: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<"inline" | "side-by-side">("inline");

  const diffParts = useMemo(() => {
    return diffWords(originalText, humanizedText);
  }, [originalText, humanizedText]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
      {/* Header with Mode Toggle */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Text Changes & Diff Analysis
        </span>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode("inline")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              viewMode === "inline"
                ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Eye className="w-3 h-3" />
            Inline
          </button>
          <button
            onClick={() => setViewMode("side-by-side")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              viewMode === "side-by-side"
                ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Columns className="w-3 h-3" />
            Split
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 text-xs leading-relaxed max-h-80 overflow-y-auto font-sans">
        {viewMode === "inline" ? (
          <div className="whitespace-pre-wrap">
            {diffParts.map((part, index) => {
              if (part.added) {
                return (
                  <span
                    key={index}
                    className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-medium mx-0.5"
                  >
                    {part.value}
                  </span>
                );
              }
              if (part.removed) {
                return (
                  <span
                    key={index}
                    className="bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 line-through px-1 py-0.5 rounded opacity-80 mx-0.5"
                  >
                    {part.value}
                  </span>
                );
              }
              return <span key={index} className="text-slate-700 dark:text-slate-300">{part.value}</span>;
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider block">
                Original AI Text
              </span>
              <div className="p-3 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {originalText}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider block">
                Humanized Output
              </span>
              <div className="p-3 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {humanizedText}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Diff Legend Footer */}
      <div className="px-3.5 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-200 dark:bg-emerald-800" />
            Humanized Rewrites
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-200 dark:bg-rose-800" />
            Removed AI Clichés
          </span>
        </div>
        <span>High burstiness applied</span>
      </div>
    </div>
  );
}
