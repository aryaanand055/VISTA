
'use server';

/**
 * @fileOverview An AI agent that checks if a given location is within a restricted geofenced area.
 *
 * - checkGeofence - A function that checks coordinates against known restricted zones.
 * - CheckGeofenceInput - The input type for the checkGeofence function.
 * - CheckGeofenceOutput - The return type for the checkGeofence function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CheckGeofenceInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location to check.'),
  longitude: z.number().describe('The longitude of the location to check.'),
});
export type CheckGeofenceInput = z.infer<typeof CheckGeofenceInputSchema>;

const CheckGeofenceOutputSchema = z.object({
  isRestricted: z.boolean().describe('Whether the location is within a restricted zone.'),
  zoneName: z.string().describe('The name of the zone (e.g., "Inner Line Permit (ILP) Zone" or "Unrestricted Area").'),
  advice: z.string().describe('A brief, helpful piece of advice for the user based on the zone.'),
});
export type CheckGeofenceOutput = z.infer<typeof CheckGeofenceOutputSchema>;

// This is a simplified database of restricted zones for demonstration purposes.
// In a real app, this would be a more sophisticated spatial database query.
const restrictedZones = [
  {
    name: 'Inner Line Permit (ILP) Zone',
    // A bounding box roughly around parts of the Himalayas
    bounds: {
      minLat: 27.5,
      maxLat: 28.5,
      minLon: 85.0,
      maxLon: 89.0,
    },
    advice: 'You are in an ILP zone. An Inner Line Permit is required for entry and travel. Please ensure your permits are in order.',
  },
];

export async function checkGeofence(input: CheckGeofenceInput): Promise<CheckGeofenceOutput> {
  return checkGeofenceFlow(input);
}

const checkGeofenceFlow = ai.defineFlow(
  {
    name: 'checkGeofenceFlow',
    inputSchema: CheckGeofenceInputSchema,
    outputSchema: CheckGeofenceOutputSchema,
  },
  async ({ latitude, longitude }) => {
    console.log(`[checkGeofence] Checking coordinates: Lat ${latitude}, Lon ${longitude}`);
    
    // Simulate checking against a database of geofenced areas
    for (const zone of restrictedZones) {
      const { minLat, maxLat, minLon, maxLon } = zone.bounds;
      if (latitude >= minLat && latitude <= maxLat && longitude >= minLon && longitude <= maxLon) {
        return {
          isRestricted: true,
          zoneName: zone.name,
          advice: zone.advice,
        };
      }
    }

    // If no restricted zone is found, use an LLM to generate a friendly "safe" message.
    const { output } = await ai.generate({
      prompt: `The user is at latitude ${latitude} and longitude ${longitude}. This location is not in a known restricted area. Generate a brief, reassuring message confirming they are in an unrestricted zone.`,
      output: {
        schema: z.object({
            message: z.string()
        })
      }
    });

    if (!output) {
      return {
        isRestricted: false,
        zoneName: 'Unrestricted Area',
        advice: 'You are in an area with no special travel permit requirements.',
      };
    }

    return {
      isRestricted: false,
      zoneName: 'Unrestricted Area',
      advice: output.message,
    };
  }
);
