
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
  canAccess?: boolean; // Explicitly control if the user can access this deal (e.g., for VIP offers)
}

export function DealCard({ deal, business, isRedeemed = false, canAccess = true }: DealCardProps) {
  const businessName = business?.name || "Parceiro Guia Mais";
  const businessImage = business?.imageUrl || "https://placehold.co/300x200.png"; 
  const businessTypeIcon = business?.icon;

  const isEffectivelyDisabled = isRedeemed || !canAccess;

  const cardClasses = `flex h-full flex-col overflow-hidden shadow-md transition-all duration-300 ease-in-out ${isEffectivelyDisabled ? 'opacity-60 bg-muted/30' : 'hover:scale-105 hover:shadow-xl group'}`;
  
  let buttonText = "Ver Oferta";
  let buttonLink = `/checkout/${deal.businessId}?dealId=${deal.id}`;
  let buttonVariant: "default" | "secondary" = "default";

  if (isRedeemed) {
    buttonText = "Oferta Utilizada";
  } else if (!canAccess && deal.isVipOffer) {
    buttonText = "Exclusivo VIP - Assine Já!";
    buttonLink = "/join";
    buttonVariant = "secondary";
  } else if (!canAccess) {
    // Generic case for other non-accessible reasons, though less common now
    buttonText = "Acesso Restrito"; 
  }


  return (
    <Card className={cardClasses}>
      {business && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={businessImage}
            alt={`Imagem de ${businessName}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={business?.type ? `${business.type} deal` : "special deal"}
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
      <CardHeader className="space-y-1 p-4 pb-2 pt-3">
        <CardTitle className="text-lg text-primary">{deal.title}</CardTitle>
        {business && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{business.name}</span>
                {businessTypeIcon && <BusinessTypeIcon type={businessTypeIcon} className="h-3.5 w-3.5" />}
            </div>
        )}
        <CardDescription className="text-xs text-foreground/80 line-clamp-2 pt-0.5">{deal.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-2 p-4">
        <p className="text-xs text-muted-foreground line-clamp-2">{deal.termsAndConditions}</p>
        {isRedeemed && (
            <p className="mt-1.5 text-xs font-semibold text-destructive flex items-center">
                <XCircle className="mr-1 h-3.5 w-3.5"/> Você já utilizou esta oferta.
            </p>
        )}
      </CardContent>
      <CardFooter className="pt-0 p-4">
        <Button
            asChild
            variant={buttonVariant}
            className={`w-full h-9 px-3 py-1.5 text-xs ${isEffectivelyDisabled ? 'bg-muted hover:bg-muted text-muted-foreground cursor-not-allowed' : (buttonVariant === 'secondary' ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-accent hover:bg-accent/90 text-accent-foreground') }`}
            disabled={isEffectivelyDisabled && buttonLink === '#'}
        >
          <Link href={isEffectivelyDisabled && buttonLink !== '/join' ? '#' : buttonLink}>
            <span className="flex items-center justify-center w-full">
              <Tag className="mr-1.5 h-3.5 w-3.5" />
              {buttonText}
              {!isEffectivelyDisabled && buttonLink !== '/join' && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
