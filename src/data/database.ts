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

// ===== NEW STATUS ENUMS (English values) =====
// Sales order statuses (BC - Bon de Commande)
export type SalesOrderStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'IN_PREPARATION'
  | 'PARTIALLY_SHIPPED'
  | 'SHIPPED'
  | 'INVOICED'
  | 'CANCELLED';

// Picking task statuses (BP - Bon de Préparation)
export type PickingTaskStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// Delivery note statuses (BL - Bon de Livraison)
export type DeliveryNoteStatus =
  | 'DRAFT'
  | 'SHIPPED'
  | 'SIGNED' // Optional V1
  | 'INVOICED';

// ===== LEGACY STATUS TYPES (for backward compatibility during migration) =====
// Old French statuses - will be deprecated
export type LegacySalesOrderStatus =
  | 'Brouillon'
  | 'Confirmé'
  | 'Partiellement livré'
  | 'Livré'
  | 'Clos';

export type LegacyDeliveryNoteStatus =
  | 'À préparer'
  | 'En préparation'
  | 'Prêt à expédier'
  | 'Expédié'
  | 'Livré'
  | 'Facturé'
  | 'Annulé';

// Dispute status
export type DisputeStatus = 'none' | 'open' | 'in_progress' | 'resolved';

// ===== UNIFIED MASTER LIST TYPES =====
// Lifecycle states for unified order view
export type OrderLifecycle =
  | 'DRAFT'
  | 'TO_PREPARE'
  | 'IN_PREPARATION'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'INVOICED';

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
  stockStatus: StockStatus; // For BC only, UNKNOWN for BP/BL
  progressPercentage?: number; // For BP only (0-100)
  sourceType: 'BC' | 'BP' | 'BL';
  sourceId: string; // salesOrderId, pickingTaskId, or deliveryNoteId
  number: string; // Document number for display
  createdAt: Date;
  // Reference to original data for actions
  originalData: SalesOrder | PickingTask | DeliveryNote;
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

// Picking Task Line (ligne de picking)
export interface PickingTaskLine {
  productId: string;
  quantity: number; // Quantity to pick (may be partial)
}

// Picking Task (BP - Bon de Préparation)
export interface PickingTask {
  pickingTaskId: string;
  salesOrderId: string; // Parent BC
  status: PickingTaskStatus;
  lines: PickingTaskLine[]; // Picking lines
  scannedLots: ScannedLot[]; // Lot traceability
  deliveryNoteId?: string; // Generated BL (1 BP -> 1 BL)
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// Delivery Note Line (snapshot figé)
export interface DeliveryNoteLine {
  productId: string;
  quantity: number; // Actual quantity delivered
}

// Delivery Note (BL - Bon de Livraison)
export interface DeliveryNote {
  deliveryNoteId: string;
  pickingTaskId: string; // Parent BP
  number: string;
  client: string;
  deliveryDate: Date;
  status: DeliveryNoteStatus;
  lines: DeliveryNoteLine[]; // Frozen snapshot
  scannedLots: ScannedLot[]; // Copy from BP
  createdAt: Date;
  shippedAt?: Date;
  signedAt?: Date;
  invoicedAt?: Date;
}

// ===== LEGACY ORDER INTERFACE (deprecated, kept for compatibility) =====
/**
 * @deprecated Use SalesOrder, PickingTask, or DeliveryNote instead
 * This interface is kept for backward compatibility during migration
 */
export interface Order {
  id: string;
  number: string;
  type: DocumentType;
  client: string;
  deliveryDate: Date;
  items: OrderItem[];
  createdAt: Date;
  totalHT: number;
  status:
    | SalesOrderStatus
    | DeliveryNoteStatus
    | LegacySalesOrderStatus
    | LegacyDeliveryNoteStatus; // Status depends on order type (required)
  disputeStatus?: DisputeStatus; // Optional dispute status
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

// ===== OLD ORDERS SYSTEM (DEPRECATED - REMOVED) =====
// The old `orders` array has been completely removed.
// Use `salesOrders`, `pickingTasks`, and `deliveryNotes` instead.
// This export is kept as an empty array for backward compatibility with components that still reference it.
export const orders: Order[] = [];

// Client logos mapping
export const clientLogos: Record<string, string> = {
  Carrefour: imgCarrefour,
  Auchan: imgAuchan,
  Leclerc: imgLeclerc,
};

// ===== NEW DATA STORES =====
// Sales Orders (BC) - Mutable for demo
export let salesOrders: SalesOrder[] = [];

// Picking Tasks (BP) - Mutable for demo
export let pickingTasks: PickingTask[] = [];

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
  pickingTasks = [];
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

