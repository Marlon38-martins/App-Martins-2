
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
   * The city where the business is located.
   */
  city: string;
  /**
   * The phone number of the business.
   */
  phoneNumber: string;
  /**
   * The website of the business.
   */
  website?: string; // Made optional to reflect reality
  /**
   * The Instagram URL of the business.
   */
  instagramUrl?: string;
  /**
   * The Facebook URL of the business.
   */
  facebookUrl?: string;
  /**
   * The WhatsApp number of the business (international format, e.g., 5584999999999).
   */
  whatsappNumber?: string;
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

// Define a type for LucideIcon names for better type safety if not already global.
export type LucideIconName =
  | 'UtensilsCrossed'
  | 'BedDouble'
  | 'ShoppingBag'
  | 'Landmark'
  | 'Wrench'
  | 'Coffee'
  | 'Trees'
  | 'TicketPercent'
  | 'Beer';


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
  /**
   * Indicates if this offer is exclusive to VIP members.
   */
  isVipOffer?: boolean;
}

const businesses: GramadoBusiness[] = [
  {
    id: '1',
    name: 'Restaurante Mirante da Serra',
    type: 'Restaurante',
    city: 'Martins, RN',
    shortDescription: 'Culinária regional com vista panorâmica.',
    fullDescription: 'Saboreie pratos típicos do sertão potiguar enquanto aprecia uma vista deslumbrante da serra de Martins. Nosso cardápio celebra os ingredientes locais com um toque de sofisticação. Ambiente rústico e acolhedor.',
    address: 'Rua Dr. Abdon Abel, 150, Centro, Martins - RN',
    phoneNumber: '(84) 3391-0001',
    website: 'https://www.mirantedaserramartins.com.br',
    instagramUrl: 'https://www.instagram.com/mirantedaserramartins',
    facebookUrl: 'https://www.facebook.com/mirantedaserramartins',
    whatsappNumber: '5584933910001',
    latitude: -6.0869,
    longitude: -37.9119,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'UtensilsCrossed',
    rating: 4.8,
    reviewCount: 125,
  },
  {
    id: '2',
    name: 'Pousada Aconchego Serrano',
    type: 'Hotel',
    city: 'Martins, RN',
    shortDescription: 'Charme e tranquilidade na serra.',
    fullDescription: 'A Pousada Aconchego Serrano oferece acomodações confortáveis e charmosas, perfeitas para quem busca paz e contato com a natureza. Desfrute de nosso café da manhã regional e da hospitalidade martinense.',
    address: 'Sítio Recanto Verde, Zona Rural, Martins - RN',
    phoneNumber: '(84) 3391-0002',
    website: 'https://www.aconchegoserrano.com.br',
    instagramUrl: 'https://www.instagram.com/aconchegoserrano',
    whatsappNumber: '5584933910002',
    latitude: -6.0900,
    longitude: -37.9150,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'BedDouble',
    rating: 4.5,
    reviewCount: 88,
  },
  {
    id: '3',
    name: 'Loja de Artesanato Mãos da Serra',
    type: 'Loja',
    city: 'Martins, RN',
    shortDescription: 'Artesanato local e lembranças de Martins.',
    fullDescription: 'Descubra a riqueza do artesanato de Martins em nossa loja. Peças em cerâmica, bordados, rendas e doces regionais. Leve um pedacinho da cultura serrana para casa.',
    address: 'Praça Almino Afonso, 50, Centro, Martins - RN',
    phoneNumber: '(84) 3391-0003',
    website: 'https://www.maosdaserrart.com.br',
    instagramUrl: 'https://www.instagram.com/maosdaserraart',
    latitude: -6.0850,
    longitude: -37.9100,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'ShoppingBag',
    rating: 4.2,
    reviewCount: 45,
  },
  {
    id: '4',
    name: 'Trilha da Casa de Pedra',
    type: 'Atração',
    city: 'Martins, RN',
    shortDescription: 'Aventura e história em meio à naturezar.',
    fullDescription: 'Explore a famosa Casa de Pedra em uma trilha ecológica guiada. Conheça as formações rochosas, a fauna e a flora locais, e aprenda sobre as lendas e a história da região. Necessário agendamento.',
    address: 'Ponto de Encontro: Posto de Informações Turísticas, Martins - RN',
    phoneNumber: '(84) 99999-0004',
    website: 'https://www.martinsaventura.com.br/casadepedra',
    whatsappNumber: '5584999990004',
    latitude: -6.0800,
    longitude: -37.9000,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Landmark',
    rating: 4.9,
    reviewCount: 210,
  },
  {
    id: '5',
    name: 'Cafeteria Grão Serrano',
    type: 'Café',
    city: 'Martins, RN',
    shortDescription: 'Cafés especiais e delícias regionais.',
    fullDescription: 'Um refúgio para os amantes de café. Oferecemos grãos selecionados, métodos de preparo variados, bolos caseiros, tapiocas e outras iguarias para acompanhar sua bebida. Ambiente charmoso no coração de Martins.',
    address: 'Rua Coronel Demétrio Lemos, 75, Centro, Martins - RN',
    phoneNumber: '(84) 3391-0005',
    website: 'https://www.graoserrano.com.br',
    instagramUrl: 'https://www.instagram.com/graoserrano',
    latitude: -6.0860,
    longitude: -37.9110,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Coffee',
    rating: 4.7,
    reviewCount: 75,
  },
  {
    id: '6',
    name: 'Mirante do Canto',
    type: 'Parque',
    city: 'Martins, RN',
    shortDescription: 'Vista espetacular do pôr do sol serrano.',
    fullDescription: 'O Mirante do Canto é um dos pontos mais altos de Martins, oferecendo uma vista panorâmica inesquecível, especialmente ao entardecer. Local ideal para contemplação e fotografias.',
    address: 'Acesso pela RN-076, Martins - RN',
    phoneNumber: 'N/A',
    website: 'https://turismo.martins.rn.gov.br/mirantedocanto',
    latitude: -6.0795,
    longitude: -37.9180,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Trees',
    rating: 4.9,
    reviewCount: 150,
  },
  {
    id: '7',
    name: 'Bar Central',
    type: 'Bar',
    city: 'Martins, RN',
    shortDescription: 'O ponto de encontro da cidade.',
    fullDescription: 'Bar tradicional no centro de Martins, com petiscos regionais, cerveja gelada e um ambiente animado. Perfeito para um happy hour ou para encontrar amigos.',
    address: 'Praça Central, 10, Centro, Martins - RN',
    phoneNumber: '(84) 3391-0007',
    website: 'https://www.barcentralmartins.com.br',
    instagramUrl: 'https://www.instagram.com/barcentralmartins',
    facebookUrl: 'https://www.facebook.com/barcentralmartins',
    latitude: -6.0855,
    longitude: -37.9105,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Beer',
    rating: 4.3,
    reviewCount: 60,
  },
  // --- Businesses in "Cidade Vizinha, RN" ---
  {
    id: '8',
    name: 'Hotel Fazenda "Vale Verdejante"',
    type: 'Hotel',
    city: 'Cidade Vizinha, RN',
    shortDescription: 'Natureza e conforto na cidade vizinha.',
    fullDescription: 'Desfrute da tranquilidade do campo com o conforto de um hotel fazenda. Piscina, passeios a cavalo e culinária caseira.',
    address: 'Rodovia CV-010, Km 5, Zona Rural, Cidade Vizinha - RN',
    phoneNumber: '(84) 3392-1010',
    website: 'https://www.valeverdejante.com.br',
    latitude: -6.1500,
    longitude: -37.8500,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'BedDouble',
    rating: 4.6,
    reviewCount: 70,
  },
  {
    id: '9',
    name: 'Restaurante "Sabor da Roça"',
    type: 'Restaurante',
    city: 'Cidade Vizinha, RN',
    shortDescription: 'Comida caseira e fogão a lenha.',
    fullDescription: 'Autêntica comida do interior feita no fogão a lenha, com ingredientes frescos da nossa horta. Venha provar o verdadeiro sabor da roça.',
    address: 'Rua Principal, 200, Centro, Cidade Vizinha - RN',
    phoneNumber: '(84) 3392-1020',
    latitude: -6.1450,
    longitude: -37.8550,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'UtensilsCrossed',
    rating: 4.7,
    reviewCount: 95,
  },
  // --- Businesses in other Northeast states ---
  {
    id: '10',
    name: 'Loja de Souvenirs Pauferrense',
    type: 'Loja',
    city: 'Pau dos Ferros, RN',
    shortDescription: 'Lembranças autênticas do Alto Oeste.',
    fullDescription: 'Encontre o presente perfeito ou uma lembrança especial da sua viagem a Pau dos Ferros. Artesanato, camisetas e produtos regionais.',
    address: 'Av. Independência, 300, Centro, Pau dos Ferros - RN',
    phoneNumber: '(84) 3351-2020',
    latitude: -6.1108,
    longitude: -38.2060,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'ShoppingBag',
    rating: 4.0,
    reviewCount: 30,
  },
  {
    id: '11',
    name: 'Pizzaria Forno a Lenha Apodi',
    type: 'Restaurante',
    city: 'Apodi, RN',
    shortDescription: 'Pizzas artesanais e ambiente familiar.',
    fullDescription: 'Deliciosas pizzas assadas em forno a lenha, com ingredientes frescos e selecionados. Ótimo para reunir a família e amigos.',
    address: 'Rua das Flores, 55, Centro, Apodi - RN',
    phoneNumber: '(84) 3333-4040',
    latitude: -5.6602,
    longitude: -37.9950,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'UtensilsCrossed',
    rating: 4.4,
    reviewCount: 65,
  },
   {
    id: '12',
    name: 'Hotel Portal de Umarizal',
    type: 'Hotel',
    city: 'Umarizal, RN',
    shortDescription: 'Conforto e hospitalidade no coração de Umarizal.',
    fullDescription: 'Oferecemos acomodações modernas e confortáveis para sua estadia em Umarizal, seja a negócios ou lazer. Café da manhã regional incluso.',
    address: 'Praça da Matriz, 120, Centro, Umarizal - RN',
    phoneNumber: '(84) 3397-5050',
    latitude: -5.9870,
    longitude: -37.8200,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'BedDouble',
    rating: 4.1,
    reviewCount: 40,
  },
  // --- Alagoas ---
  {
    id: '13',
    name: 'Barraca Praia de Pajuçara',
    type: 'Restaurante',
    city: 'Maceió, AL',
    shortDescription: 'Frutos do mar frescos na bela Pajuçara.',
    fullDescription: 'Desfrute de deliciosos frutos do mar, petiscos e bebidas geladas com os pés na areia na Praia de Pajuçara. Música ao vivo nos fins de semana.',
    address: 'Av. Dr. Antônio Gouveia, Pajuçara, Maceió - AL',
    phoneNumber: '(82) 99999-0013',
    latitude: -9.6676,
    longitude: -35.7133,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'UtensilsCrossed',
    rating: 4.6,
    reviewCount: 150,
  },
  // --- Bahia ---
  {
    id: '14',
    name: 'Hotel Pelourinho',
    type: 'Hotel',
    city: 'Salvador, BA',
    shortDescription: 'Hospedagem histórica no coração do Pelourinho.',
    fullDescription: 'Viva a história de Salvador hospedando-se em um casarão colonial restaurado no Pelourinho. Próximo aos principais pontos turísticos e culturais.',
    address: 'Largo do Pelourinho, 10, Pelourinho, Salvador - BA',
    phoneNumber: '(71) 3333-0014',
    latitude: -12.9720,
    longitude: -38.5092,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'BedDouble',
    rating: 4.4,
    reviewCount: 110,
  },
  // --- Ceará ---
  {
    id: '15',
    name: 'Beach Park Loja Oficial',
    type: 'Loja',
    city: 'Fortaleza, CE',
    shortDescription: 'Lembranças e moda praia do Beach Park.',
    fullDescription: 'Leve para casa a diversão do Beach Park! Produtos exclusivos, moda praia, brinquedos e muito mais na nossa loja oficial.',
    address: 'Av. Beira Mar, 2500, Meireles, Fortaleza - CE',
    phoneNumber: '(85) 4012-3000',
    latitude: -3.7257,
    longitude: -38.4941,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'ShoppingBag',
    rating: 4.3,
    reviewCount: 60,
  },
  // --- Maranhão ---
  {
    id: '16',
    name: 'Passeio Lençóis Maranhenses',
    type: 'Atração',
    city: 'São Luís, MA',
    shortDescription: 'Excursões para os deslumbrantes Lençóis.',
    fullDescription: 'Descubra a beleza única dos Lençóis Maranhenses com nossos passeios guiados. Saídas de São Luís para Barreirinhas. Consulte roteiros.',
    address: 'Agência Central de Turismo, Centro Histórico, São Luís - MA',
    phoneNumber: '(98) 98888-0016',
    latitude: -2.5307,
    longitude: -44.3068,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Landmark',
    rating: 4.9,
    reviewCount: 300,
  },
  // --- Paraíba ---
  {
    id: '17',
    name: 'Café do Brejo',
    type: 'Café',
    city: 'João Pessoa, PB',
    shortDescription: 'Cafés especiais e quitutes paraibanos.',
    fullDescription: 'Aconchegante café com grãos selecionados da região do Brejo Paraibano. Experimente nossos bolos, tapiocas e o famoso queijo coalho.',
    address: 'Av. Epitácio Pessoa, 1000, Tambaú, João Pessoa - PB',
    phoneNumber: '(83) 3222-0017',
    latitude: -7.1153,
    longitude: -34.8292,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Coffee',
    rating: 4.7,
    reviewCount: 90,
  },
  // --- Pernambuco ---
  {
    id: '18',
    name: 'Parque das Esculturas Francisco Brennand',
    type: 'Parque',
    city: 'Recife, PE',
    shortDescription: 'Arte e natureza no coração de Recife.',
    fullDescription: 'Explore o magnífico Parque das Esculturas de Francisco Brennand, um museu a céu aberto com obras monumentais do artista pernambucano.',
    address: 'Pilar, Recife Antigo, Recife - PE',
    phoneNumber: '(81) 3424-0018', // Placeholder
    latitude: -8.0544,
    longitude: -34.8692,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Trees',
    rating: 4.8,
    reviewCount: 250,
  },
  // --- Piauí ---
  {
    id: '19',
    name: 'Cervejaria Cabeça de Cuia',
    type: 'Bar',
    city: 'Teresina, PI',
    shortDescription: 'Cervejas artesanais e petiscos regionais.',
    fullDescription: 'Prove as autênticas cervejas artesanais do Piauí na Cervejaria Cabeça de Cuia. Ambiente descontraído e cardápio com delícias locais.',
    address: 'Av. Nossa Senhora de Fátima, 1234, Jóquei, Teresina - PI',
    phoneNumber: '(86) 3232-0019',
    latitude: -5.0608,
    longitude: -42.7900,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'Beer',
    rating: 4.5,
    reviewCount: 120,
  },
  // --- Sergipe ---
  {
    id: '20',
    name: 'Orla de Atalaia Restaurante',
    type: 'Restaurante',
    city: 'Aracaju, SE',
    shortDescription: 'Gastronomia diversificada na Orla de Atalaia.',
    fullDescription: 'Ampla variedade de pratos, desde a culinária local até opções internacionais, com vista para a famosa Orla de Atalaia.',
    address: 'Passarela do Caranguejo, Orla de Atalaia, Aracaju - SE',
    phoneNumber: '(79) 3255-0020',
    latitude: -10.9856,
    longitude: -37.0444,
    imageUrl: 'https://placehold.co/600x400.png',
    icon: 'UtensilsCrossed',
    rating: 4.3,
    reviewCount: 180,
  },
];

