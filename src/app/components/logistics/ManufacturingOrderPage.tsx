import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import ProductCard from '../ProductCard';

interface ManufacturingOrderPageProps {
  aggregatedProducts: Array<{
    product: any;
    quantity: number;
    deficit: number;
    orders: any[];
  }>;
  onBack: () => void;
  onConfirm: (quantities: Record<string, number>) => void;
}

export default function ManufacturingOrderPage({
  aggregatedProducts,
  onBack,
  onConfirm,
}: ManufacturingOrderPageProps) {
  const [manufacturingQuantities, setManufacturingQuantities] = useState<
    Record<string, number>
  >({});

  const handleQuantityChange = (productId: string, qty: number) => {
    setManufacturingQuantities({
      ...manufacturingQuantities,
      [productId]: qty,
    });
  };

  const handleConfirm = () => {
    // Filter out products with quantity 0
    const filteredQuantities = Object.fromEntries(
      Object.entries(manufacturingQuantities).filter(([_, qty]) => qty > 0)
    );
    onConfirm(filteredQuantities);
  };

  const hasProductsToManufacture = Object.values(manufacturingQuantities).some(
    (qty) => qty > 0
  );

  // Filter products that have a deficit or are selected for manufacturing
  const productsToShow = aggregatedProducts.filter(
    ({ product, deficit }) =>
      deficit > 0 ||
      (manufacturingQuantities[product.id] &&
        manufacturingQuantities[product.id] > 0)
  );

  return (
    <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
      <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] px-4 pt-4 overflow-y-auto pb-24'>
        {/* Header */}
        <div className='mb-4'>
          <button
            onClick={onBack}
            className='flex items-center gap-2 text-[#12895a] mb-3 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
          >
            <ChevronLeft className='w-5 h-5' />
            <span className='text-[14px] font-semibold'>Retour</span>
          </button>

          <h1 className='text-[24px] font-bold text-gray-900 mb-2'>
            Ordre de fabrication
          </h1>
          <p className='text-[14px] text-gray-600'>
            Ajustez la quantité à fabriquer pour chaque produit :
          </p>
        </div>

        {/* Products List */}
        {productsToShow.length > 0 ? (
          <div className='space-y-4 mb-6'>
            {productsToShow.map(
              ({ product, deficit, quantity, orders: productOrders }) => {
                const currentManufacturingQty =
                  manufacturingQuantities[product.id] ?? Math.max(0, deficit);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={quantity}
                    deficit={deficit}
                    orders={productOrders}
                    manufacturingMode={true}
                    currentManufacturingQty={currentManufacturingQty}
                    onManufacturingQtyChange={handleQuantityChange}
                  />
                );
              }
            )}
          </div>
        ) : (
          <div className='text-center py-8 text-gray-500'>
            <p className='text-[14px]'>
              Aucun produit nécessitant une fabrication
            </p>
          </div>
        )}
      </div>

      {/* Fixed Footer with Confirm Button */}
      {hasProductsToManufacture && (
        <div className='absolute bottom-[90px] left-0 w-[393px] px-4 py-3 bg-white border-t border-gray-200 z-40'>
          <button
            onClick={handleConfirm}
            className='w-full bg-[#12895a] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#107a4d] transition-colors'
          >
            <CheckCircle2 className='w-5 h-5' />
            Confirmer l'ordre de fabrication
          </button>
        </div>
      )}
    </div>
  );
}


