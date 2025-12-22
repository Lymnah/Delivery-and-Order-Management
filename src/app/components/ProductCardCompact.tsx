import { Package } from 'lucide-react';
import type { Product } from '../../data/database';

interface ProductCardCompactProps {
  product: Product;
  quantity: number; // Quantité à livrer
  stock: number; // Stock actuel
  onClick: () => void; // Handler pour le clic qui transforme en ProductCard complet
}

export default function ProductCardCompact({
  product,
  quantity,
  stock,
  onClick,
}: ProductCardCompactProps) {
  return (
    <div
      onClick={onClick}
      className='border border-gray-300 rounded-lg p-2.5 cursor-pointer hover:border-gray-400 transition-colors'
    >
      <div className='flex items-center gap-2.5'>
        {/* Product Image */}
        <div className='w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden'>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <Package className='w-5 h-5 text-gray-400' />
          )}
        </div>

        {/* Product Information */}
        <div className='flex-1 min-w-0'>
          <p className='font-semibold text-[14px] text-gray-900 truncate'>
            {product.name}
          </p>
          <div className='flex items-center gap-2 mt-0.5'>
            <span className='text-[11px] text-gray-600'>
              À livrer:{' '}
              <span className='font-semibold text-gray-900'>{quantity}</span> u
            </span>
            <span className='text-[11px] text-gray-600'>
              Stock:{' '}
              <span
                className={`font-semibold ${
                  quantity <= stock ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {stock} u
              </span>
            </span>
            {quantity <= stock ? (
              <span className='text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-md font-semibold whitespace-nowrap ml-auto'>
                OK
              </span>
            ) : (
              <span className='text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded-md font-semibold whitespace-nowrap ml-auto'>
                Manque {quantity - stock} u
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
