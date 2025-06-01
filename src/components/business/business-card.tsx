
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GramadoBusiness } from '@/services/gramado-businesses';
import { BusinessTypeIcon } from '@/components/icons';
import { ArrowRight, Star } from 'lucide-react';
import { slugify } from '@/lib/utils';

interface BusinessCardProps {
  business: GramadoBusiness;
}

const renderStars = (rating?: number) => {
  if (typeof rating !== 'number') return null;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
  }
  if (halfStar) {
    stars.push(<Star key="half" className="h-4 w-4 text-yellow-400 fill-yellow-200" />);
  }
  for (let i = 0; i < (5 - fullStars - (halfStar ? 1 : 0)); i++) {
    stars.push(<Star key={`empty-${i}-card`} className="h-4 w-4 text-muted-foreground/50" />);
  }
  return <div className="flex items-center">{stars}</div>;
};


export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:shadow-xl group">
      <CardHeader className="space-y-1.5 p-4">
        <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-md">
          <Image
            src={business.imageUrl}
            alt={`Imagem de ${business.name}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={`${business.type} exterior`}
          />
        </div>
        <div className="flex items-center justify-between">
           <CardTitle className="text-xl">{business.name}</CardTitle>
           {business.icon && <BusinessTypeIcon type={business.icon} className="h-5 w-5 text-muted-foreground" />}
        </div>
        <CardDescription className="text-sm">{business.type}</CardDescription>
         {business.rating !== undefined && business.reviewCount !== undefined && (
          <div className="flex items-center space-x-1 pt-1">
            {renderStars(business.rating)}
            <span className="text-xs text-muted-foreground">({business.reviewCount})</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-sm text-foreground/80 line-clamp-3">{business.shortDescription}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90 h-9 px-3 py-1.5 text-sm">
          <Link href={`/guiamais/${slugify(business.name)}`}>
            <span className="flex items-center justify-center w-full">
              Ver Detalhes
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
