import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  Package,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import {
  products,
  clientLogos,
  scanLotOnDeliveryNote,
  completePreparation,
  getDeliveryNote,
  type DeliveryNote,
  type DeliveryNoteStatus,
  type SalesOrderStatus,
  type ScannedLot,
} from '../../../data/database';
import ProductPreparationCard from './ProductPreparationCard';
import {
  getStatusBadgeColor,
  getDeliveryNoteStatusLabelFr,
} from '../../utils/statusHelpers';

type PreparationState =
  | 'not-prepared'
  | 'partially-prepared'
  | 'fully-prepared';

interface DeliveryPreparationPageProps {
  deliveryNote?: DeliveryNote;
  onBack: () => void;
  onValidationComplete?: (deliveryNoteId?: string) => void;
  onStatusUpdate?: (
    orderId: string,
    newStatus: DeliveryNoteStatus | SalesOrderStatus
  ) => void;
  onRedirectToStockCheck?: () => void;
  onRedirectToDetails?: () => void;
  onViewSalesOrder?: (salesOrderId: string) => void;
}

export default function DeliveryPreparationPage({
  deliveryNote,
  onBack,
  onValidationComplete,
  onStatusUpdate,
  onRedirectToStockCheck,
  onRedirectToDetails,
  onViewSalesOrder,
}: DeliveryPreparationPageProps) {
  // Check if we have a valid delivery note
  if (!deliveryNote) {
    return (
      <div className='flex flex-col h-full min-h-0 items-center justify-center p-4'>
        <p className='text-red-600 font-semibold mb-2'>Accès non autorisé</p>
        <p className='text-gray-600 text-sm text-center mb-4'>
          Cette page est uniquement accessible pour les bons de livraison (BL).
        </p>
        <button
          onClick={onBack}
          className='px-4 py-2 bg-[#12895a] text-white rounded-lg font-semibold'
        >
          Retour
        </button>
      </div>
    );
  }

  // Read-only when status is not IN_PREPARATION
  const isReadOnly = deliveryNote.status !== 'IN_PREPARATION';

  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const lotsPlanRef = useRef<Record<string, 1 | 2>>({});

  // Preparation state from DeliveryNote
  const [preparation, setPreparation] = useState(() => ({
    scannedLots: deliveryNote.scannedLots,
    status: deliveryNote.status,
  }));

  // Order items from DeliveryNote lines
  const orderItems = deliveryNote.lines;

  // Status colors and label
  const statusColors = getStatusBadgeColor(deliveryNote.status, 'BL');
  const statusLabel = getDeliveryNoteStatusLabelFr(deliveryNote.status);

  // Initialize lots plan once per order
  useEffect(() => {
    if (!orderItems?.length) return;

    for (const item of orderItems) {
      if (!lotsPlanRef.current[item.productId]) {
        lotsPlanRef.current[item.productId] = Math.random() < 0.6 ? 1 : 2;
      }
    }
  }, [orderItems]);

  // Helper: Get product preparation state
  const getProductPreparationState = (
    productId: string,
    requiredQuantity: number
  ): PreparationState => {
    const productLots = preparation.scannedLots.filter(
      (lot) => lot.productId === productId
    );
    const scannedQuantity = productLots.reduce(
      (sum, lot) => sum + lot.quantity,
      0
    );

    if (scannedQuantity === 0) return 'not-prepared';
    if (scannedQuantity >= requiredQuantity) return 'fully-prepared';
    return 'partially-prepared';
  };

  // Helper: Get scanned quantity for a product
  const getScannedQuantity = (productId: string): number => {
    return preparation.scannedLots
      .filter((lot) => lot.productId === productId)
      .reduce((sum, lot) => sum + lot.quantity, 0);
  };

  // Helper: Get remaining quantity for a product
  const getRemainingQuantity = (
    productId: string,
    requiredQuantity: number
  ): number => {
    const scanned = getScannedQuantity(productId);
    return Math.max(0, requiredQuantity - scanned);
  };

  // Helper: Check if delivery is ready
  const isDeliveryReady = (): boolean => {
    return orderItems.every((item) => {
      const state = getProductPreparationState(item.productId, item.quantity);
      return state === 'fully-prepared';
    });
  };

  // Simulate scan with lot plan logic
  const simulateScan = () => {
    if (isValidated) return;

    setScanError(null);
    setScanSuccess(null);

    // Get products by preparation state
    const notPreparedItems = orderItems.filter((item) => {
      const state = getProductPreparationState(item.productId, item.quantity);
      return state === 'not-prepared';
    });

    const partiallyPreparedItems = orderItems.filter((item) => {
      const state = getProductPreparationState(item.productId, item.quantity);
      return state === 'partially-prepared';
    });

    // Pick item: prefer partially prepared, otherwise not prepared
    const pickItem = partiallyPreparedItems[0] ?? notPreparedItems[0];

    if (!pickItem) {
      setScanError('Tous les produits sont déjà préparés');
      return;
    }

    const product = products.find((p) => p.id === pickItem.productId);
    if (!product) {
      setScanError('Produit introuvable');
      return;
    }

    const requiredQty = pickItem.quantity;
    const scannedQty = getScannedQuantity(pickItem.productId);
    const remaining = Math.max(0, requiredQty - scannedQty);

    if (remaining === 0) {
      setScanError('Quantité déjà atteinte');
      return;
    }

    const productLots = preparation.scannedLots.filter(
      (lot) => lot.productId === pickItem.productId
    );

    const plan = lotsPlanRef.current[pickItem.productId] ?? 1;

    if (productLots.length >= plan) {
      setScanError('Limite de lots atteinte pour ce produit');
      return;
    }

    // Quantité ajoutée
    // Si plan = 1: on met tout en une fois
    // Si plan = 2:
    // - scan 1: on met une partie (min 1, max remaining-1)
    // - scan 2: on met tout le restant
    let quantityToAdd = remaining;

    if (plan === 2) {
      if (productLots.length === 0) {
        if (remaining === 1) {
          quantityToAdd = 1;
        } else {
          const min = Math.max(1, Math.floor(requiredQty * 0.3));
          const max = Math.max(1, remaining - 1);
          quantityToAdd = Math.min(
            max,
            Math.max(1, Math.floor(min + Math.random() * (max - min + 1)))
          );
        }
      } else {
        quantityToAdd = remaining;
      }
    }

    const lotNumber = `LOT-${product.id}-${Date.now()}`;

    try {
      scanLotOnDeliveryNote(
        deliveryNote.deliveryNoteId,
        product.id,
        lotNumber,
        quantityToAdd
      );
      // Refresh preparation state from DeliveryNote
      const updatedDeliveryNote = getDeliveryNote(
        deliveryNote.deliveryNoteId
      );
      if (updatedDeliveryNote) {
        setPreparation({
          scannedLots: updatedDeliveryNote.scannedLots,
          status: updatedDeliveryNote.status,
        });
      }
      setScanSuccess(
        `${product.name}: +${quantityToAdd} u (Lot: ${lotNumber})`
      );
    } catch (error) {
      setScanError((error as Error).message || 'Erreur lors du scan');
    }
  };

  // Validate delivery
  const validateDelivery = () => {
    if (!isDeliveryReady()) return;

    if (deliveryNote.status !== 'IN_PREPARATION') {
      setScanError('Le BL doit être en préparation');
      return;
    }

    try {
      completePreparation(deliveryNote.deliveryNoteId);
      setIsValidated(true);

      // Update status via callback
      if (onStatusUpdate) {
        onStatusUpdate(
          deliveryNote.deliveryNoteId,
          'PREPARED' as DeliveryNoteStatus
        );
      }

      // Show confirmation and navigate after 2 seconds
      setTimeout(() => {
        if (onValidationComplete) {
          onValidationComplete(deliveryNote.deliveryNoteId);
        }
      }, 2000);
    } catch (error) {
      setScanError(
        (error as Error).message || 'Erreur lors de la validation'
      );
    }
  };

  // Calculate progress
  const preparedCount = orderItems.filter((item) => {
    const state = getProductPreparationState(item.productId, item.quantity);
    return state === 'fully-prepared';
  }).length;
  const totalCount = orderItems.length;
  const progressPercentage =
    totalCount > 0 ? (preparedCount / totalCount) * 100 : 0;

  // Group products by preparation state
  const notPreparedItems = orderItems.filter((item) => {
    const state = getProductPreparationState(item.productId, item.quantity);
    return state === 'not-prepared';
  });
  const partiallyPreparedItems = orderItems.filter((item) => {
    const state = getProductPreparationState(item.productId, item.quantity);
    return state === 'partially-prepared';
  });
  const fullyPreparedItems = orderItems.filter((item) => {
    const state = getProductPreparationState(item.productId, item.quantity);
    return state === 'fully-prepared';
  });

  return (
    <div className='flex flex-col h-full min-h-0'>
      {/* Fixed Header Section */}
      <div className='flex-shrink-0 bg-white border-b border-gray-200'>
        {/* Back button */}
        <button
          onClick={onBack}
          className='flex items-center gap-2 text-[#12895a] mb-2 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
        >
          <ChevronLeft className='w-4 h-4' />
          <span className='text-[13px] font-semibold'>Retour</span>
        </button>

        {/* Order Header - Single line layout */}
        <div className='flex items-center gap-3 mb-3 pb-3 border-b border-gray-200'>
          {/* Logo à gauche */}
          <img
            src={clientLogos[deliveryNote.client] || ''}
            alt=''
            className='w-10 h-10 rounded object-cover flex-shrink-0'
          />

          {/* Infos au centre */}
          <div className='flex-1 min-w-0'>
            <h2 className='font-semibold text-[15px] leading-tight truncate'>
              {deliveryNote.client}
            </h2>
            <p className='text-[11px] text-gray-600 leading-tight truncate'>
              {deliveryNote.number} &bull; BL
            </p>
          </div>

          {/* Bouton à droite */}
          <button
            onClick={() => {
              if (onViewSalesOrder) {
                onViewSalesOrder(deliveryNote.salesOrderId);
              }
            }}
            className='text-[11px] text-[#12895a] font-semibold hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0'
          >
            <ArrowLeft className='w-3 h-3' />
            Voir BC parent
          </button>
        </div>

        {/* Status Badge and Progress on same line */}
        <div className='mb-3 flex items-center gap-3'>
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap flex-shrink-0 ${statusColors.bg} ${statusColors.text}`}
          >
            {statusLabel}
          </span>

          {/* Global Progress Indicator - Compact */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-[11px] font-semibold text-gray-700 whitespace-nowrap'>
                {preparedCount} / {totalCount} produits
              </span>
              <span className='text-[10px] text-gray-600 whitespace-nowrap'>
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-[#12895a] h-2 rounded-full transition-all duration-300'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scanning Button Section */}
      {!isValidated &&
        !isReadOnly &&
        deliveryNote.status === 'IN_PREPARATION' && (
          <div className='flex-shrink-0 bg-white border-b border-gray-200 p-3'>
            <button
              type='button'
              onClick={() => {
                setIsScanModalOpen(true);
                setScanError(null);
                setScanSuccess(null);

                setTimeout(() => {
                  setIsScanModalOpen(false);
                  simulateScan();
                }, 650);
              }}
              className='w-full py-3 rounded-lg font-semibold text-[14px] bg-[#12895a] text-white hover:bg-[#107a4d] transition-all'
            >
              Scanner
            </button>

            {scanError && (
              <p className='mt-2 text-[12px] text-red-600 font-medium'>
                {scanError}
              </p>
            )}
            {scanSuccess && (
              <p className='mt-2 text-[12px] text-green-600 font-medium'>
                {scanSuccess}
              </p>
            )}
          </div>
        )}

      {/* Scrollable Product List */}
      <div className='flex-1 overflow-y-auto min-h-0'>
        <div className='p-3 space-y-4 pb-4'>
          {/* Not Prepared Section */}
          {notPreparedItems.length > 0 && (
            <div>
              <h3 className='text-[12px] font-semibold text-gray-600 mb-2'>
                Non préparés ({notPreparedItems.length})
              </h3>
              <div className='space-y-2'>
                {notPreparedItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  const productLots = preparation.scannedLots.filter(
                    (lot) => lot.productId === item.productId
                  );

                  return (
                    <ProductPreparationCard
                      key={item.productId}
                      product={product}
                      requiredQuantity={item.quantity}
                      scannedLots={productLots}
                      preparationState={getProductPreparationState(
                        item.productId,
                        item.quantity
                      )}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Partially Prepared Section */}
          {partiallyPreparedItems.length > 0 && (
            <div>
              <h3 className='text-[12px] font-semibold text-gray-600 mb-2'>
                Partiellement préparés ({partiallyPreparedItems.length})
              </h3>
              <div className='space-y-2'>
                {partiallyPreparedItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  const productLots = preparation.scannedLots.filter(
                    (lot) => lot.productId === item.productId
                  );

                  return (
                    <ProductPreparationCard
                      key={item.productId}
                      product={product}
                      requiredQuantity={item.quantity}
                      scannedLots={productLots}
                      preparationState={getProductPreparationState(
                        item.productId,
                        item.quantity
                      )}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Fully Prepared Section */}
          {fullyPreparedItems.length > 0 && (
            <div>
              <h3 className='text-[12px] font-semibold text-gray-600 mb-2'>
                Prêts ({fullyPreparedItems.length})
              </h3>
              <div className='space-y-2'>
                {fullyPreparedItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  const productLots = preparation.scannedLots.filter(
                    (lot) => lot.productId === item.productId
                  );

                  return (
                    <ProductPreparationCard
                      key={item.productId}
                      product={product}
                      requiredQuantity={item.quantity}
                      scannedLots={productLots}
                      preparationState={getProductPreparationState(
                        item.productId,
                        item.quantity
                      )}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scan Modal */}
      {isScanModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='bg-white rounded-xl p-4 w-[280px] text-center'>
            <p className='text-[13px] font-semibold text-gray-900 mb-2'>
              Caméra
            </p>
            <p className='text-[12px] text-gray-600'>Scan en cours...</p>
            <div className='mt-3 h-2 bg-gray-200 rounded-full overflow-hidden'>
              <div className='h-2 bg-[#12895a] w-2/3 rounded-full animate-pulse' />
            </div>
          </div>
        </div>
      )}

      {/* Fixed Footer with Validation Button */}
      <div className='flex-shrink-0 pt-3 pb-4 bg-white border-t border-gray-200 px-3'>
        {isValidated ? (
          <div className='bg-green-50 border border-green-200 rounded-lg p-3 text-center'>
            <p className='text-[13px] font-semibold text-green-700 mb-1'>
              Bon de livraison préparé
            </p>
            <p className='text-[11px] text-green-600'>Retour à la liste...</p>
          </div>
        ) : isReadOnly ? (
          <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 text-center'>
            <p className='text-[13px] font-semibold text-gray-700 mb-1'>
              {deliveryNote.status === 'PREPARED' &&
                'Bon de livraison préparé'}
              {deliveryNote.status === 'SHIPPED' &&
                'Bon de livraison expédié'}
            </p>
            <p className='text-[11px] text-gray-600'>
              Aucune action disponible à ce statut
            </p>
          </div>
        ) : (
          deliveryNote.status === 'IN_PREPARATION' && (
            <button
              onClick={validateDelivery}
              disabled={!isDeliveryReady()}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all ${
                isDeliveryReady()
                  ? 'bg-[#12895a] text-white hover:bg-[#107a4d]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className='w-5 h-5' />
              Valider le bon de livraison
            </button>
          )
        )}
      </div>
    </div>
  );
}
