
// src/app/partner/manage-offers/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Tag, Settings, PlusCircle, ListFilter } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// TODO: This is a placeholder page.
// Future development should include:
// - Fetching and displaying a list of all offers (normal and VIP) for the logged-in partner.
// - Options to edit or delete existing offers.
// - Filters for offer status (active, expired, etc.).
// - Quick links to add new normal or VIP offers.
// - Authentication and authorization to ensure only the partner can manage their offers.

export default function ManageOffersPage() {
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
          <Tag className="mr-2 h-5 w-5 md:h-6 md:w-6 text-accent" />
          Gerenciar Minhas Ofertas
        </h1>
        <p className="text-xs text-muted-foreground md:text-sm">
          Visualize, edite e crie novas ofertas para o seu estabelecimento.
        </p>
      </section>

      <Card className="shadow-md">
        <CardHeader className="p-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="text-md md:text-lg">Listagem de Ofertas</CardTitle>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs h-8" disabled>
                    <ListFilter className="mr-1.5 h-3.5 w-3.5" /> Filtros (Em Breve)
                </Button>
                <Button asChild size="sm" className="text-xs h-8">
                    <Link href="/partner/add-normal-offer"><PlusCircle className="mr-1.5 h-3.5 w-3.5"/> Nova Oferta</Link>
                </Button>
            </div>
          </div>
          <CardDescription className="text-xs md:text-sm">
            Aqui serão listadas todas as suas ofertas ativas e passadas. (Funcionalidade em desenvolvimento)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertTitle className="text-sm">Em Desenvolvimento</AlertTitle>
            <AlertDescription className="text-xs">
              Esta seção está sendo preparada para você gerenciar todas as suas ofertas de forma eficiente. 
              Por enquanto, você pode adicionar novas ofertas normais e VIP através dos links no seu painel principal
              ou clicando no botão "Nova Oferta" acima.
            </AlertDescription>
          </Alert>
          {/* Placeholder for future offer list */}
          <div className="mt-4 space-y-3">
            {/* Example of how an offer might look - replace with actual data later */}
            <div className="p-3 border rounded-md bg-muted/30">
              <h4 className="font-semibold text-sm text-primary">Exemplo: Desconto de Fim de Semana</h4>
              <p className="text-xs text-muted-foreground">Status: Ativa (Simulado)</p>
              <p className="text-xs text-muted-foreground">Tipo: Desconto Percentual (Simulado)</p>
              <div className="mt-2">
                <Button variant="ghost" size="sm" className="text-xs h-7" disabled>Editar</Button>
                <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive h-7" disabled>Excluir</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
