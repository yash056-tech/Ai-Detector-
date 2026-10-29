import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "ScribeHuman | AI Detector, Grammar Checker & AI-to-Human Rewriter",
  description:
    "Comprehensive text-analysis SaaS platform featuring sentence-by-sentence AI generation detection, real-time grammar & syntax correction, and advanced AI-to-human text humanization to bypass detectors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F19] antialiased selection:bg-indigo-500/20">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
