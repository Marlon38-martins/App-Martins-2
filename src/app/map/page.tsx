
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
import { slugify } from '@/lib/utils';

// TODO: Integrate Google Maps API here for a real interactive map.
// 1. Ensure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is in your .env.local.
// 2. Install a library like `@react-google-maps/api` (`npm install @react-google-maps/api`).
// 3. Replace the placeholder map image and points with a real Google Map:
//    - Import `GoogleMap, LoadScript, Marker` from `@react-google-maps/api`.
//    - Wrap your map component with `<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>`.
//    - Use `<GoogleMap>` to render the map, centering it on Martins.
//    - Use `<Marker>` components to plot each `mapPoint.latitude` and `mapPoint.longitude`.
//    - Add InfoWindow or similar to show business name on marker click.

interface MapPoint extends GramadoBusiness {
  x: number; // Percentage for placeholder map
  y: number; // Percentage for placeholder map
}

const legendCategories = [
  { name: 'Restaurante', iconType: 'Restaurante' as GramadoBusiness['icon'], slug: 'restaurante' },
  { name: 'Hotel/Pousada', iconType: 'Hotel' as GramadoBusiness['icon'], slug: 'hotel' },
  { name: 'Loja', iconType: 'Loja' as GramadoBusiness['icon'], slug: 'loja' },
  { name: 'Atração Turística', iconType: 'Atração' as GramadoBusiness['icon'], slug: 'atracao' },
  { name: 'Café', iconType: 'Café' as GramadoBusiness['icon'], slug: 'cafe' },
  { name: 'Parque/Mirante', iconType: 'Parque' as GramadoBusiness['icon'], slug: 'parque' },
  { name: 'Serviço', iconType: 'Serviço' as GramadoBusiness['icon'], slug: 'servico' },
  { name: 'Bar', iconType: 'Bar' as GramadoBusiness['icon'], slug: 'bar' },
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

    // Default center to Martins, RN coordinates (approx -6.0869, -37.9119) for normalization
    const martinsLat = -6.0869;
    const martinsLon = -37.9119;

    const defaultLatRange = 0.1; // ~11km, adjust as needed for Martins area
    const defaultLonRange = 0.1;


    return locatableBusinesses.map(business => {
      let x = 50; 
      let y = 50; 

      const currentLatRange = latRange > 0.0001 ? latRange : defaultLatRange;
      const currentLonRange = lonRange > 0.0001 ? lonRange : defaultLonRange;
      const currentMinLat = latRange > 0.0001 ? minLat : martinsLat - (defaultLatRange / 2);
      const currentMinLon = lonRange > 0.0001 ? minLon : martinsLon - (defaultLonRange / 2);
      

      if (currentLonRange > 0 && typeof business.longitude === 'number') {
        x = ((business.longitude - currentMinLon) / currentLonRange) * 90 + 5; 
      }
      if (currentLatRange > 0 && typeof business.latitude === 'number') {
        y = (1 - (business.latitude - currentMinLat) / currentLatRange) * 90 + 5; 
      }
      
      // Clamp values to be within 5% and 95% to stay on map
      x = Math.max(5, Math.min(95, x));
      y = Math.max(5, Math.min(95, y));
      
      return { ...business, x, y };
    });
  }, [businesses]);

  return (
    <div>
      <section className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Mapa Interativo de Martins, RN
        </h2>
        <p className="text-lg text-foreground/80">
          Navegue pelos pontos turísticos e estabelecimentos parceiros.
        </p>
      </section>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-[500px] w-full rounded-lg md:h-[700px]" />
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
              Não encontramos estabelecimentos com dados de localização válidos para exibir no mapa de Martins, RN.
            </p>
          </div>
      )}

      {!isLoading && !error && mapPoints.length > 0 && (
        <TooltipProvider>
          <div className="relative h-[500px] w-full rounded-lg border shadow-lg md:h-[700px] overflow-hidden bg-muted/30">
            <Image 
              src="https://placehold.co/1200x900.png" 
              alt="Mapa de fundo ilustrativo de Martins, RN" 
              layout="fill" 
              objectFit="cover" 
              className="opacity-50 -z-10"
              data-ai-hint="Martins RN map"
            />
             <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground bg-background/80 p-4 rounded-md text-center">
                    Integração com Google Maps API pendente.<br/> Esta é uma simulação visual dos pontos em Martins, RN.
                </p>
            </div>
            
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
                  <p className="text-sm text-muted-foreground">{point.type} em {point.city}</p>
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
                className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors group"
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
    
