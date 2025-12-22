import type { TimeRange, ActiveMode } from '../../hooks/useFilters';

interface QuickFiltersProps {
  timeRange: TimeRange;
  activeMode?: ActiveMode;
  onFilterChange: (filterKey: TimeRange) => void;
  onResetDate?: () => void;
}

export default function QuickFilters({
  timeRange,
  activeMode,
  onFilterChange,
  onResetDate,
}: QuickFiltersProps) {
  const filters = [
    { key: 'all' as TimeRange, label: 'Tout' },
    { key: 'today' as TimeRange, label: "Aujourd'hui" },
    { key: 'week' as TimeRange, label: 'Cette semaine' },
    { key: 'month' as TimeRange, label: 'Ce mois' },
  ];

  const handleFilterClick = (filterKey: TimeRange) => {
    onFilterChange(filterKey);
    // Réinitialiser la date de référence quand on change de filtre
    if (filterKey !== 'all' && onResetDate) {
      onResetDate();
    }
  };

  return (
    <div className='flex gap-2 mb-2 overflow-x-auto pb-2'>
      {filters.map((filter) => {
        const isActive =
          timeRange === filter.key &&
          (activeMode === undefined || activeMode === 'period');
        return (
          <button
            key={filter.key}
            onClick={() => handleFilterClick(filter.key)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap ${
              isActive
                ? 'bg-[#12895a] text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

