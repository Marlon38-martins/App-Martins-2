
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
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
    Building, 
    Tag, 
    Edit3, 
    ArrowLeft, 
    PlusCircle, 
    Eye, 
    BarChart3, 
    Settings2,
    ShieldAlert,
    QrCode as QrCodeIcon // Added QrCodeIcon
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
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/partner/dashboard');
      } else {
        const isMockPartner = user.email === MOCK_PARTNER_EMAIL;
        if (isAdmin || isMockPartner) {
          setCanAccess(true);
          const businessIdToLoad = isMockPartner ? MOCK_PARTNER_BUSINESS_ID : (isAdmin ? MOCK_PARTNER_BUSINESS_ID : null); // Admin can see mock partner's dash for now

          if (businessIdToLoad) {
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
          } else if (isAdmin && !businessIdToLoad){ // Admin but no specific business to show
            setIsLoadingData(false);
            setError("Como administrador, por favor selecione um parceiro para ver o painel detalhado a partir da lista de parceiros.");
          } else {
             setIsLoadingData(false);
             setError("ID do estabelecimento do parceiro não definido.");
          }
        } else {
          setCanAccess(false);
          setIsLoadingData(false);
        }
      }
    }
  }, [user, isAdmin, authLoading, router]);

  if (authLoading || isLoadingData) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="mb-4 h-8 w-2/3" />
        <Card className="shadow-md">
          <CardHeader><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-3 gap-4">
                <Skeleton className="h-40 w-full md:col-span-1 rounded-md" />
                <div className="md:col-span-2 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
            <Skeleton className="mt-2 h-9 w-1/3" />
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent><Skeleton className="h-9 w-full" /></CardContent>
        </Card>
      </div>
    );
  }
  
  if (!canAccess && !authLoading) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md text-center">
          <ShieldAlert className="h-6 w-6 mx-auto mb-2" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Você não tem permissão para acessar esta área.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar para Início</Link>
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
         <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/partner/panel"><ArrowLeft className="mr-1.5 h-4 w-4"/> Voltar ao Painel</Link>
        </Button>
      </div>
    );
  }

  if (!business) {
    return <div className="p-6 text-center">Estabelecimento não encontrado ou não associado.</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Button asChild variant="outline" size="sm" className="mb-1">
        <Link href="/partner/panel">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <div className="mb-4">
        <h1 className="text-xl font-bold text-primary md:text-2xl">Painel do Meu Estabelecimento</h1>
        <p className="text-muted-foreground text-xs md:text-sm">Gerencie as informações e ofertas do seu negócio.</p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center">
              {business.icon && <BusinessTypeIcon type={business.icon} className="mr-2 h-6 w-6 text-accent hidden sm:block" />}
              <CardTitle className="text-lg text-accent md:text-xl">{business.name}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Button variant="outline" size="sm" asChild className="text-xs h-8">
                    <Link href={`/partner/edit-business/${business.id}`}> 
                        <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Editar Detalhes
                    </Link>
                </Button>
                <Button variant="default" size="sm" asChild className="text-xs h-8">
                    <Link href={`/business/${business.id}`} target="_blank">
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Ver Página
                    </Link>
                </Button>
            </div>
          </div>
          <CardDescription className="text-xs mt-1">Visualize e atualize os dados do seu estabelecimento.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="relative aspect-video w-full rounded-md border overflow-hidden shadow-sm">
              <Image 
                src={business.imageUrl} 
                alt={`Imagem de ${business.name}`} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={`${business.type} building`}
              />
            </div>
             <p className="text-xs text-muted-foreground mt-1 text-center">Imagem principal.</p>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <div>
                <p className="text-xs font-medium text-muted-foreground">Tipo</p>
                <p className="text-sm text-foreground">{business.type}</p>
            </div>
             <Separator className="my-1.5"/>
            <div>
                <p className="text-xs font-medium text-muted-foreground">Endereço</p>
                <p className="text-foreground text-sm">{business.address}</p>
            </div>
            {business.phoneNumber && (
                <>
                    <Separator className="my-1.5"/>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Telefone</p>
                        <p className="text-foreground text-sm">{business.phoneNumber}</p>
                    </div>
                </>
            )}
            {business.website && (
                 <>
                    <Separator className="my-1.5"/>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Website</p>
                        <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate text-sm">
                            {business.website}
                        </a>
                    </div>
                </>
            )}
            <Separator className="my-1.5"/>
            <div>
                <p className="text-xs font-medium text-muted-foreground">Descrição Completa</p>
                <p className="text-foreground/90 text-xs leading-relaxed line-clamp-3">{business.fullDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg text-accent flex items-center md:text-xl">
              <Tag className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              Minhas Ofertas Atuais ({deals.length})
            </CardTitle>
            <Button asChild size="sm" className="text-xs h-8">
              <Link href="/partner/manage-offers">
                <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Adicionar Oferta
              </Link>
            </Button>
          </div>
          <CardDescription className="text-xs mt-1">Gerencie as promoções ativas para seu estabelecimento.</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          {deals.length > 0 ? (
            <div className="space-y-3">
              {deals.map(deal => (
                <Card key={deal.id} className="bg-muted/30 p-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                            <h4 className="font-semibold text-sm text-primary md:text-base">{deal.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{deal.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {deal.isPay1Get2 && <Badge variant="destructive" className="bg-accent text-accent-foreground text-xs">Pague 1 Leve 2</Badge>}
                                {deal.discountPercentage && deal.discountPercentage > 0 && <Badge variant="default" className="bg-primary text-primary-foreground text-xs">{deal.discountPercentage}% OFF</Badge>}
                            </div>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:ml-auto flex-shrink-0 space-x-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-xs h-7 px-2 py-1">
                                  <QrCodeIcon className="mr-1.5 h-3 w-3" /> Ver QR Code
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center"><QrCodeIcon className="mr-2 h-5 w-5 text-primary"/>QR Code: {deal.title}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apresente este QR Code no caixa ou para o atendente para validar sua oferta (simulação).
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex justify-center my-4">
                                  <Image
                                    src={`https://placehold.co/200x200.png?text=QR+${deal.id}`}
                                    alt={`QR Code para ${deal.title}`}
                                    width={200}
                                    height={200}
                                    data-ai-hint="qr code"
                                  />
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Fechar</AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button variant="outline" size="sm" className="text-xs h-7 px-2 py-1" disabled title="Funcionalidade de edição de oferta em breve">
                                <Settings2 className="mr-1.5 h-3 w-3" /> Editar
                            </Button>
                        </div>
                    </div>
                     <Separator className="my-2"/>
                    <p className="text-xs text-muted-foreground"><strong>Termos:</strong> {deal.termsAndConditions}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Alert className="text-xs">
                <Tag className="h-4 w-4"/>
                <AlertTitle>Nenhuma Oferta Cadastrada</AlertTitle>
                <AlertDescription>Você ainda não cadastrou nenhuma oferta.</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="p-4">
            <p className="text-xs text-muted-foreground">
                Mantenha suas ofertas atualizadas e atrativas! QR Codes são gerados automaticamente.
            </p>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="p-4">
            <CardTitle className="text-lg text-accent flex items-center md:text-xl">
                <BarChart3 className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                Visão Geral do Desempenho
            </CardTitle>
            <CardDescription className="text-xs mt-1">Acompanhe o impacto do Guia Mais no seu negócio.</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
            <Alert variant="default" className="bg-secondary/20 border-secondary text-xs">
                <BarChart3 className="h-4 w-4 text-secondary-foreground"/>
                <AlertTitle className="text-secondary-foreground">Em Breve!</AlertTitle>
                <AlertDescription>
                Esta seção mostrará estatísticas sobre visualizações, resgates de ofertas e mais.
                </AlertDescription>
            </Alert>
        </CardContent>
         <CardFooter className="p-4">
            <p className="text-xs text-muted-foreground">
                Utilize esses dados para otimizar suas estratégias.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

