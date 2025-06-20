
// src/app/institutional/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Info, Newspaper, Briefcase, Phone, MapPin, CalendarDays, Users, Instagram, Globe, Bell, RefreshCw } from 'lucide-react';

export default function InstitutionalPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Button asChild variant="outline" className="mb-6 print:hidden">
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
            <CardTitle className="flex items-center text-accent">
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
                data-ai-hint="Martins RN overview"
              />
            </div>
            <p className="text-foreground/90 leading-relaxed">
              Martins, conhecida como a "Princesa Serrana" ou "Campos do Jordão do Rio Grande do Norte", é um refúgio de clima ameno e paisagens deslumbrantes. Localizada no alto da Serra de Martins, a cidade encanta visitantes com sua rica história, cultura vibrante e hospitalidade acolhedora.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Fundada oficialmente em [Ano de Fundação de Martins], Martins preserva um charmoso centro histórico com casarões coloniais, igrejas centenárias e mirantes que oferecem vistas espetaculares da região. A natureza exuberante ao redor convida a trilhas ecológicas, passeios a cavalo e a contemplação do pôr do sol.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              A economia local é impulsionada pelo turismo, agricultura e artesanato, refletindo a criatividade e o trabalho do povo martinense. Eventos culturais e festivais ao longo do ano celebram as tradições e a alegria da cidade.
            </p>
             <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button variant="outline" asChild>
                    <Link href="https://www.martins.rn.gov.br/sobre" target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" /> Saiba Mais no Portal Oficial de Martins
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-accent">
              <MapPin className="mr-3 h-7 w-7" />
              Turismo em Martins
            </CardTitle>
            <CardDescription>Explore as belezas e atrações da nossa cidade.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
              <Image
                src="https://placehold.co/800x450.png"
                alt="Turismo em Martins, RN"
                layout="fill"
                objectFit="cover"
                data-ai-hint="Martins RN tourism spot"
              />
            </div>
            <p className="text-foreground/90 leading-relaxed">
              Martins oferece uma variedade de atrações para todos os gostos. Desde mirantes com vistas de tirar o fôlego, como o Mirante do Canto e o Mirante da Carranca, até trilhas históricas como a da Casa de Pedra. A cidade também é rica em cultura, com seu casario colonial e igrejas históricas.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Para informações detalhadas, mapas, e agendamento de passeios guiados, visite o Centro de Atendimento ao Turista (CAT) localizado na Praça Central de Martins, ou entre em contato com a Secretaria Municipal de Turismo de Martins.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" asChild><Link href="/services/atracao?city=martins-rn">Ver Atrações Turísticas de Martins</Link></Button>
                <Button variant="outline" asChild><Link href="/services/hotel?city=martins-rn">Encontrar Hospedagem em Martins</Link></Button>
                <Button variant="outline" asChild className="sm:col-span-2">
                    <Link href="https://www.instagram.com/turismomartinsrn" target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-2 h-4 w-4" /> Visite o Instagram Oficial do Turismo de Martins
                    </Link>
                </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
                <strong>Centro de Atendimento ao Turista (CAT) de Martins:</strong> Praça Central, S/N - Aberto diariamente das 09:00 às 17:00 (Horário exemplo).
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-accent">
              <CalendarDays className="mr-3 h-7 w-7" />
              Eventos Municipais de Martins e Parceiros ({currentYear})
            </CardTitle>
            <CardDescription>Agenda de eventos e festividades em Martins. Conteúdo atualizado regularmente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
              <Image
                src="https://placehold.co/800x450.png"
                alt="Eventos em Martins, RN"
                layout="fill"
                objectFit="cover"
                data-ai-hint="Martins RN festival event"
              />
            </div>
            <Alert variant="default" className="bg-purple-500/10 border-purple-500/30 mb-4">
                <Bell className="h-5 w-5 text-purple-600" />
                <AlertTitle className="text-purple-700">Membros VIP São Notificados Primeiro!</AlertTitle>
                <AlertDescription>
                    Nossos membros <Link href="/vip-area" className="font-semibold underline hover:text-purple-700/80">Serrano VIP</Link> recebem notificações prioritárias e detalhes exclusivos sobre estes e outros eventos da cidade de Martins e de parceiros. <Link href="/settings" className="font-semibold underline hover:text-purple-700/80">Gerencie suas preferências</Link>.
                </AlertDescription>
            </Alert>
             <Alert variant="default" className="bg-muted/50 border-muted">
                <RefreshCw className="h-4 w-4 text-muted-foreground"/>
                <AlertDescription className="text-xs text-muted-foreground pl-1">
                    Esta seção é atualizada com informações provenientes dos canais oficiais da prefeitura de Martins. (Funcionalidade de sincronização automática requer integração de backend).
                </AlertDescription>
            </Alert>
            <Alert variant="default" className="bg-secondary/20 border-secondary">
                <CalendarDays className="h-5 w-5 text-secondary-foreground"/>
                <AlertTitle className="text-secondary-foreground">Festival Gastronômico da Serra de Martins</AlertTitle>
                <AlertDescription>
                    Sabores e tradições se encontram no principal evento culinário de Martins. Data: [Mês do Festival], {currentYear}. Local: Praça Central de Martins. Em breve mais informações!
                </AlertDescription>
            </Alert>
            <Alert>
                <Users className="h-5 w-5"/>
                <AlertTitle>Festa do Padroeiro de Martins</AlertTitle>
                <AlertDescription>
                    Celebrações religiosas, shows e quermesse em homenagem ao padroeiro da cidade de Martins. Data: [Mês da Festa], {currentYear}.
                </AlertDescription>
            </Alert>
             <Alert variant="default" className="bg-accent/10 border-accent/30">
                <Info className="h-5 w-5 text-accent"/>
                <AlertTitle className="text-accent">Feira de Artesanato Local de Martins</AlertTitle>
                <AlertDescription>
                    Exposição e venda de produtos artesanais de Martins e região. Todo primeiro domingo do mês, na Feira Coberta de Martins.
                </AlertDescription>
            </Alert>
            <div className="text-center mt-6">
                <Button variant="link" className="text-primary" asChild>
                  <Link href="https://www.martins.rn.gov.br/eventos" target="_blank" rel="noopener noreferrer">
                    Ver Calendário Completo de Eventos de Martins
                  </Link>
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-accent">
              <Newspaper className="mr-3 h-7 w-7" />
              Notícias da Administração Pública de Martins ({currentYear})
            </CardTitle>
            <CardDescription>Fique por dentro das últimas novidades e comunicados da prefeitura de Martins. Informações sincronizadas com fontes oficiais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
              <Image
                src="https://placehold.co/800x450.png"
                alt="Notícias de Martins, RN"
                layout="fill"
                objectFit="cover"
                data-ai-hint="Martins RN city hall news"
              />
            </div>
            <Alert variant="default" className="bg-purple-500/10 border-purple-500/30 mb-4">
                <Bell className="h-5 w-5 text-purple-600" />
                <AlertTitle className="text-purple-700">Membros VIP Informados!</AlertTitle>
                <AlertDescription>
                    Membros <Link href="/vip-area" className="font-semibold underline hover:text-purple-700/80">Serrano VIP</Link> podem receber atualizações importantes e consolidadas da cidade de Martins de forma prioritária.
                </AlertDescription>
            </Alert>
            <Alert variant="default" className="bg-muted/50 border-muted">
                <RefreshCw className="h-4 w-4 text-muted-foreground"/>
                <AlertDescription className="text-xs text-muted-foreground pl-1">
                    Esta seção é atualizada com informações provenientes dos canais oficiais da prefeitura de Martins. (Funcionalidade de sincronização automática requer integração de backend).
                </AlertDescription>
            </Alert>
            <Alert variant="default" className="bg-secondary/20 border-secondary">
              <Newspaper className="h-5 w-5 text-secondary-foreground" />
              <AlertTitle className="text-secondary-foreground">Nova Campanha de Vacinação em Martins</AlertTitle>
              <AlertDescription>
                A Secretaria de Saúde de Martins informa o início da nova campanha de vacinação contra a gripe. Procure o posto de saúde mais próximo em Martins. (Publicado em: DD/MM/{currentYear})
              </AlertDescription>
            </Alert>
            <Alert>
              <Info className="h-5 w-5" />
              <AlertTitle>Recapeamento de Vias no Centro de Martins</AlertTitle>
              <AlertDescription>
                Obras de recapeamento asfáltico serão realizadas nas principais ruas do centro de Martins durante o próximo mês. Pedimos a compreensão de todos. (Publicado em: DD/MM/{currentYear})
              </AlertDescription>
            </Alert>
             <Alert variant="destructive">
              <Info className="h-5 w-5" />
              <AlertTitle>Alerta de Interrupção de Água em Martins</AlertTitle>
              <AlertDescription>
                Informamos que poderá haver interrupção no fornecimento de água no bairro X em Martins na próxima terça-feira para manutenção programada. (Publicado em: DD/MM/{currentYear})
              </AlertDescription>
            </Alert>
            <div className="text-center mt-6">
                <Button variant="link" className="text-primary" asChild>
                  <Link href="https://www.martins.rn.gov.br/noticias" target="_blank" rel="noopener noreferrer">
                    Ver Todas as Notícias de Martins
                  </Link>
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-accent">
              <Briefcase className="mr-3 h-7 w-7" />
              Serviços Públicos Essenciais em Martins
            </CardTitle>
            <CardDescription>Informações úteis sobre os serviços oferecidos pela prefeitura de Martins.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg hover:text-primary">Coleta de Lixo em Martins</AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  A coleta de lixo residencial em Martins ocorre às segundas, quartas e sextas-feiras a partir das 08:00. Colabore com a limpeza da cidade!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg hover:text-primary">Iluminação Pública em Martins</AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  Problemas com a iluminação pública em Martins? Entre em contato com a Secretaria de Obras pelo telefone (84) [Telefone da Sec. Obras] ou registre sua solicitação online no portal da prefeitura de Martins.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg hover:text-primary">Postos de Saúde em Martins</AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  Martins conta com [Número] postos de saúde para atendimento básico. O Posto Central de Martins funciona de segunda a sexta, das 07:00 às 17:00. Para emergências, dirija-se ao Hospital Municipal de Martins.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg hover:text-primary">Informações Turísticas (CAT) de Martins</AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  Visite o Centro de Atendimento ao Turista (CAT) na Praça Central de Martins para mapas, guias e informações sobre atrações e eventos. Aberto diariamente das 09:00 às 17:00 (Horário exemplo).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-accent">
              <Phone className="mr-3 h-7 w-7" />
              Informações de Contato - Prefeitura de Martins
            </CardTitle>
            <CardDescription>Entre em contato com a administração municipal de Martins.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-foreground/90"><strong>Endereço:</strong> [Endereço da Prefeitura de Martins], Centro, Martins - RN, CEP: [CEP de Martins]</p>
            <p className="text-foreground/90"><strong>Telefone Geral:</strong> (84) [Telefone Geral da Prefeitura]</p>
            <p className="text-foreground/90"><strong>Email Geral:</strong> contato@martins.rn.gov.br (exemplo oficial)</p>
            <p className="text-foreground/90"><strong>Horário de Atendimento:</strong> Segunda a Sexta, das 08:00 às 14:00 (Exemplo)</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button variant="default" asChild className="bg-primary hover:bg-primary/90">
                    <Link href="https://www.martins.rn.gov.br" target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" /> Acessar Portal da Prefeitura de Martins
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="https://www.instagram.com/prefeiturademartins" target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-2 h-4 w-4" /> Siga a Prefeitura de Martins no Instagram
                    </Link>
                </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
                Para informações específicas de secretarias (Saúde, Educação, Obras, Turismo, etc.) da Prefeitura de Martins, consulte o portal oficial.
            </p>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}

