// src/app/partner/panel/page.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, LayoutDashboard, Tag, Edit3, BarChart3, ImageIcon, Users, Building } from 'lucide-react';
// No longer need useAuth for access control here
// import { useAuth } from '@/hooks/use-auth-client';
// import { useRouter } from 'next/navigation';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { ShieldAlert } from 'lucide-react';

const MOCK_PARTNER_BUSINESS_ID = '1'; // For the edit link

export default function PartnerPanelPage() {
  // const { user, isAdmin, loading: authLoading } = useAuth();
  // const router = useRouter();
  // const [canAccess, setCanAccess] = useState(false);

  // useEffect(() => {
  //   if (!authLoading) {
  //     if (!user) {
  //       // Allow public access, so no redirect
  //       // router.push('/login?redirect=/partner/panel');
  //       setCanAccess(true); // Allow public access
  //     } else {
  //       // const isMockPartner = user.email === MOCK_PARTNER_EMAIL;
  //       // if (isAdmin || isMockPartner) { // For now, admin can also see this for dev purposes
  //       //   setCanAccess(true);
  //       // } else {
  //       //   setCanAccess(false);
  //       // }
  //       setCanAccess(true); // Allow any logged-in user, or even public
  //     }
  //   }
  // }, [user, isAdmin, authLoading, router]);

  // if (authLoading) {
  //   return (
  //     <div className="p-4 md:p-6 space-y-6">
  //       <Skeleton className="h-10 w-1/3" />
  //       {[...Array(3)].map((_, i) => (
  //         <Card key={i} className="shadow-md">
  //           <CardHeader><Skeleton className="h-7 w-1/2" /></CardHeader>
  //           <CardContent><Skeleton className="h-9 w-full" /></CardContent>
  //         </Card>
  //       ))}
  //     </div>
  //   );
  // }

  // if (!canAccess && !authLoading) { // This check is no longer needed for public access
  //   return (
  //     <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
  //       <Alert variant="destructive" className="max-w-md text-center">
  //         <ShieldAlert className="h-6 w-6 mx-auto mb-2" />
  //         <AlertTitle>Acesso Negado</AlertTitle>
  //         <AlertDescription>
  //           Você não tem permissão para acessar esta área.
  //         </AlertDescription>
  //       </Alert>
  //        <Button asChild variant="outline" className="mt-6">
  //         <Link href="/">Voltar para Início</Link>
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <div className="p-4 md:p-6">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-2 flex items-center md:text-3xl">
            <Briefcase className="mr-3 h-7 w-7 md:h-8 md:w-8 text-accent" />
            Portal do Parceiro Guia Mais
        </h1>
        <p className="text-md text-foreground/80 md:text-lg">
          Bem-vindo(a)! Gerencie seu estabelecimento, ofertas e explore as ferramentas disponíveis.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg md:text-xl text-accent">
              <LayoutDashboard className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              Meu Painel
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Visualize o painel principal do seu negócio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full text-xs md:text-sm">
              <Link href="/partner/dashboard">Acessar Painel do Estabelecimento</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg md:text-xl text-accent">
              <Edit3 className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              Editar Dados
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Atualize informações e contatos do seu negócio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full text-xs md:text-sm">
              <Link href={`/partner/edit-business/${MOCK_PARTNER_BUSINESS_ID}`}>Editar Meu Estabelecimento</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg md:text-xl text-accent">
              <Tag className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              Ofertas
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Crie e modifique promoções para os clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full text-xs md:text-sm">
              <Link href="/partner/manage-offers">Gerenciar Minhas Ofertas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg md:text-xl text-accent">
              <BarChart3 className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              Desempenho
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Veja estatísticas de visualizações e resgates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full text-xs md:text-sm">
              <Link href="/partner/analytics">Ver Desempenho</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg md:text-xl text-accent">
              <ImageIcon className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              Galeria
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Adicione e organize as fotos do seu negócio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full text-xs md:text-sm">
              <Link href="/partner/gallery">Gerenciar Imagens</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
