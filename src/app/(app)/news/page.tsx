'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Rss } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description?: string;
  imageUrl?: string;
}

// Mock news data
const mockNews: NewsArticle[] = [
    {
      title: 'Heavy Rainfall Expected in Darjeeling Hills',
      source: 'Local Weather Channel',
      url: '#',
      publishedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      description: 'Tourists are advised to be cautious as the meteorological department has predicted heavy rainfall over the next 48 hours, which may lead to landslides in sensitive areas.',
      imageUrl: 'https://picsum.photos/seed/news1/400/200',
    },
    {
      title: 'Toy Train Services Temporarily Halted for Maintenance',
      source: 'Darjeeling Himalayan Railway',
      url: '#',
      publishedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      description: 'The iconic Darjeeling Toy Train will not be operational on the main route for the next two days due to urgent track maintenance. Shuttle services on shorter routes continue.',
      imageUrl: 'https://picsum.photos/seed/news2/400/200',
    },
    {
      title: 'Annual Tea and Tourism Festival Begins',
      source: 'Darjeeling Times',
      url: '#',
      publishedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      description: 'The much-awaited annual Darjeeling Tea and Tourism Festival began today at Chowrasta Mall, showcasing the best of local culture, music, and of course, tea.',
      imageUrl: 'https://picsum.photos/seed/news3/400/200',
    },
    {
        title: 'New Hiking Trail to Sandakphu Opens for Season',
        source: 'Himalayan Mountaineering Institute',
        url: '#',
        publishedAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
        description: 'The popular hiking route to Sandakphu is now officially open for the trekking season. Trekkers are advised to register before starting their journey.',
        imageUrl: 'https://picsum.photos/seed/news4/400/200',
    },
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState&lt;NewsArticle[]>([]);

  useEffect(() => {
    // Load initial articles
    setIsLoading(true);
    // In a real app, you'd fetch this from your `getNews` tool
    setTimeout(() => {
      setArticles(mockNews);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = () => {
    if (!searchQuery) return;
    setIsLoading(true);
    // Simulate fetching new articles based on search
    setTimeout(() => {
        const filtered = mockNews.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
        setArticles(filtered);
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
          <Rss />
          News &amp; Alerts
        </h1>
        <p className="text-muted-foreground">
          Stay updated with the latest news and travel advisories for Darjeeling and surrounding areas.
        </p>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Search for news (e.g., 'weather', 'traffic')..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' &amp;&amp; handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="sr-only sm:not-sr-only sm:ml-2">Search</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="text-center p-8">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Fetching latest news...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
                <ArticleCard key={index} article={article} />
            ))}
        </div>
      )}

    </div>
  );
}

function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative h-40 w-full">
            <Image
                src={article.imageUrl || 'https://picsum.photos/seed/news_default/400/200'}
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="news article"
            />
        </div>
        <CardHeader>
          <CardTitle className="text-lg">{article.title}</CardTitle>
          <CardDescription>
            {article.source} · {format(new Date(article.publishedAt), 'PP')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.description}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
