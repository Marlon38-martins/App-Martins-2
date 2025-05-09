// src/app/checkout/[businessId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { getGramadoBusinessById, getDealsForBusiness, type GramadoBusiness, type Deal } from '@/services/gramado-businesses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label'; // No longer needed directly
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Mail, Phone as PhoneIcon, ShieldCheck, ShoppingCart, Frown, Star, Tag } from 'lucide-react';

const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos.' }),
  // Credit card fields removed
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const businessId = params.businessId as string;

  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (!businessId) {
        setError("ID do estabelecimento não fornecido.");
        setIsLoading(false);
        return;
    };

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const businessData = await getGramadoBusinessById(businessId);
        if (businessData) {
          setBusiness(businessData);
          const dealsData = await getDealsForBusiness(businessId);
          setDeals(dealsData);
        } else {
          setError('Estabelecimento não encontrado.');
        }
      } catch (err) {
        setError('Falha ao carregar dados. Tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [businessId]);

  const getActionName = () => {
    if (!business) return "Benefício";
    const type = business.type.toLowerCase();
    if (type.includes('hotel') || type.includes('pousada')) return "Reserva com Benefício";
    if (type.includes('restaurante') || type.includes('café')) return "Uso de Benefício";
    if (type.includes('loja') || type.includes('artesanato')) return "Compra com Desconto Prime";
    return "Benefício Prime";
  }

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call for activating offer/generating voucher
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Offer Activation Data:', data);
    toast({
      title: 'Benefício Confirmado!',
      description: `Seu benefício Martins Prime em ${business?.name} foi ativado. Apresente esta confirmação ou seu card de membro no estabelecimento.`,
      variant: 'default', 
    });
    setIsSubmitting(false);
    router.push(`/business/${businessId}`); 
  };
  

  if (isLoading) {
    return (
      <div> 
        <Skeleton className="mb-4 h-10 w-32" /> 
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="mb-4 h-12 w-3/4" /> 
            <Skeleton className="h-80 w-full rounded-lg" /> {/* Reduced height as no payment fields */}
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
      <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center">
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
      <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center">
        <Frown className="mb-4 h-20 w-20 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-semibold">Estabelecimento não encontrado</h2>
        <p className="mb-6 text-muted-foreground">Não é possível prosseguir sem um estabelecimento válido.</p>
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
    <div> 
      <Button asChild variant="outline" className="mb-6">
        <Link href={`/business/${business.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para {business.name}
        </Link>
      </Button>

      <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary md:text-4xl">
        Confirmar {getActionName()} em {business.name}
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <User className="mr-2 h-6 w-6 text-accent" />
                Seus Dados para Confirmação
              </CardTitle>
              <CardDescription>
                Confirme seus dados para ativar o benefício Martins Prime.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Nome Completo (como no cadastro Prime)</FormLabel>
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
                        <FormLabel htmlFor="email">Email (do cadastro Prime)</FormLabel>
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
                        <FormLabel htmlFor="phone">Telefone (opcional, para contato)</FormLabel>
                        <FormControl>
                          <Input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <p className="flex items-center text-sm text-muted-foreground pt-4">
                    <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                    Ao confirmar, seu benefício será registrado para uso no estabelecimento.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    <Tag className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Confirmando...' : `Confirmar Uso do ${getActionName()}`}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24 shadow-lg"> 
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <ShoppingCart className="mr-2 h-5 w-5 text-accent" />
                Resumo do Benefício
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
                Você está prestes a utilizar um benefício exclusivo Martins Prime em {business.name}.
              </p>
              
              {deals.length > 0 && (
                <div className="mt-3 rounded-md border border-accent/50 bg-accent/10 p-3 text-sm">
                  <p className="flex items-center font-semibold text-accent"> {/* text-accent for better visibility on accent/10 bg */}
                    <Star className="mr-2 h-4 w-4 text-yellow-400" /> {/* Slightly brighter yellow */}
                    Benefícios Martins Prime Aplicáveis!
                  </p>
                  <p className="mt-1 text-accent-foreground/90">
                    O estabelecimento aplicará os descontos e ofertas VIP conforme os termos do clube e do parceiro.
                  </p>
                  {deals.map(deal => (
                      <p key={deal.id} className="mt-1 text-xs text-accent-foreground/80">
                          - {deal.title} ({deal.description.length > 30 ? deal.description.substring(0, 30) + "..." : deal.description })
                      </p>
                  ))}
                </div>
              )}

              <div className="mt-3 rounded-md border border-muted bg-muted/50 p-3 text-sm text-muted-foreground">
                <strong>Importante:</strong> A confirmação aqui registra sua intenção de uso do benefício. O estabelecimento validará sua elegibilidade e aplicará as condições Martins Prime no local.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
