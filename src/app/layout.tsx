
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
import { 
  Home, 
  LayoutGrid, 
  MapIcon as MapIconNav, // Renamed to avoid conflict
  Search,
  QrCode,
  Info,
  ChevronDown, // For dropdown indicator
  UtensilsCrossed,
  BedDouble,
  Beer,
  Coffee,
  ShoppingBag,
  Landmark as AttractionIconNav, // Renamed
  Trees,
  TicketPercent,
  Handshake, // For Seja Parceiro
} from 'lucide-react'; 
import { Header } from '@/components/layout/header';
import { AuthProviderClient } from '@/hooks/use-auth-client'; 
import { AuthStateInitializer } from '@/components/auth/auth-state-initializer';
import { CurrentUserDisplay } from '@/components/auth/current-user-display';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, // Still needed for non-client items if any
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { slugify } from '@/lib/utils';
import { DynamicPartnerLink } from '@/components/layout/partner-panel-dropdown';
import { TopHorizontalNav } from '@/components/layout/top-horizontal-nav';
import { ClientDropdownMenuItem } from '@/components/layout/client-dropdown-menu-item'; // New import


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Guia Mais',
  description: 'Seu clube de vantagens em Martins, RN!',
};

const categoriesForMenu = [
  { name: 'Restaurantes', slug: slugify('Restaurante'), Icon: UtensilsCrossed },
  { name: 'Hospedagem', slug: slugify('Hotel'), Icon: BedDouble },
  { name: 'Bares', slug: slugify('Bar'), Icon: Beer },
  { name: 'Cafés', slug: slugify('Café'), Icon: Coffee },
  { name: 'Lojas', slug: slugify('Comércio'), Icon: ShoppingBag },
  { name: 'Lazer', slug: slugify('Atração'), Icon: AttractionIconNav },
  { name: 'Parques', slug: slugify('Parque'), Icon: Trees },
];


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProviderClient>
          <AuthStateInitializer />
          <SidebarProvider defaultOpen={true}>
            <Sidebar collapsible="icon">
              <SidebarHeader className="p-1.5">
                <Link href="/" className="flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    <MountainSnow className="h-7 w-7 text-sidebar-primary" />
                    <span className="text-xl font-bold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                      Guia Mais
                    </span>
                  </span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/" asChild tooltip={{content: "Início", side:"right"}}>
                      <Link href="/">
                        <span className="flex items-center gap-1.5">
                          <Home />
                          <span className="group-data-[collapsible=icon]:hidden">Início</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={{content: "Parceiros & Categorias", side:"right"}} 
                          className="w-full"
                          // Removed href here if it's just a trigger
                        >
                           <span className="flex items-center gap-1.5">
                            <TicketPercent /> {/* Changed from ServicesIcon to TicketPercent */}
                            <span className="group-data-[collapsible=icon]:hidden">Parceiros</span>
                            <ChevronDown className="ml-auto h-4 w-4 text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden group-data-[state=open]:rotate-180 transition-transform" />
                          </span>
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        side="right" 
                        align="start" 
                        className="w-56 bg-popover text-popover-foreground ml-2 group-data-[collapsible=icon]:ml-0"
                      >
                        {categoriesForMenu.map(category => (
                          <ClientDropdownMenuItem
                            key={category.slug}
                            itemKey={category.slug} // Pass key explicitly if needed by ClientDropdownMenuItem
                            href={`/services/${category.slug}`}
                            Icon={category.Icon}
                            label={category.name}
                          />
                        ))}
                        <DropdownMenuSeparator />
                        <ClientDropdownMenuItem
                            itemKey="all-categories"
                            href="/services"
                            Icon={LayoutGrid}
                            label="Ver Todas as Categorias"
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton href="/map" asChild tooltip={{content: "Mapa", side:"right"}}>
                      <Link href="/map">
                        <span className="flex items-center gap-1.5">
                          <MapIconNav />
                          <span className="group-data-[collapsible=icon]:hidden">Mapa</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton href="/search" asChild tooltip={{content: "Buscar", side:"right"}}>
                      <Link href="/search">
                         <span className="flex items-center gap-1.5">
                          <Search />
                          <span className="group-data-[collapsible=icon]:hidden">Buscar</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton href="/scan-offer" asChild tooltip={{content: "Escanear Cupom", side:"right"}}>
                      <Link href="/scan-offer">
                         <span className="flex items-center gap-1.5">
                          <QrCode />
                          <span className="group-data-[collapsible=icon]:hidden">Escanear Cupom</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton href="/institutional" asChild tooltip={{content: "Institucional", side:"right"}}>
                      <Link href="/institutional">
                        <span className="flex items-center gap-1.5">
                          <Info />
                          <span className="group-data-[collapsible=icon]:hidden">Institucional</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <CurrentUserDisplay /> 
                                    
                  <SidebarMenuItem className="mt-auto pt-3 border-t border-sidebar-border">
                     <DynamicPartnerLink />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/partner-registration" asChild tooltip={{content: "Seja Parceiro", side:"right"}}>
                      <Link href="/partner-registration">
                        <span className="flex items-center gap-1.5">
                          <Handshake />
                          <span className="group-data-[collapsible=icon]:hidden">Seja Parceiro</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>

            <SidebarInset>
              <Header />
              <TopHorizontalNav /> 
              <main className="flex-grow p-4 bg-background overflow-x-hidden w-full">
                <div className="w-full max-w-sm mx-auto"> 
                  {children}
                </div>
              </main>
              <footer className="bg-background py-4 text-sm text-muted-foreground border-t">
                <div className="w-full max-w-sm mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-center md:text-left">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Guia Mais</h4>
                    <p>© {new Date().getFullYear()} Guia Mais. Todos os direitos reservados.</p>
                  </div>
                  <nav className="space-y-0.5 md:justify-self-center">
                    <Link href="/institutional" className="block px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Sobre Guia Mais</Link>
                    <Link href="/termos" className="block px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Termos de Uso</Link>
                    <Link href="/politica-de-privacidade" className="block px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Política de Privacidade</Link>
                  </nav>
                  <nav className="space-y-0.5 md:justify-self-end">
                     <Link href="/partner-registration" className="block px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Seja um Parceiro</Link>
                     <Link href="/contact" className="block px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Fale Conosco</Link> 
                  </nav>
                </div>
              </footer>
            </SidebarInset>
          </SidebarProvider>
        </AuthProviderClient>
        <Toaster />
      </body>
    </html>
  );
}
