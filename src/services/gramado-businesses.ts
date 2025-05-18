import type { LucideIcon } from 'lucide-react';
import type { User, Subscription } from '@/types/user'; // Placeholder for actual user/subscription types

/**
 * Represents a business in Martins.
 */
export interface GramadoBusiness {
  /**
   * The ID of the business.
   */
  id: string;
  /**
   * The name of the business.
   */
  name: string;
  /**
   * The type of business (e.g., restaurant, hotel, shop).
   */
  type: string;
  /**
   * A short description of the business.
   */
  shortDescription: string;
  /**
   * A detailed description of the business.
   */
  fullDescription: string;
  /**
   * The address of the business.
   */
  address: string;
  /**
   * The phone number of the business.
   */
  phoneNumber: string;
  /**
   * The website of the business.
   */
  website: string;
  /**
   * The latitude of the business.
   */
  latitude: number;
  /**
   * The longitude of the business.
   */
  longitude: number;
  /**
   * URL for the business's image.
   */
  imageUrl: string;
  /**
   * Optional icon name for the business type.
   */
  icon?: LucideIconName;
  /**
   * Average rating of the business (0-5).
   */
  rating?: number;
  /**
   * Number of reviews for the business.
   */
  reviewCount?: number;
}

// Define a type for LucideIcon names for better type safety if needed elsewhere.
export type LucideIconName =
  | 'UtensilsCrossed'
  | 'BedDouble'
  | 'ShoppingBag'
  | 'Landmark'
  | 'Wrench'
  | 'Coffee'
  | 'Trees'
  | 'TicketPercent'
  | 'Beer'; // Added Beer


/**
 * Represents a deal or discount offered by a business.
 */
export interface Deal {
  /**
   * The ID of the deal.
   */
  id: string;
  /**
   * The ID of the business offering the deal.
   */
  businessId: string;
  /**
   * A description of the deal.
   */
  description: string;
  /**
   * The discount percentage. Can be 0 if it's a "buy one get one" or other type of offer.
   */
  discountPercentage?: number; // Optional, as P1G2 might not have a percentage
  /**
   * The terms and conditions of the deal.
   */
  termsAndConditions: string;
  /**
   * A short, catchy title for the deal.
   */
  title: string;
  /**
   * Indicates if this is a "Pague 1 Leve 2" style offer.
   */
  isPay1Get2?: boolean;
  /**
   * How many times a single user can redeem this offer. Defaults to 1 for P1G2.
   */
  usageLimitPerUser?: number;
}

