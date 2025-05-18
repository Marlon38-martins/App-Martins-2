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
  id: 'premium_mensal' | 'premium_anual' | string; // Allow for specific known IDs and general strings
  name: string;
  price: string; // For display, e.g., "R$ 19,90/mês"
  priceNumeric: number; // Numeric price for calculations or internal use
  billingCycle: 'mensal' | 'anual' | string;
  priceAnnualDisplay?: string; // e.g., "R$ 199,00/ano"
  annualEquivalentMonthlyPrice?: string; // e.g., "(equivale a R$ 16,58/mês)"
  features: PlanFeature[]; // Array of PlanFeature objects
  Icon?: React.ElementType; // Icon component for display for the plan itself
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  highlight?: boolean; // To mark a plan as a best value, for example
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string; // Will be 'premium_mensal' or 'premium_anual'
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
