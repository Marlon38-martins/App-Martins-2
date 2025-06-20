
// src/app/vip-area/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Crown, ShieldAlert, Star, Bell, CalendarDays, TrendingUp, Newspaper } from 'lucide-react'; // Added Bell and CalendarDays

export default function VipAreaPage() {
  const { user, subscription, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/vip-area');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-10 w-1/3" />
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="mt-4 h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-primary mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground mb-6">Você precisa estar logado para acessar esta área.</p>
        <Button asChild>
          <Link href="/login?redirect=/vip-area">Fazer Login</Link>
        </Button>
      </div>
    );
  }

  const isVip = subscription?.planId === 'serrano_vip' && subscription?.status === 'active';

  return (
    <div className="p-4 md:p-6">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Início
        </Link>
      </Button>

      {isVip ? (
        <Card className="shadow-xl bg-gradient-to-br from-primary/20 via-background to-background border-primary">
          <CardHeader className="text-center">
            <Crown className="mx-auto h-16 w-16 text-accent mb-4" />
            <CardTitle className="text-3xl font-bold text-primary">Bem-vindo(a) à Área VIP!</CardTitle>
            <CardDescription className="text-lg text-accent-foreground/90">
              {user.name || user.email?.split('@')[0] || 'Membro'}, você tem acesso prioritário e exclusivo neste espaço.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg mb-2 text-foreground/80">
              Como membro Serrano VIP, você é o primeiro a saber das novidades, recebe ofertas especiais e tem acesso a conteúdo exclusivo. Explore seus benefícios!
            </p>
            
            <Card className="bg-card/80 border-accent/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-accent flex items-center justify-center"><Bell className="mr-2 h-5 w-5"/>Notificações Prioritárias</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Membros VIP recebem alertas antecipados sobre ofertas imperdíveis, novos parceiros e os melhores eventos da cidade, antes de todos.
                    </p>
                    <Button variant="outline" asChild size="sm" className="mt-3 text-xs">
                        <Link href="/settings">
                            <Bell className="mr-1.5 h-3 w-3"/> Gerenciar Preferências
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card/80">
                    <CardHeader>
                        <CardTitle className="text-xl text-accent flex items-center"><Star className="mr-2 h-5 w-5"/>Ofertas VIP Exclusivas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Acesso a descontos e promoções ainda melhores, pensadas para você.</p>
                         <Button variant="link" asChild className="mt-2 text-primary"><Link href="/services">Ver Minhas Ofertas VIP</Link></Button>
                    </CardContent>
                </Card>
                <Card className="bg-card/80">
                    <CardHeader>
                        <CardTitle className="text-xl text-accent flex items-center"><CalendarDays className="mr-2 h-5 w-5"/>Eventos com Acesso VIP</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Convites, informações antecipadas e, por vezes, condições especiais em eventos parceiros.</p>
                         <Button variant="link" asChild className="mt-2 text-primary"><Link href="/institutional">Ver Agenda de Eventos</Link></Button>
                    </CardContent>
                </Card>
                 <Card className="bg-card/80 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl text-accent flex items-center"><Newspaper className="mr-2 h-5 w-5"/>Novidades em Primeira Mão</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Fique sabendo dos novos parceiros, funcionalidades do app e notícias importantes da região antes dos demais usuários.</p>
                         <p className="text-xs text-muted-foreground mt-2">(Conteúdo de novidades aparecerá aqui - Simulado)</p>
                    </CardContent>
                </Card>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-destructive/50">
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
            <CardTitle className="text-2xl font-semibold text-destructive">Acesso Restrito</CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Esta é uma área exclusiva para membros do plano Serrano VIP.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-foreground/80 mb-6">
              Faça um upgrade para o nosso plano Serrano VIP e desbloqueie benefícios premium, acesso antecipado a novidades, ofertas exclusivas e muito mais!
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/join">Conheça os Planos e Associe-se</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