const deals: Deal[] = [
  {
    id: 'deal-1',
    businessId: '1',
    title: 'Pague 1 Prato Principal, Leve 2',
    description: 'Na compra de um prato principal selecionado, ganhe outro de igual ou menor valor. Válido para membros Guia Mais.',
    discountPercentage: 0,
    isPay1Get2: true,
    usageLimitPerUser: 1,
    termsAndConditions: 'Válido de segunda a quinta, exceto feriados. Necessário apresentar o card digital Guia Mais. Não cumulativo com outras promoções. Consulte pratos selecionados.',
    isVipOffer: false,
  },
  {
    id: 'deal-2',
    businessId: '1',
    title: 'Sobremesa Regional VIP Cortesia',
    description: 'Grupos acima de 4 pessoas VIP ganham uma sobremesa regional especial.',
    discountPercentage: 0,
    termsAndConditions: 'Válido para grupos com 4 ou mais membros Guia Mais VIP. Uma sobremesa por grupo, conforme disponibilidade.',
    isVipOffer: true,
  },
  {
    id: 'deal-3',
    businessId: '2',
    title: 'Pague 2 Diárias, Fique 3',
    description: 'Reserve duas diárias e ganhe a terceira noite como cortesia Guia Mais.',
    isPay1Get2: true,
    usageLimitPerUser: 1,
    termsAndConditions: 'Válido para reservas diretas com a pousada, mediante apresentação do card Guia Mais. Sujeito à disponibilidade. Não válido em alta temporada ou feriados prolongados.',
    isVipOffer: false,
  },
  {
    id: 'deal-4',
    businessId: '3',
    title: '15% OFF em Peças Selecionadas',
    description: 'Desconto de 15% em todas as peças de cerâmica e bordados para membros Guia Mais.',
    discountPercentage: 15,
    termsAndConditions: 'Válido enquanto durarem os estoques. Apresentar card Guia Mais.',
    isVipOffer: false,
  },
  {
    id: 'deal-5',
    businessId: '5',
    title: 'Café VIP em Dobro',
    description: 'Na compra de um café expresso, membros VIP ganham outro. Benefício exclusivo Guia Mais VIP.',
    isPay1Get2: true,
    usageLimitPerUser: 1,
    termsAndConditions: 'Válido de terça a quinta-feira, exceto feriados. Apresentar card Guia Mais VIP. Não cumulativo.',
    isVipOffer: true,
  },
  {
    id: 'deal-6',
    businessId: '2',
    title: 'Early Check-in VIP',
    description: 'Membros Serrano VIP podem solicitar early check-in gratuito (sujeito à disponibilidade).',
    discountPercentage: 0,
    termsAndConditions: 'Exclusivo para membros do plano Serrano VIP. Solicitar no momento da reserva. Sujeito à disponibilidade da pousada.',
    isVipOffer: true,
  },
  {
    id: 'deal-7',
    businessId: '4',
    title: 'Aventura em Grupo com Desconto',
    description: '10% de desconto para grupos de 5 ou mais pessoas na Trilha da Casa de Pedra.',
    discountPercentage: 10,
    termsAndConditions: 'Agendamento prévio obrigatório. Todos os participantes do grupo devem ser membros Guia Mais.',
    isVipOffer: false,
  },
  {
    id: 'deal-8',
    businessId: '7',
    title: 'Rodada Dupla de Caipirinha (Normal)',
    description: 'Peça uma caipirinha e ganhe a segunda por conta da casa. Exclusivo para membros Guia Mais.',
    isPay1Get2: true,
    usageLimitPerUser: 1,
    termsAndConditions: 'Válido às sextas-feiras, das 18h às 20h. Apresentar card Guia Mais.',
    isVipOffer: false,
  },
  {
    id: 'deal-9',
    businessId: '8',
    title: '10% OFF na Diária (Cidade Vizinha)',
    description: 'Membros Guia Mais ganham 10% de desconto na diária em nosso Hotel Fazenda.',
    discountPercentage: 10,
    termsAndConditions: 'Apresentar card Guia Mais. Válido para reservas diretas.',
    isVipOffer: false,
  },
  {
    id: 'deal-10',
    businessId: '9',
    title: 'Suco Natural Cortesia (Cidade Vizinha)',
    description: 'Peça um prato principal e ganhe um suco natural da estação. Exclusivo Guia Mais.',
    discountPercentage: 0,
    termsAndConditions: 'Válido para consumo no local. Apresentar card Guia Mais.',
    isVipOffer: false,
  },
  {
    id: 'deal-11',
    businessId: '10', // Loja de Souvenirs Pauferrense
    title: 'Lembrança Especial Pau dos Ferros - 10% OFF',
    description: 'Leve uma recordação de Pau dos Ferros com 10% de desconto em itens selecionados.',
    discountPercentage: 10,
    termsAndConditions: 'Válido para itens com etiqueta Guia Mais. Apresente o app.',
    isVipOffer: false,
  },
  {
    id: 'deal-12',
    businessId: '11', // Pizzaria Forno a Lenha Apodi
    title: 'Pizza Grande em Dobro - Apodi',
    description: 'Compre uma pizza grande e leve outra de igual ou menor valor. Promoção Guia Mais!',
    isPay1Get2: true,
    usageLimitPerUser: 1,
    termsAndConditions: 'Válido de segunda a quarta, exceto vésperas de feriado. Uso único por membro.',
    isVipOffer: false,
  },
  {
    id: 'deal-13',
    businessId: '12', // Hotel Portal de Umarizal
    title: 'Café da Manhã VIP Umarizal',
    description: 'Hóspedes VIP Guia Mais ganham um item extra especial no café da manhã.',
    discountPercentage: 0,
    termsAndConditions: 'Exclusivo para reservas diretas de membros VIP. Informar no check-in.',
    isVipOffer: true,
  },
  // --- Deals for new Northeast businesses ---
  {
    id: 'deal-14',
    businessId: '13', // Barraca Praia de Pajuçara, Maceió, AL
    title: 'Caipirinha em Dobro na Pajuçara',
    description: 'Compre uma caipirinha e ganhe outra na faixa! Exclusivo Guia Mais.',
    isPay1Get2: true,
    usageLimitPerUser: 1,
    termsAndConditions: 'Válido todos os dias. Apresentar card Guia Mais.',
    isVipOffer: false,
  },
  {
    id: 'deal-15',
    businessId: '14', // Hotel Pelourinho, Salvador, BA
    title: 'Upgrade de Quarto VIP (Salvador)',
    description: 'Membros VIP Guia Mais ganham upgrade de quarto, sujeito à disponibilidade.',
    discountPercentage: 0,
    termsAndConditions: 'Exclusivo para membros VIP. Solicitar no momento da reserva. Sujeito à disponibilidade.',
    isVipOffer: true,
  },
  {
    id: 'deal-16',
    businessId: '15', // Beach Park Loja Oficial, Fortaleza, CE
    title: '20% OFF em Moda Praia (Fortaleza)',
    description: '20% de desconto em toda a linha de moda praia para membros Guia Mais.',
    discountPercentage: 20,
    termsAndConditions: 'Apresentar card Guia Mais. Não cumulativo.',
    isVipOffer: false,
  },
  {
    id: 'deal-17',
    businessId: '17', // Café do Brejo, João Pessoa, PB
    title: 'Bolo do Dia + Café Expresso por R$15',
    description: 'Delicioso combo de fatia de bolo do dia com um café expresso especial.',
    discountPercentage: 0, // This is a combo deal, not a direct percentage off.
    termsAndConditions: 'Válido todos os dias. Apresentar card Guia Mais.',
    isVipOffer: false,
  },
  {
    id: 'deal-18',
    businessId: '19', // Cervejaria Cabeça de Cuia, Teresina, PI
    title: 'Chopp Artesanal VIP em Dobro',
    description: 'Peça um chopp artesanal da casa e o segundo é por nossa conta! Exclusivo VIPs.',
    isPay1Get2: true,
    usageLimitPerUser: 1,
    termsAndConditions: 'Válido às quintas-feiras. Exclusivo para membros VIP Guia Mais.',
    isVipOffer: true,
  },
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
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        mockCurrentUser = JSON.parse(storedUser);
        return mockCurrentUser;
      } catch (e) {
        localStorage.removeItem('mockUser'); // Clear invalid data
        mockCurrentUser = null;
      }
    }
  }
  return null;
}

