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
import { Frown, ArrowLeft, ListFilter } from 'lucide-react';
import { SearchBar } from '@/components/search-bar'; 

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.categorySlug as string;

  const [allBusinesses, setAllBusinesses] = useState<GramadoBusiness[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<GramadoBusiness[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) return;

    const unsluggedCategory = unslugify(categorySlug);
    setCategoryName(unsluggedCategory);

    async function loadBusinesses() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getGramadoBusinesses();
        setAllBusinesses(data);
        const categoryBusinesses = data.filter(
          business => slugify(business.type) === categorySlug
        );
        setFilteredBusinesses(categoryBusinesses);

        if (categoryBusinesses.length === 0 && data.length > 0) {
            const businessesByType = data.filter(business => business.type.toLowerCase() === categorySlug.toLowerCase());
            if (businessesByType.length > 0) {
                setFilteredBusinesses(businessesByType);
                setCategoryName(businessesByType[0].type); 
            } else {
                 // setError(`Nenhuma empresa encontrada para a categoria "${unsluggedCategory}". Verifique o link ou tente outra categoria.`);
            }
        }

      } catch (err) {
        setError('Falha ao carregar os estabelecimentos. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBusinesses();
  }, [categorySlug]);

  useEffect(() => {
    const businessesToFilter = allBusinesses.filter(business => slugify(business.type) === categorySlug);
    const results = businessesToFilter.filter(business =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBusinesses(results);
  }, [searchTerm, allBusinesses, categorySlug]);

  return (
    <div> {/* Removed container and padding classes */}
      <Button asChild variant="outline" className="mb-6">
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Categorias
        </Link>
      </Button>

      <section className="mb-8">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          {isLoading ? <Skeleton className="h-9 w-1/2" /> : categoryName || 'Categoria'}
        </h2>
        <p className="text-lg text-foreground/80">
          Encontre os melhores estabelecimentos e serviços em {categoryName ? `"${categoryName}"` : 'esta categoria'}.
        </p>
      </section>
      
      <div className="mb-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder={`Buscar em ${categoryName}...`} />
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

      {!isLoading && !error && filteredBusinesses.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
            <Frown className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground">Nenhum estabelecimento encontrado</h3>
            <p className="text-muted-foreground">
              Não encontramos estabelecimentos para {`"${categoryName}"`} {searchTerm && `com o termo "${searchTerm}"`}. Tente ajustar sua busca.
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
