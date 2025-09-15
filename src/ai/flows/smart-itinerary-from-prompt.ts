'use server';
/**
 * @fileOverview An AI agent that generates a smart itinerary based on a prompt.
 *
 * - generateSmartItinerary - A function that generates a smart itinerary.
 * - SmartItineraryInput - The input type for the generateSmartItinerary function.
 * - SmartItineraryOutput - The return type for the generateSmartItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ItineraryDaySchema } from './schemas';
import { findLocalEvents } from '../tools/events';
import { getWeather } from '../tools/weather';


const SmartItineraryInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the user\'s interests, desired activities, and travel dates.'),
});
export type SmartItineraryInput = z.infer<typeof SmartItineraryInputSchema>;

const SmartItineraryOutputSchema = z.object({
  itinerary: z.array(ItineraryDaySchema).describe('A personalized itinerary including specific locations, estimated travel times, and safety scores for each location.'),
  title: z.string().describe('A creative title for the itinerary.'),
  explanation: z.string().describe('A detailed explanation of why the itinerary was structured this way, referencing any tools used like weather or event lookups.'),
});
export type SmartItineraryOutput = z.infer<typeof SmartItineraryOutputSchema>;

export async function generateSmartItinerary(input: SmartItineraryInput): Promise<SmartItineraryOutput> {
  return smartItineraryFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartItineraryFromPromptPrompt',
  input: {schema: SmartItineraryInputSchema},
  output: {schema: SmartItineraryOutputSchema},
  tools: [findLocalEvents, getWeather],
  prompt: `You are an AI travel assistant. Your primary goal is to generate a personalized itinerary based on the user's prompt.

  1.  **Identify the Location**: First, extract the primary travel destination from the user's prompt.
  2.  **Gather Information**: Use the provided tools (\`getWeather\` and \`findLocalEvents\`) for that specific location to get real-time weather forecasts and information about local events.
  3.  **Create the Itinerary**: Generate a personalized itinerary structured as a list of days. Each day should have a theme and a list of events. Each event must have a time, an activity, and an optional safety score.
  4.  **Create a Title**: Generate a creative title for the entire trip.
  5.  **Provide an Explanation**: Write a brief explanation of why you structured the itinerary this way. Mention how you used the weather and event information (e.g., "I scheduled the museum visit in the afternoon because the forecast predicted rain," or "I included the music festival on Saturday night.").

  User Prompt:
  {{{prompt}}}
  `,
});

const smartItineraryFromPromptFlow = ai.defineFlow(
  {
    name: 'smartItineraryFromPromptFlow',
    inputSchema: SmartItineraryInputSchema,
    outputSchema: SmartItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The model failed to generate a valid itinerary. The AI's response was empty.");
    }
    return output;
  }
);
