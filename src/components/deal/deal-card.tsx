// src/components/deal/deal-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Deal, GramadoBusiness } from '@/services/gramado-businesses';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BusinessTypeIcon } from '@/components/icons';
import { ArrowRight, Tag } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  business?: GramadoBusiness; // Business can be optional if deal info is self-contained enough
}

export function DealCard({ deal, business }: DealCardProps) {
  const businessName = business?.name || "Parceiro Martins Prime";
  const businessImage = business?.imageUrl || "https://picsum.photos/seed/deal-placeholder/300/200";
  const businessTypeIcon = business?.icon;

  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
      {business && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={businessImage}
            alt={`Imagem de ${businessName}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={business?.type ? `${business.type} offer` : "deal offer"}
          />
           {deal.discountPercentage > 0 && (
            <Badge
              variant="destructive"
              className="absolute right-2 top-2 bg-accent text-accent-foreground shadow-md"
            >
              {deal.discountPercentage}% OFF
            </Badge>
          )}
        </div>
      )}
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-lg font-semibold text-primary">{deal.title}</CardTitle>
        {business && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{business.name}</span>
                {businessTypeIcon && <BusinessTypeIcon type={businessTypeIcon} className="h-4 w-4" />}
            </div>
        )}
        <CardDescription className="text-sm text-foreground/80 line-clamp-2 pt-1">{deal.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-3 pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2">{deal.termsAndConditions}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/business/${deal.businessId}`}>
            <Tag className="mr-2 h-4 w-4" />
            Ver Detalhes da Oferta
            <ArrowRight className="ml-auto h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
