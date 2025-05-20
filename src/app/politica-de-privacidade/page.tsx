// src/app/politica-de-privacidade/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PoliticaPrivacidadePage() {
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
          <ShieldCheck className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Política de Privacidade
          </h1>
        </div>
        <p className="text-lg text-foreground/80">
          Sua privacidade é importante para nós. Esta política explica como coletamos, usamos e protegemos suas informações.
        </p>
      </section>

      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <h2 className="text-xl font-semibold text-accent">1. Informações que Coletamos</h2>
        <p>
          Podemos coletar informações pessoais que você nos fornece diretamente, como quando você cria uma conta, se inscreve em nossa newsletter ou entra em contato conosco. Essas informações podem incluir seu nome, endereço de e-mail, número de telefone e informações de pagamento.
        </p>
        <p>
          Também podemos coletar informações automaticamente quando você usa nosso Serviço, como seu endereço IP, tipo de dispositivo, sistema operacional, informações de uso e dados de geolocalização (se você nos der permissão).
        </p>

        <h2 className="text-xl font-semibold text-accent">2. Como Usamos Suas Informações</h2>
        <p>
          Usamos as informações que coletamos para:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Fornecer, operar e manter nosso Serviço;</li>
          <li>Melhorar, personalizar e expandir nosso Serviço;</li>
          <li>Entender e analisar como você usa nosso Serviço;</li>
          <li>Desenvolver novos produtos, serviços, recursos e funcionalidades;</li>
          <li>Comunicar com você, diretamente ou através de um de nossos parceiros, incluindo para atendimento ao cliente, para fornecer atualizações e outras informações relacionadas ao Serviço, e para fins de marketing e promocionais;</li>
          <li>Processar suas transações;</li>
          <li>Enviar e-mails;</li>
          <li>Encontrar e prevenir fraudes.</li>
        </ul>

        <h2 className="text-xl font-semibold text-accent">3. Compartilhamento de Informações</h2>
        <p>
          Não compartilhamos suas informações pessoais com terceiros, exceto conforme descrito nesta Política de Privacidade ou com o seu consentimento. Podemos compartilhar informações com:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Provedores de serviços que realizam serviços em nosso nome (por exemplo, processamento de pagamentos, análise de dados).</li>
          <li>Parceiros comerciais com os quais oferecemos produtos ou serviços em conjunto.</li>
          <li>Autoridades legais, se exigido por lei ou para proteger nossos direitos.</li>
        </ul>

        <h2 className="text-xl font-semibold text-accent">4. Segurança dos Dados</h2>
        <p>
          A segurança de seus dados é importante para nós, mas lembre-se que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis para proteger suas Informações Pessoais, não podemos garantir sua segurança absoluta.
        </p>

        <h2 className="text-xl font-semibold text-accent">5. Seus Direitos de Privacidade</h2>
        <p>
          Dependendo da sua localização, você pode ter certos direitos em relação às suas informações pessoais, como o direito de acessar, corrigir ou excluir seus dados. Entre em contato conosco para exercer esses direitos.
        </p>

        <h2 className="text-xl font-semibold text-accent">6. Cookies e Tecnologias de Rastreamento</h2>
        <p>
          Usamos cookies e tecnologias de rastreamento semelhantes para rastrear a atividade em nosso Serviço e manter certas informações. Você pode instruir seu navegador a recusar todos os cookies ou a indicar quando um cookie está sendo enviado.
        </p>
        
        <h2 className="text-xl font-semibold text-accent">7. Alterações a Esta Política de Privacidade</h2>
        <p>
          Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página.
        </p>

        <h2 className="text-xl font-semibold text-accent">8. Contato</h2>
        <p>
          Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco em <Link href="mailto:privacidade@guiamais.com.br" className="text-primary hover:underline">privacidade@guiamais.com.br</Link>.
        </p>
        
        <p className="text-sm text-muted-foreground mt-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
}
