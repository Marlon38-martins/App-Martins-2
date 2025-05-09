import type { LucideIcon } from 'lucide-react';

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
  | 'TicketPercent';


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
  discountPercentage: number;
  /**
   * The terms and conditions of the deal.
   */
  termsAndConditions: string;
  /**
   * A short, catchy title for the deal.
   */
  title: string;
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
    imageUrl: 'https://picsum.photos/seed/mirante/600/400',
    icon: 'UtensilsCrossed',
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
    imageUrl: 'https://picsum.photos/seed/aconchego/600/400',
    icon: 'BedDouble',
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
    imageUrl: 'https://picsum.photos/seed/maosdaserra/600/400',
    icon: 'ShoppingBag',
  },
  {
    id: '4',
    name: 'Trilha da Casa de Pedra',
    type: 'Atração',
    shortDescription: 'Aventura e história em meio à natureza.',
    fullDescription: 'Explore a famosa Casa de Pedra em uma trilha ecológica guiada. Conheça as formações rochosas, a fauna e a flora locais, e aprenda sobre as lendas e a história da região. Necessário agendamento.',
    address: 'Ponto de Encontro: Posto de Informações Turísticas, Martins - RN',
    phoneNumber: '(84) 99999-0004',
    website: 'www.martinsaventura.com.br/casadepedra',
    latitude: -6.0800, // Approximate latitude (Casa de Pedra is a bit outside)
    longitude: -37.9000, // Approximate longitude
    imageUrl: 'https://picsum.photos/seed/casadepedra/600/400',
    icon: 'Landmark',
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
    imageUrl: 'https://picsum.photos/seed/graoserrano/600/400',
    icon: 'Coffee',
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
    imageUrl: 'https://picsum.photos/seed/mirantedocanto/600/400',
    icon: 'Trees',
  }
];

const deals: Deal[] = [
  {
    id: 'deal-1',
    businessId: '1', // Restaurante Mirante da Serra
    title: 'Jantar Romântico na Serra',
    description: '15% de desconto no prato principal às sextas-feiras para membros Prime.',
    discountPercentage: 15,
    termsAndConditions: 'Válido às sextas-feiras, para consumo no local. Necessário apresentar o card digital Martins Prime.',
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
    title: 'Estadia Prolongada com Desconto',
    description: '10% OFF na diária para estadias de 3 noites ou mais.',
    discountPercentage: 10,
    termsAndConditions: 'Válido para reservas diretas com a pousada, mediante apresentação do card Martins Prime. Sujeito à disponibilidade.',
  },
  {
    id: 'deal-4',
    businessId: '3', // Loja de Artesanato Mãos da Serra
    title: 'Lembrança Especial da Serra',
    description: 'Brinde exclusivo em compras acima de R$100 para membros Martins Prime.',
    discountPercentage: 0, 
    termsAndConditions: 'Válido enquanto durarem os estoques do brinde. Um brinde por CPF/membro.',
  },
  {
    id: 'deal-5',
    businessId: '5', // Cafeteria Grão Serrano
    title: 'Café da Tarde Prime',
    description: 'Combo Café Especial + Bolo Caseiro com 20% OFF (terça a quinta).',
    discountPercentage: 20,
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
