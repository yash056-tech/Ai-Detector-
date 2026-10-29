"use client";

import { useAppStore } from "@/store/useAppStore";
import {
  RotateCcw,
  RotateCw,
  Trash2,
  ClipboardPaste,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

interface EditorToolbarProps {
  onOpenSampleModal: () => void;
}

export function EditorToolbar({ onOpenSampleModal }: EditorToolbarProps) {
  const {
    text,
    setText,
    clearText,
    undo,
    redo,
    canUndo,
    canRedo,
    metrics,
  } = useAppStore();

  const [copied, setCopied] = useState(false);

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setText(clipboardText);
      }
    } catch (e) {
      console.warn("Clipboard access denied or unavailable");
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shrink-0">
      {/* Left controls: Undo, Redo, Paste, Clear */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={redo}
          disabled={!canRedo()}
          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        <button
          onClick={handlePaste}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Paste from clipboard"
        >
          <ClipboardPaste className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Paste</span>
        </button>

        <button
          onClick={handleCopy}
          disabled={!text}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
          title="Copy editor text"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>

        <button
          onClick={clearText}
          disabled={!text}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40 transition-colors"
          title="Clear text"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Right stats counters */}
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={onOpenSampleModal}
          className="sm:hidden text-indigo-600 font-medium flex items-center gap-1"
        >
          <BookOpen className="w-3.5 h-3.5" /> Samples
        </button>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {metrics.words} <span className="text-slate-400 font-normal">words</span>
        </span>
        <span className="hidden sm:inline">
          {metrics.characters} <span className="text-slate-400">chars</span>
        </span>
        <span className="hidden md:inline font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
          ~{metrics.readingTimeMinutes} min read
        </span>
      </div>
    </div>
  );
}
