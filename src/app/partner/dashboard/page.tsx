// src/app/partner/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    Ticket
} from 'lucide-react';
import { BusinessTypeIcon } from '@/components/icons';

const MOCK_PARTNER_BUSINESS_ID = '1'; 


export default function PartnerDashboardPage() {
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  const normalDeals = deals.filter(deal => !deal.isVipOffer);
  const vipDeals = deals.filter(deal => deal.isVipOffer);

  if (isLoadingData) {
    return (
      <div className="space-y-4 p-3 md:p-4">
        <Skeleton className="mb-3 h-7 w-2/3" />
        <Card className="shadow-sm">
          <CardHeader className="p-3"><Skeleton className="h-6 w-1/2" /></CardHeader>
          <CardContent className="space-y-2 p-3">
            <div className="grid md:grid-cols-3 gap-2">
                <Skeleton className="h-28 w-full md:col-span-1 rounded-md" />
                <div className="md:col-span-2 space-y-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-full" />
                    <Skeleton className="h-2.5 w-5/6" />
                    <Skeleton className="h-2.5 w-1/2" />
                </div>
            </div>
            <Skeleton className="mt-1 h-7 w-1/3" />
          </CardContent>
        </Card>
         <Card className="shadow-sm">
          <CardHeader className="p-3"><Skeleton className="h-6 w-1/2" /></CardHeader>
          <CardContent className="space-y-2 p-3">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="p-3"><Skeleton className="h-6 w-1/2" /></CardHeader>
          <CardContent className="p-3"><Skeleton className="h-7 w-full" /></CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-3 md:p-4">
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/partner/panel"><ArrowLeft className="mr-1.5 h-3 w-3"/> Voltar ao Painel</Link>
        </Button>
      </div>
    );
  }

  if (!business) {
    return <div className="p-4 text-center text-sm">Estabelecimento não encontrado ou não associado.</div>;
  }

  return (
    <div className="p-3 md:p-4 space-y-4">
      <Button asChild variant="outline" size="sm" className="mb-1">
        <Link href="/partner/panel">
          <ArrowLeft className="mr-1.5 h-3 w-3" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <div className="mb-3">
        <h1 className="text-lg font-bold text-primary md:text-xl">Painel do Estabelecimento</h1>
        <p className="text-muted-foreground text-xs md:text-sm">Gerencie as informações e ofertas do seu negócio.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
            <div className="flex items-center">
              {business.icon && <BusinessTypeIcon type={business.icon} className="mr-1.5 h-4 w-4 text-accent hidden sm:block" />}
              <CardTitle className="text-sm text-accent md:text-base">{business.name}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1 sm:mt-0">
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
        </CardHeader>
        <CardContent className="p-3 grid grid-cols-1 md:grid-cols-3 gap-2">
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
          </div>
          <div className="md:col-span-2 space-y-0.5">
            <div>
                <p className="text-xs font-medium text-muted-foreground">Tipo</p>
                <p className="text-sm text-foreground">{business.type}</p>
            </div>
            <Separator className="my-0.5"/>
            <div>
                <p className="text-xs font-medium text-muted-foreground">Endereço</p>
                <p className="text-foreground text-sm">{business.address}</p>
            </div>
            {business.phoneNumber && (
                <> <Separator className="my-0.5"/> <div> <p className="text-xs font-medium text-muted-foreground">Telefone</p> <p className="text-foreground text-sm">{business.phoneNumber}</p> </div> </>
            )}
            {business.website && (
                 <> <Separator className="my-0.5"/> <div> <p className="text-xs font-medium text-muted-foreground">Website</p> <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate text-sm"> {business.website} </a> </div> </>
            )}
            <Separator className="my-0.5"/>
            <div>
                <p className="text-xs font-medium text-muted-foreground">Descrição Completa</p>
                <p className="text-foreground/90 text-xs leading-relaxed line-clamp-2">{business.fullDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <CardTitle className="text-sm text-accent flex items-center md:text-base">
              <Tag className="mr-1.5 h-4 w-4" />
              Minhas Ofertas ({deals.length})
            </CardTitle>
            <Button asChild size="sm" className="text-xs h-7 px-2">
              <Link href="/partner/manage-offers">
                <PlusCircle className="mr-1.5 h-3 w-3" /> Adicionar Oferta
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          {/* Normal Offers Section */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-1.5 flex items-center">
              <Ticket className="mr-2 h-4 w-4" />
              Ofertas Normais ({normalDeals.length})
            </h3>
            {normalDeals.length > 0 ? (
              <div className="space-y-2">
                {normalDeals.map(deal => (
                  <Card key={deal.id} className="bg-muted/30 p-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1.5">
                      <div>
                        <h4 className="font-semibold text-xs text-primary md:text-sm">{deal.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-0.5">{deal.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {deal.isPay1Get2 && <Badge variant="destructive" className="bg-accent text-accent-foreground text-[10px] px-1 py-0">Pague 1 Leve 2</Badge>}
                          {deal.discountPercentage && deal.discountPercentage > 0 && <Badge variant="default" className="bg-primary text-primary-foreground text-[10px] px-1 py-0">{deal.discountPercentage}% OFF</Badge>}
                        </div>
                      </div>
                      <div className="mt-1 sm:mt-0 sm:ml-auto flex-shrink-0 space-x-1.5">
                        <AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-xs h-6 px-1.5 py-0.5"><QrCodeIcon className="mr-1 h-2.5 w-2.5" /> Ver QR</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle className="flex items-center"><QrCodeIcon className="mr-2 h-5 w-5 text-primary"/>QR Code: {deal.title}</AlertDialogTitle><AlertDialogDescription>Apresente este QR Code no caixa ou para o atendente para validar sua oferta (simulação).</AlertDialogDescription></AlertDialogHeader><div className="flex justify-center my-3"><Image src={`https://placehold.co/150x150.png?text=QR+${deal.id.substring(0,8)}`} alt={`QR Code para ${deal.title}`} width={150} height={150} data-ai-hint="qr code"/></div><AlertDialogFooter><AlertDialogCancel>Fechar</AlertDialogCancel></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        <Button asChild variant="outline" size="sm" className="text-xs h-6 px-1.5 py-0.5"><Link href={`/partner/edit-offer/${deal.id}`}><Settings2 className="mr-1 h-2.5 w-2.5" /> Editar</Link></Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert className="text-xs py-2 px-3"><Ticket className="h-3 w-3"/><AlertTitle className="text-xs">Nenhuma Oferta Normal</AlertTitle><AlertDescription className="text-xs">Você ainda não cadastrou nenhuma oferta normal.</AlertDescription></Alert>
            )}
          </div>

          <Separator className="my-3" />

          {/* VIP Offers Section */}
          <div>
            <h3 className="text-sm font-semibold text-purple-600 mb-1.5 flex items-center">
              <Star className="mr-2 h-4 w-4 text-yellow-400 fill-yellow-400" />
              Ofertas VIP Especiais ({vipDeals.length})
            </h3>
            {vipDeals.length > 0 ? (
              <div className="space-y-2">
                {vipDeals.map(deal => (
                  <Card key={deal.id} className="bg-purple-500/10 border-purple-500/30 p-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1.5">
                      <div>
                        <h4 className="font-semibold text-xs text-purple-700 md:text-sm">{deal.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-0.5">{deal.description}</p>
                        <div className="flex flex-wrap gap-1">
                            <Badge variant="default" className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] px-1 py-0"><Star className="mr-0.5 h-2.5 w-2.5" /> VIP</Badge>
                            {deal.isPay1Get2 && <Badge variant="destructive" className="bg-accent text-accent-foreground text-[10px] px-1 py-0">Pague 1 Leve 2</Badge>}
                            {deal.discountPercentage && deal.discountPercentage > 0 && <Badge variant="default" className="bg-primary text-primary-foreground text-[10px] px-1 py-0">{deal.discountPercentage}% OFF</Badge>}
                        </div>
                      </div>
                      <div className="mt-1 sm:mt-0 sm:ml-auto flex-shrink-0 space-x-1.5">
                        <AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-xs h-6 px-1.5 py-0.5"><QrCodeIcon className="mr-1 h-2.5 w-2.5" /> Ver QR</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle className="flex items-center"><QrCodeIcon className="mr-2 h-5 w-5 text-primary"/>QR Code VIP: {deal.title}</AlertDialogTitle><AlertDialogDescription>Apresente este QR Code no caixa ou para o atendente para validar sua oferta VIP (simulação).</AlertDialogDescription></AlertDialogHeader><div className="flex justify-center my-3"><Image src={`https://placehold.co/150x150.png?text=QR+VIP+${deal.id.substring(0,6)}`} alt={`QR Code VIP para ${deal.title}`} width={150} height={150} data-ai-hint="qr code vip"/></div><AlertDialogFooter><AlertDialogCancel>Fechar</AlertDialogCancel></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        <Button asChild variant="outline" size="sm" className="text-xs h-6 px-1.5 py-0.5"><Link href={`/partner/edit-offer/${deal.id}`}><Settings2 className="mr-1 h-2.5 w-2.5" /> Editar</Link></Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert className="text-xs py-2 px-3 border-purple-500/30 bg-purple-500/5"><Star className="h-3 w-3 text-purple-600"/><AlertTitle className="text-xs text-purple-700">Nenhuma Oferta VIP</AlertTitle><AlertDescription className="text-xs">Você ainda não cadastrou nenhuma oferta VIP especial.</AlertDescription></Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-3">
            <p className="text-xs text-muted-foreground">
                Mantenha suas ofertas atualizadas e atrativas!
            </p>
        </CardFooter>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="p-3">
            <CardTitle className="text-sm text-accent flex items-center md:text-base">
                <BarChart3 className="mr-1.5 h-4 w-4" />
                Visão Geral do Desempenho
            </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
            <Alert variant="default" className="bg-secondary/20 border-secondary text-xs py-2 px-3">
                <BarChart3 className="h-3 w-3 text-secondary-foreground"/>
                <AlertTitle className="text-xs text-secondary-foreground">Em Breve!</AlertTitle>
                <AlertDescription className="text-xs">
                Esta seção mostrará estatísticas sobre visualizações, resgates de ofertas e mais.
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
