// src/app/map/page.tsx
'use client';

import type { GramadoBusiness} from '@/services/gramado-businesses';
import { getGramadoBusinesses } from '@/services/gramado-businesses';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BusinessTypeIcon } from '@/components/icons';
import { Frown, MapPin } from 'lucide-react';
import { slugify } from '@/lib/utils'; // Import slugify

interface MapPoint extends GramadoBusiness {
  x: number; // Percentage
  y: number; // Percentage
}

const legendCategories = [
  { name: 'Restaurante', iconType: 'Restaurante' as GramadoBusiness['icon'] },
  { name: 'Hotel/Pousada', iconType: 'Hotel' as GramadoBusiness['icon'], slug: 'hotel' }, // Slug for Pousada/Hotel
  { name: 'Loja', iconType: 'Loja' as GramadoBusiness['icon'] },
  { name: 'Atração Turística', iconType: 'Atração' as GramadoBusiness['icon'], slug: 'atracao' },
  { name: 'Café', iconType: 'Café' as GramadoBusiness['icon'] },
  { name: 'Parque/Mirante', iconType: 'Parque' as GramadoBusiness['icon'], slug: 'parque' },
  { name: 'Serviço', iconType: 'Serviço' as GramadoBusiness['icon'] },
  { name: 'Bar', iconType: 'Bar' as GramadoBusiness['icon'] },
  { name: 'Outro', iconType: 'Default' as GramadoBusiness['icon'], slug: 'outro' },
];


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

    // Filter businesses that have valid latitude and longitude
    const locatableBusinesses = businesses.filter(
      b => typeof b.latitude === 'number' && typeof b.longitude === 'number'
    );

    if (locatableBusinesses.length === 0) return [];

    const latitudes = locatableBusinesses.map(b => b.latitude);
    const longitudes = locatableBusinesses.map(b => b.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);

    const latRange = maxLat - minLat;
    const lonRange = maxLon - minLon;

    // Map only locatable businesses to points
    return locatableBusinesses.map(business => {
      let x = 50; // Default to center
      let y = 50; // Default to center

      // Ensure longitude and latitude are numbers before calculation
      if (lonRange > 0 && typeof business.longitude === 'number') {
        x = ((business.longitude - minLon) / lonRange) * 90 + 5; // Scale to 5-95%
      }
      if (latRange > 0 && typeof business.latitude === 'number') {
        y = (1 - (business.latitude - minLat) / latRange) * 90 + 5; // Scale to 5-95% and invert Y
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
              Não encontramos estabelecimentos com dados de localização válidos para exibir no mapa.
            </p>
          </div>
      )}

      {!isLoading && !error && mapPoints.length > 0 && (
        <TooltipProvider>
          <div className="relative h-[500px] w-full rounded-lg border shadow-lg md:h-[700px] overflow-hidden">
            <Image 
              src="https://placehold.co/1200x900.png" 
              alt="Mapa de fundo ilustrativo de Martins" 
              layout="fill" 
              objectFit="cover" 
              className="opacity-20 -z-10" 
              data-ai-hint="map mountains"
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
                <TooltipContent side="top" className="bg-popover text-popover-foreground border-border shadow-md">
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
            {legendCategories.map(legend => (
              <Link 
                key={legend.name} 
                href={`/services/${legend.slug || slugify(legend.name)}`} 
                className="flex items-center gap-2 p-1 rounded-md hover:bg-muted/50 transition-colors group"
              >
                <BusinessTypeIcon type={legend.iconType || 'Default'} className="h-5 w-5 text-accent group-hover:text-primary" />
                <span className="text-foreground group-hover:text-primary">{legend.name}</span>
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
}

