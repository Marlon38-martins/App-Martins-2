
'use client';

import { use, useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; 

import { 
    getGramadoBusinessById, 
    getDealsForBusiness, 
    type GramadoBusiness, 
    type Deal, 
    getCurrentUser, 
    getMockUserSubscription, 
    checkUserOfferUsage 
} from '@/services/gramado-businesses';
import type { User, Subscription } from '@/types/user';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BusinessTypeIcon } from '@/components/icons';
import { DealCard } from '@/components/deal/deal-card'; // Import DealCard
import { 
  MapPin, Phone, Globe, ArrowLeft, TicketPercent, Frown, Star, Tag, UserCheck, AlertTriangle,
  Instagram, Facebook, MessageCircle
} from 'lucide-react';

interface BusinessPageParams {
  id: string;
}

const getDealActivationDetails = (deal: Deal, businessType: string) => {
  if (deal.isPay1Get2) {
    return { text: `Ativar ${deal.title}`, Icon: Tag, query: `?dealId=${deal.id}` };
  }
  const lowerType = businessType.toLowerCase();
  if (lowerType.includes('hotel') || lowerType.includes('pousada')) {
    return { text: 'Reservar com Benefício Guia Mais', Icon: Tag, query: `?dealId=${deal.id}` };
  }
  if (lowerType.includes('restaurante') || lowerType.includes('café')) {
    return { text: 'Usar Benefício Guia Mais Aqui', Icon: Tag, query: `?dealId=${deal.id}` };
  }
  return { text: 'Aproveitar Benefício Guia Mais', Icon: Tag, query: `?dealId=${deal.id}` };
};

