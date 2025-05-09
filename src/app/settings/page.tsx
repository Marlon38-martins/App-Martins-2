// src/app/settings/page.tsx
'use client';

import { useAuth } from '@/hooks/use-auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCircle, Bell, ShieldLock, CreditCard, LogOut } from 'lucide-react';
import { signOut } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';


export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Logout Realizado", description: "Você foi desconectado com sucesso."});
    router.push('/login'); // Or home page
  };

  if (authLoading || !user) {
    return (
         <div className="space-y-6 p-4 md:p-6">
            <Skeleton className="h-10 w-1/3" />
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <div className="flex items-center justify-between"><Skeleton className="h-4 w-1/2" /> <Skeleton className="h-6 w-12" /></div>
                    <Skeleton className="h-10 w-24 mt-4" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-8">Configurações da Conta</h1>

      {/* Profile Information */}
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary"><UserCircle className="mr-2 h-6 w-6"/> Informações Pessoais</CardTitle>
          <CardDescription>Gerencie seus dados cadastrais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" defaultValue={user.name || ''} placeholder="Seu nome completo" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email || ''} disabled />
            <p className="text-xs text-muted-foreground mt-1">O email não pode ser alterado por aqui.</p>
          </div>
          <Button>Salvar Alterações (Simulado)</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary"><Bell className="mr-2 h-6 w-6"/> Notificações</CardTitle>
          <CardDescription>Escolha como você quer ser notificado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="promo-notifications" className="flex flex-col space-y-1">
              <span>Ofertas e Promoções</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receber emails sobre novas ofertas e descontos exclusivos.
              </span>
            </Label>
            <Switch id="promo-notifications" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="news-notifications" className="flex flex-col space-y-1">
              <span>Novidades do Clube</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receber informações sobre novos parceiros e eventos.
              </span>
            </Label>
            <Switch id="news-notifications" />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary"><ShieldLock className="mr-2 h-6 w-6"/> Segurança</CardTitle>
          <CardDescription>Gerencie as configurações de segurança da sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Alterar Senha (Simulado)</Button>
          {/* <Button variant="outline">Autenticação de Dois Fatores (Em breve)</Button> */}
        </CardContent>
      </Card>
      
      {/* Subscription - Placeholder */}
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary"><CreditCard className="mr-2 h-6 w-6"/> Assinatura</CardTitle>
          <CardDescription>Veja e gerencie seu plano Martins Prime.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">Detalhes da sua assinatura e opções de gerenciamento aparecerão aqui.</p>
            <Button variant="outline" asChild><Link href="/join">Ver Planos</Link></Button>
        </CardContent>
      </Card>


      {/* Logout */}
      <div className="mt-10 text-center">
        <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto">
            <LogOut className="mr-2 h-5 w-5" />
            Sair da Conta
        </Button>
      </div>
    </div>
  );
}
