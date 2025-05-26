
// src/app/join/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image'; // Import Image
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { 
    User, Mail, Phone as PhoneIcon, Lock, CheckCircle, Award, Sparkles, ShieldCheck, CreditCard, Star,
    TicketPercent, MapPinned, WifiOff, Languages, XCircle, TrendingUp, Info, CalendarDays, Route as RouteIcon, MapPin
} from 'lucide-react';
import type { Plan, User as AppUser, Subscription } from '@/types/user';
import { useRouter } from 'next/navigation';
import { mockLogin } from '@/services/gramado-businesses';
import { useAuth } from '@/hooks/use-auth-client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";

const registrationFormSchema = z.object({
  name: z.string().min(3, { message: "Nome completo é obrigatório (mínimo 3 caracteres)." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos (com DDD)." }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido. Formato: 000.000.000-00" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "Confirmação de senha é obrigatória." }),
  selectedPlan: z.enum(['premium_mensal', 'premium_anual'], { required_error: "Por favor, selecione um plano Premium." }),
  agreeToTerms: z.boolean().refine(value => value === true, { message: "Você deve aceitar os termos e condições para prosseguir." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const premiumFeatures: Plan['features'] = [
    { text: 'Descontos exclusivos em parceiros', IconComp: TicketPercent },
    { text: 'Roteiros personalizados e acesso offline', IconComp: RouteIcon },
    { text: 'Suporte multilíngue', IconComp: Languages },
    { text: 'Programa de recompensas por apoiar o comércio local', IconComp: Award },
    { text: 'Acesso Offline aos seus roteiros e cupons', IconComp: WifiOff },
    { text: 'Conteúdo VIP exclusivo (em breve)', IconComp: Star },
];

const premiumPlans: Plan[] = [
  {
    id: 'premium_mensal',
    name: 'Plano Premium Mensal',
    price: 'R$ 19,90',
    priceNumeric: 19.90,
    billingCycle: 'mês',
    features: premiumFeatures,
    Icon: CalendarDays,
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    textColor: 'text-primary',
  },
  {
    id: 'premium_anual',
    name: 'Plano Premium Anual',
    price: 'R$ 199,00', 
    priceNumeric: 199.00,
    billingCycle: 'ano',
    priceAnnualDisplay: "R$ 199,00/ano",
    annualEquivalentMonthlyPrice: "(equivale a R$ 16,58/mês)",
    features: premiumFeatures,
    Icon: Sparkles, 
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent',
    textColor: 'text-accent',
    highlight: true, 
  }
];


const comparisonFeatures = [
    { name: 'Acesso a roteiros locais', free: true, premium: true, IconComp: MapPin },
    { name: 'Descontos exclusivos em parceiros', free: false, premium: true, IconComp: TicketPercent },
    { name: 'Roteiros personalizados e acesso offline', free: false, premium: true, IconComp: RouteIcon },
    { name: 'Suporte multilíngue', free: false, premium: true, IconComp: Languages },
    { name: 'Programa de recompensas', free: false, premium: true, IconComp: Award},
    { name: 'Acesso Offline aos seus roteiros e cupons', free: false, premium: true, IconComp: WifiOff },
    { name: 'Conteúdo VIP exclusivo', free: false, premium: true, IconComp: Star },
];

export default function JoinPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { signInUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSelectedPlanId, setCurrentSelectedPlanId] = useState<Plan['id']>(premiumPlans[1].id); 

  useEffect(() => {
    document.title = "Assinatura Premium - Guia Mais";
  }, []);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      password: '',
      confirmPassword: '',
      selectedPlan: premiumPlans[1].id, 
      agreeToTerms: false,
    },
  });

  const selectedPlanDetails = premiumPlans.find(p => p.id === currentSelectedPlanId) || premiumPlans[1];

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: AppUser = {
        id: 'mock-user-' + Date.now(),
        email: data.email,
        name: data.name,
        photoURL: `https://placehold.co/100x100.png`
      };
      
      const endDate = data.selectedPlan === 'premium_anual' 
        ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) 
        : new Date(new Date().setMonth(new Date().getMonth() + 1));

      const mockSubscription: Subscription = {
        id: 'sub-mock-' + Date.now(),
        userId: mockUser.id,
        planId: data.selectedPlan,
        startDate: new Date(),
        endDate: endDate, 
        status: 'active', 
      };
      
      mockLogin(mockUser, mockSubscription);
      signInUser(mockUser, mockSubscription);

      toast({
        title: 'Inscrição Premium Realizada!',
        description: `Bem-vindo(a) ao Guia Mais Premium, ${data.name}! Seu plano ${selectedPlanDetails.name} está ativo.`,
        variant: 'default',
      });
      form.reset();
      router.push('/'); 

    } catch (error: any) {
      console.error('Registration Error:', error);
      toast({
        title: 'Erro na Inscrição',
        description: error.message || 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-28">
      <div className="relative w-full h-48 md:h-60 mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="https://placehold.co/800x400.png"
          alt="Assinatura Premium Guia Mais"
          layout="fill"
          objectFit="cover"
          data-ai-hint="premium benefits"
        />
      </div>
      <section className="mb-12 text-center"> 
        <Sparkles className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Assinatura Premium Guia Mais
        </h1>
        <p className="text-lg text-foreground/80 max-w-xl mx-auto">
          🌟 Descubra o melhor da cidade com o Guia Mais! Assine o plano Premium e aproveite experiências inesquecíveis!
        </p>
      </section>

      <section className="mb-12"> 
        <h2 className="mb-6 text-center text-2xl font-semibold text-accent">Seus Benefícios Exclusivos:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
          {premiumFeatures.slice(0, 4).map((benefit, index) => ( 
            <Card key={index} className="text-center shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-card">
              <CardContent className="pt-6">
                <benefit.IconComp className="mx-auto mb-3 h-12 w-12 text-primary" />
                <p className="font-medium text-card-foreground text-base">{benefit.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12"> 
        <Card className="shadow-lg border-accent">
            <CardHeader className="p-4">
                <CardTitle className="text-accent text-center text-xl">🔓 Grátis vs. 🔑 Premium</CardTitle>
                <CardDescription className="text-center text-sm">Veja a diferença e escolha o melhor para sua viagem!</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[55%] text-left">Recurso</TableHead>
                            <TableHead className="text-center">Grátis</TableHead>
                            <TableHead className="text-center text-primary font-semibold">Premium</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparisonFeatures.map((feature) => (
                            <TableRow key={feature.name}>
                                <TableCell className="font-medium text-left flex items-center">
                                  {feature.IconComp && <feature.IconComp className="mr-2 h-4 w-4 text-muted-foreground" />}
                                  {feature.name}
                                </TableCell>
                                <TableCell className="text-center">
                                    {feature.free ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />}
                                </TableCell>
                                <TableCell className="text-center">
                                    {feature.premium ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </section>

      <section className="mb-12 text-center"> 
        <Card className="bg-secondary/20 border-secondary p-4 shadow-sm">
          <CardTitle className="text-secondary-foreground mb-2 flex items-center justify-center text-lg">
            <Info className="mr-2 h-5 w-5"/> Experimente o Guia Mais!
          </CardTitle>
          <CardDescription className="text-secondary-foreground/90 text-sm">
            “Veja um roteiro exclusivo gratuito por 24h!” (Funcionalidade de teste em breve)
          </CardDescription>
          <Button variant="outline" size="default" className="mt-4 border-secondary text-secondary-foreground hover:bg-secondary/30">
            Ativar Teste Gratuito (Simulado)
          </Button>
        </Card>
      </section>

      <Card className="shadow-xl">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center text-primary text-xl">
            <User className="mr-2 h-6 w-6 text-accent" />
            Complete seus Dados para Assinar
          </CardTitle>
           <CardDescription className="text-sm">
            Escolha seu plano e preencha para se tornar um membro Guia Mais Premium.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="selectedPlan"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-semibold">Selecione seu Plano Premium:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                            field.onChange(value);
                            setCurrentSelectedPlanId(value as Plan['id']);
                        }}
                        value={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {premiumPlans.map((plan) => (
                          <FormItem 
                            key={plan.id} 
                            className={cn(
                                "flex flex-col items-start space-y-1 rounded-lg border p-3 transition-all duration-300 ease-in-out cursor-pointer hover:border-primary hover:shadow-lg",
                                field.value === plan.id && "border-2 border-primary ring-2 ring-primary ring-offset-2",
                                plan.highlight && "border-accent hover:border-accent ring-accent"
                            )}
                           onClick={() => { 
                                field.onChange(plan.id);
                                setCurrentSelectedPlanId(plan.id);
                            }}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                                <FormLabel className="font-semibold text-lg flex items-center cursor-pointer">
                                    {plan.Icon && <plan.Icon className={cn("mr-2 h-5 w-5", plan.textColor)} />}
                                    {plan.name}
                                </FormLabel>
                                <FormControl>
                                  <RadioGroupItem value={plan.id} className="sr-only" />
                                </FormControl>
                                {plan.highlight && <Badge variant="destructive" className="bg-accent text-accent-foreground text-xs">Melhor Valor!</Badge>}
                            </div>
                            <p className={cn("text-2xl font-bold", plan.textColor)}>{plan.price} <span className="text-sm font-normal text-muted-foreground">/{plan.billingCycle}</span></p>
                            {plan.annualEquivalentMonthlyPrice && <p className="text-xs text-muted-foreground">{plan.annualEquivalentMonthlyPrice}</p>}
                             <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                {plan.features.slice(0,2).map(feature => ( 
                                    <li key={feature.text} className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500"/> {feature.text}
                                    </li>
                                ))}
                                <li>& mais...</li>
                            </ul>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Nome Completo</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Seu nome completo" {...field} value={field.value ?? ''} />
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
                        <Input id="email" type="email" placeholder="seuemail@exemplo.com" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="phone">Telefone (com DDD)</FormLabel>
                      <FormControl>
                        <Input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="cpf">CPF</FormLabel>
                      <FormControl>
                        <Input id="cpf" placeholder="000.000.000-00" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Senha</FormLabel>
                      <FormControl>
                        <Input id="password" type="password" placeholder="Crie uma senha segura" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input id="confirmPassword" type="password" placeholder="Repita sua senha" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="agreeToTerms"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="agreeToTerms" className="cursor-pointer">
                        Li e concordo com os Termos e Condições de Uso e a Política de Privacidade do Guia Mais.
                      </FormLabel>
                      <FormDescription>
                        Ao marcar esta caixa, você confirma sua adesão ao clube.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <p className="flex items-center text-sm text-muted-foreground pt-3">
                <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                Seus dados estão seguros conosco. Pagamento seguro (Simulação).
              </p>
            </CardContent>
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 p-4 backdrop-blur-sm border-t border-border shadow-t-lg w-full max-w-sm mx-auto">
                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground text-lg py-3" disabled={isSubmitting}>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Processando...' : `Assinar Agora - ${selectedPlanDetails.price}/${selectedPlanDetails.billingCycle}`}
                </Button>
                <p className="mt-2.5 text-center text-sm text-muted-foreground">
                    💚 Sua assinatura contribui para melhorar sua experiência na Serra mais linda do RN
                </p>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
