import type {Metadata} from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
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
} from '@/components/ui/sidebar';
import { HomeIcon, ShoppingCart as ServicesIcon, MountainSnow, MapIcon, UserPlus, LayoutDashboard } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { MockAuthSidebarActions } from '@/components/auth/mock-auth-sidebar-actions';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
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
            <Sidebar collapsible="icon">
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
                    <SidebarMenuButton asChild tooltip={{content: "Parceiros", side:"right"}}>
                      <Link href="/services">
                        <ServicesIcon />
                        <span className="group-data-[collapsible=icon]:hidden">Parceiros</span>
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
                  {/* Static link to Join, login/profile handled by MockAuthSidebarActions */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{content: "Associe-se", side:"right"}}>
                      <Link href="/join">
                        <UserPlus />
                        <span className="group-data-[collapsible=icon]:hidden">Associe-se</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{content: "Administração", side:"right"}}>
                      <Link href="/admin/add-establishment">
                        <LayoutDashboard />
                        <span className="group-data-[collapsible=icon]:hidden">Administração</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <MockAuthSidebarActions />
                  
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>

            <SidebarInset>
              <Header />
              <main className="flex-grow p-4 md:p-6 bg-background">
                {children}
              </main>
              <footer className="bg-background py-4 text-center text-sm text-muted-foreground border-t">
                <div className="px-4">
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
