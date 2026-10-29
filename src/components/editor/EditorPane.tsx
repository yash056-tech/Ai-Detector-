"use client";

import { useAppStore } from "@/store/useAppStore";
import { EditorToolbar } from "./EditorToolbar";
import { GrammarTooltip } from "./GrammarTooltip";
import { SentenceDetailModal } from "./SentenceDetailModal";
import { GrammarIssue } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Gauge, Sparkles, BookOpen, Layers } from "lucide-react";

interface EditorPaneProps {
  onOpenSampleModal: () => void;
}

export function EditorPane({ onOpenSampleModal }: EditorPaneProps) {
  const {
    text,
    setText,
    activeTab,
    detectorResult,
    grammarResult,
    selectedSentenceId,
    setSelectedSentenceId,
    activeGrammarIssue,
    setActiveGrammarIssue,
    metrics,
  } = useAppStore();

  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Selected sentence for modal
  const selectedSentence = detectorResult?.sentences.find(
    (s) => s.id === selectedSentenceId
  );

  // Build rendered tokens for Grammar view
  const renderGrammarHighlightedContent = () => {
    if (!grammarResult || grammarResult.issues.length === 0) {
      return <span className="whitespace-pre-wrap">{text}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    // Issues are sorted by offset
    grammarResult.issues.forEach((issue) => {
      // Unflagged text prior to issue
      if (issue.offset > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {text.slice(lastIndex, issue.offset)}
          </span>
        );
      }

      // Flagged error word/phrase
      const errorText = text.slice(issue.offset, issue.offset + issue.length);
      const isSelected = activeGrammarIssue?.id === issue.id;

      const underlineColor =
        issue.category === "grammar"
          ? "decoration-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40"
          : issue.category === "spelling"
          ? "decoration-rose-500 bg-rose-50/50 dark:bg-rose-950/40"
          : issue.category === "punctuation"
          ? "decoration-amber-500 bg-amber-50/50 dark:bg-amber-950/40"
          : "decoration-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/40";

      elements.push(
        <span
          key={`issue-${issue.id}`}
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const parentRect = containerRef.current?.getBoundingClientRect();
            if (parentRect) {
              setTooltipPos({
                top: rect.bottom - parentRect.top + 8,
                left: Math.min(rect.left - parentRect.left, parentRect.width - 300),
              });
            }
            setActiveGrammarIssue(issue);
          }}
          className={`cursor-pointer underline decoration-wavy decoration-2 rounded px-0.5 font-medium transition-all ${underlineColor} ${
            isSelected ? "ring-2 ring-indigo-500 shadow-sm" : ""
          }`}
          title={`${issue.category.toUpperCase()}: ${issue.shortMessage} (Click to fix)`}
        >
          {errorText}
        </span>
      );

      lastIndex = issue.offset + issue.length;
    });

    // Remainder of text
    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-end`} className="whitespace-pre-wrap">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  // Build rendered tokens for Detector view (sentence-by-sentence highlighting)
  const renderDetectorHighlightedContent = () => {
    if (!detectorResult || detectorResult.sentences.length === 0) {
      return <span className="whitespace-pre-wrap">{text}</span>;
    }

    return detectorResult.sentences.map((sent) => {
      const isSelected = selectedSentenceId === sent.id;
      let highlightClass = "";

      if (sent.label === "ai") {
        // Red (>75% AI)
        highlightClass =
          "bg-rose-100/70 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 border-b-2 border-rose-400";
      } else if (sent.label === "mixed") {
        // Yellow/Amber (40-74% Mixed)
        highlightClass =
          "bg-amber-100/70 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 border-b-2 border-amber-400";
      } else {
        // Green (<40% Human)
        highlightClass =
          "bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 border-b-2 border-emerald-400";
      }

      return (
        <span
          key={sent.id}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSentenceId(sent.id);
          }}
          className={`cursor-pointer px-1 py-0.5 rounded transition-all inline hover:opacity-90 ${highlightClass} ${
            isSelected ? "ring-2 ring-indigo-500 font-medium" : ""
          }`}
          title={`${sent.aiProbability}% AI probability. Click for details.`}
        >
          {sent.text}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 relative">
      {/* Top Toolbar */}
      <EditorToolbar onOpenSampleModal={onOpenSampleModal} />

      {/* Editor Main Canvas */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-y-auto p-6 font-sans text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200"
        onClick={() => {
          // If clicked in blank space, focus textarea
          if (!activeGrammarIssue) {
            textareaRef.current?.focus();
          }
        }}
      >
        {/* Toggle between interactive overlay and direct editing */}
        <div className="absolute top-3 right-5 z-20 flex items-center gap-2">
          {activeTab === "detector" && detectorResult && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
              Detector Highlight Mode
            </span>
          )}
          {activeTab === "grammar" && grammarResult && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
              Grammar Overlay Active
            </span>
          )}
        </div>

        {/* Text Area vs Overlay */}
        <div className="min-h-[460px] relative">
          {/* Transparent live textarea for seamless typing */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setTimeout(() => setIsEditing(false), 200)}
            placeholder="Type, paste, or load sample text to analyze AI patterns, fix grammar, or humanize..."
            className={`w-full min-h-[460px] bg-transparent resize-none focus:outline-none font-sans leading-relaxed text-slate-800 dark:text-slate-200 selection:bg-indigo-500/30 ${
              (activeTab === "detector" && detectorResult && !isEditing) ||
              (activeTab === "grammar" && grammarResult && !isEditing)
                ? "opacity-0 absolute inset-0 z-10 cursor-text"
                : "opacity-100 relative z-10"
            }`}
          />

          {/* Interactive Colored Overlay (shown when not actively typing) */}
          {!isEditing && (
            <div
              className={`absolute inset-0 pointer-events-auto leading-relaxed select-text ${
                (activeTab === "detector" && detectorResult) ||
                (activeTab === "grammar" && grammarResult)
                  ? "block"
                  : "hidden"
              }`}
            >
              {activeTab === "detector" && renderDetectorHighlightedContent()}
              {activeTab === "grammar" && renderGrammarHighlightedContent()}
            </div>
          )}
        </div>

        {/* Grammar Inline Tooltip Popover */}
        {activeGrammarIssue && (
          <GrammarTooltip
            issue={activeGrammarIssue}
            position={tooltipPos}
            onClose={() => setActiveGrammarIssue(null)}
          />
        )}

        {/* Sentence Detail Inspector Popover */}
        {selectedSentence && (
          <SentenceDetailModal
            sentence={selectedSentence}
            onClose={() => setSelectedSentenceId(null)}
          />
        )}
      </div>

      {/* Editor Bottom Status Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Gauge className="w-3.5 h-3.5 text-indigo-500" />
            <span>Readability:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {metrics.fleschKincaidScore}/100
            </span>
            <span className="text-[11px] text-slate-400">({metrics.readingLevel})</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span>
            {metrics.sentences} {metrics.sentences === 1 ? "sentence" : "sentences"}
          </span>
          <span>
            {metrics.paragraphs} {metrics.paragraphs === 1 ? "paragraph" : "paragraphs"}
          </span>
        </div>
      </div>
    </div>
  );
}
