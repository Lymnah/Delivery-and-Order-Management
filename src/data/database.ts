import {
  addDays,
  isSameDay,
} from 'date-fns';
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

// ===== HELPERS =====
// Prix unitaire HT par produit (€)
const unitPrices: Record<string, number> = {
  '1': 4.50, // Tapenade Noire
  '2': 4.50, // Tapenade Verte
  '3': 3.80, // Houmous Original
  '4': 5.20, // Caviar d'Aubergine
  '5': 4.80, // Tapenade Violette
  '6': 3.50, // Tzatziki
};

// Codes produits pour les numéros de lot
const productCodes: Record<string, string> = {
  '1': 'TN', '2': 'TV', '3': 'HO', '4': 'CA', '5': 'TP', '6': 'TZ',
};

function computeTotalHT(items: OrderItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.quantity * (unitPrices[item.productId] || 10), 0) * 100) / 100;
}

// Simple deterministic pseudo-random based on a seed
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ===== DEMO DATA INITIALIZATION =====
/**
 * Initialize demo data with deterministic, realistic business patterns.
 * Carrefour = gros client (~45% du CA), Auchan = moyen (~35%), Leclerc = petit (~20%)
 * Commandes passées les mardi et jeudi (jours de livraison habituels grande distribution)
 */
function initializeDemoData() {
  const today = getToday();
  const rand = seededRandom(42);

  salesOrders = [];
  deliveryNotes = [];

  let bcCounter = 1;
  let blCounter = 1;

  const bcNum = () => {
    const n = `BC-2026-${String(bcCounter).padStart(4, '0')}`;
    bcCounter++;
    return n;
  };
  const blNum = () => {
    const n = `BL-2026-${String(blCounter).padStart(4, '0')}`;
    blCounter++;
    return n;
  };
  const bcId = (num: string) => `so-${num}`;
  const blId = (num: string) => `dn-${num}`;

  // ===== Commandes récurrentes par client (profils réalistes) =====
  // Carrefour commande 2x/semaine (mar+jeu), gros volumes
  // Auchan commande 1-2x/semaine (mercredi), volumes moyens
  // Leclerc commande 1x/semaine (vendredi), petits volumes

  type ClientProfile = {
    name: string;
    deliveryDays: number[]; // 0=dim, 1=lun, 2=mar, 3=mer, 4=jeu, 5=ven, 6=sam
    orderTemplates: OrderItem[][];
  };

  const clientProfiles: ClientProfile[] = [
    {
      name: 'Carrefour',
      deliveryDays: [2, 4], // Mardi et jeudi
      orderTemplates: [
        // Commande type 1 : gamme complète
        [
          { productId: '1', quantity: 120 },
          { productId: '2', quantity: 100 },
          { productId: '3', quantity: 200 },
        ],
        // Commande type 2 : tapenades + spécialités
        [
          { productId: '1', quantity: 80 },
          { productId: '4', quantity: 60 },
          { productId: '6', quantity: 90 },
        ],
        // Commande type 3 : best-sellers
        [
          { productId: '3', quantity: 180 },
          { productId: '1', quantity: 150 },
        ],
        // Commande type 4 : grosse commande houmous
        [
          { productId: '3', quantity: 250 },
          { productId: '2', quantity: 120 },
          { productId: '5', quantity: 40 },
        ],
      ],
    },
    {
      name: 'Auchan',
      deliveryDays: [3], // Mercredi
      orderTemplates: [
        [
          { productId: '1', quantity: 80 },
          { productId: '3', quantity: 120 },
        ],
        [
          { productId: '2', quantity: 60 },
          { productId: '4', quantity: 50 },
          { productId: '6', quantity: 70 },
        ],
        [
          { productId: '3', quantity: 150 },
          { productId: '5', quantity: 30 },
        ],
      ],
    },
    {
      name: 'Leclerc',
      deliveryDays: [5], // Vendredi
      orderTemplates: [
        [
          { productId: '1', quantity: 60 },
          { productId: '3', quantity: 80 },
        ],
        [
          { productId: '2', quantity: 50 },
          { productId: '4', quantity: 40 },
        ],
        [
          { productId: '3', quantity: 100 },
          { productId: '6', quantity: 45 },
          { productId: '5', quantity: 25 },
        ],
      ],
    },
  ];

  // Petite variation de quantité (+/- 15%) pour que ce ne soit pas identique
  const varyQty = (qty: number): number => {
    const factor = 0.85 + rand() * 0.30;
    return Math.round(qty * factor);
  };

  const pickTemplate = (templates: OrderItem[][]): OrderItem[] => {
    const idx = Math.floor(rand() * templates.length);
    return templates[idx].map(item => ({ ...item, quantity: varyQty(item.quantity) }));
  };

  // ===== PASSÉ : 21 jours (3 semaines) — toutes expédiées =====
  for (let dayOffset = 21; dayOffset >= 1; dayOffset--) {
    const date = addDays(today, -dayOffset);
    const dayOfWeek = date.getDay();

    for (const profile of clientProfiles) {
      if (!profile.deliveryDays.includes(dayOfWeek)) continue;

      const num = bcNum();
      const items = pickTemplate(profile.orderTemplates);
      const createdAt = addDays(date, -3); // Commandé 3 jours avant livraison

      const bc: SalesOrder = {
        salesOrderId: bcId(num),
        number: num,
        client: profile.name,
        deliveryDate: date,
        items,
        createdAt,
        totalHT: computeTotalHT(items),
        status: 'SHIPPED',
      };
      salesOrders.push(bc);

      const blNumber = blNum();
      const bl: DeliveryNote = {
        deliveryNoteId: blId(blNumber),
        salesOrderId: bcId(num),
        number: blNumber,
        client: profile.name,
        deliveryDate: date,
        status: 'SHIPPED',
        lines: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        scannedLots: items.map(item => ({
          productId: item.productId,
          lotNumber: `LOT-${productCodes[item.productId]}-2026-${String(Math.floor(rand() * 50) + 1).padStart(3, '0')}`,
          quantity: item.quantity,
          scannedAt: addDays(date, -1),
        })),
        createdAt: addDays(date, -1),
        preparedAt: addDays(date, -1),
        shippedAt: date,
      };
      deliveryNotes.push(bl);
    }
  }

  // ===== AUJOURD'HUI =====

  // 1) BC Carrefour — CONFIRMED, stock OK (à préparer)
  {
    const num = bcNum();
    const items: OrderItem[] = [
      { productId: '1', quantity: 120 },
      { productId: '3', quantity: 200 },
      { productId: '2', quantity: 100 },
    ];
    salesOrders.push({
      salesOrderId: bcId(num),
      number: num,
      client: 'Carrefour',
      deliveryDate: today,
      items,
      createdAt: addDays(today, -3),
      totalHT: computeTotalHT(items),
      status: 'CONFIRMED',
    });
  }

  // 2) BC Auchan — CONFIRMED, stock partiel (Caviar d'Aubergine dépasse stock)
  {
    const num = bcNum();
    const items: OrderItem[] = [
      { productId: '4', quantity: 200 }, // stock: 180 → PARTIAL
      { productId: '3', quantity: 100 },
    ];
    salesOrders.push({
      salesOrderId: bcId(num),
      number: num,
      client: 'Auchan',
      deliveryDate: today,
      items,
      createdAt: addDays(today, -4),
      totalHT: computeTotalHT(items),
      status: 'CONFIRMED',
    });
  }

  // 3) BC Leclerc — CONFIRMED, stock OK
  {
    const num = bcNum();
    const items: OrderItem[] = [
      { productId: '1', quantity: 60 },
      { productId: '6', quantity: 45 },
    ];
    salesOrders.push({
      salesOrderId: bcId(num),
      number: num,
      client: 'Leclerc',
      deliveryDate: today,
      items,
      createdAt: addDays(today, -5),
      totalHT: computeTotalHT(items),
      status: 'CONFIRMED',
    });
  }

  // 4) BC Carrefour → BL en préparation (partiellement scanné)
  {
    const num = bcNum();
    const items: OrderItem[] = [
      { productId: '1', quantity: 80 },
      { productId: '2', quantity: 60 },
      { productId: '3', quantity: 150 },
    ];
    const bc: SalesOrder = {
      salesOrderId: bcId(num),
      number: num,
      client: 'Carrefour',
      deliveryDate: today,
      items,
      createdAt: addDays(today, -4),
      totalHT: computeTotalHT(items),
      status: 'IN_PREPARATION',
    };
    salesOrders.push(bc);

    const blNumber = blNum();
    deliveryNotes.push({
      deliveryNoteId: blId(blNumber),
      salesOrderId: bcId(num),
      number: blNumber,
      client: 'Carrefour',
      deliveryDate: today,
      status: 'IN_PREPARATION',
      lines: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      scannedLots: [
        { productId: '1', lotNumber: 'LOT-TN-2026-048', quantity: 80, scannedAt: addDays(today, 0) },
        { productId: '2', lotNumber: 'LOT-TV-2026-031', quantity: 35, scannedAt: addDays(today, 0) },
        // Produit 3 pas encore scanné
      ],
      createdAt: addDays(today, -1),
      startedAt: today,
    });
  }

  // 5) BC Leclerc → BL préparé (prêt à expédier)
  {
    const num = bcNum();
    const items: OrderItem[] = [
      { productId: '3', quantity: 100 },
      { productId: '5', quantity: 25 },
    ];
    const bc: SalesOrder = {
      salesOrderId: bcId(num),
      number: num,
      client: 'Leclerc',
      deliveryDate: today,
      items,
      createdAt: addDays(today, -6),
      totalHT: computeTotalHT(items),
      status: 'IN_PREPARATION',
    };
    salesOrders.push(bc);

    const blNumber = blNum();
    deliveryNotes.push({
      deliveryNoteId: blId(blNumber),
      salesOrderId: bcId(num),
      number: blNumber,
      client: 'Leclerc',
      deliveryDate: today,
      status: 'PREPARED',
      lines: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      scannedLots: [
        { productId: '3', lotNumber: 'LOT-HO-2026-052', quantity: 100, scannedAt: addDays(today, -1) },
        { productId: '5', lotNumber: 'LOT-TP-2026-009', quantity: 25, scannedAt: addDays(today, -1) },
      ],
      createdAt: addDays(today, -2),
      startedAt: addDays(today, -1),
      preparedAt: today,
    });
  }

  // ===== FUTUR : 4 semaines — BC confirmées, suivant les profils clients =====
  for (let dayOffset = 1; dayOffset <= 28; dayOffset++) {
    const date = addDays(today, dayOffset);
    const dayOfWeek = date.getDay();

    for (const profile of clientProfiles) {
      if (!profile.deliveryDays.includes(dayOfWeek)) continue;

      const num = bcNum();
      const items = pickTemplate(profile.orderTemplates);
      const createdAt = addDays(date, -3);

      // ~15% des commandes futures ont un problème de stock (quantités excessives sur produits faibles)
      const hasStockIssue = rand() < 0.15;
      if (hasStockIssue) {
        // Ajouter un produit à stock faible avec quantité excessive
        const lowStockProduct = rand() < 0.5 ? '5' : '6';
        const alreadyHas = items.some(i => i.productId === lowStockProduct);
        if (!alreadyHas) {
          items.push({ productId: lowStockProduct, quantity: lowStockProduct === '5' ? 120 : 100 });
        }
      }

      salesOrders.push({
        salesOrderId: bcId(num),
        number: num,
        client: profile.name,
        deliveryDate: date,
        items,
        createdAt,
        totalHT: computeTotalHT(items),
        status: 'CONFIRMED',
      });
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
