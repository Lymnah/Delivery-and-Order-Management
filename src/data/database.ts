import { addDays, endOfWeek, endOfMonth } from 'date-fns';
import imgCarrefour from '../assets/82264df74cfb0ad9b8b7d222f17c9903ba0ef774.png';
import imgAuchan from '../assets/7fb2f94785e10950b962ede3941d2b615170f658.png';
import imgLeclerc from '../assets/f72a75971070d98086cdb19e75c4fe4c0de8edf3.png';
import imgTapenadeNoire from '../assets/7b3bace636aba0fb32604a1efef4140fb7db3077.png';
import imgTapenadeVerte from '../assets/aeb8c4358018be24093d429390d51278634999d8.png';
import imgHoumous from '../assets/434619f1f07e4da164f7ecb61a856dded404bd25.png';
import imgCaviarAubergine from '../assets/b33ff9fe02b99a84530aff012ca66d0eee689eaa.png';
import imgTapenadeViolette from '../assets/1214629e3bb633d2a325885b8175cfb7c4d8f43f.png';
import imgTzatziki from '../assets/f4b9c2546699f16007b2437a15c440b7f521c550.png';

// Types
export type DocumentType = 'BC' | 'BL';

// Order statuses (BC - Bon de Commande)
export type OrderStatus =
  | 'Brouillon'
  | 'Confirmé'
  | 'Transformé en BL'
  | 'Clos';

// Delivery note statuses (BL - Bon de Livraison)
export type DeliveryNoteStatus =
  | 'À préparer'
  | 'En préparation'
  | 'Prêt à expédier'
  | 'Expédié'
  | 'Livré'
  | 'Facturé';

export interface Product {
  id: string;
  name: string;
  stock: number;
  stockMin: number;
  stockMax: number;
  lots: number;
  imageUrl?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  number: string;
  type: DocumentType;
  client: string;
  deliveryDate: Date;
  items: OrderItem[];
  createdAt: Date;
  totalHT: number;
  status?: OrderStatus | DeliveryNoteStatus; // Status depends on order type
}

// Delivery preparation types
export interface ScannedLot {
  productId: string;
  lotNumber: string;
  quantity: number;
  scannedAt: Date;
}

export interface DeliveryPreparation {
  orderId: string;
  status: DeliveryNoteStatus;
  scannedLots: ScannedLot[];
  preparedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  invoicedAt?: Date;
}

// Fonction pour obtenir la date actuelle (minuit)
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Date de référence calculée au chargement du module
const INITIAL_NOW = getToday();

// Products database
export const products: Product[] = [
  {
    id: '1',
    name: 'Tapenade Noire',
    stock: 250,
    stockMin: 100,
    stockMax: 500,
    lots: 3,
    imageUrl: imgTapenadeNoire,
  },
  {
    id: '2',
    name: 'Tapenade Verte',
    stock: 320,
    stockMin: 100,
    stockMax: 500,
    lots: 4,
    imageUrl: imgTapenadeVerte,
  },
  {
    id: '3',
    name: 'Houmous Original',
    stock: 450,
    stockMin: 100,
    stockMax: 500,
    lots: 6,
    imageUrl: imgHoumous,
  },
  {
    id: '4',
    name: "Caviar d'Aubergine",
    stock: 180,
    stockMin: 100,
    stockMax: 500,
    lots: 2,
    imageUrl: imgCaviarAubergine,
  },
  {
    id: '5',
    name: 'Tapenade Violette',
    stock: 80,
    stockMin: 100,
    stockMax: 500,
    lots: 1,
    imageUrl: imgTapenadeViolette,
  },
  {
    id: '6',
    name: 'Tzatziki',
    stock: 60,
    stockMin: 100,
    stockMax: 500,
    lots: 1,
    imageUrl: imgTzatziki,
  },
];

