// src/app/partner/analytics/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BarChart3, Eye, ShoppingCart, MessageSquare, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth-client';

const MOCK_PARTNER_EMAIL = 'partner@example.com';

export default function PartnerAnalyticsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [canAccess, setCanAccess] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/partner/analytics');
      } else if (user.email === MOCK_PARTNER_EMAIL || isAdmin) {
        setCanAccess(true);
      } else {
        setCanAccess(false);
        setAccessError("Acesso negado. Esta funcionalidade é para parceiros ou administradores.");
      }
    }
  }, [user, authLoading, isAdmin, router]);


  if (authLoading || (!canAccess && !authLoading)) {
    return (
      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        <Skeleton className="h-9 w-1/3 mb-2" />
        <Skeleton className="h-8 w-2/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (!canAccess && !authLoading) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md text-center">
          <ShieldAlert className="mx-auto mb-2 h-6 w-6" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>{accessError || "Você não tem permissão para visualizar esta página."}</AlertDescription>
        </Alert>
         <Button asChild variant="outline" className="mt-6">
          <Link href="/"> <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Início </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <Button asChild variant="outline" className="mb-2">
        <Link href="/partner/panel">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <section className="mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center md:text-3xl">
          <BarChart3 className="mr-3 h-7 w-7 md:h-8 md:w-8 text-accent" />
          Visão Geral do Desempenho
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">Acompanhe as métricas do seu estabelecimento no Guia Mais.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="shadow-lg">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center text-md md:text-lg text-accent"><Eye className="mr-2 h-5 w-5"/> Visualizações da Página</CardTitle>
            <CardDescription className="text-xs md:text-sm">Quantas vezes seu estabelecimento foi visto.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-2xl md:text-3xl font-bold text-primary">1,234</p>
            <p className="text-xs text-muted-foreground">Nos últimos 30 dias (simulado)</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center text-md md:text-lg text-accent"><ShoppingCart className="mr-2 h-5 w-5"/> Resgates de Ofertas</CardTitle>
            <CardDescription className="text-xs md:text-sm">Número de ofertas Guia Mais utilizadas.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-2xl md:text-3xl font-bold text-primary">56</p>
            <p className="text-xs text-muted-foreground">No total (simulado)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center text-md md:text-lg text-accent"><MessageSquare className="mr-2 h-5 w-5"/> Feedback de Clientes</CardTitle>
          <CardDescription className="text-xs md:text-sm">Avaliações e comentários (funcionalidade futura).</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
            <Alert variant="default" className="bg-secondary/20 border-secondary text-xs md:text-sm">
                <MessageSquare className="h-4 w-4 text-secondary-foreground"/>
                <AlertTitle className="text-secondary-foreground">Em Breve!</AlertTitle>
                <AlertDescription>
                Esta seção mostrará avaliações e comentários dos usuários Guia Mais sobre seu estabelecimento.
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
