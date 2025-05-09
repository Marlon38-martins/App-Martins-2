// src/app/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getGramadoBusinesses, type GramadoBusiness } from '@/services/gramado-businesses';
import { BusinessCard } from '@/components/business/business-card';
import { SearchBar } from '@/components/search-bar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Frown, Play } from 'lucide-react';

export default function HomePage() {
  const [businesses, setBusinesses] = useState<GramadoBusiness[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBusinesses() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getGramadoBusinesses();
        setBusinesses(data);
      } catch (err) {
        setError('Falha ao carregar os dados. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBusinesses();
  }, []);

  const touristSpots = useMemo(() => {
    return businesses
      .filter(
        (business) => business.type === 'Atração' || business.type === 'Parque'
      )
      .slice(0, 3); // Show top 3 tourist spots
  }, [businesses]);

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

  if (isLoading) {
    return (
      <div>
        {/* Hero Skeleton */}
        <Skeleton className="relative mb-12 h-[400px] w-full rounded-lg md:h-[500px]" />

        {/* Featured Tourist Spots Skeletons */}
        <section className="mb-12">
          <Skeleton className="mb-6 h-9 w-3/4 mx-auto md:w-1/2" /> {/* Title Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Video Showcase Skeleton */}
        <section className="mb-12">
          <Skeleton className="mb-6 h-9 w-3/4 mx-auto md:w-1/2" /> {/* Title Skeleton */}
          <Skeleton className="aspect-video w-full max-w-3xl mx-auto rounded-lg" />
        </section>
        
        {/* Explore Establishments Skeletons */}
        <Skeleton className="mb-2 h-9 w-3/4 mx-auto md:w-1/2" /> {/* Title Skeleton */}
        <Skeleton className="mb-8 h-6 w-full mx-auto md:w-3/4" /> {/* Subtitle Skeleton */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-12 w-full md:col-span-2 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center">
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
    <div>
      {/* Section 1: Hero Image/Welcome */}
      <section className="relative mb-12 h-[400px] w-full overflow-hidden rounded-lg shadow-xl md:h-[500px]">
        <Image
          src="https://picsum.photos/seed/martins-rn-hero/1600/900"
          alt="Paisagem deslumbrante de Martins, RN"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
          priority
          data-ai-hint="mountain landscape city"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl drop-shadow-lg">
            Bem-vindo a Chill Martins!
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow-md">
            Descubra a serenidade e as belezas da serra potiguar. Explore, relaxe e aproveite.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md">
            <Link href="/map">Explore o Mapa Interativo</Link>
          </Button>
        </div>
      </section>

      {/* Section 2: Featured Tourist Spots */}
      {touristSpots.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Conheça as Maravilhas de Martins
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {touristSpots.map(spot => (
              <BusinessCard key={spot.id} business={spot} />
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Video Showcase */}
      <section className="mb-12">
        <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Martins em Movimento
        </h2>
        <div className="aspect-video w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-xl bg-muted border border-border">
          <div className="relative h-full w-full">
            <Image 
              src="https://picsum.photos/seed/martins-video-thumb/1280/720" 
              alt="Thumbnail de vídeo sobre as belezas de Martins" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="nature travel video"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity hover:opacity-75">
              <button 
                aria-label="Assistir vídeo sobre Martins" 
                className="group p-3 bg-background/80 rounded-full text-primary backdrop-blur-sm transition-all hover:bg-background hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black/50"
                onClick={() => {
                  // In a real app, this would open a modal or navigate to a video player
                  const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Placeholder video
                  window.open(videoUrl, "_blank");
                  alert('Abrindo vídeo demonstrativo em nova aba...');
                }}
              >
                <Play className="h-10 w-10 fill-primary md:h-12 md:w-12 transition-transform group-hover:scale-105" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Clique para assistir e encante-se com as paisagens e a cultura vibrante de Martins.
        </p>
      </section>

      {/* Section 4: Explore Other Establishments */}
      <section className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Explore Outros Estabelecimentos
        </h2>
        <p className="text-lg text-foreground/80">
          Encontre restaurantes, hotéis, lojas e serviços em Martins.
        </p>
      </section>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar por nome, tipo ou descrição..." />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full rounded-lg bg-background py-3 text-base shadow-sm focus:ring-2 focus:ring-primary">
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
        <div className="mt-12 flex flex-col items-center justify-center text-center">
            <Frown className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground">Nenhum estabelecimento encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros de busca ou categoria.
            </p>
          </div>
      )}

      {filteredListedBusinesses.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredListedBusinesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
