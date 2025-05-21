
// src/app/admin/edit-partner-details/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useAuth } from '@/hooks/use-auth-client';
import { getGramadoBusinessById, type GramadoBusiness, type LucideIconName } from '@/services/gramado-businesses';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Building, Save, ShieldAlert } from 'lucide-react';

const iconNames: LucideIconName[] = [
  'UtensilsCrossed', 
  'BedDouble', 
  'ShoppingBag', 
  'Landmark', 
  'Wrench',
  'Coffee',
  'Trees',
  'TicketPercent',
  'Beer'
];

const adminEditEstablishmentFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome do estabelecimento é obrigatório (mínimo 3 caracteres).' }),
  type: z.string().min(3, { message: 'Tipo de estabelecimento é obrigatório (Ex: Restaurante, Hotel, Loja).' }),
  shortDescription: z.string().min(10, { message: 'Descrição curta é obrigatória (mínimo 10 caracteres).' }).max(150, { message: 'Descrição curta muito longa (máximo 150 caracteres).' }),
  fullDescription: z.string().min(20, { message: 'Descrição completa é obrigatória (mínimo 20 caracteres).' }),
  address: z.string().min(10, { message: 'Endereço é obrigatório.' }),
  phoneNumber: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos (com DDD).' }).optional().or(z.literal('')),
  website: z.string().url({ message: 'URL do website inválida.' }).optional().or(z.literal('')),
  instagramUrl: z.string().url({ message: 'URL do Instagram inválida.' }).optional().or(z.literal('')),
  facebookUrl: z.string().url({ message: 'URL do Facebook inválida.' }).optional().or(z.literal('')),
  whatsappNumber: z.string().min(10, {message: 'WhatsApp deve ter ao menos 10 dígitos.'}).optional().or(z.literal('')),
  latitude: z.coerce.number({ invalid_type_error: 'Latitude deve ser um número.' }).min(-90, {message: "Latitude mínima é -90"}).max(90, {message: "Latitude máxima é 90"}),
  longitude: z.coerce.number({ invalid_type_error: 'Longitude deve ser um número.' }).min(-180, {message: "Longitude mínima é -180"}).max(180, {message: "Longitude máxima é 180"}),
  imageUrl: z.string().url({ message: 'URL da imagem inválida.' }),
  icon: z.enum(iconNames as [LucideIconName, ...LucideIconName[]], { required_error: "Ícone é obrigatório." }),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().min(0).optional(),
});

type AdminEditEstablishmentFormValues = z.infer<typeof adminEditEstablishmentFormSchema>;

interface AdminEditBusinessPageParams {
  id: string; 
}

export default function AdminEditPartnerDetailsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams() as AdminEditBusinessPageParams;
  const businessId = params.id;

  const { user, isAdmin, loading: authLoading } = useAuth();
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<AdminEditEstablishmentFormValues>({
    resolver: zodResolver(adminEditEstablishmentFormSchema),
    defaultValues: {}, 
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/admin/edit-partner-details/${businessId}`);
    }
  }, [authLoading, user, router, businessId]);

  useEffect(() => {
    if (user && isAdmin && businessId) {
      async function loadBusinessData() {
        setIsLoadingData(true);
        setError(null);
        try {
          const businessData = await getGramadoBusinessById(businessId);
          if (businessData) {
            setBusiness(businessData);
            form.reset({
              name: businessData.name,
              type: businessData.type,
              shortDescription: businessData.shortDescription,
              fullDescription: businessData.fullDescription,
              address: businessData.address,
              phoneNumber: businessData.phoneNumber || '',
              website: businessData.website || '',
              instagramUrl: businessData.instagramUrl || '',
              facebookUrl: businessData.facebookUrl || '',
              whatsappNumber: businessData.whatsappNumber || '',
              latitude: businessData.latitude,
              longitude: businessData.longitude,
              imageUrl: businessData.imageUrl,
              icon: businessData.icon,
              rating: businessData.rating ?? undefined, // Ensure undefined if null/undefined
              reviewCount: businessData.reviewCount ?? undefined, // Ensure undefined if null/undefined
            });
          } else {
            setError('Estabelecimento não encontrado. Não é possível editar.');
          }
        } catch (err) {
          console.error("Error loading business data for admin editing:", err);
          setError('Falha ao carregar dados do estabelecimento.');
        } finally {
          setIsLoadingData(false);
        }
      }
      loadBusinessData();
    } else if (user && !isAdmin) {
      setIsLoadingData(false); 
    }
  }, [user, isAdmin, businessId, form]);


  const onSubmit: SubmitHandler<AdminEditEstablishmentFormValues> = async (data) => {
    if (!business) {
        toast({ title: "Erro", description: "Dados do estabelecimento não carregados.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const updatedBusiness = {
        ...business, 
        ...data,
        rating: data.rating === undefined || isNaN(data.rating) ? undefined : data.rating, // Handle potential NaN
        reviewCount: data.reviewCount === undefined || isNaN(data.reviewCount) ? undefined : data.reviewCount,
    };

    console.log('Admin Updated Establishment Data:', updatedBusiness);

    toast({
      title: 'Dados Atualizados pelo Admin!',
      description: `As informações de "${data.name}" foram salvas com sucesso (simulação).`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    router.push('/admin/list-all-partners');
  };
  
  if (authLoading || (isAdmin && isLoadingData)) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="mb-6 h-10 w-1/3" />
        <Skeleton className="mb-8 h-8 w-2/3" />
        <Card className="shadow-xl">
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </CardContent>
          <CardFooter><Skeleton className="h-12 w-full" /></CardFooter>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-center">Redirecionando para login...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md text-center">
          <ShieldAlert className="mx-auto mb-2 h-6 w-6" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>Esta funcionalidade é exclusiva para administradores.</AlertDescription>
        </Alert>
         <Button asChild variant="outline" className="mt-6">
          <Link href="/"> <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Início </Link>
        </Button>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/admin/list-all-partners"> <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista </Link>
        </Button>
      </div>
    );
  }

  if (!business) {
     return <div className="p-6 text-center">Carregando dados do estabelecimento para edição...</div>;
  }


  return (
    <div className="p-4 md:p-6">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/admin/list-all-partners">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Lista de Parceiros
        </Link>
      </Button>

      <section className="mb-8">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Editar Estabelecimento (Admin)
        </h2>
        <p className="text-lg text-foreground/80">
          Modificando: <span className="font-semibold text-accent">{business.name}</span>.
        </p>
      </section>

      <Card className="shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-primary">
                <Building className="mr-3 h-7 w-7 text-accent" />
                Detalhes do Estabelecimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl><Input placeholder="Nome do Estabelecimento" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <FormControl><Input placeholder="Ex: Hotel, Restaurante" {...field} value={field.value ?? ''} /></FormControl>
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
                    <FormLabel>Descrição Curta *</FormLabel>
                    <FormControl><Input placeholder="Breve descrição (até 150 caracteres)" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Completa *</FormLabel>
                    <FormControl><Textarea placeholder="Descrição detalhada" {...field} value={field.value ?? ''} rows={4}/></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo *</FormLabel>
                    <FormControl><Input placeholder="Rua, Número, Bairro, Cidade" {...field} value={field.value ?? ''} /></FormControl>
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
                      <FormLabel>Telefone</FormLabel>
                      <FormControl><Input type="tel" placeholder="(XX) XXXXX-XXXX" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl><Input type="url" placeholder="https://www.exemplo.com" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                 <FormField control={form.control} name="instagramUrl" render={({ field }) => (<FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input type="url" placeholder="https://instagram.com/seu_negocio" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="facebookUrl" render={({ field }) => (<FormItem><FormLabel>Facebook URL</FormLabel><FormControl><Input type="url" placeholder="https://facebook.com/seu_negocio" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="whatsappNumber" render={({ field }) => (<FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input type="tel" placeholder="5584912345678" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField control={form.control} name="latitude" render={({ field }) => (<FormItem><FormLabel>Latitude *</FormLabel><FormControl><Input type="number" step="any" placeholder="-6.0869" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="longitude" render={({ field }) => (<FormItem><FormLabel>Longitude *</FormLabel><FormControl><Input type="number" step="any" placeholder="-37.9119" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>URL da Imagem *</FormLabel><FormControl><Input placeholder="https://placehold.co/seed/nome/600/400" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="icon" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione um ícone" /></SelectTrigger></FormControl>
                        <SelectContent>{iconNames.map(iconName => (<SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>))}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avaliação (0-5)</FormLabel>
                      <FormControl><Input type="number" step="0.1" placeholder="Ex: 4.5" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reviewCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contagem de Avaliações</FormLabel>
                      <FormControl><Input type="number" placeholder="Ex: 120" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                <Save className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Salvando Alterações...' : 'Salvar Alterações (Admin)'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
