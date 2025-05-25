
// src/components/deal/deal-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Deal, GramadoBusiness } from '@/services/gramado-businesses';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BusinessTypeIcon } from '@/components/icons';
import { ArrowRight, Star, Tag, XCircle } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  business?: GramadoBusiness;
  isRedeemed?: boolean;
  canAccess?: boolean;
}

export function DealCard({ deal, business, isRedeemed = false, canAccess = true }: DealCardProps) {
  const businessName = business?.name || "Parceiro Guia Mais";
  const businessImage = business?.imageUrl || "https://placehold.co/300x200.png"; // Generic placeholder
  const businessTypeIcon = business?.icon;

  const cardClasses = `flex h-full flex-col overflow-hidden shadow-md transition-all duration-300 ease-in-out ${isRedeemed ? 'opacity-60' : 'hover:scale-105 hover:shadow-xl'} ${!canAccess && !isRedeemed ? 'opacity-70 bg-muted/50' : ''}`;

  return (
    <Card className={cardClasses}>
      {business && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={businessImage}
            alt={`Imagem de ${businessName}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={business?.type ? `${business.type} offer` : "deal offer"}
          />
          <div className="absolute right-2 top-2 flex flex-col items-end gap-1.5">
            {deal.isVipOffer && (
                <Badge variant="default" className="bg-purple-600 hover:bg-purple-700 text-purple-50 shadow-md text-xs px-2 py-0.5">
                    <Star className="mr-1 h-3 w-3 fill-yellow-300 text-yellow-300" /> VIP
                </Badge>
            )}
            {deal.discountPercentage && deal.discountPercentage > 0 && (
              <Badge
                variant="default"
                className="bg-primary text-primary-foreground shadow-md text-xs px-2 py-0.5"
              >
                {deal.discountPercentage}% OFF
              </Badge>
            )}
            {deal.isPay1Get2 && (
                <Badge
                 variant="destructive"
                 className="bg-accent text-accent-foreground shadow-md text-xs px-2 py-0.5"
                >
                    Pague 1 Leve 2
                </Badge>
            )}
          </div>
        </div>
      )}
      <CardHeader className="space-y-1 p-6 pb-2 pt-3">
        <CardTitle className="text-primary text-lg">{deal.title}</CardTitle>
        {business && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{business.name}</span>
                {businessTypeIcon && <BusinessTypeIcon type={businessTypeIcon} className="h-4 w-4" />}
            </div>
        )}
        <CardDescription className="text-sm text-foreground/80 line-clamp-2 pt-1">{deal.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-3 p-6">
        <p className="text-xs text-muted-foreground line-clamp-3">{deal.termsAndConditions}</p>
        {isRedeemed && (
            <p className="mt-2 text-sm font-semibold text-destructive flex items-center">
                <XCircle className="mr-1.5 h-4 w-4"/> Você já utilizou esta oferta.
            </p>
        )}
         {!canAccess && !isRedeemed && deal.isVipOffer && (
            <p className="mt-2 text-sm font-semibold text-purple-700">
                Oferta exclusiva para membros VIP.
            </p>
        )}
      </CardContent>
      <CardFooter className="pt-0 p-6">
        <Button
            asChild
            variant="default"
            className={`w-full h-10 px-4 py-2 text-sm ${!canAccess || isRedeemed ? 'bg-muted hover:bg-muted text-muted-foreground cursor-not-allowed' : 'bg-accent hover:bg-accent/90 text-accent-foreground'}`}
            disabled={!canAccess || isRedeemed}
        >
          <Link href={canAccess && !isRedeemed ? `/checkout/${deal.businessId}?dealId=${deal.id}` : '#'}>
            <span className="flex items-center justify-center w-full">
              <Tag className="mr-2 h-4 w-4" />
              {isRedeemed ? "Oferta Utilizada" : (canAccess ? "Ver Oferta" : "Requer Acesso VIP")}
              {canAccess && !isRedeemed && <ArrowRight className="ml-2 h-4 w-4" />}
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
