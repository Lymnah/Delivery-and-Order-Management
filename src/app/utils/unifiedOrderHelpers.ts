import {
  type SalesOrder,
  type PickingTask,
  type DeliveryNote,
  type OrderLifecycle,
  type StockStatus,
  type UnifiedOrder,
  products,
  getSalesOrder,
  getPickingTask,
  getDeliveryNote,
  getSalesOrdersForAtelier,
  getPickingTasksBySalesOrder,
  salesOrders,
  pickingTasks,
  deliveryNotes,
  adjustDemoDataDates,
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
 * Calculate picking progress for a PickingTask
 * Returns percentage (0-100) based on products completely prepared
 */
export const calculatePickingProgress = (pickingTask: PickingTask): number => {
  if (!pickingTask.lines || pickingTask.lines.length === 0) {
    return 0;
  }

  let fullyPreparedCount = 0;

  for (const line of pickingTask.lines) {
    // Calculate scanned quantity for this product
    const scannedQuantity = pickingTask.scannedLots
      .filter((lot) => lot.productId === line.productId)
      .reduce((sum, lot) => sum + lot.quantity, 0);

    // Check if fully prepared
    if (scannedQuantity >= line.quantity) {
      fullyPreparedCount++;
    }
  }

  return Math.round((fullyPreparedCount / pickingTask.lines.length) * 100);
};

/**
 * Map SalesOrder to UnifiedOrder
 */
export const mapSalesOrderToUnified = (salesOrder: SalesOrder): UnifiedOrder => {
  // Map status to lifecycle
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
      lifecycle = 'TO_PREPARE'; // Can still create more BP
      break;
    case 'SHIPPED':
      lifecycle = 'SHIPPED';
      break;
    case 'INVOICED':
      lifecycle = 'INVOICED';
      break;
    case 'CANCELLED':
      lifecycle = 'DRAFT'; // Treat cancelled as draft
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
    originalData: salesOrder,
  };
};

/**
 * Map PickingTask to UnifiedOrder
 */
export const mapPickingTaskToUnified = (
  pickingTask: PickingTask
): UnifiedOrder | null => {
  const salesOrder = getSalesOrder(pickingTask.salesOrderId);
  if (!salesOrder) {
    return null; // Cannot create unified order without parent BC
  }

  // Map status to lifecycle
  let lifecycle: OrderLifecycle;
  switch (pickingTask.status) {
    case 'PENDING':
    case 'IN_PROGRESS':
      lifecycle = 'IN_PREPARATION';
      break;
    case 'COMPLETED':
      lifecycle = 'READY_TO_SHIP';
      break;
    case 'CANCELLED':
      lifecycle = 'DRAFT'; // Treat cancelled as draft
      break;
    default:
      lifecycle = 'IN_PREPARATION';
  }

  const progressPercentage =
    pickingTask.status === 'IN_PROGRESS' || pickingTask.status === 'COMPLETED'
      ? calculatePickingProgress(pickingTask)
      : undefined;

  return {
    id: `BP-${pickingTask.pickingTaskId}`,
    client: salesOrder.client,
    deliveryDate: salesOrder.deliveryDate,
    itemsCount: pickingTask.lines.length,
    lifecycle,
    stockStatus: 'UNKNOWN', // Not relevant for BP
    progressPercentage,
    sourceType: 'BP',
    sourceId: pickingTask.pickingTaskId,
    number: pickingTask.pickingTaskId,
    createdAt: pickingTask.createdAt,
    originalData: pickingTask,
  };
};

/**
 * Map DeliveryNote to UnifiedOrder
 */
export const mapDeliveryNoteToUnified = (
  deliveryNote: DeliveryNote
): UnifiedOrder | null => {
  const pickingTask = getPickingTask(deliveryNote.pickingTaskId);
  if (!pickingTask) {
    return null; // Cannot create unified order without parent BP
  }

  const salesOrder = getSalesOrder(pickingTask.salesOrderId);
  if (!salesOrder) {
    return null; // Cannot create unified order without parent BC
  }

  // Map status to lifecycle
  let lifecycle: OrderLifecycle;
  switch (deliveryNote.status) {
    case 'DRAFT':
      lifecycle = 'READY_TO_SHIP';
      break;
    case 'SHIPPED':
      lifecycle = 'SHIPPED';
      break;
    case 'INVOICED':
      lifecycle = 'INVOICED';
      break;
    case 'SIGNED':
      lifecycle = 'SHIPPED'; // Treat signed as shipped
      break;
    default:
      lifecycle = 'READY_TO_SHIP';
  }

  // Calculate total weight if needed (optional)
  const totalWeight = undefined; // Can be calculated from products if needed

  return {
    id: `BL-${deliveryNote.deliveryNoteId}`,
    client: deliveryNote.client,
    deliveryDate: deliveryNote.deliveryDate,
    itemsCount: deliveryNote.lines.length,
    totalWeight,
    lifecycle,
    stockStatus: 'UNKNOWN', // Not relevant for BL
    sourceType: 'BL',
    sourceId: deliveryNote.deliveryNoteId,
    number: deliveryNote.number,
    createdAt: deliveryNote.createdAt,
    originalData: deliveryNote,
  };
};

