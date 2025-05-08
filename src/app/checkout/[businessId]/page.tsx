// src/app/checkout/[businessId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { getGramadoBusinessById, type GramadoBusiness } from '@/services/gramado-businesses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, User, Mail, Phone as PhoneIcon, ShieldCheck, ShoppingCart, Frown } from 'lucide-react';

const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos.' }),
  cardName: z.string().min(2, { message: 'Nome no cartão é obrigatório.' }),
  cardNumber: z.string().length(16, { message: 'Número do cartão deve ter 16 dígitos.' }).regex(/^\d+$/, { message: "Apenas números são permitidos."}),
  cardExpiry: z.string().length(5, { message: 'Validade MM/AA (ex: 12/25).' }).regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Formato MM/AA inválido."}),
  cardCvv: z.string().min(3, {message: 'CVV deve ter 3 ou 4 dígitos.'}).max(4, {message: 'CVV deve ter 3 ou 4 dígitos.'}).regex(/^\d+$/, { message: "Apenas números são permitidos."}),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const businessId = params.businessId as string;

  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
    },
  });

  useEffect(() => {
    if (!businessId) {
        setError("ID do estabelecimento não fornecido.");
        setIsLoading(false);
        return;
    };

    async function loadBusiness() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getGramadoBusinessById(businessId);
        if (data) {
          setBusiness(data);
        } else {
          setError('Estabelecimento não encontrado.');
        }
      } catch (err) {
        setError('Falha ao carregar dados do estabelecimento. Tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBusiness();
  }, [businessId]);

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call for payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Checkout Data:', data);
    toast({
      title: 'Pagamento Confirmado!',
      description: `Sua ${business?.type === 'Hotel' || business?.type === 'Pousada' ? 'reserva' : 'compra/solicitação'} em ${business?.name} foi processada com sucesso.`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    router.push(`/`); 
  };
  
  const getActionName = () => {
    if (!business) return "Serviço";
    const type = business.type.toLowerCase();
    if (type.includes('hotel') || type.includes('pousada')) return "Reserva";
    if (type.includes('restaurante') || type.includes('café')) return "Pedido/Reserva";
    if (type.includes('loja') || type.includes('artesanato')) return "Compra";
    return "Serviço";
  }

  if (isLoading) {
    return (
      <div> {/* Removed container and padding classes */}
        <Skeleton className="mb-4 h-10 w-32" /> 
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="mb-4 h-12 w-3/4" /> 
            <Skeleton className="h-96 w-full rounded-lg" /> 
          </div>
          <div className="md:col-span-1">
            <Skeleton className="mb-4 h-10 w-1/2" /> 
            <Skeleton className="h-64 w-full rounded-lg" /> 
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center">  {/* Adjusted min-height */}
        <Alert variant="destructive" className="w-full max-w-md">
          <Frown className="h-5 w-5" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" className="mt-6">
          <Link href={businessId ? `/business/${businessId}` : "/"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  if (!business) {
     return (
      <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center"> {/* Adjusted min-height */}
        <Frown className="mb-4 h-20 w-20 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-semibold">Estabelecimento não encontrado</h2>
        <p className="mb-6 text-muted-foreground">O checkout não pode prosseguir sem um estabelecimento válido.</p>
        <Button asChild variant="default">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div> {/* Removed container and padding classes */}
      <Button asChild variant="outline" className="mb-6">
        <Link href={`/business/${business.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para {business.name}
        </Link>
      </Button>

      <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary md:text-4xl">
        Checkout: {getActionName()} em {business.name}
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <User className="mr-2 h-6 w-6 text-accent" />
                Seus Dados Pessoais
              </CardTitle>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Nome Completo</FormLabel>
                        <FormControl>
                          <Input id="name" placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input id="email" type="email" placeholder="seuemail@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="phone">Telefone</FormLabel>
                        <FormControl>
                          <Input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <hr className="my-6 border-border" />

                  <h3 className="flex items-center text-xl font-semibold text-primary">
                    <CreditCard className="mr-2 h-5 w-5 text-accent" />
                    Dados de Pagamento
                  </h3>
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="cardName">Nome no Cartão</FormLabel>
                        <FormControl>
                          <Input id="cardName" placeholder="Nome como aparece no cartão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="cardNumber">Número do Cartão</FormLabel>
                            <FormControl>
                              <Input id="cardNumber" placeholder="0000 0000 0000 0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <FormField
                        control={form.control}
                        name="cardExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="cardExpiry">Validade</FormLabel>
                            <FormControl>
                              <Input id="cardExpiry" placeholder="MM/AA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                  <FormField
                        control={form.control}
                        name="cardCvv"
                        render={({ field }) => (
                          <FormItem className='md:w-1/3'>
                            <FormLabel htmlFor="cardCvv">CVV</FormLabel>
                            <FormControl>
                              <Input id="cardCvv" placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  <p className="flex items-center text-sm text-muted-foreground">
                    <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                    Pagamento seguro e processado por um gateway parceiro.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? 'Processando...' : `Finalizar ${getActionName()}`}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24 shadow-lg"> {/* Adjust top value based on header height if sticky */}
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <ShoppingCart className="mr-2 h-5 w-5 text-accent" />
                Resumo do {getActionName()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-40 w-full overflow-hidden rounded-md">
                <Image
                  src={business.imageUrl}
                  alt={`Imagem de ${business.name}`}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={`${business.type} service`}
                />
              </div>
              <div>
                <h4 className="font-semibold text-primary">{business.name}</h4>
                <p className="text-sm text-muted-foreground">{business.type}</p>
              </div>
              <p className="text-sm text-foreground/80">
                Você está prestes a {getActionName() === "Reserva" ? "fazer uma reserva" : getActionName() === "Compra" ? "realizar uma compra" : "solicitar um serviço"} em {business.name}.
                Detalhes específicos e valores serão confirmados após esta etapa inicial.
              </p>
              <div className="rounded-md border border-accent/50 bg-accent/10 p-3 text-sm text-accent-foreground">
                <strong>Nota:</strong> Este é um formulário de solicitação. A confirmação final, valores e detalhes adicionais serão tratados diretamente com o estabelecimento após o envio.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
