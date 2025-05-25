// src/components/layout/top-horizontal-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  LayoutGrid,
  MapIcon as MapIconNav,
  Search,
  QrCode,
  Info,
  ChevronDown,
  UtensilsCrossed,
  BedDouble,
  Beer,
  Coffee,
  ShoppingBag,
  Landmark as AttractionIconNav,
  Trees,
  TicketPercent,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/utils';

const mainNavLinks = [
  { href: '/', label: 'Início', Icon: Home },
  { href: '/map', label: 'Mapa', Icon: MapIconNav },
  { href: '/search', label: 'Buscar', Icon: Search },
  { href: '/scan-offer', label: 'Escanear', Icon: QrCode },
  { href: '/institutional', label: 'Info', Icon: Info },
];

const categoriesForMenu = [
  { name: 'Restaurantes', slug: slugify('Restaurante'), Icon: UtensilsCrossed },
  { name: 'Hospedagem', slug: slugify('Hotel'), Icon: BedDouble },
  { name: 'Bares', slug: slugify('Bar'), Icon: Beer },
  { name: 'Cafés', slug: slugify('Café'), Icon: Coffee },
  { name: 'Lojas', slug: slugify('Comércio'), Icon: ShoppingBag },
  { name: 'Lazer', slug: slugify('Atração'), Icon: AttractionIconNav },
  { name: 'Parques', slug: slugify('Parque'), Icon: Trees },
];

export function TopHorizontalNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-16 z-30 h-12 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="w-full max-w-sm mx-auto h-full px-2 flex items-center justify-between overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {mainNavLinks.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "h-auto px-1.5 py-1 text-xs flex-col items-center justify-center text-center text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground data-[active=true]:text-primary data-[active=true]:bg-primary/10",
              pathname === link.href && "text-primary bg-primary/10 font-semibold"
            )}
            data-active={pathname === link.href}
          >
            <Link href={link.href} className="flex flex-col items-center p-1">
              <link.Icon className="h-4 w-4 mb-0.5" />
              <span className="text-[10px] leading-tight whitespace-nowrap">{link.label}</span>
            </Link>
          </Button>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-auto px-1.5 py-1 text-xs flex-col items-center justify-center text-center text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground",
                pathname.startsWith('/services') && "text-primary bg-primary/10 font-semibold"
              )}
            >
              <div className="flex flex-col items-center p-1">
                <TicketPercent className="h-4 w-4 mb-0.5" />
                <span className="text-[10px] leading-tight whitespace-nowrap flex items-center">
                  Parceiros <ChevronDown className="h-3 w-3 ml-0.5" />
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="bg-popover text-popover-foreground">
            {categoriesForMenu.map(category => (
              <DropdownMenuItem key={category.slug} asChild>
                <Link href={`/services/${category.slug}`} className="flex items-center cursor-pointer text-xs">
                  <category.Icon className="mr-2 h-3.5 w-3.5" />
                  {category.name}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/services" className="flex items-center cursor-pointer text-xs">
                <LayoutGrid className="mr-2 h-3.5 w-3.5" />
                Ver Todas as Categorias
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
