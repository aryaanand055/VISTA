
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { ShieldCheck, Calendar, Plane, Fingerprint } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function DigitalIdPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Digital Tourist ID</h1>
        <p className="text-muted-foreground">Your secure, blockchain-verified identity for a safe journey.</p>
      </header>
      <Card className="mx-auto max-w-2xl overflow-hidden shadow-lg">
        <div className="flex flex-col items-center gap-6 bg-primary/10 p-6 sm:flex-row">
          <div className="relative">
            <Image
              src="https://picsum.photos/seed/104/300/300"
              alt="QR Code"
              width={160}
              height={160}
              className="rounded-lg border-4 border-white shadow-md"
              data-ai-hint="qr code"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 p-2 text-center text-sm font-semibold opacity-0 backdrop-blur-sm transition-opacity hover:opacity-100">
              Scan for verification at hotels &amp; transport hubs
            </div>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">Tourist ID</p>
            <p className="font-mono text-lg font-semibold text-primary">A4B7-9C1D-E5F6</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-primary sm:justify-start">
              <ShieldCheck className="h-5 w-5" />
              <p className="font-semibold">Verified</p>
            </div>
          </div>
        </div>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/person1/100/100"} alt={user?.displayName || 'User'} data-ai-hint="woman portrait" />
              <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-headline text-2xl font-bold">{user?.displayName || 'Tourist'}</h2>
              <p className="text-muted-foreground">Nationality: Indian</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Trip Dates</p>
                <p className="text-muted-foreground">June 15, 2024 - June 22, 2024</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Plane className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Arrival Info</p>
                <p className="text-muted-foreground">Flight UK-725, Bagdogra (IXB)</p>
              </div>
            </div>
            <div className="col-span-1 flex items-start gap-3 sm:col-span-2">
              <Fingerprint className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Biometric Hash (Blockchain)</p>
                <p className="font-mono text-xs text-muted-foreground break-all">0x8b3g...7d5a</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
