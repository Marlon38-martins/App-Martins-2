'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
// PanelLeft is the default icon for SidebarTrigger.

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 px-4 shadow-sm backdrop-blur md:px-6">
      <SidebarTrigger />
      {/* The rest of the header is kept minimal for an app-like feel. */}
      {/* Page titles can be part of the page content itself or added here if desired. */}
      {/* User-specific actions (e.g., profile, logout) could also be added here on the right. */}
    </header>
  );
}