// Orders database
export const orders: Order[] = [
  // ===== 1 COMMANDE AUJOURD'HUI =====
  {
    id: '1',
    number: 'BC-2025-001',
    type: 'BC',
    client: 'Carrefour',
    deliveryDate: INITIAL_NOW, // Aujourd'hui
    createdAt: addDays(INITIAL_NOW, -5),
    items: [
      { productId: '1', quantity: 100 },
      { productId: '2', quantity: 150 },
      { productId: '3', quantity: 200 },
    ],
    totalHT: 1500,
  },

  // ===== 4 AUTRES COMMANDES CETTE SEMAINE (total 5 avec celle d'aujourd'hui) =====
  {
    id: '2',
    number: 'BL-2025-045',
    type: 'BL',
    client: 'Auchan',
    deliveryDate: addDays(INITIAL_NOW, 1), // Demain
    createdAt: addDays(INITIAL_NOW, -2),
    items: [
      { productId: '1', quantity: 80 },
      { productId: '2', quantity: 120 },
      { productId: '4', quantity: 1000 },
    ],
    totalHT: 2000,
  },
  {
    id: '3',
    number: 'BC-2025-002',
    type: 'BC',
    client: 'Leclerc',
    deliveryDate: addDays(INITIAL_NOW, 2), // Dans 2 jours
    createdAt: INITIAL_NOW,
    items: [
      { productId: '2', quantity: 100 },
      { productId: '4', quantity: 70 },
      { productId: '5', quantity: 130 },
    ],
    totalHT: 1800,
  },
  {
    id: '4',
    number: 'BC-2025-003',
    type: 'BC',
    client: 'Auchan',
    deliveryDate: addDays(INITIAL_NOW, 3), // Dans 3 jours
    createdAt: addDays(INITIAL_NOW, -3),
    items: [
      { productId: '1', quantity: 120 },
      { productId: '3', quantity: 160 },
      { productId: '6', quantity: 80 },
    ],
    totalHT: 2200,
  },
  {
    id: '5',
    number: 'BC-2025-004',
    type: 'BC',
    client: 'Carrefour',
    deliveryDate: addDays(INITIAL_NOW, 5), // Dans 5 jours
    createdAt: addDays(INITIAL_NOW, -1),
    items: [
      { productId: '2', quantity: 90 },
      { productId: '4', quantity: 110 },
      { productId: '5', quantity: 75 },
    ],
    totalHT: 1950,
  },

  // ===== 10 AUTRES COMMANDES DANS LE MOIS (total 15 avec celles de cette semaine) =====
  {
    id: '6',
    number: 'BC-2025-005',
    type: 'BC',
    client: 'Leclerc',
    deliveryDate: addDays(INITIAL_NOW, 8), // Dans 8 jours
    createdAt: addDays(INITIAL_NOW, -4),
    items: [
      { productId: '1', quantity: 95 },
      { productId: '3', quantity: 140 },
      { productId: '6', quantity: 60 },
    ],
    totalHT: 1750,
  },
  {
    id: '7',
    number: 'BC-2025-006',
    type: 'BC',
    client: 'Auchan',
    deliveryDate: addDays(INITIAL_NOW, 10), // Dans 10 jours
    createdAt: addDays(INITIAL_NOW, -2),
    items: [
      { productId: '2', quantity: 110 },
      { productId: '4', quantity: 85 },
      { productId: '5', quantity: 120 },
    ],
    totalHT: 2100,
  },
  {
    id: '8',
    number: 'BL-2025-046',
    type: 'BL',
    client: 'Carrefour',
    deliveryDate: addDays(INITIAL_NOW, 12), // Dans 12 jours
    createdAt: addDays(INITIAL_NOW, -6),
    items: [
      { productId: '1', quantity: 130 },
      { productId: '2', quantity: 100 },
      { productId: '3', quantity: 175 },
    ],
    totalHT: 2450,
  },
  {
    id: '9',
    number: 'BL-2025-047',
    type: 'BL',
    client: 'Leclerc',
    deliveryDate: addDays(INITIAL_NOW, 15), // Dans 15 jours
    createdAt: addDays(INITIAL_NOW, -3),
    items: [
      { productId: '3', quantity: 200 },
      { productId: '4', quantity: 75 },
      { productId: '6', quantity: 50 },
    ],
    totalHT: 1900,
  },
  {
    id: '10',
    number: 'BC-2025-007',
    type: 'BC',
    client: 'Carrefour',
    deliveryDate: addDays(INITIAL_NOW, 18), // Dans 18 jours
    createdAt: addDays(INITIAL_NOW, -1),
    items: [
      { productId: '1', quantity: 150 },
      { productId: '3', quantity: 200 },
      { productId: '4', quantity: 100 },
    ],
    totalHT: 2500,
  },
  {
    id: '11',
    number: 'BL-2025-048',
    type: 'BL',
    client: 'Auchan',
    deliveryDate: addDays(INITIAL_NOW, 20), // Dans 20 jours
    createdAt: INITIAL_NOW,
    items: [
      { productId: '2', quantity: 120 },
      { productId: '5', quantity: 100 },
      { productId: '6', quantity: 80 },
    ],
    totalHT: 1800,
  },
  {
    id: '12',
    number: 'BC-2025-008',
    type: 'BC',
    client: 'Leclerc',
    deliveryDate: addDays(INITIAL_NOW, 22), // Dans 22 jours
    createdAt: addDays(INITIAL_NOW, -2),
    items: [
      { productId: '1', quantity: 110 },
      { productId: '2', quantity: 95 },
      { productId: '4', quantity: 85 },
    ],
    totalHT: 1950,
  },
  {
    id: '13',
    number: 'BC-2025-009',
    type: 'BC',
    client: 'Carrefour',
    deliveryDate: addDays(INITIAL_NOW, 25), // Dans 25 jours
    createdAt: addDays(INITIAL_NOW, -4),
    items: [
      { productId: '3', quantity: 180 },
      { productId: '5', quantity: 90 },
      { productId: '6', quantity: 70 },
    ],
    totalHT: 2100,
  },
  {
    id: '14',
    number: 'BL-2025-049',
    type: 'BL',
    client: 'Auchan',
    deliveryDate: addDays(INITIAL_NOW, 27), // Dans 27 jours
    createdAt: addDays(INITIAL_NOW, -3),
    items: [
      { productId: '1', quantity: 140 },
      { productId: '2', quantity: 105 },
      { productId: '3', quantity: 190 },
    ],
    totalHT: 2300,
  },
  {
    id: '15',
    number: 'BC-2025-010',
    type: 'BC',
    client: 'Leclerc',
    deliveryDate: addDays(INITIAL_NOW, 29), // Dans 29 jours (fin du mois)
    createdAt: addDays(INITIAL_NOW, -1),
    items: [
      { productId: '4', quantity: 100 },
      { productId: '5', quantity: 110 },
      { productId: '6', quantity: 75 },
    ],
    totalHT: 2000,
  },

  // ===== Commandes futures (après le mois) pour avoir un échantillon complet =====
  {
    id: '16',
    number: 'BC-2025-011',
    type: 'BC',
    client: 'Carrefour',
    deliveryDate: new Date(2026, 1, 15), // 15 février 2026
    createdAt: addDays(INITIAL_NOW, -2),
    items: [
      { productId: '1', quantity: 160 },
      { productId: '3', quantity: 220 },
    ],
    totalHT: 2600,
  },
  {
    id: '17',
    number: 'BL-2025-050',
    type: 'BL',
    client: 'Auchan',
    deliveryDate: new Date(2026, 2, 10), // 10 mars 2026
    createdAt: addDays(INITIAL_NOW, -6),
    items: [
      { productId: '2', quantity: 125 },
      { productId: '5', quantity: 105 },
    ],
    totalHT: 1900,
  },
];

