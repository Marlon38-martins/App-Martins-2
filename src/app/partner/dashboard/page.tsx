// src/app/partner/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-client';
import { getGramadoBusinessById, getDealsForBusiness, type GramadoBusiness, type Deal } from '@/services/gramado-businesses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Building, Tag, Edit3, ShieldAlert, ArrowLeft, PlusCircle, Eye } from 'lucide-react';
import { BusinessTypeIcon } from '@/components/icons';

const MOCK_PARTNER_EMAIL = 'partner@example.com'; // For demo purposes
const MOCK_PARTNER_BUSINESS_ID = '1'; // Partner "owns" Restaurante Mirante da Serra

export default function PartnerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPartner = user?.email === MOCK_PARTNER_EMAIL;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/partner/dashboard');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && isPartner) {
      async function loadPartnerData() {
        setIsLoadingData(true);
        setError(null);
        try {
          const businessData = await getGramadoBusinessById(MOCK_PARTNER_BUSINESS_ID);
          if (businessData) {
            setBusiness(businessData);
            const dealsData = await getDealsForBusiness(MOCK_PARTNER_BUSINESS_ID);
            setDeals(dealsData);
          } else {
            setError('Estabelecimento não encontrado. Contate o suporte.');
          }
        } catch (err) {
          console.error("Error loading partner data:", err);
          setError('Falha ao carregar dados do estabelecimento.');
        } finally {
          setIsLoadingData(false);
        }
      }
      loadPartnerData();
    } else if (user && !isPartner) {
      setIsLoadingData(false);
    }
  }, [user, isPartner]);

  if (authLoading || isLoadingData) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-1/4 mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    // Should be handled by redirect, but as a fallback
    return <div className="p-6 text-center">Carregando informações do usuário...</div>;
  }

  if (!isPartner) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md text-center">
          <ShieldAlert className="h-6 w-6 mx-auto mb-2" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Esta área é exclusiva para parceiros cadastrados.
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

  if (!business) {
    return <div className="p-6 text-center">Estabelecimento não encontrado ou não associado.</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Painel do Meu Estabelecimento</h1>
          <p className="text-muted-foreground">Gerencie as informações e ofertas do seu negócio.</p>
        </div>
         <Button asChild variant="outline">
              <Link href={`/business/${business.id}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" /> Ver Página Pública
              </Link>
            </Button>
      </div>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-accent flex items-center">
              {business.icon && <BusinessTypeIcon type={business.icon} className="mr-3 h-7 w-7" />}
              {business.name}
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
                <Link href={`/partner/edit-business/${business.id}`}> {/* Placeholder for edit page */}
                    <Edit3 className="mr-2 h-4 w-4" /> Editar Dados
                </Link>
            </Button>
          </div>
          <CardDescription>{business.type} - {business.address}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full max-w-md mb-4 rounded-md overflow-hidden mx-auto sm:mx-0">
            <Image src={business.imageUrl} alt={`Imagem de ${business.name}`} layout="fill" objectFit="cover" data-ai-hint={`${business.type} exterior`} />
          </div>
          <p className="text-foreground/90 line-clamp-3">{business.shortDescription}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-accent flex items-center">
              <Tag className="mr-3 h-7 w-7" />
              Minhas Ofertas Atuais ({deals.length})
            </CardTitle>
            <Button asChild>
              <Link href="/partner/manage-offers">
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Oferta
              </Link>
            </Button>
          </div>
          <CardDescription>Visualize e gerencie as promoções ativas para seu estabelecimento.</CardDescription>
        </CardHeader>
        <CardContent>
          {deals.length > 0 ? (
            <ul className="space-y-3">
              {deals.map(deal => (
                <li key={deal.id} className="p-3 border rounded-md bg-card hover:bg-muted/50">
                  <h4 className="font-semibold text-primary">{deal.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{deal.description}</p>
                  {deal.isPay1Get2 && <span className="text-xs font-bold text-accent">Pague 1 Leve 2</span>}
                  {deal.discountPercentage && <span className="text-xs font-bold text-accent">{deal.discountPercentage}% OFF</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Você ainda não cadastrou nenhuma oferta.</p>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Mantenha suas ofertas atualizadas para atrair mais clientes!
            </p>
        </CardFooter>
      </Card>

      {/* Placeholder for future sections like performance reports */}
    </div>
  );
}
