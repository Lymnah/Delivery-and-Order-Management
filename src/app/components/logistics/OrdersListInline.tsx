import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { clientLogos } from '../../../data/database';
import type { Order } from '../../../data/database';
import { getDaysUntil } from '../../utils/dateHelpers';

interface OrdersListInlineProps {
  orders: Order[];
  today: Date;
  onOrderClick: (order: Order) => void;
}

export default function OrdersListInline({
  orders,
  today,
  onOrderClick,
}: OrdersListInlineProps) {
  return (
    <div className='space-y-4 pb-20'>
      {orders.map((order) => {
        const totalQty = order.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
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
            onClick={() => onOrderClick(order)}
            className={`border rounded-lg p-4 relative cursor-pointer transition-all ${
              order.type === 'BC'
                ? 'border-blue-300 bg-blue-50/40 hover:bg-blue-50'
                : 'border-orange-300 bg-orange-50/40 hover:bg-orange-50'
            }`}
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

                {/* Line 3: Order contents */}
                <p className='text-[13px] text-gray-700'>
                  {order.items.length} article
                  {order.items.length > 1 ? 's' : ''} différent
                  {order.items.length > 1 ? 's' : ''} • {totalQty} unités
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
