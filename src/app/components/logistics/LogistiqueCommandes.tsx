import { ChevronLeft, Calendar as CalendarIcon, List as ListIcon } from 'lucide-react';
import OrderDetailsPage from '../orders/OrderDetailsPage';
import ProductsView from './ProductsView';
import OrdersListView from './OrdersListView';
import CalendarView from './CalendarView';
import type { Order } from '../../../data/database';
import type { TimeRange, ActiveMode } from '../../hooks/useFilters';

type Mode = 'clients' | 'products';
type View = 'list' | 'calendar';

interface LogistiqueCommandesProps {
  mode: Mode;
  view: View;
  timeRange: TimeRange;
  activeMode: ActiveMode;
  filterReferenceDate: Date;
  today: Date;
  showOrderDetailsPage: boolean;
  selectedOrder: Order | null;
  selectedProductsInOrder: string[];
  selectedCalendarDay: Date | null;
  currentDate: Date;
  aggregatedProducts: Array<{
    product: any;
    quantity: number;
    deficit: number;
    orders: any[];
  }>;
  orders: Order[];
  onBack: () => void;
  onModeChange: (mode: Mode) => void;
  onViewChange: (view: View) => void;
  onFilterChange: (filterKey: TimeRange) => void;
  onResetDate: () => void;
  onNavigatePeriod: (direction: 'prev' | 'next') => void;
  onOrderClick: (order: Order) => void;
  onOrderDetailsBack: () => void;
  onSelectionToggle: (productId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onCreateManufacturingOrder: (quantities: Record<string, number>) => void;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onProductClick: (product: any, orders: any[]) => void;
  onDocumentsClick: (product: any, orders: any[], e: React.MouseEvent) => void;
  getOrdersForDate: (date: Date) => Order[];
}

export default function LogistiqueCommandes({
  mode,
  view,
  timeRange,
  activeMode,
  filterReferenceDate,
  today,
  showOrderDetailsPage,
  selectedOrder,
  selectedProductsInOrder,
  selectedCalendarDay,
  currentDate,
  aggregatedProducts,
  orders,
  onBack,
  onModeChange,
  onViewChange,
  onFilterChange,
  onResetDate,
  onNavigatePeriod,
  onOrderClick,
  onOrderDetailsBack,
  onSelectionToggle,
  onSelectAll,
  onDeselectAll,
  onCreateManufacturingOrder,
  onDateSelect,
  onMonthChange,
  onProductClick,
  onDocumentsClick,
  getOrdersForDate,
}: LogistiqueCommandesProps) {
  return (
    <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
      <div
        className={`absolute bg-white top-[87px] left-0 w-[393px] h-[691px] px-4 pt-4 ${
          mode === 'clients' && showOrderDetailsPage && selectedOrder
            ? 'flex flex-col overflow-hidden'
            : 'overflow-y-auto pb-7'
        }`}
      >
        {/* Order Details Page - Full page view */}
        {mode === 'clients' && showOrderDetailsPage && selectedOrder ? (
          <OrderDetailsPage
            order={selectedOrder}
            selectedProductsInOrder={selectedProductsInOrder}
            onBack={onOrderDetailsBack}
            onSelectionToggle={onSelectionToggle}
            onSelectAll={onSelectAll}
            onDeselectAll={onDeselectAll}
            onCreateManufacturingOrder={onCreateManufacturingOrder}
          />
        ) : (
          <>
            {/* Back button */}
            <button
              onClick={onBack}
              className='flex items-center gap-2 text-[#12895a] mb-3 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
            >
              <ChevronLeft className='w-5 h-5' />
              <span className='text-[14px] font-semibold'>Retour</span>
            </button>

            {/* Header avec bouton bascule Liste/Calendrier et Mode */}
            <div className='flex items-center justify-between mb-4'>
              <div className='flex gap-2'>
                <button
                  onClick={() => onModeChange('clients')}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                    mode === 'clients'
                      ? 'bg-[#12895a] text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Commandes
                </button>
                <button
                  onClick={() => {
                    onModeChange('products');
                    // Conserver le filtre actif (timeRange et filterReferenceDate)
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                    mode === 'products'
                      ? 'bg-[#12895a] text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Produits
                </button>
              </div>
              {mode === 'clients' && (
                <button
                  onClick={() => onViewChange(view === 'list' ? 'calendar' : 'list')}
                  className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12895a] text-white text-[12px] font-semibold hover:bg-[#107a4d] transition-colors'
                >
                  {view === 'list' ? (
                    <>
                      <CalendarIcon className='w-4 h-4' />
                      Calendrier
                    </>
                  ) : (
                    <>
                      <ListIcon className='w-4 h-4' />
                      Liste
                    </>
                  )}
                </button>
              )}
            </div>

            {mode === 'products' ? (
              <ProductsView
                aggregatedProducts={aggregatedProducts}
                timeRange={timeRange}
                activeMode={activeMode}
                filterReferenceDate={filterReferenceDate}
                today={today}
                onFilterChange={onFilterChange}
                onResetDate={onResetDate}
                onNavigatePeriod={onNavigatePeriod}
                onProductClick={onProductClick}
                onDocumentsClick={onDocumentsClick}
              />
            ) : view === 'list' ? (
              <OrdersListView
                orders={orders}
                timeRange={timeRange}
                activeMode={activeMode}
                filterReferenceDate={filterReferenceDate}
                today={today}
                onFilterChange={onFilterChange}
                onResetDate={onResetDate}
                onNavigatePeriod={onNavigatePeriod}
                onOrderClick={onOrderClick}
              />
            ) : (
              <CalendarView
                selectedCalendarDay={selectedCalendarDay}
                currentDate={currentDate}
                orders={orders}
                today={today}
                onDateSelect={onDateSelect}
                onMonthChange={onMonthChange}
                onOrderClick={onOrderClick}
                getOrdersForDate={getOrdersForDate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

