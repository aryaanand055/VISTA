'use server';
/**
 * @fileOverview An AI agent that finds places based on a natural language query.
 *
 * - findPlaces - A function that finds places based on a user's query.
 * - FindPlacesInput - The input type for the findPlaces function.
 * - FindPlacesOutput - The return type for the findPlaces function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PlaceSchema = z.object({
  id: z.number(),
  name: z.string().describe('The name of the place.'),
  category: z.string().describe('The category of the place (e.g., "Cafe & Restaurant", "Museum & Institution").'),
  rating: z.number().min(0).max(5).describe('The user rating of the place, out of 5.'),
  reviewCount: z.number().describe('The number of reviews for the place.'),
  address: z.string().describe('The address of the place.'),
  images: z.array(z.string().url()).describe('An array of URLs for images of the place. Use picsum.photos for placeholders.'),
  justification: z.string().describe('A short sentence explaining why this place was recommended based on the user\'s query.'),
});

const FindPlacesInputSchema = z.object({
  query: z.string().describe('A natural language query from a user describing what kind of place they want to find.'),
});
export type FindPlacesInput = z.infer<typeof FindPlacesInputSchema>;

const FindPlacesOutputSchema = z.object({
  places: z.array(PlaceSchema).describe('An array of places that match the user\'s query.'),
});
export type FindPlacesOutput = z.infer<typeof FindPlacesOutputSchema>;

export async function findPlaces(input: FindPlacesInput): Promise<FindPlacesOutput> {
  return findPlacesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findPlacesPrompt',
  input: { schema: FindPlacesInputSchema },
  output: { schema: FindPlacesOutputSchema },
  prompt: `You are a local guide for Darjeeling. A user is asking for recommendations.
  Based on their query, find relevant places. Provide a justification for each recommendation.
  Generate placeholder image URLs from picsum.photos.

  User Query:
  "{{{query}}}"

  Return a list of places that would be a good fit.
  `,
});

const findPlacesFlow = ai.defineFlow(
  {
    name: 'findPlacesFlow',
    inputSchema: FindPlacesInputSchema,
    outputSchema: FindPlacesOutputSchema,
  },
  async (input) => {
    // In a real app, you might use a tool to search a database of places.
    // For this example, we'll let the LLM generate the places based on its knowledge.
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The model failed to generate places.');
    }
    return output;
  }
);