  // ===== 1 BP (Picking Task) for today =====
  // BP créé à partir d'un BC supplémentaire (pour démo)
  // On crée un BC4 temporaire juste pour le BP, ou on utilise un BC existant mais on le met en IN_PREPARATION
  // Pour la démo, on va créer le BP sur BC1 mais le mettre en PENDING (pas encore démarré)
  // Ainsi, BC1 reste visible car le BP n'est pas encore IN_PROGRESS
  // OU mieux : créer le BP sur un BC qui n'est pas dans la liste initiale

  // Option : Créer un BC4 pour le BP (mais il ne sera pas dans les 3 BC initiaux)
  // OU : Le BP sera créé dynamiquement par l'utilisateur en cliquant sur "Lancer Prépa"

  // Pour l'instant, on ne crée pas de BP au démarrage pour que les 3 BC soient tous visibles
  // Le BP sera créé dynamiquement quand l'utilisateur clique sur "Lancer Prépa"

  // ===== 1 BL (Delivery Note) for today =====
  // Le BL sera créé à partir d'un BP complété
  // Pour la démo, on peut créer un BL qui vient d'un BC qui n'est plus dans la liste

  // ===== 1 BP (Picking Task) for today =====
  // Pour avoir 1 BP visible, on crée un BP sur un BC qui n'est pas dans les 3 initiaux
  // On crée un BC4 temporaire juste pour le BP
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
    status: 'IN_PREPARATION', // En préparation car a un BP
  };

