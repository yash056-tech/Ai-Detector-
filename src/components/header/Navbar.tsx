"use client";

import { useAppStore } from "@/store/useAppStore";
import { ThemeToggle } from "./ThemeToggle";
import { EngineSelector } from "./EngineSelector";
import { ActiveTab } from "@/types";
import {
  Sparkles,
  ShieldAlert,
  SpellCheck,
  Zap,
  BookOpen,
  FileText,
} from "lucide-react";

interface NavbarProps {
  onOpenSampleModal: () => void;
  onOpenKeyModal: () => void;
}

export function Navbar({ onOpenSampleModal, onOpenKeyModal }: NavbarProps) {
  const { activeTab, setActiveTab } = useAppStore();

  const navTabs: { id: ActiveTab; label: string; icon: any; highlight: string }[] = [
    {
      id: "detector",
      label: "AI Detector",
      icon: ShieldAlert,
      highlight: "from-rose-500 to-amber-500",
    },
    {
      id: "grammar",
      label: "Grammar & Style",
      icon: SpellCheck,
      highlight: "from-indigo-500 to-cyan-500",
    },
    {
      id: "humanizer",
      label: "AI Humanizer",
      icon: Zap,
      highlight: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
                ScribeHuman
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                Pro
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 dark:text-slate-500">
              Detector • Grammar • Humanizer
            </p>
          </div>
        </div>

        {/* Center Mode Tabs */}
        <nav className="flex items-center p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSampleModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
            title="Load sample texts"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Samples</span>
          </button>

          <EngineSelector onOpenKeyModal={onOpenKeyModal} />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
