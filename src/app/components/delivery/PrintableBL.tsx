import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { products, type DeliveryNote } from '../../../data/database';

interface PrintableBLProps {
  deliveryNote: DeliveryNote;
}

export default function PrintableBL({ deliveryNote }: PrintableBLProps) {
  return (
    <div className='hidden print:block print-bl'>
      <div className='p-8 max-w-[800px] mx-auto font-sans'>
        {/* Header */}
        <div className='border-b-2 border-gray-800 pb-4 mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>BON DE LIVRAISON</h1>
          <p className='text-sm text-gray-600 mt-1'>N° {deliveryNote.number}</p>
        </div>

        {/* Client and Date Info */}
        <div className='flex justify-between mb-8'>
          <div>
            <p className='text-xs font-semibold text-gray-500 uppercase'>Client</p>
            <p className='text-lg font-bold text-gray-900'>{deliveryNote.client}</p>
          </div>
          <div className='text-right'>
            <p className='text-xs font-semibold text-gray-500 uppercase'>Date de livraison</p>
            <p className='text-lg font-bold text-gray-900'>
              {format(new Date(deliveryNote.deliveryDate), 'dd MMMM yyyy', { locale: fr })}
            </p>
            {deliveryNote.preparedAt && (
              <>
                <p className='text-xs font-semibold text-gray-500 uppercase mt-2'>Préparé le</p>
                <p className='text-sm text-gray-700'>
                  {format(new Date(deliveryNote.preparedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Products Table */}
        <table className='w-full border-collapse mb-8'>
          <thead>
            <tr className='border-b-2 border-gray-800'>
              <th className='text-left py-2 text-sm font-bold text-gray-900'>Produit</th>
              <th className='text-left py-2 text-sm font-bold text-gray-900'>Lot(s)</th>
              <th className='text-right py-2 text-sm font-bold text-gray-900'>Quantité</th>
            </tr>
          </thead>
          <tbody>
            {deliveryNote.lines.map((line) => {
              const product = products.find((p) => p.id === line.productId);
              const lineLots = deliveryNote.scannedLots.filter(
                (lot) => lot.productId === line.productId
              );

              return (
                <tr key={line.productId} className='border-b border-gray-200'>
                  <td className='py-3 text-sm text-gray-900'>
                    {product?.name || line.productId}
                  </td>
                  <td className='py-3 text-sm text-gray-600'>
                    {lineLots.length > 0
                      ? lineLots.map((lot) => lot.lotNumber).join(', ')
                      : '—'}
                  </td>
                  <td className='py-3 text-sm text-gray-900 text-right'>
                    {line.quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Signature Line */}
        <div className='mt-16 pt-4 border-t border-gray-300'>
          <div className='flex justify-between'>
            <div>
              <p className='text-sm font-semibold text-gray-700 mb-12'>
                Bon pour accord
              </p>
              <div className='border-b border-gray-400 w-48' />
              <p className='text-xs text-gray-500 mt-1'>Signature</p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>Date : _______________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