  const bp1: PickingTask = {
    pickingTaskId: 'BP-DEMO-001',
    salesOrderId: 'BC-DEMO-004', // Lié à BC4
    status: 'IN_PROGRESS',
    lines: [
      { productId: '1', quantity: 50 },
      { productId: '2', quantity: 75 },
    ],
    scannedLots: [
      // Produit 1: 50/50 scanné (complet)
      {
        productId: '1',
        lotNumber: 'LOT-TN-2025-002',
        quantity: 50,
        scannedAt: addDays(today, -1),
      },
      // Produit 2: 45/75 scanné (partiel - 60%)
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

  salesOrders.push(bc4); // BC4 sera masqué par le BP (déduplication)
  pickingTasks.push(bp1);

  // ===== 1 BL (Delivery Note) for today =====
  // BL créé à partir d'un BP complété précédemment
  // On crée un BC5 temporaire pour le BL
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
    status: 'SHIPPED', // Livré car a un BL
  };

  const bp2: PickingTask = {
    pickingTaskId: 'BP-DEMO-COMPLETED-001',
    salesOrderId: 'BC-DEMO-005',
    status: 'COMPLETED',
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
    createdAt: addDays(today, -3),
    startedAt: addDays(today, -3),
    completedAt: addDays(today, -2),
    deliveryNoteId: 'BL-DEMO-001',
  };

  const bl1: DeliveryNote = {
    deliveryNoteId: 'BL-DEMO-001',
    pickingTaskId: 'BP-DEMO-COMPLETED-001',
    number: 'BL-2025-001',
    client: 'Leclerc',
    deliveryDate: today,
    status: 'DRAFT', // Prêt à expédier
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
  };

  salesOrders.push(bc5); // BC5 sera masqué par le BL (déduplication)
  pickingTasks.push(bp2);
  deliveryNotes.push(bl1);

  // ===== Past orders (1 per day for the last 15 days) =====
  // Create SHIPPED or INVOICED orders in the past to test "Voir précédents" functionality
  const clients = ['Carrefour', 'Auchan', 'Leclerc'];
  const productsForPastOrders = [
    { productId: '1', quantity: 50 },
    { productId: '2', quantity: 75 },
    { productId: '3', quantity: 100 },
  ];

  for (let i = 1; i <= 15; i++) {
    const pastDate = addDays(today, -i);
    const client = clients[i % clients.length];
    const items = [
      productsForPastOrders[i % productsForPastOrders.length],
      productsForPastOrders[(i + 1) % productsForPastOrders.length],
    ];

    // Create a BC that was shipped/invoiced in the past
    const pastBC: SalesOrder = {
      salesOrderId: `BC-PAST-${String(i).padStart(3, '0')}`,
      number: `BC-2025-PAST-${String(i).padStart(3, '0')}`,
      client: client,
      deliveryDate: pastDate,
      items: items,
      createdAt: addDays(pastDate, -Math.floor(Math.random() * 5) - 1),
      totalHT: items.reduce((sum, item) => sum + item.quantity * 10, 0),
      status: i <= 5 ? 'SHIPPED' : 'INVOICED', // First 5 days: SHIPPED, rest: INVOICED
    };

    salesOrders.push(pastBC);

    // Create corresponding BL for shipped/invoiced orders
    const pastBL: DeliveryNote = {
      deliveryNoteId: `BL-PAST-${String(i).padStart(3, '0')}`,
      pickingTaskId: `BP-PAST-${String(i).padStart(3, '0')}`, // Reference to a past BP
      number: `BL-2025-PAST-${String(i).padStart(3, '0')}`,
      client: client,
      deliveryDate: pastDate,
      status: i <= 5 ? 'SHIPPED' : 'INVOICED',
      lines: items,
      scannedLots: items.map((item) => ({
        productId: item.productId,
        lotNumber: `LOT-PAST-${i}-${item.productId}`,
        quantity: item.quantity,
        scannedAt: addDays(pastDate, -1),
      })),
      createdAt: addDays(pastDate, -1),
      shippedAt: i <= 5 ? addDays(pastDate, 0) : undefined,
      invoicedAt: i > 5 ? addDays(pastDate, 0) : undefined,
    };

    deliveryNotes.push(pastBL);
  }

  // Résultat final dans la Master List :
  // - BC1 (Carrefour) : CONFIRMED → visible comme BC bleu
  // - BC2 (Auchan) : CONFIRMED → visible comme BC bleu
  // - BC3 (Leclerc) : CONFIRMED → visible comme BC bleu
  // - BP1 (Carrefour) : remplace BC4 → visible comme BP orange
  // - BL1 (Leclerc) : remplace BC5/BP2 → visible comme BL vert
  // Total : 3 BC + 1 BP + 1 BL = 5 éléments

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

      // Pour environ 20% des commandes, créer un BP en cours
      if (Math.random() < 0.2) {
        const pickingTask: PickingTask = {
          pickingTaskId: `BP-MONTH-${monthOffset}-${i + 1}`,
          salesOrderId,
          status: Math.random() < 0.5 ? 'PENDING' : 'IN_PROGRESS',
          lines: items,
          scannedLots: [],
          createdAt: addDays(orderDate, -Math.floor(Math.random() * 5)),
          ...(Math.random() < 0.5
            ? { startedAt: addDays(orderDate, -Math.floor(Math.random() * 3)) }
            : {}),
        };

        // Ajouter quelques lots scannés si IN_PROGRESS
        if (pickingTask.status === 'IN_PROGRESS') {
          items.forEach((item, idx) => {
            if (Math.random() < 0.7) {
              // 70% des produits ont des lots scannés
              const scannedQty = Math.floor(
                item.quantity * (0.3 + Math.random() * 0.7)
              ); // 30-100% scanné
              pickingTask.scannedLots.push({
                productId: item.productId,
                lotNumber: `LOT-${item.productId}-${monthOffset}-${i}-${idx}`,
                quantity: scannedQty,
                scannedAt: addDays(orderDate, -Math.floor(Math.random() * 2)),
              });
            }
          });
        }

        pickingTasks.push(pickingTask);
        salesOrder.status = 'IN_PREPARATION';
      }

      // Pour environ 10% des commandes, créer un BL (livré)
      if (Math.random() < 0.1) {
        const pickingTaskId = `BP-MONTH-${monthOffset}-${i + 1}-COMPLETED`;
        const completedPickingTask: PickingTask = {
          pickingTaskId,
          salesOrderId,
          status: 'COMPLETED',
          lines: items,
          scannedLots: items.map((item, idx) => ({
            productId: item.productId,
            lotNumber: `LOT-${item.productId}-${monthOffset}-${i}-${idx}`,
            quantity: item.quantity,
            scannedAt: addDays(orderDate, -Math.floor(Math.random() * 5)),
          })),
          createdAt: addDays(orderDate, -Math.floor(Math.random() * 10)),
          startedAt: addDays(orderDate, -Math.floor(Math.random() * 8)),
          completedAt: addDays(orderDate, -Math.floor(Math.random() * 3)),
          deliveryNoteId: `BL-MONTH-${monthOffset}-${i + 1}`,
        };

        const deliveryNote: DeliveryNote = {
          deliveryNoteId: `BL-MONTH-${monthOffset}-${i + 1}`,
          pickingTaskId,
          number: `BL-2025-${String(monthOffset).padStart(2, '0')}${String(
            i + 1
          ).padStart(3, '0')}`,
          client,
          deliveryDate: orderDate,
          status: Math.random() < 0.5 ? 'DRAFT' : 'SHIPPED',
          lines: items,
          scannedLots: completedPickingTask.scannedLots,
          createdAt: addDays(orderDate, -Math.floor(Math.random() * 3)),
        };

        pickingTasks.push(completedPickingTask);
        deliveryNotes.push(deliveryNote);
        salesOrder.status =
          deliveryNote.status === 'SHIPPED' ? 'SHIPPED' : 'PARTIALLY_SHIPPED';
      }
    }
  }

  // ===== Commandes spécifiques pour la période lundi 22.12.25 - jeudi 22.01.26 =====
  // Calculer les dates de début et fin
  const startDate = new Date(2025, 11, 22); // 22 décembre 2025 (mois 0-indexed)
  const endDate = new Date(2026, 0, 22); // 22 janvier 2026

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

      // Pour environ 20% des commandes, créer un BP en cours
      if (Math.random() < 0.2) {
        const pickingTask: PickingTask = {
          pickingTaskId: `BP-WEEK-${weekOffset + 1}-${i + 1}`,
          salesOrderId,
          status: Math.random() < 0.5 ? 'PENDING' : 'IN_PROGRESS',
          lines: items,
          scannedLots: [],
          createdAt: addDays(orderDate, -Math.floor(Math.random() * 5)),
          ...(Math.random() < 0.5
            ? { startedAt: addDays(orderDate, -Math.floor(Math.random() * 3)) }
            : {}),
        };

        if (pickingTask.status === 'IN_PROGRESS') {
          items.forEach((item, idx) => {
            if (Math.random() < 0.7) {
              const scannedQty = Math.floor(
                item.quantity * (0.3 + Math.random() * 0.7)
              );
              pickingTask.scannedLots.push({
                productId: item.productId,
                lotNumber: `LOT-${item.productId}-WEEK-${weekOffset}-${i}-${idx}`,
                quantity: scannedQty,
                scannedAt: addDays(orderDate, -Math.floor(Math.random() * 2)),
              });
            }
          });
        }

        pickingTasks.push(pickingTask);
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

      // Adjust all PickingTasks (via their parent SalesOrder dates)
      // Note: PickingTasks use their parent SalesOrder's deliveryDate, so they're automatically adjusted

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

// ===== LEGACY DATA STORES (for backward compatibility) =====
// Delivery preparation mock data
// In a real app, this would be stored in a database
export const deliveryPreparations: Map<string, DeliveryPreparation> = new Map();

// Helper function to get or create delivery preparation for an order
export const getDeliveryPreparation = (
  orderId: string
): DeliveryPreparation => {
  if (!deliveryPreparations.has(orderId)) {
    // Initialize with "DRAFT" status for new orders (legacy compatibility)
    const order = orders.find((o) => o.id === orderId);
    deliveryPreparations.set(orderId, {
      orderId,
      status: 'DRAFT', // Using new enum value
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
        // Reset status to "DRAFT" if no lots remain (legacy compatibility)
        status:
          filteredLots.length === 0
            ? 'DRAFT'
            : prep.status === 'SHIPPED'
            ? 'DRAFT' // Using new enum value
            : prep.status,
      });
    }
  });
};

