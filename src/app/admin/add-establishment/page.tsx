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
import { Label } from '@/components/ui/label'; // Unused, FormLabel is used
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { LucideIconName } from '@/services/gramado-businesses';
import { ArrowLeft, Building, PlusCircle } from 'lucide-react';

// Ensure this list matches the LucideIconName type in gramado-businesses.ts
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
  icon: z.enum(iconNames as [LucideIconName, ...LucideIconName[]], { required_error: "Ícone é obrigatório." }), // Cast for z.enum
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
      latitude: undefined, // Default to undefined for coerce.number to handle empty input
      longitude: undefined,
      imageUrl: 'https://picsum.photos/seed/novo-estabelecimento/600/400',
      icon: undefined,
    },
  });

  const onSubmit: SubmitHandler<EstablishmentFormValues> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call for adding establishment
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('New Establishment Data:', data);
    toast({
      title: 'Solicitação de Cadastro Enviada!',
      description: `O estabelecimento "${data.name}" foi submetido para aprovação.`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    form.reset(); 
    // Potentially redirect: router.push('/admin/dashboard');
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
          Adicionar Novo Estabelecimento
        </h2>
        <p className="text-lg text-foreground/80">
          Preencha os dados abaixo para cadastrar um novo parceiro no Chill Martins.
        </p>
      </section>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary">
            <Building className="mr-3 h-7 w-7 text-accent" />
            Detalhes do Estabelecimento
          </CardTitle>
          <CardDescription>
            Forneça informações completas para o cadastro. Todos os campos marcados com * são obrigatórios.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Nome do Estabelecimento *</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Ex: Pousada Vista Linda" {...field} />
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
                        <Input id="type" placeholder="Ex: Hotel, Restaurante, Loja de Artesanato" {...field} />
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
                      <Input id="shortDescription" placeholder="Uma breve descrição (até 150 caracteres)" {...field} />
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
                      <Textarea id="fullDescription" placeholder="Descreva detalhadamente o estabelecimento, seus serviços e diferenciais." {...field} rows={4}/>
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
                      <Input id="address" placeholder="Rua, Número, Bairro, Cidade - Estado, CEP" {...field} />
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
                        <Input id="phoneNumber" type="tel" placeholder="(XX) XXXXX-XXXX" {...field} />
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
                        <Input id="website" type="url" placeholder="https://www.exemplo.com.br" {...field} />
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
                        <Input id="latitude" type="number" step="any" placeholder="-6.0869" {...field} />
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
                        <Input id="longitude" type="number" step="any" placeholder="-37.9119" {...field} />
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
                            <Input id="imageUrl" placeholder="https://picsum.photos/seed/nome/600/400" {...field} />
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

