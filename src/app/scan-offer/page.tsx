// src/app/scan-offer/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth-client';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Camera, QrCode, VideoOff, CheckCircle } from 'lucide-react';

export default function ScanOfferPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/scan-offer');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    let streamToCleanUp: MediaStream | null = null;

    const getCameraStreamWithFallback = async () => {
      if (!user || typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        if (user) { // Only toast if user is logged in, otherwise redirect will handle it
            toast({ variant: 'destructive', title: 'Câmera Não Suportada', description: 'Seu navegador não suporta acesso à câmera ou a funcionalidade não está disponível.' });
        }
        return;
      }

      try {
        // Attempt to get the front camera first ("user" facing)
        console.log('Attempting to get front camera (user facing)...');
        streamToCleanUp = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        console.log('Front camera (user facing) obtained successfully.');
      } catch (frontCameraError) {
        console.warn('Failed to get front camera:', frontCameraError, '. Falling back to default/any camera.');
        try {
          // Fallback to any camera (usually rear on mobile, or default webcam)
          streamToCleanUp = await navigator.mediaDevices.getUserMedia({ video: true });
          console.log('Default/any camera obtained after fallback.');
        } catch (anyCameraError) {
          console.error('Error accessing any camera after fallback:', anyCameraError);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Acesso à Câmera Falhou',
            description: 'Não foi possível acessar nenhuma câmera. Verifique as permissões do seu navegador.',
          });
          return; // Exit if all attempts fail
        }
      }

      if (streamToCleanUp) {
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = streamToCleanUp;
        }
      } else {
        // This case might be redundant if the catches above handle it, but serves as a safeguard
        setHasCameraPermission(false);
        if (user){ // Only show toast if user context is available
             toast({
                variant: 'destructive',
                title: 'Acesso à Câmera Falhou',
                description: 'Não foi possível iniciar a câmera.',
            });
        }
      }
    };

    if (user) { // Only attempt to get camera if user is loaded and present
        getCameraStreamWithFallback();
    } else if (!authLoading && !user) { // If auth is done loading and there's no user
        setHasCameraPermission(false); // Ensure camera permission is false if no user
    }


    // Cleanup function for the useEffect hook
    return () => {
      if (streamToCleanUp) {
        streamToCleanUp.getTracks().forEach(track => track.stop());
        console.log('Camera stream stopped on component unmount or user/auth change.');
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Good practice to clear srcObject
      }
    };
  }, [user, authLoading, toast]); // Dependencies for useEffect

  const handleScan = async () => {
    if (!hasCameraPermission) {
      toast({
        variant: 'destructive',
        title: 'Sem Permissão de Câmera',
        description: 'Não é possível escanear sem acesso à câmera.',
      });
      return;
    }

    setIsScanning(true);
    // Simulate scanning process
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    const mockScannedData = {
      offerTitle: "Desconto Especial de Parceiro",
      businessName: "Restaurante Mirante da Serra",
      discount: "15% OFF"
    };

    toast({
      title: 'Cupom Ativado com Sucesso!',
      description: `Você ativou "${mockScannedData.offerTitle}" em ${mockScannedData.businessName}. Apresente esta confirmação!`,
      variant: 'default',
      className: 'bg-green-500 text-white border-green-600',
      icon: <CheckCircle className="h-5 w-5 text-white" />,
    });
    setIsScanning(false);
  };

  if (authLoading || !user) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Card>
          <CardHeader><Skeleton className="h-7 w-1/2" /></CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Início
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-primary">
            <QrCode className="mr-3 h-6 w-6 text-accent" />
            Escanear Cupom QR Guia Mais
          </CardTitle>
          <CardDescription>
            Aponte a câmera para o QR code fornecido pelo parceiro para ativar seu desconto ou oferta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video w-full bg-muted rounded-md overflow-hidden flex items-center justify-center border border-dashed">
            {hasCameraPermission === null && !authLoading && user && ( // Show loading only if user is loaded and no permission status yet
              <div className="text-center text-muted-foreground p-4">
                <Camera className="h-12 w-12 mx-auto mb-2" />
                Solicitando permissão da câmera...
              </div>
            )}
            {hasCameraPermission === false && (
               <div className="text-center text-destructive-foreground p-4 bg-destructive/90 rounded-md w-full h-full flex flex-col justify-center items-center">
                <VideoOff className="h-12 w-12 mx-auto mb-2" />
                Acesso à câmera negado. Verifique as permissões do navegador.
              </div>
            )}
            {hasCameraPermission === true && (
                // Always render video tag, srcObject will be set by useEffect
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            )}
             {hasCameraPermission === null && (authLoading || !user) && ( // Placeholder for when auth is loading
                <div className="text-center text-muted-foreground p-4">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    Aguardando autenticação para iniciar câmera...
                </div>
            )}
          </div>

          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <VideoOff className="h-4 w-4" />
              <AlertTitle>Sem Acesso à Câmera</AlertTitle>
              <AlertDescription>
                Para escanear QR codes, precisamos da sua permissão para acessar a câmera. 
                Por favor, habilite-a nas configurações do seu navegador e atualize a página.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleScan} 
            className="w-full bg-primary hover:bg-primary/90" 
            size="lg"
            disabled={isScanning || hasCameraPermission !== true}
          >
            {isScanning ? 'Escaneando...' : (
              <>
                <Camera className="mr-2 h-5 w-5" />
                {hasCameraPermission === true ? "Validar QR Code (Simulado)" : (hasCameraPermission === false ? "Câmera Indisponível" : "Aguardando Câmera...")}
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Certifique-se de que o QR code está bem iluminado e centralizado na câmera.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
