import React from 'react';
import { ChevronLeft, Package, FileText, CheckCircle2 } from 'lucide-react';
import {
  products,
  clientLogos,
  getDeliveryPreparation,
} from '../../../data/database';
import type { Order, DeliveryNoteStatus } from '../../../data/database';
import { getStatusBadgeColor, getStatusLabel } from '../../utils/statusHelpers';
import ProductCardCompact from '../ProductCardCompact';

interface DeliveryNoteDetailsPageProps {
  order: Order;
  onBack: () => void;
  onStatusUpdate?: (orderId: string, newStatus: DeliveryNoteStatus) => void;
}

export default function DeliveryNoteDetailsPage({
  order,
  onBack,
  onStatusUpdate,
}: DeliveryNoteDetailsPageProps) {
  // Check if document type is valid (must be BL)
  if (order.type !== 'BL') {
    return (
      <div className='flex flex-col h-full min-h-0 items-center justify-center p-4'>
        <p className='text-red-600 font-semibold mb-2'>Accès non autorisé</p>
        <p className='text-gray-600 text-sm text-center mb-4'>
          Cette page est uniquement accessible pour les bons de livraison (BL).
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

  const statusColors = getStatusBadgeColor(order.status);
  const statusLabel = getStatusLabel(order.status);
  const preparation = getDeliveryPreparation(order.id);
  const isReadOnly = order.status === 'Annulé' || order.status === 'Facturé';

  // Get scanned lots summary for each product
  const getProductLotsSummary = (productId: string) => {
    const productLots = preparation.scannedLots.filter(
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

  // Handle status transitions
  const handleStatusTransition = (newStatus: DeliveryNoteStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(order.id, newStatus);
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
            <div className='flex items-center gap-2 mb-0.5'>
              <h2 className='font-semibold text-[15px] leading-tight'>
                {order.client}
              </h2>
              {/* Status Badge */}
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${statusColors.bg} ${statusColors.text}`}
              >
                {statusLabel}
              </span>
            </div>
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
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto min-h-0'>
        <div className='space-y-4 p-4 pb-4'>
          {/* Products List */}
          <div>
            <h3 className='text-[12px] font-semibold text-gray-700 mb-2'>
              Produits ({order.items.length})
            </h3>
            <div className='space-y-2'>
              {order.items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;

                const lotsSummary = getProductLotsSummary(item.productId);

                return (
                  <div
                    key={item.productId}
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
                          Quantité requise: {item.quantity} u
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

          {/* Shipment Info Section (for Expédié and later) */}
          {(order.status === 'Expédié' ||
            order.status === 'Livré' ||
            order.status === 'Facturé') && (
            <div className='border border-gray-200 rounded-lg p-3 bg-gray-50'>
              <h3 className='text-[12px] font-semibold text-gray-700 mb-2'>
                Informations d'expédition
              </h3>
              <p className='text-[11px] text-gray-600'>
                Expédié le:{' '}
                {preparation.shippedAt
                  ? new Date(preparation.shippedAt).toLocaleDateString('fr-FR')
                  : 'N/A'}
              </p>
              {preparation.deliveredAt && (
                <p className='text-[11px] text-gray-600 mt-1'>
                  Livré le:{' '}
                  {new Date(preparation.deliveredAt).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          )}

          {/* Invoice Link Section (for Facturé) */}
          {order.status === 'Facturé' && (
            <div className='border border-gray-200 rounded-lg p-3 bg-blue-50'>
              <h3 className='text-[12px] font-semibold text-gray-700 mb-2'>
                Facture
              </h3>
              <p className='text-[11px] text-gray-600'>
                Facturé le:{' '}
                {preparation.invoicedAt
                  ? new Date(preparation.invoicedAt).toLocaleDateString('fr-FR')
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
      {!isReadOnly && (
        <div className='flex-shrink-0 pt-3 pb-4 bg-white border-t border-gray-200 space-y-2 px-4'>
          {/* Buttons by status */}
          {order.status === 'Prêt à expédier' && (
            <>
              <button
                onClick={() => handleStatusTransition('Expédié')}
                className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-[#12895a] text-white hover:bg-[#107a4d]'
              >
                <Package className='w-4 h-4' />
                Marquer comme expédié
              </button>
              <button className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-gray-100 text-gray-700 hover:bg-gray-200'>
                <FileText className='w-4 h-4' />
                Voir / imprimer le BL
              </button>
            </>
          )}

          {order.status === 'Expédié' && (
            <>
              <button
                onClick={() => handleStatusTransition('Livré')}
                className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-[#12895a] text-white hover:bg-[#107a4d]'
              >
                <CheckCircle2 className='w-4 h-4' />
                Marquer comme livré
              </button>
              <button className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-gray-100 text-gray-700 hover:bg-gray-200'>
                <FileText className='w-4 h-4' />
                Voir / imprimer le BL
              </button>
            </>
          )}

          {order.status === 'Livré' && (
            <>
              <button
                onClick={() => handleStatusTransition('Facturé')}
                className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-[#12895a] text-white hover:bg-[#107a4d]'
              >
                <FileText className='w-4 h-4' />
                Créer la facture
              </button>
              <button className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-gray-100 text-gray-700 hover:bg-gray-200'>
                <FileText className='w-4 h-4' />
                Voir / imprimer le BL
              </button>
            </>
          )}
        </div>
      )}

      {/* Read-only footer for Facturé and Annulé */}
      {isReadOnly && (
        <div className='flex-shrink-0 pt-3 pb-4 bg-white border-t border-gray-200 space-y-2 px-4'>
          {order.status === 'Facturé' && (
            <>
              <button className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-[#12895a] text-white hover:bg-[#107a4d]'>
                <FileText className='w-4 h-4' />
                Voir la facture
              </button>
              <button className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-gray-100 text-gray-700 hover:bg-gray-200'>
                <FileText className='w-4 h-4' />
                Voir / imprimer le BL
              </button>
            </>
          )}

          {order.status === 'Annulé' && (
            <button className='w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all bg-gray-100 text-gray-700 hover:bg-gray-200'>
              <FileText className='w-4 h-4' />
              Voir le BL
            </button>
          )}
        </div>
      )}
    </div>
  );
}

