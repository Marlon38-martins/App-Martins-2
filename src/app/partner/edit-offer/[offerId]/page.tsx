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
import { ArrowLeft, Tag, Save, Loader2, AlertCircle, Star, ShieldAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const MOCK_PARTNER_BUSINESS_ID = '1'; 

const offerFormSchema = z.object({
  title: z.string().min(5, { message: 'Título da oferta é obrigatório (mínimo 5 caracteres).' }),
  description: z.string().min(10, { message: 'Descrição da oferta é obrigatória (mínimo 10 caracteres).' }),
  offerType: z.enum(['discount', 'p1g2'], { required_error: "Tipo da oferta é obrigatório."}),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  isPay1Get2: z.boolean().optional(),
  isVipOffer: z.boolean().optional().default(false), 
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
            isVipOffer: currentOffer.isVipOffer || false,
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
        isPay1Get2: data.offerType === 'p1g2' ? true : false,
        discountPercentage: data.offerType === 'discount' ? data.discountPercentage : 0,
        isVipOffer: data.isVipOffer,
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
        <div className="p-3 md:p-4">
            <Skeleton className="h-7 w-1/3 mb-4" />
            <Card className="shadow-md">
                <CardHeader className="p-3"><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-3 p-3">
                    {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                </CardContent>
                <CardFooter className="p-3"><Skeleton className="h-9 w-full" /></CardFooter>
            </Card>
        </div>
    );
  }

  if (error) {
    return (
         <div className="p-3 md:p-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">Erro ao Carregar Oferta</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
            <Button asChild variant="outline" size="sm" className="mt-3 text-xs">
              <Link href="/partner/dashboard">
                <ArrowLeft className="mr-1.5 h-3 w-3" />
                Voltar para o Painel
              </Link>
            </Button>
        </div>
    );
  }
  
  if (!offerToEdit) {
     return (
         <div className="p-3 md:p-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">Oferta Não Encontrada</AlertTitle>
                <AlertDescription className="text-xs">A oferta que você está tentando editar não foi encontrada.</AlertDescription>
            </Alert>
             <Button asChild variant="outline" size="sm" className="mt-3 text-xs">
              <Link href="/partner/dashboard">
                <ArrowLeft className="mr-1.5 h-3 w-3" />
                Voltar para o Painel
              </Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="p-3 md:p-4">
      <Button asChild variant="outline" size="sm" className="mb-4 text-xs">
        <Link href="/partner/dashboard">
          <ArrowLeft className="mr-1.5 h-3 w-3" />
          Voltar para o Painel de Ofertas
        </Link>
      </Button>

      <section className="mb-5">
        <h2 className="mb-1.5 text-lg font-bold tracking-tight text-primary md:text-xl">
          Editar Oferta
        </h2>
        <p className="text-xs text-foreground/80 md:text-sm">
          Modifique os detalhes da oferta "{offerToEdit?.title}" para: <span className="font-semibold text-accent">{businessName}</span>.
        </p>
      </section>

      <Card className="shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="p-3">
              <CardTitle className="flex items-center text-md text-primary md:text-lg">
                <Tag className="mr-2 h-4 w-4 md:h-5 md:w-5 text-accent" />
                Detalhes da Oferta
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Altere os campos abaixo e salve. O QR Code será atualizado com as novas informações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title" className="text-xs">Título da Oferta *</FormLabel>
                    <FormControl>
                      <Input id="title" placeholder="Ex: Happy Hour Especial" {...field} value={field.value ?? ''} className="h-9 text-sm"/>
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
                    <FormLabel htmlFor="description" className="text-xs">Descrição da Oferta *</FormLabel>
                    <FormControl>
                      <Textarea id="description" placeholder="Descreva os detalhes da oferta..." {...field} value={field.value ?? ''} rows={3} className="min-h-[60px] text-sm"/>
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
                    <FormLabel className="text-xs">Tipo de Oferta *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Selecione o tipo da oferta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="discount" className="text-xs">Desconto Percentual</SelectItem>
                        <SelectItem value="p1g2" className="text-xs">Pague 1 Leve 2 (ou similar)</SelectItem>
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
                      <FormLabel htmlFor="discountPercentage" className="text-xs">Porcentagem de Desconto (%) *</FormLabel>
                      <FormControl>
                        <Input id="discountPercentage" type="number" placeholder="Ex: 10 para 10% de desconto" {...field} value={field.value ?? ''} className="h-9 text-sm"/>
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
                        <FormLabel htmlFor="isPay1Get2" className="text-xs font-normal cursor-pointer">
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
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2.5 bg-purple-500/10">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="isVipOffer"
                        className="border-purple-500 data-[state=checked]:bg-purple-600 data-[state=checked]:text-purple-50"
                      />
                    </FormControl>
                    <FormLabel htmlFor="isVipOffer" className="text-xs font-normal cursor-pointer flex items-center text-purple-700">
                      <Star className="mr-1.5 h-3 w-3 text-yellow-400 fill-yellow-400" />
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
                    <FormLabel htmlFor="usageLimitPerUser" className="text-xs">Limite de Uso por Usuário Prime</FormLabel>
                    <FormControl>
                      <Input id="usageLimitPerUser" type="number" placeholder="Ex: 1" {...field} value={field.value ?? ''} className="h-9 text-sm"/>
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
                    <FormLabel htmlFor="termsAndConditions" className="text-xs">Termos e Condições da Oferta *</FormLabel>
                    <FormControl>
                      <Textarea id="termsAndConditions" placeholder="Ex: Válido de segunda a quinta..." {...field} value={field.value ?? ''} rows={3} className="min-h-[60px] text-sm"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="p-3">
              <Button type="submit" size="sm" className="w-full bg-primary hover:bg-primary/90 text-xs h-9" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-3.5 w-3.5" />}
                {isSubmitting ? 'Salvando Alterações...' : 'Salvar Alterações na Oferta'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
