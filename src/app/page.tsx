
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RankingPanel } from '@/components/ranking/RankingPanel';
import { slugify } from '@/lib/utils';
import { BusinessTypeIcon } from '@/components/icons';

const quickNavCategories = [
  { name: 'Ofertas', slug: '/services', Icon: OffersIcon },
  { name: 'Restaurantes', slug: slugify('Restaurante'), Icon: UtensilsCrossed },
  { name: 'Hospedagem', slug: slugify('Hotel'), Icon: BedDouble },
  { name: 'Bares', slug: slugify('Bar'), Icon: Beer },
  { name: 'Mapa', slug: 'map', Icon: MapIcon },
  { name: 'Assinar', slug: '/join', Icon: UserPlus },
];


export default function HomePage() {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<GramadoBusiness[]>([]);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const touristSpots = useMemo(() => {
    return businesses
      .filter(
        (business) => business.type === 'Atração' || business.type === 'Parque'
      )
      .slice(0, 3);
  }, [businesses]);

  const featuredDeals = useMemo(() => {
    return allDeals
      .sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0)) 
      .slice(0, 4);
  }, [allDeals]);

  const otherServiceBusinesses = useMemo(() => {
    return businesses.filter(
      (business) => business.type !== 'Atração' && business.type !== 'Parque'
    );
  }, [businesses]);

  const categories = useMemo(() => {
    const allCategories = otherServiceBusinesses.map(business => business.type);
    return ['all', ...Array.from(new Set(allCategories))];
  }, [otherServiceBusinesses]);

  const filteredListedBusinesses = useMemo(() => {
    return otherServiceBusinesses.filter(business => {
      const matchesSearchTerm = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                business.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                business.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || business.type === selectedCategory;
      return matchesSearchTerm && matchesCategory;
    });
  }, [otherServiceBusinesses, searchTerm, selectedCategory]);

  const rankedBusinessesByCategory = useMemo(() => {
    if (!businesses.length) return {};

    const categoriesToRank = ['Restaurante', 'Hotel', 'Atração']; 
    const topN = 3; 

    const result: Record<string, GramadoBusiness[]> = {};

    categoriesToRank.forEach(categoryType => {
      const categoryBusinesses = businesses
        .filter(b => b.type === categoryType && typeof b.rating === 'number' && typeof b.reviewCount === 'number' && b.reviewCount > 0)
        .sort((a, b) => {
          if (b.rating! !== a.rating!) {
            return b.rating! - a.rating!;
          }
          return b.reviewCount! - a.reviewCount!; 
        })
        .slice(0, topN);

      if (categoryBusinesses.length > 0) {
        result[categoryType] = categoryBusinesses;
      }
    });
    return result;
  }, [businesses]);

  const uniqueCities = useMemo(() => {
    const cities = businesses.map(b => b.city).filter(Boolean); // Filter out undefined/empty cities
    return Array.from(new Set(cities)).sort(); // Sort city names
  }, [businesses]);


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="relative mb-8 h-[300px] w-full rounded-lg md:h-[350px]" />
        
        <section className="mb-8">
          <Skeleton className="mb-3 h-6 w-1/2" />
           <div className="flex space-x-3 overflow-x-auto pb-3 -mx-2 px-2">
            {Array.from({length: 5}).map((_, i) => (
              <Skeleton key={`qnav-skel-${i}`} className="h-20 w-20 shrink-0 rounded-lg" />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <Skeleton className="mb-3 h-6 w-1/2" />
           <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2">
             {Array.from({length: 3}).map((_, i) => <Skeleton key={`city-skel-${i}`} className="h-8 w-24 rounded-md" />)}
           </div>
        </section>
        
        <section className="mb-8 py-6 bg-secondary/10 rounded-lg shadow-inner">
          <div className="px-4">
            <div className="grid md:grid-cols-2 gap-4 items-center">
              <div>
                <Skeleton className="h-7 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-1.5" />
                <Skeleton className="h-3 w-full mb-1.5" />
                <Skeleton className="h-3 w-5/6 mb-3" />
                <Skeleton className="h-9 w-36 rounded-md" />
              </div>
              <Skeleton className="aspect-square w-full max-w-[280px] mx-auto rounded-lg" />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <Skeleton className="mb-4 h-7 w-1/2" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={`fd-skel-${index}`} className="flex flex-col space-y-2">
                <Skeleton className="h-[180px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <Skeleton className="mb-4 h-7 w-1/2" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={`rank-skeleton-${index}`} className="space-y-2.5 p-3 border rounded-lg">
                <Skeleton className="h-5 w-1/2 mb-1.5" />
                {Array.from({ length: 2 }).map((_, itemIndex) => (
                  <div key={`rank-item-skeleton-${itemIndex}`} className="flex items-start space-x-2.5 py-1.5 border-b last:border-none">
                    <Skeleton className="h-14 w-14 rounded-md shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2.5 w-1/2" />
                      <Skeleton className="h-2.5 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <Skeleton className="mb-4 h-7 w-1/2" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={`ts-skel-${index}`} className="flex flex-col space-y-2">
                <Skeleton className="h-[180px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <Skeleton className="mb-3 h-7 w-1/2" />
          <Skeleton className="aspect-video w-full max-w-lg mx-auto rounded-lg" />
        </section>

        <Skeleton className="mb-2 h-7 w-1/2" />
        <Skeleton className="mb-4 h-5 w-full" />
        <div className="mb-4 grid grid-cols-1 gap-3">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={`flb-skel-${index}`} className="flex flex-col space-y-2">
              <Skeleton className="h-[180px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center">
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
    <div className="space-y-8">
      <section className="relative mb-8 h-[300px] w-full overflow-hidden rounded-lg shadow-xl md:h-[350px]">
        <Image
          src="https://placehold.co/1600x900.png"
          alt="Paisagem deslumbrante de Martins, RN"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
          priority
          data-ai-hint="Martins RN landscape"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center text-white">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl drop-shadow-md">
            Bem-vindo ao Guia Mais
          </h1>
          <p className="mt-2 max-w-lg text-sm md:text-base drop-shadow-sm">
            Seu clube de vantagens em Martins e região. Explore e aproveite!
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-primary">Navegação Rápida</h2>
        <div className="flex space-x-3 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {quickNavCategories.map((category) => (
            <Button
              key={category.slug}
              asChild
              variant="outline"
              className="shrink-0 w-24 h-24 flex-col py-2 px-2 text-xs shadow-sm hover:shadow-md group hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 ease-in-out hover:scale-105"
            >
              <Link href={category.slug === 'map' ? '/map' : (category.slug.startsWith('/') ? category.slug : `/services/${slugify(category.name)}`)}>
                <span className="flex flex-col items-center justify-center">
                  <category.Icon className="h-5 w-5 mb-1 text-primary transition-colors group-hover:text-accent" />
                  <p className="text-xs font-medium text-foreground transition-colors group-hover:text-accent leading-tight text-center">
                    {category.name}
                  </p>
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {uniqueCities.length > 1 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-primary">Explore Regiões Próximas</h2>
          <div className="flex flex-wrap gap-2">
            {uniqueCities.map(city => (
              <Button key={slugify(city)} variant="outline" size="sm" asChild className="text-xs">
                <Link href={`/services?city=${slugify(city)}`}>
                  <span className="flex items-center">
                    <MapPinned className="mr-1.5 h-3.5 w-3.5" /> {city}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8 py-6 bg-secondary/10 rounded-lg shadow-inner">
        <div className="px-4">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="text-center md:text-left">
              <Sparkles className="h-8 w-8 text-primary mb-2 mx-auto md:mx-0" />
              <h2 className="text-xl font-bold tracking-tight text-primary md:text-2xl mb-2">
                Seja Membro Guia Mais Premium
              </h2>
              <p className="text-xs text-foreground/80 mb-3">
                Desbloqueie um mundo de vantagens e experiências exclusivas em Martins e região.
              </p>
              <ul className="space-y-1 text-left mb-4 text-foreground/70 text-xs">
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" /> Descontos incríveis em restaurantes, hotéis e lojas.</li>
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" /> Roteiros personalizados e acesso offline no app.</li>
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" /> Recompensas por apoiar o comércio local.</li>
              </ul>
              <Button asChild size="default" className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
                <Link href="/join">Conheça os Planos Premium</Link>
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                💚 Sua assinatura contribui para valorizar o turismo e comércio local!
              </p>
            </div>
            <div className="relative aspect-square max-w-[280px] mx-auto w-full overflow-hidden rounded-lg shadow-xl">
                <Image
                    src="https://placehold.co/400x400.png" 
                    alt="Membro Guia Mais aproveitando a cidade"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="happy tourist city"
                />
            </div>
          </div>
        </div>
      </section>

      {featuredDeals.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xl font-bold tracking-tight text-primary md:text-2xl">
            Ofertas em Destaque
          </h2>
          <p className="mb-4 text-center text-xs text-foreground/80">
            Benefícios exclusivos para membros Guia Mais!
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featuredDeals.slice(0,2).map(deal => {
              const businessForDeal = businesses.find(b => b.id === deal.businessId);
              return <DealCard key={deal.id} deal={deal} business={businessForDeal} />;
            })}
          </div>
        </section>
      )}

       {Object.keys(rankedBusinessesByCategory).length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xl font-bold tracking-tight text-primary md:text-2xl">
            <Award className="inline-block h-6 w-6 mr-1.5 text-accent" />
            Top Avaliados
          </h2>
          <p className="mb-4 text-center text-xs text-foreground/80">
            Os locais mais bem avaliados!
          </p>
          <RankingPanel rankedBusinessesByCategory={rankedBusinessesByCategory} />
        </section>
      )}

      {touristSpots.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xl font-bold tracking-tight text-primary md:text-2xl">
            Pontos Turísticos
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {touristSpots.slice(0,2).map(spot => (
              <BusinessCard key={spot.id} business={spot} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-center text-xl font-bold tracking-tight text-primary md:text-2xl">
          Descubra Martins
        </h2>
        <div className="aspect-video w-full max-w-lg mx-auto overflow-hidden rounded-lg shadow-xl bg-muted border border-border">
          <div className="relative h-full w-full">
            <Image
              src="https://placehold.co/1024x576.png"
              alt="Thumbnail de vídeo sobre as belezas de Martins"
              layout="fill"
              objectFit="cover"
              data-ai-hint="Martins travel video"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity hover:opacity-75">
              <button
                aria-label="Assistir vídeo sobre Martins"
                className="group p-2.5 bg-background/80 rounded-full text-primary backdrop-blur-sm transition-all hover:bg-background hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black/50"
                onClick={() => {
                  const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; 
                  window.open(videoUrl, "_blank");
                  toast({ title: "Vídeo Demonstrativo", description: "Abrindo vídeo em nova aba..."});
                }}
              >
                <Play className="h-7 w-7 fill-primary md:h-8 md:w-8 transition-transform group-hover:scale-105" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2.5 text-center text-xs text-muted-foreground">
          Clique para assistir e encante-se com as paisagens de Martins.
        </p>
      </section>

      {otherServiceBusinesses.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xl font-bold tracking-tight text-primary md:text-2xl">
            Parceiros em Destaque
          </h2>
          <div className="flex space-x-3 overflow-x-auto p-2 -m-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {otherServiceBusinesses.slice(0, 4).map(business => ( 
              <div key={business.id} className="min-w-[260px] sm:min-w-[280px] flex-shrink-0">
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-4 text-center">
        <h2 className="mb-2 text-xl font-bold tracking-tight text-primary md:text-2xl">
          Nossos Parceiros
        </h2>
        <p className="text-xs text-foreground/80">
          Encontre restaurantes, hotéis, lojas e serviços com benefícios Guia Mais.
        </p>
      </section>

      <div className="mb-4 grid grid-cols-1 gap-3">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar por nome, tipo ou descrição..." />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full rounded-lg bg-background py-2 text-xs shadow-md focus:ring-2 focus:ring-primary h-9">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'Todas as Categorias' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredListedBusinesses.length === 0 && !isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center text-center">
            <Frown className="mb-3 h-12 w-12 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">Nenhum estabelecimento encontrado</h3>
            <p className="text-xs text-muted-foreground">
              Tente ajustar seus filtros de busca ou categoria.
            </p>
          </div>
      )}

      {filteredListedBusinesses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredListedBusinesses.slice(0,4).map(business => ( 
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
