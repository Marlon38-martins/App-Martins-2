
// src/app/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getGramadoBusinesses, getAllDeals, type GramadoBusiness, type Deal } from '@/services/gramado-businesses';
import { BusinessCard } from '@/components/business/business-card';
import { DealCard } from '@/components/deal/deal-card';
import { SearchBar } from '@/components/search-bar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Frown, Play, Tag, Award, Sparkles, CheckCircle, MapIcon, Building, UserPlus, TicketPercent as OffersIcon,
    UtensilsCrossed, BedDouble, Beer, Coffee, ShoppingBag, Landmark as AttractionIcon, Home, BarChart3, Eye, Edit3, Settings2, QrCode as QrCodeIcon, MapPinned, ExternalLink,
    LayoutGrid, Trees, ArrowRight, Sparkle, PercentDiamond, Route, Globe2, Info, TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RankingPanel } from '@/components/ranking/RankingPanel';
import { slugify } from '@/lib/utils';
import { BusinessTypeIcon } from '@/components/icons';
import { useAuth } from '@/hooks/use-auth-client';


const quickNavCategories = [
  { name: 'Restaurantes', slug: slugify('Restaurante'), Icon: UtensilsCrossed },
  { name: 'Hospedagem', slug: slugify('Hotel'), Icon: BedDouble },
  { name: 'Bares', slug: slugify('Bar'), Icon: Beer },
  { name: 'Cafés', slug: slugify('Café'), Icon: Coffee },
  { name: 'Lojas', slug: slugify('Comércio'), Icon: ShoppingBag },
  { name: 'Lazer', slug: slugify('Atração'), Icon: AttractionIcon },
  { name: 'Mapa', slug: 'map', Icon: MapIcon },
]; // Added missing closing bracket and semicolon

const suggestedRegions = [
    { name: 'Martins, RN', slug: slugify('Martins, RN') },
    { name: 'Cidade Vizinha, RN', slug: slugify('Cidade Vizinha, RN') }, // Example placeholder
    { name: 'Pau dos Ferros, RN', slug: slugify('Pau dos Ferros, RN') }, // Example
];


