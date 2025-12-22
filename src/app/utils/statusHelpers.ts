import type {
  SalesOrderStatus,
  DeliveryNoteStatus,
  PickingTaskStatus,
  DocumentType,
} from '../../data/database';

export type OrderStatus =
  | SalesOrderStatus
  | DeliveryNoteStatus
  | PickingTaskStatus;

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
    case 'INVOICED':
      return 'Facturé';
    case 'CANCELLED':
      return 'Annulé';
    default:
      return status;
  }
}

/**
 * French translation for PickingTaskStatus
 */
export function getPickingTaskStatusLabelFr(status: PickingTaskStatus): string {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'IN_PROGRESS':
      return 'En prépa';
    case 'COMPLETED':
      return 'Terminé';
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
    case 'DRAFT':
      return 'Brouillon';
    case 'SHIPPED':
      return 'Expédié';
    case 'SIGNED':
      return 'Signé';
    case 'INVOICED':
      return 'Facturé';
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
  if (isPickingTaskStatus(status)) {
    return getPickingTaskStatusLabelFr(status);
  }
  if (isDeliveryNoteStatus(status)) {
    return getDeliveryNoteStatusLabelFr(status);
  }
  return String(status);
}

// Type guards
function isSalesOrderStatus(status: OrderStatus): status is SalesOrderStatus {
  return [
    'DRAFT',
    'CONFIRMED',
    'IN_PREPARATION',
    'PARTIALLY_SHIPPED',
    'SHIPPED',
    'INVOICED',
    'CANCELLED',
  ].includes(status as SalesOrderStatus);
}

function isPickingTaskStatus(status: OrderStatus): status is PickingTaskStatus {
  return ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(
    status as PickingTaskStatus
  );
}

function isDeliveryNoteStatus(
  status: OrderStatus
): status is DeliveryNoteStatus {
  return ['DRAFT', 'SHIPPED', 'SIGNED', 'INVOICED'].includes(
    status as DeliveryNoteStatus
  );
}

/**
 * Returns CSS classes for status badge colors
 * - Neutral (gray): DRAFT, PENDING
 * - Warning (orange): IN_PREPARATION, IN_PROGRESS, PARTIALLY_SHIPPED
 * - Success (green): SHIPPED, INVOICED, COMPLETED
 * - Info (blue): CONFIRMED, SHIPPED (BL)
 * - Danger (red): CANCELLED
 */
export function getStatusBadgeColor(status: OrderStatus): {
  bg: string;
  text: string;
} {
  switch (status) {
    // Neutral (gray)
    case 'DRAFT':
    case 'PENDING':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
      };

    // Warning (orange)
    case 'IN_PREPARATION':
    case 'IN_PROGRESS':
    case 'PARTIALLY_SHIPPED':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
      };

    // Success (green)
    case 'SHIPPED':
    case 'INVOICED':
    case 'COMPLETED':
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
      SHIPPED: ['INVOICED'],
      INVOICED: [], // Terminal state
      CANCELLED: [], // Terminal state
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  }

  // BP (Picking Task) transitions
  if (isPickingTaskStatus(currentStatus) && isPickingTaskStatus(newStatus)) {
    const validTransitions: Record<PickingTaskStatus, PickingTaskStatus[]> = {
      PENDING: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [], // Terminal state
      CANCELLED: [], // Terminal state
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  }

  // BL (Delivery Note) transitions
  if (isDeliveryNoteStatus(currentStatus) && isDeliveryNoteStatus(newStatus)) {
    const validTransitions: Record<DeliveryNoteStatus, DeliveryNoteStatus[]> = {
      DRAFT: ['SHIPPED'],
      SHIPPED: ['INVOICED', 'SIGNED'],
      SIGNED: ['INVOICED'],
      INVOICED: [], // Terminal state
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
        return ['Créer un BP et préparer'];
      case 'IN_PREPARATION':
        return ['Voir la préparation en cours'];
      case 'PARTIALLY_SHIPPED':
        return ['Préparer le reliquat'];
      case 'SHIPPED':
        return ['Voir les BL'];
      case 'INVOICED':
      case 'CANCELLED':
        return [];
      default:
        return [];
    }
  }

  // BP (Picking Task) actions
  if (isPickingTaskStatus(status)) {
    switch (status) {
      case 'PENDING':
        return ['Commencer la préparation'];
      case 'IN_PROGRESS':
        return ['Continuer la préparation', 'Terminer la préparation'];
      case 'COMPLETED':
      case 'CANCELLED':
        return [];
      default:
        return [];
    }
  }

  // BL (Delivery Note) actions
  if (isDeliveryNoteStatus(status)) {
    switch (status) {
      case 'DRAFT':
        return ['Voir le bon de livraison'];
      case 'SHIPPED':
        return ['Créer la facture', 'Voir / imprimer le BL'];
      case 'SIGNED':
        return ['Créer la facture', 'Voir / imprimer le BL'];
      case 'INVOICED':
        return ['Voir la facture', 'Voir / imprimer le BL'];
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

  // BP (Picking Task) can be cancelled before COMPLETED
  if (isPickingTaskStatus(status)) {
    return ['PENDING', 'IN_PROGRESS'].includes(status);
  }

  // BL (Delivery Note) cannot be cancelled once SHIPPED
  if (isDeliveryNoteStatus(status)) {
    return status === 'DRAFT';
  }

  return false;
}
