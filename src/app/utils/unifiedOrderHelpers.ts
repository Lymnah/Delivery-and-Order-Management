import {
  type SalesOrder,
  type DeliveryNote,
  type OrderLifecycle,
  type StockStatus,
  type UnifiedOrder,
  products,
  getSalesOrder,
  getSalesOrdersForAtelier,
  deliveryNotes,
} from '../../data/database';

/**
 * Calculate stock status for a SalesOrder
 * Compares product.stock >= item.quantity for each product
 */
export const calculateStockStatus = (salesOrder: SalesOrder): StockStatus => {
  if (!salesOrder.items || salesOrder.items.length === 0) {
    return 'UNKNOWN';
  }

  let allInStock = true;
  let allOutOfStock = true;

  for (const item of salesOrder.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return 'UNKNOWN';
    }

    const isInStock = product.stock >= item.quantity;
    if (isInStock) {
      allOutOfStock = false;
    } else {
      allInStock = false;
    }
  }

  if (allInStock) return 'IN_STOCK';
  if (allOutOfStock) return 'OUT_OF_STOCK';
  return 'PARTIAL';
};

/**
 * Calculate preparation progress for a DeliveryNote
 * Returns percentage (0-100) based on products completely prepared
 */
export const calculateDeliveryNoteProgress = (deliveryNote: DeliveryNote): number => {
  if (!deliveryNote.lines || deliveryNote.lines.length === 0) {
    return 0;
  }

  let fullyPreparedCount = 0;

  for (const line of deliveryNote.lines) {
    const scannedQuantity = deliveryNote.scannedLots
      .filter((lot) => lot.productId === line.productId)
      .reduce((sum, lot) => sum + lot.quantity, 0);

    if (scannedQuantity >= line.quantity) {
      fullyPreparedCount++;
    }
  }

  return Math.round((fullyPreparedCount / deliveryNote.lines.length) * 100);
};

/**
 * Map SalesOrder to UnifiedOrder
 */
export const mapSalesOrderToUnified = (salesOrder: SalesOrder): UnifiedOrder => {
  let lifecycle: OrderLifecycle;
  switch (salesOrder.status) {
    case 'DRAFT':
      lifecycle = 'DRAFT';
      break;
    case 'CONFIRMED':
      lifecycle = 'TO_PREPARE';
      break;
    case 'IN_PREPARATION':
      lifecycle = 'IN_PREPARATION';
      break;
    case 'PARTIALLY_SHIPPED':
      lifecycle = 'TO_PREPARE'; // Can still create more BL
      break;
    case 'SHIPPED':
      lifecycle = 'SHIPPED';
      break;
    case 'CANCELLED':
      lifecycle = 'DRAFT';
      break;
    default:
      lifecycle = 'TO_PREPARE';
  }

  const stockStatus = calculateStockStatus(salesOrder);

  return {
    id: `BC-${salesOrder.salesOrderId}`,
    client: salesOrder.client,
    deliveryDate: salesOrder.deliveryDate,
    itemsCount: salesOrder.items.length,
    lifecycle,
    stockStatus,
    sourceType: 'BC',
    sourceId: salesOrder.salesOrderId,
    number: salesOrder.number,
    createdAt: salesOrder.createdAt,
    transport: salesOrder.transport,
    originalData: salesOrder,
  };
};

/**
 * Map DeliveryNote to UnifiedOrder
 */
export const mapDeliveryNoteToUnified = (
  deliveryNote: DeliveryNote
): UnifiedOrder | null => {
  const salesOrder = getSalesOrder(deliveryNote.salesOrderId);
  if (!salesOrder) {
    return null;
  }

  let lifecycle: OrderLifecycle;
  switch (deliveryNote.status) {
    case 'IN_PREPARATION':
      lifecycle = 'IN_PREPARATION';
      break;
    case 'PREPARED':
      lifecycle = 'READY_TO_SHIP';
      break;
    case 'SHIPPED':
      lifecycle = 'SHIPPED';
      break;
    default:
      lifecycle = 'IN_PREPARATION';
  }

  const progressPercentage =
    deliveryNote.status === 'IN_PREPARATION'
      ? calculateDeliveryNoteProgress(deliveryNote)
      : undefined;

  return {
    id: `BL-${deliveryNote.deliveryNoteId}`,
    client: deliveryNote.client,
    deliveryDate: deliveryNote.deliveryDate,
    itemsCount: deliveryNote.lines.length,
    lifecycle,
    stockStatus: 'UNKNOWN',
    progressPercentage,
    sourceType: 'BL',
    sourceId: deliveryNote.deliveryNoteId,
    number: deliveryNote.number,
    createdAt: deliveryNote.createdAt,
    transport: salesOrder.transport,
    originalData: deliveryNote,
  };
};

