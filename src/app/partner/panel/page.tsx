// src/app/partner/panel/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, ShieldAlert, LayoutDashboard, Tag, Edit3, Briefcase } from 'lucide-react';

const MOCK_PARTNER_EMAIL = 'partner@example.com';
const MOCK_PARTNER_BUSINESS_ID = '1'; // For the edit link

export default function PartnerPanelPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/partner/panel');
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-7 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-16 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-center">Redirecionando para login...</div>;
  }

  if (user.email !== MOCK_PARTNER_EMAIL) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md text-center">
          <ShieldAlert className="h-6 w-6 mx-auto mb-2" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Esta área é exclusiva para parceiros.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Início
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <Briefcase className="mr-3 h-8 w-8 text-accent" />
            Painel de Controle do Parceiro
        </h1>
        <p className="text-lg text-foreground/80">
          Bem-vindo(a), {user.name || user.email}! Gerencie seu estabelecimento e ofertas.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-accent">
              <LayoutDashboard className="mr-2 h-6 w-6" />
              Painel do Estabelecimento
            </CardTitle>
            <CardDescription>Visualize o painel principal do seu negócio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/partner/dashboard">Ver Painel do Estabelecimento</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-accent">
              <Tag className="mr-2 h-6 w-6" />
              Gerenciar Ofertas
            </CardTitle>
            <CardDescription>Adicione ou modifique suas promoções.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/partner/manage-offers">Gerenciar Ofertas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-accent">
              <Edit3 className="mr-2 h-6 w-6" />
              Editar Detalhes do Estabelecimento
            </CardTitle>
            <CardDescription>Atualize informações e imagem do seu estabelecimento.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/partner/edit-business/${MOCK_PARTNER_BUSINESS_ID}`}>Editar Detalhes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
