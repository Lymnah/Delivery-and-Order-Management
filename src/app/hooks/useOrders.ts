import { useMemo } from 'react';
import {
  getOrdersWithCurrentDates,
  getOrdersForDate,
  getSortedOrdersByUrgency,
  getOrdersForAtelier,
  getOrdersForDateAtelier,
  getSortedOrdersByUrgencyAtelier,
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

  const getOrdersForAtelierHelper = (): Order[] => {
    return getOrdersForAtelier(today);
  };

  const getOrdersForDateAtelierHelper = (date: Date): Order[] => {
    return getOrdersForDateAtelier(date, today);
  };

  const getSortedOrdersAtelier = (): Order[] => {
    return getSortedOrdersByUrgencyAtelier(today);
  };

  return {
    orders: ordersWithCurrentDates,
    getOrdersForDate: getOrdersForDateHelper,
    getSortedOrders,
    getOrdersForAtelier: getOrdersForAtelierHelper,
    getOrdersForDateAtelier: getOrdersForDateAtelierHelper,
    getSortedOrdersAtelier,
  };
};

