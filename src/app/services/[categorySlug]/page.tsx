// src/app/services/[categorySlug]/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getGramadoBusinesses, type GramadoBusiness } from '@/services/gramado-businesses';
import { BusinessCard } from '@/components/business/business-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { slugify, unslugify } from '@/lib/utils';
import { Frown, ArrowLeft } from 'lucide-react';
import { SearchBar } from '@/components/search-bar'; 

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.categorySlug as string;

  const [allBusinesses, setAllBusinesses] = useState<GramadoBusiness[]>([]);
  const [filteredAndSearchedBusinesses, setFilteredAndSearchedBusinesses] = useState<GramadoBusiness[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to load businesses and set initial category-filtered list
  useEffect(() => {
    if (!categorySlug) {
      setIsLoading(false);
      return;
    }

    const unsluggedCategory = unslugify(categorySlug);
    // Set category name immediately for display, might be refined later if a direct match is found
    setCategoryName(unsluggedCategory); 

    async function loadAndFilterBusinesses() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getGramadoBusinesses();
        setAllBusinesses(data); // Store all businesses for potential re-filtering by search

        const categoryBusinesses = data.filter(business => {
          const businessTypeSlug = slugify(business.type);
          if (businessTypeSlug === categorySlug) return true;
          // Fallback for direct name match (case-insensitive) if slug doesn't match
          // This helps if URL uses a slightly different slug than the type
          return business.type.toLowerCase() === unsluggedCategory.toLowerCase();
        });
        
        setFilteredAndSearchedBusinesses(categoryBusinesses);

        if (categoryBusinesses.length > 0) {
          // If we matched, ensure categoryName reflects the actual business.type
          // This handles cases where unslugify might not be perfect, e.g. "Loja" vs "lojas"
          const firstMatch = categoryBusinesses[0];
          if (slugify(firstMatch.type) === categorySlug || firstMatch.type.toLowerCase() === unsluggedCategory.toLowerCase()) {
            setCategoryName(firstMatch.type);
          }
        } else {
          // If no businesses match the slug, categoryName remains the unslugified version.
          // The UI will show "Nenhum estabelecimento encontrado".
        }

      } catch (err) {
        setError('Falha ao carregar os estabelecimentos. Tente novamente mais tarde.');
        setAllBusinesses([]);
        setFilteredAndSearchedBusinesses([]);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAndFilterBusinesses();
  }, [categorySlug]);

  // Effect to filter businesses based on search term, acting on the already category-filtered list
  useEffect(() => {
    if (isLoading) return; // Don't filter if initial data isn't loaded

    // Get the base list of businesses for the current category slug
    const unsluggedCatName = unslugify(categorySlug); // For consistent comparison
    const businessesInCurrentCategory = allBusinesses.filter(business => {
        const businessTypeSlug = slugify(business.type);
        if (businessTypeSlug === categorySlug) return true;
        return business.type.toLowerCase() === unsluggedCatName.toLowerCase();
    });

    if (!searchTerm) {
      setFilteredAndSearchedBusinesses(businessesInCurrentCategory);
      return;
    }

    const results = businessesInCurrentCategory.filter(business =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAndSearchedBusinesses(results);
  }, [searchTerm, allBusinesses, categorySlug, isLoading]); // Rerun when search or base data changes

  return (
    <div>
      <Button asChild variant="outline" className="mb-6">
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Categorias
        </Link>
      </Button>

      <section className="mb-8">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          {isLoading ? <Skeleton className="h-9 w-1/2 rounded-md" /> : categoryName || 'Categoria'}
        </h2>
        <p className="text-lg text-foreground/80">
          Encontre os melhores estabelecimentos e serviços em {categoryName ? `"${categoryName}"` : 'esta categoria'}.
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
              Não encontramos estabelecimentos para {categoryName ? `"${categoryName}"` : 'esta categoria'} {searchTerm && `com o termo "${searchTerm}"`}. Tente ajustar sua busca.
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
