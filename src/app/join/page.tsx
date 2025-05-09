// src/app/join/page.tsx
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label'; // Not used directly, FormLabel is used
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone as PhoneIcon, Lock, CheckCircle, Award, Sparkles, Star, ShieldCheck, CreditCard } from 'lucide-react';
import type { Plan } from '@/types/user';
import { useRouter } from 'next/navigation';
// Mock service imports - replace with actual Firebase Auth later
import { signUpWithEmailAndPassword } from '@/lib/firebase/auth'; 
// import { createUserProfile, createSubscription } from '@/services/users'; // Placeholder for user service functions

const registrationFormSchema = z.object({
  name: z.string().min(3, { message: "Nome completo é obrigatório (mínimo 3 caracteres)." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos (com DDD)." }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido. Formato: 000.000.000-00" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "Confirmação de senha é obrigatória." }),
  selectedPlan: z.enum(['explorador', 'serrano_vip'], { required_error: "Por favor, selecione um plano." }),
  agreeToTerms: z.boolean().refine(value => value === true, { message: "Você deve aceitar os termos e condições para prosseguir." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const plans: Plan[] = [
  {
    id: 'explorador',
    name: 'Plano Explorador',
    price: 'R$ 19,90/mês',
    priceMonthly: 19.90,
    Icon: Award,
    features: [
      'Acesso a descontos básicos em parceiros selecionados.',
      'Newsletter com novidades e eventos de Martins.',
      'Suporte prioritário para dúvidas sobre o clube.',
    ],
    bgColor: 'bg-secondary/20',
    borderColor: 'border-secondary',
    textColor: 'text-secondary-foreground'
  },
  {
    id: 'serrano_vip',
    name: 'Plano Serrano VIP',
    price: 'R$ 49,90/mês',
    priceMonthly: 49.90,
    Icon: Sparkles,
    features: [
      'Todos os benefícios do plano Explorador.',
      'Descontos maiores e ofertas VIP exclusivas (incluindo Pague 1 Leve 2).',
      'Acesso antecipado a promoções e pacotes.',
      'Convites para eventos especiais em Martins.',
      'Cartão de membro VIP digital personalizado.',
    ],
    bgColor: 'bg-primary/20',
    borderColor: 'border-primary',
    textColor: 'text-primary'
  },
];

export default function JoinPage() {
  const { toast } = useToast();
  const router = useRouter();
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
      selectedPlan: undefined,
      agreeToTerms: false,
    },
  });

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // Step 1: Create user account with Firebase Auth
      const userCredential = await signUpWithEmailAndPassword(data.email, data.password);
      const firebaseUser = userCredential?.user;

      if (!firebaseUser) {
        throw new Error('Falha ao criar conta de usuário.');
      }
      
      // Step 2: (Mocked) Create user profile in your database (e.g., Firestore)
      // const userProfileData = {
      //   id: firebaseUser.uid,
      //   email: firebaseUser.email!,
      //   name: data.name,
      //   phone: data.phone,
      //   cpf: data.cpf,
      //   // any other fields
      // };
      // await createUserProfile(userProfileData); // This would be a call to your backend/Firestore

      // Step 3: (Mocked) Create subscription
      // const subscriptionData = {
      //   userId: firebaseUser.uid,
      //   planId: data.selectedPlan,
      //   startDate: new Date(),
      //   endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Example: 1 year
      //   status: 'pending_payment', // Or 'active' if payment is immediate / not handled here
      // };
      // await createSubscription(subscriptionData); // Call to your backend/Firestore

      // Simulate API call for additional profile/subscription setup if not using Firebase directly
      await new Promise(resolve => setTimeout(resolve, 1000));


      console.log('Registration Data:', data);
      toast({
        title: 'Cadastro Realizado com Sucesso!',
        description: `Bem-vindo(a) ao Martins Prime, ${data.name}! Seu plano ${plans.find(p => p.id === data.selectedPlan)?.name} está quase ativo. Prossiga para o pagamento.`,
        variant: 'default',
      });
      form.reset(); 
      // router.push(`/payment?planId=${data.selectedPlan}`); // Redirect to a payment page
      toast({
        title: "Redirecionamento para Pagamento (Simulado)",
        description: "Em uma aplicação real, você seria redirecionado para a página de pagamento.",
        variant: "default"
      });

    } catch (error: any) {
      console.error('Registration Error:', error);
      let errorMessage = 'Ocorreu um erro durante o cadastro. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: 'Erro no Cadastro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <section className="mb-10 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Junte-se ao Clube Martins Prime
        </h2>
        <p className="text-lg text-foreground/80">
          Escolha seu plano e comece a aproveitar vantagens exclusivas em Martins, RN!
        </p>
      </section>

      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className={`shadow-xl flex flex-col ${plan.bgColor || ''} border-2 ${plan.borderColor || 'border-transparent'}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                {plan.Icon && <plan.Icon className={`h-10 w-10 ${plan.textColor || 'text-primary'}`} />}
                <CardTitle className={`text-2xl font-semibold ${plan.textColor || 'text-primary'}`}>{plan.name}</CardTitle>
              </div>
              <CardDescription className="text-xl font-medium text-muted-foreground pt-1">{plan.price}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-5 w-5 shrink-0 text-green-500" />
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
                <Button 
                    variant={plan.id === 'serrano_vip' ? 'default' : 'outline'} 
                    className="w-full"
                    onClick={() => form.setValue('selectedPlan', plan.id as 'explorador' | 'serrano_vip', { shouldValidate: true })}
                >
                    Selecionar Plano {plan.name.split(' ')[1]}
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary">
            <User className="mr-3 h-7 w-7 text-accent" />
            Complete seu Cadastro
          </CardTitle>
          <CardDescription>
            Preencha seus dados abaixo para se tornar um membro do Martins Prime.
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

              <FormField
                control={form.control}
                name="selectedPlan"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base">Escolha seu Plano Martins Prime</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                      >
                        {plans.map(plan => (
                           <FormItem key={plan.id} className="flex items-center space-x-3 space-y-0">
                           <FormControl>
                             <RadioGroupItem value={plan.id} />
                           </FormControl>
                           <FormLabel className="font-normal cursor-pointer">
                             {plan.name} ({plan.price})
                           </FormLabel>
                         </FormItem>
                        ))}
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
                        Li e concordo com os Termos e Condições de Uso e a Política de Privacidade do Martins Prime.
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
                Seus dados estão seguros conosco. O pagamento será processado após a confirmação.
              </p>

            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                <CreditCard className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Processando Inscrição...' : 'Concluir Inscrição e Ir para Pagamento'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
