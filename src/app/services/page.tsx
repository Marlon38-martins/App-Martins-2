// src/app/services/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getGramadoBusinesses, type GramadoBusiness } from '@/services/gramado-businesses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BusinessTypeIcon } from '@/components/icons';
import { slugify } from '@/lib/utils';
import { Frown, ArrowRight } from 'lucide-react';

interface Category {
  name: string;
  slug: string;
  icon?: GramadoBusiness['icon'];
  count: number;
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      setError(null);
      try {
        const businesses = await getGramadoBusinesses();
        const categoryMap = new Map<string, { count: number; icon?: GramadoBusiness['icon'] }>();

        businesses.forEach(business => {
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
        setCategories(formattedCategories);
      } catch (err) {
        setError('Falha ao carregar categorias de serviços. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <div> {/* Removed container and padding classes */}
      <section className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Nossos Parceiros e Serviços
        </h2>
        <p className="text-lg text-foreground/80">
          Explore e contrate serviços dos melhores estabelecimentos de Martins.
        </p>
      </section>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <Skeleton className="mb-2 h-8 w-8 rounded-md" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <div className="p-6 pt-0">
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

      {!isLoading && !error && categories.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <Frown className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-foreground">Nenhuma categoria de serviço encontrada</h3>
          <p className="text-muted-foreground">
            Parece que ainda não há serviços cadastrados.
          </p>
        </div>
      )}

      {!isLoading && !error && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map(category => (
            <Card key={category.slug} className="flex transform flex-col overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader className="pb-2">
                {category.icon && <BusinessTypeIcon type={category.icon} className="mb-3 h-10 w-10 text-primary" />}
                <CardTitle className="text-xl font-semibold text-primary">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{category.count} estabelecimento(s)</p>
              </CardContent>
              <div className="p-6 pt-0">
                 <Link href={`/services/${category.slug}`} className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 w-full">
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
