// src/app/partner/manage-offers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // No longer needed for auth redirection
// import { useAuth } from '@/hooks/use-auth-client'; // No longer needed
import { getGramadoBusinessById, type GramadoBusiness } from '@/services/gramado-businesses';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Tag, PlusCircle } from 'lucide-react'; // ShieldAlert removed
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// const MOCK_PARTNER_EMAIL = 'partner@example.com'; // Not used for access control anymore
const MOCK_PARTNER_BUSINESS_ID = '1'; 

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
  // const router = useRouter(); // No longer needed for auth redirection
  // const { user, isAdmin, loading: authLoading } = useAuth(); // Auth checks removed
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partnerBusiness, setPartnerBusiness] = useState<GramadoBusiness | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);

  // Access is now public, auth checks removed from useEffect
  useEffect(() => {
    async function loadBusiness() {
      setIsLoadingBusiness(true);
      const business = await getGramadoBusinessById(MOCK_PARTNER_BUSINESS_ID); // Always load mock partner's business
      setPartnerBusiness(business || null);
      setIsLoadingBusiness(false);
    }
    loadBusiness();
  }, []);

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
        usageLimitPerUser: data.usageLimitPerUser,
        termsAndConditions: data.termsAndConditions,
    };

    console.log('New Partner Offer Data:', newDeal, 'For Business:', partnerBusiness.name);

    toast({
      title: 'Oferta Cadastrada!',
      description: `A oferta "${data.title}" foi adicionada para ${partnerBusiness.name}.`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    form.reset(); 
  };

  if (isLoadingBusiness) { // Simplified loading state check
    return (
        <div className="p-4 md:p-6">
            <Skeleton className="mb-6 h-10 w-1/3" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  if (!partnerBusiness) {
    return (
         <div className="p-4 md:p-6">
            <Alert variant="destructive">
                {/* <ShieldAlert className="h-5 w-5" /> // Icon removed as it implies security issue */}
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>Não foi possível carregar os dados do seu estabelecimento. Contate o suporte.</AlertDescription>
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
                      <Input id="title" placeholder="Ex: Happy Hour Especial, Combo Família" {...field} value={field.value ?? ''} />
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
                      <Textarea id="description" placeholder="Descreva os detalhes da oferta, o que está incluído, etc." {...field} value={field.value ?? ''} rows={3}/>
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
                      <Input id="usageLimitPerUser" type="number" placeholder="Ex: 1" {...field} value={field.value ?? ''} />
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
                      <Textarea id="termsAndConditions" placeholder="Ex: Válido de segunda a quinta, exceto feriados. Apresente o card Guia Mais." {...field} value={field.value ?? ''} rows={4}/>
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
