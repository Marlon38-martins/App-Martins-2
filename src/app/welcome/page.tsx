
// src/app/welcome/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MountainSnow, User, Briefcase, ExternalLink, Facebook, Apple } from 'lucide-react'; 

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 text-white p-6 py-8">
      {/* Logo Area */}
      <div className="flex-shrink-0 text-center">
        <MountainSnow className="h-16 w-16 text-yellow-300 mx-auto" />
        <h1 className="text-4xl font-bold mt-2">Guia Mais</h1>
      </div>

      {/* Illustration/Central Content Area */}
      <div className="flex flex-col items-center text-center my-8">
        <div className="relative w-56 h-56 mb-6">
          <Image
            src="https://placehold.co/500x500.png"
            alt="Ilustração de viagem e cultura local"
            layout="fill"
            objectFit="contain"
            data-ai-hint="travel adventure"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          Descubra experiências incríveis perto de você!
        </h2>
      </div>

      {/* Action Buttons Area */}
      <div className="w-full max-w-xs space-y-4">
        <Button 
          asChild 
          size="lg" 
          className="w-full py-3.5 text-lg bg-yellow-400 text-yellow-900 hover:bg-yellow-300 transition-transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <Link href="/">
            <User className="mr-2 h-5 w-5" /> Sou Turista
          </Link>
        </Button>
        <Button 
          asChild 
          variant="outline" 
          size="lg" 
          className="w-full py-3.5 text-lg border-white text-white hover:bg-white/20 hover:text-white transition-transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <Link href="/partner-registration">
            <Briefcase className="mr-2 h-5 w-5" /> Sou Parceiro
          </Link>
        </Button>
      </div>

      {/* Social Login Icons Footer */}
      <div className="flex-shrink-0 w-full max-w-xs mt-10">
        <p className="text-center text-xs text-white/80 mb-3">
          Ou conecte-se com:
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-transform hover:scale-105 active:scale-95">
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Login com Facebook</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-transform hover:scale-105 active:scale-95">
            <span className="font-bold text-lg">G</span>
            <span className="sr-only">Login com Google</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-transform hover:scale-105 active:scale-95">
            <Apple className="h-5 w-5" />
            <span className="sr-only">Login com Apple</span>
          </Button>
        </div>
        <p className="mt-6 text-center text-xs text-white/70">
          Ao continuar, você concorda com nossos <Link href="/termos" className="underline hover:text-yellow-300">Termos de Uso</Link>.
        </p>
      </div>
    </div>
  );
}
