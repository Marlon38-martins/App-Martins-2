
// src/app/mobile-landing/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Facebook, Apple } from 'lucide-react'; // MountainSnow for logo placeholder

export default function MobileLandingPage() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-background text-foreground p-6 py-8">
      {/* Logo Area */}
      <div className="flex-shrink-0">
        {/* Replace with your actual logo component or image if available */}
        {/* <MountainSnow className="h-16 w-16 text-primary" /> */}
        <h1 className="text-4xl font-bold text-primary mt-2">Guia Mais</h1>
      </div>

      {/* Illustration/Central Content Area */}
      <div className="flex flex-col items-center text-center my-8">
        <div className="relative w-48 h-48 md:w-56 md:h-56 mb-6">
          <Image
            src="https://placehold.co/400x400.png"
            alt="App illustration"
            layout="fill"
            objectFit="contain"
            data-ai-hint="app feature"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-foreground/90">
          Bem-vindo(a) ao seu Guia!
        </h2>
        <p className="text-md text-muted-foreground max-w-xs">
          Descubra os melhores lugares e ofertas exclusivas na sua mão.
        </p>
      </div>

      {/* Action Buttons Area */}
      <div className="w-full max-w-sm space-y-4 mb-auto">
        <Button asChild size="lg" className="w-full py-3 text-lg bg-primary hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95">
          <Link href="/login">Entrar</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full py-3 text-lg border-primary text-primary hover:bg-primary/10 hover:text-primary transition-transform hover:scale-105 active:scale-95">
          <Link href="/join">Criar Conta</Link>
        </Button>
      </div>

      {/* Social Login Icons Footer */}
      <div className="flex-shrink-0 w-full max-w-sm mt-8">
        <p className="text-center text-xs text-muted-foreground mb-3">
          Ou entre com:
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="icon" className="border-muted-foreground/50 hover:border-primary hover:bg-primary/10 transition-transform hover:scale-105 active:scale-95">
            <Facebook className="h-5 w-5 text-blue-600" />
            <span className="sr-only">Login com Facebook</span>
          </Button>
          <Button variant="outline" size="icon" className="border-muted-foreground/50 hover:border-primary hover:bg-primary/10 transition-transform hover:scale-105 active:scale-95">
            {/* Placeholder for Google icon */}
            <span className="font-semibold text-sm">G</span> 
            <span className="sr-only">Login com Google</span>
          </Button>
          <Button variant="outline" size="icon" className="border-muted-foreground/50 hover:border-primary hover:bg-primary/10 transition-transform hover:scale-105 active:scale-95">
            <Apple className="h-5 w-5" />
            <span className="sr-only">Login com Apple</span>
          </Button>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Ao continuar, você concorda com nossos <Link href="/termos" className="underline hover:text-primary">Termos de Uso</Link>.
        </p>
      </div>
    </div>
  );
}
