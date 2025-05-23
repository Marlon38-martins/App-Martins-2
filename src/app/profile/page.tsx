// src/app/profile/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, Star, UserCircle, QrCode } from 'lucide-react'; // Added QrCode
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth-client'; // Using the updated hook
import { type Subscription, type User } from '@/services/gramado-businesses'; 

export default function ProfilePage() {
  const router = useRouter();
  const { user, subscription, loading } = useAuth();

  const [nameToDisplay, setNameToDisplay] = useState('');
  const [initialToDisplay, setInitialToDisplay] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    } else if (user) {
      const uName = user.name || user.email?.split('@')[0] || 'Membro Guia Mais';
      setNameToDisplay(uName);
      setInitialToDisplay(uName.charAt(0).toUpperCase());
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="space-y-4 p-4 md:p-6">
            <Skeleton className="h-10 w-1/2 mb-6" /> {/* Page Title Skeleton */}
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-40" /> {/* User Name Skeleton */}
                            <Skeleton className="h-5 w-56" /> {/* User Email Skeleton */}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Skeleton className="h-5 w-1/3 mb-2" /> {/* Subscription Title Skeleton */}
                        <div className="p-3 rounded-md border border-muted bg-muted/50">
                            <Skeleton className="h-4 w-3/4 mb-1" />
                            <Skeleton className="h-3 w-1/2 mb-1" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    </div>
                    <div>
                        <Skeleton className="h-5 w-1/3 mb-2" /> {/* Activity Title Skeleton */}
                        <Skeleton className="h-10 w-full" /> {/* Placeholder for activity */}
                    </div>
                     <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Skeleton className="h-9 w-full sm:w-40" /> {/* Button Skeleton */}
                        <Skeleton className="h-9 w-full sm:w-40" /> {/* Button Skeleton */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Meu Perfil Guia Mais</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20 text-2xl">
              <AvatarImage src={user.photoURL || `https://placehold.co/100x100.png`} alt={nameToDisplay} data-ai-hint="profile avatar" />
              <AvatarFallback>{initialToDisplay}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl text-primary">{nameToDisplay}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-md font-semibold text-foreground mb-1">Detalhes da Assinatura</h3>
            {subscription ? (
              <div className={`p-3 rounded-md border ${subscription.status === 'active' ? 'border-green-500 bg-green-500/10' : 'border-yellow-500 bg-yellow-500/10'}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  {subscription.status === 'active' ? <ShieldCheck className="h-4 w-4 text-green-600" /> : <Star className="h-4 w-4 text-yellow-600" />}
                  <p className="text-sm font-medium text-foreground">
                    Plano: <span className="font-bold text-primary">{subscription.planId === 'serrano_vip' ? 'Serrano VIP' : (subscription.planId === 'premium_anual' ? 'Premium Anual' : 'Premium Mensal')}</span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Status: <span className={`font-semibold ${subscription.status === 'active' ? 'text-green-700' : 'text-yellow-700'}`}>{subscription.status === 'active' ? 'Ativa' : 'Pendente/Expirada'}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Válida até: {new Date(subscription.endDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Você ainda não possui uma assinatura ativa. <Link href="/join" className="text-primary hover:underline font-semibold">Associe-se agora!</Link></p>
            )}
          </div>

          <div>
            <h3 className="text-md font-semibold text-foreground mb-1">Minhas Atividades (Em breve)</h3>
            <p className="text-sm text-muted-foreground">Aqui você poderá ver seus cupons utilizados, locais favoritos e mais.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" asChild size="sm">
              <Link href="/settings" className="w-full sm:w-auto">
                <UserCircle className="mr-2 h-4 w-4"/>Gerenciar Conta
              </Link>
            </Button>
            <Button variant="default" asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
              <Link href="/scan-offer">
                <QrCode className="mr-2 h-4 w-4"/>Escanear Cupom QR
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
