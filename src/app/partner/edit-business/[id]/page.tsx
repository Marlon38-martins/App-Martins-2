// src/app/partner/edit-business/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// import { useAuth } from '@/hooks/use-auth-client'; // No longer needed for public access
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
import { ArrowLeft, Building, Save } from 'lucide-react'; // ShieldAlert removed

// const MOCK_PARTNER_EMAIL = 'partner@example.com'; // Not used for access control anymore
const MOCK_PARTNER_BUSINESS_ID = '1'; // Used to fetch business data if no specific partner context

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

const editEstablishmentFormSchema = z.object({
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
});

type EditEstablishmentFormValues = z.infer<typeof editEstablishmentFormSchema>;

interface EditBusinessPageParams {
  id: string; 
}

export default function EditPartnerBusinessPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams() as EditBusinessPageParams;
  const businessId = params.id || MOCK_PARTNER_BUSINESS_ID; // Fallback for direct access

  // const { user, isAdmin, loading: authLoading } = useAuth(); // Auth checks removed
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<EditEstablishmentFormValues>({
    resolver: zodResolver(editEstablishmentFormSchema),
    defaultValues: {}, 
  });

  // Access is now public, auth checks removed from useEffect
  useEffect(() => {
    if (businessId) {
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
            });
          } else {
            setError('Estabelecimento não encontrado.');
          }
        } catch (err) {
          console.error("Error loading business data for editing:", err);
          setError('Falha ao carregar dados do estabelecimento.');
        } finally {
          setIsLoadingData(false);
        }
      }
      loadBusinessData();
    } else {
      setIsLoadingData(false);
      setError("ID do estabelecimento não fornecido.");
    }
  }, [businessId, form]);


  const onSubmit: SubmitHandler<EditEstablishmentFormValues> = async (data) => {
    if (!business) {
        toast({ title: "Erro", description: "Dados do estabelecimento não carregados.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const updatedBusiness = {
        ...business, 
        ...data,
    };

    console.log('Updated Establishment Data:', updatedBusiness);

    toast({
      title: 'Dados Atualizados!',
      description: `As informações de "${data.name}" foram salvas com sucesso (simulação).`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    router.push('/partner/panel'); // Navigate back to partner panel after edit
  };
  
  if (isLoadingData) { 
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="mb-6 h-10 w-1/3" />
        <Skeleton className="mb-8 h-8 w-2/3" />
        <Card className="shadow-xl">
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </CardContent>
          <CardFooter><Skeleton className="h-12 w-full" /></CardFooter>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          {/* <ShieldAlert className="h-5 w-5" /> // Icon removed as it was for auth error */}
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/partner/panel"> <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Painel </Link>
        </Button>
      </div>
    );
  }

  if (!business) {
     return <div className="p-6 text-center">Carregando dados do estabelecimento... Se o erro persistir, o ID pode ser inválido.</div>;
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
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-primary md:text-3xl">
          Editar Detalhes do Estabelecimento
        </h2>
        <p className="text-md text-foreground/80 md:text-lg">
          Atualize as informações de: <span className="font-semibold text-accent">{business.name}</span>.
        </p>
      </section>

      <Card className="shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center text-lg text-primary md:text-xl">
                <Building className="mr-3 h-6 w-6 md:h-7 md:w-7 text-accent" />
                Informações do Estabelecimento
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Modifique os campos abaixo e salve as alterações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name" className="text-sm">Nome do Estabelecimento *</FormLabel>
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
                      <FormLabel htmlFor="type" className="text-sm">Tipo de Estabelecimento *</FormLabel>
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
                    <FormLabel htmlFor="shortDescription" className="text-sm">Descrição Curta (para cards) *</FormLabel>
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
                    <FormLabel htmlFor="fullDescription" className="text-sm">Descrição Completa *</FormLabel>
                    <FormControl>
                      <Textarea id="fullDescription" placeholder="Descreva detalhadamente o estabelecimento, seus serviços e diferenciais." {...field} value={field.value ?? ''} rows={3}/>
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
                    <FormLabel htmlFor="address" className="text-sm">Endereço Completo *</FormLabel>
                    <FormControl>
                      <Input id="address" placeholder="Rua, Número, Bairro, Cidade - Estado, CEP" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="phoneNumber" className="text-sm">Telefone (com DDD)</FormLabel>
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
                      <FormLabel htmlFor="website" className="text-sm">Website</FormLabel>
                      <FormControl>
                        <Input id="website" type="url" placeholder="https://www.exemplo.com.br" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="instagramUrl" className="text-sm">Instagram URL</FormLabel>
                      <FormControl>
                        <Input id="instagramUrl" type="url" placeholder="https://instagram.com/seu_negocio" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="facebookUrl" className="text-sm">Facebook URL</FormLabel>
                      <FormControl>
                        <Input id="facebookUrl" type="url" placeholder="https://facebook.com/seu_negocio" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="whatsappNumber" className="text-sm">WhatsApp (com DDD e país)</FormLabel>
                      <FormControl>
                        <Input id="whatsappNumber" type="tel" placeholder="5584912345678" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="latitude" className="text-sm">Latitude *</FormLabel>
                      <FormControl>
                        <Input id="latitude" type="number" step="any" placeholder="-6.0869" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="longitude" className="text-sm">Longitude *</FormLabel>
                      <FormControl>
                        <Input id="longitude" type="number" step="any" placeholder="-37.9119" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel htmlFor="imageUrl" className="text-sm">URL da Imagem Principal *</FormLabel>
                        <FormControl>
                            <Input id="imageUrl" placeholder="https://placehold.co/seed/nome/600/400" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormDescription className="text-xs">Use uma URL pública (ex: Picsum, Imgur).</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="icon" className="text-sm">Ícone representativo *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <Button type="submit" size="default" className="w-full bg-primary hover:bg-primary/90 text-sm" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Salvando Alterações...' : 'Salvar Alterações'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
