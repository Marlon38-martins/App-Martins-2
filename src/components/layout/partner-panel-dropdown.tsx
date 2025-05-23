// src/components/layout/partner-panel-dropdown.tsx
'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth-client';
import {
  Briefcase,
  LayoutDashboard,
  Tag,
  Users,
  UserPlus,
  Edit
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// This component was conceptually renamed to PartnerAdminDirectLink then reverted to DynamicPartnerLink
// It now handles both admin dropdown and a direct partner panel link.
export function DynamicPartnerLink() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-1.5 w-full group-data-[collapsible=icon]:justify-center">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-4 w-20 group-data-[collapsible=icon]:hidden" />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={{content: "Admin Geral", side:"right"}} className="w-full">
            <LayoutDashboard />
            <span className="group-data-[collapsible=icon]:hidden">
              Admin Geral
            </span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="w-56 bg-popover text-popover-foreground ml-2 group-data-[collapsible=icon]:ml-0"
        >
          <DropdownMenuItem asChild>
            <Link href="/admin/list-all-partners" className="flex items-center cursor-pointer">
              <Users className="mr-2 h-4 w-4" />
              Listar Todos os Parceiros
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/manage-deals" className="flex items-center cursor-pointer">
              <Tag className="mr-2 h-4 w-4" />
              Gerenciar Ofertas (Admin)
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/add-establishment" className="flex items-center cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Novo Estabelecimento
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Always show "Painel do Parceiro" link, accessible without login
  return (
    <SidebarMenuButton asChild tooltip={{content: "Painel do Parceiro", side:"right"}}>
      <Link href="/partner/panel">
        <Briefcase />
        <span className="group-data-[collapsible=icon]:hidden">Painel do Parceiro</span>
      </Link>
    </SidebarMenuButton>
  );
}
