// src/components/layout/header.tsx
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Globe, HelpCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { toast } = useToast();

  const handleLanguageSelect = (lang: string) => {
    toast({
      title: "Idioma Selecionado (Simulação)",
      description: `Idioma alterado para ${lang}. A página seria recarregada com o novo idioma.`,
    });
    // In a real app: i18n.changeLanguage(lang); router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 px-4 shadow-sm backdrop-blur md:px-6">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Selecionar Idioma">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleLanguageSelect('Português')}>Português</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageSelect('English')}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageSelect('Español')}>Español</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageSelect('Français')}>Français</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Ajuda e FAQ">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/> Ajuda Rápida & FAQ</DialogTitle>
              <DialogDescription>
                Perguntas frequentes sobre o Guia Mais Premium.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Como funciona a assinatura?</h4>
                <p className="text-muted-foreground">Ao assinar, você terá acesso a todos os benefícios Premium, como descontos exclusivos, roteiros e mais, durante o período do seu plano (mensal).</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Posso cancelar quando quiser?</h4>
                <p className="text-muted-foreground">Sim, sua assinatura mensal pode ser cancelada a qualquer momento através do seu painel de configurações. O acesso continua até o fim do período já pago.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">É seguro pagar aqui?</h4>
                <p className="text-muted-foreground">Utilizamos processadores de pagamento seguros e reconhecidos no mercado. Seus dados financeiros não são armazenados em nossos servidores. (Esta é uma simulação)</p>
              </div>
               <div>
                <h4 className="font-semibold mb-1">Como uso os descontos?</h4>
                <p className="text-muted-foreground">Basta apresentar seu card de membro digital (disponível no app após assinar) no estabelecimento parceiro para validar sua oferta.</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => document.dispatchEvent(new Event('closeDialog'))}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
