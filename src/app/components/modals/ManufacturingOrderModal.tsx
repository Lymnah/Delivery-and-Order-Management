import ProductCard from '../ProductCard';

interface ManufacturingOrderModalProps {
  aggregatedProducts: Array<{
    product: any;
    quantity: number;
    deficit: number;
    orders: any[];
  }>;
  manufacturingQuantities: Record<string, number>;
  onClose: () => void;
  onConfirm: () => void;
  onQuantityChange: (productId: string, qty: number) => void;
}

export default function ManufacturingOrderModal({
  aggregatedProducts,
  manufacturingQuantities,
  onClose,
  onConfirm,
  onQuantityChange,
}: ManufacturingOrderModalProps) {
  return (
    <div className='fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 bg-black/20'>
      <div className='bg-white rounded-lg p-6 w-[350px] max-h-[600px] overflow-y-auto shadow-xl z-50'>
        <h2 className='font-semibold text-[18px] mb-4'>Ordre de fabrication</h2>
        <p className='text-[12px] text-gray-600 mb-4'>
          Ajustez la quantité à fabriquer pour chaque produit :
        </p>
        <div className='space-y-4 mb-6'>
          {aggregatedProducts.map(
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
                  onManufacturingQtyChange={onQuantityChange}
                />
              );
            }
          )}
        </div>
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold'
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 bg-[#12895a] text-white py-2 rounded font-semibold'
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

