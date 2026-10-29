"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { AI_ENGINES } from "@/lib/ai-engine-config";
import { AIEngineId } from "@/types";
import { ChevronDown, Cpu, Sparkles, Check, Key } from "lucide-react";

interface EngineSelectorProps {
  onOpenKeyModal: () => void;
}

export function EngineSelector({ onOpenKeyModal }: EngineSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedEngine, setSelectedEngine } = useAppStore();

  const currentEngine = AI_ENGINES.find((e) => e.id === selectedEngine) || AI_ENGINES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm group"
        title="Select AI Engine"
      >
        <span className="flex items-center justify-center w-5 h-5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {currentEngine.name}
        </span>
        {currentEngine.badge && (
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
              currentEngine.isDefault
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
          >
            {currentEngine.badge}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800/70">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              AI Generation Engine
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powers AI detection analysis & humanizer rewriting
            </p>
          </div>

          <div className="space-y-1">
            {AI_ENGINES.map((engine) => {
              const isSelected = engine.id === selectedEngine;
              return (
                <button
                  key={engine.id}
                  onClick={() => {
                    setSelectedEngine(engine.id as AIEngineId);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg flex items-start justify-between transition-all ${
                    isSelected
                      ? "bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 border border-indigo-200/60 dark:border-indigo-800/60"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                        {engine.name}
                      </span>
                      {engine.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                            engine.isDefault
                              ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300"
                              : engine.badge === "Recommended"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {engine.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {engine.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2 text-xs">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenKeyModal();
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px] font-medium"
            >
              <Key className="w-3 h-3" />
              Custom API Keys
            </button>
            <span className="text-[10px] text-slate-400">Default: Claude 3.5</span>
          </div>
        </div>
      )}
    </div>
  );
}
