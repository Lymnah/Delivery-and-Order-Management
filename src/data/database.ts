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
    status: 'Confirmé',
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
    status: 'À préparer',
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
    status: 'Brouillon',
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
    status: 'Confirmé',
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
    status: 'Confirmé',
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
    status: 'Brouillon',
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
    status: 'Confirmé',
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
    status: 'À préparer',
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
    status: 'À préparer',
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
    status: 'Confirmé',
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
    status: 'À préparer',
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
    status: 'Brouillon',
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
    status: 'Confirmé',
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
    status: 'À préparer',
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
    status: 'Brouillon',
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
    status: 'Confirmé',
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
    status: 'À préparer',
  },
];

// Client logos mapping
export const clientLogos: Record<string, string> = {
  Carrefour: imgCarrefour,
  Auchan: imgAuchan,
  Leclerc: imgLeclerc,
};

// ===== NEW DATA STORES =====
// Sales Orders (BC)
export const salesOrders: SalesOrder[] = [];

// Picking Tasks (BP)
export const pickingTasks: PickingTask[] = [];

// Delivery Notes (BL)
export const deliveryNotes: DeliveryNote[] = [];

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

// ===== Migration Function =====
/**
 * Migrates legacy Order objects to new structure (SalesOrder, PickingTask, DeliveryNote)
 * This is a one-time migration function for backward compatibility
 */
export const migrateOrdersToNewStructure = (): void => {
  orders.forEach((order) => {
    if (order.type === 'BC') {
      // Convert BC to SalesOrder
      const statusMap: Record<string, SalesOrderStatus> = {
        Brouillon: 'DRAFT',
        Confirmé: 'CONFIRMED',
        'Partiellement livré': 'PARTIALLY_SHIPPED',
        Livré: 'SHIPPED',
        Clos: 'INVOICED',
      };

      const salesOrder: SalesOrder = {
        salesOrderId: order.id,
        number: order.number,
        client: order.client,
        deliveryDate: order.deliveryDate,
        items: order.items,
        createdAt: order.createdAt,
        totalHT: order.totalHT,
        status: statusMap[order.status as string] || 'DRAFT',
        disputeStatus: order.disputeStatus,
      };

      // Only add if not already exists
      if (!salesOrders.find((so) => so.salesOrderId === order.id)) {
        salesOrders.push(salesOrder);
      }
    } else if (order.type === 'BL') {
      // For BL, we need to create a SalesOrder first (if not exists), then a PickingTask, then DeliveryNote
      // This is a simplified migration - in real scenario, BL should have a parent BC
      const statusMap: Record<string, DeliveryNoteStatus> = {
        'À préparer': 'DRAFT',
        'En préparation': 'DRAFT',
        'Prêt à expédier': 'DRAFT',
        Expédié: 'SHIPPED',
        Livré: 'SHIPPED',
        Facturé: 'INVOICED',
        Annulé: 'DRAFT', // Cancelled BLs stay as DRAFT
      };

      // Create a temporary SalesOrder for this BL (in real scenario, BL should reference existing BC)
      const tempSalesOrderId = `SO-${order.id}`;
      if (!salesOrders.find((so) => so.salesOrderId === tempSalesOrderId)) {
        const tempSalesOrder: SalesOrder = {
          salesOrderId: tempSalesOrderId,
          number: order.number.replace('BL-', 'BC-'),
          client: order.client,
          deliveryDate: order.deliveryDate,
          items: order.items,
          createdAt: order.createdAt,
          totalHT: order.totalHT,
          status: 'CONFIRMED',
        };
        salesOrders.push(tempSalesOrder);
      }

      // Create PickingTask if status is 'À préparer' or 'En préparation'
      const blStatus = order.status as string;
      if (blStatus === 'À préparer' || blStatus === 'En préparation') {
        const pickingTask: PickingTask = {
          pickingTaskId: `PT-${order.id}`,
          salesOrderId: tempSalesOrderId,
          status: blStatus === 'À préparer' ? 'PENDING' : 'IN_PROGRESS',
          lines: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          scannedLots: [],
          createdAt: order.createdAt,
        };
        if (blStatus === 'En préparation') {
          pickingTask.startedAt = order.createdAt;
        }
        if (
          !pickingTasks.find(
            (pt) => pt.pickingTaskId === pickingTask.pickingTaskId
          )
        ) {
          pickingTasks.push(pickingTask);
        }
      } else {
        // For completed BLs, create a completed PickingTask and DeliveryNote
        const pickingTask: PickingTask = {
          pickingTaskId: `PT-${order.id}`,
          salesOrderId: tempSalesOrderId,
          status: 'COMPLETED',
          lines: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          scannedLots: [],
          createdAt: order.createdAt,
          completedAt: order.createdAt,
          deliveryNoteId: `DN-${order.id}`,
        };
        if (
          !pickingTasks.find(
            (pt) => pt.pickingTaskId === pickingTask.pickingTaskId
          )
        ) {
          pickingTasks.push(pickingTask);
        }

        const deliveryNote: DeliveryNote = {
          deliveryNoteId: `DN-${order.id}`,
          pickingTaskId: pickingTask.pickingTaskId,
          number: order.number,
          client: order.client,
          deliveryDate: order.deliveryDate,
          status: statusMap[blStatus] || 'DRAFT',
          lines: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          scannedLots: [],
          createdAt: order.createdAt,
        };
        if (blStatus === 'Expédié' || blStatus === 'Livré') {
          deliveryNote.shippedAt = order.createdAt;
        }
        if (blStatus === 'Facturé') {
          deliveryNote.invoicedAt = order.createdAt;
        }
        if (
          !deliveryNotes.find(
            (dn) => dn.deliveryNoteId === deliveryNote.deliveryNoteId
          )
        ) {
          deliveryNotes.push(deliveryNote);
        }
      }
    }
  });
};

// Run migration on module load (for backward compatibility)
// Note: In production, this should be run once and then disabled
if (
  salesOrders.length === 0 &&
  pickingTasks.length === 0 &&
  deliveryNotes.length === 0
) {
  migrateOrdersToNewStructure();
}
