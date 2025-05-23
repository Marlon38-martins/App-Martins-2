// src/app/partner/manage-offers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // Not needed for public access
// import { useAuth } from '@/hooks/use-auth-client'; // Not needed for public access
import { getGramadoBusinessById, type GramadoBusiness } from '@/services/gramado-businesses';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Tag, PlusCircle, Loader2, AlertCircle, Star } from 'lucide-react'; // ShieldAlert removed, Added Star
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// const MOCK_PARTNER_EMAIL = 'partner@example.com'; // Not used for access control
const MOCK_PARTNER_BUSINESS_ID = '1'; 
// const ADMIN_EMAIL = 'admin@example.com'; // Not used for access control

const offerFormSchema = z.object({
  title: z.string().min(5, { message: 'Título da oferta é obrigatório (mínimo 5 caracteres).' }),
  description: z.string().min(10, { message: 'Descrição da oferta é obrigatória (mínimo 10 caracteres).' }),
  offerType: z.enum(['discount', 'p1g2'], { required_error: "Tipo da oferta é obrigatório."}),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  isPay1Get2: z.boolean().optional(),
  isVipOffer: z.boolean().optional().default(false), // Added VIP offer flag
  usageLimitPerUser: z.coerce.number().min(1, {message: "Limite de uso deve ser ao menos 1."}).optional().default(1),
  termsAndConditions: z.string().min(10, { message: 'Termos e condições são obrigatórios (mínimo 10 caracteres).' }),
}).refine(data => {
  if (data.offerType === 'discount') {
    return data.discountPercentage !== undefined && data.discountPercentage > 0;
  }
  if (data.offerType === 'p1g2') {
    return data.isPay1Get2 === true;
  }
  return true;
}, {
  message: "Para 'Desconto', informe a porcentagem. Para 'Pague 1 Leve 2', marque a opção.",
  path: ["discountPercentage"], 
});

type OfferFormValues = z.infer<typeof offerFormSchema>;

