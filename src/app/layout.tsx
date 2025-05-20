
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
  MapIcon, 
  UserPlus, 
  LayoutDashboard,
  UtensilsCrossed,
  BedDouble,
  ShoppingBag,
  Coffee,
  Beer,
  Landmark as AttractionIcon, 
  Trees,
  LayoutGrid,
  Info,
  Briefcase, 
  Tag, 
  Search as SearchIcon,
  Users // For "Listar Todos os Parceiros"
} from 'lucide-react'; 
import { Header } from '@/components/layout/header';
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
import { PartnerPanelDropdown } from '@/components/layout/partner-panel-dropdown';


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
  { name: 'Comércio', slug: slugify('Loja'), Icon: ShoppingBag },
  { name: 'Lazer', slug: slugify('Atração'), Icon: AttractionIcon },
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
              <SidebarHeader className="p-4">
                <Link href="/" className="flex items-center gap-2">
                  <MountainSnow className="h-7 w-7 text-sidebar-primary" />
                  <span className="text-xl font-bold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                    Guia Mais
                  </span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {/* Main Navigation Items */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{content: "Início", side:"right"}}>
                      <Link href="/">
                        <HomeIcon />
                        <span className="group-data-[collapsible=icon]:hidden">Início</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton tooltip={{content: "Parceiros & Categorias", side:"right"}} className="w-full">
                          <ServicesIcon />
                          <span className="group-data-[collapsible=icon]:hidden">Parceiros</span>
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
                              <category.Icon className="mr-2 h-4 w-4" />
                              {category.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/services" className="flex items-center cursor-pointer">
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            Ver Todas as Categorias
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                    <SidebarMenuButton asChild tooltip={{content: "Buscar", side:"right"}}>
                      <Link href="/search">
                        <SearchIcon />
                        <span className="group-data-[collapsible=icon]:hidden">Buscar</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{content: "Institucional", side:"right"}}>
                      <Link href="/institutional">
                        <Info />
                        <span className="group-data-[collapsible=icon]:hidden">Institucional</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* User Authentication Section - Renders login/join or profile */}
                  <CurrentUserDisplay />
                  
                  {/* Partner Section - This will now be pushed to the very bottom, separated by a line */}
                  <SidebarMenuItem className="mt-auto pt-4 border-t border-sidebar-border">
                    <PartnerPanelDropdown />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{content: "Seja Parceiro", side:"right"}}>
                      <Link href="/partner-registration">
                        <Briefcase />
                        <span className="group-data-[collapsible=icon]:hidden">Seja Parceiro</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>

            <SidebarInset>
              <Header />
              <main className="flex-grow p-4 md:p-6 bg-background overflow-x-hidden">
                {children}
              </main>
              <footer className="bg-background py-4 text-center text-sm text-muted-foreground border-t">
                <div className="px-4">
                  © {new Date().getFullYear()} Guia Mais. Todos os direitos reservados.
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