export default function HomePage() {
  const { toast } = useToast();
  const { user: authUser, subscription: userSubscription, loading: authLoading } = useAuth();
  const [businesses, setBusinesses] = useState<GramadoBusiness[]>([]);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      setError(null);
      try {
        const [businessData, dealsData] = await Promise.all([
          getGramadoBusinesses(),
          getAllDeals()
        ]);
        setBusinesses(businessData);
        setAllDeals(dealsData);
      } catch (err) {
        setError('Falha ao carregar os dados. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, []);

  const isVipUser = useMemo(() => {
    return authUser && userSubscription && userSubscription.planId === 'serrano_vip' && userSubscription.status === 'active';
  }, [authUser, userSubscription]);

  const featuredDealsAndTeasers = useMemo(() => {
    if (isLoadingData || authLoading) return { deals: [], teasers: [] };

    const allSortedDealsForDisplay = [...allDeals]
        .sort((a, b) => {
            if (a.isVipOffer && !b.isVipOffer) return -1;
            if (!a.isVipOffer && b.isVipOffer) return 1;
            if (a.isPay1Get2 && !b.isPay1Get2) return -1;
            if (!a.isPay1Get2 && b.isPay1Get2) return 1;
            return (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0);
        });


    if (!authUser || !userSubscription || userSubscription.status !== 'active') { // Not logged in or no active sub
      const dealsToShow = allSortedDealsForDisplay.filter(d => !d.isVipOffer).slice(0, 2);
      const teasersToShow = allSortedDealsForDisplay.filter(d => d.isVipOffer).slice(0, 1);
      return { deals: dealsToShow, teasers: teasersToShow };
    } else if (authUser && userSubscription.status === 'active' && !isVipUser) { // Logged in, active sub, but NOT VIP
      const dealsToShow = allSortedDealsForDisplay.filter(d => !d.isVipOffer).slice(0, 2);
      const teasersToShow = allSortedDealsForDisplay.filter(d => d.isVipOffer).slice(0, 1);
      return { deals: dealsToShow, teasers: teasersToShow };
    }
     else { // Is VIP user or Admin
      return { deals: allSortedDealsForDisplay.slice(0, 3), teasers: [] };
    }
  }, [allDeals, isLoadingData, authUser, userSubscription, isVipUser, authLoading]);


  const touristSpots = useMemo(() => {
    return businesses
      .filter(
        (business) => (business.type === 'Atração' || business.type === 'Parque') && business.city === 'Martins, RN'
      )
      .slice(0, 2);
  }, [businesses]);

  const otherServiceBusinesses = useMemo(() => {
    return businesses.filter(
      (business) => business.type !== 'Atração' && business.type !== 'Parque' && business.city === 'Martins, RN'
    );
  }, [businesses]);

  const categories = useMemo(() => {
    const allCategories = businesses.map(business => business.type); // Use all businesses for category list
    return ['all', ...Array.from(new Set(allCategories))];
  }, [businesses]);

  const filteredListedBusinesses = useMemo(() => {
    return businesses.filter(business => { // Search all businesses, not just 'otherServiceBusinesses'
      const matchesSearchTerm = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                business.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                business.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || business.type === selectedCategory;
      return matchesSearchTerm && matchesCategory;
    }).slice(0, 4);
  }, [businesses, searchTerm, selectedCategory]);

  const uniqueCities = useMemo(() => {
    if (!businesses.length) return [];
    const cities = businesses.map(b => b.city).filter(Boolean) as string[];
    const citySet = Array.from(new Set(cities));
    // Prioritize Martins, RN
    const martinsIndex = citySet.indexOf('Martins, RN');
    if (martinsIndex > -1) {
      citySet.splice(martinsIndex, 1);
      citySet.unshift('Martins, RN');
    }
    return citySet.map(city => ({ name: city, slug: slugify(city) }));
  }, [businesses]);


  const rankedBusinessesByCategory = useMemo(() => {
    if (!businesses.length) return {};
    // Focus ranking on Martins, RN initially, can be expanded later
    const martinsBusinesses = businesses.filter(b => b.city === 'Martins, RN');
    const categoriesToRank = ['Restaurante', 'Hotel', 'Atração'];
    const topN = 2;

    const result: Record<string, GramadoBusiness[]> = {};
    categoriesToRank.forEach(categoryType => {
      const categoryBusinesses = martinsBusinesses
        .filter(b => b.type === categoryType && typeof b.rating === 'number' && typeof b.reviewCount === 'number' && b.reviewCount > 0)
        .sort((a, b) => {
          if (b.rating! !== a.rating!) return b.rating! - a.rating!;
          return b.reviewCount! - a.reviewCount!;
        })
        .slice(0, topN);
      if (categoryBusinesses.length > 0) result[categoryType] = categoryBusinesses;
    });
    return result;
  }, [businesses]);

  if (isLoadingData || authLoading) {
    return (
      <div className="space-y-8 p-3">
        <Skeleton className="relative mb-12 h-[350px] w-full rounded-lg md:h-[400px]" />

        <section className="mb-10">
          <Skeleton className="mb-4 h-7 w-1/2" />
           <div className="flex space-x-3 overflow-x-auto pb-3 -mx-2 px-2">
            {Array.from({length: 4}).map((_, i) => (
              <Skeleton key={`qnav-skel-${i}`} className="h-24 w-24 shrink-0 rounded-lg" />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <Skeleton className="mb-4 h-7 w-1/2" />
          <div className="flex flex-wrap gap-2">
            {Array.from({length: 3}).map((_, i) => <Skeleton key={`city-skel-${i}`} className="h-9 w-28 rounded-md" />)}
          </div>
           <Skeleton className="h-9 w-36 mt-2 rounded-md" />
        </section>

        <section className="mb-12 py-8 bg-secondary/20 rounded-lg shadow-inner">
          <div className="px-4">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <Skeleton className="h-8 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-1.5" />
                <Skeleton className="h-4 w-full mb-1.5" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-10 w-44 rounded-md" />
              </div>
              <Skeleton className="aspect-square w-full max-w-[280px] mx-auto rounded-lg" />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <Skeleton className="mb-6 h-8 w-1/2" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={`fd-skel-${index}`} className="flex flex-col space-y-3">
                <Skeleton className="h-[180px] w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </section>

         <section className="mb-12">
          <Skeleton className="mb-6 h-8 w-1/2" />
           <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 1 }).map((_, index) => (
              <div key={`rank-skeleton-${index}`} className="space-y-4 p-4 border rounded-lg">
                <Skeleton className="h-7 w-1/2 mb-3" />
                {Array.from({ length: 2 }).map((_, itemIndex) => (
                  <div key={`rank-item-skeleton-${itemIndex}`} className="flex items-start space-x-4 py-3 border-b last:border-none">
                    <Skeleton className="h-20 w-20 rounded-md shrink-0" />
                    <div className="flex-1 space-y-2.5">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Skeleton className="mb-6 h-8 w-1/2" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={`ts-skel-${index}`} className="flex flex-col space-y-3">
                <Skeleton className="h-[180px] w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Skeleton className="mb-4 h-8 w-1/2" />
          <Skeleton className="aspect-video w-full max-w-xl mx-auto rounded-lg" />
        </section>

        <Skeleton className="mb-4 h-8 w-1/2" />
        <Skeleton className="mb-6 h-6 w-full" />
        <div className="mb-6 grid grid-cols-1 gap-4">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={`flb-skel-${index}`} className="flex flex-col space-y-3">
              <Skeleton className="h-[180px] w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4">
         <Alert variant="destructive" className="w-full max-w-md">
           <Frown className="h-5 w-5" />
           <AlertTitle>Erro ao Carregar</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
         <Button asChild variant="outline" className="mt-6">
          <Link href="/">
            Tentar Novamente
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 p-3">
      <section className="relative mb-12 h-[350px] w-full overflow-hidden rounded-lg shadow-xl md:h-[400px]">
        <Image
          src="https://placehold.co/1600x900.png"
          alt="Paisagem deslumbrante de Martins, RN"
          layout="fill"
          objectFit="cover"
          className="brightness-90"
          priority
          data-ai-hint="Martins RN serra"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center text-white">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl drop-shadow-lg">
            Bem-vindo ao Guia Mais, seu guia de vantagens!
          </h1>
          <p className="mt-3 max-w-xl text-sm md:text-base drop-shadow-md">
            Explore o melhor de Martins e região com ofertas exclusivas e roteiros incríveis.
          </p>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-primary text-center">Explore por Categoria</h2>
        <div className="flex space-x-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {quickNavCategories.map((category) => (
            <Link
              key={category.slug}
              href={category.slug === 'map' ? '/map' : `/services/${category.slug}`}
              className="shrink-0 w-28 group"
            >
              <Card className="h-28 flex flex-col items-center justify-center p-3 text-center shadow-md rounded-lg border border-border transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:border-accent">
                <category.Icon className="h-7 w-7 mb-1.5 text-primary transition-colors group-hover:text-accent-foreground" />
                <p className="text-xs font-medium text-foreground transition-colors group-hover:text-accent-foreground leading-tight">
                  {category.name}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>


      {uniqueCities.length > 1 && (
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-primary text-center">Explore Regiões</h2>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {suggestedRegions.filter(sr => uniqueCities.some(uc => uc.slug === sr.slug)).map(city => (
              <Button key={city.slug} variant="outline" size="default" asChild className="text-sm h-10">
                <Link href={`/services?city=${city.slug}`}>
                   <span className="flex items-center justify-center">
                    <MapPinned className="mr-2 h-4 w-4" /> {city.name}
                   </span>
                </Link>
              </Button>
            ))}
             <Button variant="link" size="default" asChild className="text-sm text-primary hover:text-primary/80 h-10">
                <Link href="/services">
                  <span className="flex items-center justify-center">
                    Ver todas as regiões <ArrowRight className="ml-1.5 h-4 w-4" />
                  </span>
                </Link>
            </Button>
          </div>
        </section>
      )}

      <section className="mb-12 py-8 bg-primary/10 rounded-lg shadow-lg">
        <div className="px-4">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="text-center md:text-left">
              <Sparkles className="h-10 w-10 text-primary mb-3 mx-auto md:mx-0" />
              <h2 className="text-2xl font-bold tracking-tight text-primary md:text-3xl mb-3">
                Seja Membro Guia Mais Premium!
              </h2>
              <p className="text-sm text-foreground/80 mb-4">
                Desbloqueie um mundo de vantagens e experiências exclusivas em Martins e região.
              </p>
              <ul className="space-y-2 text-left mb-5 text-foreground/70 text-sm">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Descontos incríveis em parceiros.</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Roteiros personalizados e acesso offline.</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Programa de recompensas exclusivo.</li>
              </ul>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3">
                <Link href="/join">Conheça os Planos Premium</Link>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                💚 Sua assinatura valoriza o turismo e comércio local!
              </p>
            </div>
            <div className="relative aspect-square max-w-xs mx-auto w-full overflow-hidden rounded-lg shadow-xl">
                <Image
                    src="https://placehold.co/400x400.png"
                    alt="Membro Guia Mais aproveitando a cidade"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="happy tourist martins"
                />
            </div>
          </div>
        </div>
      </section>

      {(featuredDealsAndTeasers.deals.length > 0 || featuredDealsAndTeasers.teasers.length > 0) && (
        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-primary md:text-3xl text-center">
            <OffersIcon className="inline-block h-7 w-7 mr-2 text-accent" />
            Ofertas em Destaque
          </h2>
          <p className="mb-6 text-center text-sm text-foreground/80">
            Benefícios exclusivos para membros Guia Mais!
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {featuredDealsAndTeasers.deals.map(deal => {
              const businessForDeal = businesses.find(b => b.id === deal.businessId);
              return <DealCard key={deal.id} deal={deal} business={businessForDeal} canAccess={authUser ? (deal.isVipOffer ? isVipUser : (userSubscription?.status === 'active')) : false} />;
            })}
            {featuredDealsAndTeasers.teasers.map(deal => {
              const businessForDeal = businesses.find(b => b.id === deal.businessId);
              return <DealCard key={`teaser-${deal.id}`} deal={deal} business={businessForDeal} canAccess={false} />;
            })}
          </div>
        </section>
      )}


       {Object.keys(rankedBusinessesByCategory).length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-primary md:text-3xl">
            <Award className="inline-block h-7 w-7 mr-2 text-accent" />
            Top Avaliados em Martins
          </h2>
          <RankingPanel rankedBusinessesByCategory={rankedBusinessesByCategory} />
        </section>
      )}

      {touristSpots.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-primary md:text-3xl">
            Pontos Turísticos em Martins
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {touristSpots.map(spot => (
              <BusinessCard key={spot.id} business={spot} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-primary md:text-3xl text-center">
          Descubra Martins
        </h2>
        <div className="aspect-video w-full max-w-xl mx-auto overflow-hidden rounded-lg shadow-xl bg-muted border border-border">
          <div className="relative h-full w-full">
            <Image
              src="https://placehold.co/800x450.png"
              alt="Thumbnail de vídeo sobre as belezas de Martins"
              layout="fill"
              objectFit="cover"
              data-ai-hint="Martins travel video"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity hover:opacity-75">
              <button
                aria-label="Assistir vídeo sobre Martins"
                className="group p-3 bg-background/80 rounded-full text-primary backdrop-blur-sm transition-all hover:bg-background hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black/50"
                onClick={() => {
                  const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Placeholder video
                  window.open(videoUrl, "_blank");
                  toast({ title: "Vídeo Demonstrativo", description: "Abrindo vídeo em nova aba..."});
                }}
              >
                <Play className="h-7 w-7 fill-primary md:h-8 md:w-8 transition-transform group-hover:scale-105" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Clique para assistir e encante-se com as paisagens de Martins, RN.
        </p>
      </section>

      {otherServiceBusinesses.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-primary md:text-3xl">
            Mais Parceiros em Martins
          </h2>
          <div className="flex space-x-4 overflow-x-auto p-2 -m-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {otherServiceBusinesses.slice(0, 6).map(business => (
              <div key={business.id} className="min-w-[280px] sm:min-w-[300px] flex-shrink-0">
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12 text-center">
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-primary md:text-3xl">
          Explore Todos os Parceiros
        </h2>
        <p className="text-sm text-foreground/80 mb-4">
          Encontre restaurantes, hotéis, lojas e serviços com benefícios Guia Mais em diversas regiões.
        </p>
      </section>

      <div className="mb-8 grid grid-cols-1 gap-4">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar por nome, tipo ou descrição..." />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full rounded-lg bg-background py-2.5 text-base shadow-sm focus:ring-1 focus:ring-primary h-11">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category} className="text-sm">
                {category === 'all' ? 'Todas as Categorias' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredListedBusinesses.length === 0 && !isLoadingData && (
        <div className="mt-10 flex flex-col items-center justify-center text-center">
            <Frown className="mb-4 h-14 w-14 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Nenhum estabelecimento encontrado</h3>
            <p className="text-sm text-muted-foreground">
              Tente ajustar seus filtros de busca ou categoria.
            </p>
          </div>
      )}

      {filteredListedBusinesses.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filteredListedBusinesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
       <div className="mt-10 text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/services">
            <span className="flex items-center justify-center">
                Ver Todos os Parceiros <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
