'use client';

import { useState } from 'react';
import { generateSmartItinerary, type ItineraryDay, type SmartItineraryOutput } from '@/ai/flows/smart-itinerary-from-prompt';
import { optimizeExistingItinerary, type OptimizeExistingItineraryOutput } from '@/ai/flows/optimize-existing-itinerary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2, Sparkles, AlertTriangle, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { sendSosAlert } from '@/ai/flows/sos-alert';

const exampleItinerary: SmartItineraryOutput = {
  title: 'Classic Parisian Holiday',
  itinerary: [
    {
      day: 1,
      theme: "Monuments & Museums",
      events: [
        { time: '9:00 AM', activity: 'Visit the Eiffel Tower.', safetyScore: 90 },
        { time: '1:00 PM', activity: 'Lunch near the Tower, then walk to Champ de Mars.', safetyScore: 88 },
        { time: '4:00 PM', activity: 'Explore the Trocadéro Gardens for sunset views.', safetyScore: 92 },
      ],
    },
    {
      day: 2,
      theme: 'Art & River Views',
      events: [
        { time: '10:00 AM - 5:00 PM', activity: 'Discover art at the Louvre Museum.', safetyScore: 85 },
        { time: '7:00 PM', activity: 'Dinner cruise on the Seine River.', safetyScore: 95 },
      ],
    },
    {
      day: 3,
      theme: 'Historic Charm',
      events: [
        { time: '10:00 AM', activity: 'Climb the Notre-Dame Cathedral towers (if open).', safetyScore: 82 },
        { time: '1:00 PM', activity: 'Stroll through the Latin Quarter.', safetyScore: 89 },
        { time: '6:00 PM', activity: 'Watch a show at the Moulin Rouge.', safetyScore: 78 },
      ],
    },
  ],
};


export default function ItineraryPage() {
  const [prompt, setPrompt] = useState('');
  const [itineraryOutput, setItineraryOutput] = useState<SmartItineraryOutput | null>(exampleItinerary);
  const [optimization, setOptimization] = useState<OptimizeExistingItineraryOutput | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) {
      toast({ title: 'Prompt is empty', description: 'Please describe your dream trip.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    setItineraryOutput(null);
    setOptimization(null);
    try {
      const result = await generateSmartItinerary({ prompt });
      setItineraryOutput(result);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error Generating Itinerary', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimize = async () => {
    if (!itineraryOutput?.itinerary) return;
    setIsOptimizing(true);
    setOptimization(null);
    try {
      const result = await optimizeExistingItinerary({ itinerary: itineraryOutput.itinerary });
      setOptimization(result);
      toast({ title: 'Itinerary Optimized!', description: "We've found some safer and faster alternatives for you." });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error Optimizing Itinerary', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSos = async () => {
    try {
      await sendSosAlert({
        location: 'Near Eiffel Tower, Paris',
        itinerary: JSON.stringify(itineraryOutput?.itinerary, null, 2),
      });
      toast({
        title: 'SOS Alert Sent!',
        description: 'Your emergency alert has been transmitted to local authorities.',
        variant: 'destructive',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'SOS Failed',
        description: 'Could not send the alert. Please try again or contact authorities directly.',
        variant: 'destructive',
      });
    }
  };

  const getSafetyClass = (score: number) => {
    if (score > 80) return 'text-primary';
    if (score > 60) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Smart Itinerary</h1>
          <p className="text-muted-foreground">Let our AI craft the perfect, safest journey for you.</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <AlertTriangle className="mr-2" /> SOS
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Emergency SOS</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately transmit your current location and itinerary to the local police station. Use only in a real
                emergency.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSos}>Confirm & Send Alert</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Itinerary</CardTitle>
            <CardDescription>
              Describe your interests, budget, and desired activities. For example: "A 3-day romantic trip to Paris, focusing on art
              museums, beautiful views, and local cuisine."
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="prompt" className="sr-only">
              Trip Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="Tell us about your trip..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </Button>
          </CardFooter>
        </Card>

        {isGenerating && (
          <Card className="lg:col-span-2">
            <CardContent className="p-8 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-semibold">Crafting your personalized journey...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </CardContent>
          </Card>
        )}

        {itineraryOutput && !isGenerating && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{itineraryOutput.title || 'Your Itinerary'}</CardTitle>
                  <CardDescription>Here is your current travel plan. You can optimize it for safety and efficiency.</CardDescription>
                </div>
                <Button onClick={handleOptimize} disabled={isOptimizing} variant="outline" className="w-full sm:w-auto">
                  {isOptimizing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  {isOptimizing ? 'Optimizing...' : 'Optimize'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {optimization?.optimizedItinerary ? (
                  <>
                    <h3 className="font-headline-xl flex items-center gap-2 font-semibold text-primary">
                      <Sparkles className="h-5 w-5" /> Optimized Suggestions
                    </h3>
                    <div className="mt-4 space-y-4 rounded-lg bg-primary/10 p-4">
                       <div className="font-semibold">Overall Safety Score: {optimization.safetyScore}/100</div>
                        {optimization.riskAlerts && (
                        <p className="text-sm">
                            <span className="font-bold">Alerts:</span> {optimization.riskAlerts}
                        </p>
                        )}
                        {optimization.crowdDensityInfo && (
                        <p className="text-sm">
                            <span className="font-bold">Crowds:</span> {optimization.crowdDensityInfo}
                        </p>
                        )}
                        <div className="flex gap-2 pt-2">
                        <Button
                            onClick={() => {
                            setItineraryOutput({ ...itineraryOutput, itinerary: optimization.optimizedItinerary });
                            setOptimization(null);
                            }}
                        >
                            Accept Changes
                        </Button>
                        <Button variant="ghost" onClick={() => setOptimization(null)}>
                            Reject
                        </Button>
                        </div>
                    </div>
                    <ItineraryTimeline itinerary={optimization.optimizedItinerary} />
                  </>
                ) : (
                  <ItineraryTimeline itinerary={itineraryOutput.itinerary} />
                )}
              </div>

              {isOptimizing && (
                <div className="p-8 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-muted-foreground">Analyzing real-time data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ItineraryTimeline({ itinerary }: { itinerary: ItineraryDay[] }) {
    const getSafetyClass = (score: number) => {
        if (score > 80) return 'text-primary';
        if (score > 60) return 'text-accent';
        return 'text-destructive';
    };
  return (
    <div className="space-y-8">
      {itinerary.map((day) => (
        <div key={day.day}>
          <h3 className="font-headline text-xl font-bold">Day {day.day}{day.theme && `: ${day.theme}`}</h3>
          <div className="mt-4 border-l-2 border-primary pl-6">
            {day.events.map((event, eventIndex) => (
              <div key={eventIndex} className="relative mb-6">
                <div className="absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-primary" />
                <div className="flex items-center gap-4">
                    <p className="w-28 font-semibold text-primary"><Clock className="inline h-4 w-4 mr-1"/>{event.time}</p>
                    <p className="flex-1">{event.activity}</p>
                    {event.safetyScore && (
                        <div className={`flex items-center gap-1 font-semibold ${getSafetyClass(event.safetyScore)}`}>
                            <Shield size={16} />
                            <span>{event.safetyScore}</span>
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
