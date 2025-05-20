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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    Building, 
    Tag, 
    Edit3, 
    ShieldAlert, 
    ArrowLeft, 
    PlusCircle, 
    Eye, 
    BarChart3, // For performance
    Settings2 // For editing an offer
} from 'lucide-react';
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
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="mb-6 h-10 w-2/3" />
        <Card className="shadow-lg">
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-48 w-full md:w-1/3 rounded-md" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
            <Skeleton className="mt-2 h-10 w-1/4" />
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent><Skeleton className="h-10 w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
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
    <div className="p-4 md:p-6 space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Painel do Meu Estabelecimento</h1>
        <p className="text-muted-foreground">Gerencie as informações e ofertas do seu negócio.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center">
              {business.icon && <BusinessTypeIcon type={business.icon} className="mr-3 h-8 w-8 text-accent hidden sm:block" />}
              <CardTitle className="text-2xl text-accent">{business.name}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/partner/edit-business/${business.id}`}> 
                        <Edit3 className="mr-2 h-4 w-4" /> Editar Detalhes
                    </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                    <Link href={`/business/${business.id}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" /> Ver Página Pública
                    </Link>
                </Button>
            </div>
          </div>
          <CardDescription>Visualize e atualize os dados do seu estabelecimento, incluindo a imagem principal.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="relative aspect-video w-full rounded-md overflow-hidden shadow-md">
              <Image 
                src={business.imageUrl} 
                alt={`Imagem de ${business.name}`} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={`${business.type} exterior detail`}
              />
            </div>
             <p className="text-xs text-muted-foreground mt-1 text-center">Imagem principal. Edite em "Editar Detalhes".</p>
          </div>
          <div className="md:col-span-2 space-y-3">
            <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                <p className="text-lg text-foreground">{business.type}</p>
            </div>
             <Separator />
            <div>
                <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                <p className="text-foreground">{business.address}</p>
            </div>
            {business.phoneNumber && (
                <>
                    <Separator />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                        <p className="text-foreground">{business.phoneNumber}</p>
                    </div>
                </>
            )}
            {business.website && (
                 <>
                    <Separator />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Website</p>
                        <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate">
                            {business.website}
                        </a>
                    </div>
                </>
            )}
            <Separator />
            <div>
                <p className="text-sm font-medium text-muted-foreground">Descrição Completa</p>
                <p className="text-foreground/90 text-sm leading-relaxed line-clamp-4">{business.fullDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
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
          <CardDescription>Visualize e gerencie as promoções ativas para seu estabelecimento no Guia Mais.</CardDescription>
        </CardHeader>
        <CardContent>
          {deals.length > 0 ? (
            <div className="space-y-4">
              {deals.map(deal => (
                <Card key={deal.id} className="bg-muted/30 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                            <h4 className="font-semibold text-lg text-primary">{deal.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{deal.description}</p>
                            <div>
                                {deal.isPay1Get2 && <Badge variant="destructive" className="mr-1 bg-accent text-accent-foreground">Pague 1 Leve 2</Badge>}
                                {deal.discountPercentage && <Badge variant="default" className="bg-primary text-primary-foreground">{deal.discountPercentage}% OFF</Badge>}
                            </div>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:ml-auto flex-shrink-0">
                            {/* Placeholder for editing a specific deal. In a real app, this would link to /partner/edit-offer/[dealId] */}
                            <Button variant="outline" size="sm" disabled title="Funcionalidade de edição de oferta em breve">
                                <Settings2 className="mr-2 h-4 w-4" /> Editar Oferta
                            </Button>
                        </div>
                    </div>
                     <Separator className="my-3" />
                    <p className="text-xs text-muted-foreground"><strong>Termos:</strong> {deal.termsAndConditions}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
                <Tag className="h-4 w-4"/>
                <AlertTitle>Nenhuma Oferta Cadastrada</AlertTitle>
                <AlertDescription>Você ainda não cadastrou nenhuma oferta. Clique em "Adicionar Nova Oferta" para começar a atrair mais clientes!</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Mantenha suas ofertas atualizadas e atrativas para maximizar o engajamento dos membros Guia Mais!
            </p>
        </CardFooter>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl text-accent flex items-center">
                <BarChart3 className="mr-3 h-7 w-7" />
                Visão Geral do Desempenho
            </CardTitle>
            <CardDescription>Acompanhe o impacto do Guia Mais no seu negócio.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert variant="default" className="bg-secondary/20 border-secondary">
                <BarChart3 className="h-4 w-4 text-secondary-foreground"/>
                <AlertTitle className="text-secondary-foreground">Em Breve!</AlertTitle>
                <AlertDescription>
                Esta seção mostrará estatísticas sobre visualizações da sua página, resgates de ofertas e mais. Estamos trabalhando para trazer esses insights valiosos para você!
                </AlertDescription>
            </Alert>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">
                Utilize esses dados para otimizar suas ofertas e estratégias de marketing.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

