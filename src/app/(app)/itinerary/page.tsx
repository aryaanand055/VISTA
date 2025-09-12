'use client';

import { useState } from 'react';
import { generateSmartItinerary, type SmartItineraryOutput } from '@/ai/flows/smart-itinerary-from-prompt';
import { optimizeExistingItinerary, type OptimizeExistingItineraryOutput } from '@/ai/flows/optimize-existing-itinerary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const exampleItinerary = `Day 1:
- Morning (9am): Visit the Eiffel Tower.
- Afternoon (1pm): Lunch near the Tower, then walk to Champ de Mars.
- Evening (4pm): Explore the Trocadéro Gardens for sunset views.

Day 2:
- Full Day (10am - 5pm): Discover art at the Louvre Museum.
- Evening (7pm): Dinner cruise on the Seine River.

Day 3:
- Morning (10am): Climb the Notre-Dame Cathedral towers (if open).
- Afternoon (1pm): Stroll through the Latin Quarter.
- Evening (6pm): Watch a show at the Moulin Rouge.
`;

export default function ItineraryPage() {
  const [prompt, setPrompt] = useState('');
  const [itinerary, setItinerary] = useState<string | null>(exampleItinerary);
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
    setItinerary(null);
    setOptimization(null);
    try {
      const result = await generateSmartItinerary({ prompt });
      setItinerary(result.itinerary);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error Generating Itinerary', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimize = async () => {
    if (!itinerary) return;
    setIsOptimizing(true);
    setOptimization(null);
    try {
      const result = await optimizeExistingItinerary({ itinerary });
      setOptimization(result);
      toast({ title: 'Itinerary Optimized!', description: "We've found some safer and faster alternatives for you." });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error Optimizing Itinerary', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Smart Itinerary</h1>
        <p className="text-muted-foreground">Let our AI craft the perfect, safest journey for you.</p>
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

        {itinerary && !isGenerating && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Your Itinerary</CardTitle>
                  <CardDescription>Here is your current travel plan. You can optimize it for safety and efficiency.</CardDescription>
                </div>
                <Button onClick={handleOptimize} disabled={isOptimizing} variant="outline" className="w-full sm:w-auto">
                  {isOptimizing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  {isOptimizing ? 'Optimizing...' : 'Optimize'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap rounded-lg bg-secondary/50 p-4 font-body text-sm">{itinerary}</pre>

              {isOptimizing && (
                <div className="p-8 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-muted-foreground">Analyzing real-time data...</p>
                </div>
              )}

              {optimization && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-headline-xl flex items-center gap-2 font-semibold text-primary">
                    <Sparkles className="h-5 w-5" /> Optimized Suggestions
                  </h3>
                  <div className="mt-4 space-y-4 rounded-lg bg-primary/10 p-4">
                    <div className="font-semibold">Overall Safety Score: {optimization.safetyScore}/100</div>
                    <div className="rounded-md bg-primary p-3 text-sm text-primary-foreground">
                      <span className="font-bold">New Plan: </span>
                      {optimization.optimizedItinerary}
                    </div>
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
                          setItinerary(optimization.optimizedItinerary);
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
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
