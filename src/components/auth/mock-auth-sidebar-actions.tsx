// src/components/auth/mock-auth-sidebar-actions.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, mockLogout, type User } from '@/services/gramado-businesses';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, UserCircle, UserPlus, Settings, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function MockAuthSidebarActions() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    }
    fetchUser();
     // Listen for custom events if login/logout happens elsewhere, or use a polling mechanism if necessary
     // For simplicity, this example relies on page navigation or re-mounts to update user state.
     // A more robust solution might involve a global state or custom event bus for mock auth changes.
    const handleAuthChange = () => fetchUser();
    window.addEventListener('mockAuthChange', handleAuthChange);
    return () => window.removeEventListener('mockAuthChange', handleAuthChange);
  }, []);

  const handleSignOut = async () => {
    await mockLogout();
    setCurrentUser(null); // Update local state
    toast({ title: 'Logout Realizado', description: 'Você foi desconectado com sucesso.' });
    window.dispatchEvent(new CustomEvent('mockAuthChange')); // Notify other components
    router.push('/login');
  };

  if (loading) {
    return (
      <SidebarMenuItem className="mt-auto pt-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 p-2 w-full group-data-[collapsible=icon]:justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarMenuItem>
    );
  }

  if (currentUser) {
    const userName = currentUser.name || currentUser.email?.split('@')[0] || 'Membro Prime';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
      <SidebarMenuItem className="mt-auto pt-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-10">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.photoURL || undefined} alt={userName} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <span className="truncate group-data-[collapsible=icon]:hidden">{userName}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56 bg-popover text-popover-foreground ml-2 group-data-[collapsible=icon]:ml-0">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.name || "Usuário"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                Meu Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center cursor-pointer">
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
    );
  }

  return (
    <>
      <SidebarMenuItem className="mt-auto pt-4 border-t border-sidebar-border">
        <SidebarMenuButton asChild tooltip={{ content: "Login", side: "right" }}>
          <Link href="/login">
            <LogIn />
            <span className="group-data-[collapsible=icon]:hidden">Login</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={{ content: "Associe-se", side: "right" }}>
          <Link href="/join">
            <UserPlus />
            <span className="group-data-[collapsible=icon]:hidden">Associe-se</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}
