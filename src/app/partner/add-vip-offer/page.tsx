
// src/app/partner/add-vip-offer/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { getGramadoBusinessById, type GramadoBusiness } from '@/services/gramado-businesses';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star, PlusCircle, Loader2, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const MOCK_PARTNER_BUSINESS_ID = '1';

const offerFormSchema = z.object({
  title: z.string().min(5, { message: 'Título da oferta é obrigatório (mínimo 5 caracteres).' }),
  description: z.string().min(10, { message: 'Descrição da oferta é obrigatória (mínimo 10 caracteres).' }),
  offerType: z.enum(['discount', 'p1g2'], { required_error: "Tipo da oferta é obrigatório."}),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  isPay1Get2: z.boolean().optional(),
  isVipOffer: z.boolean().optional().default(true),
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

interface CreatedOfferInfo {
  id: string;
  title: string;
}

export default function AddVipOfferPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partnerBusiness, setPartnerBusiness] = useState<GramadoBusiness | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);
  const [createdOfferDetails, setCreatedOfferDetails] = useState<CreatedOfferInfo | null>(null);

  useEffect(() => {
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
      isVipOffer: true,
      usageLimitPerUser: 1,
      termsAndConditions: 'Válido conforme regras do clube Guia Mais. Apresente seu card de membro VIP.',
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

    const newDealId = `deal-vip-${Date.now()}`;
    const newDeal = {
        id: newDealId,
        businessId: partnerBusiness.id,
        title: data.title,
        description: data.description,
        isPay1Get2: data.offerType === 'p1g2' ? true : false,
        discountPercentage: data.offerType === 'discount' ? data.discountPercentage : 0,
        isVipOffer: data.isVipOffer,
        usageLimitPerUser: data.usageLimitPerUser,
        termsAndConditions: data.termsAndConditions,
    };

    console.log('New Partner VIP Offer Data:', newDeal, 'For Business:', partnerBusiness.name);

    setCreatedOfferDetails({ id: newDealId, title: data.title });
    setIsSubmitting(false);
    // form.reset(); // Don't reset form immediately to show QR details

    toast({
      title: 'Oferta VIP Cadastrada!',
      description: `A oferta VIP "${data.title}" foi adicionada. Veja o QR Code abaixo para download.`,
      variant: 'default',
    });
  };

  const handleCreateAnotherOffer = () => {
    setCreatedOfferDetails(null);
    form.reset();
  };

  if (isLoadingBusiness) {
    return (
        <div className="p-3 md:p-4 space-y-3">
            <Skeleton className="h-7 w-1/3 mb-4" />
             <Card className="shadow-md">
                <CardHeader className="p-3"><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-2.5 p-3">
                    {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                </CardContent>
                <CardFooter className="p-3"><Skeleton className="h-9 w-full" /></CardFooter>
            </Card>
        </div>
    );
  }

  if (!partnerBusiness) {
    return (
         <div className="p-3 md:p-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">Erro</AlertTitle>
                <AlertDescription className="text-xs">Não foi possível carregar os dados do estabelecimento para adicionar ofertas VIP. Tente voltar e acessar novamente.</AlertDescription>
            </Alert>
            <Button asChild variant="outline" size="sm" className="mt-3 text-xs">
              <Link href="/partner/panel">
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
        <Link href="/partner/panel">
          <ArrowLeft className="mr-1.5 h-3 w-3" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <section className="mb-5">
        <h2 className="mb-1.5 text-lg font-bold tracking-tight text-primary md:text-xl">
          Criar Nova Oferta VIP Especial
        </h2>
        <p className="text-xs text-foreground/80 md:text-sm">
          Adicione promoções exclusivas para membros VIP em: <span className="font-semibold text-accent">{partnerBusiness.name}</span>.
        </p>
      </section>

      {createdOfferDetails ? (
        <Card className="shadow-md">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base text-primary md:text-lg">
              <Star className="mr-2 h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-yellow-400" />
              QR Code da Oferta VIP: {createdOfferDetails.title}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Este QR Code pode ser usado pelos clientes VIP para resgatar a oferta.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 text-center">
            <div className="mb-3 inline-block border p-2 rounded-md bg-white">
              <Image
                src={`https://placehold.co/200x200.png?text=QR+VIP+${createdOfferDetails.id.substring(0, 8)}`}
                alt={`QR Code para ${createdOfferDetails.title}`}
                width={200}
                height={200}
                data-ai-hint="qr code offer"
              />
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              (Este é um QR Code simulado. Em um app real, ele seria funcional.)
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs mr-2"
            >
              <a href={`https://placehold.co/200x200.png?text=QR+VIP+${createdOfferDetails.id.substring(0, 8)}`} download={`QR_Code_VIP_${createdOfferDetails.title.replace(/\s+/g, '_')}.png`}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Baixar QR Code (Simulado)
              </a>
            </Button>
          </CardContent>
          <CardFooter className="p-3">
            <Button onClick={handleCreateAnotherOffer} size="sm" className="w-full text-xs">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Criar Outra Oferta VIP
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="p-3">
                <CardTitle className="flex items-center text-base text-primary md:text-lg">
                  <Star className="mr-2 h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-yellow-400" />
                  Detalhes da Nova Oferta VIP
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Preencha os campos abaixo. Use a opção 'Oferta VIP' para promoções exclusivas. Um QR Code será gerado automaticamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 p-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="title" className="text-xs">Título da Oferta VIP *</FormLabel>
                      <FormControl>
                        <Input id="title" placeholder="Ex: Acesso VIP Exclusivo" {...field} value={field.value ?? ''} className="text-sm h-9"/>
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
                      <FormLabel htmlFor="description" className="text-xs">Descrição da Oferta VIP *</FormLabel>
                      <FormControl>
                        <Textarea id="description" placeholder="Descreva os detalhes da oferta VIP..." {...field} value={field.value ?? ''} rows={2} className="text-sm min-h-[60px]"/>
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
                      <FormLabel className="text-xs">Tipo de Oferta VIP *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-sm h-9">
                            <SelectValue placeholder="Selecione o tipo da oferta VIP" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="discount">Desconto Percentual VIP</SelectItem>
                          <SelectItem value="p1g2">Benefício Especial VIP (Ex: Pague 1 Leve 2)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Defina as condições especiais desta oferta VIP nos campos 'Descrição' e 'Termos e Condições'.
                      </FormDescription>
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
                        <FormLabel htmlFor="discountPercentage" className="text-xs">Porcentagem de Desconto VIP (%) *</FormLabel>
                        <FormControl>
                          <Input id="discountPercentage" type="number" placeholder="Ex: 20" {...field} value={field.value ?? ''} className="text-sm h-9"/>
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
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2">
                          <FormControl>
                              <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="isPay1Get2"
                              />
                          </FormControl>
                          <FormLabel htmlFor="isPay1Get2" className="text-xs font-normal cursor-pointer">
                              Confirmar como benefício "Pague 1 Leve 2" (ou similar)
                          </FormLabel>
                          </FormItem>
                      )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="isVipOffer"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2 bg-purple-500/10">
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
                        Marcar como Oferta Exclusiva para Membros VIP
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usageLimitPerUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="usageLimitPerUser" className="text-xs">Limite de Uso por Membro VIP</FormLabel>
                      <FormControl>
                        <Input id="usageLimitPerUser" type="number" placeholder="Ex: 1" {...field} value={field.value ?? ''} className="text-sm h-9"/>
                      </FormControl>
                      <FormDescription className="text-xs">Padrão é 1 uso.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAndConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="termsAndConditions" className="text-xs">Termos e Condições da Oferta VIP *</FormLabel>
                      <FormControl>
                        <Textarea id="termsAndConditions" placeholder="Ex: Válido apenas para membros VIP..." {...field} value={field.value ?? ''} rows={2} className="text-sm min-h-[60px]"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-xs text-muted-foreground pt-1">
                  Ofertas VIP devem ser realmente especiais para valorizar seus clientes!
                </p>
              </CardContent>
              <CardFooter className="p-3">
                <Button type="submit" size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs" disabled={isSubmitting}>
                   {isSubmitting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <PlusCircle className="mr-1.5 h-3.5 w-3.5" />}
                  {isSubmitting ? 'Criando Oferta VIP...' : 'Criar Nova Oferta VIP'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
}

    

    