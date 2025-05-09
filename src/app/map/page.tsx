// src/app/map/page.tsx
'use client';

import type { GramadoBusiness} from '@/services/gramado-businesses';
import { getGramadoBusinesses } from '@/services/gramado-businesses';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added import for Image
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BusinessTypeIcon } from '@/components/icons';
import { Frown, MapPin } from 'lucide-react';

interface MapPoint extends GramadoBusiness {
  x: number; // Percentage
  y: number; // Percentage
}

export default function MapPage() {
  const [businesses, setBusinesses] = useState<GramadoBusiness[]>([]);
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
        setError('Falha ao carregar os estabelecimentos para o mapa. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBusinesses();
  }, []);

  const mapPoints = useMemo((): MapPoint[] => {
    if (!businesses || businesses.length === 0) return [];

    const latitudes = businesses.map(b => b.latitude).filter(lat => typeof lat === 'number');
    const longitudes = businesses.map(b => b.longitude).filter(lon => typeof lon === 'number');

    if (latitudes.length === 0 || longitudes.length === 0) return [];

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);

    const latRange = maxLat - minLat;
    const lonRange = maxLon - minLon;

    return businesses.map(business => {
      let x = 50; // Default to center
      let y = 50; // Default to center

      if (typeof business.longitude === 'number') {
        x = lonRange > 0 ? ((business.longitude - minLon) / lonRange) * 90 + 5 : 50; // Scale to 5-95%
      }
      if (typeof business.latitude === 'number') {
        y = latRange > 0 ? (1 - (business.latitude - minLat) / latRange) * 90 + 5 : 50; // Scale to 5-95% and invert Y
      }
      
      return { ...business, x, y };
    });
  }, [businesses]);

  return (
    <div>
      <section className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Mapa Interativo de Martins
        </h2>
        <p className="text-lg text-foreground/80">
          Navegue pelos pontos turísticos e estabelecimentos parceiros.
        </p>
      </section>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" /> {/* Title skeleton */}
          <Skeleton className="h-[500px] w-full rounded-lg md:h-[700px]" /> {/* Map area skeleton */}
        </div>
      )}

      {error && (
         <Alert variant="destructive" className="my-8">
           <Frown className="h-5 w-5" />
           <AlertTitle>Erro ao Carregar Mapa</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!isLoading && !error && mapPoints.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
            <MapPin className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground">Nenhum ponto para exibir no mapa</h3>
            <p className="text-muted-foreground">
              Não encontramos estabelecimentos com dados de localização para exibir no mapa.
            </p>
          </div>
      )}

      {!isLoading && !error && mapPoints.length > 0 && (
        <TooltipProvider>
          <div className="relative h-[500px] w-full rounded-lg border shadow-lg md:h-[700px] overflow-hidden">
            <Image 
              src="https://picsum.photos/1200/900" 
              alt="Mapa de fundo ilustrativo de Martins" 
              layout="fill" 
              objectFit="cover" 
              className="opacity-20 -z-10" 
              data-ai-hint="map background"
            />
            
            {mapPoints.map((point) => (
              <Tooltip key={point.id}>
                <TooltipTrigger asChild>
                  <Link href={`/business/${point.id}`}>
                    <div
                      className="group absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer p-1"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      aria-label={`Localização de ${point.name}`}
                    >
                      <BusinessTypeIcon 
                        type={point.icon || 'Default'} 
                        className="h-7 w-7 text-primary transition-all duration-200 ease-in-out group-hover:scale-125 group-hover:text-accent" 
                      />
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-background text-foreground border-border shadow-md">
                  <p className="font-semibold">{point.name}</p>
                  <p className="text-sm text-muted-foreground">{point.type}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      )}
       <div className="mt-8 p-4 border rounded-lg bg-card shadow">
          <h3 className="text-lg font-semibold text-primary mb-2">Legenda dos Ícones</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <BusinessTypeIcon type="Restaurante" className="h-5 w-5 text-accent" /> <span>Restaurante</span>
            </div>
            <div className="flex items-center gap-2">
              <BusinessTypeIcon type="Hotel" className="h-5 w-5 text-accent" /> <span>Hotel/Pousada</span>
            </div>
            <div className="flex items-center gap-2">
              <BusinessTypeIcon type="Loja" className="h-5 w-5 text-accent" /> <span>Loja</span>
            </div>
            <div className="flex items-center gap-2">
              <BusinessTypeIcon type="Atração" className="h-5 w-5 text-accent" /> <span>Atração Turística</span>
            </div>
            <div className="flex items-center gap-2">
              <BusinessTypeIcon type="Café" className="h-5 w-5 text-accent" /> <span>Café</span>
            </div>
            <div className="flex items-center gap-2">
              <BusinessTypeIcon type="Parque" className="h-5 w-5 text-accent" /> <span>Parque/Mirante</span>
            </div>
             <div className="flex items-center gap-2">
              <BusinessTypeIcon type="Serviço" className="h-5 w-5 text-accent" /> <span>Serviço</span>
            </div>
            <div className="flex items-center gap-2">
              <BusinessTypeIcon type="Default" className="h-5 w-5 text-accent" /> <span>Outro</span>
            </div>
          </div>
        </div>
    </div>
  );
}

