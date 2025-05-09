'use client';

import { use, useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // To get dealId from query

import { getGramadoBusinessById, getDealsForBusiness, type GramadoBusiness, type Deal, getCurrentUser, getMockUserSubscription, checkUserOfferUsage } from '@/services/gramado-businesses';
import type { User, Subscription } from '@/types/user';
import { useAuth } from '@/hooks/use-auth-client'; 

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BusinessTypeIcon } from '@/components/icons';
import { MapPin, Phone, Globe, ArrowLeft, TicketPercent, Frown, Star, Tag, UserCheck, AlertTriangle } from 'lucide-react';

interface BusinessPageParams {
  id: string;
}

// Helper to generate button text and icon based on deal type
const getDealActivationDetails = (deal: Deal, businessType: string) => {
  if (deal.isPay1Get2) {
    return { text: `Ativar ${deal.title}`, Icon: Tag, query: `?dealId=${deal.id}` };
  }
  // Fallback for general business type or other deal types
  const lowerType = businessType.toLowerCase();
  if (lowerType.includes('hotel') || lowerType.includes('pousada')) {
    return { text: 'Reservar com Benefício Prime', Icon: Tag, query: `?dealId=${deal.id}` };
  }
  if (lowerType.includes('restaurante') || lowerType.includes('café')) {
    return { text: 'Usar Benefício Prime Aqui', Icon: Tag, query: `?dealId=${deal.id}` };
  }
  return { text: 'Aproveitar Benefício Prime', Icon: Tag, query: `?dealId=${deal.id}` };
};

function BusinessPageContent({ params }: { params: BusinessPageParams }) {
  const { id } = params;
  const { user: authUser, loading: authLoading } = useAuth(); // Use client-side auth context
  
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);
  const [userRedemptions, setUserRedemptions] = useState<Record<string, boolean>>({}); // Store offerId: hasRedeemed

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

          if (authUser) { // Check subscription and redemptions only if user is logged in
            const sub = await getMockUserSubscription(authUser.uid);
            setUserSubscription(sub);
            
            const redemptions: Record<string, boolean> = {};
            for (const deal of dealsData) {
                if (deal.isPay1Get2 && deal.usageLimitPerUser === 1) { // Only check P1G2 with limit 1 for now
                    redemptions[deal.id] = await checkUserOfferUsage(authUser.uid, deal.id);
                }
            }
            setUserRedemptions(redemptions);
          }

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
  }, [id, authUser]); // Reload if authUser changes

  if (isLoading || authLoading) {
    return (
      <div> 
        <Skeleton className="mb-4 h-10 w-32" /> 
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <Skeleton className="mb-4 h-72 w-full rounded-lg md:h-96" /> 
            <Skeleton className="mb-2 h-8 w-3/4" /> 
            <Skeleton className="mb-4 h-6 w-1/2" /> 
          </div>
          <div>
            <Skeleton className="mb-4 h-8 w-1/3" /> 
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
             <Skeleton className="mt-8 h-28 w-full rounded-lg" /> 
          </div>
        </div>
        <Skeleton className="mt-8 h-24 w-full" /> 
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center"> 
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
      <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center"> 
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
  
  const canUsePrimeBenefits = authUser && userSubscription && userSubscription.status === 'active';

  return (
    <div> 
      <Button asChild variant="outline" className="mb-6">
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Parceiros
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
          <div className="mb-8">
            <h3 className="mb-4 flex items-center text-2xl font-semibold text-primary">
              <TicketPercent className="mr-2 h-7 w-7 text-accent" />
              Ofertas Martins Prime
            </h3>
            {!authUser && (
                 <Alert variant="default" className="mb-4 bg-accent/10 border-accent/30">
                    <UserCheck className="h-5 w-5 text-accent" />
                    <AlertTitle className="text-accent">Faça Login para Vantagens!</AlertTitle>
                    <AlertDescription>
                        <Link href="/login" className="font-semibold underline hover:text-accent/80">Faça login</Link> ou <Link href="/join" className="font-semibold underline hover:text-accent/80">associe-se</Link> para ver e usar os benefícios Martins Prime.
                    </AlertDescription>
                </Alert>
            )}
            {authUser && !canUsePrimeBenefits && (
                 <Alert variant="default" className="mb-4 bg-accent/10 border-accent/30">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                    <AlertTitle className="text-accent">Assinatura Prime Necessária</AlertTitle>
                    <AlertDescription>
                        Sua assinatura Martins Prime não está ativa. <Link href="/join" className="font-semibold underline hover:text-accent/80">Renove ou associe-se</Link> para aproveitar!
                    </AlertDescription>
                </Alert>
            )}

            {deals.length > 0 ? (
              <div className="space-y-4">
                {deals.map(deal => {
                  const { text: benefitButtonText, Icon: BenefitButtonIcon, query: dealQuery } = getDealActivationDetails(deal, business.type);
                  const hasRedeemedThisOffer = userRedemptions[deal.id] || false;
                  const isP1G2Limited = deal.isPay1Get2 && deal.usageLimitPerUser === 1;

                  return (
                    <Card key={deal.id} className={`bg-card shadow-lg ${hasRedeemedThisOffer && isP1G2Limited ? 'opacity-60' : ''}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-accent">{deal.title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground pt-1">{deal.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {deal.discountPercentage && deal.discountPercentage > 0 && (
                                <Badge variant="default" className="bg-primary text-primary-foreground">
                                {deal.discountPercentage}% OFF
                                </Badge>
                            )}
                            {deal.isPay1Get2 && (
                                <Badge variant="destructive" className="bg-accent text-accent-foreground">
                                Pague 1 Leve 2
                                </Badge>
                            )}
                            <Badge variant="outline">Exclusivo Prime</Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{deal.termsAndConditions}</p>
                        {isP1G2Limited && hasRedeemedThisOffer && (
                            <p className="mt-2 text-xs font-semibold text-destructive">Você já utilizou esta oferta "Pague 1 Leve 2".</p>
                        )}
                      </CardContent>
                      {canUsePrimeBenefits && (!isP1G2Limited || !hasRedeemedThisOffer) && (
                        <CardFooter>
                           <Button asChild size="default" className="w-full bg-primary hover:bg-primary/90" disabled={!canUsePrimeBenefits || (isP1G2Limited && hasRedeemedThisOffer)}>
                            <Link href={`/checkout/${business.id}${dealQuery}`}>
                              <BenefitButtonIcon className="mr-2 h-5 w-5" />
                              {benefitButtonText}
                            </Link>
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed bg-muted/50 p-6 text-center shadow-none">
                <Star className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhuma oferta Martins Prime específica divulgada para este estabelecimento no momento. Membros Prime ainda podem ter vantagens gerais!</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// This component ensures that `useSearchParams` is used within a Suspense boundary
export default function BusinessPage({ params: paramsPromise }: { params: Promise<BusinessPageParams> }) {
    const params = use(paramsPromise); // Resolve the promise for params
    return (
        <Suspense fallback={<div>Carregando detalhes do negócio...</div>}>
            <BusinessPageContent params={params} />
        </Suspense>
    );
}
