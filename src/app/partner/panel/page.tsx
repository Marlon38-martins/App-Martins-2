// src/app/partner/panel/page.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, LayoutDashboard, Tag, Edit3, BarChart3, ImageIcon } from 'lucide-react';

const MOCK_PARTNER_BUSINESS_ID = '1'; // For the edit link

export default function PartnerPanelPage() {
  // No auth checks, page is publicly accessible
  // User-specific information would not be available here without login

  return (
    <div className="p-4 md:p-6">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <Briefcase className="mr-3 h-8 w-8 text-accent" />
            Portal do Parceiro Guia Mais
        </h1>
        <p className="text-lg text-foreground/80">
          Bem-vindo ao Portal do Parceiro! Gerencie seu estabelecimento, ofertas e veja seu desempenho.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-accent">
              <LayoutDashboard className="mr-2 h-6 w-6" />
              Painel do Estabelecimento
            </CardTitle>
            <CardDescription>Visualize detalhes e estatísticas do seu negócio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/partner/dashboard">Acessar Painel do Negócio</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-accent">
              <Edit3 className="mr-2 h-6 w-6" />
              Editar Dados
            </CardTitle>
            <CardDescription>Atualize informações e contatos do seu estabelecimento.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/partner/edit-business/${MOCK_PARTNER_BUSINESS_ID}`}>Editar Meu Estabelecimento</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-accent">
              <Tag className="mr-2 h-6 w-6" />
              Gerenciar Ofertas
            </CardTitle>
            <CardDescription>Crie e modifique promoções para os clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/partner/manage-offers">Gerenciar Minhas Ofertas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-accent">
              <BarChart3 className="mr-2 h-6 w-6" />
              Desempenho
            </CardTitle>
            <CardDescription>Veja estatísticas de visualizações e resgates (em breve).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/partner/analytics">Ver Desempenho</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-accent">
              <ImageIcon className="mr-2 h-6 w-6" />
              Galeria de Imagens
            </CardTitle>
            <CardDescription>Adicione e organize as fotos do seu estabelecimento.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/partner/gallery">Gerenciar Galeria</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}