// src/components/auth/current-user-display.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth-client';
import { signOut } from '@/lib/firebase/auth';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LogIn, LogOut, UserCircle, UserPlus, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '../ui/button';
import { Skeleton } from '@/components/ui/skeleton';


export function CurrentUserDisplay() {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // User state will update via onAuthStateChanged in AuthProviderClient
  };

  if (loading) {
    return (
      <>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 p-2 w-full">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarMenuItem>
      </>
    );
  }

  if (user) {
    const userName = user.name || user.email?.split('@')[0] || 'Membro Prime';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
      <>
        <SidebarMenuItem className="mt-auto pt-4 border-t border-sidebar-border">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-10">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL || undefined} alt={userName} />
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
                    <DropdownMenuItem asChild>
                         <Link href="/profile" className="flex items-center">
                            <UserCircle className="mr-2 h-4 w-4" />
                            Meu Perfil
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Configurações
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 hover:!bg-red-500/10 hover:!text-red-600 focus:!bg-red-500/10 focus:!text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
      </>
    );
  }

  return (
    <>
      <SidebarMenuItem className="mt-auto pt-4 border-t border-sidebar-border">
        <SidebarMenuButton asChild tooltip={{content: "Login", side:"right"}}>
          <Link href="/login">
            <LogIn />
            <span className="group-data-[collapsible=icon]:hidden">Login</span>
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
    </>
  );
}

// Placeholder pages for profile and settings
export function ProfilePagePlaceholder() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
            <p>Esta é a página do perfil. Conteúdo a ser adicionado.</p>
        </div>
    );
}

export function SettingsPagePlaceholder() {
     return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p>Esta é a página de configurações. Conteúdo a ser adicionado.</p>
        </div>
    );
}

// You would create actual pages for these routes:
// src/app/profile/page.tsx
// src/app/settings/page.tsx
