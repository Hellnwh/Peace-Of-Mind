'use server';

/**
 * @fileOverview This file implements the anonymous journal with AI prompts flow.
 *
 * The flow allows users to write journal entries and receive AI-generated prompts based on their entries.
 *
 * @exports {
 *   anonymousJournalAI,
 *   AnonymousJournalInput,
 *   AnonymousJournalOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnonymousJournalInputSchema = z.object({
  journalEntry: z.string().describe('The user journal entry.'),
});

export type AnonymousJournalInput = z.infer<typeof AnonymousJournalInputSchema>;

const AnonymousJournalOutputSchema = z.object({
  aiPrompt: z.string().describe('The AI-generated prompt based on the journal entry.'),
});

export type AnonymousJournalOutput = z.infer<typeof AnonymousJournalOutputSchema>;

export async function anonymousJournalAI(input: AnonymousJournalInput): Promise<AnonymousJournalOutput> {
  return anonymousJournalAIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anonymousJournalAIPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: AnonymousJournalInputSchema},
  output: {schema: AnonymousJournalOutputSchema},
  prompt: `You are a supportive AI assistant designed to help users explore their feelings and thoughts through journaling.

  Based on the user's journal entry, provide a thoughtful and personalized prompt to encourage further reflection.

  Journal Entry: {{{journalEntry}}}

  AI Prompt: `,
});

const anonymousJournalAIFlow = ai.defineFlow(
  {
    name: 'anonymousJournalAIFlow',
    inputSchema: AnonymousJournalInputSchema,
    outputSchema: AnonymousJournalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
