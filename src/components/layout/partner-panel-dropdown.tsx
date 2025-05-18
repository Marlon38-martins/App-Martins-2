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
  UserPlus 
} from 'lucide-react';

export function PartnerPanelDropdown() {
  const { isAdmin } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton tooltip={{content: "Painel do Parceiro / Admin", side:"right"}} className="w-full">
          <Briefcase />
          <span className="group-data-[collapsible=icon]:hidden">
            {isAdmin ? "Admin Geral" : "Painel do Parceiro"}
          </span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        side="right" 
        align="start" 
        className="w-60 bg-popover text-popover-foreground ml-2 group-data-[collapsible=icon]:ml-0"
      >
        {!isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/partner/dashboard" className="flex items-center cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Meu Estabelecimento
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/partner/manage-offers" className="flex items-center cursor-pointer">
                <Tag className="mr-2 h-4 w-4" />
                Gerenciar Minhas Ofertas
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {isAdmin && (
          <>
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
            <DropdownMenuSeparator />
          </>
        )}
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
