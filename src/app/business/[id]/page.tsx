'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getGramadoBusinessById, getDealsForBusiness, type GramadoBusiness, type Deal } from '@/services/gramado-businesses';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BusinessTypeIcon } from '@/components/icons';
import { MapPin, Phone, Globe, ArrowLeft, TicketPercent, Frown, CreditCard, ShoppingBag as ShoppingBagIcon, BedDouble as BedIcon, UtensilsCrossed as RestaurantIcon } from 'lucide-react';

interface BusinessPageParams {
  id: string;
}

const getButtonTextAndIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('hotel') || lowerType.includes('pousada')) {
    return { text: 'Fazer Reserva Agora', Icon: BedIcon };
  }
  if (lowerType.includes('restaurante') || lowerType.includes('café')) {
    return { text: 'Fazer Pedido / Reservar Mesa', Icon: RestaurantIcon };
  }
  if (lowerType.includes('loja') || lowerType.includes('artesanato')) {
    return { text: 'Comprar / Ver Produtos', Icon: ShoppingBagIcon };
  }
  return { text: 'Solicitar Serviço', Icon: CreditCard };
};


export default function BusinessPage({ params }: { params: BusinessPageParams }) {
  const { id } = params;
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadBusinessData() {
      setIsLoading(true);
      setError(null);
      try {
        const businessData = await getGramadoBusinessById(id as string);
        if (businessData) {
          setBusiness(businessData);
          const dealsData = await getDealsForBusiness(id as string);
          setDeals(dealsData);
        } else {
          setError('Estabelecimento não encontrado.');
        }
      } catch (err) {
        setError('Falha ao carregar dados do estabelecimento. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBusinessData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6">
        <Skeleton className="mb-4 h-10 w-32" /> {/* Back button skeleton */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <Skeleton className="mb-4 h-72 w-full rounded-lg md:h-96" /> {/* Image skeleton */}
            <Skeleton className="mb-2 h-8 w-3/4" /> {/* Name skeleton */}
            <Skeleton className="mb-4 h-6 w-1/2" /> {/* Type skeleton */}
          </div>
          <div>
            <Skeleton className="mb-4 h-8 w-1/3" /> {/* Deals title skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
             <Skeleton className="mt-8 h-28 w-full rounded-lg" /> {/* Checkout section skeleton */}
          </div>
        </div>
        <Skeleton className="mt-8 h-24 w-full" /> {/* Description skeleton */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-150px)] flex-col items-center justify-center px-4 py-8 md:px-6">
        <Alert variant="destructive" className="w-full max-w-md">
          <Frown className="h-5 w-5" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Home
          </Link>
        </Button>
      </div>
    );
  }

  if (!business) {
     return (
      <div className="container mx-auto flex min-h-[calc(100vh-150px)] flex-col items-center justify-center px-4 py-8 md:px-6">
        <Frown className="mb-4 h-20 w-20 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-semibold">Estabelecimento não encontrado</h2>
        <p className="mb-6 text-muted-foreground">O estabelecimento que você procura pode não existir ou foi removido.</p>
        <Button asChild variant="default">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Home
          </Link>
        </Button>
      </div>
    );
  }
  
  const { text: checkoutButtonText, Icon: CheckoutButtonIcon } = getButtonTextAndIcon(business.type);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Serviços
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card className="overflow-hidden shadow-xl">
            <div className="relative aspect-video w-full">
              <Image
                src={business.imageUrl}
                alt={`Imagem de ${business.name}`}
                layout="fill"
                objectFit="cover"
                data-ai-hint={`${business.type} scenic view`}
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold text-primary">{business.name}</CardTitle>
                {business.icon && <BusinessTypeIcon type={business.icon} className="h-8 w-8 text-primary" />}
              </div>
              <CardDescription className="text-lg text-muted-foreground">{business.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-foreground/90">{business.fullDescription}</p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="mr-3 mt-1 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-foreground/80">{business.address}</span>
                </div>
                {business.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="mr-3 h-5 w-5 shrink-0 text-accent" />
                    <a href={`tel:${business.phoneNumber}`} className="text-foreground/80 hover:text-primary hover:underline">
                      {business.phoneNumber}
                    </a>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center">
                    <Globe className="mr-3 h-5 w-5 shrink-0 text-accent" />
                    <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary hover:underline">
                      {business.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {/* Deals Section */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center text-2xl font-semibold text-primary">
              <TicketPercent className="mr-2 h-7 w-7 text-accent" />
              Ofertas Exclusivas
            </h3>
            {deals.length > 0 ? (
              <div className="space-y-4">
                {deals.map(deal => (
                  <Card key={deal.id} className="bg-card shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-accent">{deal.description}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {deal.discountPercentage > 0 && (
                        <Badge variant="default" className="mb-2 bg-accent text-accent-foreground">
                          {deal.discountPercentage}% OFF
                        </Badge>
                      )}
                      <p className="text-sm text-muted-foreground">{deal.termsAndConditions}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed bg-muted/50 p-6 text-center shadow-none">
                <TicketPercent className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhuma oferta especial disponível no momento para este estabelecimento.</p>
              </Card>
            )}
          </div>

          {/* Checkout/Booking Section */}
          <Card className="bg-card shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-primary">
                <CheckoutButtonIcon className="mr-2 h-7 w-7 text-accent" />
                {business.type.includes('Hotel') || business.type.includes('Pousada') ? 'Reservas' : 
                 business.type.includes('Restaurante') || business.type.includes('Café') ? 'Pedidos e Reservas' :
                 business.type.includes('Loja') ? 'Compras' :
                 'Contratar Serviço'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Pronto para aproveitar o que {business.name} tem a oferecer?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-foreground/80">
                Clique no botão abaixo para prosseguir com sua solicitação ou compra de forma rápida e segura.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90">
                <Link href={`/checkout/${business.id}`}>
                  <CheckoutButtonIcon className="mr-2 h-5 w-5" />
                  {checkoutButtonText}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
