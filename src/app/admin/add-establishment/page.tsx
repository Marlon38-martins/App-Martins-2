
// src/app/admin/add-establishment/page.tsx
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox'; 
import { useToast } from '@/hooks/use-toast';
import type { LucideIconName } from '@/services/gramado-businesses';
import { ArrowLeft, Building, PlusCircle, Tag } from 'lucide-react';

const iconNames: LucideIconName[] = [
  'UtensilsCrossed', 
  'BedDouble', 
  'ShoppingBag', 
  'Landmark', 
  'Wrench',
  'Coffee',
  'Trees',
  'TicketPercent'
];

const establishmentFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome do estabelecimento é obrigatório (mínimo 3 caracteres).' }),
  type: z.string().min(3, { message: 'Tipo de estabelecimento é obrigatório (Ex: Restaurante, Hotel, Loja).' }),
  shortDescription: z.string().min(10, { message: 'Descrição curta é obrigatória (mínimo 10 caracteres).' }).max(150, { message: 'Descrição curta muito longa (máximo 150 caracteres).' }),
  fullDescription: z.string().min(20, { message: 'Descrição completa é obrigatória (mínimo 20 caracteres).' }),
  address: z.string().min(10, { message: 'Endereço é obrigatório.' }),
  phoneNumber: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos (com DDD).' }).optional().or(z.literal('')),
  website: z.string().url({ message: 'URL do website inválida (ex: https://exemplo.com).' }).optional().or(z.literal('')),
  latitude: z.coerce.number({ invalid_type_error: 'Latitude deve ser um número.' }).min(-90, {message: "Latitude mínima é -90"}).max(90, {message: "Latitude máxima é 90"}),
  longitude: z.coerce.number({ invalid_type_error: 'Longitude deve ser um número.' }).min(-180, {message: "Longitude mínima é -180"}).max(180, {message: "Longitude máxima é 180"}),
  imageUrl: z.string().url({ message: 'URL da imagem inválida (ex: https://picsum.photos/seed/nomedaloja/600/400).' }),
  icon: z.enum(iconNames as [LucideIconName, ...LucideIconName[]], { required_error: "Ícone é obrigatório." }),
  hasDefaultOffer: z.boolean().optional(),
  defaultOfferTitle: z.string().optional(),
  defaultOfferDescription: z.string().optional(),
  defaultOfferIsPay1Get2: z.boolean().optional(),
  defaultOfferTerms: z.string().optional(),
}).refine(data => {
  if (data.hasDefaultOffer) {
    return !!data.defaultOfferTitle && !!data.defaultOfferDescription && !!data.defaultOfferTerms;
  }
  return true;
}, {
  message: "Se uma oferta padrão for adicionada, título, descrição e termos são obrigatórios.",
  path: ["defaultOfferTitle"], 
});


type EstablishmentFormValues = z.infer<typeof establishmentFormSchema>;

