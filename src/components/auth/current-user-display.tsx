// src/components/auth/current-user-display.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth-client';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { LogIn, LogOut, UserCircle, UserPlus, Settings, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export function CurrentUserDisplay() {
  const { user, subscription, loading, signOutUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar(); 

  const handleSignOut = async () => {
    try {
      await signOutUser();
      if (isMobile) {
        setOpenMobile(false);
      }
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({ title: 'Erro no Logout', description: 'Não foi possível fazer logout. Tente novamente.', variant: 'destructive' });
    }
  };

  const handleDropdownItemSelect = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (loading) {
    return (
      <SidebarMenuItem> {/* Removed mt-auto to let layout.tsx control bottom alignment */}
        <div className="flex items-center gap-2 p-1.5 w-full group-data-[collapsible=icon]:justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarMenuItem>
    );
  }

  if (user) {
    const userName = user.name || user.email?.split('@')[0] || 'Membro Guia Mais';
    const userInitial = userName.charAt(0).toUpperCase();
    const isVip = subscription?.planId === 'serrano_vip' && subscription?.status === 'active';

    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md p-1.5 text-left text-sm text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-1 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || undefined} alt={userName} data-ai-hint="user avatar" />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <span className="truncate group-data-[collapsible=icon]:hidden">{userName}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56 bg-popover text-popover-foreground ml-2 group-data-[collapsible=icon]:ml-0">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || "Usuário"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onSelect={handleDropdownItemSelect}>
              <Link href="/profile" className="flex items-center cursor-pointer">
                <span className="flex items-center w-full">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Meu Perfil
                </span>
              </Link>
            </DropdownMenuItem>
            {isVip && (
              <DropdownMenuItem asChild onSelect={handleDropdownItemSelect}>
                <Link href="/vip-area" className="flex items-center cursor-pointer text-accent hover:!text-accent-foreground hover:!bg-accent/10">
                  <span className="flex items-center w-full">
                    <Star className="mr-2 h-4 w-4" />
                    Área VIP
                  </span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild onSelect={handleDropdownItemSelect}>
              <Link href="/settings" className="flex items-center cursor-pointer">
                <span className="flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 hover:!bg-red-500/10 hover:!text-red-600 focus:!bg-red-500/10 focus:!text-red-600">
              <span className="flex items-center w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

  // Renders Login and Join buttons if no user is logged in
  return (
    <>
      <SidebarMenuItem className="mt-auto pt-3 border-t border-sidebar-border">
        <SidebarMenuButton asChild tooltip={{ content: "Login", side: "right" }} href="/login">
          <Link href="/login">
            <span className="flex items-center gap-1.5">
              <LogIn />
              <span className="group-data-[collapsible=icon]:hidden">Login</span>
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={{ content: "Associe-se", side: "right" }} href="/join">
          <Link href="/join">
            <span className="flex items-center gap-1.5">
              <UserPlus />
              <span className="group-data-[collapsible=icon]:hidden">Associe-se</span>
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}
