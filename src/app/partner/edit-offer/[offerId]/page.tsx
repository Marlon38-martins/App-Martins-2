// src/app/partner/edit-offer/[offerId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getDealsForBusiness, getGramadoBusinessById, type Deal, type GramadoBusiness } from '@/services/gramado-businesses';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Tag, Save, Loader2, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const MOCK_PARTNER_BUSINESS_ID = '1'; // Assuming this is the business context for the partner

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

interface EditOfferPageParams {
  offerId: string;
}

export default function EditPartnerOfferPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams() as EditOfferPageParams;
  const offerId = params.offerId;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOffer, setIsLoadingOffer] = useState(true);
  const [offerToEdit, setOfferToEdit] = useState<Deal | null>(null);
  const [businessName, setBusinessName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    async function loadOffer() {
      if (!offerId) {
        setError("ID da oferta não encontrado.");
        setIsLoadingOffer(false);
        return;
      }
      try {
        const business = await getGramadoBusinessById(MOCK_PARTNER_BUSINESS_ID);
        setBusinessName(business?.name || 'seu estabelecimento');

        const deals = await getDealsForBusiness(MOCK_PARTNER_BUSINESS_ID);
        const currentOffer = deals.find(deal => deal.id === offerId);
        if (currentOffer) {
          setOfferToEdit(currentOffer);
          form.reset({
            title: currentOffer.title,
            description: currentOffer.description,
            offerType: currentOffer.isPay1Get2 ? 'p1g2' : 'discount',
            discountPercentage: currentOffer.discountPercentage || 0,
            isPay1Get2: currentOffer.isPay1Get2 || false,
            usageLimitPerUser: currentOffer.usageLimitPerUser || 1,
            termsAndConditions: currentOffer.termsAndConditions,
          });
        } else {
          setError('Oferta não encontrada ou não pertence ao seu estabelecimento.');
        }
      } catch (e) {
        setError('Falha ao carregar dados da oferta.');
        console.error(e);
      } finally {
        setIsLoadingOffer(false);
      }
    }
    loadOffer();
  }, [offerId, form]);

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
    if (!offerToEdit) {
        toast({ title: "Erro", description: "Oferta não carregada para edição.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const updatedDeal = {
        ...offerToEdit,
        title: data.title,
        description: data.description,
        isPay1Get2: data.offerType === 'p1g2' ? true : undefined,
        discountPercentage: data.offerType === 'discount' ? data.discountPercentage : undefined,
        usageLimitPerUser: data.usageLimitPerUser,
        termsAndConditions: data.termsAndConditions,
    };

    console.log('Updated Partner Offer Data:', updatedDeal, 'For Business:', businessName);

    toast({
      title: 'Oferta Atualizada!',
      description: `A oferta "${data.title}" foi atualizada para ${businessName}. O QR Code associado foi atualizado (simulação).`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    router.push('/partner/dashboard'); 
  };

  if (isLoadingOffer) {
    return (
        <div className="p-4 md:p-6">
            <Skeleton className="h-8 w-1/3 mb-6" />
            <Card className="shadow-xl">
                <CardHeader className="p-4"><Skeleton className="h-7 w-1/2" /></CardHeader>
                <CardContent className="space-y-4 p-4">
                    {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </CardContent>
                <CardFooter className="p-4"><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
        </div>
    );
  }

  if (error) {
    return (
         <div className="p-4 md:p-6">
            <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Erro ao Carregar Oferta</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/partner/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o Painel
              </Link>
            </Button>
        </div>
    );
  }
  
  if (!offerToEdit) {
     return (
         <div className="p-4 md:p-6">
            <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Oferta Não Encontrada</AlertTitle>
                <AlertDescription>A oferta que você está tentando editar não foi encontrada.</AlertDescription>
            </Alert>
             <Button asChild variant="outline" className="mt-6">
              <Link href="/partner/dashboard">
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
        <Link href="/partner/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Painel de Ofertas
        </Link>
      </Button>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-bold tracking-tight text-primary md:text-2xl">
          Editar Oferta Especial
        </h2>
        <p className="text-sm text-foreground/80 md:text-base">
          Modifique os detalhes da oferta para: <span className="font-semibold text-accent">{businessName}</span>.
        </p>
      </section>

      <Card className="shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center text-lg text-primary md:text-xl">
                <Tag className="mr-2 h-5 w-5 md:h-6 md:w-6 text-accent" />
                Detalhes da Oferta: {offerToEdit.title}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Altere os campos abaixo e salve. O QR Code será atualizado com as novas informações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title" className="text-sm">Título da Oferta *</FormLabel>
                    <FormControl>
                      <Input id="title" placeholder="Ex: Happy Hour Especial" {...field} value={field.value ?? ''} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3">
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
                name="usageLimitPerUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="usageLimitPerUser" className="text-sm">Limite de Uso por Usuário Prime</FormLabel>
                    <FormControl>
                      <Input id="usageLimitPerUser" type="number" placeholder="Ex: 1" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription className="text-xs">Quantas vezes um membro Prime pode usar esta oferta.</FormDescription>
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
            </CardContent>
            <CardFooter className="p-4">
              <Button type="submit" size="default" className="w-full bg-primary hover:bg-primary/90 text-sm" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Salvando Alterações...' : 'Salvar Alterações na Oferta'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