// Helper function to update order status (legacy compatibility)
export const updateOrderStatus = (
  orderId: string,
  newStatus:
    | SalesOrderStatus
    | DeliveryNoteStatus
    | LegacySalesOrderStatus
    | LegacyDeliveryNoteStatus
): void => {
  const orderIndex = orders.findIndex((o) => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: newStatus,
    };
  }
};

// ===== NEW BACKEND FUNCTIONS =====

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

// ===== PickingTask (BP) Functions =====
export const createPickingTaskFromSalesOrder = (
  salesOrderId: string
): PickingTask => {
  const salesOrder = getSalesOrder(salesOrderId);
  if (!salesOrder) {
    throw new Error(`SalesOrder ${salesOrderId} not found`);
  }

  if (
    salesOrder.status !== 'CONFIRMED' &&
    salesOrder.status !== 'PARTIALLY_SHIPPED'
  ) {
    throw new Error(
      `Cannot create picking task for SalesOrder with status ${salesOrder.status}`
    );
  }

  // Calculate remaining quantities
  const remainingQuantities = getRemainingQuantities(salesOrderId);

  // Create picking task
  const pickingTask: PickingTask = {
    pickingTaskId: `BP-${Date.now()}`,
    salesOrderId,
    status: 'PENDING',
    lines: remainingQuantities.map((item) => ({
      productId: item.productId,
      quantity: item.remaining,
    })),
    scannedLots: [],
    createdAt: new Date(),
  };

  pickingTasks.push(pickingTask);

  // Update SalesOrder status to IN_PREPARATION
  updateSalesOrderStatus(salesOrderId, 'IN_PREPARATION');

  return pickingTask;
};

