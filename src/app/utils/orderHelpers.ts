import { isSameDay } from 'date-fns';
import { orders, type Order } from '../../data/database';
import { getDaysUntil } from './dateHelpers';

/**
 * Get orders with dates recalculated relative to current date
 * This fixes the issue where INITIAL_NOW in database.ts is calculated once at module load
 * The first order should always be "today", so we use it as reference to calculate the offset
 */
export const getOrdersWithCurrentDates = (today: Date): Order[] => {
  // The first order (id: '1') should be delivered "today" according to database.ts
  // We calculate the offset based on this assumption
  const firstOrderDate = new Date(orders[0].deliveryDate);
  const daysOffset = Math.ceil(
    (today.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If no offset needed (dates are already correct), return orders as-is
  if (daysOffset === 0) {
    return orders;
  }

  // Adjust all delivery dates by the offset
  return orders.map((order) => {
    const orderDate = new Date(order.deliveryDate);
    const adjustedDate = new Date(orderDate);
    adjustedDate.setDate(adjustedDate.getDate() + daysOffset);
    return {
      ...order,
      deliveryDate: adjustedDate,
    };
  });
};

/**
 * Get orders for a specific date
 */
export const getOrdersForDate = (date: Date, today: Date): Order[] => {
  const currentOrders = getOrdersWithCurrentDates(today);
  return currentOrders.filter((order) => isSameDay(order.deliveryDate, date));
};

/**
 * Sort orders by urgency (overdue first, then by date ascending)
 */
export const getSortedOrdersByUrgency = (today: Date): Order[] => {
  const currentOrders = getOrdersWithCurrentDates(today);
  return currentOrders.sort((a, b) => {
    const daysA = getDaysUntil(a.deliveryDate, today);
    const daysB = getDaysUntil(b.deliveryDate, today);
    // En retard d'abord, puis par date croissante
    if (daysA < 0 && daysB >= 0) return -1;
    if (daysA >= 0 && daysB < 0) return 1;
    return daysA - daysB;
  });
};

