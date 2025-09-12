import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, MapPin, Users, FerrisWheel, Sun, Cloudy, Map as MapIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const safetyScore = 85;

  const getSafetyClass = (score: number) => {
    if (score > 80) return 'text-primary';
    if (score > 60) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Welcome, Priya!</h1>

      <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg">
        <Image
          src="https://picsum.photos/seed/101/1200/400"
          alt="Current Location"
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint="indian palace"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5" />
            <p className="font-semibold">Jaipur, India</p>
          </div>
          <h2 className="mt-2 font-headline text-4xl font-bold text-white">Your Jaipuri Adventure</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardDescription className="flex items-center justify-between">
              <span>Overall Safety Score</span>
              <Shield className={`h-5 w-5 ${getSafetyClass(safetyScore)}`} />
            </CardDescription>
            <CardTitle className={`font-headline text-5xl ${getSafetyClass(safetyScore)}`}>{safetyScore}/100</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Based on real-time data including crime rates, crowd density, and weather conditions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Today's Plan</CardDescription>
            <CardTitle className="font-headline">Hawa Mahal & City Palace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <FerrisWheel className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Hawa Mahal</p>
                <p className="text-sm text-muted-foreground">10:00 AM - 1:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Sun className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">City Palace</p>
                <p className="text-sm text-muted-foreground">2:00 PM - 5:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Weather Forecast</CardDescription>
            <CardTitle className="font-headline">Sunny</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Sun className="h-16 w-16 text-muted-foreground" />
            <div>
              <p className="text-4xl font-bold">32°C</p>
              <p className="text-sm text-muted-foreground">Feels like 35°C</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <Link href="/itinerary" className="block h-full">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <MapIcon />
                <span>Smart Itinerary</span>
              </CardTitle>
              <CardDescription>Generate or optimize your travel plans with AI.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Plan My Trip</Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <Link href="/tracking" className="block h-full">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Users />
                <span>Family Tracking</span>
              </CardTitle>
              <CardDescription>Share your location and view family members.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Map</Button>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
