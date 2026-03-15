import type {
  SalesOrderStatus,
  DeliveryNoteStatus,
  DocumentType,
} from '../../data/database';

export type OrderStatus =
  | SalesOrderStatus
  | DeliveryNoteStatus;

/**
 * French translation for SalesOrderStatus
 */
export function getSalesOrderStatusLabelFr(status: SalesOrderStatus): string {
  switch (status) {
    case 'DRAFT':
      return 'Non confirmé';
    case 'CONFIRMED':
      return 'Confirmé';
    case 'IN_PREPARATION':
      return 'En préparation';
    case 'PARTIALLY_SHIPPED':
      return 'Partiellement livré';
    case 'SHIPPED':
      return 'Livré';
    case 'CANCELLED':
      return 'Annulé';
    default:
      return status;
  }
}

/**
 * French translation for DeliveryNoteStatus
 */
export function getDeliveryNoteStatusLabelFr(
  status: DeliveryNoteStatus
): string {
  switch (status) {
    case 'IN_PREPARATION':
      return 'En préparation';
    case 'PREPARED':
      return 'Préparé';
    case 'SHIPPED':
      return 'Expédié';
    default:
      return status;
  }
}

/**
 * Returns French label for any status
 */
export function getStatusLabelFr(status: OrderStatus): string {
  if (isSalesOrderStatus(status)) {
    return getSalesOrderStatusLabelFr(status);
  }
  if (isDeliveryNoteStatus(status)) {
    return getDeliveryNoteStatusLabelFr(status);
  }
  return String(status);
}

// Type guards
export function isSalesOrderStatus(status: OrderStatus): status is SalesOrderStatus {
  return [
    'DRAFT',
    'CONFIRMED',
    'IN_PREPARATION',
    'PARTIALLY_SHIPPED',
    'SHIPPED',
    'CANCELLED',
  ].includes(status as SalesOrderStatus);
}

export function isDeliveryNoteStatus(
  status: OrderStatus
): status is DeliveryNoteStatus {
  return ['IN_PREPARATION', 'PREPARED', 'SHIPPED'].includes(
    status as DeliveryNoteStatus
  );
}

/**
 * Returns CSS classes for status badge colors
 */
export function getStatusBadgeColor(
  status: OrderStatus,
  documentType?: DocumentType
): {
  bg: string;
  text: string;
} {
  // PREPARED for BL is green (ready to ship)
  if (status === 'PREPARED' && documentType === 'BL') {
    return {
      bg: 'bg-green-100',
      text: 'text-green-700',
    };
  }

  switch (status) {
    // Neutral (gray) - DRAFT
    case 'DRAFT':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
      };

    // Warning (orange)
    case 'IN_PREPARATION':
    case 'PARTIALLY_SHIPPED':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
      };

    // Success (green)
    case 'SHIPPED':
    case 'PREPARED':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
      };

    // Info (blue)
    case 'CONFIRMED':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
      };

    // Danger (red)
    case 'CANCELLED':
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
      };

    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
      };
  }
}

/**
 * Returns formatted label for status (French)
 */
export function getStatusLabel(status: OrderStatus): string {
  return getStatusLabelFr(status);
}

/**
 * Checks if a status transition is valid
 */
export function canTransitionStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
  orderType?: DocumentType
): boolean {
  // BC (Sales Order) transitions
  if (isSalesOrderStatus(currentStatus) && isSalesOrderStatus(newStatus)) {
    const validTransitions: Record<SalesOrderStatus, SalesOrderStatus[]> = {
      DRAFT: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['IN_PREPARATION', 'CANCELLED'],
      IN_PREPARATION: ['PARTIALLY_SHIPPED', 'SHIPPED', 'CANCELLED'],
      PARTIALLY_SHIPPED: ['SHIPPED', 'CANCELLED'],
      SHIPPED: [], // Terminal state
      CANCELLED: [], // Terminal state
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  }

  // BL (Delivery Note) transitions
  if (isDeliveryNoteStatus(currentStatus) && isDeliveryNoteStatus(newStatus)) {
    const validTransitions: Record<DeliveryNoteStatus, DeliveryNoteStatus[]> = {
      IN_PREPARATION: ['PREPARED'],
      PREPARED: ['SHIPPED'],
      SHIPPED: [], // Terminal state
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  }

  return false;
}

/**
 * Returns available actions for a given status and order type
 */
export function getAvailableActions(
  status: OrderStatus,
  orderType?: DocumentType
): string[] {
  // BC (Sales Order) actions
  if (isSalesOrderStatus(status)) {
    switch (status) {
      case 'DRAFT':
        return ['Confirmer le BC'];
      case 'CONFIRMED':
        return ['Créer un BL et préparer'];
      case 'IN_PREPARATION':
        return ['Voir le BL en préparation'];
      case 'PARTIALLY_SHIPPED':
        return ['Préparer le reliquat'];
      case 'SHIPPED':
        return ['Voir les BL'];
      case 'CANCELLED':
        return [];
      default:
        return [];
    }
  }

  // BL (Delivery Note) actions
  if (isDeliveryNoteStatus(status)) {
    switch (status) {
      case 'IN_PREPARATION':
        return ['Continuer la préparation'];
      case 'PREPARED':
        return ['Expédier le BL'];
      case 'SHIPPED':
        return ['Voir / imprimer le BL'];
      default:
        return [];
    }
  }

  return [];
}

/**
 * Checks if an order can be cancelled
 */
export function canCancelOrder(
  status: OrderStatus,
  orderType?: DocumentType
): boolean {
  // BC (Sales Order) can be cancelled before SHIPPED
  if (isSalesOrderStatus(status)) {
    return [
      'DRAFT',
      'CONFIRMED',
      'IN_PREPARATION',
      'PARTIALLY_SHIPPED',
    ].includes(status);
  }

  // BL (Delivery Note) can be cancelled when IN_PREPARATION
  if (isDeliveryNoteStatus(status)) {
    return (status as DeliveryNoteStatus) === 'IN_PREPARATION';
  }

  return false;
}
