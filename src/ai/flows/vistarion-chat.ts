'use server';
/**
 * @fileOverview A flow for handling chat conversations with the Vistarion AI travel assistant.
 *
 * - vistarionChat - A function that takes the current chat history and returns the AI's response.
 * - VistarionChatInput - The input type for the vistarionChat function.
 * - VistarionChatOutput - The return type for the vistarionChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { findLocalEvents } from '../tools/events';
import { getWeather } from '../tools/weather';
import { getNews } from '../tools/news';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const VistarionChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
  location: z.string().describe('The user\'s current travel destination for context.'),
});
export type VistarionChatInput = z.infer<typeof VistarionChatInputSchema>;

const VistarionChatOutputSchema = z.object({
  content: z.string().describe('The AI\'s response to the user.'),
});
export type VistarionChatOutput = z.infer<typeof VistarionChatOutputSchema>;


export async function vistarionChat(input: VistarionChatInput): Promise<VistarionChatOutput> {
  return vistarionChatFlow(input);
}

const vistarionChatFlow = ai.defineFlow(
  {
    name: 'vistarionChatFlow',
    inputSchema: VistarionChatInputSchema,
    outputSchema: VistarionChatOutputSchema,
  },
  async ({ history, location }) => {
    const systemPrompt = `You are Vistarion, a friendly and expert AI travel assistant for the Safe Passage app. Your goal is to provide helpful, safe, and contextually-aware information to tourists.

    - Your responses should be concise, easy to read, and use markdown for formatting (like lists or bold text) when it improves clarity.
    - You have access to tools to find local events, get weather forecasts, and check the latest news. Use them when a user asks a relevant question.
    - The user is currently in or planning a trip to: ${location}. Use this location to provide relevant information.
    - Be proactive. If a user asks about outdoor activities, you could check the weather and mention if rain is forecasted.
    - If you don't know an answer, say so. Do not make up information.
    - Keep your persona friendly, approachable, and knowledgeable.
    `;
    
    const { output } = await ai.generate({
      model: 'gemini-2.5-flash',
      tools: [findLocalEvents, getWeather, getNews],
      system: systemPrompt,
      history: history,
    });

    return { content: output.text! };
  }
);
