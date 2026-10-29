import { NextRequest, NextResponse } from "next/server";
import { GrammarIssue, GrammarResult } from "@/types";

interface GrammarRulePattern {
  id: string;
  pattern: RegExp;
  category: 'grammar' | 'spelling' | 'punctuation' | 'style';
  message: string;
  shortMessage: string;
  explanation: string;
  replacements: (match: string, ...args: any[]) => string[];
}

const GRAMMAR_RULES: GrammarRulePattern[] = [
  // Subject-Verb Agreement
  {
    id: "g-team-have",
    pattern: /\b(the\s+team)\s+have\b/gi,
    category: "grammar",
    message: "Subject-verb disagreement: 'team' is a singular collective noun here.",
    shortMessage: "Subject-verb error",
    explanation: "Use 'team has' when referring to the team as a singular entity.",
    replacements: (m) => [m.replace(/have$/i, "has").replace(/Have$/i, "Has")],
  },
  {
    id: "g-results-was",
    pattern: /\b(results)\s+was\b/gi,
    category: "grammar",
    message: "Subject-verb disagreement: 'results' is plural, but 'was' is singular.",
    shortMessage: "Subject-verb error",
    explanation: "Plural subjects require plural verbs: 'results were'.",
    replacements: () => ["results were"],
  },
  {
    id: "g-people-spends",
    pattern: /\b(people)\s+spends\b/gi,
    category: "grammar",
    message: "Subject-verb agreement: 'people' is plural.",
    shortMessage: "Verb agreement",
    explanation: "The plural subject 'people' should be followed by the base verb 'spend'.",
    replacements: () => ["people spend"],
  },
  {
    id: "g-member-have",
    pattern: /\b(each\s+member(?:\s+of\s+the\s+[a-z]+)?)\s+have\b/gi,
    category: "grammar",
    message: "'Each' requires a singular verb.",
    shortMessage: "Singular agreement",
    explanation: "Phrases starting with 'each member' are grammatically singular: use 'has'.",
    replacements: (m) => [m.replace(/have$/i, "has")],
  },
  {
    id: "g-should-of",
    pattern: /\b(should|could|would|must)\s+of\b/gi,
    category: "grammar",
    message: "Incorrect phrase: use 'have' instead of 'of' with modal auxiliary verbs.",
    shortMessage: "Modal verb error",
    explanation: "'Should of' is a phonetic misspelling of the contraction 'should've' ('should have').",
    replacements: (m, modal) => [`${modal} have`],
  },

  // Homophones & Word Choice
  {
    id: "g-their-is",
    pattern: /\b(their)\s+is\b/gi,
    category: "grammar",
    message: "Incorrect word choice: 'their' is possessive.",
    shortMessage: "Confused word",
    explanation: "Use the existential pronoun 'there' when indicating existence ('there is').",
    replacements: () => ["there is"],
  },
  {
    id: "g-theyre-results",
    pattern: /\b(they're)\s+(results|work|data|findings|efforts)\b/gi,
    category: "grammar",
    message: "Contraction confusion: 'they're' means 'they are'.",
    shortMessage: "Possessive error",
    explanation: "Use the possessive pronoun 'their' before a noun.",
    replacements: (m, _theyre, noun) => [`their ${noun}`],
  },
  {
    id: "g-to-much",
    pattern: /\bto\s+much\b/gi,
    category: "spelling",
    message: "Misspelling: 'to' is used instead of 'too' (excessive).",
    shortMessage: "Spelling: too much",
    explanation: "'Too' indicates excess or an excessive quantity.",
    replacements: () => ["too much"],
  },
  {
    id: "g-an-unique",
    pattern: /\ban\s+unique\b/gi,
    category: "grammar",
    message: "Article error: 'unique' begins with a consonant 'y' sound.",
    shortMessage: "Article error",
    explanation: "Words beginning with a 'yu' vowel sound take the article 'a', not 'an'.",
    replacements: () => ["a unique"],
  },
  {
    id: "g-its-clear",
    pattern: /\bIts\s+(clear|obvious|evident|important|apparent)\b/g,
    category: "punctuation",
    message: "Missing apostrophe in contraction: 'its' vs 'it's'.",
    shortMessage: "Apostrophe error",
    explanation: "'It's' is the contraction for 'it is', whereas 'its' is possessive.",
    replacements: (m, adj) => [`It's ${adj}`],
  },
  {
    id: "g-affect-effect",
    pattern: /\bwould\s+effect\b/gi,
    category: "grammar",
    message: "Confused word: 'effect' is usually a noun, whereas 'affect' is the verb.",
    shortMessage: "Affect vs. Effect",
    explanation: "To influence something is to 'affect' it.",
    replacements: () => ["would affect"],
  },
  {
    id: "g-every-single-days",
    pattern: /\bevery\s+single\s+days\b/gi,
    category: "grammar",
    message: "Number agreement: 'every single' modifies a singular noun.",
    shortMessage: "Singular modifier",
    explanation: "Use singular 'day' after 'every single'.",
    replacements: () => ["every single day"],
  },

  // Common Misspellings
  {
    id: "sp-algoritm",
    pattern: /\balgoritm\b/gi,
    category: "spelling",
    message: "Spelling error: missing 'h' in 'algorithm'.",
    shortMessage: "Spelling",
    explanation: "Correct spelling is 'algorithm'.",
    replacements: () => ["algorithm"],
  },
  {
    id: "sp-descision",
    pattern: /\bdescision\b/gi,
    category: "spelling",
    message: "Spelling error: inverted letters in 'decision'.",
    shortMessage: "Spelling",
    explanation: "Correct spelling is 'decision'.",
    replacements: () => ["decision"],
  },
  {
    id: "sp-prospective",
    pattern: /\bprospective\b/gi,
    category: "style",
    message: "Possible word confusion: did you mean 'perspective' (viewpoint)?",
    shortMessage: "Word choice",
    explanation: "'Perspective' means point of view, whereas 'prospective' means expected/future.",
    replacements: () => ["perspective"],
  },
  {
    id: "sp-wierd",
    pattern: /\bwierd\b/gi,
    category: "spelling",
    message: "Spelling error: 'i' before 'e' exception.",
    shortMessage: "Spelling",
    explanation: "Correct spelling is 'weird'.",
    replacements: () => ["weird"],
  },
  {
    id: "sp-definately",
    pattern: /\bdefinately\b/gi,
    category: "spelling",
    message: "Spelling error: misspelled root vowel.",
    shortMessage: "Spelling",
    explanation: "Correct spelling is 'definitely'.",
    replacements: () => ["definitely"],
  },
  {
    id: "sp-seperate",
    pattern: /\bseperate\b/gi,
    category: "spelling",
    message: "Spelling error: remember there is 'a rat' in 'separate'.",
    shortMessage: "Spelling",
    explanation: "Correct spelling is 'separate'.",
    replacements: () => ["separate"],
  },
  {
    id: "sp-recieve",
    pattern: /\brecieve\b/gi,
    category: "spelling",
    message: "Spelling error: 'i' before 'e' except after 'c'.",
    shortMessage: "Spelling",
    explanation: "Correct spelling is 'receive'.",
    replacements: () => ["receive"],
  },
  {
    id: "st-however-splice",
    pattern: /,(\s+)however(\s+)/g,
    category: "punctuation",
    message: "Comma splice with conjunctive adverb 'however'.",
    shortMessage: "Punctuation",
    explanation: "When joining independent clauses with 'however', precede it with a semicolon ('; however,') or period.",
    replacements: () => ["; however, ", ". However, "],
  },
];

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const issues: GrammarIssue[] = [];

    // Scan regex rules with exact positions
    for (const rule of GRAMMAR_RULES) {
      // Reset regex state
      rule.pattern.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = rule.pattern.exec(text)) !== null) {
        const originalText = match[0];
        const offset = match.index;
        const length = originalText.length;
        const replacements = rule.replacements(originalText, ...match.slice(1));

        issues.push({
          id: `${rule.id}-${offset}`,
          category: rule.category,
          message: rule.message,
          shortMessage: rule.shortMessage,
          offset,
          length,
          originalText,
          replacements,
          explanation: rule.explanation,
          ruleId: rule.id,
        });
      }
    }

    // Sort issues by offset
    issues.sort((a, b) => a.offset - b.offset);

    // Compute stats
    const words = (text.trim().match(/\b[a-zA-Z0-9'-]+\b/g) || []).length;
    const cleanlinessScore = Math.max(
      20,
      Math.min(100, Math.round(100 - (issues.length * 100) / Math.max(1, words / 3)))
    );

    const summary = {
      grammarCount: issues.filter((i) => i.category === "grammar").length,
      spellingCount: issues.filter((i) => i.category === "spelling").length,
      punctuationCount: issues.filter((i) => i.category === "punctuation").length,
      styleCount: issues.filter((i) => i.category === "style").length,
    };

    const result: GrammarResult = {
      issues,
      cleanlinessScore,
      summary,
      analyzedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Grammar API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to check grammar" },
      { status: 500 }
    );
  }
}
