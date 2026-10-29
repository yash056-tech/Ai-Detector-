"use client";

import { useAppStore } from "@/store/useAppStore";
import { DiffViewer } from "../DiffViewer";
import { AI_ENGINES } from "@/lib/ai-engine-config";
import { HumanizeIntensity, HumanizeTone, AIEngineId } from "@/types";
import {
  Zap,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  Sliders,
  Briefcase,
  Coffee,
  GraduationCap,
  Palette,
  Flame,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";

export function HumanizerTab() {
  const {
    text,
    isHumanizing,
    humanizeTone,
    setHumanizeTone,
    humanizeIntensity,
    setHumanizeIntensity,
    selectedEngine,
    setSelectedEngine,
    humanizeResult,
    runHumanize,
    applyHumanizedText,
  } = useAppStore();

  const [copied, setCopied] = useState(false);

  const tones: { id: HumanizeTone; label: string; icon: any; desc: string }[] = [
    {
      id: "professional",
      label: "Professional",
      icon: Briefcase,
      desc: "Articulate, balanced, executive phrasing",
    },
    {
      id: "casual",
      label: "Casual",
      icon: Coffee,
      desc: "Conversational, natural, friendly cadence",
    },
    {
      id: "academic",
      label: "Academic",
      icon: GraduationCap,
      desc: "Rigorously analyzed, formal vocabulary",
    },
    {
      id: "creative",
      label: "Creative",
      icon: Palette,
      desc: "Evocative, engaging, vivid language",
    },
    {
      id: "direct",
      label: "Direct",
      icon: Flame,
      desc: "Crisp, concise, zero robotic fluff",
    },
  ];

  const intensities: { id: HumanizeIntensity; label: string; desc: string }[] = [
    { id: "subtle", label: "Light Polish", desc: "Preserves close structure" },
    { id: "balanced", label: "High-Bypass", desc: "Diversifies burstiness & rhythm" },
    { id: "aggressive", label: "Ultra Human", desc: "Max restructuring & human flow" },
  ];

  const handleCopy = () => {
    if (!humanizeResult) return;
    navigator.clipboard.writeText(humanizeResult.humanizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    applyHumanizedText();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-5 p-4 sm:p-5">
      {/* Configuration Box */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        {/* Engine select badge */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Rewriting Engine
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AI_ENGINES.map((engine) => {
              const isSelected = engine.id === selectedEngine;
              return (
                <button
                  key={engine.id}
                  onClick={() => setSelectedEngine(engine.id as AIEngineId)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-100 ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{engine.name}</span>
                    {engine.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                          engine.isDefault
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                        }`}
                      >
                        {engine.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Desired Tone
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {tones.map((t) => {
              const Icon = t.icon;
              const isSelected = t.id === humanizeTone;
              return (
                <button
                  key={t.id}
                  onClick={() => setHumanizeTone(t.id)}
                  title={t.desc}
                  className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 font-semibold"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px]">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intensity Selector */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Bypass Strength
          </label>
          <div className="grid grid-cols-3 gap-2">
            {intensities.map((item) => {
              const isSelected = item.id === humanizeIntensity;
              return (
                <button
                  key={item.id}
                  onClick={() => setHumanizeIntensity(item.id)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 font-semibold"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="text-xs">{item.label}</div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 line-clamp-1">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Trigger */}
        <button
          onClick={runHumanize}
          disabled={isHumanizing || !text.trim()}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
        >
          {isHumanizing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Restructuring Syntax & Burstiness...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Humanize Text (Bypass AI Detectors)
            </>
          )}
        </button>
      </div>

      {/* Results View */}
      {humanizeResult && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Success Banner & AI Score Delta */}
          <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Successfully Humanized
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {humanizeResult.changesCount} syntax adjustments
              </span>
            </div>

            {/* AI Score Comparison */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-950">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Original AI Score
                </span>
                <span className="text-base font-extrabold text-rose-500">
                  {humanizeResult.beforeAiScore}%
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  New Human Score
                </span>
                <span className="text-base font-extrabold text-emerald-500">
                  {100 - humanizeResult.afterAiScore}% Human
                </span>
              </div>
              <div className="text-center border-l border-slate-100 dark:border-slate-800 pl-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  AI Bypass Rate
                </span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {humanizeResult.afterAiScore}% AI Prob
                </span>
              </div>
            </div>
          </div>

          {/* Diff Analysis */}
          <DiffViewer
            originalText={humanizeResult.originalText}
            humanizedText={humanizeResult.humanizedText}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              Apply to Editor & Re-scan
            </button>
            <button
              onClick={handleCopy}
              className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
