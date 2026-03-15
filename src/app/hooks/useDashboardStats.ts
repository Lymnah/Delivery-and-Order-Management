import { useMemo } from 'react';
import { isSameDay } from 'date-fns';
import {
  salesOrders,
  deliveryNotes,
  products,
} from '../../data/database';
import {
  getUnifiedOrdersForAtelier,
} from '../utils/unifiedOrderHelpers';
import type { UnifiedOrder } from '../../data/database';

export interface DashboardStats {
  todayOrdersCount: number;
  inPreparationCount: number;
  readyToShipCount: number;
  overdueCount: number;
  todayOrders: UnifiedOrder[];
}

export const useDashboardStats = (today: Date): DashboardStats => {
  return useMemo(() => {
    const unifiedOrders = getUnifiedOrdersForAtelier();
    const normalizedToday = new Date(today);
    normalizedToday.setHours(0, 0, 0, 0);

    const todayOrders = unifiedOrders.filter((order) =>
      isSameDay(new Date(order.deliveryDate), normalizedToday)
    );

    const inPreparationCount = unifiedOrders.filter(
      (order) => order.lifecycle === 'IN_PREPARATION'
    ).length;

    const readyToShipCount = unifiedOrders.filter(
      (order) => order.lifecycle === 'READY_TO_SHIP'
    ).length;

    const overdueCount = unifiedOrders.filter((order) => {
      const orderDate = new Date(order.deliveryDate);
      orderDate.setHours(0, 0, 0, 0);
      return (
        orderDate < normalizedToday &&
        order.lifecycle !== 'SHIPPED' &&
        order.lifecycle !== 'INVOICED' &&
        order.lifecycle !== 'READY_TO_SHIP'
      );
    }).length;

    return {
      todayOrdersCount: todayOrders.length,
      inPreparationCount,
      readyToShipCount,
      overdueCount,
      todayOrders: todayOrders.slice(0, 3),
    };
  }, [today]);
};
