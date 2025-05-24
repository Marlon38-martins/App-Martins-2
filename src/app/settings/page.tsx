// src/app/settings/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCircle, Bell, Shield, CreditCard, LogOut, Star, CalendarDays } from 'lucide-react'; // Added Star and CalendarDays
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth-client'; 
import { mockLogout } from '@/services/gramado-businesses'; 

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, signOutUser: contextSignOutUser } = useAuth(); 

  const [name, setName] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/settings'); // Added redirect query
    } else if (user) {
      setName(user.name || user.email?.split('@')[0] || '');
    }
  }, [user, loading, router]);

  const handleSaveChanges = () => {
    toast({ title: "Simulação", description: `Dados salvos (simulado). Nome: ${name}` });
  };
  
  const handleSignOut = async () => {
    try {
        await contextSignOutUser(); 
        // The signOutUser in useAuth now handles redirect and toast
    } catch (error) {
        console.error("Error signing out from settings: ", error);
        toast({ title: "Erro no Logout", description: "Não foi possível fazer logout. Tente novamente.", variant: 'destructive' });
    }
  };

  if (loading || !user) {
    return (
         <div className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto">
            <Skeleton className="h-10 w-1/3 mb-8" />
            <Card className="mb-8 shadow-md">
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <Skeleton className="h-10 w-32 mt-2" />
                </CardContent>
            </Card>
             <Card className="mb-8 shadow-md">
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between"><Skeleton className="h-4 w-1/2" /> <Skeleton className="h-6 w-12" /></div>
                     <Separator />
                    <div className="flex items-center justify-between"><Skeleton className="h-4 w-1/2" /> <Skeleton className="h-6 w-12" /></div>
                </CardContent>
            </Card>
            <div className="mt-10 text-center">
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-8">Configurações da Conta</h1>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary"><UserCircle className="mr-2 h-6 w-6"/> Informações Pessoais</CardTitle>
          <CardDescription>Gerencie seus dados cadastrais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email || ''} disabled />
            <p className="text-xs text-muted-foreground mt-1">O email não pode ser alterado por aqui.</p>
          </div>
          <Button onClick={handleSaveChanges}>Salvar Alterações (Simulado)</Button>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary"><Bell className="mr-2 h-6 w-6"/> Notificações</CardTitle>
          <CardDescription>Escolha como você quer ser notificado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="promo-notifications" className="flex flex-col space-y-1">
              <span>Ofertas e Promoções Gerais</span>
              <span className="font-normal leading-snug text-muted-foreground text-xs">
                Receber emails sobre novas ofertas e descontos para todos os membros.
              </span>
            </Label>
            <Switch id="promo-notifications" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="news-notifications" className="flex flex-col space-y-1">
              <span>Novidades do Clube</span>
              <span className="font-normal leading-snug text-muted-foreground text-xs">
                Receber informações sobre novos parceiros e eventos gerais.
              </span>
            </Label>
            <Switch id="news-notifications" />
          </div>
          <Separator />
           <div className="pt-2">
             <h4 className="text-md font-semibold text-accent mb-2 flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-400 fill-yellow-400"/> Notificações VIP
             </h4>
            <div className="flex items-center justify-between">
                <Label htmlFor="vip-offer-reminders" className="flex flex-col space-y-1">
                <span>Lembretes de Ofertas VIP Exclusivas</span>
                <span className="font-normal leading-snug text-muted-foreground text-xs">
                    Receber notificações sobre promoções especiais e ofertas de parceiros para membros VIP.
                </span>
                </Label>
                <Switch id="vip-offer-reminders" defaultChecked />
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
                <Label htmlFor="vip-event-alerts" className="flex flex-col space-y-1">
                  <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4 text-muted-foreground" /> Alertas de Novos Eventos</span>
                  <span className="font-normal leading-snug text-muted-foreground text-xs">
                      Ser informado sobre eventos municipais, de parceiros e outras experiências exclusivas para VIPs.
                  </span>
                </Label>
                <Switch id="vip-event-alerts" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary"><Shield className="mr-2 h-6 w-6"/> Segurança</CardTitle>
          <CardDescription>Gerencie as configurações de segurança da sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={() => toast({title: "Simulação", description: "Funcionalidade de alterar senha (simulada)." })}>Alterar Senha (Simulado)</Button>
        </CardContent>
      </Card>
      
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary"><CreditCard className="mr-2 h-6 w-6"/> Assinatura</CardTitle>
          <CardDescription>Veja e gerencie seu plano Guia Mais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">Detalhes da sua assinatura e opções de gerenciamento aparecerão aqui.</p>
            <Button variant="outline" asChild><Link href="/join">Ver Planos</Link></Button>
        </CardContent>
      </Card>

      <div className="mt-10 text-center">
        <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto">
            <LogOut className="mr-2 h-5 w-5" />
            Sair da Conta
        </Button>
      </div>
    </div>
  );
}
