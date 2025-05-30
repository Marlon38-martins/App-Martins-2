// src/app/partner/plans/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Rocket, TrendingUp, ShieldCheck, Wrench, MessageSquare, Ticket, Star, QrCode as QrCodeIcon, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const partnerPlansData = [
  {
    name: "Plano Largada",
    Icon: Rocket,
    iconColor: "text-blue-500",
    price: "R$ 79,90",
    billingCycle: "/ mês",
    benefits: [
      { text: "3 Ofertas Normais (com QR Code de resgate)", IconComp: Ticket },
      { text: "1 Oferta VIP Especial (com QR Code de resgate)", IconComp: Star },
      { text: "Notificação para clientes VIP sobre sua Oferta Especial", IconComp: MessageSquare },
      { text: "QR Code exclusivo para direcionar clientes à sua página no Guia Mais", IconComp: QrCodeIcon },
      { text: "Exibição de avaliações de clientes em sua página", IconComp: Star },
    ],
    description: "Ideal para negócios que estão começando e buscam ganhar visibilidade inicial, atraindo novos clientes com uma oferta especial de impacto e algumas promoções regulares.",
    priceInfo: "Tenho Interesse",
    mailtoSubject: "Interesse no Plano Largada (R$79,90/mês) - Guia Mais",
  },
  {
    name: "Plano Processo",
    Icon: TrendingUp,
    iconColor: "text-green-500",
    price: "R$ 119,90",
    billingCycle: "/ mês",
    benefits: [
      { text: "4 Ofertas Normais (com QR Code de resgate)", IconComp: Ticket }, // Changed from 5 to 4
      { text: "1 Oferta VIP Especial (com QR Code de resgate)", IconComp: Star },
      { text: "Notificação para clientes VIP sobre sua Oferta Especial", IconComp: MessageSquare },
      { text: "QR Code exclusivo para direcionar clientes à sua página no Guia Mais", IconComp: QrCodeIcon },
      { text: "Exibição de avaliações de clientes em sua página", IconComp: Star },
    ],
    description: "Para negócios em crescimento que desejam maior engajamento e mais oportunidades de destacar seus serviços, com mais ofertas e a força das avaliações.",
    priceInfo: "Tenho Interesse",
    mailtoSubject: "Interesse no Plano Processo (R$119,90/mês) - Guia Mais",
  },
  {
    name: "Plano Consolide",
    Icon: ShieldCheck,
    iconColor: "text-purple-500",
    price: "R$ 179,90",
    billingCycle: "/ mês",
    benefits: [
      { text: "6 Ofertas Normais (com QR Code de resgate)", IconComp: Ticket },
      { text: "2 Ofertas VIP Especiais (com QR Code de resgate)", IconComp: Star },
      { text: "QR Code exclusivo para direcionar clientes à sua página no Guia Mais", IconComp: QrCodeIcon },
      { text: "Visibilidade premium na página inicial", IconComp: TrendingUp },
      { text: "Notificações frequentes para clientes VIP sobre suas ofertas", IconComp: MessageSquare },
      { text: "Acompanhamento de desempenho (visitas, avaliações de clientes)", IconComp: Users },
      { text: "Exibição de avaliações de clientes em sua página", IconComp: Star },
    ],
    description: "Maximize sua presença e resultados! Visibilidade premium, notificações VIP, acompanhamento completo de desempenho e o poder das avaliações de clientes.",
    priceInfo: "Tenho Interesse",
    mailtoSubject: "Interesse no Plano Consolide (R$179,90/mês) - Guia Mais",
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
          Escolha o plano ideal para impulsionar seu negócio em Martins e região. Todas as ofertas criadas geram um QR Code para resgate, e as avaliações dos clientes ajudam a destacar seu estabelecimento!
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
              <div className="mb-4">
                <p className="text-3xl font-bold text-primary">{plan.price}<span className="text-sm font-normal text-muted-foreground">{plan.billingCycle}</span></p>
              </div>
              <h4 className="font-semibold text-foreground/90 mb-2">Benefícios Inclusos:</h4>
              <ul className="space-y-1.5 text-sm text-foreground/80">
                {plan.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <benefit.IconComp className="mr-2 h-4 w-4 text-green-500" /> {benefit.text}
                  </li>
                ))}
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
