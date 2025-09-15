// src/ai/flows/optimize-existing-itinerary.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing an existing tourist itinerary by analyzing it and suggesting safer and faster alternatives.
 *
 * - optimizeExistingItinerary - A function that optimizes a given itinerary.
 * - OptimizeExistingItineraryInput - The input type for the optimizeExistingItinerary function.
 * - OptimizeExistingItineraryOutput - The return type for the optimizeExistingItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ItineraryDaySchema } from './schemas';

const OptimizeExistingItineraryInputSchema = z.object({
  itinerary: z.array(ItineraryDaySchema).describe('The existing itinerary as a structured object.'),
  preferences: z.string().optional().describe('The tourist preferences.'),
  timeConstraints: z.string().optional().describe('Time constraints for the itinerary.'),
  weatherConditions: z.string().optional().describe('The weather conditions during the trip.'),
  location: z.string().optional().describe('The current location of the tourist.'),
  optimizationPrompt: z.string().optional().describe('A specific prompt from the user on what to change or optimize.'),
});

export type OptimizeExistingItineraryInput = z.infer<typeof OptimizeExistingItineraryInputSchema>;

const OptimizeExistingItineraryOutputSchema = z.object({
  optimizedItinerary: z.array(ItineraryDaySchema).describe('The optimized itinerary with safer and faster alternatives.'),
  safetyScore: z.number().describe('The overall safety score for the optimized itinerary.'),
  crowdDensityInfo: z.string().optional().describe('Information about crowd density along the itinerary route.'),
  riskAlerts: z.string().optional().describe('Any risk alerts or warnings for the itinerary.'),
  alternativeRoutes: z.string().optional().describe('Alternative routes or transportation suggestions.'),
});

export type OptimizeExistingItineraryOutput = z.infer<typeof OptimizeExistingItineraryOutputSchema>;

export async function optimizeExistingItinerary(
  input: OptimizeExistingItineraryInput
): Promise<OptimizeExistingItineraryOutput> {
  return optimizeExistingItineraryFlow(input);
}

const optimizeExistingItineraryPrompt = ai.definePrompt({
  name: 'optimizeExistingItineraryPrompt',
  input: {schema: OptimizeExistingItineraryInputSchema},
  output: {schema: OptimizeExistingItineraryOutputSchema},
  prompt: `You are an AI travel assistant that optimizes tourist itineraries.

  Analyze the provided itinerary, user preferences, and real-time data to suggest safer and faster alternatives.
  If the user provides an optimization prompt, prioritize their request.

  User's Optimization Request: {{{optimizationPrompt}}}

  Itinerary:
  \`\`\`json
  {{{json itinerary}}}
  \`\`\`
  Preferences: {{{preferences}}}
  Time Constraints: {{{timeConstraints}}}
  Weather Conditions: {{{weatherConditions}}}
  Current Location: {{{location}}}
  
  Optimize the itinerary to ensure maximum safety and efficiency, while respecting the tourist's preferences and constraints.
  Reorder the itinerary based on real-time data on crowd density, risk alerts, and weather conditions.
  Provide detailed information on crowd density, risk alerts, and alternative routes.
  Calculate and provide an overall safety score for the optimized itinerary.
  The structure of the optimized itinerary must be the same as the input.
  `,
});

const optimizeExistingItineraryFlow = ai.defineFlow(
  {
    name: 'optimizeExistingItineraryFlow',
    inputSchema: OptimizeExistingItineraryInputSchema,
    outputSchema: OptimizeExistingItineraryOutputSchema,
  },
  async input => {
    const {output} = await optimizeExistingItineraryPrompt(input);
    if (!output) {
      throw new Error('The model failed to generate an optimized itinerary.');
    }
    return output;
  }
);
