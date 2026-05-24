'use server';
/**
 * @fileOverview Implements enhanced distress detection with diversion generation.
 *
 * - detectDistressKeywords - Detects distress and returns a diversion message.
 * - DetectDistressKeywordsInput - Input type.
 * - DetectDistressKeywordsOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectDistressKeywordsInputSchema = z.object({
  text: z.string().describe('The text to analyze for distress.'),
});
export type DetectDistressKeywordsInput = z.infer<typeof DetectDistressKeywordsInputSchema>;

const DetectDistressKeywordsOutputSchema = z.object({
  isSevereDistress: z.boolean().describe('True if severe distress is detected.'),
  diversionMessage: z.string().optional().describe('A gentle, diversionary message or question to ask the user if they are in distress.'),
});
export type DetectDistressKeywordsOutput = z.infer<typeof DetectDistressKeywordsOutputSchema>;

export async function detectDistressKeywords(input: DetectDistressKeywordsInput): Promise<DetectDistressKeywordsOutput> {
  return detectDistressKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectDistressKeywordsPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: DetectDistressKeywordsInputSchema},
  output: {schema: DetectDistressKeywordsOutputSchema},
  prompt: `You are a crisis intervention AI assistant. Your goal is to analyze text for severe distress, particularly mentions of self-harm or suicide.

  If you detect severe distress:
  1. Set isSevereDistress to true.
  2. Provide a 'diversionMessage'. This should be a very gentle, grounding question or statement intended to momentarily shift the user's focus away from their pain. Example: "I hear you, and I want to support you. Before we talk more, could you tell me one small thing you can see or touch right now?" or "I'm here for you. Would you like to take a deep breath with me, or tell me about a place where you've felt safe before?"
  
  If no severe distress is detected, set isSevereDistress to false and leave diversionMessage empty.

  Text to analyze: {{{text}}}`,
});

const detectDistressKeywordsFlow = ai.defineFlow(
  {
    name: 'detectDistressKeywordsFlow',
    inputSchema: DetectDistressKeywordsInputSchema,
    outputSchema: DetectDistressKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