export const startPickingTask = (pickingTaskId: string): void => {
  const pickingTask = pickingTasks.find(
    (pt) => pt.pickingTaskId === pickingTaskId
  );
  if (pickingTask && pickingTask.status === 'PENDING') {
    pickingTask.status = 'IN_PROGRESS';
    pickingTask.startedAt = new Date();
  }
};

export const scanLot = (
  pickingTaskId: string,
  productId: string,
  lotNumber: string,
  qty: number
): void => {
  const pickingTask = pickingTasks.find(
    (pt) => pt.pickingTaskId === pickingTaskId
  );
  if (!pickingTask) {
    throw new Error(`PickingTask ${pickingTaskId} not found`);
  }

  if (pickingTask.status === 'PENDING') {
    startPickingTask(pickingTaskId);
  }

  // Add lot to picking task
  const newLot: ScannedLot = {
    productId,
    lotNumber,
    quantity: qty,
    scannedAt: new Date(),
  };

  pickingTask.scannedLots.push(newLot);
};

export const completePickingTask = (pickingTaskId: string): void => {
  const pickingTask = pickingTasks.find(
    (pt) => pt.pickingTaskId === pickingTaskId
  );
  if (!pickingTask) {
    throw new Error(`PickingTask ${pickingTaskId} not found`);
  }

  if (pickingTask.status !== 'IN_PROGRESS') {
    throw new Error(
      `Cannot complete picking task with status ${pickingTask.status}`
    );
  }

  pickingTask.status = 'COMPLETED';
  pickingTask.completedAt = new Date();

  // Create DeliveryNote from PickingTask
  const deliveryNote = createDeliveryNoteFromPickingTask(pickingTaskId);
  pickingTask.deliveryNoteId = deliveryNote.deliveryNoteId;

  // Update SalesOrder status (SHIPPED or PARTIALLY_SHIPPED)
  const remaining = getRemainingQuantities(pickingTask.salesOrderId);
  const hasRemaining = remaining.some((r) => r.remaining > 0);

  if (hasRemaining) {
    updateSalesOrderStatus(pickingTask.salesOrderId, 'PARTIALLY_SHIPPED');
  } else {
    updateSalesOrderStatus(pickingTask.salesOrderId, 'SHIPPED');
  }
};

export const getPickingTask = (
  pickingTaskId: string
): PickingTask | undefined => {
  return pickingTasks.find((pt) => pt.pickingTaskId === pickingTaskId);
};

export const getPickingTasksBySalesOrder = (
  salesOrderId: string
): PickingTask[] => {
  return pickingTasks.filter((pt) => pt.salesOrderId === salesOrderId);
};

