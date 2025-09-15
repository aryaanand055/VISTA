'use server';

/**
 * @fileOverview A tool to find local events in a given location.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const findLocalEvents = ai.defineTool(
  {
    name: 'findLocalEvents',
    description: 'Finds local events, festivals, and activities in a specific city or area.',
    inputSchema: z.object({
      location: z.string().describe('The city and state, or city and country, to search for events.'),
    }),
    outputSchema: z.object({
      events: z.array(
        z.object({
          name: z.string().describe('The name of the event.'),
          date: z.string().describe('The date of the event.'),
          venue: z.string().describe('The location or venue of the event.'),
          description: z.string().describe('A brief description of the event.'),
        })
      ),
    }),
  },
  async (input) => {
    console.log(`[findLocalEvents] Searching for events in: ${input.location}`);
    // In a real application, you would call an external API (e.g., Eventbrite, Ticketmaster).
    // For now, we'll return mock data based on the location.
    if (input.location.toLowerCase().includes('darjeeling')) {
      return {
        events: [
          {
            name: 'Darjeeling Tea & Tourism Festival',
            date: 'This Weekend',
            venue: 'Chowrasta Mall',
            description: 'A vibrant festival celebrating the region\'s world-famous tea, with cultural performances and local food stalls.',
          },
          {
            name: 'Morning Meditation at the Peace Pagoda',
            date: 'Daily',
            venue: 'Japanese Peace Pagoda',
            description: 'Join the monks for a peaceful morning meditation session with panoramic views of the Himalayas.',
          },
        ],
      };
    }

    return {
      events: [
        {
          name: 'Local Farmers Market',
          date: 'Saturday Morning',
          venue: 'City Center Square',
          description: 'A weekly market with local produce and handmade crafts.',
        },
      ],
    };
  }
);
