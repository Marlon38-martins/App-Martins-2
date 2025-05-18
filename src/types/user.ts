// src/types/user.ts
import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  email: string | null;
  name?: string | null;
  photoURL?: string | null;
  subscriptionId?: string; // Link to active subscription
  // other user-specific fields
}

// Updated PlanFeature to accept IconComponent
export interface PlanFeature {
  text: string;
  IconComp: LucideIcon; 
}

export interface Plan {
  id: 'premium_mensal' | string; // Simplified to one premium plan for now
  name: string;
  price: string; // For display, e.g., "R$ 19,90/mês"
  priceMonthly?: number;
  features: PlanFeature[]; // Array of PlanFeature objects
  Icon?: React.ElementType; // Icon component for display for the plan itself
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string; // Will be 'premium_mensal'
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled' | 'pending_payment';
  // paymentDetails, etc.
}

export interface Redemption {
  id: string;
  userId: string;
  offerId: string;
  businessId: string;
  redeemedAt: Date;
  // any other details about the redemption, e.g., staff who validated
}
