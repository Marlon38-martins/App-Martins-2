// src/app/profile/page.tsx
'use client';

import { useAuth } from '@/hooks/use-auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';
import { getMockUserSubscription, type Subscription } from '@/services/gramado-businesses'; // For mock subscription
import { useState } from 'react';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subLoading, setSubLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchSubscription = async () => {
        setSubLoading(true);
        const subDetails = await getMockUserSubscription(user.id); // Using mocked function
        setSubscription(subDetails);
        setSubLoading(false);
      };
      fetchSubscription();
    }
  }, [user]);

  if (authLoading || !user || subLoading) {
    return (
        <div className="space-y-4 p-4 md:p-6">
            <Skeleton className="h-12 w-1/2" />
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-32 mt-4" />
                </CardContent>
            </Card>
        </div>
    );
  }
  
  const userName = user.name || user.email?.split('@')[0] || 'Membro Prime';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Meu Perfil Martins Prime</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-24 w-24 text-3xl">
              <AvatarImage src={user.photoURL || undefined} alt={userName} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl text-primary">{userName}</CardTitle>
              <CardDescription className="text-md text-muted-foreground">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Detalhes da Assinatura</h3>
            {subscription ? (
              <div className={`p-4 rounded-md border ${subscription.status === 'active' ? 'border-green-500 bg-green-500/10' : 'border-yellow-500 bg-yellow-500/10'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {subscription.status === 'active' ? <ShieldCheck className="h-5 w-5 text-green-600" /> : <Star className="h-5 w-5 text-yellow-600" />}
                  <p className="font-medium text-foreground">
                    Plano: <span className="font-bold text-primary">{subscription.planId === 'serrano_vip' ? 'Serrano VIP' : 'Explorador'}</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Status: <span className={`font-semibold ${subscription.status === 'active' ? 'text-green-700' : 'text-yellow-700'}`}>{subscription.status === 'active' ? 'Ativa' : 'Pendente/Expirada'}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Válida até: {new Date(subscription.endDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Você ainda não possui uma assinatura ativa. <Link href="/join" className="text-primary hover:underline font-semibold">Associe-se agora!</Link></p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Minhas Atividades (Em breve)</h3>
            <p className="text-sm text-muted-foreground">Aqui você poderá ver seus cupons utilizados, locais favoritos e mais.</p>
          </div>
          
          <Button variant="outline" asChild>
            <Link href="/settings">Gerenciar Conta e Configurações</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