function BusinessPageContent({ params }: { params: BusinessPageParams }) {
  const { id } = params;
  
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [allDealsForBusiness, setAllDealsForBusiness] = useState<Deal[]>([]);
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);
  const [userRedemptions, setUserRedemptions] = useState<Record<string, boolean>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function loadInitialAuth() {
        const user = await getCurrentUser();
        setAuthUser(user);
        if (user) {
            const sub = await getMockUserSubscription(user.id);
            setUserSubscription(sub);
        }
        setAuthChecked(true);
    }
    loadInitialAuth();
  }, [id]);

  useEffect(() => {
    if (!id || !authChecked) return; 

    async function loadBusinessData() {
      setIsLoading(true);
      setError(null);
      try {
        const businessData = await getGramadoBusinessById(id as string);
        if (businessData) {
          setBusiness(businessData);
          const dealsData = await getDealsForBusiness(id as string);
          setAllDealsForBusiness(dealsData);

          if (authUser) { 
            const redemptions: Record<string, boolean> = {};
            for (const deal of dealsData) {
                if (deal.isPay1Get2 && deal.usageLimitPerUser === 1) { 
                    redemptions[deal.id] = await checkUserOfferUsage(authUser.id, deal.id);
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
  }, [id, authUser, authChecked]); 

  const canUsePrimeBenefits = authUser && userSubscription && userSubscription.status === 'active';
  const isVipUser = canUsePrimeBenefits && userSubscription?.planId === 'serrano_vip';

  const displayedDeals = useMemo(() => {
    if (isVipUser) {
      return allDealsForBusiness; // VIP users see all offers
    }
    // Non-VIP users or non-logged-in users see only non-VIP offers
    return allDealsForBusiness.filter(deal => !deal.isVipOffer);
  }, [allDealsForBusiness, isVipUser]);

  if (isLoading || !authChecked) {
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
                      Visitar Website
                    </a>
                  </div>
                )}
                {business.instagramUrl && (
                  <div className="flex items-center">
                    <Instagram className="mr-3 h-5 w-5 shrink-0 text-accent" />
                    <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary hover:underline">
                      Ver Instagram
                    </a>
                  </div>
                )}
                {business.facebookUrl && (
                  <div className="flex items-center">
                    <Facebook className="mr-3 h-5 w-5 shrink-0 text-accent" />
                    <a href={business.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary hover:underline">
                      Ver Facebook
                    </a>
                  </div>
                )}
                {business.whatsappNumber && (
                  <div className="flex items-center">
                    <MessageCircle className="mr-3 h-5 w-5 shrink-0 text-accent" /> 
                    <a href={`https://wa.me/${business.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary hover:underline">
                      Conversar no WhatsApp
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
              Ofertas Guia Mais
            </h3>
            {!authUser && (
                 <Alert variant="default" className="mb-4 bg-accent/10 border-accent/30">
                    <UserCheck className="h-5 w-5 text-accent" />
                    <AlertTitle className="text-accent">Faça Login para Vantagens!</AlertTitle>
                    <AlertDescription>
                        <Link href="/login" className="font-semibold underline hover:text-accent/80">Faça login</Link> ou <Link href="/join" className="font-semibold underline hover:text-accent/80">associe-se</Link> para ver e usar os benefícios Guia Mais.
                    </AlertDescription>
                </Alert>
            )}
            {authUser && !canUsePrimeBenefits && (
                 <Alert variant="default" className="mb-4 bg-accent/10 border-accent/30">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                    <AlertTitle className="text-accent">Assinatura Guia Mais Necessária</AlertTitle>
                    <AlertDescription>
                        Sua assinatura Guia Mais não está ativa. <Link href="/join" className="font-semibold underline hover:text-accent/80">Renove ou associe-se</Link> para aproveitar!
                    </AlertDescription>
                </Alert>
            )}
             {authUser && canUsePrimeBenefits && !isVipUser && allDealsForBusiness.some(d => d.isVipOffer) && (
              <Alert variant="default" className="mb-4 bg-purple-500/10 border-purple-500/30">
                <Star className="h-5 w-5 text-purple-600" />
                <AlertTitle className="text-purple-700">Ofertas VIP Disponíveis!</AlertTitle>
                <AlertDescription>
                  Este parceiro tem ofertas exclusivas para membros Serrano VIP. 
                  <Link href="/join" className="font-semibold underline hover:text-purple-700/80"> Faça um upgrade</Link> para acesso total!
                </AlertDescription>
              </Alert>
            )}


            {displayedDeals.length > 0 ? (
              <div className="space-y-4">
                {displayedDeals.map(deal => {
                  const hasRedeemedThisOffer = userRedemptions[deal.id] || false;
                  const isP1G2Limited = deal.isPay1Get2 && deal.usageLimitPerUser === 1;
                  const isLinkDisabled = !canUsePrimeBenefits || (isP1G2Limited && hasRedeemedThisOffer);
                  // For VIP offers, ensure user is VIP
                  const canAccessThisDeal = deal.isVipOffer ? isVipUser : canUsePrimeBenefits;

                  return (
                    <DealCard 
                        key={deal.id} 
                        deal={deal} 
                        business={business}
                        isRedeemed={isP1G2Limited && hasRedeemedThisOffer}
                        canAccess={canAccessThisDeal}
                    />
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed bg-muted/50 p-6 text-center shadow-none">
                <Star className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isVipUser ? "Nenhuma oferta Guia Mais divulgada para este estabelecimento no momento." : "Nenhuma oferta Guia Mais disponível para seu nível de assinatura no momento."}
                </p>
                {!isVipUser && allDealsForBusiness.some(d => d.isVipOffer) && (
                     <p className="mt-2 text-sm text-purple-700">
                        Existem ofertas VIP! <Link href="/join" className="font-semibold underline">Faça upgrade</Link> para ver.
                    </p>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BusinessPageWrapper({ params: paramsPromise }: { params: Promise<BusinessPageParams> }) {
    const params = use(paramsPromise);
    return (
        <Suspense fallback={<div>Carregando detalhes do negócio...</div>}>
            <BusinessPageContent params={params} />
        </Suspense>
    );
}

