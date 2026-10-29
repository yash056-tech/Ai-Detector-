export interface SampleText {
  id: string;
  title: string;
  category: 'AI Heavy' | 'Grammar Issues' | 'Mixed AI' | 'Human Authentic';
  description: string;
  text: string;
}

export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: 'ai-marketing',
    title: 'Robotic AI Marketing Pitch',
    category: 'AI Heavy',
    description: 'Typical ChatGPT/LLM output with buzzwords like "delve", "testament", "tapestry", and uniform cadence.',
    text: `In today's fast-paced digital landscape, embracing cutting-edge technological paradigms is not merely a strategic choice, but an indispensable prerequisite for sustainable enterprise scalability. Furthermore, this innovative framework serves as a testament to the transformative power of holistic synergy across cross-functional operations.

Moreover, by seamlessly integrating state-of-the-art automated mechanisms, businesses can delve deep into unprecedented frontiers of operational efficiency. It is important to remember that these dynamic methodologies facilitate a robust ecosystem, thereby ensuring long-term resilience and value realization for all forward-thinking stakeholders.`
  },
  {
    id: 'grammar-errors',
    title: 'Text with Common Grammar & Spelling Errors',
    category: 'Grammar Issues',
    description: 'Paragraph full of spelling mistakes, wrong prepositions, punctuation flaws, and awkward agreement.',
    text: `The team have finished their research on the effects of social media, but they're results was not what we expected. Their is many reasons why people spends to much time on their phones every single days.

We should of known that the algoritm would effect user engagement negatively. Its clear that each member of the committee have an unique prospective, however no one agreed with the final descision.`
  },
  {
    id: 'ai-academic',
    title: 'AI Academic Abstract',
    category: 'Mixed AI',
    description: 'Stiff academic tone with monotonous sentence lengths and formulaic concluding transitions.',
    text: `This paper explores the multifaceted implications of artificial intelligence in contemporary pedagogy. The integration of algorithmic tutoring systems has garnered substantial attention from educational theorists and practitioners alike. Consequently, an empirical investigation was conducted to scrutinize learning outcomes across diverse student cohorts.

The findings illuminate a pronounced correlation between adaptive scaffolding and heightened conceptual retention. In conclusion, these observations underscore the critical necessity of fostering balanced pedagogical heuristics within modernized digital learning environments.`
  },
  {
    id: 'human-authentic',
    title: 'Natural Human Essay',
    category: 'Human Authentic',
    description: 'Human-authored writing featuring diverse burstiness, personal cadence, and colloquial nuance.',
    text: `I honestly didn't expect much when I opened the old journal yesterday. The pages were yellowed and dog-eared, smelling like rainy afternoons in my grandfather's attic. But there it was—a scribbled sketch of the bridge project from 1984, alongside three messy lines about how stubborn the river currents were back then.

Reading his hurried notes made me realize something fundamental. Good engineering isn't just about steel tolerances and stress formulas; it's about wrestling with messy, unpredictable real-world chaos and somehow making things hold together anyway.`
  }
];
