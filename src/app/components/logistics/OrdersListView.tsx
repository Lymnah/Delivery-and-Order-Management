import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import QuickFilters from '../filters/QuickFilters';
import PeriodNavigation from '../filters/PeriodNavigation';
import OrderCard from '../orders/OrderCard';
import { groupOrdersByDate, getSectionDateLabel, getDaysUntil } from '../../utils/dateHelpers';
import type { TimeRange, ActiveMode } from '../../hooks/useFilters';
import type { Order } from '../../../data/database';

interface OrdersListViewProps {
  orders: Order[];
  timeRange: TimeRange;
  activeMode: ActiveMode;
  filterReferenceDate: Date;
  today: Date;
  onFilterChange: (filterKey: TimeRange) => void;
  onResetDate: () => void;
  onNavigatePeriod: (direction: 'prev' | 'next') => void;
  onOrderClick: (order: Order) => void;
}

export default function OrdersListView({
  orders,
  timeRange,
  activeMode,
  filterReferenceDate,
  today,
  onFilterChange,
  onResetDate,
  onNavigatePeriod,
  onOrderClick,
}: OrdersListViewProps) {
  // Filtrer les commandes selon le timeRange
  let filteredOrders = orders;

  if (timeRange === 'today') {
    filteredOrders = filteredOrders.filter((order) =>
      isSameDay(order.deliveryDate, filterReferenceDate)
    );
  } else if (timeRange === 'week') {
    const weekStart = startOfWeek(filterReferenceDate, {
      locale: fr,
    });
    const weekEnd = endOfWeek(filterReferenceDate, {
      locale: fr,
    });
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.deliveryDate >= weekStart && order.deliveryDate <= weekEnd
    );
  } else if (timeRange === 'month') {
    const monthStart = startOfMonth(filterReferenceDate);
    const monthEnd = endOfMonth(filterReferenceDate);
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.deliveryDate >= monthStart && order.deliveryDate <= monthEnd
    );
  }
  // 'all' ne filtre rien

  const grouped = groupOrdersByDate(filteredOrders);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <>
      {/* Filtres rapides avec navigation */}
      <div className='mb-4'>
        <QuickFilters
          timeRange={timeRange}
          activeMode={activeMode}
          onFilterChange={onFilterChange}
          onResetDate={onResetDate}
        />

        {/* Navigation par période (flèches) */}
        {timeRange !== 'all' && activeMode === 'period' && (
          <PeriodNavigation
            timeRange={timeRange}
            filterReferenceDate={filterReferenceDate}
            onNavigate={onNavigatePeriod}
          />
        )}
      </div>

      {/* Liste groupée par date avec filtres */}
      <div className='space-y-4 pb-20'>
        {sortedDates.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <p className='text-[14px]'>Aucune commande pour cette période</p>
          </div>
        ) : (
          sortedDates.map((dateKey) => {
            // Parse dateKey (YYYY-MM-DD) and normalize to local midnight
            const [year, month, day] = dateKey.split('-').map(Number);
            const date = new Date(year, month - 1, day, 0, 0, 0, 0);
            const dayOrders = grouped[dateKey];
            const daysUntil = getDaysUntil(date, today);

            // Rouge pour aujourd'hui ou dans le passé, gris pour le reste
            const sectionColor =
              daysUntil <= 0 ? 'text-red-700' : 'text-gray-700';

            return (
              <div key={dateKey} className='space-y-2'>
                <div className='flex items-center gap-3 py-2'>
                  <p
                    className={`font-semibold text-[14px] ${sectionColor} flex-1`}
                  >
                    {getSectionDateLabel(date, daysUntil)}
                  </p>
                  <span className='text-[12px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'>
                    {dayOrders.length}
                  </span>
                </div>
                <div className='space-y-2 pl-2'>
                  {dayOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      today={today}
                      onClick={onOrderClick}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

