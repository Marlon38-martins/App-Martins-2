// src/app/contact/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, MessageSquare, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Início
        </Link>
      </Button>

      <section className="mb-10">
        <div className="flex items-center mb-4">
          <MessageSquare className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Fale Conosco
          </h1>
        </div>
        <p className="text-lg text-foreground/80">
          Tem alguma dúvida, sugestão ou precisa de suporte? Entre em contato!
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-accent"><Mail className="mr-2 h-6 w-6"/> Envie um Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 mb-1">Para dúvidas gerais e suporte:</p>
            <Button variant="link" asChild className="p-0 h-auto text-lg text-primary">
              <a href="mailto:contato@guiamais.com.br">contato@guiamais.com.br</a>
            </Button>

            <p className="text-foreground/90 mt-4 mb-1">Para parcerias comerciais:</p>
            <Button variant="link" asChild className="p-0 h-auto text-lg text-primary">
              <a href="mailto:parcerias@guiamais.com.br">parcerias@guiamais.com.br</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-accent"><Phone className="mr-2 h-6 w-6"/> Telefone (Simulado)</CardTitle>
            <CardDescription>Horário de atendimento: Seg-Sex, 9h-18h</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 mb-1">Atendimento ao cliente:</p>
            <p className="text-lg font-semibold text-primary">(XX) XXXX-XXXX</p>
            
            <p className="text-foreground/90 mt-4 mb-1">Suporte a parceiros:</p>
            <p className="text-lg font-semibold text-primary">(XX) YYYY-YYYY</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8 shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center text-accent">Nossas Redes Sociais (Exemplo)</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
            <Button variant="outline" asChild>
                <Link href="https://instagram.com/guiamais" target="_blank" rel="noopener noreferrer">Instagram</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href="https://facebook.com/guiamais" target="_blank" rel="noopener noreferrer">Facebook</Link>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
