// src/ai/flows/schemas.ts

import {z} from 'genkit';

export const ItineraryEventSchema = z.object({
    time: z.string().describe('The start time of the event, e.g., "9:00 AM" or "Afternoon".'),
    duration: z.string().optional().describe('The estimated duration of the activity, e.g., "2 hours" or "All day".'),
    activity: z.string().describe('The description of the activity or event.'),
    description: z.string().optional().describe('A brief, engaging description of what makes this activity interesting.'),
    safetyScore: z.number().min(0).max(100).optional().describe('Safety score for the location of the activity.'),
});
export type ItineraryEvent = z.infer<typeof ItineraryEventSchema>;


export const ItineraryDaySchema = z.object({
  day: z.number().describe('Day number of the itinerary, starting from 1.'),
  theme: z.string().optional().describe('A theme for the day, like "Cultural Exploration" or "Relaxation Day".'),
  events: z.array(ItineraryEventSchema),
});
export type ItineraryDay = z.infer<typeof ItineraryDaySchema>;