/**
 * Get unified orders for Atelier view
 * Deduplicates: If BP exists for BC, show only BP. If BL exists for BP, show only BL.
 */
export const getUnifiedOrdersForAtelier = (): UnifiedOrder[] => {
  // Adjust demo data dates to always be relative to "today"
  // This ensures dates are always current, even if app stays open for multiple days
  adjustDemoDataDates();
  
  const unifiedOrders: UnifiedOrder[] = [];

  // Get all SalesOrders for Atelier (CONFIRMED, IN_PREPARATION, PARTIALLY_SHIPPED)
  const atelierSalesOrders = getSalesOrdersForAtelier();
  
  // Debug: log to verify data is loaded
  if (atelierSalesOrders.length > 0) {
    console.log('[DEBUG] SalesOrders for Atelier:', atelierSalesOrders.length, atelierSalesOrders.map(so => ({ id: so.salesOrderId, client: so.client, date: so.deliveryDate, status: so.status })));
  }

  // Get all active PickingTasks (PENDING, IN_PROGRESS)
  const activePickingTasks = pickingTasks.filter(
    (pt) => pt.status === 'PENDING' || pt.status === 'IN_PROGRESS'
  );
  console.log('[DEBUG unifiedOrderHelpers] activePickingTasks:', activePickingTasks.length, activePickingTasks.map(pt => ({ id: pt.pickingTaskId, salesOrderId: pt.salesOrderId, status: pt.status })));

  // Get all DeliveryNotes (READY_TO_SHIP, SHIPPED, INVOICED)
  // IMPORTANT: Exclude SHIPPED/INVOICED orders that are in the future (they shouldn't exist)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const atelierDeliveryNotes = deliveryNotes.filter((dn) => {
    const isValidStatus =
      dn.status === 'READY_TO_SHIP' || dn.status === 'SHIPPED' || dn.status === 'INVOICED';
    
    // Exclude SHIPPED/INVOICED orders in the future
    if (dn.status === 'SHIPPED' || dn.status === 'INVOICED') {
      const deliveryDate = new Date(dn.deliveryDate);
      deliveryDate.setHours(0, 0, 0, 0);
      if (deliveryDate > today) {
        return false; // Exclude future shipped/invoiced orders
      }
    }
    
    return isValidStatus;
  });
  console.log('[DEBUG unifiedOrderHelpers] atelierDeliveryNotes:', atelierDeliveryNotes.length, atelierDeliveryNotes.map(dn => ({ id: dn.deliveryNoteId, pickingTaskId: dn.pickingTaskId, status: dn.status })));

  // Track which SalesOrders have active BP or BL
  const salesOrdersWithActiveBP = new Set<string>();
  const pickingTasksWithBL = new Set<string>();

  console.log('[DEBUG unifiedOrderHelpers] Début déduplication:');
  console.log('  - atelierSalesOrders:', atelierSalesOrders.length);
  console.log('  - activePickingTasks:', activePickingTasks.length);
  console.log('  - atelierDeliveryNotes:', atelierDeliveryNotes.length);

  // First, process DeliveryNotes (highest priority - if BL exists, don't show BP or BC)
  for (const deliveryNote of atelierDeliveryNotes) {
    const unified = mapDeliveryNoteToUnified(deliveryNote);
    if (unified) {
      unifiedOrders.push(unified);
      // Mark the parent BP as having a BL
      pickingTasksWithBL.add(deliveryNote.pickingTaskId);
      // Mark the parent BC as having a BL (via BP)
      const pickingTask = getPickingTask(deliveryNote.pickingTaskId);
      if (pickingTask) {
        salesOrdersWithActiveBP.add(pickingTask.salesOrderId);
        console.log(`  ✅ BL ajouté: ${unified.id}, masque BC: ${pickingTask.salesOrderId}`);
      }
    }
  }

  // Then, process PickingTasks (if no BL exists for them)
  for (const pickingTask of activePickingTasks) {
    // Skip if this BP already has a BL
    if (pickingTasksWithBL.has(pickingTask.pickingTaskId)) {
      console.log(`  ⏭️  BP ${pickingTask.pickingTaskId} ignoré (a déjà un BL)`);
      continue;
    }

    const unified = mapPickingTaskToUnified(pickingTask);
    if (unified) {
      unifiedOrders.push(unified);
      // Mark the parent BC as having an active BP
      salesOrdersWithActiveBP.add(pickingTask.salesOrderId);
      console.log(`  ✅ BP ajouté: ${unified.id}, masque BC: ${pickingTask.salesOrderId}`);
    }
  }

  // Finally, process SalesOrders (only if no active BP or BL exists)
  for (const salesOrder of atelierSalesOrders) {
    // Skip if this BC already has an active BP or BL
    if (salesOrdersWithActiveBP.has(salesOrder.salesOrderId)) {
      console.log(`  ⏭️  BC ${salesOrder.salesOrderId} ignoré (a un BP/BL actif)`);
      continue;
    }

    const unified = mapSalesOrderToUnified(salesOrder);
    unifiedOrders.push(unified);
    console.log(`  ✅ BC ajouté: ${unified.id}`);
  }
  
  console.log('[DEBUG unifiedOrderHelpers] Fin déduplication - salesOrdersWithActiveBP:', Array.from(salesOrdersWithActiveBP));

  // Debug: log final unified orders with full details
  console.log('[DEBUG] Unified Orders for Atelier:', unifiedOrders.length);
  unifiedOrders.forEach((uo, index) => {
    console.log(`  [${index + 1}] ${uo.sourceType} - ${uo.client} - Date: ${uo.deliveryDate.toISOString().split('T')[0]} - Lifecycle: ${uo.lifecycle} - ID: ${uo.id}`);
  });

  return unifiedOrders;
};

