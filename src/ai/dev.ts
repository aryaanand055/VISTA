import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-existing-itinerary.ts';
import '@/ai/flows/smart-itinerary-from-prompt.ts';
import '@/ai/flows/sos-alert.ts';
