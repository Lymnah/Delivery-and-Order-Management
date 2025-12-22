import type {
  SalesOrderStatus,
  DeliveryNoteStatus,
  DocumentType,
} from '../../data/database';

export type OrderStatus = SalesOrderStatus | DeliveryNoteStatus;

/**
 * Returns CSS classes for status badge colors
 * - Neutral (gray): Brouillon, À préparer
 * - Warning (orange): En préparation, Partiellement livré
 * - Success (green): Livré, Facturé, Clos
 * - Info (blue): Confirmé, Prêt à expédier, Expédié
 * - Danger (red): Annulé
 */
export function getStatusBadgeColor(
  status: OrderStatus
): { bg: string; text: string } {
  switch (status) {
    // Neutral (gray)
    case 'Brouillon':
    case 'À préparer':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
      };

    // Warning (orange)
    case 'En préparation':
    case 'Partiellement livré':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
      };

    // Success (green)
    case 'Livré':
    case 'Facturé':
    case 'Clos':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
      };

    // Info (blue)
    case 'Confirmé':
    case 'Prêt à expédier':
    case 'Expédié':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
      };

    // Danger (red)
    case 'Annulé':
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
 * Returns formatted label for status
 */
export function getStatusLabel(status: OrderStatus): string {
  return status;
}

/**
 * Checks if a status transition is valid
 */
export function canTransitionStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
  orderType: DocumentType
): boolean {
  // BC (Sales Order) transitions
  if (orderType === 'BC') {
    const validTransitions: Record<SalesOrderStatus, SalesOrderStatus[]> = {
      Brouillon: ['Confirmé'],
      Confirmé: ['Partiellement livré', 'Livré'],
      'Partiellement livré': ['Livré'],
      Livré: ['Clos'],
      Clos: [], // Terminal state
    };

    return (
      validTransitions[currentStatus as SalesOrderStatus]?.includes(
        newStatus as SalesOrderStatus
      ) ?? false
    );
  }

  // BL (Delivery Note) transitions
  if (orderType === 'BL') {
    const validTransitions: Record<DeliveryNoteStatus, DeliveryNoteStatus[]> = {
      'À préparer': ['En préparation', 'Annulé'],
      'En préparation': ['Prêt à expédier', 'Annulé'],
      'Prêt à expédier': ['Expédié', 'Annulé'],
      Expédié: ['Livré'],
      Livré: ['Facturé'],
      Facturé: [], // Terminal state
      Annulé: [], // Terminal state
    };

    return (
      validTransitions[currentStatus as DeliveryNoteStatus]?.includes(
        newStatus as DeliveryNoteStatus
      ) ?? false
    );
  }

  return false;
}

/**
 * Returns available actions for a given status and order type
 */
export function getAvailableActions(
  status: OrderStatus,
  orderType: DocumentType
): string[] {
  if (orderType === 'BC') {
    switch (status as SalesOrderStatus) {
      case 'Brouillon':
        return ['Confirmer le BC'];
      case 'Confirmé':
        return ['Créer un BL'];
      case 'Partiellement livré':
        return ['Créer un BL complément'];
      case 'Livré':
        return ['Voir BL'];
      case 'Clos':
        return [];
      default:
        return [];
    }
  }

  if (orderType === 'BL') {
    switch (status as DeliveryNoteStatus) {
      case 'À préparer':
        return ['Préparer la livraison', 'Créer un ordre de fabrication'];
      case 'En préparation':
        return ['Valider le bon de livraison'];
      case 'Prêt à expédier':
        return ['Marquer comme expédié', 'Voir / imprimer le BL'];
      case 'Expédié':
        return ['Marquer comme livré', 'Voir / imprimer le BL'];
      case 'Livré':
        return ['Créer la facture', 'Voir / imprimer le BL'];
      case 'Facturé':
        return ['Voir la facture', 'Voir / imprimer le BL'];
      case 'Annulé':
        return ['Voir le BL'];
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
  orderType: DocumentType
): boolean {
  if (orderType === 'BL') {
    const statusTyped = status as DeliveryNoteStatus;
    // BL can be cancelled before Expédié
    return ['À préparer', 'En préparation', 'Prêt à expédier'].includes(
      statusTyped
    );
  }
  // BC cannot be cancelled (not in scope)
  return false;
}

