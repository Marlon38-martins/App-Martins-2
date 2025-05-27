// src/components/layout/client-dropdown-menu-item.tsx
'use client';

import type { ElementType } from 'react';
import Link from 'next/link';
import { DropdownMenuItem as ShadDropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import type { LucideProps } from 'lucide-react';

interface ClientDropdownMenuItemProps {
  href: string;
  Icon: ElementType<LucideProps>;
  label: string;
  itemKey: string;
}

export function ClientDropdownMenuItem({ href, Icon, label, itemKey }: ClientDropdownMenuItemProps) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleSelect = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    // Navigation will occur via the Link component
  };

  return (
    <ShadDropdownMenuItem key={itemKey} asChild onSelect={handleSelect}>
      <Link href={href} className="flex items-center cursor-pointer text-xs">
        <Icon className="mr-2 h-3.5 w-3.5" />
        {label}
      </Link>
    </ShadDropdownMenuItem>
  );
}
