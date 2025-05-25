// src/app/services/[categorySlug]/page.tsx
'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getGramadoBusinesses, type GramadoBusiness } from '@/services/gramado-businesses';
import { BusinessCard } from '@/components/business/business-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { slugify, unslugify } from '@/lib/utils';
import { Frown, ArrowLeft } from 'lucide-react';
import { SearchBar } from '@/components/search-bar'; 

function CategoryPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = params.categorySlug as string;
  const citySlugFromQuery = searchParams.get('city');

  const [allBusinesses, setAllBusinesses] = useState<GramadoBusiness[]>([]);
  const [filteredAndSearchedBusinesses, setFilteredAndSearchedBusinesses] = useState<GramadoBusiness[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [currentCityName, setCurrentCityName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) {
      setIsLoading(false);
      return;
    }

    const unsluggedCategory = unslugify(categorySlug);
    setCategoryName(unsluggedCategory); 

    async function loadBusinesses() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getGramadoBusinesses();
        setAllBusinesses(data); // Store all, filter later in useMemo
      } catch (err) {
        setError('Falha ao carregar os estabelecimentos. Tente novamente mais tarde.');
        setAllBusinesses([]);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBusinesses();
  }, [categorySlug]);

  // Effect to filter businesses based on category, city, and search term
  useEffect(() => {
    if (isLoading) return; 

    let businessesToFilter = allBusinesses;

    // Filter by city first if citySlugFromQuery exists
    if (citySlugFromQuery) {
      const cityName = unslugify(citySlugFromQuery);
      setCurrentCityName(cityName);
      businessesToFilter = businessesToFilter.filter(
        business => slugify(business.city) === citySlugFromQuery
      );
    } else {
      setCurrentCityName(null);
    }

    // Then filter by category
    const unsluggedCatName = unslugify(categorySlug);
    const categoryBusinesses = businessesToFilter.filter(business => {
      const businessTypeSlug = slugify(business.type);
      if (businessTypeSlug === categorySlug) return true;
      return business.type.toLowerCase() === unsluggedCatName.toLowerCase();
    });

    // Set category name based on actual match if possible
    if (categoryBusinesses.length > 0) {
        const firstMatch = categoryBusinesses[0];
        if (slugify(firstMatch.type) === categorySlug || firstMatch.type.toLowerCase() === unsluggedCatName.toLowerCase()) {
          setCategoryName(firstMatch.type); // Use actual type name from matched business
        }
    } else if (!citySlugFromQuery) { // If no city filter and no category match, reset category name
      setCategoryName(unsluggedCatName); // Fallback to unslugified name
    }


    // Finally, filter by search term
    if (!searchTerm) {
      setFilteredAndSearchedBusinesses(categoryBusinesses);
      return;
    }

    const searchResults = categoryBusinesses.filter(business =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAndSearchedBusinesses(searchResults);

  }, [searchTerm, allBusinesses, categorySlug, citySlugFromQuery, isLoading]);

  const pageTitle = useMemo(() => {
    let title = categoryName || 'Categoria';
    if (currentCityName) {
      title += ` em ${currentCityName}`;
    }
    return title;
  }, [categoryName, currentCityName]);


  return (
    <div>
      <Button asChild variant="outline" className="mb-6">
        <Link href={`/services${citySlugFromQuery ? `?city=${citySlugFromQuery}` : ''}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Categorias {currentCityName ? `em ${currentCityName}` : ''}
        </Link>
      </Button>

      <section className="mb-8">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          {isLoading ? <Skeleton className="h-9 w-3/4 rounded-md" /> : pageTitle}
        </h2>
        <p className="text-lg text-foreground/80">
          Encontre os melhores estabelecimentos e serviços {categoryName ? `em "${categoryName}"` : 'nesta categoria'}
          {currentCityName && ` na cidade de ${currentCityName}`}.
        </p>
      </section>
      
      <div className="mb-8">
        <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            placeholder={categoryName ? `Buscar em ${categoryName}...` : "Buscar estabelecimentos..."} 
        />
      </div>

      {isLoading && (
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
      )}

      {error && (
         <Alert variant="destructive" className="my-8">
           <Frown className="h-5 w-5" />
           <AlertTitle>Erro ao Carregar</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!isLoading && !error && filteredAndSearchedBusinesses.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
            <Frown className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground">Nenhum estabelecimento encontrado</h3>
            <p className="text-muted-foreground">
              Não encontramos estabelecimentos para {categoryName ? `"${categoryName}"` : 'esta categoria'}
              {currentCityName && ` em ${currentCityName}`}
              {searchTerm && ` com o termo "${searchTerm}"`}. Tente ajustar sua busca.
            </p>
          </div>
      )}

      {!isLoading && !error && filteredAndSearchedBusinesses.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSearchedBusinesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}


export default function CategoryPage() {
    return (
        <Suspense fallback={<div>Carregando categoria...</div>}>
            <CategoryPageContent />
        </Suspense>
    )
}
