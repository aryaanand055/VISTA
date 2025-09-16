'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Rss } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { getNews } from '@/ai/tools/news';
import { useToast } from '@/hooks/use-toast';

interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description?: string;
  imageUrl?: string;
}

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('Darjeeling travel');
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const { toast } = useToast();

  const handleSearch = async (query?: string) => {
    const finalQuery = query || searchQuery;
    if (!finalQuery) {
      toast({ title: 'Search query is empty', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setArticles([]);

    try {
      const result = await getNews({ query: finalQuery });
      setArticles(result.articles);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      toast({
        title: 'Error Fetching News',
        description: 'Could not retrieve news at this time. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load initial articles on page load
    handleSearch('Darjeeling travel safety');
  }, []);

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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={() => handleSearch()} disabled={isLoading}>
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
      ) : articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
                <ArticleCard key={index} article={article} />
            ))}
        </div>
      ) : (
        <div className="text-center p-8">
            <p className="text-muted-foreground">No articles found for your query. Try a different search term.</p>
        </div>
      )}

    </div>
  );
}

function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
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
      </Link>
      <div className="flex flex-col flex-grow p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-lg hover:text-primary">
             <Link href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</Link>
          </CardTitle>
          <CardDescription>
            {article.source} · {format(new Date(article.publishedAt), 'PP')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.description}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
