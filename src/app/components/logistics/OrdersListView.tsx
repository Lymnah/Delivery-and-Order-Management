import React, { useState, useMemo } from 'react';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  subDays,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft } from 'lucide-react';
import { Switch } from '@mui/material';
import QuickFilters from '../filters/QuickFilters';
import PeriodNavigation from '../filters/PeriodNavigation';
import OrderCard from '../orders/OrderCard';
import StockOutDivider from './StockOutDivider';
import {
  groupOrdersByDate,
  getSectionDateLabel,
  getDaysUntil,
} from '../../utils/dateHelpers';
import type { TimeRange, ActiveMode } from '../../hooks/useFilters';
import type { Order, UnifiedOrder, StockStatus } from '../../../data/database';
import {
  getSortedUnifiedOrdersByPriority,
  calculateProjectedStatuses,
  calculateFirstStockoutProducts,
  getUnifiedOrdersForAtelier,
  mapSalesOrderToUnified,
  mapDeliveryNoteToUnified,
} from '../../utils/unifiedOrderHelpers';
import { salesOrders, deliveryNotes } from '../../../data/database';

interface OrdersListViewProps {
  orders?: Order[]; // Legacy support
  unifiedOrders?: UnifiedOrder[]; // New unified format
  timeRange: TimeRange;
  activeMode: ActiveMode;
  filterReferenceDate: Date;
  today: Date;
  onFilterChange: (filterKey: TimeRange) => void;
  onResetDate: () => void;
  onNavigatePeriod: (direction: 'prev' | 'next') => void;
  onOrderClick: (order: Order | UnifiedOrder) => void;
  useUnifiedView?: boolean; // Flag to use unified view
}

