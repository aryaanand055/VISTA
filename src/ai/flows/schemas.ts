// src/ai/flows/schemas.ts

import {z} from 'genkit';

export const ItineraryDaySchema = z.object({
  day: z.number().describe('Day number of the itinerary, starting from 1.'),
  theme: z.string().optional().describe('A theme for the day, like "Cultural Exploration" or "Relaxation Day".'),
  events: z.array(z.object({
    time: z.string().describe('The time of the event, e.g., "9:00 AM" or "Afternoon".'),
    activity: z.string().describe('The description of the activity or event.'),
    safetyScore: z.number().min(0).max(100).optional().describe('Safety score for the location of the activity.'),
  })),
});
export type ItineraryDay = z.infer<typeof ItineraryDaySchema>;