// Client logos mapping
export const clientLogos: Record<string, string> = {
  Carrefour: imgCarrefour,
  Auchan: imgAuchan,
  Leclerc: imgLeclerc,
};

// Delivery preparation mock data
// In a real app, this would be stored in a database
export const deliveryPreparations: Map<string, DeliveryPreparation> = new Map();

// Helper function to get or create delivery preparation for an order
export const getDeliveryPreparation = (
  orderId: string
): DeliveryPreparation => {
  if (!deliveryPreparations.has(orderId)) {
    // Initialize with "À préparer" status for new orders
    const order = orders.find((o) => o.id === orderId);
    deliveryPreparations.set(orderId, {
      orderId,
      status: order?.type === 'BL' ? 'À préparer' : 'À préparer',
      scannedLots: [],
    });
  }
  return deliveryPreparations.get(orderId)!;
};

// Helper function to update delivery preparation
export const updateDeliveryPreparation = (
  orderId: string,
  updates: Partial<DeliveryPreparation>
): void => {
  const current = getDeliveryPreparation(orderId);
  deliveryPreparations.set(orderId, { ...current, ...updates });
};

// Helper function to reset lots for a specific product in all orders
export const resetProductLots = (productId: string): void => {
  deliveryPreparations.forEach((prep, orderId) => {
    const filteredLots = prep.scannedLots.filter(
      (lot) => lot.productId !== productId
    );
    if (filteredLots.length !== prep.scannedLots.length) {
      deliveryPreparations.set(orderId, {
        ...prep,
        scannedLots: filteredLots,
        // Reset status to "À préparer" if no lots remain
        status:
          filteredLots.length === 0
            ? 'À préparer'
            : prep.status === 'Prêt à expédier'
            ? 'En préparation'
            : prep.status,
      });
    }
  });
};
