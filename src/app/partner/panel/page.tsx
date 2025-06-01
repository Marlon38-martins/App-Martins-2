// src/app/partner/panel/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, LayoutDashboard, Tag, Edit3, BarChart3, ImageIcon, PlusCircle, Star, ShieldAlert, ArrowLeft, Route } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-client';
import { Skeleton } from '@/components/ui/skeleton';

const MOCK_PARTNER_BUSINESS_ID = '1'; 

export default function PartnerPanelPage() {
  const { user, isPartner, partnerPlan, loading } = useAuth();
  const partnerName = user?.name || user?.email?.split('@')[0] || "Parceiro Guia Mais";

  if (loading) {
    return (
      <div className="p-3 md:p-4 space-y-4">
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-5" />
        <Skeleton className="h-40 md:h-48 w-full mb-6 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-md">
              <CardHeader className="p-3"><Skeleton className="h-6 w-2/3" /></CardHeader>
              <CardContent className="p-3"><Skeleton className="h-8 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // For this mock, we assume a partner user is already "logged in" or identified by useAuth
  // If !isPartner, we could show an access denied message, but for simplicity assuming partner context
  
  const canCreateItinerary = isPartner && (partnerPlan === 'processo' || partnerPlan === 'consolide');

  return (
    <div className="p-3 md:p-4 space-y-4">
      <section className="mb-5">
        <div className="flex items-center mb-1.5">
          <Briefcase className="mr-2 h-6 w-6 md:h-7 md:w-7 text-primary" />
          <h1 className="text-xl font-bold text-primary md:text-2xl">
            Portal do Parceiro Guia Mais
          </h1>
        </div>
        <p className="text-xs text-foreground/80 md:text-sm">
          Bem-vindo(a), {partnerName}! Gerencie seu estabelecimento, ofertas e explore as ferramentas.
        </p>
        {isPartner && partnerPlan && (
          <p className="text-xs text-accent font-semibold mt-1">Plano Atual: {partnerPlan.charAt(0).toUpperCase() + partnerPlan.slice(1)}</p>
        )}
      </section>
      
      <div className="relative w-full h-40 md:h-48 mb-6 rounded-lg overflow-hidden shadow-md">
        <Image
          src="https://placehold.co/800x300.png"
          alt="Painel do Parceiro Guia Mais"
          layout="fill"
          objectFit="cover"
          data-ai-hint="dashboard interface"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-accent">
              <LayoutDashboard className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Meu Painel Detalhado
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Informações e resumo do seu estabelecimento.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Button asChild className="w-full text-xs md:text-sm" size="sm">
              <Link href="/partner/dashboard">
                Acessar Painel do Estabelecimento
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-accent">
              <Edit3 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Editar Dados do Negócio
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Atualize informações, fotos e contatos.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Button asChild className="w-full text-xs md:text-sm" size="sm">
              <Link href={`/partner/edit-business/${MOCK_PARTNER_BUSINESS_ID}`}>
                Editar Meu Estabelecimento
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-accent">
              <PlusCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Criar Oferta Normal
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Crie promoções para todos os clientes Guia Mais.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Button asChild className="w-full text-xs md:text-sm" size="sm">
              <Link href="/partner/add-normal-offer">
                Adicionar Oferta Normal
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-purple-600">
              <Star className="mr-2 h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-yellow-400" />
              Criar Oferta VIP
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Crie promoções exclusivas para membros VIP.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Button asChild variant="outline" className="w-full text-xs md:text-sm border-purple-500 text-purple-600 hover:bg-purple-500/10 hover:text-purple-700" size="sm">
              <Link href="/partner/add-vip-offer">
                Adicionar Oferta VIP
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-accent">
              <BarChart3 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Desempenho (Em Breve)
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Estatísticas de visualizações e resgates.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Button asChild className="w-full text-xs md:text-sm" size="sm">
              <Link href="/partner/analytics">
                 Ver Desempenho
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-accent">
              <ImageIcon className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Galeria de Imagens
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Adicione e organize as fotos do seu negócio.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Button asChild className="w-full text-xs md:text-sm" size="sm">
              <Link href="/partner/gallery">
                 Gerenciar Imagens
              </Link>
            </Button>
          </CardContent>
        </Card>

        {canCreateItinerary ? (
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 sm:col-span-2">
            <CardHeader className="p-3">
              <CardTitle className="flex items-center text-base md:text-lg text-accent">
                <Route className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Criar Roteiro Personalizado
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Monte itinerários exclusivos para seus clientes. (Disponível no seu plano atual)</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <Button asChild className="w-full text-xs md:text-sm" size="sm">
                <Link href="/partner/create-itinerary">
                  Criar Novo Roteiro
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md sm:col-span-2 bg-muted/50 border-dashed">
            <CardHeader className="p-3">
              <CardTitle className="flex items-center text-base md:text-lg text-muted-foreground">
                <Route className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Criar Roteiro Personalizado
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Esta funcionalidade não está disponível no seu plano atual (Largada). Faça um upgrade para os planos Processo ou Consolide para acessá-la.</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <Button asChild variant="outline" className="w-full text-xs md:text-sm" size="sm">
                <Link href="/partner/plans">
                  Ver Planos de Parceiro
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
