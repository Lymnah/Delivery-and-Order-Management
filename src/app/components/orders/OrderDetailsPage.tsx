import React from 'react';
import { ChevronLeft, Package, Plus } from 'lucide-react';
import { products, clientLogos } from '../../../data/database';
import type { Order } from '../../../data/database';
import ProductCardCompact from '../ProductCardCompact';

interface OrderDetailsPageProps {
  order: Order;
  selectedProductsInOrder: string[];
  onBack: () => void;
  onSelectionToggle: (productId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onCreateManufacturingOrder: (quantities: Record<string, number>) => void;
}

export default function OrderDetailsPage({
  order,
  selectedProductsInOrder,
  onBack,
  onSelectionToggle,
  onSelectAll,
  onDeselectAll,
  onCreateManufacturingOrder,
}: OrderDetailsPageProps) {
  const allProductsOk = order.items.every((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product && product.stock >= item.quantity;
  });

  const handleCreateManufacturingOrder = () => {
    if (selectedProductsInOrder.length > 0) {
      // Calculate quantities for selected products
      const quantities: Record<string, number> = {};
      selectedProductsInOrder.forEach((productId) => {
        const item = order.items.find((i) => i.productId === productId);
        const product = products.find((p) => p.id === productId);
        if (item && product) {
          const deficit = Math.max(0, item.quantity - product.stock);
          quantities[productId] = deficit;
        }
      });
      onCreateManufacturingOrder(quantities);
    }
  };

  return (
    <div className='flex flex-col h-full min-h-0'>
      {/* Fixed Header Section */}
      <div className='flex-shrink-0 bg-white'>
        {/* Back button */}
        <button
          onClick={onBack}
          className='flex items-center gap-2 text-[#12895a] mb-1.5 -ml-2 px-2 py-0.5 hover:bg-gray-100 rounded transition-all'
        >
          <ChevronLeft className='w-4 h-4' />
          <span className='text-[13px] font-semibold'>Retour</span>
        </button>

        {/* Compact Header */}
        <div className='flex items-start justify-between mb-1.5 pb-1.5 border-b border-gray-200'>
          <div className='flex-1'>
            <h2 className='font-semibold text-[15px] leading-tight'>
              {order.client}
            </h2>
            <p className='text-[10px] text-gray-600 leading-tight'>
              {order.number} • {order.type}
            </p>
          </div>
          <img
            src={clientLogos[order.client] || ''}
            alt=''
            className='w-8 h-8 rounded object-cover flex-shrink-0'
          />
        </div>

        {/* Global Status Banner - Compact */}
        <div
          className={`rounded-lg p-1.5 mb-1.5 ${
            allProductsOk
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p
            className={`text-[11px] font-semibold leading-tight ${
              allProductsOk ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {allProductsOk ? '✓ Stock suffisant' : '⚠ Stock insuffisant'}
          </p>
          <p
            className={`text-[9px] leading-tight ${
              allProductsOk ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {allProductsOk
              ? 'Tous les produits sont disponibles'
              : 'Certains produits sont en rupture'}
          </p>
        </div>
      </div>

      {/* Scrollable Products List */}
      <div className='flex-1 overflow-y-auto min-h-0'>
        <div className='space-y-4 pb-4'>
          {/* En stock section */}
          {(() => {
            const inStockItems = order.items.filter((item) => {
              const product = products.find((p) => p.id === item.productId);
              return product && product.stock >= item.quantity;
            });

            if (inStockItems.length > 0) {
              return (
                <div>
                  <h3 className='text-[12px] font-semibold text-gray-700 mb-2'>
                    En stock ({inStockItems.length})
                  </h3>
                  <div className='space-y-2'>
                    {inStockItems.map((item) => {
                      const product = products.find(
                        (p) => p.id === item.productId
                      );
                      if (!product) return null;

                      return (
                        <ProductCardCompact
                          key={item.productId}
                          product={product}
                          quantity={item.quantity}
                          stock={product.stock}
                          onClick={() => {}} // No action on click
                        />
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Hors stock section */}
          {(() => {
            const outOfStockItems = order.items.filter((item) => {
              const product = products.find((p) => p.id === item.productId);
              return product && product.stock < item.quantity;
            });

            if (outOfStockItems.length > 0) {
              return (
                <div>
                  <h3 className='text-[12px] font-semibold text-gray-700 mb-2'>
                    Hors stock ({outOfStockItems.length})
                  </h3>
                  <div className='space-y-2'>
                    {outOfStockItems.map((item) => {
                      const product = products.find(
                        (p) => p.id === item.productId
                      );
                      if (!product) return null;

                      return (
                        <ProductCardCompact
                          key={item.productId}
                          product={product}
                          quantity={item.quantity}
                          stock={product.stock}
                          onClick={() => {}} // No action on click
                        />
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* Fixed Footer with Actions */}
      <div className='flex-shrink-0 pt-3 pb-4 bg-white border-t border-gray-200 space-y-2'>
        {/* Prepare order button */}
        <button
          disabled={!allProductsOk}
          className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all ${
            allProductsOk
              ? 'bg-[#12895a] text-white hover:bg-[#107a4d]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Package className='w-4 h-4' />
          Préparer la livraison
        </button>

        {/* Create production order button */}
        <button
          disabled={selectedProductsInOrder.length === 0}
          onClick={handleCreateManufacturingOrder}
          className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all ${
            selectedProductsInOrder.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus className='w-4 h-4' />
          Créer un ordre de fabrication
          {selectedProductsInOrder.length > 0 &&
            ` (${selectedProductsInOrder.length})`}
        </button>
      </div>
    </div>
  );
}
