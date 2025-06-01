
// src/app/partner/create-itinerary/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Route, PlusCircle, Trash2, Send, User, Edit, CalendarDays, ShieldAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const stopSchema = z.object({
  stopName: z.string().min(1, "Nome da parada é obrigatório."),
  stopNotes: z.string().optional(),
});

const itineraryFormSchema = z.object({
  clientName: z.string().min(1, "Nome do cliente é obrigatório."),
  itineraryTitle: z.string().min(3, "Título do roteiro é obrigatório (mínimo 3 caracteres)."),
  itineraryDescription: z.string().optional(),
  stops: z.array(stopSchema).min(1, "Adicione pelo menos uma parada ao roteiro."),
});

type ItineraryFormValues = z.infer<typeof itineraryFormSchema>;

export default function CreateItineraryPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isPartner, partnerPlan, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canAccessFeature = isPartner && (partnerPlan === 'processo' || partnerPlan === 'consolide');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/partner/create-itinerary');
      } else if (!canAccessFeature) {
        toast({
          title: "Acesso Restrito",
          description: "Esta funcionalidade não está disponível para o seu plano de parceria atual.",
          variant: "destructive",
        });
        router.push('/partner/panel');
      }
    }
  }, [user, isPartner, partnerPlan, authLoading, router, toast, canAccessFeature]);

  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(itineraryFormSchema),
    defaultValues: {
      clientName: '',
      itineraryTitle: '',
      itineraryDescription: '',
      stops: [{ stopName: '', stopNotes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stops',
  });

  const onSubmit: SubmitHandler<ItineraryFormValues> = async (data) => {
    if (!canAccessFeature) {
      toast({ title: "Acesso Negado", description: "Seu plano não permite criar roteiros.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    // TODO: Backend Integration - Replace with actual Firebase Firestore 'addDoc' call
    // to a 'custom_itineraries' collection, linking to the partner's businessId.
    // Example:
    // try {
    //   const partnerBusinessId = MOCK_PARTNER_BUSINESS_ID; // Get this from auth/partner context
    //   await addDoc(collection(firestore, "custom_itineraries"), { 
    //      ...data, 
    //      partnerId: user?.id, // ID of the partner user
    //      businessId: partnerBusinessId, // ID of the partner's establishment
    //      createdAt: new Date() 
    //   });
    //   toast({ title: 'Roteiro Salvo!', description: 'O roteiro personalizado foi salvo com sucesso.' });
    //   form.reset();
    // } catch (error) {
    //   toast({ title: 'Erro ao Salvar', description: 'Não foi possível salvar o roteiro.', variant: 'destructive' });
    // }
    console.log('Simulating Custom Itinerary Data Save:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Roteiro Personalizado Criado!',
      description: `O roteiro "${data.itineraryTitle}" para ${data.clientName} foi salvo (simulação).`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    form.reset(); 
  };

  if (authLoading) {
    return (
      <div className="p-3 md:p-4 space-y-3">
        <Skeleton className="h-7 w-1/3 mb-4" />
        <Card className="shadow-md">
          <CardHeader className="p-3"><Skeleton className="h-6 w-1/2" /></CardHeader>
          <CardContent className="space-y-2.5 p-3">
            {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          </CardContent>
          <CardFooter className="p-3"><Skeleton className="h-9 w-full" /></CardFooter>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-center">Redirecionando para login...</div>;
  }

  if (!canAccessFeature && !authLoading) {
    return (
      <div className="p-3 md:p-4">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="text-sm">Acesso Negado</AlertTitle>
          <AlertDescription className="text-xs">
            A funcionalidade de criar roteiros personalizados não está disponível para o seu plano de parceria atual.
            Considere fazer um upgrade para os planos Processo ou Consolide.
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href="/partner/panel">
              <ArrowLeft className="mr-1.5 h-3 w-3" />
              Voltar para o Painel
            </Link>
          </Button>
        </div>
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
          Criar Roteiro Personalizado para Cliente
        </h2>
        <p className="text-xs text-foreground/80 md:text-sm">
          Monte um itinerário exclusivo para seus clientes e encante-os com a experiência Guia Mais.
        </p>
        <div className="relative w-full h-32 md:h-40 mt-3 rounded-lg overflow-hidden shadow-sm">
          <Image
            src="https://placehold.co/600x240.png"
            alt="Criar roteiro personalizado"
            layout="fill"
            objectFit="cover"
            data-ai-hint="itinerary planning map"
          />
        </div>
      </section>

      <Card className="shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="p-3">
              <CardTitle className="flex items-center text-md text-primary md:text-lg">
                <Route className="mr-2 h-4 w-4 md:h-5 md:w-5 text-accent" />
                Detalhes do Roteiro
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Preencha as informações abaixo para montar o itinerário.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-3">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="clientName" className="text-xs flex items-center"><User className="mr-1.5 h-3.5 w-3.5 text-muted-foreground"/> Nome do Cliente *</FormLabel>
                    <FormControl>
                      <Input id="clientName" placeholder="Ex: João Silva" {...field} className="text-sm h-9"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itineraryTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="itineraryTitle" className="text-xs flex items-center"><Edit className="mr-1.5 h-3.5 w-3.5 text-muted-foreground"/> Título do Roteiro *</FormLabel>
                    <FormControl>
                      <Input id="itineraryTitle" placeholder="Ex: Fim de Semana Romântico em Martins" {...field} className="text-sm h-9"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itineraryDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="itineraryDescription" className="text-xs flex items-center"><CalendarDays className="mr-1.5 h-3.5 w-3.5 text-muted-foreground"/> Descrição Geral do Roteiro (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea id="itineraryDescription" placeholder="Um breve resumo ou observações gerais sobre o roteiro..." {...field} rows={2} className="text-sm min-h-[60px]"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <div>
                <FormLabel className="text-sm font-medium mb-2 block text-primary">Paradas do Roteiro</FormLabel>
                {fields.map((item, index) => (
                  <Card key={item.id} className="mb-3 p-2.5 border border-dashed">
                    <div className="flex justify-between items-center mb-1.5">
                        <p className="text-xs font-semibold text-accent">Parada {index + 1}</p>
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Remover Parada</span>
                        </Button>
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name={`stops.${index}.stopName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor={`stops.${index}.stopName`} className="text-xs">Nome da Parada/Atividade *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Mirante da Serra" {...field} className="text-sm h-9"/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`stops.${index}.stopNotes`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor={`stops.${index}.stopNotes`} className="text-xs">Observações para esta Parada (Opcional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Dicas, horários, o que fazer..." {...field} rows={2} className="text-sm min-h-[50px]"/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 text-xs"
                  onClick={() => append({ stopName: '', stopNotes: '' })}
                >
                  <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Adicionar Parada
                </Button>
                 <FormMessage>{form.formState.errors.stops?.message || form.formState.errors.stops?.root?.message}</FormMessage>
              </div>
            </CardContent>
            <CardFooter className="p-3 mt-2">
              <Button type="submit" size="sm" className="w-full bg-primary hover:bg-primary/90 text-xs h-9" disabled={isSubmitting}>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {isSubmitting ? 'Salvando Roteiro...' : 'Salvar Roteiro Personalizado'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
