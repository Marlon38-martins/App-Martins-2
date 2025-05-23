// src/app/partner/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { useRouter } from 'next/navigation'; // Not needed for public access
// import { useAuth } from '@/hooks/use-auth-client'; // Not needed for public access
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
    // ShieldAlert, // No longer needed for access control
    QrCode as QrCodeIcon
} from 'lucide-react';
import { BusinessTypeIcon } from '@/components/icons';

// const MOCK_PARTNER_EMAIL = 'partner@example.com'; // Not used for access control
const MOCK_PARTNER_BUSINESS_ID = '1'; 
// const ADMIN_EMAIL = 'admin@example.com'; // Not used for access control


export default function PartnerDashboardPage() {
  // const { user, isAdmin, loading: authLoading } = useAuth(); // Auth checks removed
  // const router = useRouter(); // Not needed for auth redirection
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [canAccess, setCanAccess] = useState(false); // Access is now public

  useEffect(() => {
    // Public access: no need for auth checks before loading data
    const businessIdToLoad = MOCK_PARTNER_BUSINESS_ID; 

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
    } else {
        setIsLoadingData(false);
        setError("ID do estabelecimento do parceiro não definido.");
    }
  }, []);

  if (isLoadingData) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="mb-4 h-8 w-2/3" />
        <Card className="shadow-md">
          <CardHeader className="p-3"><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent className="space-y-3 p-3">
            <div className="grid md:grid-cols-3 gap-3">
                <Skeleton className="h-32 w-full md:col-span-1 rounded-md" />
                <div className="md:col-span-2 space-y-1.5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="mt-1.5 h-8 w-1/3" />
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader className="p-3"><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent className="space-y-3 p-3">
            <Skeleton className="h-14 w-full rounded-md" />
            <Skeleton className="h-14 w-full rounded-md" />
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="p-3"><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent className="p-3"><Skeleton className="h-8 w-full" /></CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          {/* <ShieldAlert className="h-5 w-5" /> */}
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
        <CardHeader className="p-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center">
              {business.icon && <BusinessTypeIcon type={business.icon} className="mr-2 h-5 w-5 text-accent hidden sm:block" />}
              <CardTitle className="text-md text-accent md:text-lg">{business.name}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Button variant="outline" size="sm" asChild className="text-xs h-7 px-2">
                    <Link href={`/partner/edit-business/${business.id}`}> 
                        <Edit3 className="mr-1.5 h-3 w-3" /> Editar Detalhes
                    </Link>
                </Button>
                <Button variant="default" size="sm" asChild className="text-xs h-7 px-2">
                    <Link href={`/business/${business.id}`} target="_blank">
                        <Eye className="mr-1.5 h-3 w-3" /> Ver Página
                    </Link>
                </Button>
            </div>
          </div>
          <CardDescription className="text-xs mt-1">Visualize e atualize os dados do seu estabelecimento.</CardDescription>
        </CardHeader>
        <CardContent className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
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
          <div className="md:col-span-2 space-y-1">
            <div>
                <p className="text-xs font-medium text-muted-foreground">Tipo</p>
                <p className="text-sm text-foreground">{business.type}</p>
            </div>
             <Separator className="my-1"/>
            <div>
                <p className="text-xs font-medium text-muted-foreground">Endereço</p>
                <p className="text-foreground text-sm">{business.address}</p>
            </div>
            {business.phoneNumber && (
                <>
                    <Separator className="my-1"/>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Telefone</p>
                        <p className="text-foreground text-sm">{business.phoneNumber}</p>
                    </div>
                </>
            )}
            {business.website && (
                 <>
                    <Separator className="my-1"/>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Website</p>
                        <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate text-sm">
                            {business.website}
                        </a>
                    </div>
                </>
            )}
            <Separator className="my-1"/>
            <div>
                <p className="text-xs font-medium text-muted-foreground">Descrição Completa</p>
                <p className="text-foreground/90 text-xs leading-relaxed line-clamp-3">{business.fullDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-md text-accent flex items-center md:text-lg">
              <Tag className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Minhas Ofertas Atuais ({deals.length})
            </CardTitle>
            <Button asChild size="sm" className="text-xs h-7 px-2">
              <Link href="/partner/manage-offers">
                <PlusCircle className="mr-1.5 h-3 w-3" /> Adicionar Oferta
              </Link>
            </Button>
          </div>
          <CardDescription className="text-xs mt-1">Gerencie as promoções ativas para seu estabelecimento.</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          {deals.length > 0 ? (
            <div className="space-y-3">
              {deals.map(deal => (
                <Card key={deal.id} className="bg-muted/30 p-2.5">
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
                                    src={`https://placehold.co/200x200.png?text=QR+${deal.id.substring(0,10)}`}
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
                             <Button asChild variant="outline" size="sm" className="text-xs h-7 px-2 py-1">
                                <Link href={`/partner/edit-offer/${deal.id}`}>
                                  <Settings2 className="mr-1.5 h-3 w-3" /> Editar
                                </Link>
                            </Button>
                        </div>
                    </div>
                     <Separator className="my-1.5"/>
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
        <CardFooter className="p-3">
            <p className="text-xs text-muted-foreground">
                Mantenha suas ofertas atualizadas e atrativas! QR Codes são gerados automaticamente.
            </p>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="p-3">
            <CardTitle className="text-md text-accent flex items-center md:text-lg">
                <BarChart3 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Visão Geral do Desempenho
            </CardTitle>
            <CardDescription className="text-xs mt-1">Acompanhe o impacto do Guia Mais no seu negócio.</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
            <Alert variant="default" className="bg-secondary/20 border-secondary text-xs">
                <BarChart3 className="h-4 w-4 text-secondary-foreground"/>
                <AlertTitle className="text-secondary-foreground">Em Breve!</AlertTitle>
                <AlertDescription>
                Esta seção mostrará estatísticas sobre visualizações, resgates de ofertas e mais.
                </AlertDescription>
            </Alert>
        </CardContent>
         <CardFooter className="p-3">
            <p className="text-xs text-muted-foreground">
                Utilize esses dados para otimizar suas estratégias.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
