"use client";

import { SAMPLE_TEXTS } from "@/lib/samples";
import { useAppStore } from "@/store/useAppStore";
import { X, Sparkles, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

interface SampleTextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SampleTextModal({ isOpen, onClose }: SampleTextModalProps) {
  const { loadSample } = useAppStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                Load Sample Texts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quickly test AI detection, grammar proofreading, and humanizer rewriting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 py-4 pr-1">
          {SAMPLE_TEXTS.map((sample) => {
            const badgeColor =
              sample.category === "AI Heavy"
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300"
                : sample.category === "Grammar Issues"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300"
                : sample.category === "Human Authentic"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
                : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300";

            return (
              <div
                key={sample.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between group"
              >
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {sample.title}
                    </h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {sample.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {sample.description}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-[11px]">
                    &ldquo;{sample.text.slice(0, 140)}...&rdquo;
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      loadSample(sample.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Load into Editor
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
