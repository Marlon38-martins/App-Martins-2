
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
import { ArrowLeft, Camera, QrCode, VideoOff, CheckCircle, Loader2 } from 'lucide-react';

export default function ScanOfferPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/scan-offer');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    // Only attempt to get camera if user is loaded and present
    if (!user || authLoading) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        if(videoRef.current) videoRef.current.srcObject = null;
        console.log('Camera stream stopped due to user/auth state change.');
      }
      setHasCameraPermission(null); // Reset permission state if user logs out or is loading
      return;
    }

    const getCameraStream = async () => {
      if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        setCameraError('Seu navegador não suporta acesso à câmera.');
        return;
      }

      const cameraConstraints = [
        { video: { facingMode: { exact: "environment" } } }, // Prioritize rear camera
        { video: { facingMode: "user" } },                   // Fallback to front camera
        { video: true }                                      // Fallback to any camera
      ];

      for (const constraint of cameraConstraints) {
        try {
          console.log('Attempting to get camera with constraint:', constraint.video);
          streamRef.current = await navigator.mediaDevices.getUserMedia(constraint);
          console.log('Camera obtained successfully.');
          setHasCameraPermission(true);
          setCameraError(null);
          if (videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(playError => console.error("Error playing video:", playError));
          }
          return; // Exit loop if camera is successfully obtained
        } catch (err: any) {
          console.warn(`Failed to get camera with constraint:`, constraint.video, err.name, err.message);
          setCameraError(`Falha ao acessar câmera: ${err.message}. Tentando outra opção...`);
        }
      }

      // If all attempts fail
      console.error('All attempts to access camera failed.');
      setHasCameraPermission(false);
      setCameraError('Não foi possível acessar nenhuma câmera. Verifique as permissões do seu navegador.');
      toast({
        variant: 'destructive',
        title: 'Acesso à Câmera Falhou',
        description: 'Não foi possível acessar nenhuma câmera. Verifique as permissões do seu navegador.',
      });
    };

    getCameraStream();

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        if(videoRef.current) videoRef.current.srcObject = null;
        console.log('Camera stream stopped on component unmount.');
      }
    };
  }, [user, authLoading, toast]);

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

  const renderCameraView = () => {
    if (authLoading || (!user && !authLoading)) { // User context still loading or definitively no user
      return (
        <div className="text-center text-muted-foreground p-4 flex flex-col items-center justify-center h-full">
          <Loader2 className="h-12 w-12 mx-auto mb-2 animate-spin text-primary" />
          Aguardando autenticação...
        </div>
      );
    }
    if (hasCameraPermission === null && user) { // User loaded, camera permission being requested
         return (
            <div className="text-center text-muted-foreground p-4 flex flex-col items-center justify-center h-full">
                <Camera className="h-12 w-12 mx-auto mb-2 text-primary" />
                <Loader2 className="h-6 w-6 mx-auto my-2 animate-spin text-primary" />
                Solicitando permissão da câmera...
            </div>
        );
    }
    if (hasCameraPermission === false) {
        return (
            <div className="text-center text-destructive-foreground p-4 bg-destructive/90 rounded-md w-full h-full flex flex-col justify-center items-center">
                <VideoOff className="h-12 w-12 mx-auto mb-2" />
                {cameraError || 'Acesso à câmera negado ou câmera não encontrada.'}
            </div>
        );
    }
    if (hasCameraPermission === true) {
        // playsInline is important for iOS to play video inline
        return <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />;
    }
    return null; // Fallback, should not be reached if logic is correct
  };


  if (authLoading) { // Skeleton for the whole page if auth is loading
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
  
  if (!user && !authLoading) { // If auth is done and still no user, show login prompt
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive">
            <QrCode className="h-4 w-4" />
            <AlertTitle>Login Necessário</AlertTitle>
            <AlertDescription>Você precisa estar logado para escanear cupons.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
            <Link href="/login?redirect=/scan-offer">Fazer Login</Link>
        </Button>
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
            {renderCameraView()}
          </div>

          {hasCameraPermission === false && user && ( // Show only if user is logged in and permission is denied
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
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Escaneando...
              </>
            ) : (
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
