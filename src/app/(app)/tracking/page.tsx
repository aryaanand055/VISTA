'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

const familyMembers = [
  { name: 'Jane Doe', relation: 'Spouse', avatar: 'https://picsum.photos/seed/person2/100/100', hint: 'woman portrait', status: 'Near Eiffel Tower', online: true },
  { name: 'Sam Doe', relation: 'Son', avatar: 'https://picsum.photos/seed/person3/100/100', hint: 'boy portrait', status: 'At The Louvre', online: true },
  { name: 'Emily Doe', relation: 'Daughter', avatar: 'https://picsum.photos/seed/person4/100/100', hint: 'girl portrait', status: 'Offline', online: false },
];

export default function TrackingPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Family Tracking</h1>
          <p className="text-muted-foreground">Share your location and see where your family is.</p>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border bg-card p-3">
          <Switch id="share-location" defaultChecked />
          <Label htmlFor="share-location" className="font-medium">
            Share My Location
          </Label>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="relative lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="https://picsum.photos/seed/105/1200/800"
                  alt="Map of Paris"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                  data-ai-hint="city map"
                />
                {/* Mock pins */}
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="h-8 w-8 text-primary drop-shadow-md" fill="currentColor" />
                  <span className="relative -right-6 -top-9 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                  </span>
                  <div className="mt-1 -ml-4 rounded-md bg-card p-2 text-center shadow-lg">
                    <p className="text-sm font-semibold">You</p>
                  </div>
                </div>
                <div className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="h-6 w-6 text-[hsl(var(--chart-1))] drop-shadow-md" fill="currentColor" />
                  <div className="mt-1 -ml-4 rounded-md bg-card p-1 text-center shadow-lg">
                    <p className="text-xs font-semibold">Jane</p>
                  </div>
                </div>
                <div className="absolute top-[60%] left-[65%] -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="h-6 w-6 text-[hsl(var(--chart-3))] drop-shadow-md" fill="currentColor" />
                  <div className="mt-1 -ml-4 rounded-md bg-card p-1 text-center shadow-lg">
                    <p className="text-xs font-semibold">Sam</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Family Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {familyMembers.map((member) => (
              <div key={member.name} className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint} />
                    <AvatarFallback>
                      {member.name.charAt(0)}
                      {member.name.split(' ')[1]?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {member.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-[hsl(var(--chart-2))]" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{member.name}</p>
                  <p className={`text-sm ${member.online ? 'text-muted-foreground' : 'text-destructive'}`}>{member.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
