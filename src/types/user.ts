// src/types/user.ts

export interface User {
  id: string;
  email: string | null;
  name?: string | null;
  photoURL?: string | null;
  subscriptionId?: string; // Link to active subscription
  // other user-specific fields
}

export interface PlanFeature {
  text: string;
  available: boolean; // To distinguish features present in different plans
}

export interface Plan {
  id: 'explorador' | 'serrano_vip' | string; // Allow for future plan IDs
  name: string;
  price: string; // For display, e.g., "R$ 19,90/mês"
  priceMonthly?: number;
  priceSemesterly?: number;
  priceAnually?: number;
  features: string[]; // Simple list of feature descriptions
  // For more detailed feature comparison:
  // detailedFeatures?: PlanFeature[]; 
  Icon?: React.ElementType; // Icon component for display
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
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
