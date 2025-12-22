import React from 'react';
import {
  Package,
  CheckCircle2,
  AlertCircle,
  Circle,
  ScanLine,
} from 'lucide-react';
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
  const progressPercent = Math.min(
    100,
    Math.round((scannedQuantity / requiredQuantity) * 100)
  );

  // Configuration Visuelle Compacte
  const stateConfig = {
    'not-prepared': {
      icon: Circle,
      statusColor: 'bg-gray-200', // Barre de progression
      textColor: 'text-gray-500',
      borderColor: 'border-l-gray-300',
      lightBg: 'bg-gray-50',
    },
    'partially-prepared': {
      icon: AlertCircle,
      statusColor: 'bg-orange-500',
      textColor: 'text-orange-600',
      borderColor: 'border-l-orange-500',
      lightBg: 'bg-orange-50',
    },
    'fully-prepared': {
      icon: CheckCircle2,
      statusColor: 'bg-green-500',
      textColor: 'text-green-600',
      borderColor: 'border-l-green-500',
      lightBg: 'bg-green-50',
    },
  };

  const config = stateConfig[preparationState];
  const StateIcon = config.icon;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-100 shadow-sm p-3 border-l-4 ${config.borderColor}`}
    >
      <div className='flex gap-3'>
        {/* Image Produit (Plus petite) */}
        <div className='w-10 h-10 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden'>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <Package className='w-5 h-5 text-gray-300' />
          )}
        </div>

        {/* Contenu Principal */}
        <div className='flex-1 min-w-0'>
          {/* Header: Nom + Compteur */}
          <div className='flex justify-between items-start mb-1.5'>
            <h4 className='font-bold text-gray-900 text-sm truncate pr-2'>
              {product.name}
            </h4>
            <div className='text-xs font-medium whitespace-nowrap'>
              <span
                className={
                  preparationState === 'fully-prepared'
                    ? 'text-green-600'
                    : 'text-gray-900'
                }
              >
                {scannedQuantity}
              </span>
              <span className='text-gray-400'> / {requiredQuantity}</span>
            </div>
          </div>

          {/* Barre de Progression */}
          <div className='w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2'>
            <div
              className={`h-full rounded-full transition-all duration-300 ${config.statusColor}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Zone des Lots (Affichage horizontal en Chips) */}
          {scannedLots.length > 0 ? (
            <div className='flex flex-col gap-1.5'>
              {scannedLots.map((lot, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between w-full px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200'
                >
                  <div className='flex items-center gap-1'>
                    <ScanLine className='w-3 h-3 opacity-50' />
                    <span className='font-mono'>{lot.lotNumber}</span>
                  </div>
                  <span className='font-bold'>{lot.quantity}</span>
                </div>
              ))}
            </div>
          ) : (
            // Message vide discret si rien scanné
            <p className='text-[10px] text-gray-400 italic'>Aucun lot scanné</p>
          )}
        </div>
      </div>
    </div>
  );
}
