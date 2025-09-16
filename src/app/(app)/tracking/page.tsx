
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';

const allFamilyMembers = [
  { name: 'Rohan Sharma', relation: 'Spouse', lat: 27.0238, lng: 88.2636, online: true, iconUrl: 'https://picsum.photos/seed/person2/48/48' },
  { name: 'Aarav Sharma', relation: 'Son', lat: 27.0410, lng: 88.2665, online: true, iconUrl: 'https://picsum.photos/seed/person3/48/48' },
  { name: 'Ananya Sharma', relation: 'Daughter', lat: 27.0350, lng: 88.2590, online: false, iconUrl: 'https://picsum.photos/seed/person4/48/48' },
];


export default function TrackingPage() {
    const { user } = useAuth();
    const [yourPosition, setYourPosition] = useState({ lat: 27.0380, lng: 88.2620 });
    // In a real app, this would be updated via websockets or regular polling
    const [familyMembers, setFamilyMembers] = useState(allFamilyMembers);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    // This effect simulates getting the user's live location
    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setYourPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                },
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    const centerOnMember = (member: any) => {
      setSelectedMember(member);
      // The map component would ideally have a function to programmatically move the view
      // For now, selecting will highlight them in the list
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Column: Member List */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Globe/> Family Tracking</CardTitle>
                    <CardDescription>Live location of your family members.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     {/* Your location */}
                    <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/10 p-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.photoURL || 'https://picsum.photos/seed/person1/48/48'} alt="You" />
                            <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">You</p>
                            <p className="text-sm text-primary">Visible</p>
                        </div>
                    </div>
                    {/* Family members */}
                    {familyMembers.map(member => (
                        <Card 
                            key={member.name}
                            className={`cursor-pointer transition-shadow hover:shadow-md ${selectedMember?.name === member.name ? 'border-primary' : ''}`}
                            onClick={() => centerOnMember(member)}
                        >
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={member.iconUrl} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.relation}</p>
                                    </div>
                                </div>
                                {member.online ? (
                                    <div className="flex items-center gap-1 text-sm text-primary"><UserCheck size={16}/> Online</div>
                                ) : (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground"><UserX size={16}/> Offline</div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Map */}
        <div className="relative lg:col-span-2 h-[400px] lg:h-full w-full rounded-lg border shadow-lg overflow-hidden">
            <Image
                src="https://picsum.photos/seed/map-jaipur/1200/900"
                alt="Map of the area"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="street map jaipur"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
                <div className="rounded-lg bg-background/80 p-4 text-center backdrop-blur-sm">
                    <h3 className="font-bold text-lg">Live Map Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">The interactive map feature is currently under development.</p>
                </div>
            </div>
        </div>
    </div>
  );
}
