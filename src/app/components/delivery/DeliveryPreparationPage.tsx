import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  products,
  clientLogos,
  getDeliveryPreparation,
  updateDeliveryPreparation,
  resetProductLots,
} from '../../../data/database';
import type {
  Order,
  ScannedLot,
  DeliveryNoteStatus,
} from '../../../data/database';
import ProductPreparationCard from './ProductPreparationCard';

type PreparationState =
  | 'not-prepared'
  | 'partially-prepared'
  | 'fully-prepared';

interface DeliveryPreparationPageProps {
  order: Order;
  onBack: () => void;
  onValidationComplete?: () => void;
}

export default function DeliveryPreparationPage({
  order,
  onBack,
  onValidationComplete,
}: DeliveryPreparationPageProps) {
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const lotsPlanRef = useRef<Record<string, 1 | 2>>({});

  // Get delivery preparation state
  const [preparation, setPreparation] = useState(() =>
    getDeliveryPreparation(order.id)
  );

  // Initialize lots plan once per order
  useEffect(() => {
    if (!order?.items?.length) return;

    for (const item of order.items) {
      if (!lotsPlanRef.current[item.productId]) {
        lotsPlanRef.current[item.productId] = Math.random() < 0.6 ? 1 : 2;
      }
    }
  }, [order.id]);

  // Reset Tapenade Noire lots on mount (for demo purposes)
  useEffect(() => {
    resetProductLots('1'); // Tapenade Noire product ID
    // Refresh preparation state after reset
    setPreparation(getDeliveryPreparation(order.id));
  }, [order.id]);

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
    return order.items.every((item) => {
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
    const notPreparedItems = order.items.filter((item) => {
      const state = getProductPreparationState(item.productId, item.quantity);
      return state === 'not-prepared';
    });

    const partiallyPreparedItems = order.items.filter((item) => {
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
      // Plan atteint, on force le dernier lot à compléter si besoin
      // ou on bloque pour respecter max 2 lots
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

    const newLot: ScannedLot = {
      productId: product.id,
      lotNumber,
      quantity: quantityToAdd,
      scannedAt: new Date(),
    };

    const updatedLots = [...preparation.scannedLots, newLot];
    const updatedStatus: DeliveryNoteStatus =
      preparation.status === 'À préparer'
        ? 'En préparation'
        : preparation.status;

    const updatedPreparation = {
      ...preparation,
      scannedLots: updatedLots,
      status: updatedStatus,
    };

    updateDeliveryPreparation(order.id, updatedPreparation);
    setPreparation(updatedPreparation);

    setScanSuccess(`${product.name}: +${quantityToAdd} u (Lot: ${lotNumber})`);
  };

  // Validate delivery
  const validateDelivery = () => {
    if (!isDeliveryReady()) return;

    const updatedPreparation = {
      ...preparation,
      status: 'Prêt à expédier' as DeliveryNoteStatus,
      preparedAt: new Date(),
    };

    updateDeliveryPreparation(order.id, updatedPreparation);
    setPreparation(updatedPreparation);
    setIsValidated(true);

    // Show confirmation and navigate back after 2 seconds
    setTimeout(() => {
      if (onValidationComplete) {
        onValidationComplete();
      }
    }, 2000);
  };

  // Calculate progress
  const preparedCount = order.items.filter((item) => {
    const state = getProductPreparationState(item.productId, item.quantity);
    return state === 'fully-prepared';
  }).length;
  const totalCount = order.items.length;
  const progressPercentage =
    totalCount > 0 ? (preparedCount / totalCount) * 100 : 0;

  // Group products by preparation state
  const notPreparedItems = order.items.filter((item) => {
    const state = getProductPreparationState(item.productId, item.quantity);
    return state === 'not-prepared';
  });
  const partiallyPreparedItems = order.items.filter((item) => {
    const state = getProductPreparationState(item.productId, item.quantity);
    return state === 'partially-prepared';
  });
  const fullyPreparedItems = order.items.filter((item) => {
    const state = getProductPreparationState(item.productId, item.quantity);
    return state === 'fully-prepared';
  });

  // Status badge configuration
  const statusConfig = {
    'À préparer': {
      label: 'À préparer',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      icon: AlertCircle,
    },
    'En préparation': {
      label: 'En préparation',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      icon: AlertCircle,
    },
    'Prêt à expédier': {
      label: 'Prêt à expédier',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: CheckCircle2,
    },
    Expédié: {
      label: 'Expédié',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: Package,
    },
    Livré: {
      label: 'Livré',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      icon: CheckCircle2,
    },
    Facturé: {
      label: 'Facturé',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      icon: CheckCircle2,
    },
  };

  const currentStatusConfig = statusConfig[preparation.status];
  const StatusIcon = currentStatusConfig.icon;

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

        {/* Order Header */}
        <div className='flex items-start justify-between mb-3 pb-3 border-b border-gray-200'>
          <div className='flex-1'>
            <h2 className='font-semibold text-[16px] leading-tight mb-1'>
              {order.client}
            </h2>
            <p className='text-[11px] text-gray-600 leading-tight'>
              {order.number} • {order.type}
            </p>
          </div>
          <img
            src={clientLogos[order.client] || ''}
            alt=''
            className='w-10 h-10 rounded object-cover flex-shrink-0'
          />
        </div>

        {/* Status Badge */}
        <div className='mb-3'>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentStatusConfig.bgColor} ${currentStatusConfig.textColor}`}
          >
            <StatusIcon className='w-4 h-4' />
            <span className='text-[12px] font-semibold'>
              {currentStatusConfig.label}
            </span>
          </div>
        </div>

        {/* Global Progress Indicator */}
        <div className='mb-3'>
          <div className='flex items-center justify-between mb-1.5'>
            <p className='text-[12px] font-semibold text-gray-700'>
              {preparedCount} / {totalCount} produits préparés
            </p>
            <span className='text-[11px] text-gray-600'>
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2.5'>
            <div
              className='bg-[#12895a] h-2.5 rounded-full transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scanning Button Section */}
      {!isValidated && (
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
              ⚠ {scanError}
            </p>
          )}
          {scanSuccess && (
            <p className='mt-2 text-[12px] text-green-600 font-medium'>
              ✓ {scanSuccess}
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
              ✓ Bon de livraison prêt à expédier
            </p>
            <p className='text-[11px] text-green-600'>Retour à la liste...</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