export default function OrdersListView({
  orders,
  unifiedOrders,
  timeRange,
  activeMode,
  filterReferenceDate,
  today,
  onFilterChange,
  onResetDate,
  onNavigatePeriod,
  onOrderClick,
  useUnifiedView = false,
}: OrdersListViewProps) {
  // Projection mode state
  const [isProjectedMode, setIsProjectedMode] = useState(false);
  // Show past orders state (for "Voir précédents" button)
  const [showPastOrders, setShowPastOrders] = useState(false);

  // Use unified view if flag is set or if unifiedOrders is provided
  const useUnified = useUnifiedView || !!unifiedOrders;

  // Get unified orders sorted by priority if using unified view
  // Use unifiedOrders prop if provided, otherwise get from helper
  const sortedUnifiedOrders = useUnified
    ? unifiedOrders && unifiedOrders.length > 0
      ? unifiedOrders
      : getSortedUnifiedOrdersByPriority(today)
    : [];

  // Calculate projected statuses ONLY if projection mode is active
  // IMPORTANT: Calculate on ALL unified orders (not filtered) because future orders impact current stock
  // We'll filter the results later for display
  const allUnifiedOrders = useUnified
    ? unifiedOrders && unifiedOrders.length > 0
      ? unifiedOrders
      : getSortedUnifiedOrdersByPriority(today)
    : [];

  const projectedStatuses = useMemo(() => {
    if (!isProjectedMode || !useUnified || allUnifiedOrders.length === 0) {
      return null;
    }
    // Calculate on all orders to get accurate cumulative projection
    return calculateProjectedStatuses(allUnifiedOrders);
  }, [allUnifiedOrders, isProjectedMode, useUnified]);

  // Calculate which products first go out of stock in each order (for dividers)
  const firstStockoutProducts = useMemo(() => {
    if (!isProjectedMode || !useUnified || allUnifiedOrders.length === 0) {
      return null;
    }
    // Calculate on all orders to get accurate first stockout tracking
    return calculateFirstStockoutProducts(allUnifiedOrders);
  }, [allUnifiedOrders, isProjectedMode, useUnified]);

  // Filter unified orders by timeRange
  let filteredUnifiedOrders = sortedUnifiedOrders;
  if (useUnified) {
    if (timeRange === 'today') {
      // Pour "Aujourd'hui", toujours utiliser la date d'aujourd'hui (today)
      const normalizedToday = new Date(today);
      normalizedToday.setHours(0, 0, 0, 0);
      filteredUnifiedOrders = sortedUnifiedOrders.filter((order) => {
        // Normalize order date to midnight
        const normalizedOrderDate = new Date(order.deliveryDate);
        normalizedOrderDate.setHours(0, 0, 0, 0);
        return isSameDay(normalizedOrderDate, normalizedToday);
      });
    } else if (timeRange === 'week') {
      // Normalize filterReferenceDate to midnight for consistent comparison
      const normalizedFilterDate = new Date(filterReferenceDate);
      normalizedFilterDate.setHours(0, 0, 0, 0);
      const weekStart = startOfWeek(filterReferenceDate, {
        locale: fr,
      });
      const weekEnd = endOfWeek(filterReferenceDate, {
        locale: fr,
      });
      filteredUnifiedOrders = filteredUnifiedOrders.filter(
        (order) =>
          order.deliveryDate >= weekStart && order.deliveryDate <= weekEnd
      );
    } else if (timeRange === 'month') {
      const monthStart = startOfMonth(filterReferenceDate);
      const monthEnd = endOfMonth(filterReferenceDate);
      filteredUnifiedOrders = filteredUnifiedOrders.filter(
        (order) =>
          order.deliveryDate >= monthStart && order.deliveryDate <= monthEnd
      );
    }
  }

  // Legacy: Filter orders according to timeRange
  let filteredOrders = orders || [];
  if (!useUnified) {
    if (timeRange === 'today') {
      // Pour "Aujourd'hui", toujours utiliser la date d'aujourd'hui (today)
      filteredOrders = filteredOrders.filter((order) =>
        isSameDay(order.deliveryDate, today)
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
  }

  // Group by date (for legacy orders)
  const grouped = useUnified ? {} : groupOrdersByDate(filteredOrders);
  const sortedDates = Object.keys(grouped).sort();

  // Add past orders if "Voir précédents" is enabled (max 15 days back)
  const ordersWithPast = useMemo(() => {
    if (!useUnified || !showPastOrders) {
      return filteredUnifiedOrders;
    }

    // Get past orders directly from database (SHIPPED/INVOICED orders in the past)
    const fifteenDaysAgo = subDays(today, 15);
    const normalizedToday = new Date(today);
    normalizedToday.setHours(0, 0, 0, 0);
    const normalizedFifteenDaysAgo = new Date(fifteenDaysAgo);
    normalizedFifteenDaysAgo.setHours(0, 0, 0, 0);

    // Get past SalesOrders (SHIPPED/INVOICED)
    const pastSalesOrders = salesOrders.filter((so) => {
      const orderDate = new Date(so.deliveryDate);
      orderDate.setHours(0, 0, 0, 0);
      return (
        (so.status === 'SHIPPED' || so.status === 'INVOICED') &&
        orderDate < normalizedToday &&
        orderDate >= normalizedFifteenDaysAgo
      );
    });

    // Get past DeliveryNotes (SHIPPED/INVOICED)
    const pastDeliveryNotes = deliveryNotes.filter((dn) => {
      const orderDate = new Date(dn.deliveryDate);
      orderDate.setHours(0, 0, 0, 0);
      return (
        (dn.status === 'SHIPPED' || dn.status === 'INVOICED') &&
        orderDate < normalizedToday &&
        orderDate >= normalizedFifteenDaysAgo
      );
    });

    // Convert to UnifiedOrder
    const pastUnifiedOrders: UnifiedOrder[] = [];

    // Add past SalesOrders as UnifiedOrders
    pastSalesOrders.forEach((so) => {
      const unified = mapSalesOrderToUnified(so);
      if (unified) {
        pastUnifiedOrders.push(unified);
      }
    });

    // Add past DeliveryNotes as UnifiedOrders (they have priority over BC)
    pastDeliveryNotes.forEach((dn) => {
      const unified = mapDeliveryNoteToUnified(dn);
      if (unified) {
        pastUnifiedOrders.push(unified);
      }
    });

    // Combine past orders with current filtered orders
    const combined = [...pastUnifiedOrders, ...filteredUnifiedOrders];

    // Remove duplicates based on order ID (BL has priority over BC)
    const uniqueOrders = new Map<string, UnifiedOrder>();
    combined.forEach((order) => {
      // If it's a BL, it replaces any BC with the same ID
      if (order.sourceType === 'BL') {
        uniqueOrders.set(order.id, order);
      } else if (!uniqueOrders.has(order.id)) {
        uniqueOrders.set(order.id, order);
      }
    });

    return Array.from(uniqueOrders.values());
  }, [filteredUnifiedOrders, showPastOrders, useUnified, today]);

  // Group unified orders by date (normalize dates to midnight for consistent grouping)
  // In projection mode, sort chronologically before grouping
  const ordersToGroup = useUnified
    ? isProjectedMode
      ? [...ordersWithPast].sort(
          (a, b) =>
            new Date(a.deliveryDate).getTime() -
            new Date(b.deliveryDate).getTime()
        )
      : ordersWithPast
    : [];

  const groupedUnified: Record<string, UnifiedOrder[]> = {};
  if (useUnified) {
    ordersToGroup.forEach((order) => {
      // Normalize delivery date to midnight to ensure consistent grouping
      const normalizedDate = new Date(order.deliveryDate);
      normalizedDate.setHours(0, 0, 0, 0);

      const dateKey = `${normalizedDate.getFullYear()}-${String(
        normalizedDate.getMonth() + 1
      ).padStart(2, '0')}-${String(normalizedDate.getDate()).padStart(2, '0')}`;
      if (!groupedUnified[dateKey]) {
        groupedUnified[dateKey] = [];
      }
      groupedUnified[dateKey].push(order);
    });
  }
  const sortedUnifiedDates = Object.keys(groupedUnified).sort();

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

      {/* Projection Stock Toggle */}
      {useUnified && (
        <div className='mb-4 flex items-center justify-end gap-3'>
          <span className='text-sm font-medium text-gray-700'>Cumulé</span>
          <Switch
            checked={isProjectedMode}
            onChange={(e) => setIsProjectedMode(e.target.checked)}
            sx={{
              width: 44,
              height: 24,
              padding: 0,
              '& .MuiSwitch-switchBase': {
                padding: '2px',
                '&.Mui-checked': {
                  transform: 'translateX(20px)',
                  color: '#fff',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#12895a',
                    opacity: 1,
                  },
                },
              },
              '& .MuiSwitch-thumb': {
                width: 20,
                height: 20,
                boxShadow: 'none',
              },
              '& .MuiSwitch-track': {
                borderRadius: '50px',
                backgroundColor: '#A4A7AE',
                opacity: 1,
              },
            }}
          />
        </div>
      )}

      {/* Liste groupée par date avec filtres */}
      <div className='space-y-4 pb-20'>
        {useUnified ? (
          // Unified view
          sortedUnifiedDates.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <p className='text-[14px]'>Aucune commande pour cette période</p>
            </div>
          ) : (
            sortedUnifiedDates.map((dateKey) => {
              // Parse dateKey (YYYY-MM-DD) and normalize to local midnight
              const [year, month, day] = dateKey.split('-').map(Number);
              const date = new Date(year, month - 1, day, 0, 0, 0, 0);
              const dayOrders = groupedUnified[dateKey];
              const daysUntil = getDaysUntil(date, today);

              // Rouge pour aujourd'hui ou dans le passé, gris pour le reste
              const sectionColor =
                daysUntil <= 0 ? 'text-red-700' : 'text-gray-700';

              // Check if this is today's section
              const isToday = daysUntil === 0;

              return (
                <div key={dateKey} className='space-y-2'>
                  <div className='flex items-center justify-between py-2'>
                    {/* Groupe gauche : Bouton + Titre (collés) */}
                    <div className='flex items-center gap-2'>
                      <p
                        className={`font-semibold text-[14px] ${sectionColor}`}
                      >
                        {getSectionDateLabel(date, daysUntil)}
                      </p>
                      {/* "Voir précédents" button - only for today's section */}
                      {isToday && (
                        <button
                          onClick={() => setShowPastOrders(!showPastOrders)}
                          className='flex items-center gap-2 text-[#12895a] -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
                        >
                          <span className='text-[12px] font-semibold'>
                            {showPastOrders ? 'Masquer' : 'Voir précédents'}
                          </span>
                        </button>
                      )}
                    </div>
                    {/* Badge à droite */}
                    <span className='text-[12px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0'>
                      {dayOrders.length}
                    </span>
                  </div>
                  <div className='space-y-2 pl-2'>
                    {dayOrders.map((unifiedOrder, index) => {
                      // Inject projected stock status if projection mode is active
                      const specificStockStatus: StockStatus | undefined =
                        isProjectedMode && projectedStatuses
                          ? projectedStatuses.get(unifiedOrder.id)
                          : undefined;

                      // Check if this order has products that first go out of stock
                      const firstStockoutsInThisOrder =
                        isProjectedMode && firstStockoutProducts
                          ? firstStockoutProducts.get(unifiedOrder.id)
                          : null;

                      return (
                        <div key={unifiedOrder.id}>
                          {/* UX: Stock Out Divider - one per product that first goes out of stock */}
                          {firstStockoutsInThisOrder &&
                            firstStockoutsInThisOrder.size > 0 &&
                            Array.from(firstStockoutsInThisOrder).map(
                              (productId) => (
                                <StockOutDivider
                                  key={`${unifiedOrder.id}-${productId}`}
                                  unifiedOrder={unifiedOrder}
                                  productId={productId}
                                />
                              )
                            )}

                          <OrderCard
                            unifiedOrder={{
                              ...unifiedOrder,
                              // Override stockStatus with projected status if available
                              stockStatus:
                                specificStockStatus || unifiedOrder.stockStatus,
                            }}
                            today={today}
                            onClick={onOrderClick}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )
        ) : // Legacy view
        sortedDates.length === 0 ? (
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
