import { Package } from 'lucide-react';
import svgPathsStock from '../../imports/svg-gt4hwy99w6';
import type { Product, Order } from '../../data/database';

interface ProductCardProps {
  product: Product;
  quantity: number; // Quantité à livrer
  deficit: number; // Quantité manquante
  orders: Order[]; // Commandes contenant ce produit
  onCardClick?: () => void; // Handler pour le clic sur la carte
  onDocumentsClick?: (e: React.MouseEvent) => void; // Handler pour le bouton documents
  // Manufacturing mode props (optionnel)
  manufacturingMode?: boolean;
  currentManufacturingQty?: number; // Quantité actuellement sélectionnée pour fabrication
  onManufacturingQtyChange?: (productId: string, quantity: number) => void; // Handler pour changer la quantité
}

export default function ProductCard({
  product,
  quantity,
  deficit,
  orders,
  onCardClick,
  onDocumentsClick,
  manufacturingMode = false,
  currentManufacturingQty = 0,
  onManufacturingQtyChange,
}: ProductCardProps) {
  // Calculate slider values for manufacturing mode
  const maxManufacturing = product.stockMax - product.stock;
  const stockStartPercent = (product.stock / product.stockMax) * 80;
  const stockEndPercent = 80;
  const rangePercent = stockEndPercent - stockStartPercent;
  const sliderProgress =
    manufacturingMode && maxManufacturing > 0
      ? currentManufacturingQty / maxManufacturing
      : 0;
  const thumbPositionPercent = stockStartPercent + rangePercent * sliderProgress;
  const orangeBarWidth = thumbPositionPercent - stockStartPercent;

  return (
    <div
      className={`border border-gray-300 rounded-lg p-4 ${
        manufacturingMode
          ? '' // Pas de cursor-pointer en mode manufacturing
          : 'relative cursor-pointer hover:border-gray-400 transition-colors'
      }`}
      onClick={manufacturingMode ? undefined : onCardClick}
    >
      <div className={`flex flex-col ${manufacturingMode ? 'gap-3' : 'gap-2'}`}>
        {/* First row: Image + Info + Badge */}
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
          <div className='flex-1 min-w-0 space-y-1.5'>
            {/* Line 1: Product name + Badge */}
            <div
              className={
                manufacturingMode
                  ? 'flex items-center justify-between gap-3'
                  : ''
              }
            >
              <p className='font-semibold text-[16px] text-gray-900'>
                {product.name}
              </p>
              {manufacturingMode && (
                <div className='bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-md text-[12px] font-semibold whitespace-nowrap'>
                  Fabriquer: {currentManufacturingQty} u
                </div>
              )}
            </div>

            {/* Line 2: À livrer + Manque */}
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='text-[12px] text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md font-medium whitespace-nowrap'>
                À livrer{' '}
                <span className='font-semibold text-gray-900'>{quantity}</span> u
              </span>

              {deficit > 0 ? (
                <span className='text-[12px] text-red-700 bg-red-50 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap'>
                  Manque {deficit} u
                </span>
              ) : (
                <span className='text-[12px] text-green-700 bg-green-50 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap'>
                  OK
                </span>
              )}
            </div>
          </div>

          {/* Right badge: Documents (normal mode) or nothing (manufacturing mode) */}
          {!manufacturingMode && (
            <div className='text-right flex-shrink-0'>
              <button
                onClick={onDocumentsClick || onCardClick}
                className='bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-semibold hover:bg-blue-200 transition-colors'
              >
                {orders.length} doc(s)
              </button>
            </div>
          )}
        </div>

        {/* Second row: Stock Bar - Full width */}
        <div className='flex gap-4 pt-2 items-center w-full'>
          <div className={`relative flex-1 ${manufacturingMode ? 'h-[50px]' : 'h-[43px]'}`}>
            {/* Base slider bar */}
            <div
              className={`absolute h-[5px] left-0 w-full ${
                manufacturingMode ? 'bottom-[37px]' : 'bottom-[30px]'
              }`}
            >
              <div className='absolute bg-[#f5f5f6] inset-0 rounded' />
              {/* Current stock (green/red) */}
              <div
                className={`absolute h-[5px] left-0 top-0 rounded ${
                  product.stock < product.stockMin
                    ? 'bg-[#ea580c]'
                    : 'bg-[#16a34a]'
                }`}
                style={{
                  width: `${Math.min(
                    80,
                    (product.stock / product.stockMax) * 80
                  )}%`,
                }}
              />
              {/* Manufacturing quantity to add (orange) - only in manufacturing mode */}
              {manufacturingMode && (
                <div
                  className='absolute h-[5px] top-0 rounded bg-orange-500'
                  style={{
                    left: `${stockStartPercent}%`,
                    width: `${orangeBarWidth}%`,
                  }}
                />
              )}
            </div>

            {/* Interactive slider - only in manufacturing mode */}
            {manufacturingMode && onManufacturingQtyChange && (
              <>
                <input
                  type='range'
                  min='0'
                  max={maxManufacturing}
                  value={currentManufacturingQty}
                  onChange={(e) => {
                    onManufacturingQtyChange(
                      product.id,
                      parseInt(e.target.value)
                    );
                  }}
                  className='absolute bottom-[30px] h-[20px] opacity-0 cursor-pointer z-10'
                  style={{
                    left: `${stockStartPercent}%`,
                    width: `${stockEndPercent - stockStartPercent}%`,
                  }}
                />

                {/* Slider thumb indicator */}
                <div
                  className='absolute bottom-[32px] w-4 h-4 bg-orange-500 border-2 border-white rounded-full shadow-lg pointer-events-none z-20'
                  style={{
                    left: `${thumbPositionPercent}%`,
                    transform: 'translateX(-50%)',
                  }}
                />
              </>
            )}

            {/* Stock Min marker (left triangle) */}
            <div
              className='absolute flex flex-col gap-1 items-center bottom-0'
              style={{
                left: `${(product.stockMin / product.stockMax) * 80}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className='h-[6px] w-[8.589px]'>
                <svg
                  className='block size-full'
                  fill='none'
                  preserveAspectRatio='none'
                  viewBox='0 0 9 6'
                >
                  <path d={svgPathsStock.p44ee500} fill='#717680' />
                </svg>
              </div>
              <p className='font-normal text-[12px] leading-none text-center text-[#535862] whitespace-nowrap pb-1'>
                {product.stockMin} u
              </p>
            </div>

            {/* Stock Max marker (right triangle) */}
            <div
              className='absolute flex flex-col gap-1 items-center bottom-0'
              style={{
                left: `80%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className='h-[6px] w-[8.589px]'>
                <svg
                  className='block size-full'
                  fill='none'
                  preserveAspectRatio='none'
                  viewBox='0 0 9 6'
                >
                  <path d={svgPathsStock.p44ee500} fill='#717680' />
                </svg>
              </div>
              <p className='font-normal text-[12px] leading-none text-center text-[#535862] whitespace-nowrap pb-1'>
                {product.stockMax} u
              </p>
            </div>
          </div>

          {/* Badge: Lots + Stock total */}
          <div className='self-start bg-[#f5f5f6] flex gap-1.5 items-center pl-0.5 pr-2.5 py-0.5 rounded-[48px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex-shrink-0 scale-[0.85]'>
            <div
              className={`flex gap-1 items-center pl-1.5 pr-2.5 py-0.5 rounded-[48px] ${
                product.stock < product.stockMin
                  ? 'bg-[#ea580c]'
                  : 'bg-[#16a34a]'
              }`}
            >
              <div className='relative shrink-0 size-[14px]'>
                <svg
                  className='block size-full'
                  fill='none'
                  preserveAspectRatio='none'
                  viewBox='0 0 16 16'
                >
                  <path d={svgPathsStock.p15d46900} fill='white' />
                </svg>
              </div>
              <p className='font-normal text-[14px] text-center text-white'>
                {product.lots}
              </p>
            </div>
            <p
              className={`font-semibold text-[12px] text-center ${
                product.stock < product.stockMin
                  ? 'text-[#ea580c]'
                  : 'text-[#16a34a]'
              }`}
            >
              {product.stock} u
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
