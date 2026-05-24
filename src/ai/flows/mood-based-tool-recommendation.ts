'use server';
/**
 * @fileOverview This file contains a Genkit flow for recommending tools based on the user's mood.
 *
 * - recommendToolsBasedOnMood - A function that takes a mood score and returns a list of recommended tools.
 * - MoodBasedToolRecommendationInput - The input type for the recommendToolsBasedOnMood function.
 * - MoodBasedToolRecommendationOutput - The return type for the recommendToolsBasedOnMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodBasedToolRecommendationInputSchema = z.object({
  moodScore: z.number().describe('A number representing the user\'s mood. Higher values indicate a better mood.'),
});
export type MoodBasedToolRecommendationInput = z.infer<typeof MoodBasedToolRecommendationInputSchema>;

const MoodBasedToolRecommendationOutputSchema = z.object({
  recommendedTools: z.array(z.string()).describe('A list of tools recommended for the user based on their mood.'),
});
export type MoodBasedToolRecommendationOutput = z.infer<typeof MoodBasedToolRecommendationOutputSchema>;

export async function recommendToolsBasedOnMood(input: MoodBasedToolRecommendationInput): Promise<MoodBasedToolRecommendationOutput> {
  return recommendToolsBasedOnMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendToolsBasedOnMoodPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: MoodBasedToolRecommendationInputSchema},
  output: {schema: MoodBasedToolRecommendationOutputSchema},
  prompt: `Based on the user's mood score (a higher number indicates a better mood), recommend a list of tools that would be most helpful for them.

Mood Score: {{{moodScore}}}

You can recommend from the following tools: Moon Breath, Memory Lantern, Bubble Pop Zen, Infinite Affirmations, Wellness Challenges, Anonymous Journal, Singing Bowl.

Return the answer as a list of tool names.`,
});

const recommendToolsBasedOnMoodFlow = ai.defineFlow(
  {
    name: 'recommendToolsBasedOnMoodFlow',
    inputSchema: MoodBasedToolRecommendationInputSchema,
    outputSchema: MoodBasedToolRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("AI failed to generate recommendations");
    return output;
  }
);
