
// src/app/checkout/[businessId]/page.tsx
'use client';

import { use, useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { 
    getGramadoBusinessById, 
    getDealsForBusiness, 
    type GramadoBusiness, 
    type Deal,
    checkUserOfferUsage, 
    recordUserOfferUsage, 
    getCurrentUser,      
    getMockUserSubscription  
} from '@/services/gramado-businesses';
import type { User as AppUser, Subscription } from '@/types/user'; 

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User as UserIcon, Mail, Phone as PhoneIcon, ShieldCheck, ShoppingCart, Frown, Star, Tag, AlertTriangle, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos.' }).optional().or(z.literal('')),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutPageParams {
  businessId: string;
}

function CheckoutPageContent({ businessId }: { businessId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dealId = searchParams.get('dealId');
  const { toast } = useToast();
  
  const [authUser, setAuthUser] = useState<AppUser | null>(null);
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [specificDeal, setSpecificDeal] = useState<Deal | null>(null);
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);
  const [hasUsedOffer, setHasUsedOffer] = useState(false);
  
  const [isLoadingPage, setIsLoadingPage] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authCheckedAndEligible, setAuthCheckedAndEligible] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

 useEffect(() => {
    if (authUser) {
      form.setValue('name', authUser.name || '');
      form.setValue('email', authUser.email || '');
    }
  }, [authUser, form]);


  useEffect(() => {
    if (!businessId) {
        setIsLoadingPage(false);
        setError("ID do estabelecimento não fornecido.");
        return;
    };

    async function loadDataAndCheckAuth() {
      setIsLoadingPage(true);
      setError(null);
      setAuthCheckedAndEligible(false);

      try {
        const user = await getCurrentUser();
        setAuthUser(user);

        const businessData = await getGramadoBusinessById(businessId);
        if (!businessData) {
          setError('Estabelecimento não encontrado.');
          setIsLoadingPage(false);
          return;
        }
        setBusiness(businessData);

        let currentDeal = null;
        if (dealId) {
          const allDeals = await getDealsForBusiness(businessId);
          currentDeal = allDeals.find(d => d.id === dealId) || null;
          if (!currentDeal) {
            setError('Oferta não encontrada para este estabelecimento.');
            setIsLoadingPage(false);
            return;
          }
          setSpecificDeal(currentDeal);
        } else {
            setError('ID da oferta não especificado na URL.');
            setIsLoadingPage(false);
            return;
        }
        
        if (user) {
          const sub = await getMockUserSubscription(user.id);
          setUserSubscription(sub);
          if (!sub || sub.status !== 'active') {
            setError('Sua assinatura Guia Mais não está ativa. Por favor, renove ou associe-se.');
            setAuthCheckedAndEligible(false); 
            setIsLoadingPage(false);
            return;
          }

          // Check for VIP offer eligibility
          if (currentDeal?.isVipOffer) {
            if (sub.planId !== 'serrano_vip') { // Ensure this matches your VIP plan ID
              setError('Esta oferta é exclusiva para membros VIP. Faça um upgrade para aproveitar!');
              setAuthCheckedAndEligible(false);
              setIsLoadingPage(false);
              return;
            }
          }

          if (currentDeal?.isPay1Get2 && currentDeal?.usageLimitPerUser === 1) {
            const used = await checkUserOfferUsage(user.id, dealId);
            setHasUsedOffer(used);
            if (used) {
              setError(`Você já utilizou esta oferta "${currentDeal.title}" anteriormente.`);
              setAuthCheckedAndEligible(false); 
              setIsLoadingPage(false);
              return;
            }
          }
          setAuthCheckedAndEligible(true); 
        } else {
          setError('Você precisa estar logado para usar um benefício Guia Mais.');
          setAuthCheckedAndEligible(false); 
          setIsLoadingPage(false);
          return;
        }

      } catch (err) {
        setError('Falha ao carregar dados ou verificar elegibilidade. Tente novamente.');
        console.error(err);
      } finally {
        setIsLoadingPage(false);
      }
    }
    loadDataAndCheckAuth();
  }, [businessId, dealId]); 


  const getActionName = () => {
    if (specificDeal) return specificDeal.title;
    if (!business) return "Benefício";
    const type = business.type.toLowerCase();
    if (type.includes('hotel') || type.includes('pousada')) return "Reserva com Benefício Guia Mais";
    if (type.includes('restaurante') || type.includes('café')) return "Uso de Benefício Guia Mais";
    if (type.includes('loja') || type.includes('artesanato')) return "Compra com Desconto Guia Mais";
    return "Benefício Guia Mais";
  }

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    if (!authUser || !userSubscription || userSubscription.status !== 'active' || !authCheckedAndEligible) {
        toast({ title: "Não Elegível", description: "Você não está elegível para usar este benefício no momento.", variant: "destructive" });
        return;
    }
    if (specificDeal?.isPay1Get2 && specificDeal?.usageLimitPerUser === 1 && hasUsedOffer) {
        toast({ title: "Oferta Já Utilizada", description: "Você já utilizou esta oferta Pague 1 Leve 2.", variant: "destructive" });
        return;
    }
    if (specificDeal?.isVipOffer && userSubscription?.planId !== 'serrano_vip') {
        toast({ title: "Oferta VIP", description: "Esta oferta é exclusiva para membros VIP.", variant: "destructive" });
        return;
    }


    setIsSubmitting(true);
    try {
      if (dealId && authUser) { 
        await recordUserOfferUsage(authUser.id, dealId, businessId);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Offer Activation Data:', data, 'Deal ID:', dealId);
      toast({
        title: 'Benefício Confirmado!',
        description: `Seu benefício Guia Mais em ${business?.name} (${getActionName()}) foi ativado. Apresente esta confirmação ou seu card de membro no estabelecimento.`,
        variant: 'default', 
      });
      router.push(`/business/${businessId}`); 
    } catch (err) {
        toast({ title: "Erro ao Registrar Uso", description: "Não foi possível registrar o uso do benefício. Tente novamente.", variant: "destructive" });
        console.error("Error recording usage:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (isLoadingPage) {
    return (
      <div> 
        <Skeleton className="mb-4 h-10 w-32" /> 
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="mb-4 h-12 w-3/4" /> 
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="mb-4 h-10 w-1/2" /> 
            <Skeleton className="h-64 w-full rounded-lg" /> 
          </div>
        </div>
      </div>
    );
  }

  if (error) { 
    return (
      <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center">
        <Alert variant="destructive" className="w-full max-w-md">
          { specificDeal?.isVipOffer ? <Crown className="h-5 w-5 text-destructive-foreground" /> : <Frown className="h-5 w-5" /> }
          <AlertTitle>Não é possível prosseguir</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" className="mt-6">
          <Link href={businessId ? `/business/${businessId}` : "/"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
         {specificDeal?.isVipOffer && !isVipUser && authUser && (
          <Button asChild className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
            <Link href="/join">
              <Star className="mr-2 h-4 w-4" /> Fazer Upgrade para VIP
            </Link>
          </Button>
        )}
      </div>
    );
  }
  
  if (!business) {
     return (
      <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center">
        <Frown className="mb-4 h-20 w-20 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-semibold">Estabelecimento não encontrado</h2>
        <p className="mb-6 text-muted-foreground">Não é possível prosseguir sem um estabelecimento válido.</p>
        <Button asChild variant="default">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div> 
      <Button asChild variant="outline" className="mb-6">
        <Link href={`/business/${business.id}${dealId ? `?dealId=${dealId}`: ''}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para {business.name}
        </Link>
      </Button>

      <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary md:text-4xl">
        Confirmar Uso: <span className="text-accent">{getActionName()}</span>
      </h2>
      <p className="mb-6 text-lg text-foreground/80">Em: {business.name}</p>

      {!authCheckedAndEligible && !error && !isLoadingPage && (
          <Alert variant="default" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Verificação Necessária</AlertTitle>
            <AlertDescription>Por favor, verifique seu login e status da assinatura para usar os benefícios. Se já estiver logado, pode haver um problema com sua elegibilidade para esta oferta específica.</AlertDescription>
          </Alert>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <UserIcon className="mr-2 h-6 w-6 text-accent" />
                Seus Dados para Confirmação
              </CardTitle>
              <CardDescription>
                Confirme seus dados para ativar o benefício Guia Mais. Estes dados são para registro interno.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Nome Completo (como no cadastro Guia Mais)</FormLabel>
                        <FormControl>
                          <Input id="name" placeholder="Seu nome completo" {...field} value={field.value ?? ''} disabled={!authCheckedAndEligible || isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email (do cadastro Guia Mais)</FormLabel>
                        <FormControl>
                          <Input id="email" type="email" placeholder="seuemail@exemplo.com" {...field} value={field.value ?? ''} disabled={!authCheckedAndEligible || isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="phone">Telefone (opcional, para contato)</FormLabel>
                        <FormControl>
                          <Input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" {...field} value={field.value ?? ''} disabled={!authCheckedAndEligible || isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <p className="flex items-center text-sm text-muted-foreground pt-3">
                    <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                    Ao confirmar, seu benefício será registrado para uso no estabelecimento.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting || !authCheckedAndEligible}>
                    <Tag className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Confirmando...' : `Confirmar Uso do Benefício`}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24 shadow-lg"> 
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <ShoppingCart className="mr-2 h-5 w-5 text-accent" />
                Resumo do Benefício
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-40 w-full overflow-hidden rounded-md">
                <Image
                  src={business.imageUrl}
                  alt={`Imagem de ${business.name}`}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={`${business.type} service`}
                />
              </div>
              <div>
                <h4 className="font-semibold text-primary">{business.name}</h4>
                <p className="text-sm text-muted-foreground">{business.type}</p>
              </div>
               {specificDeal && (
                <div className={`mt-3 rounded-md border p-3 text-sm ${specificDeal.isVipOffer ? 'border-purple-500/50 bg-purple-500/10' : 'border-accent/50 bg-accent/10'}`}>
                    <p className={`flex items-center font-semibold ${specificDeal.isVipOffer ? 'text-purple-700' : 'text-accent'}`}>
                        {specificDeal.isVipOffer ? <Crown className="mr-2 h-4 w-4 text-yellow-400" /> : <Star className="mr-2 h-4 w-4 text-yellow-400" /> }
                        Oferta Selecionada: {specificDeal.title}
                    </p>
                    <p className="mt-1 text-xs text-accent-foreground/90">
                        {specificDeal.description}
                    </p>
                     {specificDeal.isVipOffer && <Badge variant="default" className="mt-1 bg-purple-600 hover:bg-purple-700 text-purple-50 text-xs"><Star className="mr-1 h-3 w-3"/> VIP</Badge>}
                    {specificDeal.isPay1Get2 && <Badge className="mt-1 bg-accent text-accent-foreground">Pague 1 Leve 2</Badge>}
                </div>
               )}
              
              <div className="mt-3 rounded-md border border-muted bg-muted/50 p-3 text-sm text-muted-foreground">
                <strong>Importante:</strong> A confirmação aqui registra sua intenção de uso do benefício. O estabelecimento validará sua elegibilidade e aplicará as condições Guia Mais no local.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPageWrapper() {
  const params = useParams() as CheckoutPageParams; 
  return (
      <Suspense fallback={<div>Carregando checkout...</div>}>
          <CheckoutPageContent businessId={params.businessId} />
      </Suspense>
  );
}
