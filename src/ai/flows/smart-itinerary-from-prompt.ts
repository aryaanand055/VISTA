'use server';
/**
 * @fileOverview An AI agent that generates a smart itinerary based on a prompt.
 *
.
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
  location: z.string().optional().describe('The primary travel destination. If not provided, it should be inferred from the prompt.'),
});
export type SmartItineraryInput = z.infer<typeof SmartItineraryInputSchema>;

const SmartItineraryOutputSchema = z.object({
  itinerary: z.array(ItineraryDaySchema).describe('A personalized itinerary including specific locations, estimated travel times, and safety scores for each location.'),
  title: z.string().describe('A creative title for the itinerary.'),
  location: z.string().describe('The primary location of the itinerary (e.g., "Darjeeling, India").'),
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
  prompt: `You are an AI travel assistant. Your primary goal is to generate a personalized and realistic itinerary.

  1.  **Identify the Location**: Determine the travel destination from the 'location' field or infer it from the user's prompt. This MUST be set in the 'location' output field.
  2.  **Gather Information**: Use the provided tools (\`getWeather\` and \`findLocalEvents\`) for the determined location to get real-time data.
  3.  **Create a Realistic Itinerary**:
      *   Generate a day-by-day plan.
      *   For each event, specify the \`time\`, \`activity\`, an estimated \`duration\`, and a brief, engaging \`description\`.
      *   **Crucially, be realistic about timing.** A full-day activity like a theme park should take up the whole day. A short visit to a viewpoint might only take an hour. Account for travel time between locations (though you don't need to state it explicitly).
      *   The number of activities per day should be reasonable. A day should not be over-scheduled.
  4.  **Create a Title**: Generate a creative title for the entire trip.
  5.  **Provide an Explanation**: Write a brief explanation of the itinerary's structure, mentioning how you used weather or event data (e.g., "I scheduled the museum visit in the afternoon because the forecast predicted rain," or "I included the music festival on Saturday night.").

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
