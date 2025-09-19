
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Map, MapPin, LocateFixed, HelpCircle, Loader2 } from 'lucide-react';
import { GoogleMapComponent } from '@/components/google-map';
import { useAuth } from '@/contexts/auth-context';
import { checkGeofence } from '@/ai/flows/check-geofence';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const zones = [
  {
    name: 'Inner Line Permit (ILP) Zone',
    color: '#DB4437', // Red
    description: 'Requires an Inner Line Permit for all domestic tourists. This is common in states like Arunachal Pradesh, Nagaland, Mizoram, and Manipur.',
    // Polygon paths for a rough area in the Himalayas
    paths: [
      { lat: 28.0, lng: 86.0 },
      { lat: 27.5, lng: 85.0 },
      { lat: 27.0, lng: 86.5 },
      { lat: 27.8, lng: 88.0 },
      { lat: 28.5, lng: 89.0 },
    ],
    center: { lat: 27.7, lng: 86.8 },
  },
  {
    name: 'Protected Area Permit (PAP) Zone',
    color: '#F4B400', // Yellow
    description: 'Requires a Protected Area Permit, typically for foreign nationals, to enter certain areas, often near international borders.',
    // Polygon paths for another rough area
    paths: [
      { lat: 28.6, lng: 89.2 },
      { lat: 28.2, lng: 89.0 },
      { lat: 28.3, lng: 90.0 },
      { lat: 28.8, lng: 90.2 },
    ],
    center: { lat: 28.4, lng: 89.6 },
  },
];

const checkpoints = [
  { name: 'Rangpo Check Post', type: 'Entry/Exit for Sikkim', lat: 27.1706, lng: 88.5303 },
  { name: 'Tawang Entry Point', type: 'Entry for Arunachal Pradesh', lat: 27.5857, lng: 91.8700 },
  { name: 'Nathula Pass Gate', type: 'Border Crossing', lat: 27.3858, lng: 88.8314 },
];


export default function GeoGuardPage() {
  const { location } = useAuth();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const [isCheckingZone, setIsCheckingZone] = useState(false);
  const [zoneCheckResult, setZoneCheckResult] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const { toast } = useToast();

  const handleFindLocation = () => {
    setIsFindingLocation(true);
    setZoneCheckResult(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Simulate coordinates within a known restricted zone for demonstration
        const simulatedLocation = { lat: 27.7172, lng: 85.3240 }; 
        setUserLocation(simulatedLocation);
        setMapCenter(simulatedLocation);
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
      const result = await checkGeofence({ latitude: userLocation.lat, longitude: userLocation.lng });
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

  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    if(item.center) {
        setMapCenter(item.center);
    } else if (item.lat && item.lng) {
        setMapCenter({lat: item.lat, lng: item.lng});
    }
  }

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
                  <div className={`p-4 rounded-lg border-2`} style={{ backgroundColor: `${selectedItem.color}30`, borderColor: selectedItem.color }}>
                     <p className="font-semibold">{selectedItem.description}</p>
                  </div>
                   {selectedItem.type && (
                     <p><span className="font-semibold">Type:</span> {selectedItem.type}</p>
                   )}
                </div>
              ) : (
                <div className="space-y-3">
                  {zones.map(zone => (
                    <div key={zone.name} className="flex items-center gap-3 cursor-pointer" onClick={() => handleItemSelect(zone)}>
                      <div className={`h-5 w-5 rounded-sm border`} style={{ backgroundColor: `${zone.color}80`, borderColor: zone.color }}/>
                      <span className="text-sm font-medium">{zone.name}</span>
                    </div>
                  ))}
                  <hr className="my-2"/>
                  <h3 className="font-semibold text-sm pt-2">Checkpoints</h3>
                   <div className="space-y-2">
                    {checkpoints.map(cp => (
                        <div key={cp.name} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer" onClick={() => handleItemSelect(cp)}>
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
            <GoogleMapComponent 
              zones={zones} 
              checkpoints={checkpoints}
              userLocation={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null}
              onZoneClick={handleItemSelect}
              onCheckpointClick={handleItemSelect}
              center={mapCenter}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
