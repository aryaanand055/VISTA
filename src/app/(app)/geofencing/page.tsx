
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Map, MapPin, LocateFixed, HelpCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { checkGeofence } from '@/ai/flows/check-geofence';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const zones = {
  ilp: {
    name: 'Inner Line Permit (ILP) Zone',
    color: 'bg-red-500/30',
    borderColor: 'border-red-500',
    textColor: 'text-red-500',
    description: 'Requires an Inner Line Permit for all domestic tourists. This is common in states like Arunachal Pradesh, Nagaland, Mizoram, and Manipur.',
  },
  pap: {
    name: 'Protected Area Permit (PAP) Zone',
    color: 'bg-yellow-500/30',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-500',
    description: 'Requires a Protected Area Permit, typically for foreign nationals, to enter certain areas, often near international borders.',
  },
  free: {
    name: 'Unrestricted Zone',
    color: 'bg-green-500/30',
    borderColor: 'border-green-500',
    textColor: 'text-green-500',
    description: 'No special permits are required for entry for Indian nationals.',
  },
};

const checkpoints = [
  { name: 'Rangpo Check Post', type: 'Entry/Exit for Sikkim' },
  { name: 'Tawang Entry Point', type: 'Entry for Arunachal Pradesh' },
  { name: 'Nathula Pass Gate', type: 'Border Crossing' },
];

export default function GeoGuardPage() {
  const { location } = useAuth();
  const [selectedItem, setSelectedItem] = useState<any>(zones.ilp);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const [isCheckingZone, setIsCheckingZone] = useState(false);
  const [zoneCheckResult, setZoneCheckResult] = useState<any>(null);
  const { toast } = useToast();

  const handleFindLocation = () => {
    setIsFindingLocation(true);
    setZoneCheckResult(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Simulate coordinates within a known restricted zone for demonstration
        const simulatedLocation = { lat: 27.7172, lon: 85.3240 }; 
        setUserLocation(simulatedLocation);
        toast({
          title: 'Location Found!',
          description: `Your location is pinned on the map. (Simulated for demo)`,
        });
        setIsFindingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: 'Could not get location',
          description: 'Please ensure you have enabled location services for this site.',
          variant: 'destructive',
        });
        setIsFindingLocation(false);
      }
    );
  };

  const handleCheckZone = async () => {
    if (!userLocation) {
      toast({
        title: 'No location found',
        description: 'Please find your location first before checking the zone.',
        variant: 'destructive',
      });
      return;
    }
    setIsCheckingZone(true);
    setZoneCheckResult(null);
    try {
      const result = await checkGeofence({ latitude: userLocation.lat, longitude: userLocation.lon });
      setZoneCheckResult(result);
    } catch (error) {
      console.error('Error checking geofence:', error);
      toast({
        title: 'AI Check Failed',
        description: 'The AI service could not determine the zone for your location.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingZone(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">GeoGuard Permissions</h1>
        <p className="text-muted-foreground">Understand and navigate permit requirements for restricted areas in India.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleFindLocation} disabled={isFindingLocation} className="w-full">
                {isFindingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                {isFindingLocation ? 'Finding...' : 'My Location'}
              </Button>
              <Button onClick={handleCheckZone} disabled={!userLocation || isCheckingZone} className="w-full">
                 {isCheckingZone ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HelpCircle className="mr-2 h-4 w-4" />}
                 {isCheckingZone ? 'Checking...' : 'Check My Zone'}
              </Button>
            </CardContent>
          </Card>
          
          {zoneCheckResult && (
             <Alert variant={zoneCheckResult.isRestricted ? "destructive" : "default"} className="animate-fade-in">
                <AlertTriangle className={`h-4 w-4 ${!zoneCheckResult.isRestricted && 'hidden'}`} />
                <CheckCircle className={`h-4 w-4 ${zoneCheckResult.isRestricted && 'hidden'}`} />
                <AlertTitle className="font-bold">{zoneCheckResult.zoneName}</AlertTitle>
                <AlertDescription>
                  {zoneCheckResult.advice}
                </AlertDescription>
            </Alert>
          )}

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>{selectedItem ? selectedItem.name : 'Map Legend'}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItem ? (
                <div className="space-y-4 animate-fade-in">
                  <div className={`p-4 rounded-lg ${selectedItem.color} ${selectedItem.borderColor} border-2`}>
                     <p className="font-semibold">{selectedItem.description}</p>
                  </div>
                   {selectedItem.type && (
                     <p><span className="font-semibold">Type:</span> {selectedItem.type}</p>
                   )}
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.values(zones).map(zone => (
                    <div key={zone.name} className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-sm ${zone.color} border ${zone.borderColor}`} />
                      <span className="text-sm font-medium">{zone.name}</span>
                    </div>
                  ))}
                  <hr className="my-2"/>
                  <h3 className="font-semibold text-sm pt-2">Checkpoints</h3>
                   <div className="space-y-2">
                    {checkpoints.map(cp => (
                        <div key={cp.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary"/>
                            <span>{cp.name}</span>
                        </div>
                    ))}
                   </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card className="lg:col-span-2 h-full min-h-[600px] overflow-hidden">
          <CardContent className="p-0 h-full">
            <div className="relative w-full h-full">
              <Image
                src="https://picsum.photos/seed/map-geofence/1200/800"
                alt="Map with geofenced areas"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="satellite map himalayas"
              />
              {/* Zone Overlays */}
              <div
                className={`absolute top-1/4 left-1/4 h-1/2 w-1/2 rounded-full cursor-pointer transition-all hover:scale-105 ${zones.ilp.color} ${selectedItem?.name === zones.ilp.name ? 'ring-4 ring-red-500' : ''}`}
                onClick={() => setSelectedItem(zones.ilp)}
              />
              <div
                className={`absolute top-10 right-10 h-1/3 w-1/3 rounded-lg cursor-pointer transition-all hover:scale-105 ${zones.pap.color} ${selectedItem?.name === zones.pap.name ? 'ring-4 ring-yellow-500' : ''}`}
                onClick={() => setSelectedItem(zones.pap)}
              />

              {/* Checkpoints */}
               {checkpoints.map((cp, i) => (
                <div key={cp.name} 
                  className={`absolute cursor-pointer p-1 rounded-full bg-background/80 backdrop-blur-sm hover:scale-110 transition-transform ${selectedItem?.name === cp.name ? 'ring-2 ring-primary' : ''}`}
                  style={{ top: `${20 + i*15}%`, left: `${15 + i*20}%` }}
                  onClick={() => setSelectedItem(cp)}>
                  <MapPin className="h-6 w-6 text-primary fill-primary/50" />
                </div>
              ))}
              
              {/* User Location Marker */}
              {userLocation && (
                <div 
                    className="absolute p-1 rounded-full bg-blue-500 ring-4 ring-white animate-fade-in"
                    style={{ 
                        top: `calc(${userLocation.lat % 1 * 80 + 10}%)`, 
                        left: `calc(${userLocation.lon % 1 * 80 + 10}%)`
                    }}
                >
                    <div className="h-3 w-3 rounded-full bg-white"/>
                </div>
              )}

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
