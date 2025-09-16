
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Lock } from 'lucide-react';

export function AuthOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center">
        <Lock className="h-16 w-16 text-primary" />
        <h2 className="mt-4 text-2xl font-bold">Feature Locked</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          You need to be logged in to access this feature. Please sign in or create an account to continue.
        </p>
        <Link href="/login" className="mt-6">
          <Button size="lg">Login to Continue</Button>
        </Link>
      </div>
    </div>
  );
}
