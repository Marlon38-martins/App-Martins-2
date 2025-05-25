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
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'; // Import useSidebar
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

export function DynamicPartnerLink() {
  const { user, isAdmin, loading } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar(); // Get sidebar context

  const handleDropdownItemSelect = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-1.5 w-full group-data-[collapsible=icon]:justify-center">
        <Skeleton className="h-7 w-7 rounded-sm" />
        <Skeleton className="h-4 w-20 group-data-[collapsible=icon]:hidden" />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={{content: "Admin Geral", side:"right"}} className="w-full" href="#"> {/* href="#" to make it behave like a button for active state */}
             <span className="flex items-center gap-1.5">
                <LayoutDashboard />
                <span className="group-data-[collapsible=icon]:hidden">
                Admin Geral
                </span>
            </span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="w-56 bg-popover text-popover-foreground ml-2 group-data-[collapsible=icon]:ml-0"
        >
          <DropdownMenuItem asChild onSelect={handleDropdownItemSelect}>
            <Link href="/admin/list-all-partners" className="flex items-center cursor-pointer">
              <Users className="mr-2 h-4 w-4" />
              Listar Todos os Parceiros
            </Link>
          </DropdownMenuItem>
          {/* Add more admin links here if needed */}
          <DropdownMenuItem asChild onSelect={handleDropdownItemSelect}>
            <Link href="/admin/add-establishment" className="flex items-center cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Novo Estabelecimento
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (user && user.email === 'partner@example.com') {
    return (
      <SidebarMenuButton asChild tooltip={{content: "Painel do Parceiro", side:"right"}} href="/partner/panel">
        <Link href="/partner/panel">
            <span className="flex items-center gap-1.5">
                <Briefcase />
                <span className="group-data-[collapsible=icon]:hidden">Painel do Parceiro</span>
            </span>
        </Link>
      </SidebarMenuButton>
    );
  }

  return null; // Don't render anything if not admin or partner
}