export async function getMockUserSubscription(userId: string): Promise<Subscription | null> {
  await new Promise(resolve => setTimeout(resolve, 100));

  if (typeof window !== 'undefined') {
      const storedSub = localStorage.getItem('mockSubscription');
      if (storedSub) {
        try {
          const sub = JSON.parse(storedSub) as Subscription;
          // Ensure dates are Date objects
          sub.startDate = new Date(sub.startDate);
          sub.endDate = new Date(sub.endDate);
          if (sub.userId === userId) {
            mockUserSubscription = sub;
            return mockUserSubscription;
          }
        } catch(e) {
           localStorage.removeItem('mockSubscription'); // Clear invalid data
           mockUserSubscription = null;
        }
      }
  }
  return null;
}

export async function checkUserOfferUsage(userId: string, offerId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (!mockCurrentUser || userId !== mockCurrentUser.id) return false;
  
  if (typeof window !== 'undefined') {
    const redemptionsKey = `mockUserRedemptions-${userId}`;
    try {
      const redemptions = JSON.parse(localStorage.getItem(redemptionsKey) || '{}');
      return !!redemptions[offerId];
    } catch (e) {
      localStorage.removeItem(redemptionsKey); // Clear invalid data
      return false;
    }
  }
  return false; // Default if localStorage not available
}

