
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
  HomeIcon, 
  ShoppingCart as ServicesIcon, 
  MountainSnow, 
  MapIcon as MapIconSidebar, // Renamed to avoid conflict with local MapIcon
  UserPlus, 
  LayoutDashboard,
  UtensilsCrossed,
  BedDouble,
  ShoppingBag,
  Coffee,
  Beer,
  Landmark as AttractionIconSidebar, // Renamed
  Trees,
  LayoutGrid,
  Info,
  Search as SearchIcon,
  Handshake,
  QrCode,
} from 'lucide-react'; 
import { Header } from '@/components/layout/header';
import { QuickNav } from '@/components/layout/quick-nav'; // Added QuickNav import
import { AuthProviderClient } from '@/hooks/use-auth-client'; 
import { AuthStateInitializer } from '@/components/auth/auth-state-initializer';
import { CurrentUserDisplay } from '@/components/auth/current-user-display';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { slugify } from '@/lib/utils';
import { DynamicPartnerLink } from '@/components/layout/partner-panel-dropdown';


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
  { name: 'Lazer', slug: slugify('Atração'), Icon: AttractionIconSidebar },
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
                    <SidebarMenuButton asChild tooltip={{content: "Início", side:"right"}}>
                      <Link href="/">
                        <span className="flex items-center gap-1.5">
                          <HomeIcon />
                          <span className="group-data-[collapsible=icon]:hidden">Início</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton tooltip={{content: "Parceiros & Categorias", side:"right"}} className="w-full">
                           <span className="flex items-center gap-1.5">
                            <ServicesIcon />
                            <span className="group-data-[collapsible=icon]:hidden">Parceiros</span>
                          </span>
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        side="right" 
                        align="start" 
                        className="w-56 bg-popover text-popover-foreground ml-2 group-data-[collapsible=icon]:ml-0"
                      >
                        {categoriesForMenu.map(category => (
                          <DropdownMenuItem key={category.slug} asChild>
                            <Link href={`/services/${category.slug}`} className="flex items-center cursor-pointer">
                              <span className="flex items-center gap-1.5">
                                <category.Icon className="mr-2 h-4 w-4" />
                                {category.name}
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/services" className="flex items-center cursor-pointer">
                             <span className="flex items-center gap-1.5">
                              <LayoutGrid className="mr-2 h-4 w-4" />
                              Ver Todas as Categorias
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{content: "Mapa", side:"right"}}>
                      <Link href="/map">
                        <span className="flex items-center gap-1.5">
                          <MapIconSidebar />
                          <span className="group-data-[collapsible=icon]:hidden">Mapa</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{content: "Buscar", side:"right"}}>
                      <Link href="/search">
                         <span className="flex items-center gap-1.5">
                          <SearchIcon />
                          <span className="group-data-[collapsible=icon]:hidden">Buscar</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{content: "Escanear Cupom", side:"right"}}>
                      <Link href="/scan-offer">
                         <span className="flex items-center gap-1.5">
                          <QrCode />
                          <span className="group-data-[collapsible=icon]:hidden">Escanear Cupom</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{content: "Institucional", side:"right"}}>
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
                    <SidebarMenuButton asChild tooltip={{content: "Seja Parceiro", side:"right"}}>
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
              <QuickNav /> {/* Added QuickNav here */}
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
                    <Link href="/institutional" className="block hover:text-primary transition-colors">Sobre Guia Mais</Link>
                    <Link href="/termos" className="block hover:text-primary transition-colors">Termos de Uso</Link>
                    <Link href="/politica-de-privacidade" className="block hover:text-primary transition-colors">Política de Privacidade</Link>
                  </nav>
                  <nav className="space-y-0.5 md:justify-self-end">
                     <Link href="/partner-registration" className="block hover:text-primary transition-colors">Seja um Parceiro</Link>
                     <Link href="/contact" className="block hover:text-primary transition-colors">Fale Conosco</Link> 
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
