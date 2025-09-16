
'use client';

import { useState, useRef, useEffect } from 'react';
import { ref, set, get, child, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { generateSmartItinerary, type SmartItineraryInput, type SmartItineraryOutput } from '@/ai/flows/smart-itinerary-from-prompt';
import { optimizeExistingItinerary, type OptimizeExistingItineraryInput, type OptimizeExistingItineraryOutput } from '@/ai/flows/optimize-existing-itinerary';
import type { ItineraryDay } from '@/ai/flows/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2, Sparkles, AlertTriangle, Clock, Shield, Upload, MapPin } from 'lucide-react';
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
import Link from 'next/link';

export default function ItineraryPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [itineraryOutput, setItineraryOutput] = useState<SmartItineraryOutput | null>(null);
  const [optimizationPrompt, setOptimizationPrompt] = useState('');
  const [optimization, setOptimization] = useState<OptimizeExistingItineraryOutput | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadItinerary = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const userRef = ref(db, 'users/' + user.uid);
        const snapshot = await get(child(userRef, 'itinerary'));
        if (snapshot.exists()) {
          setItineraryOutput(snapshot.val());
        }
      } catch (error) {
        console.error('Failed to load itinerary:', error);
        toast({
          title: 'Could not load saved itinerary.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadItinerary();
  }, [user, toast]);

  const saveItinerary = async (itinerary: SmartItineraryOutput) => {
    if (!user) return;
    try {
      const userRef = ref(db, 'users/' + user.uid);
      await update(userRef, { itinerary: itinerary });
    } catch (error) {
      console.error('Failed to save itinerary:', error);
      toast({
        title: 'Could not save itinerary.',
        description: 'Your itinerary was generated but we failed to save it to your profile.',
        variant: 'destructive',
      });
    }
  };

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
      await saveItinerary(result);
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
      const result = await optimizeExistingItinerary({ 
        itinerary: itineraryOutput.itinerary, 
        location: 'Darjeeling, India',
        optimizationPrompt: optimizationPrompt
      });
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
        location: 'Near Mall Road, Darjeeling',
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
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        await handleCustomItinerary(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleCustomItinerary = async (text: string, title = 'Custom Itinerary') => {
    let customItinerary: SmartItineraryOutput;
    try {
      // Attempt to parse as JSON, if not, treat as a text prompt
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.every(item => 'day' in item && 'events' in item)) {
        customItinerary = { title, itinerary: parsed, explanation: 'Loaded from file.' };
        setItineraryOutput(customItinerary);
        await saveItinerary(customItinerary);
      } else {
        setPrompt(text);
        await handleGenerate();
      }
    } catch {
      // If JSON parsing fails, treat it as a text prompt
      setPrompt(text);
      await handleGenerate();
    }
    toast({ title: 'Itinerary Loaded', description: 'Your custom itinerary has been loaded and saved. You can now optimize it.' });
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
              <AlertDialogAction onClick={handleSos}>Confirm &amp; Send Alert</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Itinerary</CardTitle>
            <CardDescription>
              Describe your interests, budget, and desired activities. For example: "A 3-day trip to Darjeeling, focusing on scenic views, local monasteries, and trying authentic Tibetan food."
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

        <Card>
            <CardHeader>
                <CardTitle>Use Existing Itinerary</CardTitle>
                <CardDescription>
                Upload a JSON file or paste your itinerary text to get started. We'll parse it and make it ready for optimization.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                    <Upload className="mr-2" /> Upload File
                </Button>
                <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json,.txt" />
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or paste here</span>
                    </div>
                </div>
                <Textarea
                    placeholder="Paste your itinerary JSON or text here..."
                    rows={4}
                    onChange={(e) => handleCustomItinerary(e.target.value)}
                />
                </div>
            </CardContent>
        </Card>

        {(isLoading || isGenerating) && (
          <Card className="lg:col-span-2">
            <CardContent className="p-8 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-semibold">{isGenerating ? 'Crafting your personalized journey...' : 'Loading your saved itinerary...'}</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </CardContent>
          </Card>
        )}

        {itineraryOutput && !isGenerating && !isLoading && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{itineraryOutput.title || 'Your Itinerary'}</CardTitle>
                  <CardDescription>Here is your current travel plan. You can optimize it for safety and efficiency.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {itineraryOutput.explanation && (
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  <p><span className="font-semibold">AI Explanation:</span> {itineraryOutput.explanation}</p>
                </div>
              )}
              <div className="space-y-8">
                 <ItineraryTimeline itinerary={itineraryOutput.itinerary} />
              </div>

              {/* Optimization Section */}
              <div className="mt-8 rounded-lg border bg-background/50 p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Optimize Your Itinerary</h3>
                <p className="text-muted-foreground text-sm mt-1">Tell the AI what you'd like to change. For example, "I want a more relaxed pace for Day 2" or "Find an alternative to Tiger Hill."</p>
                <div className="mt-4 space-y-4">
                  <Textarea 
                    placeholder="e.g., 'Make the afternoon of Day 2 less crowded.'"
                    value={optimizationPrompt}
                    onChange={(e) => setOptimizationPrompt(e.target.value)}
                  />
                  <Button onClick={handleOptimize} disabled={isOptimizing} className="w-full sm:w-auto">
                    {isOptimizing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {isOptimizing ? 'Optimizing...' : 'Optimize with AI'}
                  </Button>
                </div>
              </div>

              {isOptimizing && (
                <div className="p-8 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-muted-foreground">Analyzing real-time data...</p>
                </div>
              )}

              {optimization && (
                 <div className="mt-8">
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
                            onClick={async () => {
                              const newItinerary = { ...itineraryOutput, itinerary: optimization.optimizedItinerary };
                              setItineraryOutput(newItinerary);
                              await saveItinerary(newItinerary);
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
                    <Link href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.activity + ', Darjeeling')}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
