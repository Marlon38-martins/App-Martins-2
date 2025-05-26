// src/app/partner-registration/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Award, MessageSquare, Briefcase, ArrowLeft, TrendingUp, Rocket, Handshake, BadgePercent, UserPlus, Wrench, Ticket, Star, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function PartnerRegistrationPage() {
  useEffect(() => {
    document.title = "Seja um Parceiro - Guia Mais";
  }, []);

  const partnerPlans = [
    {
      name: "Plano Largada",
      Icon: Rocket,
      iconColor: "text-blue-500",
      normalOffers: 3,
      specialOffers: 1,
      description: "Ideal para negócios que estão começando e buscam ganhar visibilidade inicial, atraindo novos clientes com uma oferta especial de impacto e algumas promoções regulares.",
      priceInfo: "Saber Mais",
      link: "/partner/plans",
    },
    {
      name: "Plano Processo",
      Icon: TrendingUp,
      iconColor: "text-green-500",
      normalOffers: 5,
      specialOffers: 1,
      description: "Para negócios em crescimento que desejam maior engajamento e mais oportunidades de destacar seus serviços e produtos com um volume maior de ofertas.",
      priceInfo: "Saber Mais",
      link: "/partner/plans",
    },
    {
      name: "Plano Consolide",
      Icon: ShieldCheck,
      iconColor: "text-purple-500",
      normalOffers: 6,
      specialOffers: 2,
      description: "Maximize sua presença e resultados! Visibilidade premium na página inicial, notificações frequentes de suas ofertas para clientes VIP e acompanhamento de fluxo de visitas ao estabelecimento.",
      priceInfo: "Saber Mais",
      link: "/partner/plans",
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Button asChild variant="outline" className="mb-8 print:hidden">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Início
        </Link>
      </Button>

      <div className="relative w-full h-48 md:h-60 mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="https://placehold.co/800x350.png"
          alt="Seja Parceiro Guia Mais"
          layout="fill"
          objectFit="cover"
          data-ai-hint="business partnership"
        />
      </div>

      <section className="mb-10 text-center">
        <Handshake className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Cadastre seu negócio e atraia mais turistas!
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Junte-se à nossa rede de parceiros em Martins e impulsione seu estabelecimento com o Guia Mais.
        </p>
      </section>

      <div className="space-y-8">
        <Card className="shadow-xl border-2 border-accent">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center text-xl md:text-2xl text-accent">
              <Award className="mr-3 h-6 w-6 md:h-7 md:w-7" />
              Benefícios Exclusivos para Parceiros Guia Mais
            </CardTitle>
            <CardDescription>Veja como podemos ajudar seu negócio a crescer:</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-3">
            <ul className="list-none space-y-2 text-sm md:text-base">
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Visibilidade com selo de parceiro oficial:</strong> Ganhe um selo de destaque que aumenta a confiança e atrai mais clientes.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Ferramentas para criar promoções e cupons:</strong> Gerencie facilmente suas ofertas para maximizar o engajamento e as vendas.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Relatórios de desempenho e engajamento:</strong> Acompanhe o alcance das suas ofertas, o número de resgates e o feedback dos clientes (em breve).
                </span>
              </li>
               <li className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Alcance um público engajado:</strong> Conecte-se diretamente com turistas e moradores que buscam experiências em Martins.
                </span>
              </li>
               <li className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Suporte dedicado:</strong> Nossa equipe está pronta para ajudar você a obter os melhores resultados.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center text-xl md:text-2xl text-primary">
              <BadgePercent className="mr-3 h-6 w-6 md:h-7 md:w-7" />
              Nossos Planos de Parceria Premium
            </CardTitle>
            <CardDescription>Escolha o plano que melhor se adapta às suas necessidades e impulsione seu negócio.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerPlans.map((plan) => (
                <Card key={plan.name} className="flex flex-col rounded-lg border bg-card p-3 shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0 mb-2">
                    <div className="flex items-center mb-1.5">
                      <plan.Icon className={`mr-2 h-5 w-5 ${plan.iconColor}`} />
                      <CardTitle className={`text-md font-semibold ${plan.iconColor}`}>{plan.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow">
                    <p className="text-xs text-muted-foreground mb-2">{plan.description}</p>
                    <ul className="space-y-1 text-xs text-foreground/80">
                      <li className="flex items-center">
                        <Ticket className="mr-2 h-3.5 w-3.5 text-green-500" /> {plan.normalOffers} Ofertas Normais
                      </li>
                      <li className="flex items-center">
                        <Star className="mr-2 h-3.5 w-3.5 text-yellow-400 fill-yellow-400" /> {plan.specialOffers} Oferta(s) VIP Especial(is)
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="p-0 mt-auto pt-3">
                    <Button variant="outline" asChild className="w-full text-xs h-8">
                      <Link href={plan.link}>
                        <MessageSquare className="mr-2 h-3.5 w-3.5" /> {plan.priceInfo}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="rounded-lg border bg-card p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-accent flex items-center">
                  <Wrench className="mr-2 h-5 w-5" /> Assinatura Sob Medida
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Planos personalizados para necessidades únicas. Ideal para grandes redes, eventos especiais ou requisitos específicos.
                </p>
                <Button variant="outline" asChild className="w-full md:w-auto text-sm h-9">
                  <Link href="mailto:parcerias@guiamais.com.br?subject=Interesse%20em%20Assinatura%20Sob%20Medida%20-%20Guia%20Mais">
                    <MessageSquare className="mr-2 h-4 w-4" /> Falar com Consultor
                  </Link>
                </Button>
              </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-r from-primary/10 via-background to-background">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center text-xl md:text-2xl text-primary">
              <UserPlus className="mr-3 h-6 w-6 md:h-7 md:w-7" />
              Pronto para Começar?
            </CardTitle>
            <CardDescription>Dê o próximo passo para destacar seu negócio em Martins!</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 text-center">
            <p className="mb-4 text-sm text-foreground/80">
              Não perca a oportunidade de fazer parte do Guia Mais e alcançar milhares de potenciais clientes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base h-11" asChild>
                <Link href="/partner/register">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Quero Ser Parceiro
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-base h-11">
                <Link href="mailto:parcerias@guiamais.com.br?subject=Dúvidas%20sobre%20Parceria%20-%20Guia%20Mais">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Falar com Consultor
                </Link>
              </Button>
            </div>
          </CardContent>
           <CardFooter className="p-4 md:p-6 pt-4">
            <p className="text-xs text-muted-foreground mx-auto text-center">
                Ao se cadastrar, você concorda com nossos <Link href="/termos-parceiros" className="underline hover:text-primary">Termos de Parceria</Link> e <Link href="/politica-de-privacidade" className="underline hover:text-primary">Política de Privacidade</Link>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
