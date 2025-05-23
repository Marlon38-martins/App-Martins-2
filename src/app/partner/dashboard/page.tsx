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
    BarChart3, 
    Settings2 
} from 'lucide-react';
import { BusinessTypeIcon } from '@/components/icons';

const MOCK_PARTNER_EMAIL = 'partner@example.com'; 
const MOCK_PARTNER_BUSINESS_ID = '1'; 
const ADMIN_EMAIL = 'admin@example.com';


export default function PartnerDashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDesignatedPartner = user?.email === MOCK_PARTNER_EMAIL;
  const canAccess = isAdmin || isDesignatedPartner;


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/partner/dashboard');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && canAccess) {
      const businessIdToLoad = isDesignatedPartner ? MOCK_PARTNER_BUSINESS_ID : MOCK_PARTNER_BUSINESS_ID; 

      async function loadPartnerData() {
        setIsLoadingData(true);
        setError(null);
        try {
          const businessData = await getGramadoBusinessById(businessIdToLoad);
          if (businessData) {
            setBusiness(businessData);
            const dealsData = await getDealsForBusiness(businessIdToLoad);
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
    } else if (user && !canAccess) {
      setIsLoadingData(false); 
    }
  }, [user, canAccess, isDesignatedPartner, isAdmin]);

  if (authLoading || (canAccess && isLoadingData)) {
    return (
      <div className="space-y-6 p-4 md:p-6"> {/* Reverted padding and space */}
        <Skeleton className="mb-6 h-10 w-2/3" /> {/* Reverted height and margin */}
        <Card className="shadow-lg">
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader> {/* Reverted height */}
          <CardContent className="space-y-4"> {/* Reverted space */}
            <div className="flex flex-col md:flex-row gap-4"> {/* Reverted gap */}
                <Skeleton className="h-48 w-full md:w-1/3 rounded-md" /> {/* Reverted height and radius */}
                <div className="flex-1 space-y-2"> {/* Reverted space */}
                    <Skeleton className="h-6 w-3/4" /> {/* Reverted height */}
                    <Skeleton className="h-4 w-full" /> {/* Reverted height */}
                    <Skeleton className="h-4 w-5/6" /> {/* Reverted height */}
                    <Skeleton className="h-4 w-1/2" /> {/* Reverted height */}
                </div>
            </div>
            <Skeleton className="mt-2 h-10 w-1/3" /> {/* Reverted height and margin */}
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader> {/* Reverted height */}
          <CardContent className="space-y-4"> {/* Reverted space */}
            <Skeleton className="h-16 w-full" /> {/* Reverted height */}
            <Skeleton className="h-16 w-full" /> {/* Reverted height */}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader> {/* Reverted height */}
          <CardContent><Skeleton className="h-10 w-full" /></CardContent> {/* Reverted height */}
        </Card>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-center">Carregando informações do usuário...</div>; 
  }

  if (!canAccess) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"> {/* Reverted padding */}
        <Alert variant="destructive" className="max-w-md text-center"> {/* Reverted max-width */}
          <ShieldAlert className="h-6 w-6 mx-auto mb-2" /> {/* Reverted size and margin */}
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Esta área é exclusiva para parceiros e administradores.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" size="default" className="mt-6"> {/* Reverted size and margin */}
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> {/* Reverted size and margin */}
            Voltar para Início
          </Link>
        </Button>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 md:p-8"> {/* Reverted padding */}
        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" /> {/* Reverted size */}
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" size="default" className="mt-6"> {/* Reverted size and margin */}
          <Link href="/partner/panel"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar ao Painel</Link>
        </Button>
      </div>
    );
  }

  if (!business) {
    return <div className="p-6 text-center">Estabelecimento não encontrado ou não associado.</div>;
  }

  return (
    <div className="p-6 md:p-8 space-y-8"> {/* Reverted padding and space */}
      <Button asChild variant="outline" size="default" className="mb-2"> {/* Reverted size and margin */}
        <Link href="/partner/panel">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <div className="mb-6"> {/* Reverted margin */}
        <h1 className="text-3xl font-bold text-primary">Painel do Meu Estabelecimento</h1> {/* Reverted font size */}
        <p className="text-muted-foreground text-base">Gerencie as informações e ofertas do seu negócio.</p> {/* Reverted font size */}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"> {/* Reverted gap */}
            <div className="flex items-center">
              {business.icon && <BusinessTypeIcon type={business.icon} className="mr-3 h-8 w-8 text-accent hidden sm:block" />} {/* Reverted icon size and margin */}
              <CardTitle className="text-2xl text-accent">{business.name}</CardTitle> {/* Reverted font size */}
            </div>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0"> {/* Reverted gap and margin */}
                <Button variant="outline" size="default" asChild>
                    <Link href={`/partner/edit-business/${business.id}`}> 
                        <Edit3 className="mr-2 h-4 w-4" /> Editar Detalhes
                    </Link>
                </Button>
                <Button variant="default" size="default" asChild>
                    <Link href={`/business/${business.id}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" /> Ver Página Pública
                    </Link>
                </Button>
            </div>
          </div>
          <CardDescription className="text-sm">Visualize e atualize os dados do seu estabelecimento, incluindo a imagem principal.</CardDescription> {/* Reverted font size */}
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Reverted gap */}
          <div className="md:col-span-1">
            <div className="relative aspect-video w-full rounded-md overflow-hidden shadow-md border"> {/* Reverted radius and shadow */}
              <Image 
                src={business.imageUrl} 
                alt={`Imagem de ${business.name}`} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={`${business.type} exterior detail`}
              />
            </div>
             <p className="text-sm text-muted-foreground mt-1 text-center">Imagem principal. Edite em "Editar Detalhes".</p> {/* Reverted margin and font size */}
          </div>
          <div className="md:col-span-2 space-y-3"> {/* Reverted space */}
            <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo</p> {/* Reverted font size */}
                <p className="text-lg text-foreground">{business.type}</p> {/* Reverted font size */}
            </div>
             <Separator className="my-2.5"/> {/* Reverted margin */}
            <div>
                <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                <p className="text-foreground text-base">{business.address}</p> {/* Reverted font size */}
            </div>
            {business.phoneNumber && (
                <>
                    <Separator className="my-2.5"/> {/* Reverted margin */}
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                        <p className="text-foreground text-base">{business.phoneNumber}</p> {/* Reverted font size */}
                    </div>
                </>
            )}
            {business.website && (
                 <>
                    <Separator className="my-2.5"/> {/* Reverted margin */}
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Website</p>
                        <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate text-base"> {/* Reverted font size */}
                            {business.website}
                        </a>
                    </div>
                </>
            )}
            <Separator className="my-2.5"/> {/* Reverted margin */}
            <div>
                <p className="text-sm font-medium text-muted-foreground">Descrição Completa</p>
                <p className="text-foreground/90 text-sm leading-relaxed line-clamp-3">{business.fullDescription}</p> {/* Reverted font size */}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-2xl text-accent flex items-center"> {/* Reverted font size */}
              <Tag className="mr-2.5 h-7 w-7" /> {/* Reverted icon size and margin */}
              Minhas Ofertas Atuais ({deals.length})
            </CardTitle>
            <Button asChild size="default"> {/* Reverted size */}
              <Link href="/partner/manage-offers">
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Oferta
              </Link>
            </Button>
          </div>
          <CardDescription className="text-sm">Visualize e gerencie as promoções ativas para seu estabelecimento no Guia Mais.</CardDescription> {/* Reverted font size */}
        </CardHeader>
        <CardContent>
          {deals.length > 0 ? (
            <div className="space-y-4"> {/* Reverted space */}
              {deals.map(deal => (
                <Card key={deal.id} className="bg-muted/30 p-4 sm:p-6"> {/* Reverted padding */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2"> {/* Reverted gap */}
                        <div>
                            <h4 className="font-semibold text-lg text-primary">{deal.title}</h4> {/* Reverted font size */}
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{deal.description}</p> {/* Reverted font size and margin */}
                            <div>
                                {deal.isPay1Get2 && <Badge variant="destructive" className="mr-1.5 bg-accent text-accent-foreground">Pague 1 Leve 2</Badge>} {/* Removed size */}
                                {deal.discountPercentage && deal.discountPercentage > 0 && <Badge variant="default" className="bg-primary text-primary-foreground">{deal.discountPercentage}% OFF</Badge>} {/* Removed size */}
                            </div>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:ml-auto flex-shrink-0"> {/* Reverted margin */}
                            <Button variant="outline" size="sm" disabled title="Funcionalidade de edição de oferta em breve">
                                <Settings2 className="mr-2 h-4 w-4" /> Editar Oferta
                            </Button>
                        </div>
                    </div>
                     <Separator className="my-3" /> {/* Reverted margin */}
                    <p className="text-sm text-muted-foreground"><strong>Termos:</strong> {deal.termsAndConditions}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Alert className="text-sm"> {/* Reverted font size */}
                <Tag className="h-4 w-4"/> {/* Reverted icon size */}
                <AlertTitle>Nenhuma Oferta Cadastrada</AlertTitle>
                <AlertDescription>Você ainda não cadastrou nenhuma oferta. Clique em "Adicionar Nova Oferta" para começar a atrair mais clientes!</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-sm text-muted-foreground"> {/* Reverted font size */}
                Mantenha suas ofertas atualizadas e atrativas para maximizar o engajamento dos membros Guia Mais!
            </p>
        </CardFooter>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl text-accent flex items-center"> {/* Reverted font size */}
                <BarChart3 className="mr-2.5 h-7 w-7" /> {/* Reverted icon size and margin */}
                Visão Geral do Desempenho
            </CardTitle>
            <CardDescription className="text-sm">Acompanhe o impacto do Guia Mais no seu negócio.</CardDescription> {/* Reverted font size */}
        </CardHeader>
        <CardContent>
            <Alert variant="default" className="bg-secondary/20 border-secondary text-sm"> {/* Reverted font size */}
                <BarChart3 className="h-4 w-4 text-secondary-foreground"/> {/* Reverted icon size */}
                <AlertTitle className="text-secondary-foreground">Em Breve!</AlertTitle>
                <AlertDescription>
                Esta seção mostrará estatísticas sobre visualizações da sua página, resgates de ofertas e mais. Estamos trabalhando para trazer esses insights valiosos para você!
                </AlertDescription>
            </Alert>
        </CardContent>
         <CardFooter>
            <p className="text-sm text-muted-foreground"> {/* Reverted font size */}
                Utilize esses dados para otimizar suas ofertas e estratégias de marketing.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