const businesses: GramadoBusiness[] = [
  {
    id: '1',
    name: 'Restaurante Mirante da Serra',
    type: 'Restaurante',
    shortDescription: 'Culinária regional com vista panorâmica.',
    fullDescription: 'Saboreie pratos típicos do sertão potiguar enquanto aprecia uma vista deslumbrante da serra de Martins. Nosso cardápio celebra os ingredientes locais com um toque de sofisticação. Ambiente rústico e acolhedor.',
    address: 'Rua Dr. Abdon Abel, 150, Centro, Martins - RN',
    phoneNumber: '(84) 3391-0001',
    website: 'www.mirantedaserramartins.com.br',
    latitude: -6.0869, // Approximate latitude for Martins
    longitude: -37.9119, // Approximate longitude for Martins
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'UtensilsCrossed',
    rating: 4.8,
    reviewCount: 125,
  },
  {
    id: '2',
    name: 'Pousada Aconchego Serrano',
    type: 'Hotel', // Type can remain Hotel for Pousada
    shortDescription: 'Charme e tranquilidade na serra.',
    fullDescription: 'A Pousada Aconchego Serrano oferece acomodações confortáveis e charmosas, perfeitas para quem busca paz e contato com a natureza. Desfrute de nosso café da manhã regional e da hospitalidade martinense.',
    address: 'Sítio Recanto Verde, Zona Rural, Martins - RN',
    phoneNumber: '(84) 3391-0002',
    website: 'www.aconchegoserrano.com.br',
    latitude: -6.0900, // Approximate latitude
    longitude: -37.9150, // Approximate longitude
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'BedDouble',
    rating: 4.5,
    reviewCount: 88,
  },
  {
    id: '3',
    name: 'Loja de Artesanato Mãos da Serra',
    type: 'Loja',
    shortDescription: 'Artesanato local e lembranças de Martins.',
    fullDescription: 'Descubra a riqueza do artesanato de Martins em nossa loja. Peças em cerâmica, bordados, rendas e doces regionais. Leve um pedacinho da cultura serrana para casa.',
    address: 'Praça Almino Afonso, 50, Centro, Martins - RN',
    phoneNumber: '(84) 3391-0003',
    website: 'www.maosdaserrart.com.br',
    latitude: -6.0850, // Approximate latitude
    longitude: -37.9100, // Approximate longitude
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'ShoppingBag',
    rating: 4.2,
    reviewCount: 45,
  },
  {
    id: '4',
    name: 'Trilha da Casa de Pedra',
    type: 'Atração',
    shortDescription: 'Aventura e história em meio à naturezar.',
    fullDescription: 'Explore a famosa Casa de Pedra em uma trilha ecológica guiada. Conheça as formações rochosas, a fauna e a flora locais, e aprenda sobre as lendas e a história da região. Necessário agendamento.',
    address: 'Ponto de Encontro: Posto de Informações Turísticas, Martins - RN',
    phoneNumber: '(84) 99999-0004',
    website: 'www.martinsaventura.com.br/casadepedra',
    latitude: -6.0800, // Approximate latitude (Casa de Pedra is a bit outside)
    longitude: -37.9000, // Approximate longitude
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Landmark',
    rating: 4.9,
    reviewCount: 210,
  },
  {
    id: '5',
    name: 'Cafeteria Grão Serrano',
    type: 'Café',
    shortDescription: 'Cafés especiais e delícias regionais.',
    fullDescription: 'Um refúgio para os amantes de café. Oferecemos grãos selecionados, métodos de preparo variados, bolos caseiros, tapiocas e outras iguarias para acompanhar sua bebida. Ambiente charmoso no coração de Martins.',
    address: 'Rua Coronel Demétrio Lemos, 75, Centro, Martins - RN',
    phoneNumber: '(84) 3391-0005',
    website: 'www.graoserrano.com.br',
    latitude: -6.0860, // Approximate latitude
    longitude: -37.9110, // Approximate longitude
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Coffee',
    rating: 4.7,
    reviewCount: 75,
  },
  {
    id: '6',
    name: 'Mirante do Canto',
    type: 'Parque', // Considered a scenic viewpoint/park area
    shortDescription: 'Vista espetacular do pôr do sol serrano.',
    fullDescription: 'O Mirante do Canto é um dos pontos mais altos de Martins, oferecendo uma vista panorâmica inesquecível, especialmente ao entardecer. Local ideal para contemplação e fotografias.',
    address: 'Acesso pela RN-076, Martins - RN',
    phoneNumber: 'N/A', // Often public access without a direct phone
    website: 'turismo.martins.rn.gov.br/mirantedocanto',
    latitude: -6.0795, // Approximate latitude
    longitude: -37.9180, // Approximate longitude
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Trees',
    rating: 4.9,
    reviewCount: 150,
  },
  {
    id: '7',
    name: 'Bar Central',
    type: 'Bar',
    shortDescription: 'O ponto de encontro da cidade.',
    fullDescription: 'Bar tradicional no centro de Martins, com petiscos regionais, cerveja gelada e um ambiente animado. Perfeito para um happy hour ou para encontrar amigos.',
    address: 'Praça Central, 10, Centro, Martins - RN',
    phoneNumber: '(84) 3391-0007',
    website: 'www.barcentralmartins.com.br',
    latitude: -6.0855,
    longitude: -37.9105,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Beer',
    rating: 4.3,
    reviewCount: 60,
  }
];

