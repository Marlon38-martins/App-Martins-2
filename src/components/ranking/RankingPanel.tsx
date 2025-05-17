// src/components/ranking/RankingPanel.tsx
'use client';

import type { GramadoBusiness } from '@/services/gramado-businesses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Star, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface RankingPanelProps {
  rankedBusinessesByCategory: Record<string, GramadoBusiness[]>;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
  }
  if (halfStar) {
    stars.push(<Star key="half" className="h-4 w-4 text-yellow-400 fill-yellow-200" />); // Or a half-star icon
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground/50" />);
  }
  return <div className="flex items-center">{stars}</div>;
};

export function RankingPanel({ rankedBusinessesByCategory }: RankingPanelProps) {
  const categories = Object.keys(rankedBusinessesByCategory);

  if (categories.length === 0) {
    return (
        <div className="text-center py-8 text-muted-foreground">
            <p>Ainda não há estabelecimentos suficientes para exibir um ranking.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map(category => (
        <Card key={category} className="shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Top {category}s</CardTitle>
            <CardDescription>Melhores avaliados pelos nossos usuários.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-4">
              {rankedBusinessesByCategory[category].map((business, index) => (
                <li key={business.id} className={`border-b pb-3 last:border-b-0 last:pb-0 ${index > 1 ? 'hidden sm:block' : 'block'}`}> {/* Show top 2 always, rest on sm+ */}
                  <Link href={`/business/${business.id}`} className="group block rounded-md p-2 transition-colors hover:bg-card/80">
                    <div className="flex items-start space-x-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={business.imageUrl}
                          alt={business.name}
                          layout="fill"
                          objectFit="cover"
                          data-ai-hint={`${business.type} building interior`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-accent">{business.name}</h4>
                        <div className="mb-1 flex items-center space-x-1 text-sm">
                          {renderStars(business.rating ?? 0)}
                          <span className="text-xs text-muted-foreground">({business.reviewCount} {business.reviewCount === 1 ? 'avaliação' : 'avaliações'})</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{business.type}</Badge>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
