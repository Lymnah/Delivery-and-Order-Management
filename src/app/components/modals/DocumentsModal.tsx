import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { clientLogos, products } from '../../../data/database';
import type { Order } from '../../../data/database';
import { getDaysUntil } from '../../utils/dateHelpers';

interface DocumentsModalProps {
  selectedProduct: any | null;
  selectedProductOrders: Order[];
  today: Date;
  onClose: () => void;
}

export default function DocumentsModal({
  selectedProduct,
  selectedProductOrders,
  today,
  onClose,
}: DocumentsModalProps) {
  return (
    <div className='absolute inset-0 backdrop-blur-[2px] flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[350px] max-h-[600px] overflow-y-auto shadow-xl'>
        <h2 className='font-semibold text-[18px] mb-2'>
          {selectedProduct ? selectedProduct.name : 'Tous les documents'}
        </h2>

        {/* Total quantity - only show if a specific product is selected */}
        {selectedProduct && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
            <p className='text-[14px] font-semibold text-gray-900'>
              Total à livrer :{' '}
              {selectedProductOrders.reduce((sum, order) => {
                const item = order.items.find(
                  (i) => i.productId === selectedProduct.id
                );
                return sum + (item?.quantity || 0);
              }, 0)}{' '}
              unité
              {selectedProductOrders.reduce((sum, order) => {
                const item = order.items.find(
                  (i) => i.productId === selectedProduct.id
                );
                return sum + (item?.quantity || 0);
              }, 0) > 1
                ? 's'
                : ''}
            </p>
          </div>
        )}

        <p className='text-[12px] text-gray-600 mb-4'>Commandes concernées :</p>

        <div className='space-y-3 mb-6'>
          {selectedProductOrders.map((order) => {
            const productItem = selectedProduct
              ? order.items.find(
                  (item) => item.productId === selectedProduct.id
                )
              : null;
            const daysUntil = getDaysUntil(order.deliveryDate, today);

            // Color code for date
            let dateColor = 'text-gray-600';
            let dateBgColor = 'bg-gray-100';
            if (daysUntil < 0) {
              dateColor = 'text-red-600';
              dateBgColor = 'bg-red-50';
            } else if (daysUntil < 7) {
              dateColor = 'text-orange-600';
              dateBgColor = 'bg-orange-50';
            }

            return (
              <div
                key={order.id}
                className='border border-gray-300 rounded-lg p-4 relative'
              >
                {/* Badge BC/BL */}
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-semibold ${
                    order.type === 'BC'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {order.type}
                </span>

                <div className='flex items-start gap-3'>
                  {/* Customer Logo */}
                  <img
                    src={clientLogos[order.client] || ''}
                    alt=''
                    className='w-12 h-12 rounded object-cover flex-shrink-0'
                  />

                  {/* Order Information */}
                  <div className='flex-1 min-w-0 space-y-1.5'>
                    {/* Line 1: Customer name */}
                    <p className='font-semibold text-[16px] text-gray-900'>
                      {order.client}
                    </p>

                    {/* Line 2: Delivery deadline */}
                    <div className='flex items-center gap-1.5'>
                      <span
                        className={`${dateColor} font-semibold text-[13px] px-2 py-0.5 rounded ${dateBgColor}`}
                      >
                        {format(order.deliveryDate, 'dd/MM/yy', {
                          locale: fr,
                        })}
                        {' · '}
                        {daysUntil < 0
                          ? `-${Math.abs(daysUntil)}j`
                          : daysUntil === 0
                          ? 'Auj.'
                          : `+${daysUntil}j`}
                      </span>
                    </div>

                    {/* Line 3: Quantity info */}
                    {selectedProduct ? (
                      <p className='text-[13px] text-gray-700'>
                        N° {order.number} • {productItem?.quantity || 0} unité
                        {(productItem?.quantity || 0) > 1 ? 's' : ''}
                      </p>
                    ) : (
                      <div className='text-[13px] text-gray-700'>
                        <p className='mb-1'>N° {order.number}</p>
                        {order.items.map((item) => {
                          const product = products.find(
                            (p) => p.id === item.productId
                          );
                          return (
                            <p key={item.productId} className='text-[12px]'>
                              • {product?.name}: {item.quantity} unité
                              {item.quantity > 1 ? 's' : ''}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold'
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