const deals: Deal[] = [
  {
    id: 'deal-1',
    businessId: '1', // Restaurante Mirante da Serra
    title: 'Pague 1 Prato Principal, Leve 2',
    description: 'Na compra de um prato principal selecionado, ganhe outro de igual ou menor valor. Válido para membros Prime.',
    discountPercentage: 0, // Not a direct discount, but P1G2
    isPay1Get2: true,
    usageLimitPerUser: 1,
    termsAndConditions: 'Válido de segunda a quinta, exceto feriados. Necessário apresentar o card digital Martins Prime. Não cumulativo com outras promoções. Consulte pratos selecionados.',
  },
  {
    id: 'deal-2',
    businessId: '1', // Restaurante Mirante da Serra
    title: 'Sobremesa Regional Cortesia',
    description: 'Grupos acima de 4 pessoas ganham uma sobremesa regional especial.',
    discountPercentage: 0,
    termsAndConditions: 'Válido para grupos com 4 ou mais membros Prime. Uma sobremesa por grupo, conforme disponibilidade.',
  },
  {
    id: 'deal-3',
    businessId: '2', // Pousada Aconchego Serrano
    title: 'Pague 2 Diárias, Fique 3',
    description: 'Reserve duas diárias e ganhe a terceira noite como cortesia Martins Prime.',
    isPay1Get2: true, // Conceptually similar, pay X get Y
    usageLimitPerUser: 1,
    termsAndConditions: 'Válido para reservas diretas com a pousada, mediante apresentação do card Martins Prime. Sujeito à disponibilidade. Não válido em alta temporada ou feriados prolongados.',
  },
  {
    id: 'deal-4',
    businessId: '3', // Loja de Artesanato Mãos da Serra
    title: '15% OFF em Peças Selecionadas',
    description: 'Desconto de 15% em todas as peças de cerâmica e bordados para membros Prime.',
    discountPercentage: 15,
    termsAndConditions: 'Válido enquanto durarem os estoques. Apresentar card Martins Prime.',
  },
  {
    id: 'deal-5',
    businessId: '5', // Cafeteria Grão Serrano
    title: 'Café em Dobro Prime',
    description: 'Na compra de um café expresso, ganhe outro. Benefício exclusivo Martins Prime.',
    isPay1Get2: true,
    usageLimitPerUser: 1, // Example: can use this specific P1G2 offer once
    termsAndConditions: 'Válido de terça a quinta-feira, exceto feriados. Apresentar card Martins Prime. Não cumulativo.',
  },
  {
    id: 'deal-6',
    businessId: '2', // Pousada Aconchego Serrano
    title: 'Early Check-in VIP',
    description: 'Membros Serrano VIP podem solicitar early check-in gratuito (sujeito à disponibilidade).',
    discountPercentage: 0,
    termsAndConditions: 'Exclusivo para membros do plano Serrano VIP. Solicitar no momento da reserva. Sujeito à disponibilidade da pousada.',
  },
  {
    id: 'deal-7',
    businessId: '4', // Trilha da Casa de Pedra
    title: 'Aventura em Grupo com Desconto',
    description: '10% de desconto para grupos de 5 ou mais pessoas na Trilha da Casa de Pedra.',
    discountPercentage: 10,
    termsAndConditions: 'Agendamento prévio obrigatório. Todos os participantes do grupo devem ser membros Martins Prime.',
  },
  {
    id: 'deal-8',
    businessId: '7', // Bar Central
    title: 'Rodada Dupla de Caipirinha',
    description: 'Peça uma caipirinha e ganhe a segunda por conta da casa. Exclusivo para membros Martins Prime.',
    isPay1Get2: true,
    usageLimitPerUser: 1,
    termsAndConditions: 'Válido às sextas-feiras, das 18h às 20h. Apresentar card Martins Prime.',
  }
];

/**
 * Asynchronously retrieves a list of businesses in Martins.
 *
 * @returns A promise that resolves to an array of GramadoBusiness objects.
 */
export async function getGramadoBusinesses(): Promise<GramadoBusiness[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return businesses;
}

/**
 * Asynchronously retrieves a specific business by its ID.
 *
 * @param id The ID of the business to retrieve.
 * @returns A promise that resolves to a GramadoBusiness object, or undefined if not found.
 */
export async function getGramadoBusinessById(id: string): Promise<GramadoBusiness | undefined> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return businesses.find(business => business.id === id);
}

/**
 * Asynchronously retrieves a list of deals for a given business.
 *
 * @param businessId The ID of the business to retrieve deals for.
 * @returns A promise that resolves to an array of Deal objects.
 */
export async function getDealsForBusiness(businessId: string): Promise<Deal[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return deals.filter(deal => deal.businessId === businessId);
}

/**
 * Asynchronously retrieves all deals.
 * @returns A promise that resolves to an array of all Deal objects.
 */
export async function getAllDeals(): Promise<Deal[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return deals;
}


