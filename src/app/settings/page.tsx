
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
import { UserCircle, Bell, Shield, CreditCard, LogOut, Star, CalendarDays, Sparkles as SparklesIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth-client'; 
import { mockLogout } from '@/services/gramado-businesses'; 

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, subscription, loading, signOutUser: contextSignOutUser } = useAuth(); 

  const [name, setName] = useState('');
  const isVip = subscription?.planId === 'serrano_vip' && subscription?.status === 'active';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/settings'); 
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
            <Input id="name" value={name ?? ''} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email ?? ''} disabled />
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
          
          {isVip && (
            <div className="pt-2 mt-2 border-t border-border">
              <h4 className="text-md font-semibold text-accent mb-3 mt-3 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-400 fill-yellow-400"/> Notificações Prioritárias VIP
              </h4>
              <div className="flex items-center justify-between">
                  <Label htmlFor="vip-offer-reminders" className="flex flex-col space-y-1">
                  <span className="flex items-center"><SparklesIcon className="mr-1.5 h-4 w-4 text-muted-foreground" /> Lembretes de Ofertas VIP Exclusivas</span>
                  <span className="font-normal leading-snug text-muted-foreground text-xs">
                      Ser notificado sobre promoções especiais e ofertas de parceiros exclusivas para membros Serrano VIP.
                  </span>
                  </Label>
                  <Switch id="vip-offer-reminders" defaultChecked />
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                  <Label htmlFor="vip-event-alerts" className="flex flex-col space-y-1">
                    <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4 text-muted-foreground" /> Alertas VIP para Eventos</span>
                    <span className="font-normal leading-snug text-muted-foreground text-xs">
                        Receber informações prioritárias e, por vezes, acesso antecipado a eventos municipais e de parceiros.
                    </span>
                  </Label>
                  <Switch id="vip-event-alerts" defaultChecked />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary"><Shield className="mr-2 h-6 w-6"/> Segurança</CardTitle>
          <CardDescription>Gerencie as configurações de segurança da sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={() => toast({title: "Simulação", description: "Funcionalidade de alterar senha (simulada). Em um app real, isso enviaria um email de redefinição ou solicitaria a senha atual." })}>Alterar Senha (Simulado)</Button>
        </CardContent>
      </Card>
      
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary"><CreditCard className="mr-2 h-6 w-6"/> Assinatura</CardTitle>
          <CardDescription>Veja e gerencie seu plano Guia Mais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {subscription ? (
                 <div className={`p-3 rounded-md border ${subscription.status === 'active' ? 'border-green-500 bg-green-500/10' : 'border-yellow-500 bg-yellow-500/10'}`}>
                    <p className="text-sm font-medium text-foreground">
                    Plano: <span className="font-bold text-primary">{subscription.planId === 'serrano_vip' ? 'Serrano VIP' : (subscription.planId === 'premium_anual' ? 'Premium Anual' : 'Premium Mensal')}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                    Status: <span className={`font-semibold ${subscription.status === 'active' ? 'text-green-700' : 'text-yellow-700'}`}>{subscription.status === 'active' ? 'Ativa' : 'Pendente/Expirada'}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                    Válida até: {new Date(subscription.endDate).toLocaleDateString('pt-BR')}
                    </p>
                </div>
            ) : (
                 <p className="text-muted-foreground text-sm">Você ainda não possui uma assinatura ativa.</p>
            )}
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