export default function ManagePartnerOffersPage() {
  const { toast } = useToast();
  // const router = useRouter(); // Not needed for public access
  // const { user, isAdmin, loading: authLoading } = useAuth(); // Not needed for public access
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partnerBusiness, setPartnerBusiness] = useState<GramadoBusiness | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);
  // const [canAccess, setCanAccess] = useState(false); // Access is now public

  useEffect(() => {
    // Public access: load business data directly
    const businessIdToLoad = MOCK_PARTNER_BUSINESS_ID; 
    if (businessIdToLoad) {
      async function loadBusiness() {
        setIsLoadingBusiness(true);
        const business = await getGramadoBusinessById(businessIdToLoad);
        setPartnerBusiness(business || null);
        setIsLoadingBusiness(false);
      }
      loadBusiness();
    } else {
      setIsLoadingBusiness(false);
      setPartnerBusiness(null); 
    }
  }, []);

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      title: '',
      description: '',
      offerType: undefined,
      discountPercentage: 0,
      isPay1Get2: false,
      isVipOffer: false,
      usageLimitPerUser: 1,
      termsAndConditions: 'Válido conforme regras do clube Guia Mais. Apresente seu card de membro.',
    },
  });

  const watchOfferType = form.watch('offerType');
  
  useEffect(() => {
    if (watchOfferType === 'p1g2') {
      form.setValue('isPay1Get2', true);
      form.setValue('discountPercentage', 0); 
    } else if (watchOfferType === 'discount') {
      form.setValue('isPay1Get2', false);
    }
  }, [watchOfferType, form]);


  const onSubmit: SubmitHandler<OfferFormValues> = async (data) => {
    if (!partnerBusiness) {
        toast({ title: "Erro", description: "Estabelecimento do parceiro não carregado.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const newDeal = {
        id: `deal-${Date.now()}`, 
        businessId: partnerBusiness.id,
        title: data.title,
        description: data.description,
        isPay1Get2: data.offerType === 'p1g2' ? true : undefined,
        discountPercentage: data.offerType === 'discount' ? data.discountPercentage : undefined,
        isVipOffer: data.isVipOffer,
        usageLimitPerUser: data.usageLimitPerUser,
        termsAndConditions: data.termsAndConditions,
    };

    console.log('New Partner Offer Data:', newDeal, 'For Business:', partnerBusiness.name);

    toast({
      title: 'Oferta Cadastrada!',
      description: `A oferta "${data.title}" foi adicionada para ${partnerBusiness.name}. Um QR Code para esta oferta foi gerado (simulação).`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    form.reset(); 
  };

  if (isLoadingBusiness) { 
    return (
        <div className="p-4 md:p-6">
            <Skeleton className="h-8 w-1/3 mb-6" />
             <Card className="shadow-xl">
                <CardHeader className="p-3"><Skeleton className="h-7 w-1/2" /></CardHeader>
                <CardContent className="space-y-3 p-3">
                    {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
                </CardContent>
                <CardFooter className="p-3"><Skeleton className="h-9 w-full" /></CardFooter>
            </Card>
        </div>
    );
  }

  if (!partnerBusiness) { 
    return (
         <div className="p-4 md:p-6">
            <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>Não foi possível carregar os dados do estabelecimento para adicionar ofertas. Tente voltar e acessar novamente.</AlertDescription>
            </Alert>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/partner/panel">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o Painel
              </Link>
            </Button>
        </div>
    );
  }


  return (
    <div className="p-4 md:p-6">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/partner/panel">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-bold tracking-tight text-primary md:text-2xl">
          Criar Nova Oferta Especial
        </h2>
        <p className="text-sm text-foreground/80 md:text-base">
          Adicione novas promoções e descontos para: <span className="font-semibold text-accent">{partnerBusiness.name}</span>.
        </p>
      </section>

      <Card className="shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="p-3">
              <CardTitle className="flex items-center text-lg text-primary md:text-xl">
                <Tag className="mr-2 h-5 w-5 md:h-6 md:w-6 text-accent" />
                Detalhes da Nova Oferta
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Preencha os campos abaixo. Um QR Code será gerado automaticamente para esta oferta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title" className="text-sm">Título da Oferta *</FormLabel>
                    <FormControl>
                      <Input id="title" placeholder="Ex: Desconto Exclusivo Guia Mais" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description" className="text-sm">Descrição da Oferta *</FormLabel>
                    <FormControl>
                      <Textarea id="description" placeholder="Descreva os detalhes da oferta..." {...field} value={field.value ?? ''} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="offerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Tipo de Oferta *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo da oferta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="discount">Desconto Percentual</SelectItem>
                        <SelectItem value="p1g2">Pague 1 Leve 2 (ou similar)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchOfferType === 'discount' && (
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="discountPercentage" className="text-sm">Porcentagem de Desconto (%) *</FormLabel>
                      <FormControl>
                        <Input id="discountPercentage" type="number" placeholder="Ex: 10 para 10% de desconto" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {watchOfferType === 'p1g2' && (
                 <FormField
                    control={form.control}
                    name="isPay1Get2"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2.5">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="isPay1Get2"
                            />
                        </FormControl>
                        <FormLabel htmlFor="isPay1Get2" className="text-sm font-normal cursor-pointer">
                            Confirmar como oferta "Pague 1 Leve 2" (ou similar)
                        </FormLabel>
                        </FormItem>
                    )}
                />
              )}

              <FormField
                control={form.control}
                name="isVipOffer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2.5">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="isVipOffer"
                      />
                    </FormControl>
                    <FormLabel htmlFor="isVipOffer" className="text-sm font-normal cursor-pointer flex items-center">
                      <Star className="mr-1.5 h-4 w-4 text-yellow-400" />
                      Esta é uma oferta exclusiva para membros VIP?
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="usageLimitPerUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="usageLimitPerUser" className="text-sm">Limite de Uso por Usuário Prime</FormLabel>
                    <FormControl>
                      <Input id="usageLimitPerUser" type="number" placeholder="Ex: 1" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription className="text-xs">Quantas vezes um membro Prime pode usar esta oferta. Padrão é 1.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="termsAndConditions" className="text-sm">Termos e Condições da Oferta *</FormLabel>
                    <FormControl>
                      <Textarea id="termsAndConditions" placeholder="Ex: Válido de segunda a quinta..." {...field} value={field.value ?? ''} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-xs text-muted-foreground pt-1.5">
                Lembre-se: ofertas claras e atrativas geram mais engajamento!
              </p>
            </CardContent>
            <CardFooter className="p-3">
              <Button type="submit" size="default" className="w-full bg-primary hover:bg-primary/90 text-sm" disabled={isSubmitting}>
                 {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Criando Oferta...' : 'Criar Nova Oferta Especial'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
