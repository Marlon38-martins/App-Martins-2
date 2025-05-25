// src/app/partner/gallery/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getGramadoBusinessById, type GramadoBusiness } from '@/services/gramado-businesses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, ImageIcon, PlusCircle, Trash2, UploadCloud, ShieldAlert } from 'lucide-react'; 

const MOCK_PARTNER_BUSINESS_ID = '1'; 

export default function PartnerGalleryPage() {
  const [business, setBusiness] = useState<GramadoBusiness | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBusinessData() {
      setIsLoadingData(true);
      setError(null);
      try {
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

  if (isLoadingData) { 
    return (
      <div className="p-3 md:p-4 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Card>
          <CardHeader className="p-3"><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent className="space-y-2.5 p-3">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-8 w-28" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3"><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2.5 p-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-md" />)}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-3 md:p-4">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" /> 
          <AlertTitle className="text-sm">Erro</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" size="sm" className="mt-3 text-xs">
          <Link href="/partner/panel"><ArrowLeft className="mr-1.5 h-3 w-3"/> Voltar ao Painel</Link>
        </Button>
      </div>
    );
  }

  if (!business) {
    return <div className="p-6 text-center text-sm">Dados do estabelecimento não carregados.</div>;
  }

  const mockAdditionalImages = [
    "https://placehold.co/600x400.png?text=Galeria+1",
    "https://placehold.co/600x400.png?text=Galeria+2",
    "https://placehold.co/600x400.png?text=Galeria+3",
    "https://placehold.co/600x400.png?text=Galeria+4",
  ];

  return (
    <div className="p-3 md:p-4 space-y-4">
      <Button asChild variant="outline" size="sm" className="mb-1 text-xs">
        <Link href="/partner/panel">
          <ArrowLeft className="mr-1.5 h-3 w-3" />
          Voltar para o Painel do Parceiro
        </Link>
      </Button>

      <section className="mb-4">
        <h1 className="text-lg font-bold text-primary flex items-center md:text-xl">
          <ImageIcon className="mr-2 h-5 w-5 md:h-6 md:w-6 text-accent" />
          Gerenciar Galeria de Imagens
        </h1>
        <p className="text-xs text-muted-foreground md:text-sm">Para: {business?.name}</p>
      </section>

      <Card className="shadow-md">
        <CardHeader className="p-3">
          <CardTitle className="text-md md:text-lg">Imagem Principal</CardTitle>
          <CardDescription className="text-xs md:text-sm">Esta é a imagem de capa do seu estabelecimento.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center sm:items-start gap-2 p-3">
          <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden border">
            <Image src={business?.imageUrl || 'https://placehold.co/600x400.png'} alt={`Imagem principal de ${business?.name}`} layout="fill" objectFit="cover" data-ai-hint={`${business?.type} cover photo`} />
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs h-8">
            <Link href={`/partner/edit-business/${business?.id || MOCK_PARTNER_BUSINESS_ID}`}>
              <UploadCloud className="mr-1.5 h-3.5 w-3.5" /> Alterar Imagem Principal
            </Link>
          </Button>
           <p className="text-xs text-muted-foreground">Para alterar, edite os detalhes do seu negócio.</p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="p-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
            <div>
              <CardTitle className="text-md md:text-lg">Galeria Adicional</CardTitle>
              <CardDescription className="text-xs md:text-sm">Adicione mais fotos para mostrar o melhor do seu espaço. (Máximo 5 fotos)</CardDescription>
            </div>
            <Button variant="default" disabled size="sm" className="text-xs h-8 mt-1.5 sm:mt-0"> 
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Adicionar Nova Foto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {mockAdditionalImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mockAdditionalImages.map((imgSrc, index) => (
                <div key={index} className="group relative aspect-square rounded-md overflow-hidden border">
                  <Image src={imgSrc} alt={`Imagem adicional ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint={`${business?.type} interior exterior`} />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="icon" className="h-7 w-7" title="Remover Imagem (Simulado)" disabled>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert className="text-xs md:text-sm">
              <ImageIcon className="h-4 w-4"/>
              <AlertTitle className="text-xs">Galeria Vazia</AlertTitle>
              <AlertDescription className="text-xs">Nenhuma imagem adicional cadastrada. Clique em "Adicionar Nova Foto" para começar.</AlertDescription>
            </Alert>
          )}
        </CardContent>
         <CardFooter className="p-3">
            <p className="text-xs text-muted-foreground">
                Boas fotos atraem mais clientes! Certifique-se de usar imagens de alta qualidade.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
