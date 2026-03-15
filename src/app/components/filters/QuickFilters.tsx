import { Search, ChevronDown } from 'lucide-react';
import type { TimeRange, ActiveMode } from '../../hooks/useFilters';

interface QuickFiltersProps {
  timeRange: TimeRange;
  activeMode?: ActiveMode;
  onFilterChange: (filterKey: TimeRange) => void;
  onResetDate?: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  lifecycleFilter?: string;
  onLifecycleFilterChange?: (value: string) => void;
}

const lifecycleOptions = [
  { key: 'ALL', label: 'Tous les statuts' },
  { key: 'TO_PREPARE', label: 'A préparer' },
  { key: 'IN_PREPARATION', label: 'En préparation' },
  { key: 'READY_TO_SHIP', label: 'Prêt' },
  { key: 'SHIPPED', label: 'Expédié' },
];

export default function QuickFilters({
  timeRange,
  activeMode,
  onFilterChange,
  onResetDate,
  searchTerm,
  onSearchChange,
  lifecycleFilter,
  onLifecycleFilterChange,
}: QuickFiltersProps) {
  const filters = [
    { key: 'all' as TimeRange, label: 'Tout' },
    { key: 'today' as TimeRange, label: "Auj." },
    { key: 'week' as TimeRange, label: 'Semaine' },
    { key: 'month' as TimeRange, label: 'Mois' },
  ];

  const handleFilterClick = (filterKey: TimeRange) => {
    onFilterChange(filterKey);
    // Réinitialiser la date de référence quand on change de filtre
    if (filterKey !== 'all' && onResetDate) {
      onResetDate();
    }
  };

  return (
    <div className='space-y-2'>
      {/* Search input */}
      {onSearchChange && (
        <div className='relative mb-2'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            value={searchTerm || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder='Rechercher...'
            className='w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#12895a] focus:ring-1 focus:ring-[#12895a] transition-colors'
          />
        </div>
      )}

      {/* Combined filter chips row */}
      <div className='flex gap-2 overflow-x-auto pb-2 items-center'>
        {filters.map((filter) => {
          const isActive = timeRange === filter.key;
          return (
            <button
              key={filter.key}
              onClick={() => handleFilterClick(filter.key)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#12895a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          );
        })}

        {onLifecycleFilterChange && (
          <>
            <span className='text-gray-300 text-lg select-none'>·</span>
            <div className='relative'>
              <select
                value={lifecycleFilter || 'ALL'}
                onChange={(e) => onLifecycleFilterChange(e.target.value)}
                className={`appearance-none pl-3 pr-7 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#12895a] ${
                  (lifecycleFilter || 'ALL') !== 'ALL'
                    ? 'bg-[#12895a]/10 text-[#12895a] border border-[#12895a]'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {lifecycleOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none' />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
