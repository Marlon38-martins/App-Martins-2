// src/app/search/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getGramadoBusinesses, getAllDeals, type GramadoBusiness, type Deal } from '@/services/gramado-businesses';
import { BusinessCard } from '@/components/business/business-card';
import { DealCard } from '@/components/deal/deal-card';
import { SearchBar } from '@/components/search-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown, Search as SearchIconLucide } from 'lucide-react';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allBusinesses, setAllBusinesses] = useState<GramadoBusiness[]>([]);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [businessData, dealsData] = await Promise.all([
          getGramadoBusinesses(),
          getAllDeals(),
        ]);
        setAllBusinesses(businessData);
        setAllDeals(dealsData);
      } catch (err) {
        setError('Falha ao carregar dados para a busca. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBusinesses = useMemo(() => {
    if (!searchTerm) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allBusinesses.filter(
      (business) =>
        business.name.toLowerCase().includes(lowerSearchTerm) ||
        business.type.toLowerCase().includes(lowerSearchTerm) ||
        business.shortDescription.toLowerCase().includes(lowerSearchTerm) ||
        business.fullDescription.toLowerCase().includes(lowerSearchTerm) ||
        business.address.toLowerCase().includes(lowerSearchTerm)
    );
  }, [allBusinesses, searchTerm]);

  const filteredDeals = useMemo(() => {
    if (!searchTerm) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allDeals.filter(
      (deal) =>
        deal.title.toLowerCase().includes(lowerSearchTerm) ||
        deal.description.toLowerCase().includes(lowerSearchTerm) ||
        (allBusinesses.find(b => b.id === deal.businessId)?.name.toLowerCase().includes(lowerSearchTerm))
    );
  }, [allDeals, allBusinesses, searchTerm]);

  const hasResults = filteredBusinesses.length > 0 || filteredDeals.length > 0;

  return (
    <div className="p-4 md:p-6">
      <section className="mb-8 text-center">
        <SearchIconLucide className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Buscar no Guia Mais
        </h1>
        <p className="text-lg text-foreground/80">
          Encontre estabelecimentos, ofertas e informações.
        </p>
      </section>

      <div className="mb-8 max-w-2xl mx-auto">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Digite o que você procura..."
        />
      </div>

      {isLoading && (
        <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => <Skeleton key={`bs-${i}`} className="h-72 w-full rounded-xl" />)}
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <Skeleton key={`ds-${i}`} className="h-64 w-full rounded-xl" />)}
            </div>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="my-8">
          <Frown className="h-5 w-5" />
          <AlertTitle>Erro na Busca</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && searchTerm && !hasResults && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <Frown className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-foreground">Nenhum resultado encontrado</h3>
          <p className="text-muted-foreground">
            Não encontramos nada para "{searchTerm}". Tente um termo diferente.
          </p>
        </div>
      )}
      
      {!isLoading && !error && !searchTerm && !hasResults && (
         <div className="mt-12 flex flex-col items-center justify-center text-center">
            <SearchIconLucide className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground">O que você gostaria de encontrar?</h3>
            <p className="text-muted-foreground">
             Use a barra de busca acima para encontrar parceiros, ofertas e mais.
            </p>
        </div>
      )}


      {!isLoading && !error && hasResults && (
        <div className="space-y-12">
          {filteredBusinesses.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-semibold text-accent">
                Estabelecimentos Encontrados ({filteredBusinesses.length})
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            </section>
          )}

          {filteredDeals.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-semibold text-accent">
                Ofertas Encontradas ({filteredDeals.length})
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDeals.map((deal) => {
                  const businessForDeal = allBusinesses.find(b => b.id === deal.businessId);
                  return <DealCard key={deal.id} deal={deal} business={businessForDeal} />;
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
