'use server';

/**
 * @fileOverview This file defines a Genkit flow for a basic support chatbot.
 *
 * The chatbot uses CBT techniques to challenge negative thoughts and provide coping strategies.
 *
 * @exported
 * - `basicSupportChatbot`: The main function to interact with the chatbot.
 * - `BasicSupportChatbotInput`: The input type for the `basicSupportChatbot` function.
 * - `BasicSupportChatbotOutput`: The output type for the `basicSupportChatbot` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BasicSupportChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type BasicSupportChatbotInput = z.infer<typeof BasicSupportChatbotInputSchema>;

const BasicSupportChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
});
export type BasicSupportChatbotOutput = z.infer<typeof BasicSupportChatbotOutputSchema>;

export async function basicSupportChatbot(input: BasicSupportChatbotInput): Promise<BasicSupportChatbotOutput> {
  return basicSupportChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'basicSupportChatbotPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: BasicSupportChatbotInputSchema},
  output: {schema: BasicSupportChatbotOutputSchema},
  prompt: `You are a mental health chatbot providing support using Cognitive Behavioral Therapy (CBT) techniques.  When the user provides a message, identify any negative thoughts or feelings expressed in the user's message and challenge those thoughts with positive reframes.

  User message: {{{message}}}
  `,
});

const basicSupportChatbotFlow = ai.defineFlow(
  {
    name: 'basicSupportChatbotFlow',
    inputSchema: BasicSupportChatbotInputSchema,
    outputSchema: BasicSupportChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
