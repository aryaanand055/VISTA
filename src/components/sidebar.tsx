
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Map, User, Users, BotMessageSquare, Newspaper, Home, ShoppingBag, Mountain, Bell, LifeBuoy, Settings, LogOut, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/itinerary', icon: Map, label: 'Itinerary' },
  { href: '/digital-id', icon: User, label: 'Digital ID' },
  { href: '/community', icon: Mountain, label: 'Community' },
  { href: '/places', icon: ShoppingBag, label: 'Places' },
  { href: '/news', icon: Newspaper, label: 'News & Alerts' },
  { href: '/tracking', icon: Users, label: 'Family Tracking' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r bg-card p-4 sm:flex">
      <div className="mb-8 flex items-center gap-2">
        <BotMessageSquare className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl font-semibold text-foreground">Safe Passage</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-secondary hover:text-primary',
              pathname.startsWith(item.href) && 'bg-primary/10 text-primary'
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer for Profile and Notifications */}
      <div className="mt-auto flex flex-col gap-2">
        {user ? (
          <>
            <Button variant="ghost" className="justify-start gap-3 px-3">
              <Bell className="h-4 w-4" />
              <span className="font-medium">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className="h-auto justify-start gap-3 px-3 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/person1/100/100"} alt={user?.displayName || 'User'} />
                      <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{user?.displayName}</p>
                    </div>
                    <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="mb-2 w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /><span>Settings</span></DropdownMenuItem>
                <DropdownMenuItem><LifeBuoy className="mr-2 h-4 w-4" /><span>Support</span></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /><span>Logout</span></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="space-y-2">
             <Link href="/login" className="w-full">
              <Button className="w-full">Login</Button>
             </Link>
             <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full">Sign Up</Button>
             </Link>
          </div>
        )}
      </div>
    </aside>
    );
}
