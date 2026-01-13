import React from 'react';
import { Package, ScanLine } from 'lucide-react';
import type { Product, ScannedLot } from '../../../data/database';

interface ProductDeliveryCardProps {
  product: Product;
  deliveredQuantity: number;
  scannedLots: ScannedLot[];
}

export default function ProductDeliveryCard({
  product,
  deliveredQuantity,
  scannedLots,
}: ProductDeliveryCardProps) {
  const scannedQuantity = scannedLots.reduce(
    (sum, lot) => sum + lot.quantity,
    0
  );
  const lotCount = scannedLots.length;

  // Configuration visuelle - Vert pour les BL (livraison)
  const borderColor = 'border-l-green-500';

  return (
    <div
      className={`bg-white rounded-lg border border-gray-100 shadow-sm p-3 border-l-4 ${borderColor}`}
    >
      <div className='flex gap-3'>
        {/* Image Produit */}
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
          {/* Header: Nom du produit */}
          <div className='mb-1.5'>
            <h4 className='font-bold text-gray-900 text-sm truncate'>
              {product.name}
            </h4>
          </div>

          {/* Informations de quantité */}
          <div className='space-y-0.5 mb-2'>
            <p className='text-[11px] text-gray-600'>
              Quantité livrée: <span className='font-semibold'>{deliveredQuantity} u</span>
            </p>
            {lotCount > 0 && (
              <p className='text-[11px] text-gray-600'>
                Quantité scannée: <span className='font-semibold'>{scannedQuantity} u</span> (
                {lotCount} lot{lotCount > 1 ? 's' : ''})
              </p>
            )}
          </div>

          {/* Zone des Lots (Affichage horizontal en Chips) */}
          {scannedLots.length > 0 ? (
            <div className='mt-2 pt-2 border-t border-gray-200'>
              <p className='text-[10px] font-semibold text-gray-600 mb-1.5'>
                Lots scannés:
              </p>
              <div className='flex flex-wrap gap-1.5'>
                {scannedLots.map((lot, index) => (
                  <div
                    key={index}
                    className='inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200'
                  >
                    <ScanLine className='w-3 h-3 mr-1 opacity-50' />
                    <span className='font-mono'>{lot.lotNumber}</span>
                    <span className='mx-1 text-gray-300'>|</span>
                    <span className='font-bold'>{lot.quantity} u</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Message vide discret si rien scanné
            <p className='text-[10px] text-gray-400 italic mt-2'>
              Aucun lot scanné
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

