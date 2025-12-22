import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Order } from '../../data/database';

/**
 * Calculate the number of days until a given date from today
 */
export const getDaysUntil = (date: Date, today: Date) => {
  const diff = Math.ceil(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
};

/**
 * Format a short date label based on days until
 */
export const getShortDateLabel = (daysUntil: number) => {
  if (daysUntil < 0) {
    return `(Retard ${Math.abs(daysUntil)}j)`;
  } else if (daysUntil === 0) {
    return '(Auj.)';
  } else if (daysUntil < 7) {
    return `(Dans ${daysUntil}j)`;
  }
  return '';
};

/**
 * Format a relative date label for card headers (J-2, Demain, Aujourd'hui)
 * Returns the label and color class
 */
export const getRelativeDateLabel = (
  daysUntil: number
): { label: string; color: string } => {
  if (daysUntil < 0) {
    return {
      label: `J${daysUntil}`, // J-2, J-3, etc.
      color: 'text-red-600',
    };
  } else if (daysUntil === 0) {
    return {
      label: "Aujourd'hui",
      color: 'text-red-600',
    };
  } else if (daysUntil === 1) {
    return {
      label: 'Demain',
      color: 'text-orange-600',
    };
  } else {
    return {
      label: `J+${daysUntil}`,
      color: 'text-orange-600',
    };
  }
};

/**
 * Format a complete section date label (e.g., "Vendredi 19.12.25 (Dans 1j)")
 */
export const getSectionDateLabel = (date: Date, daysUntil: number) => {
  const dayName = format(date, 'EEEE', { locale: fr });
  const dayNameCapitalized =
    dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const dateShort = format(date, 'dd.MM.yy', { locale: fr });
  const dateLabel = getShortDateLabel(daysUntil);
  return `${dayNameCapitalized} ${dateShort} ${dateLabel}`;
};

/**
 * Group orders by their delivery date
 */
export const groupOrdersByDate = (ordersList: Order[]) => {
  const groups: Record<string, Order[]> = {};
  ordersList.forEach((order) => {
    const dateKey = format(order.deliveryDate, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(order);
  });
  return groups;
};

