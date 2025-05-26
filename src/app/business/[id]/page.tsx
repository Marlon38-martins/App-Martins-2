
// src/app/business/[id]/page.tsx
'use client';

import { use, useEffect, useState, Suspense, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; 

import { 
    getGramadoBusinessById, 
    getDealsForBusiness, 
    type GramadoBusiness, 
    type Deal, 
    checkUserOfferUsage 
} from '@/services/gramado-businesses';
import type { User as AppUser, Subscription } from '@/types/user'; 
import { useAuth } from '@/hooks/use-auth-client';


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BusinessTypeIcon } from '@/components/icons';
import { DealCard } from '@/components/deal/deal-card';
import { 
  MapPin, Phone, Globe, ArrowLeft, TicketPercent, Frown, Star, UserCheck, AlertTriangle,
  Instagram, Facebook, MessageCircle, Mail, Share2, Sun, CloudSun, CloudRain
} from 'lucide-react';

// Placeholder for actual WhatsApp/Email sharing logic
const generateWhatsAppLink = (businessName: string, offerTitle?: string) => {
  const message = offerTitle 
    ? `Olá! Gostaria de saber mais sobre a oferta "${offerTitle}" no ${businessName} que vi no Guia Mais.`
    : `Olá! Vi o ${businessName} no Guia Mais e gostaria de mais informações.`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`; // No phone number for general share
};

const generateEmailLink = (businessName: string, offerTitle?: string) => {
  const subject = offerTitle 
    ? `Interesse na Oferta: ${offerTitle} - ${businessName} (via Guia Mais)`
    : `Interesse em: ${businessName} (via Guia Mais)`;
  const body = offerTitle
    ? `Olá ${businessName},\n\nVi a oferta "${offerTitle}" no aplicativo Guia Mais e gostaria de mais informações.\n\nObrigado(a)!`
    : `Olá ${businessName},\n\nVi seu estabelecimento no aplicativo Guia Mais e gostaria de mais informações.\n\nObrigado(a)!`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};


interface BusinessPageParams {
  id: string;
}

function BusinessPageContent({ params }: { params: BusinessPageParams }) {
  const { id } = params;
  const { user: authUser, subscription: userSubscription, loading: authLoading } = useAuth();
  
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [allDealsForBusiness, setAllDealsForBusiness] = useState<Deal[]>([]);
  const [userRedemptions, setUserRedemptions] = useState<Record<string, boolean>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!id) return; 

    async function loadBusinessData() {
      if (authLoading) return; 
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
  }, [id, authUser, authLoading]); 

  const canUsePrimeBenefits = authUser && userSubscription && userSubscription.status === 'active';
  const isVipUser = canUsePrimeBenefits && userSubscription?.planId === 'serrano_vip';

  const displayedDeals = useMemo(() => {
    if (isVipUser) {
      return allDealsForBusiness; 
    }
    return allDealsForBusiness.filter(deal => !deal.isVipOffer);
  }, [allDealsForBusiness, isVipUser]);

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
                data-ai-hint={`${business.type} view`}
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold text-primary">{business.name}</CardTitle>
                {business.icon && <BusinessTypeIcon type={business.icon} className="h-8 w-8 text-primary" />}
              </div>
              <CardDescription className="text-lg text-muted-foreground">{business.type}</CardDescription>
              <div className="mt-2 flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={generateWhatsAppLink(business.name)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={generateEmailLink(business.name)} target="_blank">
                    <Mail className="mr-2 h-4 w-4" /> Email
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => alert('Compartilhar (simulado)')}>
                  <Share2 className="mr-2 h-4 w-4" /> Outros
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-foreground/90">{business.fullDescription}</p>
              
              <div className="mb-6 p-4 rounded-md border bg-muted/50">
                <h4 className="text-md font-semibold text-primary mb-2 flex items-center">
                  <Sun className="mr-2 h-5 w-5 text-yellow-500" />
                  Previsão do Tempo (Local)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Integração com OpenWeather API aqui.
                </p>
                {/* Placeholder weather info */}
                <div className="mt-2 flex items-center space-x-2">
                  <CloudSun className="h-6 w-6 text-accent"/>
                  <span className="font-medium text-foreground/90">28°C - Parcialmente Nublado</span>
                </div>
                 <p className="text-xs text-muted-foreground mt-1">Atualizado: DD/MM/AAAA HH:MM (Simulado)</p>
              </div>


              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="mr-3 mt-1 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-foreground/80">{business.address}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:underline text-xs"
                  >
                    (Ver no mapa)
                  </a>
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
            <h3 className="mb-4 flex items-center text-xl font-semibold text-primary">
              <TicketPercent className="mr-2 h-7 w-7 text-accent" />
              Ofertas Guia Mais
            </h3>
            {!authUser && !authLoading && ( 
                 <Alert variant="default" className="mb-4 bg-accent/10 border-accent/30">
                    <UserCheck className="h-5 w-5 text-accent" />
                    <AlertTitle className="text-accent">Faça Login para Vantagens!</AlertTitle>
                    <AlertDescription>
                        <Link href={`/login?redirect=/business/${id}`} className="font-semibold underline hover:text-accent/80">Faça login</Link> ou <Link href="/join" className="font-semibold underline hover:text-accent/80">associe-se</Link> para ver e usar os benefícios Guia Mais.
                    </AlertDescription>
                </Alert>
            )}
            {authUser && !canUsePrimeBenefits && !authLoading && ( 
                 <Alert variant="default" className="mb-4 bg-accent/10 border-accent/30">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                    <AlertTitle className="text-accent">Assinatura Guia Mais Necessária</AlertTitle>
                    <AlertDescription>
                        Sua assinatura Guia Mais não está ativa. <Link href="/join" className="font-semibold underline hover:text-accent/80">Renove ou associe-se</Link> para aproveitar!
                    </AlertDescription>
                </Alert>
            )}
             {authUser && canUsePrimeBenefits && !isVipUser && allDealsForBusiness.some(d => d.isVipOffer) && !authLoading && (
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
                  
                  let dealIsAccessible = false;
                  if (canUsePrimeBenefits) { 
                    if (deal.isVipOffer) {
                      dealIsAccessible = isVipUser; 
                    } else {
                      dealIsAccessible = true; 
                    }
                  }
                  return (
                    <DealCard 
                        key={deal.id} 
                        deal={deal} 
                        business={business}
                        isRedeemed={isP1G2Limited && hasRedeemedThisOffer}
                        canAccess={dealIsAccessible} 
                    />
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed bg-muted/50 p-6 text-center shadow-none">
                <Star className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isVipUser ? "Nenhuma oferta Guia Mais divulgada para este estabelecimento no momento." : (authUser ? "Nenhuma oferta Guia Mais disponível para seu nível de assinatura no momento." : "Nenhuma oferta Guia Mais pública encontrada.")}
                </p>
                {!isVipUser && allDealsForBusiness.some(d => d.isVipOffer) && authUser && (
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
