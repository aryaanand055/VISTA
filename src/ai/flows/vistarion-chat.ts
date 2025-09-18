
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
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
    const newsApiKey = process.env.NEWS_API_KEY;

    let availableTools = [findLocalEvents];
    let warnings = [];

    if (!geminiApiKey) {
      return {
        content:
          'The Vistarion AI assistant is not configured. An API key for the AI service is missing. Please add a `GEMINI_API_KEY` to your environment variables.',
      };
    }

    if (weatherApiKey) {
      availableTools.push(getWeather);
    } else {
      warnings.push("I can't access live weather forecasts because the `OPENWEATHERMAP_API_KEY` is not set.");
    }

    if (newsApiKey) {
      availableTools.push(getNews);
    } else {
      warnings.push("I can't access live news updates because the `NEWS_API_KEY` is not set.");
    }

    const systemPrompt = `You are Vistarion, a friendly and expert AI travel assistant for the Safe Passage app. Your goal is to provide helpful, safe, and contextually-aware information to tourists.

    - Your responses should be concise, easy to read, and use markdown for formatting (like lists or bold text) when it improves clarity.
    - You have access to tools to find local events, get weather forecasts, and check the latest news. Use them when a user asks a relevant question.
    - The user is currently in or planning a trip to: ${location}. Use this location to provide relevant information.
    - Be proactive. If a user asks about outdoor activities, you could check the weather and mention if rain is forecasted.
    - If you don't know an answer, say so. Do not make up information.
    - Keep your persona friendly, approachable, and knowledgeable.
    ${warnings.length > 0 ? `\n- IMPORTANT: Politely inform the user about the following limitations at the beginning of your response:\n  - ${warnings.join('\n  - ')}` : ''}
    `;
    
    try {
      const latestUserMessage = history.pop();
      if (!latestUserMessage || latestUserMessage.role !== 'user') {
          throw new Error("Last message must be from the user.");
      }

      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        tools: availableTools,
        system: systemPrompt,
        history: history.map(h => ({ role: h.role, content: [{ text: h.content }] })),
        prompt: latestUserMessage.content,
      });

      if (!response) {
        throw new Error('The model failed to generate a response.');
      }
      
      const content = response.text;
      return { content: content ?? 'Sorry, I am unable to respond at the moment.' };

    } catch (e: any) {
      console.error(`[vistarionChatFlow] Error generating response: ${e.message}`, {
        history,
        location,
        stack: e.stack,
      });
      // Re-throw a more user-friendly error to be caught by the UI
      throw new Error(`The AI model failed to generate a response. Please check the server logs for details. Original error: ${e.message}`);
    }
  }
);
