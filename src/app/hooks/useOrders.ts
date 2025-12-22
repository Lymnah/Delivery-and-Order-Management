import { useMemo } from 'react';
import {
  getOrdersWithCurrentDates,
  getOrdersForDate,
  getSortedOrdersByUrgency,
} from '../utils/orderHelpers';
import type { Order } from '../../data/database';

/**
 * Hook to manage orders with current dates
 */
export const useOrders = (today: Date) => {
  const ordersWithCurrentDates = useMemo(
    () => getOrdersWithCurrentDates(today),
    [today]
  );

  const getOrdersForDateHelper = (date: Date): Order[] => {
    return getOrdersForDate(date, today);
  };

  const getSortedOrders = (): Order[] => {
    return getSortedOrdersByUrgency(today);
  };

  return {
    orders: ordersWithCurrentDates,
    getOrdersForDate: getOrdersForDateHelper,
    getSortedOrders,
  };
};

