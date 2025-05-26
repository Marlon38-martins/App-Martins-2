// src/app/partner/plans/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Rocket, TrendingUp, ShieldCheck, Wrench, MessageSquare, Ticket, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const partnerPlansData = [
  {
    name: "Plano Largada",
    Icon: Rocket,
    iconColor: "text-blue-500",
    normalOffers: 3,
    specialOffers: 1,
    description: "Ideal para negócios que estão começando e buscam ganhar visibilidade inicial, atraindo novos clientes com uma oferta especial de impacto e algumas promoções regulares.",
    priceInfo: "Tenho Interesse",
    mailtoSubject: "Interesse no Plano Largada - Guia Mais",
  },
  {
    name: "Plano Processo",
    Icon: TrendingUp,
    iconColor: "text-green-500",
    normalOffers: 5,
    specialOffers: 1,
    description: "Para negócios em crescimento que desejam maior engajamento e mais oportunidades de destacar seus serviços e produtos com um volume maior de ofertas.",
    priceInfo: "Tenho Interesse",
    mailtoSubject: "Interesse no Plano Processo - Guia Mais",
  },
  {
    name: "Plano Consolide",
    Icon: ShieldCheck,
    iconColor: "text-purple-500",
    normalOffers: 6,
    specialOffers: 2,
    description: "Maximize sua presença e resultados! Visibilidade premium na página inicial, notificações frequentes de suas ofertas para clientes VIP e acompanhamento de fluxo de visitas ao estabelecimento.",
    priceInfo: "Tenho Interesse",
    mailtoSubject: "Interesse no Plano Consolide - Guia Mais",
  }
];

export default function PartnerPlansPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Button asChild variant="outline" className="mb-8 print:hidden">
        <Link href="/partner-registration">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Seja Parceiro
        </Link>
      </Button>

      <section className="mb-10 text-center">
        <Rocket className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Nossos Planos de Parceria Guia Mais
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Escolha o plano ideal para impulsionar seu negócio em Martins e região.
        </p>
      </section>

      <div className="space-y-6">
        {partnerPlansData.map((plan) => (
          <Card key={plan.name} className="shadow-lg border-2 border-accent/30 hover:border-accent transition-colors duration-300">
            <CardHeader className="p-4 md:p-6">
              <div className="flex items-center mb-2">
                <plan.Icon className={`mr-3 h-8 w-8 ${plan.iconColor}`} />
                <CardTitle className={`text-2xl font-semibold ${plan.iconColor}`}>{plan.name}</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <h4 className="font-semibold text-foreground/90 mb-2">Benefícios Inclusos:</h4>
              <ul className="space-y-1.5 text-sm text-foreground/80">
                <li className="flex items-center">
                  <Ticket className="mr-2 h-4 w-4 text-green-500" /> {plan.normalOffers} Ofertas Normais
                </li>
                <li className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-yellow-400 fill-yellow-400" /> {plan.specialOffers} Oferta(s) VIP Especial(is)
                </li>
                {plan.name === "Plano Consolide" && (
                  <>
                    <li className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-purple-500" /> Visibilidade premium na página inicial
                    </li>
                    <li className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4 text-purple-500" /> Notificações frequentes para clientes VIP
                    </li>
                     <li className="flex items-center">
                      <ShieldCheck className="mr-2 h-4 w-4 text-purple-500" /> Acompanhamento de desempenho de visitas
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
            <CardFooter className="p-4 md:p-6 pt-2">
              <Button variant="default" asChild className="w-full text-sm h-10 bg-primary hover:bg-primary/90">
                <Link href={`mailto:parcerias@guiamais.com.br?subject=${encodeURIComponent(plan.mailtoSubject)}`}>
                  <MessageSquare className="mr-2 h-4 w-4" /> {plan.priceInfo}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Separator className="my-8" />

        <Card className="shadow-lg border-2 border-secondary">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center mb-2">
              <Wrench className="mr-3 h-8 w-8 text-secondary-foreground" />
              <CardTitle className="text-2xl font-semibold text-secondary-foreground">Assinatura Sob Medida</CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              Precisa de algo diferente? Oferecemos planos personalizados para necessidades únicas. Ideal para grandes redes, eventos especiais ou requisitos específicos.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <Button variant="outline" asChild className="w-full text-sm h-10 border-secondary-foreground text-secondary-foreground hover:bg-secondary/20">
              <Link href="mailto:parcerias@guiamais.com.br?subject=Interesse%20em%20Assinatura%20Sob%20Medida%20-%20Guia%20Mais">
                <MessageSquare className="mr-2 h-4 w-4" /> Falar com Consultor
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
