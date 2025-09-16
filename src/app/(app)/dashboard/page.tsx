
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, MapPin, Users, FerrisWheel, Sun, Cloudy, Map as MapIcon, Newspaper, AlertTriangle, LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardPage() {
  const { user, location } = useAuth();
  const safetyScore = 92;

  const getSafetyClass = (score: number) => {
    if (score > 80) return 'text-primary';
    if (score > 60) return 'text-accent';
    return 'text-destructive';
  };

   const newsItems = [
    {
      id: 1,
      category: 'Weather Alert',
      title: `Heavy Rainfall Expected in ${location} Hills This Weekend`,
      source: 'Local Weather Department',
      time: new Date(Date.now() - 3600 * 1000 * 2), // 2 hours ago
      isUrgent: true,
    },
    {
      id: 2,
      category: 'Travel Update',
      title: 'Iconic Local Train Services Temporarily Halted for Maintenance',
      source: 'Local Railway',
      time: new Date(Date.now() - 3600 * 1000 * 8), // 8 hours ago
      isUrgent: false,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Welcome, {user?.displayName || 'Traveller'}!</h1>

      <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg">
        <Image
          src="https://media.audleytravel.com/-/media/images/home/indian-subcontinent/india/places/ss_1188853459_sunset_tea_gardens_darjeeling_3000x1000.jpg?q=79&w=1920&h=685"
          alt="Darjeeling Tea Gardens"
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint="darjeeling tea garden"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5" />
            <p className="font-semibold">{location}</p>
          </div>
          <h2 className="mt-2 font-headline text-4xl font-bold text-white">Your Himalayan Escape</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user ? (
          <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardDescription className="flex items-center justify-between">
                <span>Overall Safety Score</span>
                <Shield className={`h-5 w-5 ${getSafetyClass(safetyScore)}`} />
              </CardDescription>
              <CardTitle className={`font-headline text-5xl ${getSafetyClass(safetyScore)}`}>{safetyScore}/100</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Based on real-time data for weather, local alerts, and crowd density.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center text-center transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Shield /> Safety Score</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">Log in to view your personalized, real-time safety score based on your itinerary and location.</p>
            </CardContent>
            <CardFooter>
                <Link href="/login" className="w-full"><Button className="w-full"><LogIn className="mr-2 h-4 w-4" /> Login to View</Button></Link>
            </CardFooter>
          </Card>
        )}


        <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardDescription>Today's Plan</CardDescription>
            <CardTitle className="font-headline">Sunrise & Monasteries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Sun className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Tiger Hill Sunrise</p>
                <p className="text-sm text-muted-foreground">4:30 AM - 7:00 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <FerrisWheel className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Ghoom Monastery</p>
                <p className="text-sm text-muted-foreground">8:00 AM - 10:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardDescription>Weather Forecast</CardDescription>
            <CardTitle className="font-headline">Partly Cloudy</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Cloudy className="h-16 w-16 text-muted-foreground" />
            <div>
              <p className="text-4xl font-bold">18°C</p>
              <p className="text-sm text-muted-foreground">Feels like 16°C</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Latest News Section */}
        <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Newspaper />
              <span>Latest Updates</span>
            </CardTitle>
            <CardDescription>Top news and alerts for your trip. </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {newsItems.map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`mt-1 h-5 w-5 flex-shrink-0 ${item.isUrgent ? 'text-destructive' : 'text-primary'}`}>
                  {item.isUrgent ? <AlertTriangle/> : <Newspaper />}
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.source} · {formatDistanceToNow(item.time, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Link href="/news" className="w-full">
              <Button variant="outline" className="w-full">
                View All News
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Itinerary & Community Cards */}
        <div className="space-y-6">
          <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
            <Link href="/itinerary" className="block h-full">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <MapIcon />
                  <span>Smart Itinerary</span>
                </CardTitle>
                <CardDescription>
                  {user ? "Generate or optimize your travel plans with AI." : "Log in to generate AI-powered travel itineraries."}
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
            <Link href="/community" className="block h-full">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Users />
                  <span>Community Forum</span>
                </CardTitle>
                <CardDescription>Connect with other travelers in {location}.</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
