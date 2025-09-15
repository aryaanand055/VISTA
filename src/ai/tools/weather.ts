'use server';
/**
 * @fileOverview A tool to get the weather forecast for a given location.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fetch from 'node-fetch';

export const getWeather = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Gets the current weather and a 5-day forecast for a specific location.',
    inputSchema: z.object({
      location: z.string().describe('The city and state, or city and country, for which to get the weather.'),
    }),
    outputSchema: z.object({
      forecast: z.array(
        z.object({
          day: z.string().describe('The day of the week.'),
          temperature: z.string().describe('The forecasted temperature (e.g., "15°C").'),
          condition: z.string().describe('The weather condition (e.g., "Cloudy", "Rain").'),
          icon: z.string().describe('An icon code representing the weather condition.'),
        })
      ),
    }),
  },
  async ({ location }) => {
    console.log(`[getWeather] Fetching weather for: ${location}`);
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
      console.warn('[getWeather] OPENWEATHERMAP_API_KEY is not set. Returning mock data.');
      if (location.toLowerCase().includes('darjeeling')) {
        return {
          forecast: [
            { day: 'Today', temperature: '18°C', condition: 'Partly Cloudy', icon: '03d' },
            { day: 'Tomorrow', temperature: '15°C', condition: 'Light Rain', icon: '10d' },
            { day: 'Day 3', temperature: '16°C', condition: 'Cloudy', icon: '04d' },
          ],
        };
      }
      return {
        forecast: [
          { day: 'Today', temperature: '25°C', condition: 'Sunny', icon: '01d' },
          { day: 'Tomorrow', temperature: '26°C', condition: 'Partly Cloudy', icon: '02d' },
          { day: 'Day 3', temperature: '22°C', condition: 'Showers', icon: '09d' },
        ],
      };
    }
    
    // 1. Get lat/lon from location name
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&amp;limit=1&amp;appid=${apiKey}`;
    let lat: number, lon: number;

    try {
      const geoResponse = await fetch(geoUrl);
      const geoData = (await geoResponse.json()) as any;
      if (!geoData || geoData.length === 0) {
        throw new Error('Location not found.');
      }
      lat = geoData[0].lat;
      lon = geoData[0].lon;
    } catch (error) {
      console.error('[getWeather] Geocoding failed:', error);
      throw new Error('Could not find latitude and longitude for the specified location.');
    }
    
    // 2. Get weather forecast from lat/lon
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&amp;lon=${lon}&amp;appid=${apiKey}&amp;units=metric`;

    try {
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = (await forecastResponse.json()) as any;

      const dailyForecasts = new Map&lt;string, any>();

      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (!dailyForecasts.has(day) || date.getHours() >= 12) {
          dailyForecasts.set(day, item);
        }
      });
      
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = new Date().getDay();
      const sortedDays = [...daysOfWeek.slice(today), ...daysOfWeek.slice(0, today)];

      const forecast = Array.from(dailyForecasts.values()).slice(0, 5).map((item, index) => {
        const date = new Date(item.dt * 1000);
        return {
          day: index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short'}),
          temperature: `${Math.round(item.main.temp)}°C`,
          condition: item.weather[0].main,
          icon: item.weather[0].icon,
        };
      });

      return { forecast };

    } catch (error) {
      console.error('[getWeather] Forecast fetch failed:', error);
      throw new Error('Failed to fetch weather forecast.');
    }
  }
);