/**
 * Get unified orders for Atelier view
 * Deduplicates: If BL exists for BC, show only BL.
 */
export const getUnifiedOrdersForAtelier = (): UnifiedOrder[] => {
  const unifiedOrders: UnifiedOrder[] = [];

  // Get all SalesOrders for Atelier (CONFIRMED, IN_PREPARATION, PARTIALLY_SHIPPED)
  const atelierSalesOrders = getSalesOrdersForAtelier();

  // Get all active DeliveryNotes (IN_PREPARATION, PREPARED)
  const activeDeliveryNotes = deliveryNotes.filter(
    (dn) => dn.status === 'IN_PREPARATION' || dn.status === 'PREPARED'
  );

  // Get all shipped/etc DeliveryNotes for display
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedDeliveryNotes = deliveryNotes.filter((dn) => {
    if (dn.status !== 'SHIPPED') return false;
    const deliveryDate = new Date(dn.deliveryDate);
    deliveryDate.setHours(0, 0, 0, 0);
    return deliveryDate <= today; // Only show past/today shipped
  });

  // Track which SalesOrders have active BL
  const salesOrdersWithActiveBL = new Set<string>();

  // First, process active DeliveryNotes (highest priority)
  for (const deliveryNote of activeDeliveryNotes) {
    const unified = mapDeliveryNoteToUnified(deliveryNote);
    if (unified) {
      unifiedOrders.push(unified);
      salesOrdersWithActiveBL.add(deliveryNote.salesOrderId);
    }
  }

  // Then, process completed DeliveryNotes
  for (const deliveryNote of completedDeliveryNotes) {
    const unified = mapDeliveryNoteToUnified(deliveryNote);
    if (unified) {
      unifiedOrders.push(unified);
      salesOrdersWithActiveBL.add(deliveryNote.salesOrderId);
    }
  }

  // Finally, process SalesOrders (only if no active BL exists)
  for (const salesOrder of atelierSalesOrders) {
    if (salesOrdersWithActiveBL.has(salesOrder.salesOrderId)) {
      continue;
    }
    const unified = mapSalesOrderToUnified(salesOrder);
    unifiedOrders.push(unified);
  }

  return unifiedOrders;
};

/**
 * Sort unified orders by priority
 * Priority order:
 * 1. IN_PREPARATION (BL en cours) - absolute priority
 * 2. TO_PREPARE with IN_STOCK (BC avec stock disponible)
 * 3. TO_PREPARE with PARTIAL or OUT_OF_STOCK
 * 4. READY_TO_SHIP, SHIPPED
 * Secondary sort: by delivery date (most urgent first)
 */
export const getSortedUnifiedOrdersByPriority = (
  today: Date
): UnifiedOrder[] => {
  const unifiedOrders = getUnifiedOrdersForAtelier();

  return unifiedOrders.sort((a, b) => {
    // 1. IN_PREPARATION has absolute priority
    if (a.lifecycle === 'IN_PREPARATION' && b.lifecycle !== 'IN_PREPARATION') {
      return -1;
    }
    if (b.lifecycle === 'IN_PREPARATION' && a.lifecycle !== 'IN_PREPARATION') {
      return 1;
    }

    // 2. TO_PREPARE with IN_STOCK has high priority
    if (
      a.lifecycle === 'TO_PREPARE' &&
      a.stockStatus === 'IN_STOCK' &&
      !(b.lifecycle === 'TO_PREPARE' && b.stockStatus === 'IN_STOCK')
    ) {
      return -1;
    }
    if (
      b.lifecycle === 'TO_PREPARE' &&
      b.stockStatus === 'IN_STOCK' &&
      !(a.lifecycle === 'TO_PREPARE' && a.stockStatus === 'IN_STOCK')
    ) {
      return 1;
    }

    // 3. Secondary sort by delivery date (most urgent first)
    const dateA = a.deliveryDate.getTime();
    const dateB = b.deliveryDate.getTime();
    return dateA - dateB;
  });
};

