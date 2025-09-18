
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { AlertTriangle, MapPin } from 'lucide-react';
import Image from 'next/image';

const restrictedZones = {
    'Darjeeling, India': [
        {
            name: 'Singalila National Park (Inner Areas)',
            type: 'Protected Area (PAP)',
            reason: 'Requires special permits for entry to protect fragile ecosystems and wildlife. Only accessible with registered guides.',
        },
        {
            name: 'Tsomgo Lake & Nathula Pass (Requires Permit from Gangtok)',
            type: 'Restricted Zone (ILP for certain nationalities)',
            reason: 'Located near the Indo-China border. Requires Inner Line Permit (ILP) for all tourists, arranged in Gangtok, Sikkim.',
        },
    ],
    'default': [
        {
            name: 'Example Restricted Military Zone',
            type: 'Military Area',
            reason: 'Access is strictly prohibited for civilians without authorization due to national security.',
        },
        {
            name: 'Example National Park Core Area',
            type: 'Protected Area (PAP)',
            reason: 'Entry is restricted to park officials and researchers to preserve wildlife habitats.',
        }
    ]
}


export default function GeofencingPage() {
  const { location } = useAuth();
  const zones = restrictedZones[location as keyof typeof restrictedZones] || restrictedZones.default;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Geo-fencing Alerts</h1>
        <p className="text-muted-foreground">View restricted and sensitive zones in {location}.</p>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="relative w-full h-96 rounded-lg overflow-hidden border shadow-lg">
            <Image
                src="https://picsum.photos/seed/map-geofence/1200/800"
                alt="Map with geofenced areas"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="satellite map himalayas"
            />
            {/* Conceptual Overlay */}
            <div 
                className="absolute top-1/4 left-1/4 h-1/2 w-1/2 bg-red-500/30 rounded-full animate-pulse"
                style={{ animationDuration: '3s' }}
            />
            <div className="absolute top-1/3 left-1/2 h-1/3 w-1/3 bg-red-500/30 rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
             <div className="absolute bottom-4 left-4 rounded-lg bg-background/80 p-3 backdrop-blur-sm">
                <h3 className="font-bold text-lg">Restricted Zones</h3>
                <p className="text-sm text-muted-foreground">Red areas indicate permit-required or no-go zones.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Nearby Restricted Areas</CardTitle>
            <CardDescription>Real-time alerts will trigger if you approach these zones.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {zones.map((zone, index) => (
                <div key={index} className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <AlertTriangle className="h-6 w-6 text-destructive mt-1 flex-shrink-0"/>
                    <div>
                        <h3 className="font-semibold text-destructive-foreground/90">{zone.name}</h3>
                        <p className="text-sm font-bold text-destructive/80">{zone.type}</p>
                        <p className="text-sm text-destructive-foreground/80 mt-1">{zone.reason}</p>
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>

    </div>
  );
}
