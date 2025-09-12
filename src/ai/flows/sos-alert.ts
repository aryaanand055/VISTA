'use server';
/**
 * @fileOverview A flow to send an SOS alert to the police.
 *
 * - sendSosAlert - A function that sends an SOS alert.
 * - SosAlertInput - The input type for the sendSosAlert function.
 * - SosAlertOutput - The return type for the sendSosAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SosAlertInputSchema = z.object({
  location: z.string().describe('The current location of the user.'),
  itinerary: z.string().optional().describe('The user\'s current itinerary as a JSON string.'),
});
export type SosAlertInput = z.infer<typeof SosAlertInputSchema>;

const SosAlertOutputSchema = z.object({
  confirmationId: z.string().describe('The confirmation ID of the SOS alert.'),
  message: z.string().describe('A confirmation message that the alert has been sent.'),
});
export type SosAlertOutput = z.infer<typeof SosAlertOutputSchema>;

export async function sendSosAlert(input: SosAlertInput): Promise<SosAlertOutput> {
  return sosAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sosAlertPrompt',
  input: {schema: SosAlertInputSchema},
  output: {schema: SosAlertOutputSchema},
  prompt: `You are a dispatcher for an emergency service. An SOS alert has been triggered.
  
  Current Location: {{{location}}}
  Itinerary: {{{itinerary}}}
  
  Acknowledge the receipt of the alert and generate a confirmation ID. The police have been notified.`,
});

const sosAlertFlow = ai.defineFlow(
  {
    name: 'sosAlertFlow',
    inputSchema: SosAlertInputSchema,
    outputSchema: SosAlertOutputSchema,
  },
  async input => {
    console.log(`SOS Alert Triggered:`, input);
    // In a real application, this would integrate with an actual emergency service API.
    // For now, we'll simulate the response.
    const {output} = await prompt(input);
    return output!;
  }
);
