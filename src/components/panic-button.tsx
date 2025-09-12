'use client';

import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';

export function PanicButton() {
  const { toast } = useToast();

  const handlePanic = () => {
    toast({
      title: 'Emergency Alert Sent',
      description: 'Your live location has been shared with local authorities and emergency contacts.',
      variant: 'destructive',
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-2xl animate-pulse bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <ShieldAlert className="h-8 w-8" />
          <span className="sr-only">Panic Button</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Activate Panic Button?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately send your live location to local authorities and your emergency contacts. Only activate in a genuine
            emergency.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handlePanic} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Activate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
