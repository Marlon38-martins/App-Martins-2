// src/app/institutional/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Info, Newspaper, Briefcase } from 'lucide-react';

export default function InstitutionalPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Início
        </Link>
      </Button>

      <section className="mb-10 text-center">
        <Building2 className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Informações Institucionais de Martins, RN
        </h1>
        <p className="text-lg text-foreground/80">
          Conheça mais sobre nossa cidade e os serviços da administração pública.
        </p>
      </section>

      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-accent">
              <Info className="mr-3 h-7 w-7" />
              Sobre a Cidade de Martins
            </CardTitle>
            <CardDescription>Uma pérola encravada na serra potiguar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src="https://placehold.co/800x450.png"
                alt="Vista panorâmica de Martins, RN"
                layout="fill"
                objectFit="cover"
                data-ai-hint="Martins landscape"
              />
            </div>
            <p className="text-foreground/90 leading-relaxed">
              Martins, conhecida como a "Princesa Serrana" ou "Campos do Jordão do Rio Grande do Norte", é um refúgio de clima ameno e paisagens deslumbrantes. Localizada no alto da Serra de Martins, a cidade encanta visitantes com sua rica história, cultura vibrante e hospitalidade acolhedora.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Fundada oficialmente em [Inserir Ano de Fundação], Martins preserva um charmoso centro histórico com casarões coloniais, igrejas centenárias e mirantes que oferecem vistas espetaculares da região. A natureza exuberante ao redor convida a trilhas ecológicas, passeios a cavalo e a contemplação do pôr do sol.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              A economia local é impulsionada pelo turismo, agricultura e artesanato, refletindo a criatividade e o trabalho do povo martinense. Eventos culturais e festivais ao longo do ano celebram as tradições e a alegria da cidade.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-accent">
              <Newspaper className="mr-3 h-7 w-7" />
              Notícias da Administração Pública ({currentYear})
            </CardTitle>
            <CardDescription>Fique por dentro das últimas novidades e comunicados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default" className="bg-secondary/20 border-secondary">
              <Newspaper className="h-5 w-5 text-secondary-foreground" />
              <AlertTitle className="text-secondary-foreground">Nova Campanha de Vacinação</AlertTitle>
              <AlertDescription>
                A Secretaria de Saúde informa o início da nova campanha de vacinação contra a gripe. Procure o posto de saúde mais próximo. (Publicado em: DD/MM/{currentYear})
              </AlertDescription>
            </Alert>
            <Alert>
              <Info className="h-5 w-5" />
              <AlertTitle>Recapeamento de Vias no Centro</AlertTitle>
              <AlertDescription>
                Obras de recapeamento asfáltico serão realizadas nas principais ruas do centro durante o próximo mês. Pedimos a compreensão de todos. (Publicado em: DD/MM/{currentYear})
              </AlertDescription>
            </Alert>
             <Alert variant="destructive">
              <Info className="h-5 w-5" />
              <AlertTitle>Alerta de Interrupção de Água</AlertTitle>
              <AlertDescription>
                Informamos que poderá haver interrupção no fornecimento de água no bairro X na próxima terça-feira para manutenção programada. (Publicado em: DD/MM/{currentYear})
              </AlertDescription>
            </Alert>
            <div className="text-center mt-6">
                <Button variant="link" className="text-primary">Ver Todas as Notícias (Link Externo)</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-accent">
              <Briefcase className="mr-3 h-7 w-7" />
              Serviços Públicos Essenciais
            </CardTitle>
            <CardDescription>Informações úteis sobre os serviços oferecidos pela prefeitura.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg hover:text-primary">Coleta de Lixo</AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  A coleta de lixo residencial ocorre às segundas, quartas e sextas-feiras a partir das 08:00. Colabore com a limpeza da cidade!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg hover:text-primary">Iluminação Pública</AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  Problemas com a iluminação pública? Entre em contato com a Secretaria de Obras pelo telefone (XX) XXXX-XXXX ou registre sua solicitação online no portal da prefeitura.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg hover:text-primary">Postos de Saúde</AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  Martins conta com [Número] postos de saúde para atendimento básico. O Posto Central funciona de segunda a sexta, das 07:00 às 17:00. Para emergências, dirija-se ao Hospital Municipal.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg hover:text-primary">Informações Turísticas</AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  Visite o Centro de Atendimento ao Turista (CAT) na Praça Central para mapas, guias e informações sobre atrações e eventos. Aberto diariamente das 09:00 às 17:00.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
