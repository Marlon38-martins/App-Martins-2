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

// TODO: Add a QR code scanning library like 'react-qr-reader' or 'html5-qrcode' to package.json
// For now, we will simulate the scanning process.

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
    const getCameraPermission = async () => {
      if (!user) return; // Don't request if not logged in
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // Clean up stream when component unmounts or permissions change
        return () => {
          stream.getTracks().forEach(track => track.stop());
        };
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acesso à Câmera Negado',
          description: 'Por favor, habilite a permissão da câmera nas configurações do seu navegador para escanear QR codes.',
        });
      }
    };

    getCameraPermission();
  }, [user, toast]);


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
    
    // Simulate a successful scan and offer redemption
    // In a real app, you would:
    // 1. Use a QR library to decode the video stream.
    // 2. Send the decoded data (e.g., offerId, businessId) to your backend.
    // 3. Backend validates the offer, checks user eligibility, records redemption.
    // 4. Backend returns success/failure.
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
    // Optionally, redirect or show more details
    // router.push('/profile'); 
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
            {hasCameraPermission === null && (
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
                {hasCameraPermission === true ? "Validar QR Code (Simulado)" : "Aguardando Câmera..."}
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
