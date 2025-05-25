
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
import { Frown, ArrowRight, Search, MapPinned, Filter } from 'lucide-react';
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
    if (isLoading) return []; // Don't compute if still loading all businesses
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

  const uniqueCities = useMemo(() => {
    if (!allBusinesses.length) return [];
    const cities = allBusinesses.map(b => b.city).filter(Boolean);
    return Array.from(new Set(cities)).map(city => ({ name: city, slug: slugify(city) }));
  }, [allBusinesses]);

  return (
    <div>
      <section className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Nossos Parceiros e Serviços
          {currentCityName && <span className="block text-xl text-accent">em {currentCityName}</span>}
        </h2>
        <p className="text-lg text-foreground/80">
          Explore e contrate serviços dos melhores estabelecimentos.
        </p>
      </section>

      {uniqueCities.length > 1 && (
        <section className="mb-6">
          <h3 className="mb-2 text-lg font-semibold text-accent flex items-center">
            <Filter className="mr-2 h-5 w-5" /> Filtrar por Região:
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!citySlugFromQuery ? 'default' : 'outline'}
              size="sm"
              asChild
              className="text-xs"
            >
              <Link href={`/services`}>
                <MapPinned className="mr-1.5 h-3.5 w-3.5" /> Todas
              </Link>
            </Button>
            {uniqueCities.map(city => (
              <Button
                key={city.slug}
                variant={citySlugFromQuery === city.slug ? 'default' : 'outline'}
                size="sm"
                asChild
                className="text-xs"
              >
                <Link href={`/services?city=${city.slug}`}>
                  <MapPinned className="mr-1.5 h-3.5 w-3.5" /> {city.name}
                </Link>
              </Button>
            ))}
          </div>
        </section>
      )}

      <div className="mb-8 max-w-xl mx-auto">
        <SearchBar
          searchTerm={categorySearchTerm}
          onSearchChange={setCategorySearchTerm}
          placeholder="Buscar por categoria de serviço..."
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="p-4">
                <Skeleton className="mb-2 h-8 w-8 rounded-md" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <div className="p-4 pt-0">
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="my-8">
          <Frown className="h-5 w-5" />
          <AlertTitle>Erro ao Carregar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && filteredCategories.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <Frown className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-foreground">
            {allCategories.length > 0 && categorySearchTerm ? `Nenhuma categoria encontrada para "${categorySearchTerm}"` : `Nenhuma categoria encontrada ${currentCityName ? `em ${currentCityName}`:''}`}
          </h3>
          <p className="text-muted-foreground">
            {allCategories.length > 0 && categorySearchTerm ? 'Tente um termo de busca diferente.' : 'Parece que ainda não há serviços cadastrados para esta seleção.'}
          </p>
        </div>
      )}

      {!isLoading && !error && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategories.map(category => (
            <Card key={category.slug} className="flex transform flex-col overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader className="pb-2 p-4">
                {category.icon && <BusinessTypeIcon type={category.icon} className="mb-3 h-10 w-10 text-primary" />}
                <CardTitle className="text-xl font-semibold text-primary">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <p className="text-sm text-muted-foreground">{category.count} estabelecimento(s)</p>
              </CardContent>
              <div className="p-4 pt-0">
                 <Link
                    href={`/services/${category.slug}${citySlugFromQuery ? `?city=${citySlugFromQuery}` : ''}`}
                    className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 w-full"
                  >
                    Ver {category.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
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
