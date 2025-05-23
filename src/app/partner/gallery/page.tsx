// src/app/partner/gallery/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { useRouter } from 'next/navigation'; // Not used for auth redirection
// import { useAuth } from '@/hooks/use-auth-client'; // No longer needed for public access
import { getGramadoBusinessById, type GramadoBusiness } from '@/services/gramado-businesses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, ImageIcon, PlusCircle, Trash2, UploadCloud } from 'lucide-react'; // ShieldAlert removed
// import { Input } from '@/components/ui/input'; // Not used

// const MOCK_PARTNER_EMAIL = 'partner@example.com'; // Not used for access control
const MOCK_PARTNER_BUSINESS_ID = '1'; 
// const ADMIN_EMAIL = 'admin@example.com'; // Not used for access control


export default function PartnerGalleryPage() {
  // const { user, isAdmin, loading: authLoading } = useAuth(); // Auth checks removed
  // const router = useRouter(); // No longer needed for auth redirection
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Access is now public, auth checks removed from useEffect
  useEffect(() => {
    async function loadBusinessData() {
      setIsLoadingData(true);
      setError(null);
      try {
        // For public access, always load the mock business. 
        // In a real app with auth, this would be the logged-in partner's businessId.
        const businessIdToLoad = MOCK_PARTNER_BUSINESS_ID; 
        const businessData = await getGramadoBusinessById(businessIdToLoad);
        if (businessData) {
          setBusiness(businessData);
        } else {
          setError('Estabelecimento não encontrado.');
        }
      } catch (err) {
        console.error("Error loading business data for gallery:", err);
        setError('Falha ao carregar dados do estabelecimento.');
      } finally {
        setIsLoadingData(false);
      }
    }
    loadBusinessData();
  }, []);

  if (isLoadingData) { // Simplified loading check
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-md" />)}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          {/* <ShieldAlert className="h-5 w-5" /> // Icon removed */}
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/partner/panel"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar ao Painel</Link>
        </Button>
      </div>
    );
  }

  if (!business) {
    return <div className="p-6 text-center">Dados do estabelecimento não carregados.</div>;
  }

  const mockAdditionalImages = [
    "https://placehold.co/600x400.png?text=Galeria+1",
    "https://placehold.co/600x400.png?text=Galeria+2",
    "https://placehold.co/600x400.png?text=Galeria+3",
    "https://placehold.co/600x400.png?text=Galeria+4",
  ];

  return (
    <div className="p-4 md:p-6 space-y-8">
      <Button asChild variant="outline" className="mb-2">
        <Link href="/partner/panel">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <section className="mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center md:text-3xl">
          <ImageIcon className="mr-3 h-7 w-7 md:h-8 md:w-8 text-accent" />
          Gerenciar Galeria de Imagens
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">Para: {business.name}</p>
      </section>

      <Card className="shadow-lg">
        <CardHeader className="p-4">
          <CardTitle className="text-lg md:text-xl">Imagem Principal</CardTitle>
          <CardDescription className="text-xs md:text-sm">Esta é a imagem de capa do seu estabelecimento.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center sm:items-start gap-3 p-4">
          <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden border">
            <Image src={business.imageUrl} alt={`Imagem principal de ${business.name}`} layout="fill" objectFit="cover" data-ai-hint={`${business.type} cover photo`} />
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs md:text-sm">
            <Link href={`/partner/edit-business/${business.id}`}>
              <UploadCloud className="mr-2 h-4 w-4" /> Alterar Imagem Principal
            </Link>
          </Button>
           <p className="text-xs text-muted-foreground">Para alterar, edite os detalhes do seu negócio.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-lg md:text-xl">Galeria Adicional</CardTitle>
              <CardDescription className="text-xs md:text-sm">Adicione mais fotos para mostrar o melhor do seu espaço. (Máximo 5 fotos)</CardDescription>
            </div>
            <Button variant="default" disabled size="sm" className="text-xs md:text-sm mt-2 sm:mt-0"> {/* Placeholder button */}
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Foto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {mockAdditionalImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {mockAdditionalImages.map((imgSrc, index) => (
                <div key={index} className="group relative aspect-square rounded-md overflow-hidden border">
                  <Image src={imgSrc} alt={`Imagem adicional ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint={`${business.type} interior exterior`} />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="icon" className="h-7 w-7 md:h-8 md:w-8" title="Remover Imagem (Simulado)" disabled>
                      <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert className="text-xs md:text-sm">
              <ImageIcon className="h-4 w-4"/>
              <AlertTitle>Galeria Vazia</AlertTitle>
              <AlertDescription>Nenhuma imagem adicional cadastrada. Clique em "Adicionar Nova Foto" para começar.</AlertDescription>
            </Alert>
          )}
        </CardContent>
         <CardFooter className="p-4">
            <p className="text-xs text-muted-foreground">
                Boas fotos atraem mais clientes! Certifique-se de usar imagens de alta qualidade.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
