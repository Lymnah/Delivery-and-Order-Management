import { useState } from 'react';
import { addDays } from 'date-fns';
import type { Dayjs } from 'dayjs';

export type TimeRange = 'all' | 'today' | 'week' | 'month' | 'custom' | 'documents';
export type ActiveMode = 'period' | 'documents';

/**
 * Hook to manage filter state and navigation
 */
export const useFilters = (initialDate: Date) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [filterReferenceDate, setFilterReferenceDate] = useState(initialDate);
  const [customStartDate, setCustomStartDate] = useState<Dayjs | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Dayjs | null>(null);
  const [activeMode, setActiveMode] = useState<ActiveMode>('period');

  const navigatePeriod = (direction: 'prev' | 'next') => {
    if (timeRange === 'today') {
      setFilterReferenceDate(
        addDays(filterReferenceDate, direction === 'prev' ? -1 : 1)
      );
    } else if (timeRange === 'week') {
      setFilterReferenceDate(
        addDays(filterReferenceDate, direction === 'prev' ? -7 : 7)
      );
    } else if (timeRange === 'month') {
      const newDate = new Date(filterReferenceDate);
      newDate.setMonth(
        newDate.getMonth() + (direction === 'prev' ? -1 : 1)
      );
      setFilterReferenceDate(newDate);
    }
  };

  return {
    timeRange,
    setTimeRange,
    filterReferenceDate,
    setFilterReferenceDate,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    activeMode,
    setActiveMode,
    navigatePeriod,
  };
};

