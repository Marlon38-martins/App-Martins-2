import type { LucideIcon } from 'lucide-react';

/**
 * Represents a business in Gramado.
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
   * The discount percentage.
   */
  discountPercentage: number;
  /**
   * The terms and conditions of the deal.
   */
  termsAndConditions: string;
}

const businesses: GramadoBusiness[] = [
  {
    id: '1',
    name: 'Restaurante Sabor da Serra',
    type: 'Restaurante',
    shortDescription: 'Culinária tradicional gaúcha em ambiente acolhedor.',
    fullDescription: 'Desfrute do autêntico sabor da serra gaúcha em nosso restaurante. Com pratos preparados com ingredientes frescos e locais, oferecemos uma experiência gastronômica única. Ambiente familiar e serviço atencioso.',
    address: 'Rua Borges de Medeiros, 2020',
    phoneNumber: '(54) 3286-0001',
    website: 'www.sabordaserra.com.br',
    latitude: -29.3787,
    longitude: -50.8742,
    imageUrl: 'https://picsum.photos/seed/sabor/600/400',
    icon: 'UtensilsCrossed',
  },
  {
    id: '2',
    name: 'Hotel Vista Bela',
    type: 'Hotel',
    shortDescription: 'Conforto e elegância com vistas deslumbrantes.',
    fullDescription: 'O Hotel Vista Bela oferece acomodações luxuosas com vistas panorâmicas para as montanhas de Gramado. Ideal para casais e famílias, contamos com piscina aquecida, spa e café da manhã colonial.',
    address: 'Av. das Hortênsias, 1500',
    phoneNumber: '(54) 3286-0002',
    website: 'www.hotelvistabela.com.br',
    latitude: -29.3737,
    longitude: -50.8705,
    imageUrl: 'https://picsum.photos/seed/vista/600/400',
    icon: 'BedDouble',
  },
  {
    id: '3',
    name: 'Loja Artesanato Local',
    type: 'Loja',
    shortDescription: 'Lembranças e presentes artesanais da região.',
    fullDescription: 'Encontre peças únicas de artesanato local, produzidas por artistas da Serra Gaúcha. De roupas de lã a chocolates caseiros, nossa loja é o lugar perfeito para encontrar um presente especial.',
    address: 'Rua Torta, 10',
    phoneNumber: '(54) 3286-0003',
    website: 'www.artesanatolocalgramado.com.br',
    latitude: -29.3755,
    longitude: -50.8760,
    imageUrl: 'https://picsum.photos/seed/artesanato/600/400',
    icon: 'ShoppingBag',
  },
  {
    id: '4',
    name: 'Tour Linha Bella',
    type: 'Atração',
    shortDescription: 'Passeio panorâmico pelas paisagens do interior.',
    fullDescription: 'Descubra as belezas do interior de Gramado com o Tour Linha Bella. Um passeio que combina paisagens deslumbrantes, cultura local e degustação de produtos coloniais. Perfeito para toda a família.',
    address: 'Saída da Praça das Etnias',
    phoneNumber: '(54) 99999-0004',
    website: 'www.tourlinhabella.com.br',
    latitude: -29.3769,
    longitude: -50.8788,
    imageUrl: 'https://picsum.photos/seed/tour/600/400',
    icon: 'Landmark',
  },
  {
    id: '5',
    name: 'Café Colonial da Vovó',
    type: 'Café',
    shortDescription: 'Delícias caseiras em um farto café colonial.',
    fullDescription: 'Experimente o verdadeiro café colonial da Serra Gaúcha. Bolos, pães, geleias, queijos, salames e muitas outras delícias caseiras, preparadas com carinho e tradição. Um banquete para os sentidos.',
    address: 'Estrada do Caracol, Km 2',
    phoneNumber: '(54) 3286-0005',
    website: 'www.cafedavovo.com.br',
    latitude: -29.3511,
    longitude: -50.8600,
    imageUrl: 'https://picsum.photos/seed/cafe/600/400',
    icon: 'Coffee',
  },
  {
    id: '6',
    name: 'Parque do Lago Negro',
    type: 'Parque',
    shortDescription: 'Pedalinhos, natureza e tranquilidade.',
    fullDescription: 'Um dos cartões postais de Gramado, o Lago Negro encanta com suas águas escuras, pedalinhos em formato de cisne e uma exuberante vegetação. Ideal para um passeio relaxante e fotos incríveis.',
    address: 'R. A. J. Renner',
    phoneNumber: '(54) 3286-0006',
    website: 'www.gramado.rs.gov.br/lagonegro',
    latitude: -29.3690,
    longitude: -50.8800,
    imageUrl: 'https://picsum.photos/seed/lago/600/400',
    icon: 'Trees',
  }
];

const deals: Deal[] = [
  {
    id: '1',
    businessId: '1',
    description: '15% de desconto no rodízio de galeto aos fins de semana.',
    discountPercentage: 15,
    termsAndConditions: 'Válido aos sábados e domingos, para mesas com até 4 pessoas. Necessário apresentar o card do clube.',
  },
  {
    id: '2',
    businessId: '1',
    description: 'Sobremesa cortesia para aniversariantes.',
    discountPercentage: 0, // It's a courtesy, not a direct percentage off the bill total.
    termsAndConditions: 'Válido no dia do aniversário, mediante apresentação de documento. Uma sobremesa selecionada por aniversariante.',
  },
  {
    id: '3',
    businessId: '2',
    description: '10% de desconto na diária em baixa temporada.',
    discountPercentage: 10,
    termsAndConditions: 'Válido de março a junho, exceto feriados. Reserva antecipada obrigatória.',
  },
  {
    id: '4',
    businessId: '3',
    description: 'Ganhe um chaveiro exclusivo em compras acima de R$100.',
    discountPercentage: 0, 
    termsAndConditions: 'Válido enquanto durarem os estoques. Um chaveiro por CPF.',
  },
  {
    id: '5',
    businessId: '5',
    description: '20% de desconto no café colonial de segunda a quinta.',
    discountPercentage: 20,
    termsAndConditions: 'Válido de segunda a quinta-feira, exceto feriados. Não cumulativo com outras promoções.',
  }
];

/**
 * Asynchronously retrieves a list of businesses in Gramado.
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
