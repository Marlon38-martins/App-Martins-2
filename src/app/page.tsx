'use client';

import { useState, useEffect, useMemo } from 'react';
import { getGramadoBusinesses, type GramadoBusiness } from '@/services/gramado-businesses';
import { BusinessCard } from '@/components/business/business-card';
import { SearchBar } from '@/components/search-bar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';

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
        setError('Falha ao carregar os estabelecimentos. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBusinesses();
  }, []);

  const categories = useMemo(() => {
    const allCategories = businesses.map(business => business.type);
    return ['all', ...Array.from(new Set(allCategories))];
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const matchesSearchTerm = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                business.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                business.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || business.type === selectedCategory;
      return matchesSearchTerm && matchesCategory;
    });
  }, [businesses, searchTerm, selectedCategory]);

  return (
    <div> {/* Removed container and padding classes */}
      <section className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Explore o Melhor de Martins
        </h2>
        <p className="text-lg text-foreground/80">
          Descubra descontos e promoções exclusivas nos melhores estabelecimentos.
        </p>
      </section>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
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

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
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
      )}

      {error && (
         <Alert variant="destructive" className="my-8">
           <Frown className="h-5 w-5" />
           <AlertTitle>Erro ao Carregar</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!isLoading && !error && filteredBusinesses.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
            <Frown className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground">Nenhum estabelecimento encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros de busca ou categoria.
            </p>
          </div>
      )}

      {!isLoading && !error && filteredBusinesses.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBusinesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
