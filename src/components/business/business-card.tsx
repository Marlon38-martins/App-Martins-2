import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GramadoBusiness } from '@/services/gramado-businesses';
import { BusinessTypeIcon } from '@/components/icons';
import { ArrowRight } from 'lucide-react';

interface BusinessCardProps {
  business: GramadoBusiness;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
      <CardHeader className="pb-2">
        <div className="relative mb-2 aspect-[16/9] w-full overflow-hidden rounded-md">
          <Image
            src={business.imageUrl}
            alt={`Imagem de ${business.name}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={`${business.type} building`}
          />
        </div>
        <div className="flex items-center justify-between">
           <CardTitle className="text-lg font-semibold">{business.name}</CardTitle>
           {business.icon && <BusinessTypeIcon type={business.icon} className="h-5 w-5 text-muted-foreground" />}
        </div>
        <CardDescription className="text-sm text-muted-foreground">{business.type}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-2 pt-0">
        <p className="text-sm text-foreground/80 line-clamp-3">{business.shortDescription}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/business/${business.id}`}>
            Ver Detalhes e Ofertas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
