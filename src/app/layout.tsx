import type {Metadata} from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import for Geist
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  // SidebarFooter, // Optional
} from '@/components/ui/sidebar';
import { HomeIcon, ShoppingCart as ServicesIcon, MountainSnow, MapIcon, UserPlus } from 'lucide-react';
import { Header } from '@/components/layout/header';

const geistSans = Geist({ // Corrected instantiation
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Corrected instantiation
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Martins Prime',
  description: 'Seu clube de vantagens em Martins, RN!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider defaultOpen={true}>
          <Sidebar collapsible="icon"> {/* Collapses to icons on desktop, off-canvas on mobile */}
            <SidebarHeader className="p-4">
              <Link href="/" className="flex items-center gap-2">
                <MountainSnow className="h-7 w-7 text-sidebar-primary" />
                <span className="text-xl font-bold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  Martins Prime
                </span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{content: "Início", side:"right"}}>
                    <Link href="/">
                      <HomeIcon />
                      <span className="group-data-[collapsible=icon]:hidden">Início</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{content: "Serviços", side:"right"}}>
                    <Link href="/services">
                      <ServicesIcon />
                      <span className="group-data-[collapsible=icon]:hidden">Serviços</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{content: "Mapa", side:"right"}}>
                    <Link href="/map">
                      <MapIcon />
                      <span className="group-data-[collapsible=icon]:hidden">Mapa</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{content: "Associe-se", side:"right"}}>
                    <Link href="/join">
                      <UserPlus />
                      <span className="group-data-[collapsible=icon]:hidden">Associe-se</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* Example for future user-specific links:
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{content: "Minha Conta", side:"right"}}>
                    <Link href="/account">
                      <UserCircle />
                      <span className="group-data-[collapsible=icon]:hidden">Minha Conta</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{content: "Configurações", side:"right"}}>
                    <Link href="/settings">
                      <Settings />
                      <span className="group-data-[collapsible=icon]:hidden">Configurações</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                */}
              </SidebarMenu>
            </SidebarContent>
            {/* 
            <SidebarFooter className="p-2">
              <p className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                © {new Date().getFullYear()} Martins Prime
              </p>
            </SidebarFooter> 
            */}
          </Sidebar>

          <SidebarInset>
            <Header /> {/* Header now contains the SidebarTrigger */}
            <main className="flex-grow p-4 md:p-6 bg-background"> {/* Added padding to main content */}
              {children}
            </main>
            <footer className="bg-background py-4 text-center text-sm text-muted-foreground border-t">
              <div className="px-4"> {/* Simplified container for footer */}
                © {new Date().getFullYear()} Martins Prime. Todos os direitos reservados.
              </div>
            </footer>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
