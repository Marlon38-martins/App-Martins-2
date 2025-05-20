// src/app/termos/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermosPage() {
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
          <FileText className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Termos de Uso
          </h1>
        </div>
        <p className="text-lg text-foreground/80">
          Bem-vindo aos Termos de Uso do Guia Mais. Ao utilizar nossos serviços, você concorda com os seguintes termos.
        </p>
      </section>

      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <h2 className="text-xl font-semibold text-accent">1. Aceitação dos Termos</h2>
        <p>
          Ao acessar ou usar o aplicativo Guia Mais ("Serviço"), você concorda em estar vinculado por estes Termos de Uso ("Termos"). Se você não concordar com qualquer parte dos termos, então você não poderá acessar o Serviço.
        </p>

        <h2 className="text-xl font-semibold text-accent">2. Uso do Serviço</h2>
        <p>
          O Guia Mais concede a você uma licença limitada, não exclusiva, intransferível e revogável para usar o Serviço para seu uso pessoal e não comercial, sujeito a estes Termos. Você concorda em não usar o Serviço para qualquer finalidade ilegal ou proibida por estes Termos.
        </p>
        <p>
          Restrições: Você não pode modificar, copiar, distribuir, transmitir, exibir, executar, reproduzir, publicar, licenciar, criar trabalhos derivados, transferir ou vender qualquer informação, software, produtos ou serviços obtidos do Serviço.
        </p>

        <h2 className="text-xl font-semibold text-accent">3. Contas de Usuário</h2>
        <p>
          Para acessar certos recursos do Serviço, você pode ser obrigado a criar uma conta. Você é responsável por manter a confidencialidade de sua senha e conta e é totalmente responsável por todas as atividades que ocorram sob sua senha ou conta.
        </p>

        <h2 className="text-xl font-semibold text-accent">4. Assinaturas Premium</h2>
        <p>
          Alguns recursos do Serviço podem estar disponíveis apenas para usuários com uma assinatura paga ("Assinatura Premium"). Os termos específicos de sua Assinatura Premium, incluindo preço, duração e benefícios, serão apresentados a você no momento da compra.
        </p>
        <p>
          Pagamentos são processados através de provedores de pagamento terceirizados. Os cancelamentos e reembolsos estão sujeitos às políticas desses provedores e às leis aplicáveis.
        </p>

        <h2 className="text-xl font-semibold text-accent">5. Conteúdo do Usuário e Parceiros</h2>
        <p>
          O Serviço pode permitir que você e outros usuários/parceiros postem, vinculem, armazenem, compartilhem e disponibilizem certas informações, textos, gráficos, vídeos ou outros materiais ("Conteúdo"). Você é responsável pelo Conteúdo que você posta no ou através do Serviço.
        </p>
        <p>
          O Guia Mais não se responsabiliza pela precisão, legalidade ou adequação do conteúdo fornecido por parceiros ou outros terceiros. As ofertas e promoções são de responsabilidade exclusiva dos estabelecimentos parceiros.
        </p>

        <h2 className="text-xl font-semibold text-accent">6. Limitação de Responsabilidade</h2>
        <p>
          Em nenhuma circunstância o Guia Mais, nem seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis, resultantes de (i) seu acesso ou uso ou incapacidade de acessar ou usar o Serviço; (ii) qualquer conduta ou conteúdo de terceiros no Serviço; (iii) qualquer conteúdo obtido do Serviço; e (iv) acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo, seja com base em garantia, contrato, delito (incluindo negligência) ou qualquer outra teoria legal, quer tenhamos sido informados ou não da possibilidade de tais danos.
        </p>
        
        <h2 className="text-xl font-semibold text-accent">7. Modificações nos Termos</h2>
        <p>
          Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor. O que constitui uma alteração material será determinado a nosso exclusivo critério.
        </p>

        <h2 className="text-xl font-semibold text-accent">8. Contato</h2>
        <p>
          Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em <Link href="mailto:contato@guiamais.com.br" className="text-primary hover:underline">contato@guiamais.com.br</Link>.
        </p>
        
        <p className="text-sm text-muted-foreground mt-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
}
