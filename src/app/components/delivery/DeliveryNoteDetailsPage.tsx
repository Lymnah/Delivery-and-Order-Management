import React, { useMemo } from 'react';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Package,
  Printer,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import {
  products,
  getDeliveryNote,
  shipDeliveryNote,
  type DeliveryNote,
  type DeliveryNoteStatus,
} from '../../../data/database';
import {
  getStatusBadgeColor,
  getDeliveryNoteStatusLabelFr,
} from '../../utils/statusHelpers';
import OrderHeader from './OrderHeader';
import ProductDeliveryCard from './ProductDeliveryCard';

interface DeliveryNoteDetailsPageProps {
  deliveryNote?: DeliveryNote;
  deliveryNoteId?: string;
  onBack: () => void;
  onStatusUpdate?: (
    deliveryNoteId: string,
    newStatus: DeliveryNoteStatus
  ) => void;
  onViewSalesOrder?: (salesOrderId: string) => void;
}

export default function DeliveryNoteDetailsPage({
  deliveryNote: propDeliveryNote,
  deliveryNoteId,
  onBack,
  onStatusUpdate,
  onViewSalesOrder,
}: DeliveryNoteDetailsPageProps) {
  const effectiveDeliveryNote: DeliveryNote | null = useMemo(() => {
    if (propDeliveryNote) return propDeliveryNote;
    if (deliveryNoteId) {
      const fetched = getDeliveryNote(deliveryNoteId);
      if (fetched) return fetched;
    }
    return null;
  }, [propDeliveryNote, deliveryNoteId]);

  if (!effectiveDeliveryNote) {
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

  const displayData = effectiveDeliveryNote;
  const statusLabel = getDeliveryNoteStatusLabelFr(displayData.status);
  const statusColors = getStatusBadgeColor(displayData.status, 'BL');

  const isReadOnly = displayData.status === 'SHIPPED';

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

  // Handle shipping (PREPARED → SHIPPED)
  const handleShipDelivery = () => {
    if (displayData.status !== 'PREPARED') return;

    try {
      shipDeliveryNote(displayData.deliveryNoteId);
      if (onStatusUpdate) {
        onStatusUpdate(displayData.deliveryNoteId, 'SHIPPED');
      }
    } catch (error) {
      console.error('Error shipping delivery note:', error);
      toast.error("Erreur lors de l'expédition.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='flex flex-col h-full min-h-0'>
      {/* Fixed Header Section */}
      <div className='flex-shrink-0 bg-white'>
        <button
          onClick={onBack}
          className='flex items-center gap-2 text-[#12895a] mb-1.5 -ml-2 px-2 py-0.5 hover:bg-gray-100 rounded transition-all'
        >
          <ChevronLeft className='w-4 h-4' />
          <span className='text-[13px] font-semibold'>Retour</span>
        </button>

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
          {/* Status Context Banner (for PREPARED) */}
          {displayData.status === 'PREPARED' && (
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
                  <ProductDeliveryCard
                    key={line.productId}
                    product={product}
                    deliveredQuantity={line.quantity}
                    scannedLots={lotsSummary.lots}
                  />
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
            </div>
          )}

          {/* View parent BC button */}
          {onViewSalesOrder && displayData.salesOrderId && (
            <button
              onClick={() => onViewSalesOrder(displayData.salesOrderId)}
              className='w-full py-2 text-[12px] text-[#12895a] font-semibold hover:underline'
            >
              Voir la commande (BC) associée
            </button>
          )}
        </div>
      </div>

      {/* Fixed Footer with Actions */}
      <div className='flex-shrink-0 pt-3 pb-4 bg-white border-t border-gray-200 space-y-2 px-4'>
        {/* PREPARED -> Ship */}
        {displayData.status === 'PREPARED' && (
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

        {/* SHIPPED (terminal) */}
        {displayData.status === 'SHIPPED' && (
          <div className='flex gap-2'>
            <button
              className='flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] bg-gray-100 text-gray-600'
              disabled
            >
              <CheckCircle2 className='w-4 h-4' />
              Expédié
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
