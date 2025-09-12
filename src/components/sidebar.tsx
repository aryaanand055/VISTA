'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, User, Users, BotMessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/itinerary', icon: Map, label: 'Itinerary' },
  { href: '/digital-id', icon: User, label: 'Digital ID' },
  { href: '/tracking', icon: Users, label: 'Family Tracking' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-card p-4 sm:flex">
      <div className="mb-8 flex items-center gap-2">
        <BotMessageSquare className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl font-semibold text-foreground">Safe Passage</h1>
      </div>
      <nav className="flex flex-col gap-2">
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
    </aside>
  );
}
