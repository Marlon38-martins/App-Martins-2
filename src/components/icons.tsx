"use client";
import type { GramadoBusiness } from '@/services/gramado-businesses';
import {
  UtensilsCrossed,
  BedDouble,
  ShoppingBag,
  Landmark,
  Wrench,
  Coffee,
  Trees,
  TicketPercent,
  Icon as LucideIconComponent, // Generic icon component
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// Re-export type from service if not already global
export type { LucideIconName } from '@/services/gramado-businesses';


interface BusinessIconProps extends LucideProps {
  type: GramadoBusiness['type'] | GramadoBusiness['icon'];
}

const iconMap: Record<string, React.ElementType<LucideProps>> = {
  Restaurante: UtensilsCrossed,
  Hotel: BedDouble,
  Loja: ShoppingBag,
  Atração: Landmark,
  Serviço: Wrench,
  Café: Coffee,
  Parque: Trees,
  Default: TicketPercent,
  // Direct icon names from GramadoBusiness['icon']
  UtensilsCrossed: UtensilsCrossed,
  BedDouble: BedDouble,
  ShoppingBag: ShoppingBag,
  Landmark: Landmark,
  Wrench: Wrench,
  Coffee: Coffee,
  Trees: Trees,
  TicketPercent: TicketPercent,
};

export function BusinessTypeIcon({ type, ...props }: BusinessIconProps) {
  const IconComponent = iconMap[type] || iconMap.Default;
  return <IconComponent {...props} />;
}

// Generic Icon component if you need to render by string name dynamically
export function IconByName({ name, ...props }: { name: string } & LucideProps) {
  const Icon = iconMap[name] || TicketPercent; // Fallback icon
  return <Icon {...props} />;
}
