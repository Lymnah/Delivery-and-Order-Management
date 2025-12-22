import React from 'react';

import {
  Clock,
  Package,
  Truck,
  ChevronRight,
  CheckCircle2,
  Scale,
  AlertTriangle,
  ShoppingBasket,
} from 'lucide-react';
import { clientLogos, products } from '../../../data/database';
import type { Order, UnifiedOrder, StockStatus } from '../../../data/database';
import { getDaysUntil, getRelativeDateLabel } from '../../utils/dateHelpers';
import { calculateStockStatus } from '../../utils/unifiedOrderHelpers';

interface OrderCardProps {
  order?: Order;
  unifiedOrder?: UnifiedOrder;
  today: Date;
  onClick: (order: Order | UnifiedOrder) => void;
}

export default function OrderCard({
  order,
  unifiedOrder,
  today,
  onClick,
}: OrderCardProps) {
  const isUnified = !!unifiedOrder;
  const displayOrder = unifiedOrder || order!;

  // --- 1. CALCULS PRÉLIMINAIRES ---
  const daysUntil = getDaysUntil(displayOrder.deliveryDate, today);
  const relativeDate = getRelativeDateLabel(daysUntil);
  const itemsCount = isUnified ? unifiedOrder!.itemsCount : order!.items.length;

  // Estimation nombre de colis (environ 10 articles par carton)
  const packagesCount = Math.ceil(itemsCount / 10);

  // Estimation Poids
  const estimatedWeight =
    isUnified && unifiedOrder?.totalWeight
      ? unifiedOrder.totalWeight
      : itemsCount * 2;

  // Images produits
  const getProductPreviews = (): string[] => {
    const previews: string[] = [];
    const sourceItems =
      isUnified && unifiedOrder
        ? (unifiedOrder.originalData as any).items ||
          (unifiedOrder.originalData as any).lines
        : order?.items;

    if (sourceItems) {
      sourceItems.slice(0, 3).forEach((item: any) => {
        const product = products.find((p) => p.id === item.productId);
        if (product?.imageUrl) previews.push(product.imageUrl);
      });
    }
    return previews;
  };
  const productPreviews = getProductPreviews();

  // --- 2. LOGIQUE VISUELLE (State Machine) ---
  const getVisualState = () => {
    if (isUnified && unifiedOrder) {
      switch (unifiedOrder.lifecycle) {
        case 'TO_PREPARE':
          return {
            borderLeft: 'border-l-blue-500',
            badgeBg: 'bg-blue-100',
            badgeText: 'text-blue-700', // Couleur du texte principal
            icon: Clock,
            statusLabel: 'À préparer',
            showStock: true,
            docFullLabel: 'Bon de commande', // Texte clair
          };
        case 'IN_PREPARATION':
          return {
            borderLeft: 'border-l-orange-500',
            badgeBg: 'bg-orange-100',
            badgeText: 'text-orange-700',
            icon: Package,
            statusLabel: 'En Prépa',
            showProgress: true,
            docFullLabel: 'Bon de préparation', // Texte clair
          };
        case 'READY_TO_SHIP':
        case 'SHIPPED':
          return {
            borderLeft: 'border-l-green-500',
            badgeBg: 'bg-green-100',
            badgeText: 'text-green-700',
            icon: Truck,
            statusLabel:
              unifiedOrder.lifecycle === 'SHIPPED' ? 'Expédié' : 'Prêt',
            showShipping: true,
            docFullLabel: 'Bon de livraison', // Texte clair
          };
        default:
          return {
            borderLeft: 'border-l-gray-300',
            badgeBg: 'bg-gray-100',
            badgeText: 'text-gray-600',
            icon: CheckCircle2,
            statusLabel: 'Terminé',
            docFullLabel: 'Document',
          };
      }
    }
    // Fallback Legacy
    return {
      borderLeft: 'border-l-gray-300',
      badgeBg: 'bg-gray-100',
      badgeText: 'text-gray-600',
      icon: ChevronRight,
      statusLabel: 'Voir',
      docFullLabel:
        order?.type === 'BC' ? 'Bon de commande' : 'Bon de livraison',
    };
  };

  const visual = getVisualState();

  // Calcul Stock
  const stockStatus: StockStatus | null | undefined = isUnified
    ? unifiedOrder?.stockStatus
    : order?.type === 'BC'
    ? calculateStockStatus({ items: order?.items } as any)
    : null;

  // Formatage ID
  const getShortId = () => {
    const num = isUnified ? unifiedOrder?.number : order?.number;
    const match = num?.match(/-(\d+)$/);
    return match ? `N° ${match[1]}` : num;
  };

  return (
    <div
      onClick={() => onClick(displayOrder)}
      className={`bg-white rounded-xl border border-gray-100 shadow-sm mb-3 relative cursor-pointer hover:shadow-md transition-all active:scale-[0.99] overflow-hidden border-l-4 ${visual.borderLeft}`}
    >
      <div className='p-3 flex gap-3'>
        {/* --- COLONNE GAUCHE : Avatar --- */}
        <div className='mt-2'>
          <img
            src={clientLogos[displayOrder.client] || ''}
            alt={displayOrder.client}
            className='w-12 h-12 rounded-lg object-contain border border-gray-100 bg-gray-50'
          />
        </div>

        {/* --- COLONNE CENTRALE : Informations (4 Lignes maintenant) --- */}
        <div className='flex-1 min-w-0 flex flex-col justify-center gap-0.5'>
          {/* LIGNE 1 : Type de Document (EXPLICITE) */}
          <span
            className={`text-[10px] font-bold uppercase tracking-wide ${visual.badgeText}`}
          >
            {visual.docFullLabel}
          </span>

          {/* LIGNE 2 : Nom Client */}
          <h3 className='font-bold text-gray-900 text-[15px] leading-tight truncate'>
            {displayOrder.client}
          </h3>

          {/* LIGNE 3 : Métadonnées (Date | ID) */}
          <div className='flex items-center gap-2 text-[11px] font-medium text-gray-500 mt-0.5'>
            {/* ID (N° 001) */}
            <span className='text-gray-600 font-mono'>{getShortId()}</span>
            <span className='text-gray-300'>|</span>
            {/* Date */}
            <span
              className={`px-1.5 py-0.5 rounded ${
                daysUntil <= 0
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {relativeDate.label}
            </span>
          </div>

          {/* LIGNE 4 : Contenu Variable (Alerte / Progress / Poids) */}
          <div className='mt-1 flex flex-col gap-1'>
            {/* CAS A : Alerte Stock */}
            {visual.showStock && stockStatus && stockStatus !== 'IN_STOCK' ? (
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                  stockStatus === 'OUT_OF_STOCK'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                <AlertTriangle className='w-3 h-3' />
                <span>
                  {stockStatus === 'OUT_OF_STOCK'
                    ? 'Rupture de stock'
                    : 'Rupture partielle'}
                </span>
              </div>
            ) : /* CAS B : Progression (pour BP) */
            visual.showProgress &&
              unifiedOrder?.progressPercentage !== undefined ? (
              <>
                {/* Barre de progression */}
                <div className='flex items-center gap-2 w-full max-w-[140px]'>
                  <div className='flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-orange-500 rounded-full transition-all duration-500'
                      style={{ width: `${unifiedOrder.progressPercentage}%` }}
                    />
                  </div>
                  <span className='text-[10px] font-bold text-orange-600'>
                    {unifiedOrder.progressPercentage}%
                  </span>
                </div>
                {/* Info Standard en dessous de la progression */}
                <div className='flex items-center gap-3 text-[11px] text-gray-500'>
                  <span className='flex items-center gap-1'>
                    <Package className='w-3 h-3' /> {packagesCount} colis
                  </span>
                  <span className='flex items-center gap-1'>
                    <ShoppingBasket className='w-3 h-3' /> {itemsCount} art.
                  </span>
                  {estimatedWeight > 0 && (
                    <span className='flex items-center gap-1'>
                      <Scale className='w-3 h-3' /> ~{estimatedWeight}kg
                    </span>
                  )}
                </div>
              </>
            ) : (
              /* CAS C : Info Standard */
              <div className='flex items-center gap-3 text-[11px] text-gray-500'>
                <span className='flex items-center gap-1'>
                  <Package className='w-3 h-3' /> {packagesCount} colis
                </span>
                <span className='flex items-center gap-1'>
                  <ShoppingBasket className='w-3 h-3' /> {itemsCount} art.
                </span>
                {estimatedWeight > 0 && (
                  <span className='flex items-center gap-1'>
                    <Scale className='w-3 h-3' /> ~{estimatedWeight}kg
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- COLONNE DROITE : Statut & Preview --- */}
        <div className='flex flex-col items-end justify-between pl-2 border-l border-gray-50 min-w-[80px]'>
          <div
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide whitespace-nowrap mb-1 ${visual.badgeBg} ${visual.badgeText}`}
          >
            {visual.statusLabel}
          </div>

          <div className='flex items-end justify-end gap-2 mt-auto'>
            {productPreviews.length > 0 && (
              <div className='flex -space-x-2'>
                {productPreviews.slice(0, 2).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    className='w-5 h-5 rounded-full border border-white bg-gray-50 object-cover'
                    alt=''
                  />
                ))}
                {productPreviews.length > 2 && (
                  <div className='w-5 h-5 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500'>
                    +
                  </div>
                )}
              </div>
            )}
            <ChevronRight className='w-4 h-4 text-gray-300' />
          </div>
        </div>
      </div>
    </div>
  );
}
