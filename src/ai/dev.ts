import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-existing-itinerary.ts';
import '@/ai/flows/smart-itinerary-from-prompt.ts';
import '@/ai/flows/sos-alert.ts';
import '@/ai/flows/find-places.ts';
import '@/ai/flows/summarize-community-activity.ts';
import '@/ai/tools/events.ts';
import '@/ai/tools/news.ts';
import '@/ai/tools/weather.ts';
