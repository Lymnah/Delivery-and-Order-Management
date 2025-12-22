import ProductCard from '../ProductCard';
import QuickFilters from '../filters/QuickFilters';
import PeriodNavigation from '../filters/PeriodNavigation';
import type { TimeRange, ActiveMode } from '../../hooks/useFilters';

interface ProductsViewProps {
  aggregatedProducts: Array<{
    product: any;
    quantity: number;
    deficit: number;
    orders: any[];
  }>;
  timeRange: TimeRange;
  activeMode: ActiveMode;
  filterReferenceDate: Date;
  today: Date;
  onFilterChange: (filterKey: TimeRange) => void;
  onResetDate: () => void;
  onNavigatePeriod: (direction: 'prev' | 'next') => void;
  onProductClick: (product: any, orders: any[]) => void;
  onDocumentsClick: (product: any, orders: any[], e: React.MouseEvent) => void;
}

export default function ProductsView({
  aggregatedProducts,
  timeRange,
  activeMode,
  filterReferenceDate,
  today,
  onFilterChange,
  onResetDate,
  onNavigatePeriod,
  onProductClick,
  onDocumentsClick,
}: ProductsViewProps) {
  return (
    <div>
      {/* Filtres rapides pour produits */}
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

      {/* Aggregated Products */}
      <div className='space-y-3 pb-20'>
        {aggregatedProducts.length > 0 ? (
          aggregatedProducts.map(({ product, quantity, deficit, orders }) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantity}
              deficit={deficit}
              orders={orders}
              onCardClick={() => onProductClick(product, orders)}
              onDocumentsClick={(e) => onDocumentsClick(product, orders, e)}
            />
          ))
        ) : (
          <div className='text-center py-8 text-gray-500'>
            <p className='text-[14px]'>Aucun produit à livrer pour cette période</p>
          </div>
        )}
      </div>
    </div>
  );
}

