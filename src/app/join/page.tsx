// src/app/join/page.tsx
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { 
    User, Mail, Phone as PhoneIcon, Lock, CheckCircle, Award, Sparkles, ShieldCheck, CreditCard, Star,
    TicketPercent, MapPinned, WifiOff, Languages, XCircle, TrendingUp, Info
} from 'lucide-react';
import type { Plan, User as AppUser, Subscription } from '@/types/user';
import { useRouter } from 'next/navigation';
import { mockLogin } from '@/services/gramado-businesses';
import { useAuth } from '@/hooks/use-auth-client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const registrationFormSchema = z.object({
  name: z.string().min(3, { message: "Nome completo é obrigatório (mínimo 3 caracteres)." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos (com DDD)." }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido. Formato: 000.000.000-00" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "Confirmação de senha é obrigatória." }),
  selectedPlan: z.literal('premium_mensal', { required_error: "Por favor, selecione o plano Premium." }),
  agreeToTerms: z.boolean().refine(value => value === true, { message: "Você deve aceitar os termos e condições para prosseguir." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const premiumPlan: Plan = {
    id: 'premium_mensal',
    name: 'Plano Premium Mensal',
    price: 'R$ 19,90/mês',
    priceMonthly: 19.90,
    Icon: Sparkles,
    features: [ // Features for the main card display if needed, now we use a dedicated section
        { text: 'Descontos exclusivos em parceiros', IconComp: TicketPercent },
        { text: 'Roteiros personalizados e acesso offline', IconComp: MapPinned },
        { text: 'Atendimento VIP e suporte multilíngue', IconComp: Languages },
        { text: 'Programa de recompensas por apoiar o comércio local', IconComp: Award },
    ],
    bgColor: 'bg-primary/20',
    borderColor: 'border-primary',
    textColor: 'text-primary'
};


const comparisonFeatures = [
    { name: 'Acesso a roteiros locais', free: true, premium: true },
    { name: 'Descontos em parceiros', free: false, premium: true },
    { name: 'Suporte multilíngue', free: false, premium: true },
    { name: 'Acesso Offline', free: false, premium: true },
    { name: 'Conteúdo VIP exclusivo', free: false, premium: true },
];

export default function JoinPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { signInUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      password: '',
      confirmPassword: '',
      selectedPlan: 'premium_mensal', // Default to premium
      agreeToTerms: false,
    },
  });

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
      const mockSubscription: Subscription = {
        id: 'sub-mock-' + Date.now(),
        userId: mockUser.id,
        planId: data.selectedPlan, // 'premium_mensal'
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 
        status: 'active', 
      };
      
      mockLogin(mockUser, mockSubscription);
      signInUser(mockUser, mockSubscription);

      toast({
        title: 'Inscrição Premium Realizada!',
        description: `Bem-vindo(a) ao Guia Mais Premium, ${data.name}! Seu plano está ativo.`,
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
    <div className="pb-24"> {/* Padding bottom to avoid overlap with fixed button */}
      <section className="mb-10 text-center">
        <Sparkles className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Assinatura Premium Guia Mais
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Descubra o melhor da cidade com o plano Premium e aproveite experiências inesquecíveis!
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-center text-2xl font-semibold text-accent">Seus Benefícios Exclusivos:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: TicketPercent, text: 'Descontos Exclusivos', hint: "exclusive discounts" },
            { icon: MapPinned, text: 'Roteiros Personalizados', hint: "custom routes" },
            { icon: WifiOff, text: 'Acesso Offline', hint: "offline access" },
            { icon: Award, text: 'Ganhe Pontos e Recompensas', hint: "points rewards" },
          ].map((benefit, index) => (
            <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow bg-card">
              <CardContent className="pt-6">
                <benefit.icon className="mx-auto h-12 w-12 text-primary mb-3" />
                <p className="font-medium text-card-foreground">{benefit.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <Card className="shadow-xl border-accent">
            <CardHeader>
                <CardTitle className="text-2xl text-accent text-center">🔓 Grátis vs. 🔑 Premium</CardTitle>
                <CardDescription className="text-center">Veja a diferença e escolha o melhor para sua viagem!</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60%] text-left">Recurso</TableHead>
                            <TableHead className="text-center">Grátis</TableHead>
                            <TableHead className="text-center text-primary font-semibold">Premium</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparisonFeatures.map((feature) => (
                            <TableRow key={feature.name}>
                                <TableCell className="font-medium text-left">{feature.name}</TableCell>
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
        <Card className="bg-secondary/20 border-secondary p-6 shadow-md">
          <CardTitle className="text-xl text-secondary-foreground mb-2 flex items-center justify-center">
            <Info className="mr-2 h-6 w-6"/> Experimente o Guia Mais!
          </CardTitle>
          <CardDescription className="text-secondary-foreground/90">
            “Veja um roteiro exclusivo gratuito por 24h!” (Funcionalidade de teste em breve)
          </CardDescription>
          <Button variant="outline" className="mt-4 border-secondary text-secondary-foreground hover:bg-secondary/30">
            Ativar Teste Gratuito (Simulado)
          </Button>
        </Card>
      </section>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary">
            <User className="mr-3 h-7 w-7 text-accent" />
            Complete seus Dados para Assinar
          </CardTitle>
          <CardDescription>
            Preencha para se tornar um membro Guia Mais Premium. ({premiumPlan.price})
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Registration Fields */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="phone">Telefone (com DDD)</FormLabel>
                      <FormControl>
                        <Input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" {...field} />
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
                        <Input id="cpf" placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Senha</FormLabel>
                      <FormControl>
                        <Input id="password" type="password" placeholder="Crie uma senha segura" {...field} />
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
                        <Input id="confirmPassword" type="password" placeholder="Repita sua senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Hidden field for plan selection, always premium_mensal */}
              <FormField
                control={form.control}
                name="selectedPlan"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value} // Controlled component
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="premium_mensal" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {premiumPlan.name} ({premiumPlan.price})
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
              
              <p className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                Seus dados estão seguros conosco. Pagamento seguro (Simulação).
              </p>
            </CardContent>
            {/* Sticky Footer Button Section */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 p-4 backdrop-blur-sm border-t border-border shadow-t-lg">
                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground text-lg py-3" disabled={isSubmitting}>
                    <CheckCircle className="mr-2 h-6 w-6" />
                    {isSubmitting ? 'Processando...' : `Assinar Agora (${premiumPlan.price})`}
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                    💚 Sua assinatura apoia o comércio local!
                </p>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