export async function recordUserOfferUsage(userId: string, offerId: string, businessId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
   if (!mockCurrentUser || userId !== mockCurrentUser.id) return;

  if (typeof window !== 'undefined') {
     const redemptionsKey = `mockUserRedemptions-${userId}`;
     try {
        const redemptions = JSON.parse(localStorage.getItem(redemptionsKey) || '{}');
        redemptions[offerId] = true;
        localStorage.setItem(redemptionsKey, JSON.stringify(redemptions));
     } catch (e) {
        localStorage.removeItem(redemptionsKey); // Clear invalid data on error
        const newRedemptions = { [offerId]: true };
        localStorage.setItem(redemptionsKey, JSON.stringify(newRedemptions));
     }
  }
}

export function mockLogin(user: User, subscription: Subscription) {
  mockCurrentUser = user;
  mockUserSubscription = subscription;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('isMockLoggedIn', 'true');
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockSubscription', JSON.stringify(subscription));
    const redemptionsKey = `mockUserRedemptions-${user.id}`;
    localStorage.removeItem(redemptionsKey); // Reset redemptions
    window.dispatchEvent(new CustomEvent('mockAuthChange'));
  }
}

export function mockLogout() {
  if (typeof window !== 'undefined') {
    let userIdToRemoveRedemptions = null;
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        userIdToRemoveRedemptions = JSON.parse(storedUser).id;
      } catch (e) { /* ignore error, just won't remove redemptions by ID */ }
    }

    if (userIdToRemoveRedemptions) {
        localStorage.removeItem(`mockUserRedemptions-${userIdToRemoveRedemptions}`);
    }
    localStorage.removeItem('isMockLoggedIn');
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockSubscription');
  }
  mockCurrentUser = null;
  mockUserSubscription = null;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mockAuthChange'));
  }
}
// --- End Mocked Services ---
