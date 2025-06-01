
// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { mockLogin, type User, type Subscription } from '@/services/gramado-businesses'; 
import { LogIn, Mail, Lock, MountainSnow, CheckCircle } from 'lucide-react'; 
import { useAuth } from '@/hooks/use-auth-client';
// TODO: Firebase Auth Integration - Import necessary Firebase Auth functions
// import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "@/lib/firebase/config"; // Your Firebase auth instance

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.94 11c-.09-.69-.25-1.36-.48-2H12v3.89h5.03c-.26 1.23-.9 2.29-1.82 3.02v2.51h3.22c1.88-1.73 2.98-4.31 2.98-7.42z"/>
    <path d="M12 21c2.97 0 5.43-1.01 7.22-2.72l-3.22-2.51c-.98.66-2.23 1.06-3.61 1.06-2.79 0-5.14-1.89-5.98-4.44H2.91v2.59C4.77 19.02 8.18 21 12 21z"/>
    <path d="M5.98 14.39c-.21-.63-.33-1.3-.33-2s.12-1.37.33-2V9.81H2.91C2.35 10.95 2 12.15 2 13.39s.35 2.44.91 3.58l3.07-2.58z"/>
  </svg>
);

const loginFormSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "Senha é obrigatória." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { signInUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleMockLoginSuccess = (loggedInUser: User, userSub: Subscription) => {
    signInUser(loggedInUser, userSub); 
    toast({
      title: 'Login Bem-sucedido!',
      description: `Bem-vindo(a) de volta, ${loggedInUser.name || 'Usuário'}! (Simulação)`,
      variant: 'default',
      className: 'bg-green-500 text-white',
      icon: <CheckCircle className="h-5 w-5 text-white" />
    });
    router.push('/'); 
  };

  const handleEmailLogin: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmitting(true);
    // TODO: Firebase Auth Integration - Replace with actual Firebase signInWithEmailAndPassword call
    // Example:
    // try {
    //   const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    //   const firebaseUser = userCredential.user;
    //   // Fetch or create app-specific user data and subscription from Firestore
    //   // Then call handleMockLoginSuccess or a similar function with the real data
    //   console.log("Firebase Email Login Successful:", firebaseUser);
    // } catch (error: any) {
    //   toast({ title: "Erro no Login", description: error.message, variant: "destructive" });
    // } finally {
    //   setIsSubmitting(false);
    // }
    console.log("Simulating email login:", data.email);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    const mockUser: User = {
      id: 'mock-user-' + Date.now(),
      email: data.email,
      name: data.email.split('@')[0], 
      photoURL: `https://placehold.co/100x100.png`
    };
    const mockSubscription: Subscription = {
      id: 'sub-mock-' + Date.now(),
      userId: mockUser.id,
      planId: data.email === 'admin@example.com' ? 'admin_plan' : (data.email === 'partner@example.com' ? 'partner_basic' : 'premium_mensal'),
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
      status: 'active',
    };
    
    mockLogin(mockUser, mockSubscription); 
    setIsSubmitting(false);
    handleMockLoginSuccess(mockUser, mockSubscription);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    // TODO: Firebase Auth Integration - Replace with actual Firebase signInWithPopup(auth, new GoogleAuthProvider()) call
    // Example:
    // try {
    //   const provider = new GoogleAuthProvider();
    //   const result = await signInWithPopup(auth, provider);
    //   const firebaseUser = result.user;
    //   // Fetch or create app-specific user data and subscription from Firestore
    //   // Then call handleMockLoginSuccess or a similar function with the real data
    //   console.log("Firebase Google Login Successful:", firebaseUser);
    // } catch (error: any) {
    //   toast({ title: "Erro no Login com Google", description: error.message, variant: "destructive" });
    // } finally {
    //   setIsGoogleSubmitting(false);
    // }
    console.log("Simulating Google login");
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const mockUser: User = {
      id: 'mock-google-user-' + Date.now(),
      email: 'google.user@example.com',
      name: 'Usuário Google',
      photoURL: 'https://placehold.co/100x100.png'
    };
    const mockSubscription: Subscription = {
      id: 'sub-mock-google-' + Date.now(),
      userId: mockUser.id,
      planId: 'premium_anual',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
      status: 'active',
    };
    mockLogin(mockUser, mockSubscription); 
    setIsGoogleSubmitting(false);
    handleMockLoginSuccess(mockUser, mockSubscription);
  };

  return (
    <div className="flex min-h-[calc(100vh-150px)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <MountainSnow className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Login Guia Mais</CardTitle>
          <CardDescription>Acesse sua conta para aproveitar os benefícios exclusivos.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailLogin)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="seuemail@exemplo.com" {...field} value={field.value ?? ''} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input id="password" type="password" placeholder="Sua senha" {...field} value={field.value ?? ''} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="text-right text-sm">
                {/* TODO: Implement password reset functionality */}
                <Link href="#" className="text-primary hover:underline">
                  Esqueceu sua senha?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                <LogIn className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Entrando...' : 'Entrar com Email'}
              </Button>
              
              <div className="relative my-4 w-full"> 
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isGoogleSubmitting}
                type="button"
              >
                <GoogleIcon />
                <span className="ml-2">{isGoogleSubmitting ? 'Conectando...' : 'Entrar com Google'}</span>
              </Button>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link href="/join" className="font-semibold text-primary hover:underline">
                  Associe-se agora!
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