// --- Mocked User, Subscription, and Redemption Services ---
// In a real app, these would interact with Firebase or your backend.

const MOCK_USER_ID = 'mock-user-123';
let mockUserRedemptions: { [offerId: string]: boolean } = {};
let mockCurrentUser: User | null = null;
let mockUserSubscription: Subscription | null = null;


export async function getCurrentUser(): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  // Simulate fetching the current logged-in user.
  // In a real app, this would use Firebase Auth or your auth provider.
  // For now, return a mock user if 'loggedIn'
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      mockCurrentUser = JSON.parse(storedUser);
      return mockCurrentUser;
    }
    // Fallback to old logic if no user in localStorage, for compatibility with existing login flow
    if (localStorage.getItem('isMockLoggedIn') === 'true' && !mockCurrentUser) {
        mockCurrentUser = {
            id: MOCK_USER_ID,
            email: 'membro.prime@example.com',
            name: 'Membro Prime Teste',
            photoURL: `https://placehold.co/100x100.png`
        };
        localStorage.setItem('mockUser', JSON.stringify(mockCurrentUser));
        return mockCurrentUser;
    }
  }
  return null;
}

export async function getMockUserSubscription(userId: string): Promise<Subscription | null> {
  await new Promise(resolve => setTimeout(resolve, 100));

  if (typeof window !== 'undefined') {
      const storedSub = localStorage.getItem('mockSubscription');
      if (storedSub) {
          const sub = JSON.parse(storedSub) as Subscription;
          // Ensure dates are Date objects
          sub.startDate = new Date(sub.startDate);
          sub.endDate = new Date(sub.endDate);
          if (sub.userId === userId) {
            mockUserSubscription = sub;
            return mockUserSubscription;
          }
      }
  }
  
  // Fallback for initial mock or if not matching stored user
  if (userId === MOCK_USER_ID && typeof window !== 'undefined' && localStorage.getItem('isMockLoggedIn') === 'true' && !mockUserSubscription) {
    const defaultSub = {
        id: 'sub-vip-123',
        userId: MOCK_USER_ID,
        planId: 'serrano_vip', // Matches a plan ID from join/page.tsx
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // ~11 months from now
        status: 'active' as 'active',
    };
    localStorage.setItem('mockSubscription', JSON.stringify(defaultSub));
    mockUserSubscription = defaultSub;
    return mockUserSubscription;
  }
  return null;
}

export async function checkUserOfferUsage(userId: string, offerId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (userId !== mockCurrentUser?.id) return false; 
  
  if (typeof window !== 'undefined') {
    const redemptions = JSON.parse(localStorage.getItem(`mockUserRedemptions-${userId}`) || '{}');
    return !!redemptions[offerId];
  }
  return false; // Default if localStorage not available
}

export async function recordUserOfferUsage(userId: string, offerId: string, businessId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
   if (userId !== mockCurrentUser?.id) return;

  if (typeof window !== 'undefined') {
    const redemptions = JSON.parse(localStorage.getItem(`mockUserRedemptions-${userId}`) || '{}');
    redemptions[offerId] = true;
    localStorage.setItem(`mockUserRedemptions-${userId}`, JSON.stringify(redemptions));
  }
}

// Helper for mocking login/logout in UI (development only)
export function mockLogin(user: User, subscription: Subscription) {
  mockCurrentUser = user;
  mockUserSubscription = subscription;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('isMockLoggedIn', 'true'); // Keep for general login state if needed
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockSubscription', JSON.stringify(subscription));
    localStorage.removeItem(`mockUserRedemptions-${user.id}`); // Reset redemptions
    // Dispatch event to notify other parts of the app (like AuthProviderClient)
    window.dispatchEvent(new CustomEvent('mockAuthChange'));
  }
}

export function mockLogout() {
  mockCurrentUser = null;
  mockUserSubscription = null;
  if (typeof window !== 'undefined') {
    const userId = JSON.parse(localStorage.getItem('mockUser') || '{}').id;
    if (userId) {
        localStorage.removeItem(`mockUserRedemptions-${userId}`);
    }
    localStorage.removeItem('isMockLoggedIn');
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockSubscription');
    window.dispatchEvent(new CustomEvent('mockAuthChange'));
  }
}
// --- End Mocked Services ---
