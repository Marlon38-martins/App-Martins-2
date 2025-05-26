// src/app/admin/list-all-partners/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-client';
import { getGramadoBusinesses, type GramadoBusiness } from '@/services/gramado-businesses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, Edit, ArrowLeft, Users, Building } from 'lucide-react';
import { BusinessTypeIcon } from '@/components/icons';

export default function ListAllPartnersPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<GramadoBusiness[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/admin/list-all-partners');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && isAdmin) {
      async function loadAllBusinesses() {
        setIsLoadingData(true);
        setError(null);
        try {
          const businessData = await getGramadoBusinesses();
          setBusinesses(businessData);
        } catch (err) {
          console.error("Error loading all businesses:", err);
          setError('Falha ao carregar lista de parceiros.');
        } finally {
          setIsLoadingData(false);
        }
      }
      loadAllBusinesses();
    } else if (user && !isAdmin) {
      setIsLoadingData(false); // Not an admin, stop loading
    }
  }, [user, isAdmin]);

  if (authLoading || (isAdmin && isLoadingData)) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="h-10 w-1/2 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-center">Redirecionando para login...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md text-center">
          <ShieldAlert className="h-6 w-6 mx-auto mb-2" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Esta área é exclusiva para administradores.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Início
          </Link>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <Users className="mr-3 h-8 w-8" />
            Gerenciar Todos os Parceiros
          </h1>
          <p className="text-muted-foreground">Visualize e edite os detalhes dos estabelecimentos cadastrados.</p>
        </div>
         <Button asChild variant="default">
              <Link href="/admin/add-establishment">
                <Building className="mr-2 h-4 w-4" /> Adicionar Novo Parceiro
              </Link>
            </Button>
      </div>

      {businesses.length === 0 && !isLoadingData && (
        <Alert>
            <Building className="h-4 w-4" />
            <AlertTitle>Nenhum Parceiro Cadastrado</AlertTitle>
            <AlertDescription>Ainda não há estabelecimentos na plataforma. Você pode adicionar um novo parceiro clicando no botão acima.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {businesses.map((business) => (
          <Card key={business.id} className="shadow-md">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center">
                   {business.icon && <BusinessTypeIcon type={business.icon} className="mr-3 h-7 w-7 text-accent hidden sm:block" />}
                  <div>
                    <CardTitle className="text-xl text-accent">{business.name}</CardTitle>
                    <CardDescription>{business.type} - {business.address}</CardDescription>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/edit-partner-details/${business.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="relative h-32 w-full md:w-48 shrink-0 rounded-md overflow-hidden">
                  <Image src={business.imageUrl} alt={`Imagem de ${business.name}`} layout="fill" objectFit="cover" data-ai-hint={`${business.type} building`} />
                </div>
                <p className="text-sm text-foreground/80 line-clamp-3">{business.shortDescription}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
