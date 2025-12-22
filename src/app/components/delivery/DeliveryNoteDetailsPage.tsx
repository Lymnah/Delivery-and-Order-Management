import React, { useMemo } from 'react';
import {
  ChevronLeft,
  Package,
  FileText,
  Printer,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import {
  products,
  getDeliveryNote,
  shipDeliveryNote,
  invoiceDeliveryNote,
  type Order,
  type DeliveryNote,
  type DeliveryNoteStatus,
} from '../../../data/database';
import {
  getStatusBadgeColor,
  getDeliveryNoteStatusLabelFr,
} from '../../utils/statusHelpers';
import OrderHeader from './OrderHeader';

interface DeliveryNoteDetailsPageProps {
  deliveryNote?: DeliveryNote; // New: DeliveryNote (priority)
  order?: Order; // Legacy: fallback for backward compatibility
  deliveryNoteId?: string; // Alternative: fetch by ID
  onBack: () => void;
  onStatusUpdate?: (
    deliveryNoteId: string,
    newStatus: DeliveryNoteStatus
  ) => void;
  onViewPickingTask?: (pickingTaskId: string) => void;
  onViewSalesOrder?: (salesOrderId: string) => void;
}

export default function DeliveryNoteDetailsPage({
  deliveryNote: propDeliveryNote,
  order: legacyOrder,
  deliveryNoteId,
  onBack,
  onStatusUpdate,
  onViewPickingTask,
  onViewSalesOrder,
}: DeliveryNoteDetailsPageProps) {
  // Get DeliveryNote: priority order: prop > fetch by ID > convert from legacy Order
  const effectiveDeliveryNote: DeliveryNote | null = useMemo(() => {
    if (propDeliveryNote) return propDeliveryNote;
    if (deliveryNoteId) {
      const fetched = getDeliveryNote(deliveryNoteId);
      if (fetched) return fetched;
    }
    // Legacy fallback: convert Order to DeliveryNote if possible
    if (legacyOrder && legacyOrder.type === 'BL') {
      // Try to find DeliveryNote by ID
      const found = getDeliveryNote(legacyOrder.id);
      if (found) return found;
      // If not found, we'll use legacy Order structure
    }
    return null;
  }, [propDeliveryNote, deliveryNoteId, legacyOrder]);

  // Check if we have valid data
  if (!effectiveDeliveryNote && !legacyOrder) {
    return (
      <div className='flex flex-col h-full min-h-0 items-center justify-center p-4'>
        <p className='text-red-600 font-semibold mb-2'>Accès non autorisé</p>
        <p className='text-gray-600 text-sm text-center mb-4'>
          Bon de livraison introuvable.
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

  // Use DeliveryNote if available, otherwise fallback to legacy Order
  const displayData = effectiveDeliveryNote || {
    deliveryNoteId: legacyOrder!.id,
    number: legacyOrder!.number,
    client: legacyOrder!.client,
    deliveryDate: legacyOrder!.deliveryDate,
    status: legacyOrder!.status as DeliveryNoteStatus,
    lines: legacyOrder!.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    scannedLots: [], // Legacy: would need to get from getDeliveryPreparation
    createdAt: legacyOrder!.createdAt,
    shippedAt: undefined,
    invoicedAt: undefined,
    pickingTaskId: '', // Unknown for legacy
  };

  // Use the helper functions directly - they now handle "Prêt à quai" correctly
  const statusLabel = getDeliveryNoteStatusLabelFr(displayData.status);
  const statusColors = getStatusBadgeColor(displayData.status, 'BL');

  // Read-only for INVOICED only (terminal state)
  const isReadOnly = displayData.status === 'INVOICED';

  // Get scanned lots summary for each product
  const getProductLotsSummary = (productId: string) => {
    const productLots = displayData.scannedLots.filter(
      (lot) => lot.productId === productId
    );
    const totalScanned = productLots.reduce(
      (sum, lot) => sum + lot.quantity,
      0
    );
    return {
      lots: productLots,
      totalScanned,
      lotCount: productLots.length,
    };
  };

  // Handle shipping (READY_TO_SHIP → SHIPPED)
  const handleShipDelivery = () => {
    if (displayData.status !== 'READY_TO_SHIP') return;

    try {
      shipDeliveryNote(displayData.deliveryNoteId);
      // Update status in parent component
      if (onStatusUpdate) {
        onStatusUpdate(displayData.deliveryNoteId, 'SHIPPED');
      }
      // Force re-render by fetching updated delivery note
      // The component will re-render and show SHIPPED status
    } catch (error) {
      console.error('Error shipping delivery note:', error);
      // TODO: Show error toast/alert to user
    }
  };

  // Handle invoicing (SHIPPED → INVOICED)
  const handleInvoiceDelivery = () => {
    if (displayData.status !== 'SHIPPED' && displayData.status !== 'SIGNED') {
      return;
    }

    try {
      invoiceDeliveryNote(displayData.deliveryNoteId);
      // Update status in parent component
      if (onStatusUpdate) {
        onStatusUpdate(displayData.deliveryNoteId, 'INVOICED');
      }
      // Force re-render by fetching updated delivery note
    } catch (error) {
      console.error('Error invoicing delivery note:', error);
      // TODO: Show error toast/alert to user
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
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
          client={displayData.client}
          documentNumber={`${displayData.number} • BL`}
          statusBadge={{
            label: statusLabel,
            bgColor: statusColors.bg,
            textColor: statusColors.text,
          }}
        />
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto min-h-0'>
        <div className='space-y-4 p-4 pb-4'>
          {/* Status Context Banner (for READY_TO_SHIP) */}
          {displayData.status === 'READY_TO_SHIP' && (
            <div className='bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 items-start'>
              <Package className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
              <div>
                <p className='text-[13px] font-semibold text-blue-800'>
                  Commande préparée
                </p>
                <p className='text-[11px] text-blue-600 mt-0.5'>
                  La marchandise est prête. Validez le départ une fois le camion
                  chargé pour déstocker.
                </p>
              </div>
            </div>
          )}

          {/* Products List */}
          <div>
            <h3 className='text-[12px] font-semibold text-gray-700 mb-2'>
              Produits ({displayData.lines.length})
            </h3>
            <div className='space-y-2'>
              {displayData.lines.map((line) => {
                const product = products.find((p) => p.id === line.productId);
                if (!product) return null;

                const lotsSummary = getProductLotsSummary(line.productId);

                return (
                  <div
                    key={line.productId}
                    className='border border-gray-300 rounded-lg p-3'
                  >
                    <div className='flex items-start gap-3 mb-2'>
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
                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-[14px] text-gray-900'>
                          {product.name}
                        </p>
                        <p className='text-[11px] text-gray-600 mt-0.5'>
                          Quantité livrée: {line.quantity} u
                        </p>
                        {lotsSummary.lotCount > 0 && (
                          <p className='text-[11px] text-gray-600'>
                            Quantité scannée: {lotsSummary.totalScanned} u (
                            {lotsSummary.lotCount} lot
                            {lotsSummary.lotCount > 1 ? 's' : ''})
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Lots Details */}
                    {lotsSummary.lots.length > 0 && (
                      <div className='mt-2 pt-2 border-t border-gray-200'>
                        <p className='text-[10px] font-semibold text-gray-600 mb-1'>
                          Lots scannés:
                        </p>
                        <div className='space-y-1'>
                          {lotsSummary.lots.map((lot, idx) => (
                            <div
                              key={idx}
                              className='flex items-center justify-between text-[10px] text-gray-600 bg-gray-50 px-2 py-1 rounded'
                            >
                              <span className='font-mono'>{lot.lotNumber}</span>
                              <span>{lot.quantity} u</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipment Info Section (for SHIPPED) */}
          {displayData.status === 'SHIPPED' && (
            <div className='border border-green-200 rounded-lg p-3 bg-green-50'>
              <div className='flex gap-2 items-center mb-1'>
                <CheckCircle2 className='w-4 h-4 text-green-600' />
                <h3 className='text-[12px] font-semibold text-green-800'>
                  Expédition validée
                </h3>
              </div>
              <p className='text-[11px] text-green-700 ml-6'>
                Expédié le:{' '}
                {displayData.shippedAt
                  ? new Date(displayData.shippedAt).toLocaleDateString('fr-FR')
                  : 'N/A'}
              </p>
              <p className='text-[11px] text-green-700 ml-6 mt-1'>
                Stock décrémenté. Prêt pour facturation.
              </p>
            </div>
          )}

          {/* Invoice Link Section (for INVOICED) */}
          {displayData.status === 'INVOICED' && (
            <div className='border border-gray-200 rounded-lg p-3 bg-blue-50'>
              <h3 className='text-[12px] font-semibold text-gray-700 mb-2'>
                Facture
              </h3>
              <p className='text-[11px] text-gray-600'>
                Facturé le:{' '}
                {displayData.invoicedAt
                  ? new Date(displayData.invoicedAt).toLocaleDateString('fr-FR')
                  : 'N/A'}
              </p>
              <button className='mt-2 text-[11px] text-blue-600 font-semibold hover:underline'>
                Voir la facture
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer with Actions */}
      <div className='flex-shrink-0 pt-3 pb-4 bg-white border-t border-gray-200 space-y-2 px-4'>
        {/* ===== STEP 1: Prêt à quai -> Expédier ===== */}
        {displayData.status === 'READY_TO_SHIP' && (
          <>
            <button
              onClick={handleShipDelivery}
              className='w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-[14px] transition-all bg-[#12895a] text-white hover:bg-[#107a4d] shadow-sm'
            >
              <Truck className='w-5 h-5' />
              Valider le départ camion
            </button>
            <button
              onClick={handlePrint}
              className='w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            >
              <Printer className='w-5 h-5' />
              Imprimer le BL
            </button>
          </>
        )}

        {/* ===== STEP 2: Expédié -> Facturer ===== */}
        {(displayData.status === 'SHIPPED' ||
          displayData.status === 'SIGNED') && (
          <>
            <button
              onClick={handleInvoiceDelivery}
              className='w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-[14px] transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            >
              <FileText className='w-5 h-5' />
              Générer la Facture
            </button>
            <button
              onClick={handlePrint}
              className='w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            >
              <Printer className='w-5 h-5' />
              Réimprimer BL
            </button>
          </>
        )}

        {/* ===== STEP 3: Facturé (Fin) ===== */}
        {displayData.status === 'INVOICED' && (
          <div className='flex gap-2'>
            <button
              className='flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] bg-gray-100 text-gray-600'
              disabled
            >
              <CheckCircle2 className='w-4 h-4' />
              Facturé
            </button>
            <button
              onClick={handlePrint}
              className='flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            >
              <Printer className='w-4 h-4' />
              BL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
