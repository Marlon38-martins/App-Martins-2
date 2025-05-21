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
      <div className="space-y-4 p-3 md:p-4"> {/* Reduced padding and space */}
        <Skeleton className="mb-4 h-8 w-2/3" /> {/* Reduced height and margin */}
        <Card className="shadow-md">
          <CardHeader><Skeleton className="h-7 w-1/2" /></CardHeader> {/* Reduced height */}
          <CardContent className="space-y-3"> {/* Reduced space */}
            <div className="flex flex-col md:flex-row gap-3"> {/* Reduced gap */}
                <Skeleton className="h-40 w-full md:w-1/3 rounded-sm" /> {/* Reduced height and radius */}
                <div className="flex-1 space-y-1.5"> {/* Reduced space */}
                    <Skeleton className="h-5 w-3/4" /> {/* Reduced height */}
                    <Skeleton className="h-3 w-full" /> {/* Reduced height */}
                    <Skeleton className="h-3 w-5/6" /> {/* Reduced height */}
                    <Skeleton className="h-3 w-1/2" /> {/* Reduced height */}
                </div>
            </div>
            <Skeleton className="mt-1.5 h-9 w-1/4" /> {/* Reduced height and margin */}
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader><Skeleton className="h-7 w-1/2" /></CardHeader> {/* Reduced height */}
          <CardContent className="space-y-3"> {/* Reduced space */}
            <Skeleton className="h-14 w-full" /> {/* Reduced height */}
            <Skeleton className="h-14 w-full" /> {/* Reduced height */}
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader><Skeleton className="h-7 w-1/2" /></CardHeader> {/* Reduced height */}
          <CardContent><Skeleton className="h-9 w-full" /></CardContent> {/* Reduced height */}
        </Card>
      </div>
    );
  }

  if (!user) {
    return <div className="p-4 text-center">Carregando informações do usuário...</div>; 
  }

  if (!canAccess) {
    return (
      <div className="p-3 md:p-4 flex flex-col items-center justify-center min-h-[calc(100vh-180px)]"> {/* Reduced padding */}
        <Alert variant="destructive" className="max-w-sm text-center"> {/* Reduced max-width */}
          <ShieldAlert className="h-5 w-5 mx-auto mb-1.5" /> {/* Reduced size and margin */}
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Esta área é exclusiva para parceiros e administradores.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" size="sm" className="mt-4"> {/* Reduced size and margin */}
          <Link href="/">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> {/* Reduced size and margin */}
            Voltar para Início
          </Link>
        </Button>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-3 md:p-4"> {/* Reduced padding */}
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" /> {/* Reduced size */}
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" size="sm" className="mt-4"> {/* Reduced size and margin */}
          <Link href="/partner/panel"><ArrowLeft className="mr-1.5 h-3.5 w-3.5"/> Voltar ao Painel</Link>
        </Button>
      </div>
    );
  }

  if (!business) {
    return <div className="p-4 text-center">Estabelecimento não encontrado ou não associado.</div>;
  }

  return (
    <div className="p-3 md:p-4 space-y-6"> {/* Reduced padding and space */}
      <Button asChild variant="outline" size="sm" className="mb-1.5"> {/* Reduced size and margin */}
        <Link href="/partner/panel">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <div className="mb-4"> {/* Reduced margin */}
        <h1 className="text-2xl font-bold text-primary">Painel do Meu Estabelecimento</h1> {/* Reduced font size */}
        <p className="text-muted-foreground text-sm">Gerencie as informações e ofertas do seu negócio.</p> {/* Reduced font size */}
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5"> {/* Reduced gap */}
            <div className="flex items-center">
              {business.icon && <BusinessTypeIcon type={business.icon} className="mr-2 h-7 w-7 text-accent hidden sm:block" />} {/* Reduced icon size and margin */}
              <CardTitle className="text-xl text-accent">{business.name}</CardTitle> {/* Reduced font size */}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5 sm:mt-0"> {/* Reduced gap and margin */}
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/partner/edit-business/${business.id}`}> 
                        <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Editar Detalhes
                    </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                    <Link href={`/business/${business.id}`} target="_blank">
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Ver Página Pública
                    </Link>
                </Button>
            </div>
          </div>
          <CardDescription>Visualize e atualize os dados do seu estabelecimento, incluindo a imagem principal.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Reduced gap */}
          <div className="md:col-span-1">
            <div className="relative aspect-video w-full rounded-sm overflow-hidden shadow-sm border"> {/* Reduced radius and shadow */}
              <Image 
                src={business.imageUrl} 
                alt={`Imagem de ${business.name}`} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={`${business.type} exterior detail`}
              />
            </div>
             <p className="text-xs text-muted-foreground mt-0.5 text-center">Imagem principal. Edite em "Editar Detalhes".</p> {/* Reduced margin */}
          </div>
          <div className="md:col-span-2 space-y-2"> {/* Reduced space */}
            <div>
                <p className="text-xs font-medium text-muted-foreground">Tipo</p> {/* Reduced font size */}
                <p className="text-base text-foreground">{business.type}</p> {/* Reduced font size */}
            </div>
             <Separator />
            <div>
                <p className="text-xs font-medium text-muted-foreground">Endereço</p>
                <p className="text-foreground text-sm">{business.address}</p> {/* Reduced font size */}
            </div>
            {business.phoneNumber && (
                <>
                    <Separator />
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Telefone</p>
                        <p className="text-foreground text-sm">{business.phoneNumber}</p> {/* Reduced font size */}
                    </div>
                </>
            )}
            {business.website && (
                 <>
                    <Separator />
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Website</p>
                        <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate text-sm"> {/* Reduced font size */}
                            {business.website}
                        </a>
                    </div>
                </>
            )}
            <Separator />
            <div>
                <p className="text-xs font-medium text-muted-foreground">Descrição Completa</p>
                <p className="text-foreground/90 text-xs leading-relaxed line-clamp-3">{business.fullDescription}</p> {/* Reduced font size */}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <CardTitle className="text-xl text-accent flex items-center"> {/* Reduced font size */}
              <Tag className="mr-2 h-6 w-6" /> {/* Reduced icon size and margin */}
              Minhas Ofertas Atuais ({deals.length})
            </CardTitle>
            <Button asChild size="sm"> {/* Reduced size */}
              <Link href="/partner/manage-offers">
                <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Adicionar Nova Oferta
              </Link>
            </Button>
          </div>
          <CardDescription>Visualize e gerencie as promoções ativas para seu estabelecimento no Guia Mais.</CardDescription>
        </CardHeader>
        <CardContent>
          {deals.length > 0 ? (
            <div className="space-y-3"> {/* Reduced space */}
              {deals.map(deal => (
                <Card key={deal.id} className="bg-muted/30 p-2.5 sm:p-3"> {/* Reduced padding */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1.5"> {/* Reduced gap */}
                        <div>
                            <h4 className="font-semibold text-base text-primary">{deal.title}</h4> {/* Reduced font size */}
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-0.5">{deal.description}</p> {/* Reduced font size and margin */}
                            <div>
                                {deal.isPay1Get2 && <Badge variant="destructive" size="sm" className="mr-1 bg-accent text-accent-foreground">Pague 1 Leve 2</Badge>} {/* Added size="sm" */}
                                {deal.discountPercentage && deal.discountPercentage > 0 && <Badge variant="default" size="sm" className="bg-primary text-primary-foreground">{deal.discountPercentage}% OFF</Badge>} {/* Added size="sm" */}
                            </div>
                        </div>
                        <div className="mt-1.5 sm:mt-0 sm:ml-auto flex-shrink-0"> {/* Reduced margin */}
                            <Button variant="outline" size="sm" disabled title="Funcionalidade de edição de oferta em breve">
                                <Settings2 className="mr-1.5 h-3.5 w-3.5" /> Editar Oferta
                            </Button>
                        </div>
                    </div>
                     <Separator className="my-2" /> {/* Reduced margin */}
                    <p className="text-xs text-muted-foreground"><strong>Termos:</strong> {deal.termsAndConditions}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Alert className="text-xs"> {/* Reduced font size */}
                <Tag className="h-3.5 w-3.5"/> {/* Reduced icon size */}
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

      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="text-xl text-accent flex items-center"> {/* Reduced font size */}
                <BarChart3 className="mr-2 h-6 w-6" /> {/* Reduced icon size and margin */}
                Visão Geral do Desempenho
            </CardTitle>
            <CardDescription>Acompanhe o impacto do Guia Mais no seu negócio.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert variant="default" className="bg-secondary/20 border-secondary text-xs"> {/* Reduced font size */}
                <BarChart3 className="h-3.5 w-3.5 text-secondary-foreground"/> {/* Reduced icon size */}
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