export default function AddEstablishmentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EstablishmentFormValues>({
    resolver: zodResolver(establishmentFormSchema),
    defaultValues: {
      name: '',
      type: '',
      shortDescription: '',
      fullDescription: '',
      address: '',
      phoneNumber: '',
      website: '',
      latitude: undefined, 
      longitude: undefined, 
      imageUrl: 'https://placehold.co/seed/novo-estabelecimento/600/400',
      icon: undefined,
      hasDefaultOffer: false,
      defaultOfferTitle: '',
      defaultOfferDescription: '',
      defaultOfferIsPay1Get2: true,
      defaultOfferTerms: 'Válido conforme regras do clube Guia Mais. Apresente seu card de membro.',
    },
  });

  const watchHasDefaultOffer = form.watch('hasDefaultOffer');

  const onSubmit: SubmitHandler<EstablishmentFormValues> = async (data) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newEstablishment = {
        id: String(Date.now()), 
        ...data,
    };
    
    let newDeal = null;
    if (data.hasDefaultOffer && data.defaultOfferTitle && data.defaultOfferDescription && data.defaultOfferTerms) {
        newDeal = {
            id: `deal-${Date.now()}`, 
            businessId: newEstablishment.id,
            title: data.defaultOfferTitle,
            description: data.defaultOfferDescription,
            isPay1Get2: data.defaultOfferIsPay1Get2,
            usageLimitPerUser: data.defaultOfferIsPay1Get2 ? 1 : undefined, 
            termsAndConditions: data.defaultOfferTerms,
            discountPercentage: 0, 
        };
        console.log('New Default Offer:', newDeal);
    }

    console.log('New Establishment Data:', newEstablishment);

    toast({
      title: 'Solicitação de Cadastro Enviada!',
      description: `O estabelecimento "${data.name}" foi submetido para aprovação.`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    form.reset(); 
  };

  return (
    <div>
      <Button asChild variant="outline" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Início
        </Link>
      </Button>

      <section className="mb-8">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Adicionar Novo Estabelecimento Parceiro
        </h2>
        <p className="text-lg text-foreground/80">
          Preencha os dados abaixo para cadastrar um novo parceiro no Guia Mais.
        </p>
      </section>

      <Card className="shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-primary">
                <Building className="mr-3 h-7 w-7 text-accent" />
                Detalhes do Estabelecimento
              </CardTitle>
              <CardDescription>
                Forneça informações completas para o cadastro. Todos os campos marcados com * são obrigatórios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Nome do Estabelecimento *</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Ex: Pousada Vista Linda" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="type">Tipo de Estabelecimento *</FormLabel>
                      <FormControl>
                        <Input id="type" placeholder="Ex: Hotel, Restaurante, Loja de Artesanato" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="shortDescription">Descrição Curta (para cards) *</FormLabel>
                    <FormControl>
                      <Input id="shortDescription" placeholder="Uma breve descrição (até 150 caracteres)" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="fullDescription">Descrição Completa *</FormLabel>
                    <FormControl>
                      <Textarea id="fullDescription" placeholder="Descreva detalhadamente o estabelecimento, seus serviços e diferenciais." {...field} value={field.value ?? ''} rows={4}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="address">Endereço Completo *</FormLabel>
                    <FormControl>
                      <Input id="address" placeholder="Rua, Número, Bairro, Cidade - Estado, CEP" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="phoneNumber">Telefone (com DDD)</FormLabel>
                      <FormControl>
                        <Input id="phoneNumber" type="tel" placeholder="(XX) XXXXX-XXXX" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="website">Website</FormLabel>
                      <FormControl>
                        <Input id="website" type="url" placeholder="https://www.exemplo.com.br" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="latitude">Latitude *</FormLabel>
                      <FormControl>
                        <Input id="latitude" type="number" step="any" placeholder="-6.0869" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription>Coordenada geográfica (ex: -6.0869).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="longitude">Longitude *</FormLabel>
                      <FormControl>
                        <Input id="longitude" type="number" step="any" placeholder="-37.9119" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription>Coordenada geográfica (ex: -37.9119).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel htmlFor="imageUrl">URL da Imagem Principal *</FormLabel>
                        <FormControl>
                            <Input id="imageUrl" placeholder="https://placehold.co/seed/nome/600/400" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormDescription>Use uma URL pública (ex: Picsum, Imgur).</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="icon">Ícone representativo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id="icon">
                            <SelectValue placeholder="Selecione um ícone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconNames.map(iconName => (
                            <SelectItem key={iconName} value={iconName}>
                              {iconName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Ícone que aparecerá no mapa e listas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 rounded-md border border-dashed p-4">
                <FormField
                  control={form.control}
                  name="hasDefaultOffer"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="hasDefaultOffer"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="hasDefaultOffer" className="cursor-pointer flex items-center text-lg text-primary">
                          <Tag className="mr-2 h-5 w-5 text-accent" />
                          Adicionar Oferta Padrão Inicial?
                        </FormLabel>
                        <FormDescription>
                          Cadastre uma oferta promocional inicial (ex: "Pague 1 Leve 2") para este estabelecimento.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {watchHasDefaultOffer && (
                  <div className="ml-8 space-y-6 border-l border-accent pl-6 pt-2">
                    <FormField
                      control={form.control}
                      name="defaultOfferTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título da Oferta Padrão *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Prato Principal em Dobro" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="defaultOfferDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição da Oferta Padrão *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descreva a oferta. Ex: Compre um prato principal e ganhe outro de igual ou menor valor." {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="defaultOfferIsPay1Get2"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="defaultOfferIsPay1Get2"
                                />
                            </FormControl>
                            <FormLabel htmlFor="defaultOfferIsPay1Get2" className="cursor-pointer font-normal">
                                Esta é uma oferta "Pague 1 Leve 2"?
                            </FormLabel>
                            </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name="defaultOfferTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Termos e Condições da Oferta Padrão *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Ex: Válido de segunda a quinta, exceto feriados. Apresente o card Guia Mais." {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                <PlusCircle className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Enviando Cadastro...' : 'Cadastrar Estabelecimento'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
