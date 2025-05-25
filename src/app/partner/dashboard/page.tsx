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
    QrCode as QrCodeIcon,
    Star,
    Ticket,
    ShieldAlert
} from 'lucide-react';
import { BusinessTypeIcon } from '@/components/icons';

const MOCK_PARTNER_BUSINESS_ID = '1'; 
const MOCK_PARTNER_EMAIL = 'partner@example.com';

export default function PartnerDashboardPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
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
      } else if (user.email === MOCK_PARTNER_EMAIL || isAdmin) {
        setCanAccess(true);
      } else {
        setCanAccess(false);
        setError("Acesso negado. Esta área é restrita.");
        setIsLoadingData(false); // Stop loading if access is denied early
      }
    }
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    if (!canAccess || !user) return; 

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
  }, [canAccess, user]); 

  const normalDeals = deals.filter(deal => !deal.isVipOffer);
  const vipDeals = deals.filter(deal => deal.isVipOffer);

  if (authLoading || (!canAccess && !authLoading) || (canAccess && isLoadingData)) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="mb-6 h-8 w-2/3" />
        <Card className="shadow-lg">
          <CardHeader className="p-6"><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent className="space-y-3 p-6">
            <div className="grid md:grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full md:col-span-1 rounded-md" />
                <div className="md:col-span-2 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
            <Skeleton className="mt-2 h-8 w-1/3" />
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader className="p-6"><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
   if (!canAccess && !authLoading) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md text-center">
          <ShieldAlert className="mx-auto mb-2 h-6 w-6" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>{error || "Você não tem permissão para visualizar esta página."}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar para Início</Link>
        </Button>
      </div>
    );
  }
  
  if (error && canAccess) { 
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" className="mt-6">
          <Link href="/partner/panel"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar ao Painel</Link>
        </Button>
      </div>
    );
  }

  if (!business) {
    return <div className="p-6 text-center">Estabelecimento não encontrado ou não associado.</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Button asChild variant="outline" className="mb-4">
        <Link href="/partner/panel">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">Painel do Estabelecimento</h1>
        <p className="text-muted-foreground">Gerencie as informações e ofertas do seu negócio.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center">
              {business.icon && <BusinessTypeIcon type={business.icon} className="mr-2 h-6 w-6 text-accent hidden sm:block" />}
              <CardTitle className="text-xl text-accent md:text-2xl">{business.name}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/partner/edit-business/${business.id}`}> 
                        <Edit3 className="mr-1.5 h-4 w-4" /> Editar Detalhes
                    </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                    <Link href={`/business/${business.id}`} target="_blank">
                        <Eye className="mr-1.5 h-4 w-4" /> Ver Página Pública
                    </Link>
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="relative aspect-video w-full rounded-lg border overflow-hidden shadow-md">
              <Image 
                src={business.imageUrl} 
                alt={`Imagem de ${business.name}`} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={`${business.type} building`}
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                <p className="text-foreground">{business.type}</p>
            </div>
            <Separator className="my-2"/>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                <p className="text-foreground text-sm">{business.address}</p>
            </div>
            {business.phoneNumber && (
                <> <Separator className="my-2"/> <div> <p className="text-sm font-medium text-muted-foreground">Telefone</p> <p className="text-foreground text-sm">{business.phoneNumber}</p> </div> </>
            )}
            {business.website && (
                 <> <Separator className="my-2"/> <div> <p className="text-sm font-medium text-muted-foreground">Website</p> <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate text-sm"> {business.website} </a> </div> </>
            )}
            <Separator className="my-2"/>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Descrição Completa</p>
                <p className="text-foreground/90 text-sm leading-relaxed line-clamp-3">{business.fullDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-xl text-accent flex items-center md:text-2xl">
              <Tag className="mr-2 h-5 w-5" />
              Minhas Ofertas Atuais ({deals.length})
            </CardTitle>
            <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                <Link href="/partner/add-normal-offer">
                    <PlusCircle className="mr-1.5 h-4 w-4" /> Adicionar Oferta Normal
                </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-500/10 hover:text-purple-700">
                <Link href="/partner/add-vip-offer">
                    <Star className="mr-1.5 h-4 w-4 text-yellow-400 fill-yellow-400" /> Adicionar Oferta VIP
                </Link>
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
              <Ticket className="mr-2 h-5 w-5" />
              Ofertas Normais ({normalDeals.length})
            </h3>
            {normalDeals.length > 0 ? (
              <div className="space-y-3">
                {normalDeals.map(deal => (
                  <Card key={deal.id} className="bg-muted/50 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div>
                        <h4 className="font-semibold text-primary md:text-lg">{deal.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{deal.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {deal.isPay1Get2 && <Badge variant="destructive" className="bg-accent text-accent-foreground text-xs">Pague 1 Leve 2</Badge>}
                          {deal.discountPercentage && deal.discountPercentage > 0 && <Badge variant="default" className="bg-primary text-primary-foreground text-xs">{deal.discountPercentage}% OFF</Badge>}
                        </div>
                         <p className="mt-2 text-xs text-muted-foreground/80">Termos: {deal.termsAndConditions.substring(0, 100)}{deal.termsAndConditions.length > 100 ? '...' : ''}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 sm:ml-auto flex-shrink-0 space-x-2">
                        <AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-xs"><QrCodeIcon className="mr-1.5 h-3.5 w-3.5" /> Ver QR</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle className="flex items-center"><QrCodeIcon className="mr-2 h-5 w-5 text-primary"/>QR Code: {deal.title}</AlertDialogTitle><AlertDialogDescription>Apresente este QR Code no caixa ou para o atendente para validar sua oferta (simulação).</AlertDialogDescription></AlertDialogHeader><div className="flex justify-center my-4"><Image src={`https://placehold.co/150x150.png?text=QR+${deal.id.substring(0,8)}`} alt={`QR Code para ${deal.title}`} width={150} height={150} data-ai-hint="qr code"/></div><AlertDialogFooter><AlertDialogCancel>Fechar</AlertDialogCancel></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        <Button asChild variant="outline" size="sm" className="text-xs"><Link href={`/partner/edit-offer/${deal.id}`}><Settings2 className="mr-1.5 h-3.5 w-3.5" /> Editar</Link></Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert className="text-sm"><Ticket className="h-4 w-4"/><AlertTitle className="text-sm">Nenhuma Oferta Normal</AlertTitle><AlertDescription className="text-xs">Você ainda não cadastrou nenhuma oferta normal.</AlertDescription></Alert>
            )}
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-2 flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-400 fill-yellow-400" />
              Ofertas VIP Especiais ({vipDeals.length})
            </h3>
            {vipDeals.length > 0 ? (
              <div className="space-y-3">
                {vipDeals.map(deal => (
                  <Card key={deal.id} className="bg-purple-500/10 border-purple-500/30 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div>
                        <h4 className="font-semibold text-purple-700 md:text-lg">{deal.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{deal.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                            <Badge variant="default" className="bg-purple-600 hover:bg-purple-700 text-white text-xs"><Star className="mr-1 h-3 w-3"/> VIP</Badge>
                            {deal.isPay1Get2 && <Badge variant="destructive" className="bg-accent text-accent-foreground text-xs">Pague 1 Leve 2</Badge>}
                            {deal.discountPercentage && deal.discountPercentage > 0 && <Badge variant="default" className="bg-primary text-primary-foreground text-xs">{deal.discountPercentage}% OFF</Badge>}
                        </div>
                         <p className="mt-2 text-xs text-muted-foreground/80">Termos: {deal.termsAndConditions.substring(0, 100)}{deal.termsAndConditions.length > 100 ? '...' : ''}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 sm:ml-auto flex-shrink-0 space-x-2">
                        <AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-xs"><QrCodeIcon className="mr-1.5 h-3.5 w-3.5" /> Ver QR</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle className="flex items-center"><QrCodeIcon className="mr-2 h-5 w-5 text-primary"/>QR Code VIP: {deal.title}</AlertDialogTitle><AlertDialogDescription>Apresente este QR Code no caixa ou para o atendente para validar sua oferta VIP (simulação).</AlertDialogDescription></AlertDialogHeader><div className="flex justify-center my-4"><Image src={`https://placehold.co/150x150.png?text=QR+VIP+${deal.id.substring(0,6)}`} alt={`QR Code VIP para ${deal.title}`} width={150} height={150} data-ai-hint="qr code vip"/></div><AlertDialogFooter><AlertDialogCancel>Fechar</AlertDialogCancel></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        <Button asChild variant="outline" size="sm" className="text-xs"><Link href={`/partner/edit-offer/${deal.id}`}><Settings2 className="mr-1.5 h-3.5 w-3.5" /> Editar</Link></Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert className="text-sm border-purple-500/30 bg-purple-500/5"><Star className="h-4 w-4 text-purple-600"/><AlertTitle className="text-sm text-purple-700">Nenhuma Oferta VIP</AlertTitle><AlertDescription className="text-xs">Você ainda não cadastrou nenhuma oferta VIP especial.</AlertDescription></Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-6">
            <p className="text-xs text-muted-foreground">
                Mantenha suas ofertas atualizadas e atrativas!
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
