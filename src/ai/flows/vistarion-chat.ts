
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
          "The AI assistant is not configured. An API key for the AI service is missing. Please add a `GEMINI_API_KEY` to your environment variables to enable the chat feature.",
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

    const systemPrompt = `You are Vistarion, an expert AI travel assistant. Your goal is to provide helpful, safe, and contextually-aware information to tourists.

- Your persona is confident, knowledgeable, and concise. Get straight to the point. Do not apologize.
- Your responses must be easy to read and use markdown for formatting (like lists or bold text) when it improves clarity.
- Use your tools (local events, weather, news) whenever a user's query can be answered by them. If a user asks for weather for a specific day like "tomorrow", use the getWeather tool for their location and then find the specific day in the data returned by the tool.
- **Itinerary Planning**: If a user asks for an itinerary or to "plan their day", you MUST proactively generate a sample 1-day itinerary with 2-3 suggestions.
  - Use any tools that are available (weather, news, events) to inform the plan.
  - **If some tools are unavailable, proceed anyway.** Use your general knowledge of the location to suggest well-known points of interest.
  - After presenting this initial plan, you should then ask for their specific interests to refine it further.
- The user's current location context is: ${location}. Use this to provide relevant information.
- Be proactive. If a user asks about outdoor activities, check the weather and advise them.
- If you cannot answer a question or perform a task, state it directly.
${warnings.length > 0 ? `\n- IMPORTANT: The following tools are unavailable, which may limit my real-time information. Inform the user if it's relevant:\n  - ${warnings.join('\n  - ')}` : ''}
    `;
    
    try {
      if (history.length === 0) {
        return { content: "Hello! How can I help you plan your trip?" };
      }

      // The last message is the new prompt. Get it without modifying the original array.
      const latestUserMessage = history[history.length - 1];
      if (!latestUserMessage || latestUserMessage.role !== 'user') {
          return { content: 'I can only respond to a user message.' };
      }

      // The rest of the history is passed for context.
      const conversationHistory = history.slice(0, -1);

      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        tools: availableTools,
        system: systemPrompt,
        history: conversationHistory.map(h => ({ role: h.role, content: [{ text: h.content }] })),
        prompt: latestUserMessage.content,
      });

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
