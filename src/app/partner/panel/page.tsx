// src/app/partner/panel/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase, LayoutDashboard, Tag, Edit3, BarChart3, ImageIcon, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-client';

const MOCK_PARTNER_EMAIL = 'partner@example.com';
const ADMIN_EMAIL = 'admin@example.com';

export default function PartnerPanelPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/partner/panel');
      } else if (user.email === MOCK_PARTNER_EMAIL || isAdmin) {
        setCanAccess(true);
      } else {
        setCanAccess(false);
      }
    }
  }, [user, authLoading, isAdmin, router]);

  if (authLoading || !canAccess) {
    return (
      <div className="p-3 md:p-4 space-y-4">
        <Skeleton className="h-8 w-1/2 mb-3" />
        <Skeleton className="h-5 w-3/4 mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-3"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full mt-1" /></CardHeader>
              <CardContent className="p-3"><Skeleton className="h-9 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!canAccess && !authLoading) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md text-center">
          <ShieldAlert className="mx-auto mb-2 h-6 w-6" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>Esta área é exclusiva para parceiros registrados.</AlertDescription>
        </Alert>
         <Button asChild variant="outline" className="mt-6">
          <Link href="/"> <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Início </Link>
        </Button>
      </div>
    );
  }
  
  const partnerName = user?.name || user?.email?.split('@')[0] || "Parceiro";

  return (
    <div className="p-3 md:p-4 space-y-4">
      <section className="mb-5">
        <h1 className="text-lg font-bold text-primary mb-1.5 flex items-center md:text-xl">
            <Briefcase className="mr-2 h-5 w-5 md:h-6 md:w-6 text-accent" />
            Portal do Parceiro Guia Mais
        </h1>
        <p className="text-xs text-foreground/80 md:text-sm">
          Bem-vindo(a), {partnerName}! Gerencie seu estabelecimento, ofertas e explore as ferramentas.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-accent">
              <LayoutDashboard className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Painel do Negócio
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Informações e ofertas do seu estabelecimento.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Button asChild className="w-full text-xs md:text-sm" size="sm">
              <Link href="/partner/dashboard">
                Acessar Meu Painel
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-accent">
              <Edit3 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Editar Dados
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Atualize informações e contatos do seu negócio.</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <Button asChild className="w-full text-xs md:text-sm" size="sm">
              <Link href={`/partner/edit-business/1`}> {/* Assuming '1' is the mock partner's business ID */}
                Editar Meu Estabelecimento
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-base md:text-lg text-accent">
              <Tag className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Gerenciar Ofertas Normais
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Crie e modifique promoções para todos os clientes.</CardDescription>
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
              Gerenciar Ofertas VIP
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Crie e modifique promoções exclusivas para VIPs.</CardDescription>
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
              Galeria
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
