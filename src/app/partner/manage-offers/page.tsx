// src/app/partner/manage-offers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-client';
import { getGramadoBusinessById, type GramadoBusiness } from '@/services/gramado-businesses';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Tag, PlusCircle, ShieldAlert } from 'lucide-react';

const MOCK_PARTNER_EMAIL = 'partner@example.com'; // For demo purposes
const MOCK_PARTNER_BUSINESS_ID = '1'; // Partner "owns" Restaurante Mirante da Serra

const offerFormSchema = z.object({
  title: z.string().min(5, { message: 'Título da oferta é obrigatório (mínimo 5 caracteres).' }),
  description: z.string().min(10, { message: 'Descrição da oferta é obrigatória (mínimo 10 caracteres).' }),
  offerType: z.enum(['discount', 'p1g2'], { required_error: "Tipo da oferta é obrigatório."}),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  isPay1Get2: z.boolean().optional(),
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
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partnerBusiness, setPartnerBusiness] = useState<GramadoBusiness | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);

  const isPartner = user?.email === MOCK_PARTNER_EMAIL;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/partner/manage-offers');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && isPartner) {
      async function loadBusiness() {
        setIsLoadingBusiness(true);
        const business = await getGramadoBusinessById(MOCK_PARTNER_BUSINESS_ID);
        setPartnerBusiness(business || null);
        setIsLoadingBusiness(false);
      }
      loadBusiness();
    } else if (user && !isPartner) {
      setIsLoadingBusiness(false);
    }
  }, [user, isPartner]);

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      title: '',
      description: '',
      offerType: undefined,
      discountPercentage: 0,
      isPay1Get2: false,
      usageLimitPerUser: 1,
      termsAndConditions: 'Válido conforme regras do clube Guia Mais. Apresente seu card de membro.',
    },
  });

  const watchOfferType = form.watch('offerType');
  
  // Sync isPay1Get2 checkbox with offerType
  useEffect(() => {
    if (watchOfferType === 'p1g2') {
      form.setValue('isPay1Get2', true);
      form.setValue('discountPercentage', 0); // Clear discount if P1G2
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
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const newDeal = {
        id: `deal-${Date.now()}`, // mock ID
        businessId: partnerBusiness.id,
        title: data.title,
        description: data.description,
        isPay1Get2: data.offerType === 'p1g2' ? true : undefined,
        discountPercentage: data.offerType === 'discount' ? data.discountPercentage : undefined,
        usageLimitPerUser: data.usageLimitPerUser,
        termsAndConditions: data.termsAndConditions,
    };

    console.log('New Partner Offer Data:', newDeal, 'For Business:', partnerBusiness.name);
    // In a real app, you would send `newDeal` to your backend.

    toast({
      title: 'Oferta Cadastrada!',
      description: `A oferta "${data.title}" foi adicionada para ${partnerBusiness.name}.`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    form.reset(); 
  };

  if (authLoading || isLoadingBusiness) {
    return (
        <div className="p-4 md:p-6">
            <Skeleton className="h-10 w-1/3 mb-6" />
            <Skeleton className="h-96 w-full" />
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
            Esta funcionalidade é exclusiva para parceiros.
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

  if (!partnerBusiness) {
    return (
         <div className="p-4 md:p-6">
            <Alert variant="destructive">
                <ShieldAlert className="h-5 w-5" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>Não foi possível carregar os dados do seu estabelecimento. Contate o suporte.</AlertDescription>
            </Alert>
        </div>
    );
  }


  return (
    <div className="p-4 md:p-6">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/partner/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Painel
        </Link>
      </Button>

      <section className="mb-8">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Gerenciar Minhas Ofertas
        </h2>
        <p className="text-lg text-foreground/80">
          Adicione novas promoções para o seu estabelecimento: <span className="font-semibold text-accent">{partnerBusiness.name}</span>.
        </p>
      </section>

      <Card className="shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-primary">
                <Tag className="mr-3 h-7 w-7 text-accent" />
                Nova Oferta
              </CardTitle>
              <CardDescription>
                Preencha os detalhes da nova oferta para seu estabelecimento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title">Título da Oferta *</FormLabel>
                    <FormControl>
                      <Input id="title" placeholder="Ex: Happy Hour Especial, Combo Família" {...field} />
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
                    <FormLabel htmlFor="description">Descrição da Oferta *</FormLabel>
                    <FormControl>
                      <Textarea id="description" placeholder="Descreva os detalhes da oferta, o que está incluído, etc." {...field} rows={3}/>
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
                    <FormLabel>Tipo de Oferta *</FormLabel>
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
                      <FormLabel htmlFor="discountPercentage">Porcentagem de Desconto (%) *</FormLabel>
                      <FormControl>
                        <Input id="discountPercentage" type="number" placeholder="Ex: 10 para 10% de desconto" {...field} />
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
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="isPay1Get2"
                            />
                        </FormControl>
                        <FormLabel htmlFor="isPay1Get2" className="font-normal cursor-pointer">
                            Confirmar como oferta "Pague 1 Leve 2" (ou similar, ex: Pague 2 Leve 3)
                        </FormLabel>
                        </FormItem>
                    )}
                />
              )}
              
              <FormField
                control={form.control}
                name="usageLimitPerUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="usageLimitPerUser">Limite de Uso por Usuário Prime</FormLabel>
                    <FormControl>
                      <Input id="usageLimitPerUser" type="number" placeholder="Ex: 1" {...field} />
                    </FormControl>
                    <FormDescription>Quantas vezes um membro Prime pode usar esta oferta específica. Padrão é 1.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="termsAndConditions">Termos e Condições da Oferta *</FormLabel>
                    <FormControl>
                      <Textarea id="termsAndConditions" placeholder="Ex: Válido de segunda a quinta, exceto feriados. Apresente o card Guia Mais." {...field} rows={4}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                <PlusCircle className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Salvando Oferta...' : 'Salvar Nova Oferta'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
