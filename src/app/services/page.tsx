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
import { Frown, ArrowRight, Search, MapPinned, Filter, Building } from 'lucide-react';
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
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [currentCityName, setCurrentCityName] = useState<string | null>(null);

  const suggestedRegionsStatic = useMemo(() => [
    { name: 'Martins, RN', slug: slugify('Martins, RN') },
    { name: 'Cidade Vizinha, RN', slug: slugify('Cidade Vizinha, RN') },
    { name: 'Pau dos Ferros, RN', slug: slugify('Pau dos Ferros, RN') },
  ], []);

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

  const searchedAndFilteredCities = useMemo(() => {
    if (!citySearchTerm) {
      return []; // Only show search results if there's a search term
    }
    return uniqueCitiesSource.filter(city =>
      city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
    );
  }, [uniqueCitiesSource, citySearchTerm]);

  return (
    <div className="p-3">
      <section className="mb-6 text-center">
        <h2 className="mb-1 text-xl font-bold tracking-tight text-primary md:text-2xl">
          Nossos Parceiros e Serviços
        </h2>
        {currentCityName && (
            <p className="text-md text-accent font-semibold">em {currentCityName}</p>
        )}
        <p className="text-xs text-foreground/80 md:text-sm">
          Explore e contrate serviços dos melhores estabelecimentos.
        </p>
      </section>

      {uniqueCitiesSource.length > 0 && (
        <section className="mb-4 p-3 border rounded-lg shadow-sm bg-card">
          <h3 className="mb-2 text-sm font-semibold text-accent flex items-center">
            <MapPinned className="mr-1.5 h-4 w-4" /> Regiões Sugeridas:
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Button
              variant={!citySlugFromQuery ? 'default' : 'outline'}
              size="sm"
              asChild
              className="text-xs h-8"
            >
              <Link href={`/services`}>
                <span className="flex items-center">
                  <Building className="mr-1 h-3 w-3" /> Todas
                </span>
              </Link>
            </Button>
            {suggestedRegionsStatic.filter(sr => uniqueCitiesSource.some(ucs => ucs.slug === sr.slug)).map(city => (
              <Button
                key={city.slug}
                variant={citySlugFromQuery === city.slug ? 'default' : 'outline'}
                size="sm"
                asChild
                className="text-xs h-8"
              >
                <Link href={`/services?city=${city.slug}`}>
                  <span className="flex items-center">
                    <MapPinned className="mr-1 h-3 w-3" /> {city.name}
                  </span>
                </Link>
              </Button>
            ))}
          </div>

          <h3 className="mb-1.5 text-sm font-semibold text-accent flex items-center">
            <Search className="mr-1.5 h-4 w-4" /> Buscar Outra Região:
          </h3>
          <div className="mb-2">
            <SearchBar
              searchTerm={citySearchTerm}
              onSearchChange={setCitySearchTerm}
              placeholder="Digite o nome da cidade..."
            />
          </div>
          {isLoading && <Skeleton className="h-8 w-full rounded-md" />}
          
          {citySearchTerm && searchedAndFilteredCities.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-1.5">Nenhuma cidade encontrada para "{citySearchTerm}".</p>
          )}

          {citySearchTerm && searchedAndFilteredCities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {searchedAndFilteredCities.map(city => (
                <Button
                  key={city.slug}
                  variant={citySlugFromQuery === city.slug ? 'default' : 'outline'}
                  size="sm"
                  asChild
                  className="text-xs h-8"
                >
                  <Link href={`/services?city=${city.slug}`}>
                    <span className="flex items-center">
                      <MapPinned className="mr-1 h-3 w-3" /> {city.name}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          )}
           {!citySearchTerm && (
             <p className="text-xs text-muted-foreground text-center py-1.5">Digite na busca acima para encontrar mais cidades.</p>
           )}
        </section>
      )}

      <div className="mb-6 max-w-lg mx-auto">
        <h3 className="mb-1.5 text-sm font-semibold text-accent flex items-center">
            <Filter className="mr-1.5 h-4 w-4" /> Buscar por Categoria {currentCityName ? `em ${currentCityName}` : ''}:
        </h3>
        <SearchBar
          searchTerm={categorySearchTerm}
          onSearchChange={setCategorySearchTerm}
          placeholder="Ex: Restaurante, Hotel, Lazer..."
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="p-2.5">
                <Skeleton className="mb-1 h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="flex-grow p-2.5 pt-0">
                <Skeleton className="h-2.5 w-1/2" />
              </CardContent>
              <div className="p-2.5 pt-0">
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="my-4">
          <Frown className="h-4 w-4" />
          <AlertTitle className="text-sm">Erro ao Carregar</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && filteredCategories.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <Frown className="mb-2.5 h-12 w-12 text-muted-foreground" />
          <h3 className="text-md font-semibold text-foreground">
            {allCategories.length > 0 && categorySearchTerm ? `Nenhuma categoria encontrada para "${categorySearchTerm}"` : `Nenhuma categoria encontrada ${currentCityName ? `em ${currentCityName}`:''}`}
          </h3>
          <p className="text-xs text-muted-foreground">
            {allCategories.length > 0 && categorySearchTerm ? 'Tente um termo de busca diferente.' : 'Parece que ainda não há serviços cadastrados para esta seleção.'}
          </p>
        </div>
      )}

      {!isLoading && !error && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredCategories.map(category => (
            <Card key={category.slug} className="flex transform flex-col overflow-hidden shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg group bg-card">
              <CardHeader className="pb-1 p-2.5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-md font-semibold text-primary group-hover:text-accent">{category.name}</CardTitle>
                  {category.icon && <BusinessTypeIcon type={category.icon} className="h-5 w-5 text-muted-foreground group-hover:text-accent" />}
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-2.5 pt-0">
                <p className="text-xs text-muted-foreground">{category.count} estabelecimento(s) encontrado(s)</p>
              </CardContent>
              <div className="p-2.5 pt-1">
                 <Link
                    href={`/services/${category.slug}${citySlugFromQuery ? `?city=${citySlugFromQuery}` : ''}`}
                    className="inline-flex items-center justify-center rounded-md bg-accent px-2.5 py-1.5 text-xs font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/80 focus:outline-none focus:ring-1 focus:ring-accent focus:ring-offset-1 w-full group-hover:bg-primary group-hover:text-primary-foreground h-8"
                  >
                    <span className="flex items-center justify-center w-full">
                        Ver em {category.name}
                        <ArrowRight className="ml-1 h-3 w-3" />
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
