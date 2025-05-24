
// src/components/layout/quick-nav.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
    UtensilsCrossed, BedDouble, Beer, Coffee, ShoppingBag, Landmark as AttractionIcon, MapIcon, TicketPercent
} from 'lucide-react';
import { slugify } from '@/lib/utils';

const quickNavCategories = [
  { name: 'Restaurantes', slug: slugify('Restaurante'), Icon: UtensilsCrossed },
  { name: 'Hospedagem', slug: slugify('Hotel'), Icon: BedDouble },
  { name: 'Bares', slug: slugify('Bar'), Icon: Beer },
  { name: 'Cafés', slug: slugify('Café'), Icon: Coffee },
  { name: 'Lojas', slug: slugify('Comércio'), Icon: ShoppingBag },
  { name: 'Lazer', slug: slugify('Atração'), Icon: AttractionIcon },
  { name: 'Ofertas', slug: '/services', Icon: TicketPercent }, // Link to all services/deals page
  { name: 'Mapa', slug: 'map', Icon: MapIcon },
];

export function QuickNav() {
  return (
    <section className="py-2 px-1 bg-background/95 border-b border-border sticky top-16 z-30 md:hidden backdrop-blur-sm">
      {/* top-16 assumes header height is h-16 (64px) */}
      <div className="w-full max-w-sm mx-auto"> {/* Ensures content aligns with main page constraint */}
        <div className="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {quickNavCategories.map((category) => (
            <Link
              key={category.slug}
              href={category.slug === 'map' ? '/map' : (category.slug === '/services' ? '/services' : `/services/${category.slug}`)}
              className="shrink-0 w-24" // Increased width
            >
              <Card className="group h-24 flex flex-col hover:bg-accent/10 transition-colors duration-200 shadow-sm border-transparent hover:border-primary/50"> {/* Increased height and made flex col */}
                <CardContent className="flex-grow flex flex-col items-center justify-center p-2 text-center"> {/* Adjusted padding and flex properties for centering */}
                  <category.Icon className="h-6 w-6 mb-1 text-primary group-hover:text-accent transition-colors" />
                  <p className="text-xs font-medium text-foreground group-hover:text-accent transition-colors leading-tight">
                    {category.name}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

