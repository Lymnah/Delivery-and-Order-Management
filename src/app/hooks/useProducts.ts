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
import type { Order } from '../../data/database';
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
    let ordersToAggregate: Order[];

    if (activeMode === 'period') {
      const currentOrders = getOrdersWithCurrentDates(today);

      // For commandes view, use the same filtering logic as the orders list
      if (currentView === 'logistique-commandes') {
        let filteredOrders = currentOrders;

        if (timeRange === 'today') {
          filteredOrders = filteredOrders.filter((order) =>
            isSameDay(order.deliveryDate, filterReferenceDate)
          );
        } else if (timeRange === 'week') {
          const weekStart = startOfWeek(filterReferenceDate, {
            locale: fr,
          });
          const weekEnd = endOfWeek(filterReferenceDate, {
            locale: fr,
          });
          filteredOrders = filteredOrders.filter(
            (order) =>
              order.deliveryDate >= weekStart && order.deliveryDate <= weekEnd
          );
        } else if (timeRange === 'month') {
          const monthStart = startOfMonth(filterReferenceDate);
          const monthEnd = endOfMonth(filterReferenceDate);
          filteredOrders = filteredOrders.filter(
            (order) =>
              order.deliveryDate >= monthStart && order.deliveryDate <= monthEnd
          );
        }
        // 'all' doesn't filter anything

        ordersToAggregate = filteredOrders;
      } else {
        // For other views, use the original logic
        const days = getDaysInRange();
        ordersToAggregate = currentOrders.filter((order) =>
          days.some((day) => isSameDay(order.deliveryDate, day))
        );
      }
    } else {
      ordersToAggregate = [];
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

