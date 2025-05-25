
// src/components/layout/desktop-horizontal-nav.tsx
'use client';
import { useSidebar } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TicketPercent, MapIcon, Search, Info, UserPlus, Handshake, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/services', label: 'Ofertas', Icon: TicketPercent },
  { href: '/map', label: 'Mapa', Icon: MapIcon },
  { href: '/search', label: 'Buscar', Icon: Search },
  { href: '/scan-offer', label: 'Escanear', Icon: QrCode },
  { href: '/institutional', label: 'Info', Icon: Info },
  { href: '/join', label: 'Assinar', Icon: UserPlus },
  { href: '/partner-registration', label: 'Parceiros', Icon: Handshake },
];

export function DesktopHorizontalNav() {
  const { isMobile, state } = useSidebar();

  if (isMobile || state === 'expanded') {
    return null; // Only show on desktop when sidebar is collapsed to icons
  }

  // This nav is visible only when !isMobile and sidebar state is 'collapsed'
  return (
    <nav className={cn(
      "sticky top-16 z-30 h-12 bg-background/95 backdrop-blur-sm flex items-center shadow-sm border-b",
    )}>
      <div className="flex items-center justify-end h-full space-x-1 px-4 md:px-6 w-full"> {/* Changed justify-start to justify-end and added w-full */}
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            asChild
            size="sm"
            className="text-xs px-1.5 py-1 h-auto hover:bg-accent/10 rounded-md"
          >
            <Link href={item.href} className="flex flex-col items-center justify-center p-1 text-center">
              <item.Icon className="h-4 w-4" />
              <span className="mt-0.5 text-[10px] leading-tight whitespace-nowrap">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}