/**
 * Sort unified orders by priority
 * Priority order:
 * 1. IN_PREPARATION (BP en cours) - absolute priority
 * 2. TO_PREPARE with IN_STOCK (BC avec stock disponible)
 * 3. TO_PREPARE with PARTIAL or OUT_OF_STOCK
 * 4. READY_TO_SHIP, SHIPPED, INVOICED
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
 * Simulates stock consumption chronologically to identify projected stockouts
 */
export const calculateProjectedStatuses = (
  orders: UnifiedOrder[]
): Map<string, StockStatus> => {
  // 1. Clone current stock state for simulation
  const virtualStock = new Map<string, number>();
  products.forEach((product) => {
    virtualStock.set(product.id, product.stock);
  });

  // 2. Sort orders by delivery date (CRUCIAL for cumulative calculation)
  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
  );

  // 3. Map to store projected status for each order
  const projectedStatuses = new Map<string, StockStatus>();

  for (const order of sortedOrders) {
    // Ignore already shipped/invoiced orders (they don't impact future stock)
    if (['SHIPPED', 'INVOICED'].includes(order.lifecycle)) {
      projectedStatuses.set(order.id, 'IN_STOCK');
      continue;
    }

    let orderStatus: StockStatus = 'IN_STOCK';

    // Extract items from UnifiedOrder (can be from SalesOrder, PickingTask, or DeliveryNote)
    const originalData = order.originalData;
    let items: Array<{ productId: string; quantity: number }> = [];

    if ('items' in originalData && originalData.items) {
      // SalesOrder
      items = originalData.items;
    } else if ('lines' in originalData && originalData.lines) {
      // PickingTask or DeliveryNote
      items = originalData.lines.map((line: any) => ({
        productId: line.productId,
        quantity: line.quantity,
      }));
    }

    // Check each item in the order
    for (const item of items) {
      const currentStock = virtualStock.get(item.productId) || 0;

      if (currentStock < item.quantity) {
        orderStatus = currentStock > 0 ? 'PARTIAL' : 'OUT_OF_STOCK';
      }

      // THE KEY OF CUMULATIVE MODE: Decrement virtual stock for subsequent orders
      // Even if we're out of stock, we consider the need and "consume" theoretical stock
      // (Can go negative to see total deficit)
      virtualStock.set(item.productId, currentStock - item.quantity);
    }

    projectedStatuses.set(order.id, orderStatus);
  }

  return projectedStatuses;
};

/**
 * Calculate which products pass into stockout for the first time in each order
 * Returns a Map: orderId -> Set of productIds that first go out of stock in this order
 */
export const calculateFirstStockoutProducts = (
  orders: UnifiedOrder[]
): Map<string, Set<string>> => {
  // 1. Clone current stock state for simulation
  const virtualStock = new Map<string, number>();
  products.forEach((product) => {
    virtualStock.set(product.id, product.stock);
  });

  // 2. Track which products have already gone out of stock
  const productsAlreadyOutOfStock = new Set<string>();

  // 3. Sort orders by delivery date (CRUCIAL for cumulative calculation)
  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
  );

  // 4. Map to store first stockout products for each order
  const firstStockoutProducts = new Map<string, Set<string>>();

  for (const order of sortedOrders) {
    // Ignore already shipped/invoiced orders
    if (['SHIPPED', 'INVOICED'].includes(order.lifecycle)) {
      // Still consume stock for these orders
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

    // Track products that go out of stock for the first time in this order
    const firstStockoutsInThisOrder = new Set<string>();

    // Extract items from UnifiedOrder
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

    // Check each item in the order
    for (const item of items) {
      const currentStock = virtualStock.get(item.productId) || 0;

      // Check if this product goes out of stock for the first time
      if (
        currentStock < item.quantity &&
        !productsAlreadyOutOfStock.has(item.productId)
      ) {
        firstStockoutsInThisOrder.add(item.productId);
        productsAlreadyOutOfStock.add(item.productId);
      }

      // Decrement virtual stock for subsequent orders
      virtualStock.set(item.productId, currentStock - item.quantity);
    }

    // Only add to map if there are first stockouts in this order
    if (firstStockoutsInThisOrder.size > 0) {
      firstStockoutProducts.set(order.id, firstStockoutsInThisOrder);
    }
  }

  return firstStockoutProducts;
};

