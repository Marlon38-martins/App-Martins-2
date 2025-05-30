
// src/components/layout/client-dropdown-menu-item.tsx
'use client';

import Link from 'next/link';
import { DropdownMenuItem as ShadDropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { BusinessTypeIcon, type LucideIconName } from '@/components/icons'; // Use BusinessTypeIcon for rendering

interface ClientDropdownMenuItemProps {
  href: string;
  iconName: LucideIconName | 'LayoutGrid'; // Accept string name
  label: string;
  itemKey: string;
}

export function ClientDropdownMenuItem({ href, iconName, label, itemKey }: ClientDropdownMenuItemProps) {
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
        {/* Use BusinessTypeIcon which can take string names */}
        <BusinessTypeIcon type={iconName as LucideIconName} className="mr-2 h-3.5 w-3.5" />
        {label}
      </Link>
    </ShadDropdownMenuItem>
  );
}
