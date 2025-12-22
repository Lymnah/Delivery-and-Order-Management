import React from 'react';
import { Package, CheckCircle2, AlertCircle, Circle } from 'lucide-react';
import type { Product, ScannedLot } from '../../../data/database';

type PreparationState =
  | 'not-prepared'
  | 'partially-prepared'
  | 'fully-prepared';

interface ProductPreparationCardProps {
  product: Product;
  requiredQuantity: number;
  scannedLots: ScannedLot[];
  preparationState: PreparationState;
}

export default function ProductPreparationCard({
  product,
  requiredQuantity,
  scannedLots,
  preparationState,
}: ProductPreparationCardProps) {
  const scannedQuantity = scannedLots.reduce(
    (sum, lot) => sum + lot.quantity,
    0
  );
  const remainingQuantity = Math.max(0, requiredQuantity - scannedQuantity);

  // State configuration
  const stateConfig = {
    'not-prepared': {
      icon: Circle,
      label: 'Non préparé',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-700',
      iconColor: 'text-gray-400',
    },
    'partially-prepared': {
      icon: AlertCircle,
      label: `Partiellement préparé (${scannedQuantity} / ${requiredQuantity})`,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-500',
    },
    'fully-prepared': {
      icon: CheckCircle2,
      label: `Prêt (${scannedQuantity} / ${requiredQuantity})`,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-700',
      iconColor: 'text-green-500',
    },
  };

  const config = stateConfig[preparationState];
  const StateIcon = config.icon;

  return (
    <div
      className={`border rounded-lg p-3 ${config.bgColor} ${config.borderColor}`}
    >
      <div className='flex items-start gap-3'>
        {/* Product Image */}
        <div className='w-12 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden'>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <Package className='w-6 h-6 text-gray-400' />
          )}
        </div>

        {/* Product Information */}
        <div className='flex-1 min-w-0'>
          {/* Product Name */}
          <p className='font-semibold text-[15px] text-gray-900 mb-1'>
            {product.name}
          </p>

          {/* Required Quantity */}
          <div className='mb-2'>
            <span className='text-[12px] text-gray-600'>
              Quantité requise:{' '}
              <span className='font-semibold text-gray-900'>
                {requiredQuantity} u
              </span>
            </span>
          </div>

          {/* Preparation State Badge */}
          <div className='flex items-center gap-2 mb-2'>
            <StateIcon className={`w-4 h-4 ${config.iconColor}`} />
            <span className={`text-[11px] font-semibold ${config.textColor}`}>
              {config.label}
            </span>
          </div>

          {/* Remaining Quantity (if partially prepared) */}
          {preparationState === 'partially-prepared' &&
            remainingQuantity > 0 && (
              <div className='mb-2'>
                <span className='text-[11px] text-orange-700 font-medium'>
                  Reste à scanner: {remainingQuantity} u
                </span>
              </div>
            )}

          {/* Scanned Lots Section */}
          {scannedLots.length > 0 && (
            <div className='mt-2 pt-2 border-t border-gray-200'>
              <p className='text-[10px] font-semibold text-gray-600 mb-1.5'>
                Lots scannés ({scannedLots.length}):
              </p>
              <div className='space-y-1'>
                {scannedLots.map((lot, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between bg-white rounded px-2 py-1 text-[10px]'
                  >
                    <span className='font-medium text-gray-700'>
                      {lot.lotNumber}
                    </span>
                    <span className='text-gray-600'>{lot.quantity} u</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
