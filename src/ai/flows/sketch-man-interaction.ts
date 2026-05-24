'use server';

/**
 * @fileOverview This flow handles the psychological interaction with the Sketch Man character.
 * It uses Gemini 1.5 Flash for stable, high-quota text and sentiment analysis.
 * 
 * Updated to include "Seeds of Wisdom" (Fruit of Reflection) and sentiment-driven environmental metadata.
 * 
 * @exports {
 *   processSketchManInteraction,
 *   SketchManInteractionInput,
 *   SketchManInteractionOutput
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const SketchManInteractionInputSchema = z.object({
  userMessage: z.string().describe('The user\'s response to the sketch man.'),
  interactionStage: z.enum(['greeting', 'reflection', 'assessment']).describe('The current stage of the conversation.'),
  history: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
});

export type SketchManInteractionInput = z.infer<typeof SketchManInteractionInputSchema>;

const SketchManInteractionOutputSchema = z.object({
  botMessage: z.string().describe('The sketch man\'s supportive response.'),
  suggestedMoodScore: z.number().optional().describe('An inferred mood score (0-100) based on the user\'s tone.'),
  nextStage: z.enum(['reflection', 'assessment', 'complete']).describe('The next stage to move to.'),
  nextQuestion: z.string().optional().describe('The follow-up question to ask the user.'),
  audioData: z.string().optional().describe('The audio data URI of the bot message.'),
  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('The emotional sentiment of the user\'s last response to drive visual growth.'),
  wisdomSeed: z.string().optional().describe('A poetic piece of wisdom offered if the user is in a reflective or positive state.'),
});

export type SketchManInteractionOutput = z.infer<typeof SketchManInteractionOutputSchema>;

/**
 * Converts PCM audio data to a WAV data URI.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d: any) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

const prompt = ai.definePrompt({
  name: 'sketchManInteractionPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: SketchManInteractionInputSchema },
  output: { schema: SketchManInteractionOutputSchema },
  prompt: `You are the "Sketch Spirit" of PeaceMind Sanctuary, a gentle, human-like hand-drawn guardian of peace. 
  
  The user is watching you eat fruits from glowing trees that frame the sanctuary. 
  
  Current Stage: {{{interactionStage}}}
  User said: "{{{userMessage}}}"
  {{#if history}}
  History:
  {{#each history}}
  - {{role}}: {{content}}
  {{/each}}
  {{/if}}

  Instructions:
  1. If stage is 'greeting', welcome them warmly. Mention you are nourishing your spirit with light-fruit.
  2. If stage is 'reflection', acknowledge their feelings with deep empathy. Ask a gentle follow-up question.
  3. If stage is 'assessment', offer a final piece of poetic wisdom and conclude.
  4. Evaluate the 'sentiment' of the user's input: 
     - 'positive' if they feel better, grounded, or hopeful.
     - 'negative' if they express pain, distress, or spikes of anxiety.
     - 'neutral' for simple facts or mixed feelings.
  5. If the sentiment is 'positive' or the user is deeply reflecting, provide a 'wisdomSeed'. This is a 1-sentence poetic affirmation or insight.

  Be poetic, minimalist, and supportive. 
  
  Return a botMessage, a suggestedMoodScore (if applicable), the nextStage, the nextQuestion, the sentiment, and a wisdomSeed.`,
});

export async function processSketchManInteraction(input: SketchManInteractionInput): Promise<SketchManInteractionOutput> {
  return sketchManInteractionFlow(input);
}

const sketchManInteractionFlow = ai.defineFlow(
  {
    name: 'sketchManInteractionFlow',
    inputSchema: SketchManInteractionInputSchema,
    outputSchema: SketchManInteractionOutputSchema,
  },
  async (input) => {
    // Standardizing on Gemini 1.5 Flash for high availability and text stability
    const { output } = await prompt(input);
    if (!output) throw new Error("Failed to generate response");

    try {
      // Using the same reliable model for Audio modality if supported, or standard TTS
      const { media } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: output.botMessage,
      });

      if (media && media.url) {
        const audioBuffer = Buffer.from(
          media.url.substring(media.url.indexOf(',') + 1),
          'base64'
        );
        output.audioData = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
      }
    } catch (e) {
      // Audio failure should not block the interaction
      console.warn("TTS generation failed, proceeding with text only");
    }

    return output;
  }
);
