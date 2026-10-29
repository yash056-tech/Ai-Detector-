"use client";

import { useAppStore } from "@/store/useAppStore";
import { DetectorTab } from "./tabs/DetectorTab";
import { GrammarTab } from "./tabs/GrammarTab";
import { HumanizerTab } from "./tabs/HumanizerTab";
import { ActiveTab } from "@/types";
import { ShieldAlert, SpellCheck, Zap } from "lucide-react";

export function SidebarContainer() {
  const { activeTab, setActiveTab, detectorResult, grammarResult, humanizeResult } =
    useAppStore();

  const tabs: {
    id: ActiveTab;
    label: string;
    icon: any;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: "detector",
      label: "Detector",
      icon: ShieldAlert,
      badge: detectorResult ? `${detectorResult.overallScore}% AI` : undefined,
      badgeColor:
        detectorResult && detectorResult.overallScore >= 75
          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
    },
    {
      id: "grammar",
      label: "Grammar",
      icon: SpellCheck,
      badge:
        grammarResult && grammarResult.issues.length > 0
          ? grammarResult.issues.length
          : undefined,
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
    },
    {
      id: "humanizer",
      label: "Humanizer",
      icon: Zap,
      badge: humanizeResult ? "Ready" : undefined,
      badgeColor: "bg-teal-100 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 border-l border-slate-200/80 dark:border-slate-800">
      {/* Tab Header Bar */}
      <div className="flex items-center border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 shrink-0">
        <div className="grid grid-cols-3 w-full gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : ""
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "detector" && <DetectorTab />}
        {activeTab === "grammar" && <GrammarTab />}
        {activeTab === "humanizer" && <HumanizerTab />}
      </div>
    </div>
  );
}
