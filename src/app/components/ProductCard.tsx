import React from 'react';
import {
  Package,
  AlertCircle,
  CheckCircle2,
  FileText,
  Hammer,
} from 'lucide-react';
import svgPathsStock from '../../imports/svg-gt4hwy99w6';
import type { Product, Order } from '../../data/database';

interface ProductCardProps {
  product: Product;
  quantity: number;
  deficit: number;
  orders: Order[];
  onCardClick?: () => void;
  onDocumentsClick?: (e: React.MouseEvent) => void;
  manufacturingMode?: boolean;
  currentManufacturingQty?: number;
  onManufacturingQtyChange?: (productId: string, quantity: number) => void;
  selectable?: boolean;
  isSelected?: boolean;
  onSelectionToggle?: () => void;
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
  selectable = false,
  isSelected = false,
  onSelectionToggle,
}: ProductCardProps) {
  // --- Logic for Slider (unchanged) ---
  const maxManufacturing = product.stockMax - product.stock;
  const stockStartPercent = (product.stock / product.stockMax) * 80;
  const stockEndPercent = 80;
  const rangePercent = stockEndPercent - stockStartPercent;
  const sliderProgress =
    manufacturingMode && maxManufacturing > 0
      ? currentManufacturingQty / maxManufacturing
      : 0;
  const thumbPositionPercent =
    stockStartPercent + rangePercent * sliderProgress;
  const orangeBarWidth = thumbPositionPercent - stockStartPercent;

  const handleClick = () => {
    if (selectable && onSelectionToggle) {
      onSelectionToggle();
    } else if (!manufacturingMode && onCardClick) {
      onCardClick();
    }
  };

  // --- UI Helper for Status Badge ---
  const getStatusBadge = () => {
    if (deficit > 0) {
      return (
        <span className='inline-flex items-center gap-1 text-[11px] text-red-700 bg-red-50 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap border border-red-100'>
          <AlertCircle className='w-3 h-3' />
          Manque {deficit} u
        </span>
      );
    }
    return (
      <span className='inline-flex items-center gap-1 text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap border border-green-100'>
        <CheckCircle2 className='w-3 h-3' />
        OK
      </span>
    );
  };

  return (
    <div
      className={`group border rounded-xl p-3 shadow-sm transition-all duration-200 ${
        selectable && isSelected
          ? 'border-[#12895a] bg-green-50/30'
          : selectable
          ? 'border-gray-200 hover:border-[#12895a]/50 hover:shadow-md bg-white'
          : manufacturingMode
          ? 'border-gray-200 bg-white'
          : 'border-gray-200 bg-white relative cursor-pointer hover:border-gray-300 hover:shadow-md'
      } ${selectable ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className={`flex flex-col ${manufacturingMode ? 'gap-4' : 'gap-3'}`}>
        {/* === OPTIMIZED FIRST ROW === */}
        <div className='flex items-start gap-3'>
          {/* 1. Checkbox (Selectable Mode) */}
          {selectable && (
            <div
              className={`w-5 h-5 rounded border transition-colors flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isSelected
                  ? 'bg-[#12895a] border-[#12895a]'
                  : 'border-gray-300 bg-white group-hover:border-[#12895a]'
              }`}
            >
              {isSelected && (
                <span className='text-white text-[12px] font-bold'>✓</span>
              )}
            </div>
          )}

          {/* 2. Product Image */}
          <div className='relative w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden'>
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

          {/* 3. Main Information Column */}
          <div className='flex-1 min-w-0 flex flex-col gap-1'>
            {/* Header: Name + Manufacturing Badge */}
            <div className='flex items-start justify-between gap-2'>
              <h3 className='font-bold text-[15px] text-gray-900 leading-tight truncate pr-1'>
                {product.name}
              </h3>

              {/* Manufacturing Badge (Only visible in that mode) */}
              {manufacturingMode && (
                <div className='flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap border border-orange-200'>
                  <Hammer className='w-3 h-3' />
                  Fabriquer: {currentManufacturingQty}
                </div>
              )}
            </div>

            {/* Sub-header: Stats Badges */}
            <div className='flex items-center flex-wrap gap-2'>
              {/* To Deliver Badge */}
              <span className='inline-flex items-center gap-1.5 text-[11px] text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md font-medium whitespace-nowrap border border-gray-100'>
                À livrer
                <span className='font-bold text-gray-900'>{quantity} u</span>
              </span>

              {/* Status Badge (Calculated above) */}
              {getStatusBadge()}
            </div>
          </div>

          {/* 4. Action Button: Documents (Hidden in manufacturing mode) */}
          {!manufacturingMode && orders.length > 0 && (
            <div className='flex-shrink-0'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDocumentsClick) onDocumentsClick(e);
                  else if (onCardClick) onCardClick();
                }}
                className='flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-blue-100 transition-colors border border-blue-100'
              >
                <FileText className='w-3 h-3' />
                {orders.length}
              </button>
            </div>
          )}
        </div>

        {/* === SECOND ROW: Stock Bar (Unchanged Logic, refined styling) === */}
        <div className='flex gap-4 items-end w-full'>
          <div
            className={`relative flex-1 ${
              manufacturingMode ? 'h-[46px]' : 'h-[36px]'
            }`}
          >
            {/* Base slider bar */}
            <div
              className={`absolute h-[6px] left-0 w-full rounded-full bg-gray-100 overflow-hidden ${
                manufacturingMode ? 'bottom-[28px]' : 'bottom-[20px]'
              }`}
            >
              {/* Current stock */}
              <div
                className={`absolute h-full left-0 top-0 rounded-full ${
                  product.stock < product.stockMin
                    ? 'bg-orange-500'
                    : 'bg-[#16a34a]'
                }`}
                style={{
                  width: `${Math.min(
                    80,
                    (product.stock / product.stockMax) * 80
                  )}%`,
                }}
              />
              {/* Manufacturing Add */}
              {manufacturingMode && (
                <div
                  className='absolute h-full top-0 bg-orange-400'
                  style={{
                    left: `${stockStartPercent}%`,
                    width: `${orangeBarWidth}%`,
                  }}
                />
              )}
            </div>

            {/* Slider Input */}
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
                  className='absolute bottom-[20px] h-[20px] w-full opacity-0 cursor-pointer z-10'
                />
                <div
                  className='absolute bottom-[23px] w-4 h-4 bg-white border-[3px] border-orange-500 rounded-full shadow-md pointer-events-none z-20'
                  style={{
                    left: `${thumbPositionPercent}%`,
                    transform: 'translateX(-50%)',
                  }}
                />
              </>
            )}

            {/* Min/Max Markers */}
            <div
              className='absolute flex flex-col items-center bottom-0'
              style={{
                left: `${(product.stockMin / product.stockMax) * 80}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className='w-0.5 h-1.5 bg-gray-300 mb-0.5'></div>
              <span className='text-[10px] text-gray-400 font-medium leading-none'>
                {product.stockMin}
              </span>
            </div>

            <div
              className='absolute flex flex-col items-center bottom-0'
              style={{ left: `80%`, transform: 'translateX(-50%)' }}
            >
              <div className='w-0.5 h-1.5 bg-gray-300 mb-0.5'></div>
              <span className='text-[10px] text-gray-400 font-medium leading-none'>
                Max
              </span>
            </div>
          </div>

          {/* Total Badge */}
          <div className='flex flex-col items-end'>
            <span className='text-[10px] text-gray-400 font-medium mb-0.5'>
              En stock
            </span>
            <div className='bg-gray-50 flex gap-2 items-center px-2 py-1 rounded-lg border border-gray-200'>
              <div
                className={`flex gap-1 items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${
                  product.stock < product.stockMin
                    ? 'bg-orange-500'
                    : 'bg-[#16a34a]'
                }`}
              >
                Lot {product.lots}
              </div>
              <span
                className={`text-[12px] font-bold ${
                  product.stock < product.stockMin
                    ? 'text-orange-600'
                    : 'text-[#16a34a]'
                }`}
              >
                {product.stock}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
