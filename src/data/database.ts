import {
  addDays,
  endOfWeek,
  endOfMonth,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { fr } from 'date-fns/locale';
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

// ===== STATUS ENUMS =====
// Sales order statuses (BC - Bon de Commande)
export type SalesOrderStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'IN_PREPARATION'
  | 'PARTIALLY_SHIPPED'
  | 'SHIPPED'
  | 'CANCELLED';

// Delivery note statuses (BL - Bon de Livraison)
export type DeliveryNoteStatus =
  | 'IN_PREPARATION'
  | 'PREPARED'
  | 'SHIPPED';

// Dispute status
export type DisputeStatus = 'none' | 'open' | 'in_progress' | 'resolved';

// ===== UNIFIED MASTER LIST TYPES =====
// Lifecycle states for unified order view
export type OrderLifecycle =
  | 'DRAFT'
  | 'TO_PREPARE'
  | 'IN_PREPARATION'
  | 'READY_TO_SHIP'
  | 'SHIPPED';

// Stock status for BC orders
export type StockStatus = 'IN_STOCK' | 'PARTIAL' | 'OUT_OF_STOCK' | 'UNKNOWN';

// Unified order interface for Master List display
export interface UnifiedOrder {
  id: string; // Unique ID for the unified view
  client: string;
  deliveryDate: Date;
  itemsCount: number;
  totalWeight?: number; // Optional weight for BL
  lifecycle: OrderLifecycle;
  stockStatus: StockStatus; // For BC only, UNKNOWN for BL
  progressPercentage?: number; // For BL in preparation (0-100)
  sourceType: 'BC' | 'BL';
  sourceId: string; // salesOrderId or deliveryNoteId
  number: string; // Document number for display
  createdAt: Date;
  // Reference to original data for actions
  originalData: SalesOrder | DeliveryNote;
}

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

// ===== NEW DOCUMENT INTERFACES =====
// Sales Order (BC - Bon de Commande)
export interface SalesOrder {
  salesOrderId: string;
  number: string;
  client: string;
  deliveryDate: Date;
  items: OrderItem[]; // Theoretical lines
  createdAt: Date;
  totalHT: number;
  status: SalesOrderStatus;
  disputeStatus?: DisputeStatus;
}

// Legacy Order interface — kept for compatibility with calendar/list views
export interface Order {
  id: string;
  number: string;
  type: DocumentType;
  client: string;
  deliveryDate: Date;
  items: OrderItem[];
  createdAt: Date;
  totalHT: number;
  status: string;
  disputeStatus?: DisputeStatus;
}

// Empty legacy orders array — kept for compatibility
export const orders: Order[] = [];

// Delivery Note Line
export interface DeliveryNoteLine {
  productId: string;
  quantity: number;
}

// Delivery Note (BL - Bon de Livraison)
export interface DeliveryNote {
  deliveryNoteId: string;
  salesOrderId: string; // Parent BC
  number: string;
  client: string;
  deliveryDate: Date;
  status: DeliveryNoteStatus;
  lines: DeliveryNoteLine[]; // Lines to prepare/deliver
  scannedLots: ScannedLot[]; // Lot traceability
  createdAt: Date;
  startedAt?: Date; // When scanning started
  preparedAt?: Date; // When preparation completed
  shippedAt?: Date; // When shipped
}

// Delivery preparation types
export interface ScannedLot {
  productId: string;
  lotNumber: string;
  quantity: number;
  scannedAt: Date;
}

// Fonction pour obtenir la date actuelle (minuit)
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// ===== INITIAL_NOW REMOVED =====
// INITIAL_NOW was only used for the old `orders` array, which has been removed.
// The new system uses `getToday()` directly in `initializeDemoData()`.

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

// Client logos mapping
export const clientLogos: Record<string, string> = {
  Carrefour: imgCarrefour,
  Auchan: imgAuchan,
  Leclerc: imgLeclerc,
};

// ===== DATA STORES =====
// Sales Orders (BC) - Mutable for demo
export let salesOrders: SalesOrder[] = [];

// Delivery Notes (BL) - Mutable for demo
export let deliveryNotes: DeliveryNote[] = [];

// ===== DEMO DATA INITIALIZATION =====
/**
 * Initialize demo data with fixed initial conditions
 * Called on module load to ensure consistent demo state
 */
function initializeDemoData() {
  const today = getToday();

  // Clear existing data
  salesOrders = [];
  deliveryNotes = [];

  // ===== 3 BC (Sales Orders) for today =====

  // BC 1: Carrefour - CONFIRMED (stock OK)
  const bc1: SalesOrder = {
    salesOrderId: 'BC-DEMO-001',
    number: 'BC-2025-001',
    client: 'Carrefour',
    deliveryDate: today,
    items: [
      { productId: '1', quantity: 100 }, // Tapenade Noire (stock: 250) ✅
      { productId: '2', quantity: 150 }, // Tapenade Verte (stock: 320) ✅
    ],
    createdAt: addDays(today, -5),
    totalHT: 2500,
    status: 'CONFIRMED',
  };

  // BC 2: Auchan - CONFIRMED (stock partiel)
  const bc2: SalesOrder = {
    salesOrderId: 'BC-DEMO-002',
    number: 'BC-2025-002',
    client: 'Auchan',
    deliveryDate: today,
    items: [
      { productId: '4', quantity: 200 }, // Caviar d'Aubergine (stock: 180) ⚠️ PARTIAL
      { productId: '3', quantity: 100 }, // Houmous Original (stock: 450) ✅
    ],
    createdAt: addDays(today, -3),
    totalHT: 3000,
    status: 'CONFIRMED',
  };

  // BC 3: Leclerc - CONFIRMED (stock OK)
  const bc3: SalesOrder = {
    salesOrderId: 'BC-DEMO-003',
    number: 'BC-2025-003',
    client: 'Leclerc',
    deliveryDate: today,
    items: [
      { productId: '1', quantity: 80 }, // Tapenade Noire (stock: 250) ✅
      { productId: '3', quantity: 120 }, // Houmous Original (stock: 450) ✅
    ],
    createdAt: addDays(today, -2),
    totalHT: 2000,
    status: 'CONFIRMED',
  };

  // Tous les BC restent en CONFIRMED pour être visibles
  salesOrders.push(bc1, bc2, bc3);

  // ===== 1 BL en préparation for today =====
  // BL créé à partir de BC4
  const bc4: SalesOrder = {
    salesOrderId: 'BC-DEMO-004',
    number: 'BC-2025-004',
    client: 'Carrefour',
    deliveryDate: today,
    items: [
      { productId: '1', quantity: 50 },
      { productId: '2', quantity: 75 },
    ],
    createdAt: addDays(today, -4),
    totalHT: 1250,
    status: 'IN_PREPARATION',
  };

  const bl_prep: DeliveryNote = {
    deliveryNoteId: 'BL-DEMO-PREP-001',
    salesOrderId: 'BC-DEMO-004',
    number: 'BL-2025-PREP-001',
    client: 'Carrefour',
    deliveryDate: today,
    status: 'IN_PREPARATION',
    lines: [
      { productId: '1', quantity: 50 },
      { productId: '2', quantity: 75 },
    ],
    scannedLots: [
      {
        productId: '1',
        lotNumber: 'LOT-TN-2025-002',
        quantity: 50,
        scannedAt: addDays(today, -1),
      },
      {
        productId: '2',
        lotNumber: 'LOT-TV-2025-002',
        quantity: 45,
        scannedAt: addDays(today, -1),
      },
    ],
    createdAt: addDays(today, -1),
    startedAt: addDays(today, -1),
  };

  salesOrders.push(bc4); // BC4 sera masqué par le BL (déduplication)
  deliveryNotes.push(bl_prep);

  // ===== 1 BL préparé (prêt à expédier) for today =====
  const bc5: SalesOrder = {
    salesOrderId: 'BC-DEMO-005',
    number: 'BC-2025-005',
    client: 'Leclerc',
    deliveryDate: today,
    items: [
      { productId: '3', quantity: 200 },
      { productId: '4', quantity: 50 },
    ],
    createdAt: addDays(today, -6),
    totalHT: 2500,
    status: 'IN_PREPARATION',
  };

  const bl1: DeliveryNote = {
    deliveryNoteId: 'BL-DEMO-001',
    salesOrderId: 'BC-DEMO-005',
    number: 'BL-2025-001',
    client: 'Leclerc',
    deliveryDate: today,
    status: 'PREPARED',
    lines: [
      { productId: '3', quantity: 200 },
      { productId: '4', quantity: 50 },
    ],
    scannedLots: [
      {
        productId: '3',
        lotNumber: 'LOT-HO-2025-002',
        quantity: 200,
        scannedAt: addDays(today, -2),
      },
      {
        productId: '4',
        lotNumber: 'LOT-CA-2025-002',
        quantity: 50,
        scannedAt: addDays(today, -2),
      },
    ],
    createdAt: addDays(today, -2),
    preparedAt: addDays(today, -1),
  };

  salesOrders.push(bc5); // BC5 sera masqué par le BL (déduplication)
  deliveryNotes.push(bl1);

  // ===== Past orders (1 per day for the last 15 days) =====
  // Create SHIPPED or INVOICED orders in the past to test "Voir précédents" functionality
  const pastClients = ['Carrefour', 'Auchan', 'Leclerc'];
  const productsForPastOrders = [
    { productId: '1', quantity: 50 },
    { productId: '2', quantity: 75 },
    { productId: '3', quantity: 100 },
  ];

  for (let i = 1; i <= 15; i++) {
    const pastDate = addDays(today, -i);
    const client = pastClients[i % pastClients.length];
    const orderItems = [
      productsForPastOrders[i % productsForPastOrders.length],
      productsForPastOrders[(i + 1) % productsForPastOrders.length],
    ];

    // Create a BC that was shipped in the past
    const pastBC: SalesOrder = {
      salesOrderId: `BC-PAST-${String(i).padStart(3, '0')}`,
      number: `BC-2025-PAST-${String(i).padStart(3, '0')}`,
      client: client,
      deliveryDate: pastDate,
      items: orderItems,
      createdAt: addDays(pastDate, -Math.floor(Math.random() * 5) - 1),
      totalHT: orderItems.reduce((sum, item) => sum + item.quantity * 10, 0),
      status: 'SHIPPED',
    };

    salesOrders.push(pastBC);

    // Create corresponding BL for shipped orders
    const deliveryNoteLines = orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const pastBL: DeliveryNote = {
      deliveryNoteId: `BL-PAST-${String(i).padStart(3, '0')}`,
      salesOrderId: `BC-PAST-${String(i).padStart(3, '0')}`,
      number: `BL-2025-PAST-${String(i).padStart(3, '0')}`,
      client: client,
      deliveryDate: pastDate,
      status: 'SHIPPED',
      lines: deliveryNoteLines,
      scannedLots: orderItems.map((item) => ({
        productId: item.productId,
        lotNumber: `LOT-PAST-${i}-${item.productId}`,
        quantity: item.quantity,
        scannedAt: addDays(pastDate, -1),
      })),
      createdAt: addDays(pastDate, -1),
      preparedAt: addDays(pastDate, -1),
      shippedAt: pastDate,
    };

    deliveryNotes.push(pastBL);
  }

  // Résultat final dans la Master List :
  // - BC1 (Carrefour) : CONFIRMED → visible comme BC bleu
  // - BC2 (Auchan) : CONFIRMED → visible comme BC bleu
  // - BC3 (Leclerc) : CONFIRMED → visible comme BC bleu
  // - BL-PREP (Carrefour) : remplace BC4 → visible comme BL en préparation orange
  // - BL1 (Leclerc) : remplace BC5 → visible comme BL préparé vert
  // Total : 3 BC + 2 BL = 5 éléments

  // ===== Données de test pour les 6 prochains mois =====
  const clients = ['Carrefour', 'Auchan', 'Leclerc'];

  // Produits avec stocks OK (1, 2, 3)
  const productsInStock = ['1', '2', '3'];
  // Produits avec stocks faibles (4, 5, 6)
  const productsLowStock = ['4', '5', '6'];

  // Stocks disponibles par produit (pour calculer les problèmes de stock)
  const productStocks: Record<string, number> = {
    '1': 250, // Tapenade Noire
    '2': 320, // Tapenade Verte
    '3': 450, // Houmous Original
    '4': 180, // Caviar d'Aubergine (moyen)
    '5': 80, // Tapenade Violette (LOW)
    '6': 60, // Tzatziki (LOW)
  };

  // Générer des commandes pour chaque mois (environ 8-12 commandes par mois)
  for (let monthOffset = 1; monthOffset <= 6; monthOffset++) {
    const monthDate = addDays(today, monthOffset * 30); // Approximativement chaque mois

    // 8-12 commandes par mois
    const ordersPerMonth = 8 + Math.floor(Math.random() * 5);

    for (let i = 0; i < ordersPerMonth; i++) {
      const orderDate = addDays(monthDate, Math.floor(Math.random() * 28)); // Répartir sur le mois
      const client = clients[Math.floor(Math.random() * clients.length)];
      const orderNumber = `BC-2025-${String(monthOffset).padStart(
        2,
        '0'
      )}${String(i + 1).padStart(3, '0')}`;
      const salesOrderId = `BC-MONTH-${monthOffset}-${i + 1}`;

      // Déterminer si cette commande aura des problèmes de stock (20% des cas)
      const hasStockIssue = Math.random() < 0.2;

      // Générer 2-4 produits par commande
      const numProducts = 2 + Math.floor(Math.random() * 3);
      const items: Array<{ productId: string; quantity: number }> = [];
      const usedProducts = new Set<string>();

      for (let j = 0; j < numProducts; j++) {
        let productId: string;
        let quantity: number;

        if (hasStockIssue) {
          // Pour les commandes avec problèmes de stock, utiliser les produits en stock faible
          const availableLowStock = productsLowStock.filter(
            (pid) => !usedProducts.has(pid)
          );

          if (availableLowStock.length > 0) {
            // Utiliser un produit en stock faible
            productId =
              availableLowStock[
                Math.floor(Math.random() * availableLowStock.length)
              ];
            const stock = productStocks[productId];

            // Créer une quantité qui dépasse le stock disponible pour créer un problème
            // 60% de chance d'OUT_OF_STOCK (dépasse complètement), 40% de PARTIAL (dépasse partiellement)
            if (Math.random() < 0.6) {
              // OUT_OF_STOCK : quantité = stock * (1.2 à 2.0)
              quantity = Math.floor(stock * (1.2 + Math.random() * 0.8));
            } else {
              // PARTIAL : quantité = stock * (0.8 à 1.1) - juste au-dessus du stock
              quantity = Math.floor(stock * (0.8 + Math.random() * 0.3));
            }
          } else {
            // Si tous les produits en stock faible sont déjà utilisés, utiliser un produit OK
            const availableInStock = productsInStock.filter(
              (pid) => !usedProducts.has(pid)
            );
            productId =
              availableInStock[
                Math.floor(Math.random() * availableInStock.length)
              ];
            quantity = 50 + Math.floor(Math.random() * 200); // Quantités normales
          }
        } else {
          // Pour les commandes sans problème (80%), utiliser uniquement les produits en stock OK
          const availableInStock = productsInStock.filter(
            (pid) => !usedProducts.has(pid)
          );

          if (availableInStock.length > 0) {
            productId =
              availableInStock[
                Math.floor(Math.random() * availableInStock.length)
              ];
            // Quantités raisonnables qui ne dépassent pas le stock
            const stock = productStocks[productId];
            quantity = Math.floor(stock * (0.1 + Math.random() * 0.4)); // 10-50% du stock
          } else {
            // Fallback si tous les produits OK sont utilisés
            productId =
              productsInStock[
                Math.floor(Math.random() * productsInStock.length)
              ];
            quantity = 50 + Math.floor(Math.random() * 200);
          }
        }

        usedProducts.add(productId);
        items.push({
          productId,
          quantity,
        });
      }

      const salesOrder: SalesOrder = {
        salesOrderId,
        number: orderNumber,
        client,
        deliveryDate: orderDate,
        items,
        createdAt: addDays(orderDate, -Math.floor(Math.random() * 10) - 1), // Créé 1-10 jours avant
        totalHT: items.reduce((sum, item) => sum + item.quantity * 10, 0), // Prix approximatif
        status: 'CONFIRMED',
      };

      salesOrders.push(salesOrder);

      // Pour environ 20% des commandes, créer un BL en préparation
      if (Math.random() < 0.2) {
        const blStatus: DeliveryNoteStatus = Math.random() < 0.5 ? 'IN_PREPARATION' : 'IN_PREPARATION';
        const deliveryNote: DeliveryNote = {
          deliveryNoteId: `BL-MONTH-${monthOffset}-${i + 1}-PREP`,
          salesOrderId,
          number: `BL-2025-${String(monthOffset).padStart(2, '0')}${String(i + 1).padStart(3, '0')}-P`,
          client,
          deliveryDate: orderDate,
          status: blStatus,
          lines: items,
          scannedLots: [],
          createdAt: addDays(orderDate, -Math.floor(Math.random() * 5)),
          startedAt: Math.random() < 0.5 ? addDays(orderDate, -Math.floor(Math.random() * 3)) : undefined,
        };

        // Add some scanned lots
        items.forEach((item, idx) => {
          if (Math.random() < 0.7) {
            const scannedQty = Math.floor(item.quantity * (0.3 + Math.random() * 0.7));
            deliveryNote.scannedLots.push({
              productId: item.productId,
              lotNumber: `LOT-${item.productId}-${monthOffset}-${i}-${idx}`,
              quantity: scannedQty,
              scannedAt: addDays(orderDate, -Math.floor(Math.random() * 2)),
            });
          }
        });

        deliveryNotes.push(deliveryNote);
        salesOrder.status = 'IN_PREPARATION';
      }

      // Pour environ 10% des commandes, créer un BL préparé ou expédié
      if (Math.random() < 0.1) {
        const isShipped = Math.random() < 0.5;
        const deliveryNote: DeliveryNote = {
          deliveryNoteId: `BL-MONTH-${monthOffset}-${i + 1}`,
          salesOrderId,
          number: `BL-2025-${String(monthOffset).padStart(2, '0')}${String(i + 1).padStart(3, '0')}`,
          client,
          deliveryDate: orderDate,
          status: isShipped ? 'SHIPPED' : 'PREPARED',
          lines: items,
          scannedLots: items.map((item, idx) => ({
            productId: item.productId,
            lotNumber: `LOT-${item.productId}-${monthOffset}-${i}-${idx}`,
            quantity: item.quantity,
            scannedAt: addDays(orderDate, -Math.floor(Math.random() * 5)),
          })),
          createdAt: addDays(orderDate, -Math.floor(Math.random() * 3)),
          preparedAt: addDays(orderDate, -Math.floor(Math.random() * 2)),
          shippedAt: isShipped ? orderDate : undefined,
        };

        deliveryNotes.push(deliveryNote);
        salesOrder.status = isShipped ? 'SHIPPED' : 'IN_PREPARATION';
      }
    }
  }

  // ===== Commandes spécifiques pour une période de ~4 semaines à partir d'aujourd'hui =====
  // Calculer les dates de début et fin
  const startDate = today; // Start from today
  const endDate = addDays(today, 31); // ~4 weeks from today

  // Trouver le lundi de la semaine de début
  const mondayStart = startOfWeek(startDate, { locale: fr });

  // Calculer le nombre de semaines entre les deux dates
  const weeksDiff = Math.ceil(
    (endDate.getTime() - mondayStart.getTime()) / (1000 * 60 * 60 * 24 * 7)
  );

  // Créer au moins 3 commandes par semaine
  let orderCounter = 1;
  for (let weekOffset = 0; weekOffset < weeksDiff; weekOffset++) {
    const weekStart = addDays(mondayStart, weekOffset * 7);
    const weekEnd = addDays(weekStart, 6); // Dimanche de la semaine

    // Créer 3-5 commandes par semaine
    const ordersPerWeek = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < ordersPerWeek; i++) {
      // Répartir les commandes sur la semaine (lundi à jeudi pour la dernière semaine)
      const dayOffset = Math.floor(
        Math.random() * (weekOffset === weeksDiff - 1 ? 4 : 7)
      ); // 0-3 pour dernière semaine, 0-6 pour les autres
      const orderDate = addDays(weekStart, dayOffset);

      // Ne pas dépasser la date de fin (jeudi 22.01.26)
      if (orderDate > endDate) continue;

      const client = clients[Math.floor(Math.random() * clients.length)];
      const orderNumber = `BC-2025-WEEK-${String(weekOffset + 1).padStart(
        2,
        '0'
      )}-${String(i + 1).padStart(2, '0')}`;
      const salesOrderId = `BC-WEEK-${weekOffset + 1}-${i + 1}`;

      // Générer 2-4 produits par commande
      const numProducts = 2 + Math.floor(Math.random() * 3);
      const items: Array<{ productId: string; quantity: number }> = [];
      const usedProducts = new Set<string>();

      // 80% des commandes avec stock OK, 20% avec problèmes de stock
      const hasStockIssue = Math.random() < 0.2;

      for (let j = 0; j < numProducts; j++) {
        let productId: string;
        let quantity: number;

        if (hasStockIssue) {
          const availableLowStock = productsLowStock.filter(
            (pid) => !usedProducts.has(pid)
          );

          if (availableLowStock.length > 0) {
            productId =
              availableLowStock[
                Math.floor(Math.random() * availableLowStock.length)
              ];
            const stock = productStocks[productId];

            if (Math.random() < 0.6) {
              quantity = Math.floor(stock * (1.2 + Math.random() * 0.8));
            } else {
              quantity = Math.floor(stock * (0.8 + Math.random() * 0.3));
            }
          } else {
            const availableInStock = productsInStock.filter(
              (pid) => !usedProducts.has(pid)
            );
            productId =
              availableInStock[
                Math.floor(Math.random() * availableInStock.length)
              ];
            quantity = 50 + Math.floor(Math.random() * 200);
          }
        } else {
          const availableInStock = productsInStock.filter(
            (pid) => !usedProducts.has(pid)
          );

          if (availableInStock.length > 0) {
            productId =
              availableInStock[
                Math.floor(Math.random() * availableInStock.length)
              ];
            const stock = productStocks[productId];
            quantity = Math.floor(stock * (0.1 + Math.random() * 0.4));
          } else {
            productId =
              productsInStock[
                Math.floor(Math.random() * productsInStock.length)
              ];
            quantity = 50 + Math.floor(Math.random() * 200);
          }
        }

        usedProducts.add(productId);
        items.push({ productId, quantity });
      }

      const salesOrder: SalesOrder = {
        salesOrderId,
        number: orderNumber,
        client,
        deliveryDate: orderDate,
        items,
        createdAt: addDays(orderDate, -Math.floor(Math.random() * 10) - 1),
        totalHT: items.reduce((sum, item) => sum + item.quantity * 10, 0),
        status: 'CONFIRMED',
      };

      salesOrders.push(salesOrder);
      orderCounter++;

      // Pour environ 20% des commandes, créer un BL en préparation
      if (Math.random() < 0.2) {
        const weekBL: DeliveryNote = {
          deliveryNoteId: `BL-WEEK-${weekOffset + 1}-${i + 1}`,
          salesOrderId,
          number: `BL-WEEK-${String(weekOffset + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
          client,
          deliveryDate: orderDate,
          status: 'IN_PREPARATION',
          lines: items,
          scannedLots: [],
          createdAt: addDays(orderDate, -Math.floor(Math.random() * 5)),
          startedAt: Math.random() < 0.5 ? addDays(orderDate, -Math.floor(Math.random() * 3)) : undefined,
        };

        items.forEach((item, idx) => {
          if (Math.random() < 0.7) {
            const scannedQty = Math.floor(item.quantity * (0.3 + Math.random() * 0.7));
            weekBL.scannedLots.push({
              productId: item.productId,
              lotNumber: `LOT-${item.productId}-WEEK-${weekOffset}-${i}-${idx}`,
              quantity: scannedQty,
              scannedAt: addDays(orderDate, -Math.floor(Math.random() * 2)),
            });
          }
        });

        deliveryNotes.push(weekBL);
        salesOrder.status = 'IN_PREPARATION';
      }
    }
  }
}

/**
 * Adjust demo data dates to always be relative to "today"
 * This ensures that demo data is always current, even if the app stays open for multiple days
 */
let demoDataReferenceDate: Date | null = null;

export function adjustDemoDataDates() {
  const today = getToday();

  // If this is the first time or if the date has changed, adjust all dates
  if (!demoDataReferenceDate || !isSameDay(demoDataReferenceDate, today)) {
    const previousReference = demoDataReferenceDate || today;
    const dateOffset = Math.ceil(
      (today.getTime() - previousReference.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dateOffset !== 0) {
      // Adjust all SalesOrders delivery dates
      salesOrders.forEach((so) => {
        const currentDate = new Date(so.deliveryDate);
        currentDate.setDate(currentDate.getDate() + dateOffset);
        so.deliveryDate = currentDate;
      });

      // Adjust all DeliveryNotes delivery dates
      deliveryNotes.forEach((dn) => {
        const currentDate = new Date(dn.deliveryDate);
        currentDate.setDate(currentDate.getDate() + dateOffset);
        dn.deliveryDate = currentDate;
      });
    }

    // Update reference date
    demoDataReferenceDate = new Date(today);
  }
}

/**
 * Reset demo data to initial conditions
 * Call this function to restore the demo to its initial state
 */
export const resetDemoData = () => {
  demoDataReferenceDate = null; // Reset reference date
  initializeDemoData();
};

// Initialize demo data on module load
initializeDemoData();
demoDataReferenceDate = new Date(getToday()); // Set initial reference date

// ===== BACKEND FUNCTIONS =====

// ===== SalesOrder (BC) Functions =====
export const confirmSalesOrder = (salesOrderId: string): void => {
  const salesOrder = salesOrders.find((so) => so.salesOrderId === salesOrderId);
  if (salesOrder && salesOrder.status === 'DRAFT') {
    salesOrder.status = 'CONFIRMED';
    // TODO: Soft allocation optionnel V1
  }
};

export const getSalesOrder = (salesOrderId: string): SalesOrder | undefined => {
  return salesOrders.find((so) => so.salesOrderId === salesOrderId);
};

export const getSalesOrdersForAtelier = (): SalesOrder[] => {
  // Adjust demo data dates to always be relative to "today"
  adjustDemoDataDates();

  // Filter out DRAFT, return CONFIRMED, IN_PREPARATION, PARTIALLY_SHIPPED
  return salesOrders.filter(
    (so) =>
      so.status === 'CONFIRMED' ||
      so.status === 'IN_PREPARATION' ||
      so.status === 'PARTIALLY_SHIPPED'
  );
};

export const updateSalesOrderStatus = (
  salesOrderId: string,
  newStatus: SalesOrderStatus
): void => {
  const salesOrder = salesOrders.find((so) => so.salesOrderId === salesOrderId);
  if (salesOrder) {
    salesOrder.status = newStatus;
  }
};

// ===== DeliveryNote (BL) Functions =====

export const createDeliveryNoteFromSalesOrder = (
  salesOrderId: string
): DeliveryNote => {
  const salesOrder = getSalesOrder(salesOrderId);
  if (!salesOrder) {
    throw new Error(`SalesOrder ${salesOrderId} not found`);
  }

  if (
    salesOrder.status !== 'CONFIRMED' &&
    salesOrder.status !== 'PARTIALLY_SHIPPED'
  ) {
    throw new Error(
      `Cannot create delivery note for SalesOrder with status ${salesOrder.status}`
    );
  }

  // Guard against duplicate active delivery notes
  const existingActive = deliveryNotes.find(
    (dn) =>
      dn.salesOrderId === salesOrderId &&
      (dn.status === 'IN_PREPARATION' || dn.status === 'PREPARED')
  );
  if (existingActive) {
    throw new Error(
      `Un bon de livraison actif existe déjà pour cette commande (${existingActive.deliveryNoteId})`
    );
  }

  // Calculate remaining quantities
  const remainingQuantities = getRemainingQuantities(salesOrderId);

  const deliveryNote: DeliveryNote = {
    deliveryNoteId: `BL-${Date.now()}`,
    salesOrderId,
    number: `BL-${Date.now()}`,
    client: salesOrder.client,
    deliveryDate: salesOrder.deliveryDate,
    status: 'IN_PREPARATION',
    lines: remainingQuantities.map((item) => ({
      productId: item.productId,
      quantity: item.remaining,
    })),
    scannedLots: [],
    createdAt: new Date(),
  };

  deliveryNotes.push(deliveryNote);

  // Update SalesOrder status to IN_PREPARATION
  updateSalesOrderStatus(salesOrderId, 'IN_PREPARATION');

  return deliveryNote;
};

export const scanLotOnDeliveryNote = (
  deliveryNoteId: string,
  productId: string,
  lotNumber: string,
  qty: number
): void => {
  const deliveryNote = deliveryNotes.find(
    (dn) => dn.deliveryNoteId === deliveryNoteId
  );
  if (!deliveryNote) {
    throw new Error(`DeliveryNote ${deliveryNoteId} not found`);
  }

  if (deliveryNote.status !== 'IN_PREPARATION') {
    throw new Error(
      `Cannot scan lot on delivery note with status ${deliveryNote.status}`
    );
  }

  // Auto-set startedAt on first scan
  if (!deliveryNote.startedAt) {
    deliveryNote.startedAt = new Date();
  }

  const newLot: ScannedLot = {
    productId,
    lotNumber,
    quantity: qty,
    scannedAt: new Date(),
  };

  deliveryNote.scannedLots.push(newLot);
};

export const completePreparation = (deliveryNoteId: string): void => {
  const deliveryNote = deliveryNotes.find(
    (dn) => dn.deliveryNoteId === deliveryNoteId
  );
  if (!deliveryNote) {
    throw new Error(`DeliveryNote ${deliveryNoteId} not found`);
  }

  if (deliveryNote.status !== 'IN_PREPARATION') {
    throw new Error(
      `Le BL doit être en préparation pour être finalisé (statut actuel: ${deliveryNote.status})`
    );
  }

  deliveryNote.status = 'PREPARED';
  deliveryNote.preparedAt = new Date();

  // Update line quantities from scanned lots (actual quantities)
  const actualQuantities = new Map<string, number>();
  deliveryNote.scannedLots.forEach((lot) => {
    const current = actualQuantities.get(lot.productId) || 0;
    actualQuantities.set(lot.productId, current + lot.quantity);
  });

  deliveryNote.lines = Array.from(actualQuantities.entries()).map(
    ([productId, quantity]) => ({
      productId,
      quantity,
    })
  );
};

export const shipDeliveryNote = (deliveryNoteId: string): void => {
  const deliveryNote = deliveryNotes.find(
    (dn) => dn.deliveryNoteId === deliveryNoteId
  );
  if (deliveryNote && deliveryNote.status === 'PREPARED') {
    deliveryNote.status = 'SHIPPED';
    deliveryNote.shippedAt = new Date();
    // Decrement physical stock (inventory movement)
    for (const line of deliveryNote.lines) {
      const product = products.find(p => p.id === line.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - line.quantity);
      }
    }

    // Update SalesOrder status
    const remaining = getRemainingQuantities(deliveryNote.salesOrderId);
    const hasRemaining = remaining.some((r) => r.remaining > 0);
    if (hasRemaining) {
      updateSalesOrderStatus(deliveryNote.salesOrderId, 'PARTIALLY_SHIPPED');
    } else {
      updateSalesOrderStatus(deliveryNote.salesOrderId, 'SHIPPED');
    }
  }
};

export const getDeliveryNotesBySalesOrder = (
  salesOrderId: string
): DeliveryNote[] => {
  return deliveryNotes.filter((dn) => dn.salesOrderId === salesOrderId);
};

export const getDeliveryNote = (
  deliveryNoteId: string
): DeliveryNote | undefined => {
  return deliveryNotes.find((dn) => dn.deliveryNoteId === deliveryNoteId);
};

// ===== Cancel Functions =====
export const cancelSalesOrder = (salesOrderId: string): void => {
  const salesOrder = salesOrders.find((so) => so.salesOrderId === salesOrderId);
  if (!salesOrder) {
    throw new Error(`SalesOrder ${salesOrderId} not found`);
  }
  if (salesOrder.status !== 'DRAFT' && salesOrder.status !== 'CONFIRMED') {
    throw new Error(
      `Cannot cancel SalesOrder with status ${salesOrder.status}`
    );
  }
  salesOrder.status = 'CANCELLED';
};

export const cancelDeliveryNote = (deliveryNoteId: string): void => {
  const deliveryNote = deliveryNotes.find(
    (dn) => dn.deliveryNoteId === deliveryNoteId
  );
  if (!deliveryNote) {
    throw new Error(`DeliveryNote ${deliveryNoteId} not found`);
  }
  if (deliveryNote.status !== 'IN_PREPARATION') {
    throw new Error(
      `Cannot cancel DeliveryNote with status ${deliveryNote.status}`
    );
  }
  // Remove the delivery note
  const index = deliveryNotes.indexOf(deliveryNote);
  if (index > -1) {
    deliveryNotes.splice(index, 1);
  }
};

// ===== Remaining Quantities Calculation =====
export interface RemainingQuantity {
  productId: string;
  ordered: number;
  delivered: number;
  remaining: number;
}

export const getRemainingQuantities = (
  salesOrderId: string
): RemainingQuantity[] => {
  const salesOrder = getSalesOrder(salesOrderId);
  if (!salesOrder) {
    return [];
  }

  // Get all shipped delivery notes for this sales order
  const shippedNotes = getDeliveryNotesBySalesOrder(salesOrderId).filter(
    (dn) => dn.status === 'SHIPPED'
  );

  // Calculate delivered quantities from shipped BLs
  const deliveredQuantities = new Map<string, number>();
  shippedNotes.forEach((dn) => {
    dn.lines.forEach((line) => {
      const current = deliveredQuantities.get(line.productId) || 0;
      deliveredQuantities.set(line.productId, current + line.quantity);
    });
  });

  // Calculate remaining quantities
  return salesOrder.items.map((item) => {
    const delivered = deliveredQuantities.get(item.productId) || 0;
    return {
      productId: item.productId,
      ordered: item.quantity,
      delivered,
      remaining: Math.max(0, item.quantity - delivered),
    };
  });
};

export const calculateSalesOrderStatus = (
  salesOrderId: string
): SalesOrderStatus => {
  const salesOrder = getSalesOrder(salesOrderId);
  if (!salesOrder) {
    throw new Error(`SalesOrder ${salesOrderId} not found`);
  }

  const remaining = getRemainingQuantities(salesOrderId);
  const hasRemaining = remaining.some((r) => r.remaining > 0);
  const hasDelivered = remaining.some((r) => r.delivered > 0);
  const allDeliveryNotes = getDeliveryNotesBySalesOrder(salesOrderId);
  const hasActiveBL = allDeliveryNotes.some(
    (dn) => dn.status === 'IN_PREPARATION' || dn.status === 'PREPARED'
  );

  if (hasActiveBL) {
    return 'IN_PREPARATION';
  } else if (hasDelivered && hasRemaining) {
    return 'PARTIALLY_SHIPPED';
  } else if (hasDelivered && !hasRemaining) {
    return 'SHIPPED';
  } else {
    return salesOrder.status === 'DRAFT' ? 'DRAFT' : 'CONFIRMED';
  }
};

// ===== MIGRATION FUNCTION REMOVED =====
// The old migration function has been completely removed.
// We now use only the new system: `salesOrders` and `deliveryNotes`.
// Demo data is initialized via `initializeDemoData()` function.
