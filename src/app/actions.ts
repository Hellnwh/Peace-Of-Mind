
"use server";

/**
 * Local library of tool recommendations based on mood ranges.
 * Used for deterministic, privacy-first recommendations.
 */
const TOOL_MAP = [
  { min: 0, max: 20, tools: ["Singing Bowl", "Moon Breath", "Clinical Screening"] },
  { min: 21, max: 40, tools: ["Reaction Focus", "Sand Scribble", "Moon Breath"] },
  { min: 41, max: 60, tools: ["Bubble Pop Zen", "Simon's Echo", "Memory Lanterns"] },
  { min: 61, max: 80, tools: ["Zen Pomodoro", "Stroop Balance", "Private Journal"] },
  { min: 81, max: 100, tools: ["Zen Pomodoro", "Sonic Sanctuary", "Sand Scribble"] },
];

/**
 * Local library of journaling prompts for neuro-wellness.
 */
const JOURNAL_PROMPTS = [
  "What is one thing you can release today to feel lighter?",
  "Describe a place where you felt completely safe. What did it smell like?",
  "How did your energy levels shift throughout the day? (Focus on ADHD patterns)",
  "What is one sensory experience that grounded you today?",
  "Write a letter to your future self about your resilience today.",
  "What does 'restoration' look like for you in this very moment?",
];

const DISTRESS_KEYWORDS = ["suicide", "self-harm", "kill myself", "end it all", "don't want to live", "cutting", "overdose"];

/**
 * Deterministic tool recommendation engine.
 */
export async function getToolRecommendations(moodScore: number) {
  const match = TOOL_MAP.find(m => moodScore >= m.min && moodScore <= m.max);
  return { recommendedTools: match ? match.tools : ["Moon Breath", "Singing Bowl"] };
}

/**
 * Provides a therapeutic prompt from a local library.
 */
export async function getJournalPrompt(journalEntry: string) {
  const randomIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
  return { aiPrompt: JOURNAL_PROMPTS[randomIndex] };
}

/**
 * High-speed local distress detection.
 */
export async function checkDistress(text: string) {
  const lowerText = text.toLowerCase();
  const isSevereDistress = DISTRESS_KEYWORDS.some(keyword => lowerText.includes(keyword));
  
  return {
    isSevereDistress,
    diversionMessage: isSevereDistress 
      ? "I hear that you're carrying a lot right now. Before we continue, I want to make sure you have the support you deserve. Would you like to see our immediate help resources?" 
      : undefined
  };
}