/**
 * Calculate projected stock statuses in cumulative mode (ATP - Available-to-Promise)
 */
export const calculateProjectedStatuses = (
  orders: UnifiedOrder[]
): Map<string, StockStatus> => {
  const virtualStock = new Map<string, number>();
  products.forEach((product) => {
    virtualStock.set(product.id, product.stock);
  });

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
  );

  const projectedStatuses = new Map<string, StockStatus>();

  for (const order of sortedOrders) {
    if (['SHIPPED'].includes(order.lifecycle)) {
      projectedStatuses.set(order.id, 'IN_STOCK');
      continue;
    }

    let orderStatus: StockStatus = 'IN_STOCK';

    const originalData = order.originalData;
    let items: Array<{ productId: string; quantity: number }> = [];

    if ('items' in originalData && originalData.items) {
      items = originalData.items;
    } else if ('lines' in originalData && originalData.lines) {
      items = originalData.lines.map((line: any) => ({
        productId: line.productId,
        quantity: line.quantity,
      }));
    }

    for (const item of items) {
      const currentStock = virtualStock.get(item.productId) || 0;

      if (currentStock < item.quantity) {
        orderStatus = currentStock > 0 ? 'PARTIAL' : 'OUT_OF_STOCK';
      }

      virtualStock.set(item.productId, currentStock - item.quantity);
    }

    projectedStatuses.set(order.id, orderStatus);
  }

  return projectedStatuses;
};

/**
 * Calculate which products pass into stockout for the first time in each order
 */
export const calculateFirstStockoutProducts = (
  orders: UnifiedOrder[]
): Map<string, Set<string>> => {
  const virtualStock = new Map<string, number>();
  products.forEach((product) => {
    virtualStock.set(product.id, product.stock);
  });

  const productsAlreadyOutOfStock = new Set<string>();

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
  );

  const firstStockoutProducts = new Map<string, Set<string>>();

  for (const order of sortedOrders) {
    if (['SHIPPED'].includes(order.lifecycle)) {
      const originalData = order.originalData;
      let items: Array<{ productId: string; quantity: number }> = [];

      if ('items' in originalData && originalData.items) {
        items = originalData.items;
      } else if ('lines' in originalData && originalData.lines) {
        items = originalData.lines.map((line: any) => ({
          productId: line.productId,
          quantity: line.quantity,
        }));
      }

      for (const item of items) {
        const currentStock = virtualStock.get(item.productId) || 0;
        virtualStock.set(item.productId, currentStock - item.quantity);
      }
      continue;
    }

    const firstStockoutsInThisOrder = new Set<string>();

    const originalData = order.originalData;
    let items: Array<{ productId: string; quantity: number }> = [];

    if ('items' in originalData && originalData.items) {
      items = originalData.items;
    } else if ('lines' in originalData && originalData.lines) {
      items = originalData.lines.map((line: any) => ({
        productId: line.productId,
        quantity: line.quantity,
      }));
    }

    for (const item of items) {
      const currentStock = virtualStock.get(item.productId) || 0;

      if (
        currentStock < item.quantity &&
        !productsAlreadyOutOfStock.has(item.productId)
      ) {
        firstStockoutsInThisOrder.add(item.productId);
        productsAlreadyOutOfStock.add(item.productId);
      }

      virtualStock.set(item.productId, currentStock - item.quantity);
    }

    if (firstStockoutsInThisOrder.size > 0) {
      firstStockoutProducts.set(order.id, firstStockoutsInThisOrder);
    }
  }

  return firstStockoutProducts;
};
