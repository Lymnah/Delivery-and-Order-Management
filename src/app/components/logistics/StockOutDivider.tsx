import React from 'react';
import { products } from '../../../data/database';
import type { UnifiedOrder } from '../../../data/database';

interface StockOutDividerProps {
  unifiedOrder: UnifiedOrder;
  productIds: string[]; // Array of product IDs that went out of stock
}

/**
 * Component to display a visual divider when stock runs out in projection mode.
 * Shows the product images, names, and "Stock Épuisé à partir d'ici" message.
 * Groups multiple products in a single divider.
 */
export default function StockOutDivider({
  unifiedOrder,
  productIds,
}: StockOutDividerProps) {
  // Find all products that went out of stock
  const outOfStockProducts = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (outOfStockProducts.length === 0) {
    // Fallback: just show the message without product info
    return (
      <div className='flex items-center gap-2 my-4 w-full'>
        <div className='h-px bg-red-300 flex-1'></div>
        <span className='text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200 whitespace-nowrap'>
          Stock Épuisé à partir d'ici
        </span>
        <div className='h-px bg-red-300 flex-1'></div>
      </div>
    );
  }

  return (
    <div className='my-4 w-full'>
      {/* Content: Title and Products */}
      <div className='bg-red-50 border border-red-200 rounded-lg px-3 py-2 w-full'>
        {/* Ligne 1: Title */}
        <div className='mb-2'>
          <span className='text-xs font-bold text-red-600'>
            Stock Épuisé à partir d'ici
          </span>
        </div>

        {/* Lignes suivantes: Products (photo + nom) */}
        <div className='space-y-1.5'>
          {outOfStockProducts.map((product) => (
            <div key={product.id} className='flex items-center gap-2'>
              {/* Product Image */}
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className='w-8 h-8 rounded object-cover border border-red-300 flex-shrink-0'
                />
              ) : (
                <div className='w-8 h-8 rounded bg-red-100 border border-red-300 flex items-center justify-center flex-shrink-0'>
                  <span className='text-[8px] font-bold text-red-600'>
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}

              {/* Product Name */}
              <span className='text-xs font-semibold text-red-900'>
                {product.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
