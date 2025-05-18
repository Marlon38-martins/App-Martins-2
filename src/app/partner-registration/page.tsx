// src/app/partner-registration/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Award, MessageSquare, Briefcase, ArrowLeft, TrendingUp, Rocket, Handshake, BadgePercent, Eye } from 'lucide-react';

export default function PartnerRegistrationPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Button asChild variant="outline" className="mb-8 print:hidden">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Início
        </Link>
      </Button>

      <section className="mb-10 text-center">
        <Rocket className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Cadastre seu Negócio e Atraia Mais Turistas!
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Junte-se à nossa rede de parceiros em Martins e impulsione seu estabelecimento com o Guia Mais.
        </p>
      </section>

      <div className="space-y-8">
        <Card className="shadow-xl border-2 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-accent">
              <Award className="mr-3 h-7 w-7" />
              Benefícios Exclusivos para Parceiros Guia Mais
            </CardTitle>
            <CardDescription>Veja como podemos ajudar seu negócio a crescer:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-none space-y-3">
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Destaque no app com selo de parceiro:</strong> Aumente sua visibilidade e credibilidade entre os usuários.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Visibilidade com selo de parceiro oficial:</strong> Ganhe um selo de destaque que aumenta a confiança e atrai mais clientes.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Ferramentas para criar promoções e cupons:</strong> Gerencie facilmente suas ofertas para maximizar o engajamento e as vendas.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Ferramenta para criar cupons e ofertas exclusivas:</strong> Atraia mais clientes com promoções personalizadas e fáceis de gerenciar.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Acesso a relatórios de desempenho:</strong> Acompanhe o alcance das suas ofertas, o número de resgates e o feedback dos clientes.
                </span>
              </li>
               <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Alcance um público engajado:</strong> Conecte-se diretamente com turistas e moradores que buscam experiências em Martins.
                </span>
              </li>
               <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-foreground/90">
                  <strong>Suporte dedicado:</strong> Nossa equipe está pronta para ajudar você a obter os melhores resultados.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-primary">
              <Briefcase className="mr-3 h-7 w-7" />
              Modelos de Parceria Flexíveis
            </CardTitle>
            <CardDescription>Escolha o plano que melhor se adapta às suas necessidades e orçamento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-accent">Assinatura Mensal</h3>
                <p className="mb-1 text-2xl font-bold text-primary">R$ 49 a R$ 199</p>
                <p className="text-sm text-muted-foreground mb-3">/mês, conforme o pacote de funcionalidades.</p>
                <ul className="space-y-1 text-sm text-foreground/80">
                  <li><CheckCircle className="mr-2 inline h-4 w-4 text-green-500" />Visibilidade premium.</li>
                  <li><CheckCircle className="mr-2 inline h-4 w-4 text-green-500" />Criação ilimitada de ofertas (P1L2, descontos).</li>
                  <li><CheckCircle className="mr-2 inline h-4 w-4 text-green-500" />Relatórios detalhados.</li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-accent">Comissão por Venda/Conversão</h3>
                <p className="mb-1 text-2xl font-bold text-primary">5% a 15%</p>
                <p className="text-sm text-muted-foreground mb-3">sobre o valor da oferta utilizada.</p>
                <ul className="space-y-1 text-sm text-foreground/80">
                  <li><CheckCircle className="mr-2 inline h-4 w-4 text-green-500" />Pague apenas pelos resultados.</li>
                  <li><CheckCircle className="mr-2 inline h-4 w-4 text-green-500" />Ideal para testar a plataforma.</li>
                  <li><CheckCircle className="mr-2 inline h-4 w-4 text-green-500" />Acesso às ferramentas de criação de ofertas.</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Modelos personalizados também podem ser discutidos para atender necessidades específicas.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-r from-primary/10 via-background to-background">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-primary">
              <Handshake className="mr-3 h-7 w-7" />
              Pronto para Começar?
            </CardTitle>
            <CardDescription>Dê o próximo passo para destacar seu negócio em Martins!</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-foreground/80">
              Não perca a oportunidade de fazer parte do Guia Mais Martins e alcançar milhares de potenciais clientes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link href="/admin/add-establishment"> {/* Placeholder link */}
                  <Rocket className="mr-2 h-5 w-5" />
                  Quero Ser Parceiro
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="mailto:parcerias@guiamaismartins.com.br"> {/* Placeholder email */}
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Falar com Consultor
                </Link>
              </Button>
            </div>
          </CardContent>
           <CardFooter className="pt-4">
            <p className="text-xs text-muted-foreground mx-auto text-center">
                Ao se cadastrar, você concorda com nossos <Link href="/termos-parceiros" className="underline hover:text-primary">Termos de Parceria</Link> e <Link href="/politica-de-privacidade" className="underline hover:text-primary">Política de Privacidade</Link>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

    
