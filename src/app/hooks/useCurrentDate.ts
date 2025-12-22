import { useState, useEffect } from 'react';
import { getToday } from '../../data/database';

/**
 * Hook to manage the current date, updating it at midnight each day
 */
export const useCurrentDate = () => {
  const [now, setNow] = useState(getToday());

  useEffect(() => {
    const updateDate = () => {
      setNow(getToday());
    };

    // Mettre à jour immédiatement
    updateDate();

    // Calculer le temps jusqu'à minuit prochain
    const getMsUntilMidnight = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow.getTime() - Date.now();
    };

    // Programmer la mise à jour à minuit
    const timeoutId = setTimeout(() => {
      updateDate();
      // Ensuite, mettre à jour toutes les heures pour être sûr
      const intervalId = setInterval(updateDate, 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, getMsUntilMidnight());

    return () => clearTimeout(timeoutId);
  }, []);

  return now;
};

