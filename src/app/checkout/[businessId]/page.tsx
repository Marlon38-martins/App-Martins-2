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
    checkUserOfferUsage, // Mocked service
    recordUserOfferUsage, // Mocked service
    getCurrentUser,         // Mocked service
    getMockUserSubscription   // Mocked service
} from '@/services/gramado-businesses';
import type { User, Subscription } from '@/types/user';
import { useAuth } from '@/hooks/use-auth-client';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User as UserIcon, Mail, Phone as PhoneIcon, ShieldCheck, ShoppingCart, Frown, Star, Tag, AlertTriangle, CheckCircle } from 'lucide-react';

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
  const { user: authUser, loading: authLoading } = useAuth();

  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [specificDeal, setSpecificDeal] = useState<Deal | null>(null);
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);
  const [hasUsedOffer, setHasUsedOffer] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);


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
      form.setValue('name', authUser.displayName || '');
      form.setValue('email', authUser.email || '');
    }
  }, [authUser, form]);


  useEffect(() => {
    if (!businessId || authLoading) { // Wait for auth loading to complete
        // setError("ID do estabelecimento não fornecido.");
        // setIsLoading(false);
        return;
    };

    async function loadData() {
      setIsLoading(true);
      setError(null);
      setEligibilityChecked(false);

      try {
        const businessData = await getGramadoBusinessById(businessId);
        if (!businessData) {
          setError('Estabelecimento não encontrado.');
          setIsLoading(false);
          return;
        }
        setBusiness(businessData);

        if (dealId) {
          const allDeals = await getDealsForBusiness(businessId);
          const foundDeal = allDeals.find(d => d.id === dealId);
          setSpecificDeal(foundDeal || null);
        }
        
        // Check user eligibility
        if (authUser) {
          const sub = await getMockUserSubscription(authUser.uid);
          setUserSubscription(sub);
          if (!sub || sub.status !== 'active') {
            setError('Sua assinatura Martins Prime não está ativa. Por favor, renove ou associe-se.');
            setIsLoading(false);
            setEligibilityChecked(true);
            return;
          }

          if (dealId && specificDeal?.isPay1Get2 && specificDeal?.usageLimitPerUser === 1) {
            const used = await checkUserOfferUsage(authUser.uid, dealId);
            setHasUsedOffer(used);
            if (used) {
              setError(`Você já utilizou esta oferta "${specificDeal.title}" anteriormente.`);
              setIsLoading(false);
              setEligibilityChecked(true);
              return;
            }
          }
        } else {
          setError('Você precisa estar logado para usar um benefício Martins Prime.');
          setIsLoading(false);
          setEligibilityChecked(true);
          return;
        }

      } catch (err) {
        setError('Falha ao carregar dados ou verificar elegibilidade. Tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
        setEligibilityChecked(true);
      }
    }
    if(!authLoading) loadData(); // only run if auth is not loading
  }, [businessId, dealId, authUser, authLoading, specificDeal?.title, specificDeal?.isPay1Get2, specificDeal?.usageLimitPerUser]);


  const getActionName = () => {
    if (specificDeal) return specificDeal.title;
    if (!business) return "Benefício";
    const type = business.type.toLowerCase();
    if (type.includes('hotel') || type.includes('pousada')) return "Reserva com Benefício Prime";
    if (type.includes('restaurante') || type.includes('café')) return "Uso de Benefício Prime";
    if (type.includes('loja') || type.includes('artesanato')) return "Compra com Desconto Prime";
    return "Benefício Martins Prime";
  }

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    if (!authUser || !userSubscription || userSubscription.status !== 'active') {
        toast({ title: "Não Elegível", description: "Você não está elegível para usar este benefício.", variant: "destructive" });
        return;
    }
    if (specificDeal?.isPay1Get2 && specificDeal?.usageLimitPerUser === 1 && hasUsedOffer) {
        toast({ title: "Oferta Já Utilizada", description: "Você já utilizou esta oferta Pague 1 Leve 2.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
      if (dealId) {
        await recordUserOfferUsage(authUser.uid, dealId, businessId);
      }
      // Simulate API call for activating offer/generating voucher
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Offer Activation Data:', data, 'Deal ID:', dealId);
      toast({
        title: 'Benefício Confirmado!',
        description: `Seu benefício Martins Prime em ${business?.name} (${getActionName()}) foi ativado. Apresente esta confirmação ou seu card de membro no estabelecimento.`,
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
  

  if (isLoading || authLoading) {
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

  if (eligibilityChecked && error) { // Show error only after eligibility is checked
    return (
      <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center">
        <Alert variant="destructive" className="w-full max-w-md">
          <Frown className="h-5 w-5" />
          <AlertTitle>Não é possível prosseguir</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" className="mt-6">
          <Link href={businessId ? `/business/${businessId}` : "/"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }
  
  if (!business) { // Should be caught by error above if loading is done
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

  // If all checks passed and no error after eligibility check
  const canProceed = authUser && userSubscription?.status === 'active' && (!specificDeal || !specificDeal.isPay1Get2 || specificDeal.usageLimitPerUser !== 1 || !hasUsedOffer);


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


      {!canProceed && eligibilityChecked && !error && ( // A specific state if not error, but cannot proceed
          <Alert variant="default" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Verificação Necessária</AlertTitle>
            <AlertDescription>Por favor, verifique seu login e status da assinatura para usar os benefícios.</AlertDescription>
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
                Confirme seus dados para ativar o benefício Martins Prime. Estes dados são para registro interno.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Nome Completo (como no cadastro Prime)</FormLabel>
                        <FormControl>
                          <Input id="name" placeholder="Seu nome completo" {...field} disabled={!canProceed}/>
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
                        <FormLabel htmlFor="email">Email (do cadastro Prime)</FormLabel>
                        <FormControl>
                          <Input id="email" type="email" placeholder="seuemail@exemplo.com" {...field} disabled={!canProceed}/>
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
                          <Input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" {...field} disabled={!canProceed}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <p className="flex items-center text-sm text-muted-foreground pt-4">
                    <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                    Ao confirmar, seu benefício será registrado para uso no estabelecimento.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting || !canProceed}>
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
                <div className="mt-3 rounded-md border border-accent/50 bg-accent/10 p-3 text-sm">
                    <p className="flex items-center font-semibold text-accent">
                        <Star className="mr-2 h-4 w-4 text-yellow-400" />
                        Oferta Selecionada: {specificDeal.title}
                    </p>
                    <p className="mt-1 text-xs text-accent-foreground/90">
                        {specificDeal.description}
                    </p>
                    {specificDeal.isPay1Get2 && <Badge className="mt-1 bg-accent text-accent-foreground">Pague 1 Leve 2</Badge>}
                </div>
               )}
              
              <div className="mt-3 rounded-md border border-muted bg-muted/50 p-3 text-sm text-muted-foreground">
                <strong>Importante:</strong> A confirmação aqui registra sua intenção de uso do benefício. O estabelecimento validará sua elegibilidade e aplicará as condições Martins Prime no local.
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
  // useParams already gives an object, no need for use() here unless params itself is a promise (not typical for page components)
  // const resolvedParams = use(params); // If params were a Promise, which is not standard here.
  return (
      <Suspense fallback={<div>Carregando checkout...</div>}>
          <CheckoutPageContent businessId={params.businessId} />
      </Suspense>
  );
}
