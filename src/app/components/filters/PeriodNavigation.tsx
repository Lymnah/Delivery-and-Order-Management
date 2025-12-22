import { format, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays } from 'date-fns';
import type { TimeRange } from '../../hooks/useFilters';

interface PeriodNavigationProps {
  timeRange: TimeRange;
  filterReferenceDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export default function PeriodNavigation({
  timeRange,
  filterReferenceDate,
  onNavigate,
}: PeriodNavigationProps) {
  if (timeRange === 'all') {
    return null;
  }

  const getPeriodLabel = () => {
    if (timeRange === 'today') {
      return format(filterReferenceDate, 'EEEE dd MMMM', {
        locale: fr,
      });
    } else if (timeRange === 'week') {
      return `Semaine du ${format(
        startOfWeek(filterReferenceDate, {
          locale: fr,
        }),
        'dd MMM',
        { locale: fr }
      )}`;
    } else if (timeRange === 'month') {
      return format(filterReferenceDate, 'MMMM yyyy', {
        locale: fr,
      });
    }
    return '';
  };

  return (
    <div className='flex items-center justify-center gap-4 mt-2'>
      <button
        onClick={() => onNavigate('prev')}
        className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
      >
        <ChevronLeft className='w-5 h-5 text-gray-600' />
      </button>

      <div className='text-center min-w-[120px]'>
        <p className='text-[12px] font-semibold text-gray-700'>
          {getPeriodLabel()}
        </p>
      </div>

      <button
        onClick={() => onNavigate('next')}
        className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
      >
        <ChevronRight className='w-5 h-5 text-gray-600' />
      </button>
    </div>
  );
}

