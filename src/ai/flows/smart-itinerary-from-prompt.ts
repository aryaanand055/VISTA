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


const SmartItineraryInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the user\'s interests, desired activities, and travel dates.'),
});
export type SmartItineraryInput = z.infer<typeof SmartItineraryInputSchema>;

const SmartItineraryOutputSchema = z.object({
  itinerary: z.array(ItineraryDaySchema).describe('A personalized itinerary including specific locations, estimated travel times, and safety scores for each location.'),
  title: z.string().describe('A creative title for the itinerary.'),
});
export type SmartItineraryOutput = z.infer<typeof SmartItineraryOutputSchema>;

export async function generateSmartItinerary(input: SmartItineraryInput): Promise<SmartItineraryOutput> {
  return smartItineraryFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartItineraryFromPromptPrompt',
  input: {schema: SmartItineraryInputSchema},
  output: {schema: SmartItineraryOutputSchema},
  prompt: `You are an AI travel assistant. Generate a personalized itinerary based on the following prompt:\n\n{{{prompt}}}\n\nThe itinerary should be structured as a list of days, each with a theme and a list of events. Each event must have a time, activity, and an optional safety score. Also generate a creative title for the whole trip.`,
});

const smartItineraryFromPromptFlow = ai.defineFlow(
  {
    name: 'smartItineraryFromPromptFlow',
    inputSchema: SmartItineraryInputSchema,
    outputSchema: SmartItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
