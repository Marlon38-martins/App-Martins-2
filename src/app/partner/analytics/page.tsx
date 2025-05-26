// src/app/partner/analytics/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BarChart3, Eye, ShoppingCart, MessageSquare, ShieldAlert, Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function PartnerAnalyticsPage() {

  return (
    <div className="p-3 md:p-4 space-y-4">
      <Button asChild variant="outline" size="sm" className="mb-2 text-xs">
        <Link href="/partner/panel">
          <ArrowLeft className="mr-1.5 h-3 w-3" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <section className="mb-4">
        <h1 className="text-lg font-bold text-primary flex items-center md:text-xl">
          <BarChart3 className="mr-2 h-5 w-5 md:h-6 md:w-6 text-accent" />
          Visão Geral do Desempenho
        </h1>
        <p className="text-xs text-muted-foreground md:text-sm">Acompanhe as métricas do seu estabelecimento no Guia Mais. (Dados simulados)</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <Card className="shadow-md">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-sm md:text-md text-accent"><Eye className="mr-1.5 h-4 w-4"/> Visualizações da Página</CardTitle>
            <CardDescription className="text-xs">Quantas vezes sua página no Guia Mais foi vista.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <div className="relative h-24 w-full mb-2 rounded overflow-hidden opacity-70">
              <Image src="https://placehold.co/300x100.png" alt="Gráfico de visualizações da página" layout="fill" objectFit="contain" data-ai-hint="analytics chart pageviews"/>
            </div>
            <p className="text-xl md:text-2xl font-bold text-primary">1,234</p>
            <p className="text-xs text-muted-foreground">Nos últimos 30 dias (simulado)</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-sm md:text-md text-accent"><ShoppingCart className="mr-1.5 h-4 w-4"/> Resgates de Ofertas</CardTitle>
            <CardDescription className="text-xs">Número de ofertas Guia Mais utilizadas pelos clientes.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
             <div className="relative h-24 w-full mb-2 rounded overflow-hidden opacity-70">
              <Image src="https://placehold.co/300x100.png" alt="Gráfico de resgates de ofertas" layout="fill" objectFit="contain" data-ai-hint="analytics chart redemptions"/>
            </div>
            <p className="text-xl md:text-2xl font-bold text-primary">56</p>
            <p className="text-xs text-muted-foreground">No total (simulado)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader className="p-3">
          <CardTitle className="flex items-center text-sm md:text-md text-accent"><Star className="mr-1.5 h-4 w-4"/> Avaliações de Clientes (Em Breve)</CardTitle>
          <CardDescription className="text-xs">Acompanhe o que os clientes estão dizendo sobre seu estabelecimento.</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
            <Alert variant="default" className="bg-secondary/20 border-secondary text-xs">
                <MessageSquare className="h-3.5 w-3.5 text-secondary-foreground"/>
                <AlertTitle className="text-secondary-foreground text-xs">Funcionalidade em Desenvolvimento</AlertTitle>
                <AlertDescription className="text-xs">
                Em breve, esta seção mostrará as avaliações e comentários dos usuários Guia Mais.
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
