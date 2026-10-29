"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/header/Navbar";
import { EditorPane } from "@/components/editor/EditorPane";
import { SidebarContainer } from "@/components/sidebar/SidebarContainer";
import { SampleTextModal } from "@/components/modals/SampleTextModal";
import { ApiKeyModal } from "@/components/modals/ApiKeyModal";
import { useAppStore } from "@/store/useAppStore";

export default function Home() {
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const { runDetector, detectorResult } = useAppStore();

  // On initial mount, scan the pre-loaded sample text to populate the UI
  useEffect(() => {
    if (!detectorResult) {
      runDetector();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F9FAFB] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      {/* Top Navigation */}
      <Navbar
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Pane: Interactive Text Editor & Metrics (7 cols on desktop) */}
        <section className="lg:col-span-7 xl:col-span-7 h-full overflow-hidden flex flex-col">
          <EditorPane onOpenSampleModal={() => setIsSampleModalOpen(true)} />
        </section>

        {/* Right Pane: Analysis, Grammar Feed & Humanizer Controls (5 cols on desktop) */}
        <aside className="lg:col-span-5 xl:col-span-5 h-full overflow-hidden flex flex-col shadow-sm">
          <SidebarContainer />
        </aside>
      </main>

      {/* Modals */}
      <SampleTextModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
      />

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />
    </div>
  );
}
