import { isSameDay } from 'date-fns';
import { orders, type Order } from '../../data/database';
import { getDaysUntil } from './dateHelpers';

/**
 * Get orders with dates recalculated relative to current date
 * This fixes the issue where INITIAL_NOW in database.ts is calculated once at module load
 * The first order should always be "today", so we use it as reference to calculate the offset
 * 
 * NOTE: Since we've removed the old orders array, this function now returns an empty array.
 * The new system uses salesOrders, pickingTasks, and deliveryNotes instead.
 */
export const getOrdersWithCurrentDates = (today: Date): Order[] => {
  // If orders array is empty (new system), return empty array
  if (orders.length === 0) {
    return [];
  }

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

/**
 * Get orders filtered for Atelier view
 * - Excludes BC with status 'Brouillon'
 * - Includes all BL (all statuses)
 * - Includes BC with status 'Confirmé' and later
 */
export const getOrdersForAtelier = (today: Date): Order[] => {
  const currentOrders = getOrdersWithCurrentDates(today);
  return currentOrders.filter((order) => {
    // Include all BL (all statuses)
    if (order.type === 'BL') {
      return true;
    }
    // For BC, exclude 'Brouillon', include 'Confirmé' and later
    if (order.type === 'BC') {
      return order.status !== 'Brouillon';
    }
    // Unknown type, exclude
    return false;
  });
};

/**
 * Get orders for a specific date, filtered for Atelier
 */
export const getOrdersForDateAtelier = (date: Date, today: Date): Order[] => {
  const atelierOrders = getOrdersForAtelier(today);
  return atelierOrders.filter((order) => isSameDay(order.deliveryDate, date));
};

/**
 * Sort orders by urgency for Atelier (overdue first, then by date ascending)
 */
export const getSortedOrdersByUrgencyAtelier = (today: Date): Order[] => {
  const atelierOrders = getOrdersForAtelier(today);
  return atelierOrders.sort((a, b) => {
    const daysA = getDaysUntil(a.deliveryDate, today);
    const daysB = getDaysUntil(b.deliveryDate, today);
    // En retard d'abord, puis par date croissante
    if (daysA < 0 && daysB >= 0) return -1;
    if (daysA >= 0 && daysB < 0) return 1;
    return daysA - daysB;
  });
};