// ===== DeliveryNote (BL) Functions =====
export const createDeliveryNoteFromPickingTask = (
  pickingTaskId: string
): DeliveryNote => {
  const pickingTask = getPickingTask(pickingTaskId);
  if (!pickingTask) {
    throw new Error(`PickingTask ${pickingTaskId} not found`);
  }

  const salesOrder = getSalesOrder(pickingTask.salesOrderId);
  if (!salesOrder) {
    throw new Error(`SalesOrder ${pickingTask.salesOrderId} not found`);
  }

  // Calculate actual quantities from scanned lots
  const actualQuantities = new Map<string, number>();
  pickingTask.scannedLots.forEach((lot) => {
    const current = actualQuantities.get(lot.productId) || 0;
    actualQuantities.set(lot.productId, current + lot.quantity);
  });

  // Create delivery note with frozen snapshot
  const deliveryNote: DeliveryNote = {
    deliveryNoteId: `BL-${Date.now()}`,
    pickingTaskId,
    number: `BL-${Date.now()}`,
    client: salesOrder.client,
    deliveryDate: salesOrder.deliveryDate,
    status: 'DRAFT',
    lines: Array.from(actualQuantities.entries()).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      })
    ),
    scannedLots: [...pickingTask.scannedLots], // Copy lots
    createdAt: new Date(),
  };

  deliveryNotes.push(deliveryNote);
  return deliveryNote;
};

export const shipDeliveryNote = (deliveryNoteId: string): void => {
  const deliveryNote = deliveryNotes.find(
    (dn) => dn.deliveryNoteId === deliveryNoteId
  );
  if (deliveryNote && deliveryNote.status === 'DRAFT') {
    deliveryNote.status = 'SHIPPED';
    deliveryNote.shippedAt = new Date();
    // TODO: Decrement physical stock (inventory movement)
  }
};

export const invoiceDeliveryNote = (deliveryNoteId: string): void => {
  const deliveryNote = deliveryNotes.find(
    (dn) => dn.deliveryNoteId === deliveryNoteId
  );
  if (deliveryNote && deliveryNote.status === 'SHIPPED') {
    deliveryNote.status = 'INVOICED';
    deliveryNote.invoicedAt = new Date();

    // Check if all delivery notes for the parent sales order are invoiced
    const pickingTask = getPickingTask(deliveryNote.pickingTaskId);
    if (pickingTask) {
      const allPickingTasks = getPickingTasksBySalesOrder(
        pickingTask.salesOrderId
      );
      const allDeliveryNotes = allPickingTasks
        .map((pt) => pt.deliveryNoteId)
        .filter((id): id is string => !!id)
        .map((id) => deliveryNotes.find((dn) => dn.deliveryNoteId === id))
        .filter((dn): dn is DeliveryNote => !!dn);

      const allInvoiced = allDeliveryNotes.every(
        (dn) => dn.status === 'INVOICED'
      );

      if (allInvoiced) {
        updateSalesOrderStatus(pickingTask.salesOrderId, 'INVOICED');
      }
    }
  }
};

export const getDeliveryNote = (
  deliveryNoteId: string
): DeliveryNote | undefined => {
  return deliveryNotes.find((dn) => dn.deliveryNoteId === deliveryNoteId);
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

  // Get all picking tasks for this sales order
  const allPickingTasks = getPickingTasksBySalesOrder(salesOrderId);

  // Get all completed picking tasks (which have delivery notes)
  const completedPickingTasks = allPickingTasks.filter(
    (pt) => pt.status === 'COMPLETED' && pt.deliveryNoteId
  );

  // Calculate delivered quantities from all delivery notes
  const deliveredQuantities = new Map<string, number>();
  completedPickingTasks.forEach((pt) => {
    const deliveryNote = getDeliveryNote(pt.deliveryNoteId!);
    if (deliveryNote) {
      deliveryNote.lines.forEach((line) => {
        const current = deliveredQuantities.get(line.productId) || 0;
        deliveredQuantities.set(line.productId, current + line.quantity);
      });
    }
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
  const allPickingTasks = getPickingTasksBySalesOrder(salesOrderId);
  const hasActivePickingTasks = allPickingTasks.some(
    (pt) => pt.status === 'PENDING' || pt.status === 'IN_PROGRESS'
  );

  if (hasActivePickingTasks) {
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
// We now use only the new system: `salesOrders`, `pickingTasks`, and `deliveryNotes`.
// Demo data is initialized via `initializeDemoData()` function.
