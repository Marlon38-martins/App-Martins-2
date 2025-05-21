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
import { 
    Frown, Play, Tag, Award, Sparkles, CheckCircle, MapIcon, Building, UserPlus, TicketPercent as OffersIcon,
    UtensilsCrossed, BedDouble, ShoppingBag, Coffee, Beer, Landmark as AttractionIcon, Trees, ChevronRight,
    Navigation
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RankingPanel } from '@/components/ranking/RankingPanel';
import { BusinessTypeIcon } from '@/components/icons';
import { slugify } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';


const quickNavCategories = [
  { name: 'Restaurantes', slug: slugify('Restaurante'), Icon: UtensilsCrossed },
  { name: 'Hospedagem', slug: slugify('Hotel'), Icon: BedDouble },
  { name: 'Bares', slug: slugify('Bar'), Icon: Beer },
  { name: 'Cafés', slug: slugify('Café'), Icon: Coffee },
  { name: 'Lojas', slug: slugify('Loja'), Icon: ShoppingBag }, 
  { name: 'Lazer', slug: slugify('Atração'), Icon: AttractionIcon },
  { name: 'Mapa', slug: 'map', Icon: MapIcon }, 
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


  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="relative mb-8 h-[250px] w-full rounded-md md:h-[300px]" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
            {Array.from({length: 4}).map((_, i) => <Skeleton key={`qa-skel-${i}`} className="h-16 w-full rounded-md" />)}
        </div>
        <section className="mb-8">
          <Skeleton className="mb-3 h-7 w-3/4 mx-auto md:w-1/2" />
          <div className="flex space-x-3 overflow-x-auto p-1 -m-1">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={`hnav-skel-${i}`} className="h-20 w-28 shrink-0 rounded-md" />)}
          </div>
        </section>
        <section className="mb-8">
          <Skeleton className="mb-3 h-7 w-3/4 mx-auto md:w-1/2" />
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-5/6 mb-2" />
              <Skeleton className="h-9 w-32 rounded-sm" />
            </div>
            <Skeleton className="aspect-video w-full rounded-md" />
          </div>
        </section>
        <section className="mb-8">
          <Skeleton className="mb-3 h-7 w-3/4 mx-auto md:w-1/2" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-1.5">
                <Skeleton className="h-[150px] w-full rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-7 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-8">
          <Skeleton className="mb-3 h-7 w-3/4 mx-auto md:w-1/2" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`rank-skeleton-${index}`} className="space-y-1.5 p-2 border rounded-md">
                <Skeleton className="h-4 w-1/2 mb-1.5" />
                {Array.from({ length: 2 }).map((_, itemIndex) => (
                  <div key={`rank-item-skeleton-${itemIndex}`} className="flex items-start space-x-1.5 py-1.5 border-b last:border-none">
                    <Skeleton className="h-12 w-12 rounded-sm shrink-0" />
                    <div className="flex-1 space-y-1">
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
          <Skeleton className="mb-3 h-7 w-3/4 mx-auto md:w-1/2" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-1.5">
                <Skeleton className="h-[150px] w-full rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-8">
          <Skeleton className="mb-3 h-7 w-3/4 mx-auto md:w-1/2" />
          <Skeleton className="aspect-video w-full max-w-2xl mx-auto rounded-md" />
        </section>
        <Skeleton className="mb-1.5 h-7 w-3/4 mx-auto md:w-1/2" />
        <Skeleton className="mb-4 h-4 w-full mx-auto md:w-3/4" />
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <Skeleton className="h-9 w-full md:col-span-2 rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-1.5">
              <Skeleton className="h-[150px] w-full rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-7 w-full" />
              </div>
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
         <Button asChild variant="outline" className="mt-4">
          <Link href="/">
            Tentar Novamente
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8"> {/* Reduced global space-y */}
      <section className="relative mb-8 h-[300px] w-full overflow-hidden rounded-md shadow-lg md:h-[350px]"> {/* Reduced height and margin */}
        <Image
          src="https://placehold.co/1600x700.png"
          alt="Paisagem deslumbrante de Martins, RN"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
          priority
          data-ai-hint="brazil mountain city"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-3 text-center text-white">
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl drop-shadow-md">
            Bem-vindo ao Guia Mais
          </h1>
          <p className="mt-2 max-w-lg text-sm md:text-base drop-shadow-sm">
            Seu clube de vantagens exclusivo em Martins, RN. Descubra, explore e aproveite!
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8"> {/* Reduced gap and margin */}
        <Button asChild variant="outline" size="default" className="flex flex-col h-auto py-2 items-center justify-center text-center text-xs">
          <Link href="/services" className="flex flex-col items-center">
            <OffersIcon className="h-5 w-5 mb-0.5" />
            Ofertas
          </Link>
        </Button>
        <Button asChild variant="outline" size="default" className="flex flex-col h-auto py-2 items-center justify-center text-center text-xs">
          <Link href="/services" className="flex flex-col items-center">
            <Building className="h-5 w-5 mb-0.5" />
            Parceiros
          </Link>
        </Button>
        <Button asChild variant="outline" size="default" className="flex flex-col h-auto py-2 items-center justify-center text-center text-xs">
          <Link href="/map" className="flex flex-col items-center">
            <MapIcon className="h-5 w-5 mb-0.5" />
            Mapa
          </Link>
        </Button>
        <Button asChild variant="default" size="default" className="bg-accent hover:bg-accent/90 text-accent-foreground flex flex-col h-auto py-2 items-center justify-center text-center text-xs">
          <Link href="/join" className="flex flex-col items-center">
            <UserPlus className="h-5 w-5 mb-0.5" />
            Assinar
          </Link>
        </Button>
      </section>

      <section className="mb-8"> {/* Reduced margin */}
        <h2 className="mb-3 text-center text-xl font-bold tracking-tight text-primary md:text-2xl"> {/* Reduced font size and margin */}
          <Navigation className="inline-block h-6 w-6 mr-1.5 text-accent" />
          Explore por Categoria
        </h2>
        <div className="flex space-x-3 overflow-x-auto p-1 -m-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"> {/* Reduced space and padding */}
          {quickNavCategories.map((category) => (
            <Link 
              key={category.slug} 
              href={category.slug === 'map' ? '/map' : `/services/${category.slug}`} 
              className="shrink-0 w-28" // Reduced width
            >
              <Card className="group h-full hover:bg-accent/10 transition-colors duration-200 shadow-sm hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-2.5 text-center"> {/* Reduced padding */}
                  <category.Icon className="h-7 w-7 mb-1 text-primary group-hover:text-accent transition-colors" /> {/* Reduced icon size and margin */}
                  <p className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">{category.name}</p> {/* Reduced font size */}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8 py-6 bg-secondary/10 rounded-md shadow-inner"> {/* Reduced padding and margin */}
        <div className="container mx-auto px-3">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="text-center md:text-left">
              <Sparkles className="h-8 w-8 text-primary mb-2 mx-auto md:mx-0" /> {/* Reduced icon size and margin */}
              <h2 className="text-xl font-bold tracking-tight text-primary md:text-2xl mb-2"> {/* Reduced font size and margin */}
                Seja um Membro Guia Mais Premium
              </h2>
              <p className="text-sm text-foreground/80 mb-3"> {/* Reduced font size and margin */}
                Desbloqueie um mundo de vantagens e experiências exclusivas em Martins.
              </p>
              <ul className="space-y-1 text-left mb-4 text-foreground/70 text-xs"> {/* Reduced font size and spacing */}
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" /> Descontos incríveis em restaurantes, hotéis e lojas.</li>
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" /> Roteiros personalizados e acesso offline no app.</li>
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" /> Recompensas exclusivas por apoiar o comércio local.</li>
              </ul>
              <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground"> {/* Reduced button size */}
                <Link href="/join">Conheça os Planos Premium</Link>
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                💚 Sua assinatura contribui para valorizar e fortalecer o turismo e comércio local!
              </p>
            </div>
            <div className="relative aspect-square max-w-xs mx-auto w-full overflow-hidden rounded-md shadow-lg"> {/* Reduced max-w */}
                <Image
                    src="https://placehold.co/400x400.png" // Reduced placeholder size
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
        <section className="mb-8"> {/* Reduced margin */}
          <h2 className="mb-1.5 text-center text-xl font-bold tracking-tight text-primary md:text-2xl">
            Ofertas em Destaque
          </h2>
          <p className="mb-4 text-center text-sm text-foreground/80"> {/* Reduced margin and font size */}
            Benefícios exclusivos para membros do nosso clube!
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"> {/* Reduced gap */}
            {featuredDeals.map(deal => {
              const businessForDeal = businesses.find(b => b.id === deal.businessId);
              return <DealCard key={deal.id} deal={deal} business={businessForDeal} />;
            })}
          </div>
        </section>
      )}

       {Object.keys(rankedBusinessesByCategory).length > 0 && (
        <section className="mb-8"> {/* Reduced margin */}
          <h2 className="mb-1.5 text-center text-xl font-bold tracking-tight text-primary md:text-2xl">
            <Award className="inline-block h-6 w-6 mr-1.5 text-accent" />
            Top Avaliados
          </h2>
          <p className="mb-4 text-center text-sm text-foreground/80">
            Os locais mais bem avaliados pelos nossos exploradores!
          </p>
          <RankingPanel rankedBusinessesByCategory={rankedBusinessesByCategory} />
        </section>
      )}

      {touristSpots.length > 0 && (
        <section className="mb-8"> {/* Reduced margin */}
          <h2 className="mb-3 text-center text-xl font-bold tracking-tight text-primary md:text-2xl">
            Pontos Turísticos
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"> {/* Reduced gap */}
            {touristSpots.map(spot => (
              <BusinessCard key={spot.id} business={spot} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-8"> {/* Reduced margin */}
        <h2 className="mb-3 text-center text-xl font-bold tracking-tight text-primary md:text-2xl">
          Descubra Martins
        </h2>
        <div className="aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-md shadow-lg bg-muted border border-border">
          <div className="relative h-full w-full">
            <Image
              src="https://placehold.co/1024x576.png" // Slightly reduced placeholder
              alt="Thumbnail de vídeo sobre as belezas de Martins"
              layout="fill"
              objectFit="cover"
              data-ai-hint="brazil travel video"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity hover:opacity-75">
              <button
                aria-label="Assistir vídeo sobre Martins"
                className="group p-1.5 bg-background/80 rounded-full text-primary backdrop-blur-sm transition-all hover:bg-background hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black/50"
                onClick={() => {
                  const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; 
                  window.open(videoUrl, "_blank");
                  toast({ title: "Vídeo Demonstrativo", description: "Abrindo vídeo em nova aba..."});
                }}
              >
                <Play className="h-7 w-7 fill-primary md:h-8 md:w-8 transition-transform group-hover:scale-105" /> {/* Reduced size */}
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Clique para assistir e encante-se com as paisagens de Martins.
        </p>
      </section>

      {otherServiceBusinesses.length > 0 && (
        <section className="mb-8"> {/* Reduced margin */}
          <h2 className="mb-3 text-center text-xl font-bold tracking-tight text-primary md:text-2xl">
            Parceiros em Destaque
          </h2>
          <div className="flex space-x-3 overflow-x-auto p-2 -m-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"> {/* Reduced space and padding */}
            {otherServiceBusinesses.slice(0, 6).map(business => ( 
              <div key={business.id} className="min-w-[240px] sm:min-w-[260px] flex-shrink-0"> {/* Reduced min-w */}
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-4 text-center"> {/* Reduced margin */}
        <h2 className="mb-1.5 text-xl font-bold tracking-tight text-primary md:text-2xl">
          Nossos Parceiros
        </h2>
        <p className="text-sm text-foreground/80"> {/* Reduced font size */}
          Encontre restaurantes, hotéis, lojas e serviços com benefícios Guia Mais.
        </p>
      </section>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3"> {/* Reduced margin and gap */}
        <div className="md:col-span-2">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar por nome, tipo ou descrição..." />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full rounded-md bg-background py-2 text-xs shadow-sm focus:ring-2 focus:ring-primary"> {/* Reduced py and text size */}
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
        <div className="mt-8 flex flex-col items-center justify-center text-center"> {/* Reduced margin */}
            <Frown className="mb-2 h-12 w-12 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">Nenhum estabelecimento encontrado</h3> {/* Reduced font size */}
            <p className="text-xs text-muted-foreground">
              Tente ajustar seus filtros de busca ou categoria.
            </p>
          </div>
      )}

      {filteredListedBusinesses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> {/* Reduced gap */}
          {filteredListedBusinesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
