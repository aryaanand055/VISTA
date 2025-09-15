'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, User, LayoutDashboard, Map, Users, BotMessageSquare, Bell, Newspaper, Home, ShoppingBag, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { navItems } from './sidebar';


export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/80 px-4 backdrop-blur-sm md:hidden">
      <nav className="flex-1">
        {/* Mobile sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <div className="mb-8 flex items-center gap-2">
              <BotMessageSquare className="h-8 w-8 text-primary" />
              <h1 className="font-headline text-2xl font-semibold text-foreground">Safe Passage</h1>
            </div>
            <nav className="grid gap-2 text-lg font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    pathname === item.href &amp;&amp; 'bg-muted text-primary'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>

      <div className="flex items-center gap-4">
         {/* This space is intentionally left for alignment with the sidebar button */}
      </div>
    </header>
  );
}
