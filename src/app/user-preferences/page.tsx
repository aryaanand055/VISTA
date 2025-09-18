
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, set, update } from 'firebase/database';
import { db, auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';

const interestOptions = [
  { id: 'adventure', label: 'Adventure (Hiking, Trekking)' },
  { id: 'culture', label: 'Culture & History (Museums, Temples)' },
  { id: 'food', label: 'Food & Culinary Experiences' },
  { id: 'relaxation', label: 'Relaxation (Spas, Resorts)' },
  { id: 'shopping', label: 'Shopping & Local Markets' },
  { id: 'nature', label: 'Nature & Wildlife' },
];

export default function UserPreferencesPage() {
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [allergies, setAllergies] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { refreshUserStatus } = useAuth();

  const handleInterestChange = (interestId: string) => {
    setInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((i) => i !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast({
        variant: 'destructive',
        title: 'Destination is required',
        description: 'Please enter your primary travel destination.',
      });
      return;
    }
    setIsLoading(true);

    const user = auth.currentUser;
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to save preferences.',
      });
      router.push('/login');
      return;
    }

    try {
      const userRef = ref(db, 'users/' + user.uid);
      // Use update to avoid overwriting the entire user object if it already exists
      await update(userRef, {
        displayName: user.displayName,
        email: user.email,
        location: location,
        preferences: {
          interests,
          allergies,
        },
      });

      // Force a re-check of the user's status before navigating
      await refreshUserStatus();

      toast({
        title: 'Preferences Saved!',
        description: 'Your profile has been set up.',
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Saving Preferences',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Tell Us About Yourself</CardTitle>
          <CardDescription>
            Help us personalize your travel experience by sharing your interests and needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
             <div className="space-y-2">
              <Label htmlFor="location">Where are you traveling to?</Label>
              <Input
                id="location"
                placeholder="e.g., Darjeeling, India"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">What are your main travel interests?</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {interestOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={interests.includes(option.id)}
                      onCheckedChange={() => handleInterestChange(option.id)}
                    />
                    <Label htmlFor={option.id} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">
                Any dietary restrictions or allergies? (Optional)
              </Label>
              <Textarea
                id="allergies"
                placeholder="e.g., Peanut allergy, vegetarian"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Preferences & Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
