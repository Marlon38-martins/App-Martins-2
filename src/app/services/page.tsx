
// src/app/services/page.tsx
'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getGramadoBusinesses, type GramadoBusiness } from '@/services/gramado-businesses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BusinessTypeIcon } from '@/components/icons';
import { slugify, unslugify } from '@/lib/utils';
import { Frown, ArrowRight, Search, MapPinned, Filter, Building } from 'lucide-react'; // Added Building
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';


interface Category {
  name: string;
  slug: string;
  icon?: GramadoBusiness['icon'];
  count: number;
}

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const citySlugFromQuery = searchParams.get('city');

  const [allBusinesses, setAllBusinesses] = useState<GramadoBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState(''); // New state for city search
  const [currentCityName, setCurrentCityName] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const businesses = await getGramadoBusinesses();
        setAllBusinesses(businesses);
      } catch (err) {
        setError('Falha ao carregar categorias de serviços. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const businessesForSelectedCity = useMemo(() => {
    if (!citySlugFromQuery) {
      setCurrentCityName(null);
      return allBusinesses;
    }
    const cityName = unslugify(citySlugFromQuery);
    setCurrentCityName(cityName);
    return allBusinesses.filter(business => slugify(business.city) === citySlugFromQuery);
  }, [allBusinesses, citySlugFromQuery]);

  const allCategories = useMemo(() => {
    if (isLoading) return [];
    const categoryMap = new Map<string, { count: number; icon?: GramadoBusiness['icon'] }>();
    businessesForSelectedCity.forEach(business => {
      const existing = categoryMap.get(business.type);
      categoryMap.set(business.type, {
        count: (existing?.count || 0) + 1,
        icon: existing?.icon || business.icon,
      });
    });

    const formattedCategories: Category[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      slug: slugify(name),
      icon: data.icon,
      count: data.count,
    }));
    return formattedCategories.sort((a, b) => a.name.localeCompare(b.name));
  }, [businessesForSelectedCity, isLoading]);

  const filteredCategories = useMemo(() => {
    if (!categorySearchTerm) {
      return allCategories;
    }
    return allCategories.filter(category =>
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );
  }, [allCategories, categorySearchTerm]);

  const uniqueCitiesSource = useMemo(() => {
    if (!allBusinesses.length) return [];
    const cities = allBusinesses.map(b => b.city).filter(Boolean) as string[];
    return Array.from(new Set(cities)).map(city => ({ name: city, slug: slugify(city) })).sort((a,b) => a.name.localeCompare(b.name));
  }, [allBusinesses]);

  const filteredUniqueCities = useMemo(() => {
    if (!citySearchTerm) {
      return uniqueCitiesSource;
    }
    return uniqueCitiesSource.filter(city =>
      city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
    );
  }, [uniqueCitiesSource, citySearchTerm]);

  return (
    <div>
      <section className="mb-8 text-center">
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-primary md:text-3xl">
          Nossos Parceiros e Serviços
        </h2>
        {currentCityName && (
            <p className="text-lg text-accent font-semibold">em {currentCityName}</p>
        )}
        <p className="text-sm text-foreground/80 md:text-base">
          Explore e contrate serviços dos melhores estabelecimentos.
        </p>
      </section>

      {uniqueCitiesSource.length > 1 && (
        <section className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
          <h3 className="mb-3 text-md font-semibold text-accent flex items-center">
            <MapPinned className="mr-2 h-5 w-5" /> Filtrar por Região:
          </h3>
          <div className="mb-3">
            <SearchBar
              searchTerm={citySearchTerm}
              onSearchChange={setCitySearchTerm}
              placeholder="Buscar cidade na região..."
            />
          </div>
          {isLoading && <Skeleton className="h-8 w-full rounded-md" />}
          {!isLoading && filteredUniqueCities.length === 0 && citySearchTerm && (
            <p className="text-sm text-muted-foreground text-center py-2">Nenhuma cidade encontrada para "{citySearchTerm}".</p>
          )}
          {!isLoading && (filteredUniqueCities.length > 0 || !citySearchTerm) && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!citySlugFromQuery ? 'default' : 'outline'}
                size="sm"
                asChild
                className="text-xs"
              >
                <Link href={`/services`}>
                  <span className="flex items-center">
                    <Building className="mr-1.5 h-3.5 w-3.5" /> Todas as Regiões
                  </span>
                </Link>
              </Button>
              {filteredUniqueCities.map(city => (
                <Button
                  key={city.slug}
                  variant={citySlugFromQuery === city.slug ? 'default' : 'outline'}
                  size="sm"
                  asChild
                  className="text-xs"
                >
                  <Link href={`/services?city=${city.slug}`}>
                    <span className="flex items-center">
                      <MapPinned className="mr-1.5 h-3.5 w-3.5" /> {city.name}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="mb-8 max-w-xl mx-auto">
        <h3 className="mb-2 text-md font-semibold text-accent flex items-center">
            <Filter className="mr-2 h-5 w-5" /> Buscar por Categoria {currentCityName ? `em ${currentCityName}` : ''}:
        </h3>
        <SearchBar
          searchTerm={categorySearchTerm}
          onSearchChange={setCategorySearchTerm}
          placeholder="Ex: Restaurante, Hotel, Lazer..."
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="p-3">
                <Skeleton className="mb-1.5 h-7 w-7 rounded-md" />
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent className="flex-grow p-3 pt-0">
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
              <div className="p-3 pt-0">
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="my-6">
          <Frown className="h-5 w-5" />
          <AlertTitle>Erro ao Carregar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && filteredCategories.length === 0 && (
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <Frown className="mb-3 h-14 w-14 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">
            {allCategories.length > 0 && categorySearchTerm ? `Nenhuma categoria encontrada para "${categorySearchTerm}"` : `Nenhuma categoria encontrada ${currentCityName ? `em ${currentCityName}`:''}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {allCategories.length > 0 && categorySearchTerm ? 'Tente um termo de busca diferente.' : 'Parece que ainda não há serviços cadastrados para esta seleção.'}
          </p>
        </div>
      )}

      {!isLoading && !error && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map(category => (
            <Card key={category.slug} className="flex transform flex-col overflow-hidden shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl group bg-card">
              <CardHeader className="pb-1 p-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-primary group-hover:text-accent">{category.name}</CardTitle>
                  {category.icon && <BusinessTypeIcon type={category.icon} className="h-6 w-6 text-muted-foreground group-hover:text-accent" />}
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-3 pt-0">
                <p className="text-xs text-muted-foreground">{category.count} estabelecimento(s) encontrado(s)</p>
              </CardContent>
              <div className="p-3 pt-1">
                 <Link
                    href={`/services/${category.slug}${citySlugFromQuery ? `?city=${citySlugFromQuery}` : ''}`}
                    className="inline-flex items-center justify-center rounded-md bg-accent px-3 py-2 text-xs font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <span className="flex items-center justify-center w-full">
                        Ver em {category.name}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
    return (
        <Suspense fallback={<div>Carregando filtros...</div>}>
            <ServicesPageContent />
        </Suspense>
    )
}

