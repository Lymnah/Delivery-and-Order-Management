import { useMemo } from 'react';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { products } from '../../data/database';
import type { Order, UnifiedOrder, SalesOrder, PickingTask, DeliveryNote } from '../../data/database';
import { getUnifiedOrdersForAtelier } from '../utils/unifiedOrderHelpers';
import { getOrdersWithCurrentDates } from '../utils/orderHelpers';

export type TimeRange = 'all' | 'today' | 'week' | 'month' | 'custom' | 'documents';
export type ActiveMode = 'period' | 'documents';

interface UseProductsParams {
  today: Date;
  activeMode: ActiveMode;
  timeRange: TimeRange;
  filterReferenceDate: Date;
  currentView: string;
  getDaysInRange: () => Date[];
}

/**
 * Hook to calculate aggregated products from orders
 */
export const useProducts = ({
  today,
  activeMode,
  timeRange,
  filterReferenceDate,
  currentView,
  getDaysInRange,
}: UseProductsParams) => {
  const aggregatedProducts = useMemo(() => {
    // Helper function to extract items from UnifiedOrder
    const getItemsFromUnifiedOrder = (unifiedOrder: UnifiedOrder): Array<{ productId: string; quantity: number }> => {
      const originalData = unifiedOrder.originalData;
      
      if ('items' in originalData) {
        // SalesOrder
        return (originalData as SalesOrder).items;
      } else if ('lines' in originalData) {
        // PickingTask or DeliveryNote
        return (originalData as PickingTask | DeliveryNote).lines.map(line => ({
          productId: line.productId,
          quantity: line.quantity,
        }));
      }
      return [];
    };

    // Helper function to convert UnifiedOrder to Order for compatibility
    const unifiedOrderToOrder = (unifiedOrder: UnifiedOrder): Order => {
      const items = getItemsFromUnifiedOrder(unifiedOrder);
      return {
        id: unifiedOrder.id,
        number: unifiedOrder.number,
        type: unifiedOrder.sourceType as 'BC' | 'BL',
        client: unifiedOrder.client,
        deliveryDate: unifiedOrder.deliveryDate,
        items,
        createdAt: unifiedOrder.createdAt,
        totalHT: 0, // Not needed for aggregation
        status: unifiedOrder.lifecycle as any,
      };
    };

    let ordersToAggregate: Order[] = [];

    if (activeMode === 'period') {
      // For commandes view, use unified orders
      if (currentView === 'logistique-commandes') {
        const unifiedOrders = getUnifiedOrdersForAtelier();
        let filteredUnifiedOrders = unifiedOrders;

        if (timeRange === 'today') {
          // Pour "Aujourd'hui", toujours utiliser la date d'aujourd'hui (today)
          const normalizedToday = new Date(today);
          normalizedToday.setHours(0, 0, 0, 0);
          filteredUnifiedOrders = unifiedOrders.filter((order) => {
            const normalizedOrderDate = new Date(order.deliveryDate);
            normalizedOrderDate.setHours(0, 0, 0, 0);
            return isSameDay(normalizedOrderDate, normalizedToday);
          });
        } else if (timeRange === 'week') {
          const weekStart = startOfWeek(filterReferenceDate, {
            locale: fr,
          });
          const weekEnd = endOfWeek(filterReferenceDate, {
            locale: fr,
          });
          filteredUnifiedOrders = unifiedOrders.filter(
            (order) =>
              order.deliveryDate >= weekStart && order.deliveryDate <= weekEnd
          );
        } else if (timeRange === 'month') {
          const monthStart = startOfMonth(filterReferenceDate);
          const monthEnd = endOfMonth(filterReferenceDate);
          filteredUnifiedOrders = unifiedOrders.filter(
            (order) =>
              order.deliveryDate >= monthStart && order.deliveryDate <= monthEnd
          );
        }
        // 'all' doesn't filter anything

        // Convert UnifiedOrders to Orders for aggregation
        ordersToAggregate = filteredUnifiedOrders.map(unifiedOrderToOrder);
      } else {
        // For other views, use the original logic
        const currentOrders = getOrdersWithCurrentDates(today);
        const days = getDaysInRange();
        ordersToAggregate = currentOrders.filter((order) =>
          days.some((day) => isSameDay(order.deliveryDate, day))
        );
      }
    }

    const aggregation = new Map<string, number>();
    ordersToAggregate.forEach((order) => {
      order.items.forEach((item) => {
        const current = aggregation.get(item.productId) || 0;
        aggregation.set(item.productId, current + item.quantity);
      });
    });

    return Array.from(aggregation.entries()).map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId)!;
      return {
        product,
        quantity,
        deficit: Math.max(0, quantity - product.stock),
        orders: ordersToAggregate.filter((o) =>
          o.items.some((i) => i.productId === productId)
        ),
      };
    });
  }, [
    today,
    activeMode,
    timeRange,
    filterReferenceDate,
    currentView,
    getDaysInRange,
  ]);

  return aggregatedProducts;
};

