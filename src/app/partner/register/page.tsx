
// src/app/partner/register/page.tsx
'use client';

import { useState, useEffect } from 'react'; // Added useEffect
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
import { ArrowLeft, Building, PlusCircle, Tag, Send, UserPlus as ContactIcon } from 'lucide-react'; // Changed UserPlus to ContactIcon alias

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

const partnerRegistrationFormSchema = z.object({
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
  
  contactName: z.string().min(3, { message: 'Nome do responsável é obrigatório.' }),
  contactEmail: z.string().email({ message: 'Email do responsável é obrigatório e deve ser válido.' }),
  contactPhone: z.string().min(10, { message: 'Telefone do responsável é obrigatório.' }),
  
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


type PartnerRegistrationFormValues = z.infer<typeof partnerRegistrationFormSchema>;

export default function PartnerRegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Solicitação de Parceria - Guia Mais";
  }, []);

  const form = useForm<PartnerRegistrationFormValues>({
    resolver: zodResolver(partnerRegistrationFormSchema),
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
      imageUrl: 'https://placehold.co/seed/novo-parceiro/600/400',
      icon: undefined,
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      hasDefaultOffer: false,
      defaultOfferTitle: '',
      defaultOfferDescription: '',
      defaultOfferIsPay1Get2: true,
      defaultOfferTerms: 'Válido conforme regras do clube Guia Mais. Apresente seu card de membro.',
    },
  });

  const watchHasDefaultOffer = form.watch('hasDefaultOffer');

  const onSubmit: SubmitHandler<PartnerRegistrationFormValues> = async (data) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Partner Registration Request Data:', data);

    toast({
      title: 'Solicitação de Parceria Enviada!',
      description: `Obrigado, ${data.contactName}! Sua solicitação para o estabelecimento "${data.name}" foi enviada para análise. Entraremos em contato em breve.`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    form.reset(); 
  };

  return (
    <div className="p-4 md:p-6">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/partner-registration">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Seja Parceiro
        </Link>
      </Button>

      <section className="mb-8">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-primary md:text-3xl">
          Formulário de Solicitação de Parceria Guia Mais
        </h2>
        <p className="text-lg text-foreground/80">
          Preencha os dados abaixo para iniciar o processo de parceria com o Guia Mais.
        </p>
      </section>

      <Card className="shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-primary">
                <Building className="mr-3 h-7 w-7 text-accent" />
                Dados do Estabelecimento
              </CardTitle>
              <CardDescription>
                Informações que aparecerão no aplicativo para os usuários.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Nome do Estabelecimento *</FormLabel> <FormControl> <Input placeholder="Ex: Pousada Vista Linda" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="type" render={({ field }) => ( <FormItem> <FormLabel>Tipo de Estabelecimento *</FormLabel> <FormControl> <Input placeholder="Ex: Hotel, Restaurante" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              </div>
              <FormField control={form.control} name="shortDescription" render={({ field }) => ( <FormItem> <FormLabel>Descrição Curta (para cards) *</FormLabel> <FormControl> <Input placeholder="Uma breve descrição (até 150 caracteres)" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="fullDescription" render={({ field }) => ( <FormItem> <FormLabel>Descrição Completa *</FormLabel> <FormControl> <Textarea placeholder="Descreva detalhadamente o estabelecimento..." {...field} value={field.value ?? ''} rows={3}/> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Endereço Completo *</FormLabel> <FormControl> <Input placeholder="Rua, Número, Bairro, Cidade - Estado, CEP" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="phoneNumber" render={({ field }) => ( <FormItem> <FormLabel>Telefone do Estabelecimento</FormLabel> <FormControl> <Input type="tel" placeholder="(XX) XXXXX-XXXX" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="website" render={({ field }) => ( <FormItem> <FormLabel>Website</FormLabel> <FormControl> <Input type="url" placeholder="https://www.exemplo.com.br" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="latitude" render={({ field }) => ( <FormItem> <FormLabel>Latitude *</FormLabel> <FormControl> <Input type="number" step="any" placeholder="-6.0869" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="longitude" render={({ field }) => ( <FormItem> <FormLabel>Longitude *</FormLabel> <FormControl> <Input type="number" step="any" placeholder="-37.9119" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="imageUrl" render={({ field }) => ( <FormItem> <FormLabel>URL da Imagem Principal *</FormLabel> <FormControl> <Input placeholder="https://placehold.co/seed/seu-nome/600/400" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="icon" render={({ field }) => ( <FormItem> <FormLabel>Ícone representativo *</FormLabel> <Select onValueChange={field.onChange} value={field.value ?? undefined}> <FormControl> <SelectTrigger> <SelectValue placeholder="Selecione um ícone" /> </SelectTrigger> </FormControl> <SelectContent> {iconNames.map(iconName => ( <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )} />
              </div>
            </CardContent>

            <CardHeader className="mt-3">
              <CardTitle className="flex items-center text-xl text-primary">
                <ContactIcon className="mr-3 h-7 w-7 text-accent" />
                Dados do Responsável pela Parceria
              </CardTitle>
              <CardDescription>
                Informações para entrarmos em contato sobre a parceria.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="contactName" render={({ field }) => ( <FormItem> <FormLabel>Nome do Responsável *</FormLabel> <FormControl> <Input placeholder="Seu nome completo" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="contactEmail" render={({ field }) => ( <FormItem> <FormLabel>Email do Responsável *</FormLabel> <FormControl> <Input type="email" placeholder="seu_email@dominio.com" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="contactPhone" render={({ field }) => ( <FormItem> <FormLabel>Telefone do Responsável *</FormLabel> <FormControl> <Input type="tel" placeholder="(XX) XXXXX-XXXX" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              </div>
            </CardContent>

            <CardHeader className="mt-3">
              <CardTitle className="flex items-center text-xl text-primary">
                <Tag className="mr-3 h-7 w-7 text-accent" />
                Oferta Inicial (Opcional)
              </CardTitle>
              <CardDescription>
                Deseja cadastrar uma oferta de boas-vindas para os membros Guia Mais?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 rounded-md border border-dashed p-3">
              <FormField control={form.control} name="hasDefaultOffer" render={({ field }) => ( <FormItem className="flex flex-row items-start space-x-2 space-y-0"> <FormControl> <Checkbox checked={field.value} onCheckedChange={field.onChange} id="hasDefaultOffer" /> </FormControl> <div className="space-y-0.5 leading-none"> <FormLabel htmlFor="hasDefaultOffer" className="cursor-pointer text-sm"> Sim, quero adicionar uma oferta inicial. </FormLabel> </div> </FormItem> )} />
              {watchHasDefaultOffer && (
                <div className="ml-6 space-y-4 border-l border-accent pl-4 pt-1">
                  <FormField control={form.control} name="defaultOfferTitle" render={({ field }) => ( <FormItem> <FormLabel>Título da Oferta Inicial *</FormLabel> <FormControl> <Input placeholder="Ex: Prato Principal em Dobro" {...field} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="defaultOfferDescription" render={({ field }) => ( <FormItem> <FormLabel>Descrição da Oferta Inicial *</FormLabel> <FormControl> <Textarea placeholder="Descreva a oferta..." {...field} value={field.value ?? ''} rows={2}/> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="defaultOfferIsPay1Get2" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-2 space-y-0"> <FormControl> <Checkbox checked={field.value} onCheckedChange={field.onChange} id="defaultOfferIsPay1Get2" /> </FormControl> <FormLabel htmlFor="defaultOfferIsPay1Get2" className="cursor-pointer font-normal text-sm"> Esta é uma oferta "Pague 1 Leve 2"? </FormLabel> </FormItem> )} />
                  <FormField control={form.control} name="defaultOfferTerms" render={({ field }) => ( <FormItem> <FormLabel>Termos e Condições da Oferta Inicial *</FormLabel> <FormControl> <Textarea placeholder="Ex: Válido de segunda a quinta..." {...field} value={field.value ?? ''} rows={2}/> </FormControl> <FormMessage /> </FormItem> )} />
                </div>
              )}
            </CardContent>

            <CardFooter className="mt-6">
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                <Send className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Enviando Solicitação...' : 'Enviar Solicitação de Parceria'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

