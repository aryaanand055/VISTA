'use server';

/**
 * @fileOverview A tool to get the latest news for a specific location.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fetch from 'node-fetch';

const NewsArticleSchema = z.object({
  title: z.string().describe('The headline of the news article.'),
  source: z.string().describe('The source of the news article (e.g., "The Times of India").'),
  url: z.string().url().describe('The URL to the full article.'),
  publishedAt: z.string().describe('The ISO 8601 date and time the article was published.'),
  description: z.string().optional().describe('A brief description of the article.'),
  imageUrl: z.string().url().optional().describe('A URL to an image for the article.'),
});

export const getNews = ai.defineTool(
  {
    name: 'getNews',
    description: 'Fetches the latest news articles for a given location or query, focusing on topics relevant to tourists like safety, travel, weather alerts, and local events.',
    inputSchema: z.object({
      query: z.string().describe('The search query for news (e.g., "Darjeeling travel safety", "road closures Himalayas").'),
    }),
    outputSchema: z.object({
      articles: z.array(NewsArticleSchema),
    }),
  },
  async ({ query }) => {
    console.log(`[getNews] Fetching news for: ${query}`);
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      console.warn('[getNews] NEWS_API_KEY is not set. Returning mock data.');
      return {
        articles: [
          {
            title: 'Heavy Rainfall Expected in Darjeeling Hills',
            source: 'Local Weather Channel',
            url: 'https://example.com/news1',
            publishedAt: new Date().toISOString(),
            description: 'Tourists are advised to be cautious as the meteorological department has predicted heavy rainfall over the next 48 hours, which may lead to landslides in sensitive areas.',
            imageUrl: 'https://picsum.photos/seed/news1/400/200',
          },
          {
            title: 'Toy Train Services Temporarily Halted for Maintenance',
            source: 'Darjeeling Himalayan Railway',
            url: 'https://example.com/news2',
            publishedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
            description: 'The iconic Darjeeling Toy Train will not be operational on the main route for the next two days due to urgent track maintenance. Shuttle services on shorter routes continue.',
            imageUrl: 'https://picsum.photos/seed/news2/400/200',
          },
        ],
      };
    }
    
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&amp;apiKey=${apiKey}&amp;sortBy=publishedAt&amp;pageSize=10`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`NewsAPI request failed with status ${response.status}: ${errorBody}`);
      }
      const data = (await response.json()) as any;

      const articles = data.articles.map((article: any) => ({
        title: article.title,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        description: article.description,
        imageUrl: article.urlToImage,
      }));

      return { articles };
    } catch (error) {
      console.error('[getNews] Error fetching news from NewsAPI:', error);
      throw new Error('Failed to fetch news.');
    }
  }
);
