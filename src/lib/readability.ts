import { TextMetrics } from "@/types";

export function calculateTextMetrics(text: string): TextMetrics {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      words: 0,
      characters: 0,
      charactersWithoutSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      fleschKincaidScore: 100,
      readingLevel: "N/A",
    };
  }

  const characters = text.length;
  const charactersWithoutSpaces = text.replace(/\s+/g, "").length;
  
  // Words
  const wordsArray = trimmed.match(/\b[a-zA-Z0-9'-]+\b/g) || [];
  const words = wordsArray.length;

  // Sentences
  const sentenceMatches = trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [];
  const sentences = Math.max(1, sentenceMatches.filter((s) => s.trim().length > 0).length);

  // Paragraphs
  const paragraphsArray = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphs = Math.max(1, paragraphsArray.length);

  // Reading time (average 225 wpm) and speaking time (average 130 wpm)
  const readingTimeMinutes = Math.max(0.1, Number((words / 225).toFixed(1)));
  const speakingTimeMinutes = Math.max(0.1, Number((words / 130).toFixed(1)));

  // Syllables approximation
  let totalSyllables = 0;
  for (const word of wordsArray) {
    totalSyllables += countSyllables(word);
  }

  // Flesch Reading Ease score: 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  let fleschScore = 100;
  if (words > 0 && sentences > 0) {
    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = totalSyllables / words;
    fleschScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord)
      )
    );
  }

  // Reading Level category
  let readingLevel = "Standard (8th Grade)";
  if (fleschScore >= 90) readingLevel = "Very Easy (5th Grade)";
  else if (fleschScore >= 80) readingLevel = "Easy (6th Grade)";
  else if (fleschScore >= 70) readingLevel = "Fairly Easy (7th Grade)";
  else if (fleschScore >= 60) readingLevel = "Standard (8th-9th Grade)";
  else if (fleschScore >= 50) readingLevel = "Fairly Difficult (High School)";
  else if (fleschScore >= 30) readingLevel = "Difficult (College)";
  else readingLevel = "Very Difficult (Graduate)";

  return {
    words,
    characters,
    charactersWithoutSpaces,
    sentences,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
    fleschKincaidScore: fleschScore,
    readingLevel,
  };
}

function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 1;
  if (clean.length <= 3) return 1;

  const formatted = clean
    .replace(/(?:[^laeiouy]|ed|es|e)$/, "")
    .replace(/^y/, "");
  const syllables = formatted.match(/[aeiouy]{1,2}/g);
  return syllables ? Math.max(1, syllables.length) : 1;
}

/**
 * Split text into sentences with start and end character offsets.
 */
export function extractSentencesWithOffsets(text: string): { text: string; start: number; end: number }[] {
  const regex = /([^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$)/g;
  const results: { text: string; start: number; end: number }[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const rawSentence = match[0];
    const trimmed = rawSentence.trim();
    if (trimmed.length > 0) {
      const start = match.index;
      const end = start + rawSentence.length;
      results.push({
        text: rawSentence,
        start,
        end,
      });
    }
  }

  return results;
}
