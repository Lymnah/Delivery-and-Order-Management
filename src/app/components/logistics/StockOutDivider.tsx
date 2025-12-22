import React from 'react';
import { products } from '../../../data/database';
import type { UnifiedOrder } from '../../../data/database';

interface StockOutDividerProps {
  unifiedOrder: UnifiedOrder;
  productId: string; // The specific product that went out of stock
}

/**
 * Component to display a visual divider when stock runs out in projection mode.
 * Shows the product image, name, and "Stock Épuisé à partir d'ici" message.
 */
export default function StockOutDivider({
  unifiedOrder,
  productId,
}: StockOutDividerProps) {
  // Find the product that went out of stock
  const outOfStockProduct = products.find((p) => p.id === productId);

  if (!outOfStockProduct) {
    // Fallback: just show the message without product info
    return (
      <div className='flex items-center gap-2 my-4'>
        <div className='h-px bg-red-300 flex-1'></div>
        <span className='text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200 whitespace-nowrap'>
          Stock Épuisé à partir d'ici
        </span>
        <div className='h-px bg-red-300 flex-1'></div>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2 my-4'>
      {/* Left decorative line */}
      <div className='h-px bg-red-300 flex-1'></div>

      {/* Content: Product Image, Name, and Message */}
      <div className='flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex-shrink-0'>
        {/* Product Image */}
        {outOfStockProduct.imageUrl && (
          <img
            src={outOfStockProduct.imageUrl}
            alt={outOfStockProduct.name}
            className='w-8 h-8 rounded object-cover border border-red-300 flex-shrink-0'
          />
        )}

        {/* Product Name and Message */}
        <div className='flex items-center gap-2'>
          <span className='text-xs font-semibold text-red-900 whitespace-nowrap'>
            {outOfStockProduct.name}
          </span>
          <span className='text-xs font-bold text-red-600 whitespace-nowrap'>
            Stock Épuisé à partir d'ici
          </span>
        </div>
      </div>

      {/* Right decorative line */}
      <div className='h-px bg-red-300 flex-1'></div>
    </div>
  );
}

