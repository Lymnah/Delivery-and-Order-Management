import React, { useMemo } from 'react';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Package,
  Plus,
  Play,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import {
  products,
  getRemainingQuantities,
  getDeliveryNotesBySalesOrder,
  confirmSalesOrder,
  type SalesOrder,
  type DeliveryNoteStatus,
  type SalesOrderStatus,
} from '../../../data/database';
import ProductCardCompact from '../ProductCardCompact';
import OrderHeader from '../delivery/OrderHeader';
import {
  getStatusBadgeColor,
  getSalesOrderStatusLabelFr,
} from '../../utils/statusHelpers';

interface OrderDetailsPageProps {
  salesOrder?: SalesOrder;
  selectedProductsInOrder: string[];
  onBack: () => void;
  onSelectionToggle: (productId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onCreateManufacturingOrder: (quantities: Record<string, number>) => void;
  onCreateDeliveryNote?: (salesOrderId: string) => void;
  onViewDeliveryNote?: (deliveryNoteId: string) => void;
  onViewDeliveryNotes?: (salesOrderId: string) => void;
  onStatusUpdate?: (
    orderId: string,
    newStatus: DeliveryNoteStatus | SalesOrderStatus
  ) => void;
}

export default function OrderDetailsPage({
  salesOrder,
  selectedProductsInOrder,
  onBack,
  onSelectionToggle,
  onSelectAll,
  onDeselectAll,
  onCreateManufacturingOrder,
  onCreateDeliveryNote,
  onViewDeliveryNote,
  onViewDeliveryNotes,
  onStatusUpdate,
}: OrderDetailsPageProps) {
  const effectiveSalesOrder = salesOrder || null;

  // Check if document type is valid
  if (!effectiveSalesOrder) {
    return (
      <div className='flex flex-col h-full min-h-0 items-center justify-center p-4'>
        <p className='text-red-600 font-semibold mb-2'>Accès non autorisé</p>
        <p className='text-gray-600 text-sm text-center mb-4'>
          Type de document non supporté par ce module.
        </p>
        <button
          onClick={onBack}
          className='px-4 py-2 bg-[#12895a] text-white rounded-lg font-semibold'
        >
          Retour
        </button>
      </div>
    );
  }

  // Get order data
  const orderData = effectiveSalesOrder;
  const orderItems = effectiveSalesOrder.items;

  // Calculate read-only mode
  const isReadOnly =
    effectiveSalesOrder.status === 'INVOICED' ||
    effectiveSalesOrder.status === 'CANCELLED';

  // Calculate stock availability
  const allProductsOk = orderItems.every((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product && product.stock >= item.quantity;
  });

  // Get status colors and label
  const statusColors = getStatusBadgeColor(effectiveSalesOrder.status);
  const statusLabel = getSalesOrderStatusLabelFr(effectiveSalesOrder.status);

  // Calculate remaining quantities for SalesOrder
  const remainingQuantities = useMemo(() => {
    if (effectiveSalesOrder) {
      return getRemainingQuantities(effectiveSalesOrder.salesOrderId);
    }
    return null;
  }, [effectiveSalesOrder]);

  // Get active delivery notes for SalesOrder
  const activeDeliveryNotes = useMemo(() => {
    if (effectiveSalesOrder) {
      return getDeliveryNotesBySalesOrder(
        effectiveSalesOrder.salesOrderId
      ).filter(
        (dn) => dn.status === 'IN_PREPARATION' || dn.status === 'PREPARED'
      );
    }
    return [];
  }, [effectiveSalesOrder]);

  // Get products with deficit (for manufacturing order selection)
  const productsWithDeficit = orderItems.filter((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product && product.stock < item.quantity;
  });

  const handleSelectAllDeficit = () => {
    productsWithDeficit.forEach((item) => {
      if (!selectedProductsInOrder.includes(item.productId)) {
        onSelectionToggle(item.productId);
      }
    });
  };

  // Handle BC actions
  const handleConfirmSalesOrder = () => {
    if (effectiveSalesOrder && effectiveSalesOrder.status === 'DRAFT') {
      try {
        confirmSalesOrder(effectiveSalesOrder.salesOrderId);
        // Update status in parent component
        if (onStatusUpdate) {
          onStatusUpdate(effectiveSalesOrder.salesOrderId, 'CONFIRMED');
        }
        // Force re-render by updating the effectiveSalesOrder
        // The component will re-render and show the "Créer un BL" button
      } catch (error) {
        console.error('Error confirming sales order:', error);
        toast.error('Erreur lors de la confirmation de la commande.');
      }
    }
  };

  const handleCreateDeliveryNote = () => {
    if (effectiveSalesOrder && onCreateDeliveryNote) {
      onCreateDeliveryNote(effectiveSalesOrder.salesOrderId);
    }
  };

  const handleViewDeliveryNote = () => {
    if (
      effectiveSalesOrder &&
      activeDeliveryNotes.length > 0 &&
      onViewDeliveryNote
    ) {
      onViewDeliveryNote(activeDeliveryNotes[0].deliveryNoteId);
    }
  };

  const handleViewDeliveryNotes = () => {
    if (effectiveSalesOrder && onViewDeliveryNotes) {
      onViewDeliveryNotes(effectiveSalesOrder.salesOrderId);
    }
  };

  const handleCreateManufacturingOrder = () => {
    if (selectedProductsInOrder.length > 0) {
      // Calculate quantities for selected products
      const quantities: Record<string, number> = {};
      selectedProductsInOrder.forEach((productId) => {
        const item = orderItems.find((i) => i.productId === productId);
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

        {/* Order Header */}
        <OrderHeader
          client={orderData.client}
          documentNumber={`${orderData.number} • BC`}
          statusBadge={{
            label: statusLabel,
            bgColor: statusColors.bg,
            textColor: statusColors.text,
          }}
        />

        {/* Remaining Quantities Display (for SalesOrder with partial deliveries) */}
        {effectiveSalesOrder &&
          remainingQuantities &&
          remainingQuantities.some((rq) => rq.delivered > 0) && (
            <div className='mb-1.5 p-1.5 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-[10px] font-semibold text-blue-700 mb-1'>
                Reliquats
              </p>
              <div className='space-y-0.5'>
                {remainingQuantities
                  .filter((rq) => rq.delivered > 0)
                  .map((rq) => {
                    const product = products.find((p) => p.id === rq.productId);
                    if (!product) return null;
                    return (
                      <p
                        key={rq.productId}
                        className='text-[9px] text-blue-600 leading-tight'
                      >
                        {product.name}: {rq.ordered} u commandé, {rq.delivered}{' '}
                        u livré, {rq.remaining} u restant
                      </p>
                    );
                  })}
              </div>
            </div>
          )}

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
            // For SalesOrder, use remaining quantities if available, otherwise use items
            const itemsToDisplay =
              effectiveSalesOrder && remainingQuantities
                ? remainingQuantities.map((rq) => ({
                    productId: rq.productId,
                    quantity: rq.remaining > 0 ? rq.remaining : rq.ordered,
                  }))
                : orderItems;

            const inStockItems = itemsToDisplay.filter((item) => {
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
            // For SalesOrder, use remaining quantities if available
            const itemsToDisplay =
              effectiveSalesOrder && remainingQuantities
                ? remainingQuantities.map((rq) => ({
                    productId: rq.productId,
                    quantity: rq.remaining > 0 ? rq.remaining : rq.ordered,
                  }))
                : orderItems;

            const outOfStockItems = itemsToDisplay.filter((item) => {
              const product = products.find((p) => p.id === item.productId);
              return product && product.stock < item.quantity;
            });

            if (outOfStockItems.length > 0) {
              return (
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='text-[12px] font-semibold text-gray-700'>
                      Hors stock ({outOfStockItems.length})
                    </h3>
                    {!isReadOnly && (
                      <button
                        onClick={handleSelectAllDeficit}
                        className='text-[11px] text-[#12895a] font-semibold hover:underline'
                      >
                        Tout sélectionner
                      </button>
                    )}
                  </div>
                  <div className='space-y-2'>
                    {outOfStockItems.map((item) => {
                      const product = products.find(
                        (p) => p.id === item.productId
                      );
                      if (!product) return null;
                      const isSelected = selectedProductsInOrder.includes(
                        item.productId
                      );

                      return (
                        <div
                          key={item.productId}
                          className={`${
                            isSelected
                              ? 'ring-2 ring-[#12895a] ring-offset-1'
                              : ''
                          } rounded-lg`}
                        >
                          <ProductCardCompact
                            product={product}
                            quantity={item.quantity}
                            stock={product.stock}
                            onClick={() => {
                              if (!isReadOnly) {
                                onSelectionToggle(item.productId);
                              }
                            }}
                          />
                        </div>
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
        {/* ===== SalesOrder (BC) Actions ===== */}
        {effectiveSalesOrder && (
          <>
            {/* BC DRAFT: Confirm order */}
            {effectiveSalesOrder.status === 'DRAFT' && !isReadOnly && (
              <button
                onClick={handleConfirmSalesOrder}
                className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-[#12895a] text-white hover:bg-[#107a4d]'
              >
                <CheckCircle2 className='w-4 h-4' />
                Confirmer la commande
              </button>
            )}

            {/* BC CONFIRMED: Create BL and prepare */}
            {effectiveSalesOrder.status === 'CONFIRMED' && !isReadOnly && (
              <button
                onClick={handleCreateDeliveryNote}
                className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-[#12895a] text-white hover:bg-[#107a4d]'
              >
                <Package className='w-4 h-4' />
                Créer un BL et préparer
              </button>
            )}

            {/* BC IN_PREPARATION: View active delivery note */}
            {effectiveSalesOrder.status === 'IN_PREPARATION' &&
              activeDeliveryNotes.length > 0 &&
              !isReadOnly && (
                <button
                  onClick={handleViewDeliveryNote}
                  className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-[#12895a] text-white hover:bg-[#107a4d]'
                >
                  <Play className='w-4 h-4' />
                  Voir le BL en préparation
                </button>
              )}

            {/* BC PARTIALLY_SHIPPED: Prepare remaining quantities */}
            {effectiveSalesOrder.status === 'PARTIALLY_SHIPPED' &&
              !isReadOnly && (
                <button
                  onClick={handleCreateDeliveryNote}
                  className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-[#12895a] text-white hover:bg-[#107a4d]'
                >
                  <Package className='w-4 h-4' />
                  Préparer le reliquat
                </button>
              )}

            {/* BC SHIPPED: View delivery notes */}
            {effectiveSalesOrder.status === 'SHIPPED' && (
              <button
                onClick={handleViewDeliveryNotes}
                className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-blue-600 text-white hover:bg-blue-700'
              >
                <Eye className='w-4 h-4' />
                Voir les BL
              </button>
            )}

            {/* BC INVOICED/CANCELLED: Read-only message */}
            {isReadOnly && (
              <p className='text-center text-[12px] text-gray-500 py-2'>
                Aucune action disponible à ce statut
              </p>
            )}

            {/* Create manufacturing order button - for BC with stock issues */}
            {!isReadOnly &&
              effectiveSalesOrder.status !== 'SHIPPED' &&
              effectiveSalesOrder.status !== 'INVOICED' &&
              effectiveSalesOrder.status !== 'CANCELLED' && (
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
              )}
          </>
        )}

      </div>
    </div>
  );
}
