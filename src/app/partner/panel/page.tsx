// src/app/partner/panel/page.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, LayoutDashboard, Tag, Edit3, BarChart3, ImageIcon, ShieldAlert, ArrowLeft, PlusCircle, Star } from 'lucide-react';

const MOCK_PARTNER_BUSINESS_ID = '1'; 

export default function PartnerPanelPage() {
  return (
    <div className="p-3 md:p-4 space-y-4">
      <section className="mb-5">
        <h1 className="text-lg font-bold text-primary mb-1.5 flex items-center md:text-xl">
            <Briefcase className="mr-2 h-5 w-5 md:h-6 md:w-6 text-accent" />
            Portal do Parceiro Guia Mais
        </h1>
        <p className="text-xs text-foreground/80 md:text-sm">
          Bem-vindo ao Portal do Parceiro! Gerencie seu estabelecimento, ofertas e explore as ferramentas.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-accent">
              <LayoutDashboard className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Painel do Estabelecimento
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Informações e ofertas do seu estabelecimento.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Button asChild className="w-full text-xs md:text-sm" size="sm">
              <Link href="/partner/dashboard">
                Acessar Painel
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-accent">
              <Edit3 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Editar Detalhes
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Atualize informações e contatos do seu negócio.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Button asChild className="w-full text-xs md:text-sm" size="sm">
              <Link href={`/partner/edit-business/${MOCK_PARTNER_BUSINESS_ID}`}>
                Editar Dados do Negócio
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
            <CardDescription className="text-xs md:text-sm">Crie promoções para todos os clientes.</CardDescription>
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
              Desempenho
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Veja estatísticas de visualizações e resgates.</CardDescription>
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
      </div>
    </div>
  );
}
