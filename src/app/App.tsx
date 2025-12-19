import { useState, useEffect } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  List as ListIcon,
  Calendar as CalendarIcon,
  Package,
  Plus,
} from 'lucide-react';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import WifiIcon from '@mui/icons-material/Wifi';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import type { Dayjs } from 'dayjs';
import svgPaths from '../imports/svg-386lc3yi7f';
import svgPathsStock from '../imports/svg-gt4hwy99w6';
import {
  products,
  orders,
  clientLogos,
  getToday,
  type Product,
  type Order,
} from '../data/database';
import Dashboard from './Dashboard';

// Set dayjs locale globally
dayjs.locale('fr');

function StatusBar() {
  return (
    <div className='absolute bg-white flex h-[59px] items-end justify-between left-1/2 top-0 translate-x-[-50%] w-[393px] px-4'>
      <p className='text-[16px] mb-2'>9:41</p>
      <div className='flex gap-1 items-center mb-2'>
        <SignalCellularAltIcon sx={{ fontSize: 16 }} />
        <WifiIcon sx={{ fontSize: 16 }} />
        <BatteryFullIcon sx={{ fontSize: 20 }} />
      </div>
    </div>
  );
}

function TabBar() {
  return (
    <div className='absolute backdrop-blur-[10px] backdrop-filter bg-white left-1/2 top-[59px] translate-x-[-50%] w-[393px] py-2 border-b border-gray-200'>
      <div className='flex items-center justify-center gap-2'>
        <div className='w-3 h-3 opacity-60'>🔒</div>
        <p className='text-[12px]'>apenda.app/</p>
      </div>
    </div>
  );
}

function NavBar({
  currentView,
  onViewChange,
}: {
  currentView:
    | 'dashboard'
    | 'logistique-selection'
    | 'logistique'
    | 'logistique-option1'
    | 'logistique-option2'
    | 'logistique-option3'
    | 'logistique-option4'
    | 'logistique-option5';
  onViewChange: (
    view:
      | 'dashboard'
      | 'logistique-selection'
      | 'logistique'
      | 'logistique-option1'
      | 'logistique-option2'
      | 'logistique-option3'
      | 'logistique-option4'
      | 'logistique-option5'
  ) => void;
}) {
  return (
    <div className='absolute bg-[#12895a] bottom-0 flex items-center justify-around left-1/2 translate-x-[-50%] w-[393px] h-[75px]'>
      <button
        onClick={() => onViewChange('dashboard')}
        className='flex flex-col items-center text-white'
      >
        {currentView === 'dashboard' && (
          <div className='w-16 h-1 bg-white rounded-b-lg mb-5'></div>
        )}
        <HomeIcon
          sx={{
            fontSize: 28,
            marginBottom: currentView === 'dashboard' ? '0px' : '4px',
            opacity: currentView === 'dashboard' ? 1 : 0.5,
          }}
        />
      </button>
      <button
        onClick={() => onViewChange('logistique-selection')}
        className='flex flex-col items-center text-white'
      >
        {(currentView === 'logistique' ||
          currentView === 'logistique-selection' ||
          currentView === 'logistique-option1' ||
          currentView === 'logistique-option2' ||
          currentView === 'logistique-option3' ||
          currentView === 'logistique-option4' ||
          currentView === 'logistique-option5') && (
          <div className='w-16 h-1 bg-white rounded-b-lg mb-5'></div>
        )}
        <DescriptionIcon
          sx={{
            fontSize: 28,
            marginBottom:
              currentView === 'logistique' ||
              currentView === 'logistique-selection' ||
              currentView === 'logistique-option1' ||
              currentView === 'logistique-option2' ||
              currentView === 'logistique-option3' ||
              currentView === 'logistique-option4' ||
              currentView === 'logistique-option5'
                ? '0px'
                : '4px',
            opacity:
              currentView === 'logistique' ||
              currentView === 'logistique-selection' ||
              currentView === 'logistique-option1' ||
              currentView === 'logistique-option2' ||
              currentView === 'logistique-option3' ||
              currentView === 'logistique-option4' ||
              currentView === 'logistique-option5'
                ? 1
                : 0.5,
          }}
        />
      </button>
      <div className='flex flex-col items-center text-white opacity-50'>
        <NotificationsIcon sx={{ fontSize: 28, marginBottom: '4px' }} />
      </div>
      <div className='flex flex-col items-center text-white opacity-50'>
        <MenuIcon sx={{ fontSize: 28, marginBottom: '4px' }} />
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className='absolute bottom-0 h-[34px] left-[calc(50%+0.5px)] translate-x-[-50%] w-[390px]'>
      <div className='absolute bg-black bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]' />
    </div>
  );
}

export default function App() {
  // Navigation state
  const [currentView, setCurrentView] = useState<
    | 'dashboard'
    | 'logistique-selection'
    | 'logistique'
    | 'logistique-option1'
    | 'logistique-option2'
    | 'logistique-option3'
    | 'logistique-option4'
    | 'logistique-option5'
  >('dashboard');

  // Date actuelle (real-time) - mise à jour chaque jour à minuit
  const [now, setNow] = useState(getToday());

  // Mettre à jour la date actuelle chaque jour à minuit
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

  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [mode, setMode] = useState<'clients' | 'products'>('clients');
  const [activeMode, setActiveMode] = useState<'period' | 'documents'>(
    'period'
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetailsPage, setShowOrderDetailsPage] = useState(false);
  const [selectedProductsInOrder, setSelectedProductsInOrder] = useState<
    string[]
  >([]);
  const [currentDate, setCurrentDate] = useState(addDays(now, 7)); // Semaine à venir (J+7) - basé sur la date actuelle
  const [timeRange, setTimeRange] = useState<
    'all' | 'today' | 'week' | 'month' | 'custom' | 'documents'
  >('all');
  // Date de référence pour la navigation des filtres (today, week, month)
  const [filterReferenceDate, setFilterReferenceDate] = useState(now);
  const [customStartDate, setCustomStartDate] = useState<Dayjs | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Dayjs | null>(null);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showPeriodSelector, setShowPeriodSelector] = useState(false);
  const [showManufacturingOrder, setShowManufacturingOrder] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showDocumentPickerModal, setShowDocumentPickerModal] = useState(false);
  const [selectedProductOrders, setSelectedProductOrders] = useState<Order[]>(
    []
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<Date | null>(
    null
  );
  const [manufacturingQuantities, setManufacturingQuantities] = useState<
    Record<string, number>
  >({});

  // Calculate days in current view
  const getDaysInRange = () => {
    if (timeRange === 'week') {
      const start = startOfWeek(currentDate, { locale: fr });
      const end = endOfWeek(currentDate, { locale: fr });
      const days = [];
      let current = start;
      while (current <= end) {
        days.push(current);
        current = addDays(current, 1);
      }
      return days;
    } else if (timeRange === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const days = [];
      let current = start;
      while (current <= end) {
        days.push(current);
        current = addDays(current, 1);
      }
      return days;
    } else if (timeRange === 'custom' && customStartDate && customEndDate) {
      const days = [];
      let current = customStartDate.toDate();
      while (current <= customEndDate.toDate()) {
        days.push(current);
        current = addDays(current, 1);
      }
      return days;
    }
    return [];
  };

  // Get orders with dates recalculated relative to current date
  // This fixes the issue where INITIAL_NOW in database.ts is calculated once at module load
  // The first order should always be "today", so we use it as reference to calculate the offset
  const getOrdersWithCurrentDates = () => {
    const today = now;
    // The first order (id: '1') should be delivered "today" according to database.ts
    // We calculate the offset based on this assumption
    const firstOrderDate = new Date(orders[0].deliveryDate);
    const daysOffset = Math.ceil(
      (today.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If no offset needed (dates are already correct), return orders as-is
    if (daysOffset === 0) {
      return orders;
    }

    // Adjust all delivery dates by the offset
    return orders.map((order) => {
      const orderDate = new Date(order.deliveryDate);
      const adjustedDate = new Date(orderDate);
      adjustedDate.setDate(adjustedDate.getDate() + daysOffset);
      return {
        ...order,
        deliveryDate: adjustedDate,
      };
    });
  };

  // Get orders for a specific date
  const getOrdersForDate = (date: Date) => {
    const currentOrders = getOrdersWithCurrentDates();
    return currentOrders.filter((order) => isSameDay(order.deliveryDate, date));
  };

  // Calculate aggregated products
  const getAggregatedProducts = () => {
    let ordersToAggregate: Order[];

    if (activeMode === 'period') {
      const days = getDaysInRange();
      const currentOrders = getOrdersWithCurrentDates();
      ordersToAggregate = currentOrders.filter((order) =>
        days.some((day) => isSameDay(order.deliveryDate, day))
      );
    } else {
      ordersToAggregate = [];
    }

    const aggregation = new Map<string, number>();
    ordersToAggregate.forEach((order) => {
      order.items.forEach((item) => {
        const current = aggregation.get(item.productId) || 0;
        aggregation.set(item.productId, current + item.quantity);
      });
    });

    return Array.from(aggregation.entries()).map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId)!;
      return {
        product,
        quantity,
        deficit: Math.max(0, quantity - product.stock),
        orders: ordersToAggregate.filter((o) =>
          o.items.some((i) => i.productId === productId)
        ),
      };
    });
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setSelectedProductsInOrder([]);
    setShowOrderDetailsPage(true);
  };

  const getDaysUntil = (date: Date) => {
    const diff = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  // Helper functions for UX options
  const getSortedOrdersByUrgency = () => {
    const currentOrders = getOrdersWithCurrentDates();
    return currentOrders.sort((a, b) => {
      const daysA = getDaysUntil(a.deliveryDate);
      const daysB = getDaysUntil(b.deliveryDate);
      // En retard d'abord, puis par date croissante
      if (daysA < 0 && daysB >= 0) return -1;
      if (daysA >= 0 && daysB < 0) return 1;
      return daysA - daysB;
    });
  };

  // Helper pour formater les textes de date de manière courte
  const getShortDateLabel = (daysUntil: number) => {
    if (daysUntil < 0) {
      return `(Retard ${Math.abs(daysUntil)}j)`;
    } else if (daysUntil === 0) {
      return '(Auj.)';
    } else if (daysUntil < 7) {
      return `(Dans ${daysUntil}j)`;
    }
    return '';
  };

  // Helper pour formater la date complète dans les sections par jour
  const getSectionDateLabel = (date: Date, daysUntil: number) => {
    const dayName = format(date, 'EEEE', { locale: fr });
    const dayNameCapitalized =
      dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const dateShort = format(date, 'dd.MM.yy', { locale: fr });
    const dateLabel = getShortDateLabel(daysUntil);
    return `${dayNameCapitalized} ${dateShort} ${dateLabel}`;
  };

  const groupOrdersByDate = (ordersList: Order[]) => {
    const groups: Record<string, Order[]> = {};
    ordersList.forEach((order) => {
      const dateKey = format(order.deliveryDate, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
    });
    return groups;
  };

  const getOrderCard = (order: Order) => {
    const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const daysUntil = getDaysUntil(order.deliveryDate);

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
        onClick={() => openOrderDetails(order)}
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
  };

  const handleDashboardNavigate = (module: string) => {
    if (module === 'logistique') {
      setCurrentView('logistique-selection');
    }
    // Autres modules peuvent être gérés ici
  };

  return (
    <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
      <StatusBar />
      <TabBar />
      <HomeIndicator />
      <NavBar currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'dashboard' ? (
        <Dashboard onNavigate={handleDashboardNavigate} />
      ) : currentView === 'logistique-selection' ? (
        <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
          {/* Page de sélection Logistique */}
          <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] overflow-y-auto px-4 py-7'>
            <div className='flex flex-col gap-6 items-center justify-center min-h-full'>
              <div className='text-center'>
                <p className='font-semibold text-[24px] mb-2'>Logistique</p>
                <p className='text-[14px] text-gray-600'>
                  Choisissez une option
                </p>
              </div>
              <div className='flex flex-col gap-4 w-full max-w-[280px]'>
                <button
                  onClick={() => {
                    setMode('clients');
                    setView('list');
                    setTimeRange('all');
                    setFilterReferenceDate(now);
                    setCurrentView('logistique-option5');
                  }}
                  className='bg-[#12895a] text-white px-6 py-5 rounded-lg font-semibold text-[16px] hover:bg-[#107a4d] transition-colors flex items-center justify-center gap-3 shadow-md'
                >
                  <DescriptionIcon sx={{ fontSize: 28 }} />
                  Commandes
                </button>
                <button
                  onClick={() => {
                    setMode('products');
                    setCurrentView('logistique');
                  }}
                  className='bg-[#12895a] text-white px-6 py-5 rounded-lg font-semibold text-[16px] hover:bg-[#107a4d] transition-colors flex items-center justify-center gap-3 shadow-md'
                >
                  <Package className='w-7 h-7' />
                  OF
                </button>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className='mt-4 flex items-center gap-2 text-[#12895a] text-[14px] font-semibold hover:underline'
              >
                <ChevronLeft className='w-4 h-4' />
                Retour au Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : currentView === 'logistique-option1' ? (
        // OPTION 1: Vue unique intelligente - Liste triée par urgence + Calendrier simple
        <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
          <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] overflow-y-auto px-4 pt-4 pb-7'>
            {/* Back button */}
            <button
              onClick={() => setCurrentView('logistique-selection')}
              className='flex items-center gap-2 text-[#12895a] mb-3 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
            >
              <ChevronLeft className='w-5 h-5' />
              <span className='text-[14px] font-semibold'>Retour</span>
            </button>

            {/* Header avec bouton Calendrier */}
            <div className='flex items-center justify-between mb-4'>
              <p className='font-semibold text-[18px]'>Commandes</p>
              <button
                onClick={() => setView('calendar')}
                className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12895a] text-white text-[12px] font-semibold hover:bg-[#107a4d] transition-colors'
              >
                <CalendarIcon className='w-4 h-4' />
                Calendrier
              </button>
            </div>

            {view === 'list' ? (
              <div className='space-y-4 pb-20'>
                {getSortedOrdersByUrgency().map((order) => getOrderCard(order))}
              </div>
            ) : (
              <div>
                {/* Calendrier mensuel simple - Le composant MUI a déjà sa propre navigation */}
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale='fr'
                >
                  <DateCalendar
                    value={dayjs(selectedCalendarDay || currentDate)}
                    onChange={(newValue) => {
                      if (newValue) {
                        setSelectedCalendarDay(newValue.toDate());
                      }
                    }}
                    onMonthChange={(newMonth) => {
                      setCurrentDate(newMonth.toDate());
                    }}
                    slots={{
                      day: (dayProps: any) => {
                        const currentDay = dayProps.day.toDate();
                        const dayOrders = getOrdersForDate(currentDay);
                        const totalCount = dayOrders.length;

                        const renderDots = () => {
                          if (totalCount === 0) return null;
                          if (totalCount <= 3) {
                            return (
                              <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5 items-center'>
                                {dayOrders.map((order, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      order.type === 'BC'
                                        ? 'bg-blue-600'
                                        : 'bg-green-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            );
                          }
                          return (
                            <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5 items-center'>
                              {dayOrders.slice(0, 2).map((order, idx) => (
                                <div
                                  key={idx}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    order.type === 'BC'
                                      ? 'bg-blue-600'
                                      : 'bg-green-600'
                                  }`}
                                />
                              ))}
                              <span className='text-[8px] font-bold text-gray-600'>
                                +{totalCount - 2}
                              </span>
                            </div>
                          );
                        };

                        return (
                          <div className='relative'>
                            <PickersDay {...dayProps} />
                            {renderDots()}
                          </div>
                        );
                      },
                    }}
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      '& .MuiPickersCalendarHeader-root': {
                        paddingLeft: 1,
                        paddingRight: 1,
                      },
                      '& .MuiDayCalendar-header': {
                        justifyContent: 'space-around',
                      },
                      '& .MuiDayCalendar-weekContainer': {
                        justifyContent: 'space-around',
                      },
                      '& .MuiPickersDay-root': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </LocalizationProvider>

                {/* Liste des commandes du jour sélectionné */}
                {selectedCalendarDay && (
                  <>
                    <div className='border-t border-gray-200 my-4' />
                    <div>
                      <h3 className='font-semibold text-[14px] mb-3'>
                        {format(selectedCalendarDay, 'EEEE dd MMMM yyyy', {
                          locale: fr,
                        })}
                      </h3>
                      {getOrdersForDate(selectedCalendarDay).length > 0 ? (
                        <div className='space-y-3 pb-20'>
                          {getOrdersForDate(selectedCalendarDay).map((order) =>
                            getOrderCard(order)
                          )}
                        </div>
                      ) : (
                        <div className='text-center py-8 text-gray-500'>
                          <p className='text-[14px]'>Aucune commande ce jour</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : currentView === 'logistique-option2' ? (
        // OPTION 2: Vue hybride - Urgentes en haut + Mini-calendrier
        <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
          <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] overflow-y-auto px-4 pt-4 pb-7'>
            {/* Back button */}
            <button
              onClick={() => setCurrentView('logistique-selection')}
              className='flex items-center gap-2 text-[#12895a] mb-3 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
            >
              <ChevronLeft className='w-5 h-5' />
              <span className='text-[14px] font-semibold'>Retour</span>
            </button>

            <p className='font-semibold text-[18px] mb-4'>Commandes</p>

            {/* Section Urgentes */}
            <div className='mb-6'>
              <p className='text-[14px] font-semibold text-gray-700 mb-3'>
                Urgentes (en retard + cette semaine)
              </p>
              <div className='space-y-3'>
                {getSortedOrdersByUrgency()
                  .filter((order) => getDaysUntil(order.deliveryDate) < 7)
                  .map((order) => getOrderCard(order))}
              </div>
            </div>

            {/* Mini-calendrier mensuel */}
            <div className='bg-gray-50 rounded-lg p-4 mb-4'>
              <div className='flex items-center justify-between mb-3'>
                <p className='font-semibold text-[14px]'>
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </p>
                <div className='flex gap-2'>
                  <button
                    onClick={() => setCurrentDate(addDays(currentDate, -30))}
                    className='p-1'
                  >
                    <ChevronLeft className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => setCurrentDate(addDays(currentDate, 30))}
                    className='p-1'
                  >
                    <ChevronRight className='w-4 h-4' />
                  </button>
                </div>
              </div>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale='fr'
              >
                <DateCalendar
                  value={dayjs(selectedCalendarDay || currentDate)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedCalendarDay(newValue.toDate());
                    }
                  }}
                  onMonthChange={(newMonth) => {
                    setCurrentDate(newMonth.toDate());
                  }}
                  slots={{
                    day: (dayProps: PickersDayProps<Dayjs>) => {
                      const currentDay = dayProps.day.toDate();
                      const dayOrders = getOrdersForDate(currentDay);
                      const totalCount = dayOrders.length;

                      if (totalCount > 0) {
                        return (
                          <div className='relative'>
                            <PickersDay {...dayProps} />
                            <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2'>
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  dayOrders[0].type === 'BC'
                                    ? 'bg-blue-600'
                                    : 'bg-green-600'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      }
                      return <PickersDay {...dayProps} />;
                    },
                  }}
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    '& .MuiPickersCalendarHeader-root': {
                      paddingLeft: 1,
                      paddingRight: 1,
                    },
                    '& .MuiDayCalendar-header': {
                      justifyContent: 'space-around',
                    },
                    '& .MuiDayCalendar-weekContainer': {
                      justifyContent: 'space-around',
                    },
                    '& .MuiPickersDay-root': {
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            {/* Toutes les commandes */}
            {selectedCalendarDay && (
              <div className='mb-4'>
                <p className='text-[14px] font-semibold text-gray-700 mb-3'>
                  {format(selectedCalendarDay, 'EEEE dd MMMM', {
                    locale: fr,
                  })}
                </p>
                <div className='space-y-3'>
                  {getOrdersForDate(selectedCalendarDay).map((order) =>
                    getOrderCard(order)
                  )}
                </div>
              </div>
            )}

            <div className='space-y-3 pb-20'>
              <p className='text-[14px] font-semibold text-gray-700'>
                Toutes les commandes
              </p>
              {getSortedOrdersByUrgency()
                .filter((order) => getDaysUntil(order.deliveryDate) >= 7)
                .map((order) => getOrderCard(order))}
            </div>
          </div>
        </div>
      ) : currentView === 'logistique-option3' ? (
        // OPTION 3: Liste groupée par date
        <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
          <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] overflow-y-auto px-4 pt-4 pb-7'>
            {/* Back button */}
            <button
              onClick={() => setCurrentView('logistique-selection')}
              className='flex items-center gap-2 text-[#12895a] mb-3 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
            >
              <ChevronLeft className='w-5 h-5' />
              <span className='text-[14px] font-semibold'>Retour</span>
            </button>

            <p className='font-semibold text-[18px] mb-4'>Commandes</p>

            <div className='space-y-4 pb-20'>
              {(() => {
                const sortedOrders = getSortedOrdersByUrgency();
                const grouped = groupOrdersByDate(sortedOrders);
                const sortedDates = Object.keys(grouped).sort();

                return sortedDates.map((dateKey) => {
                  // Parse dateKey (YYYY-MM-DD) and normalize to local midnight
                  const [year, month, day] = dateKey.split('-').map(Number);
                  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
                  const dayOrders = grouped[dateKey];
                  const daysUntil = getDaysUntil(date);

                  let sectionColor = 'text-gray-700';
                  let sectionBg = 'bg-gray-50';
                  if (daysUntil < 0) {
                    sectionColor = 'text-red-700';
                    sectionBg = 'bg-red-50';
                  } else if (daysUntil < 7) {
                    sectionColor = 'text-orange-700';
                    sectionBg = 'bg-orange-50';
                  }

                  return (
                    <div key={dateKey} className='space-y-2'>
                      {/* VARIANTE 1: Style minimal avec bordure gauche colorée */}
                      <div className='flex items-center gap-3 py-2 border-l-4 border-gray-300'>
                        {daysUntil < 0 && (
                          <div className='w-1 h-1 rounded-full bg-red-500'></div>
                        )}
                        {daysUntil >= 0 && daysUntil < 7 && (
                          <div className='w-1 h-1 rounded-full bg-orange-500'></div>
                        )}
                        {daysUntil >= 7 && (
                          <div className='w-1 h-1 rounded-full bg-gray-400'></div>
                        )}
                        <p
                          className={`font-semibold text-[14px] ${sectionColor} flex-1`}
                        >
                          {getSectionDateLabel(date, daysUntil)}
                        </p>
                        <span className='text-[12px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'>
                          {dayOrders.length}
                        </span>
                      </div>

                      {/* VARIANTE 2: Style avec badge coloré (décommenter pour tester) */}
                      {/* <div className='flex items-center gap-2 py-1.5'>
                        <div
                          className={`px-2 py-1 rounded-md ${
                            daysUntil < 0
                              ? 'bg-red-100 text-red-700'
                              : daysUntil < 7
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <p className='font-semibold text-[12px]'>
                            {getSectionDateLabel(date, daysUntil)}
                          </p>
                        </div>
                        <span className='text-[11px] text-gray-500'>
                          {dayOrders.length} commande{dayOrders.length > 1 ? 's' : ''}
                        </span>
                      </div> */}

                      {/* VARIANTE 3: Style avec ligne de séparation (décommenter pour tester) */}
                      {/* <div className='space-y-1'>
                        <div className='flex items-baseline gap-2'>
                          <p
                            className={`font-bold text-[15px] ${sectionColor}`}
                          >
                            {getSectionDateLabel(date, daysUntil)}
                          </p>
                          <span className='text-[11px] text-gray-500'>
                            {dayOrders.length} commande{dayOrders.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div
                          className={`h-0.5 ${
                            daysUntil < 0
                              ? 'bg-red-200'
                              : daysUntil < 7
                                ? 'bg-orange-200'
                                : 'bg-gray-200'
                          }`}
                        ></div>
                      </div> */}

                      {/* VARIANTE 4: Style compact avec icône (décommenter pour tester) */}
                      {/* <div
                        className={`flex items-center gap-2 px-2 py-1.5 rounded ${
                          daysUntil < 0
                            ? 'bg-red-50 border border-red-200'
                            : daysUntil < 7
                              ? 'bg-orange-50 border border-orange-200'
                              : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            daysUntil < 0
                              ? 'bg-red-500'
                              : daysUntil < 7
                                ? 'bg-orange-500'
                                : 'bg-gray-400'
                          }`}
                        ></div>
                        <p
                          className={`font-medium text-[13px] ${sectionColor} flex-1`}
                        >
                          {getSectionDateLabel(date, daysUntil)}
                        </p>
                        <span className='text-[11px] font-semibold text-gray-600'>
                          {dayOrders.length}
                        </span>
                      </div> */}

                      {/* VARIANTE 5: Style avec fond subtil et ombre (décommenter pour tester) */}
                      {/* <div
                        className={`${sectionBg} border-l-2 ${
                          daysUntil < 0
                            ? 'border-red-400'
                            : daysUntil < 7
                              ? 'border-orange-400'
                              : 'border-gray-300'
                        } px-3 py-2.5 rounded-r-md shadow-sm`}
                      >
                        <div className='flex items-center justify-between'>
                          <p
                            className={`font-semibold text-[14px] ${sectionColor}`}
                          >
                            {getSectionDateLabel(date, daysUntil)}
                          </p>
                          <span className='text-[11px] font-medium text-gray-600 bg-white px-2 py-0.5 rounded-full'>
                            {dayOrders.length}
                          </span>
                        </div>
                      </div> */}

                      <div className='space-y-2 pl-2'>
                        {dayOrders.map((order) => getOrderCard(order))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      ) : currentView === 'logistique-option4' ? (
        // OPTION 4: Vue par défaut + filtres rapides
        <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
          <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] overflow-y-auto px-4 pt-4 pb-7'>
            {/* Back button */}
            <button
              onClick={() => setCurrentView('logistique-selection')}
              className='flex items-center gap-2 text-[#12895a] mb-3 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
            >
              <ChevronLeft className='w-5 h-5' />
              <span className='text-[14px] font-semibold'>Retour</span>
            </button>

            <div className='flex items-center justify-between mb-4'>
              <p className='font-semibold text-[18px]'>Commandes</p>
              <button
                onClick={() => setView('calendar')}
                className='flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-700 text-[11px] font-semibold hover:bg-gray-200'
              >
                <CalendarIcon className='w-3 h-3' />
                Calendrier
              </button>
            </div>

            {/* Filtres rapides */}
            <div className='flex gap-2 mb-4 overflow-x-auto pb-2'>
              {[
                { key: 'all', label: 'Tout' },
                { key: 'today', label: "Aujourd'hui" },
                { key: 'week', label: 'Cette semaine' },
                { key: 'month', label: 'Ce mois' },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => {
                    // TODO: Implémenter le filtre
                    setTimeRange(filter.key as any);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap ${
                    timeRange === filter.key
                      ? 'bg-[#12895a] text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {view === 'list' ? (
              <div className='space-y-4 pb-20'>
                {getSortedOrdersByUrgency().map((order) => getOrderCard(order))}
              </div>
            ) : (
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <button
                    onClick={() => setCurrentDate(addDays(currentDate, -30))}
                    className='p-2'
                  >
                    <ChevronLeft className='w-5 h-5' />
                  </button>
                  <p className='font-semibold text-[14px]'>
                    {format(currentDate, 'MMMM yyyy', { locale: fr })}
                  </p>
                  <button
                    onClick={() => setCurrentDate(addDays(currentDate, 30))}
                    className='p-2'
                  >
                    <ChevronRight className='w-5 h-5' />
                  </button>
                </div>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale='fr'
                >
                  <DateCalendar
                    value={dayjs(selectedCalendarDay || currentDate)}
                    onChange={(newValue) => {
                      if (newValue) {
                        setSelectedCalendarDay(newValue.toDate());
                      }
                    }}
                    onMonthChange={(newMonth) => {
                      setCurrentDate(newMonth.toDate());
                    }}
                    slots={{
                      day: (dayProps: any) => {
                        const currentDay = dayProps.day.toDate();
                        const dayOrders = getOrdersForDate(currentDay);
                        const totalCount = dayOrders.length;

                        if (totalCount > 0) {
                          return (
                            <div className='relative'>
                              <PickersDay {...dayProps} />
                              <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5'>
                                {dayOrders.slice(0, 2).map((order, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      order.type === 'BC'
                                        ? 'bg-blue-600'
                                        : 'bg-green-600'
                                    }`}
                                  />
                                ))}
                                {totalCount > 2 && (
                                  <span className='text-[8px] font-bold text-gray-600'>
                                    +{totalCount - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return <PickersDay {...dayProps} />;
                      },
                    }}
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      '& .MuiPickersCalendarHeader-root': {
                        paddingLeft: 1,
                        paddingRight: 1,
                      },
                      '& .MuiDayCalendar-header': {
                        justifyContent: 'space-around',
                      },
                      '& .MuiDayCalendar-weekContainer': {
                        justifyContent: 'space-around',
                      },
                      '& .MuiPickersDay-root': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </LocalizationProvider>
                {selectedCalendarDay && (
                  <>
                    <div className='border-t border-gray-200 my-4' />
                    <div className='space-y-3 pb-20'>
                      {getOrdersForDate(selectedCalendarDay).map((order) =>
                        getOrderCard(order)
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : currentView === 'logistique-option5' ? (
        // OPTION 5: Combinaison - Sections par jour + Bouton bascule Liste/Calendrier + Filtres rapides
        <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
          <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] overflow-y-auto px-4 pt-4 pb-7'>
            {/* Back button */}
            <button
              onClick={() => setCurrentView('logistique-selection')}
              className='flex items-center gap-2 text-[#12895a] mb-3 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
            >
              <ChevronLeft className='w-5 h-5' />
              <span className='text-[14px] font-semibold'>Retour</span>
            </button>

            {/* Header avec bouton bascule Liste/Calendrier */}
            <div className='flex items-center justify-between mb-4'>
              <p className='font-semibold text-[18px]'>Commandes</p>
              <button
                onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
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
            </div>

            {view === 'list' ? (
              <>
                {/* Filtres rapides avec navigation */}
                <div className='mb-4'>
                  <div className='flex gap-2 mb-2 overflow-x-auto pb-2'>
                    {[
                      { key: 'all', label: 'Tout' },
                      { key: 'today', label: "Aujourd'hui" },
                      { key: 'week', label: 'Cette semaine' },
                      { key: 'month', label: 'Ce mois' },
                    ].map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => {
                          setTimeRange(filter.key as any);
                          // Réinitialiser la date de référence quand on change de filtre
                          if (filter.key !== 'all') {
                            setFilterReferenceDate(now);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap ${
                          timeRange === filter.key
                            ? 'bg-[#12895a] text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  {/* Navigation par période (flèches) - affichée uniquement pour today, week, month */}
                  {timeRange !== 'all' && (
                    <div className='flex items-center justify-center gap-4 mt-2'>
                      <button
                        onClick={() => {
                          if (timeRange === 'today') {
                            setFilterReferenceDate(
                              addDays(filterReferenceDate, -1)
                            );
                          } else if (timeRange === 'week') {
                            setFilterReferenceDate(
                              addDays(filterReferenceDate, -7)
                            );
                          } else if (timeRange === 'month') {
                            const newDate = new Date(filterReferenceDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setFilterReferenceDate(newDate);
                          }
                        }}
                        className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
                      >
                        <ChevronLeft className='w-5 h-5 text-gray-600' />
                      </button>

                      <div className='text-center min-w-[120px]'>
                        <p className='text-[12px] font-semibold text-gray-700'>
                          {timeRange === 'today'
                            ? format(filterReferenceDate, 'EEEE dd MMMM', {
                                locale: fr,
                              })
                            : timeRange === 'week'
                            ? `Semaine du ${format(
                                startOfWeek(filterReferenceDate, {
                                  locale: fr,
                                }),
                                'dd MMM',
                                { locale: fr }
                              )}`
                            : format(filterReferenceDate, 'MMMM yyyy', {
                                locale: fr,
                              })}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (timeRange === 'today') {
                            setFilterReferenceDate(
                              addDays(filterReferenceDate, 1)
                            );
                          } else if (timeRange === 'week') {
                            setFilterReferenceDate(
                              addDays(filterReferenceDate, 7)
                            );
                          } else if (timeRange === 'month') {
                            const newDate = new Date(filterReferenceDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setFilterReferenceDate(newDate);
                          }
                        }}
                        className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
                      >
                        <ChevronRight className='w-5 h-5 text-gray-600' />
                      </button>
                    </div>
                  )}
                </div>

                {/* Liste groupée par date avec filtres */}
                <div className='space-y-4 pb-20'>
                  {(() => {
                    // Filtrer les commandes selon le timeRange
                    let filteredOrders = getSortedOrdersByUrgency();

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
                          order.deliveryDate >= weekStart &&
                          order.deliveryDate <= weekEnd
                      );
                    } else if (timeRange === 'month') {
                      const monthStart = startOfMonth(filterReferenceDate);
                      const monthEnd = endOfMonth(filterReferenceDate);
                      filteredOrders = filteredOrders.filter(
                        (order) =>
                          order.deliveryDate >= monthStart &&
                          order.deliveryDate <= monthEnd
                      );
                    }
                    // 'all' ne filtre rien

                    const grouped = groupOrdersByDate(filteredOrders);
                    const sortedDates = Object.keys(grouped).sort();

                    if (sortedDates.length === 0) {
                      return (
                        <div className='text-center py-8 text-gray-500'>
                          <p className='text-[14px]'>
                            Aucune commande pour cette période
                          </p>
                        </div>
                      );
                    }

                    return sortedDates.map((dateKey) => {
                      // Parse dateKey (YYYY-MM-DD) and normalize to local midnight
                      const [year, month, day] = dateKey.split('-').map(Number);
                      const date = new Date(year, month - 1, day, 0, 0, 0, 0);
                      const dayOrders = grouped[dateKey];
                      const daysUntil = getDaysUntil(date);

                      let sectionColor = 'text-gray-700';
                      let sectionBg = 'bg-gray-50';
                      if (daysUntil < 0) {
                        sectionColor = 'text-red-700';
                        sectionBg = 'bg-red-50';
                      } else if (daysUntil < 7) {
                        sectionColor = 'text-orange-700';
                        sectionBg = 'bg-orange-50';
                      }

                      return (
                        <div key={dateKey} className='space-y-2'>
                          {/* VARIANTE 1: Style minimal avec bordure gauche colorée */}
                          <div className='flex items-center gap-3 py-2 border-l-4 border-gray-300'>
                            {daysUntil < 0 && (
                              <div className='w-1 h-1 rounded-full bg-red-500'></div>
                            )}
                            {daysUntil >= 0 && daysUntil < 7 && (
                              <div className='w-1 h-1 rounded-full bg-orange-500'></div>
                            )}
                            {daysUntil >= 7 && (
                              <div className='w-1 h-1 rounded-full bg-gray-400'></div>
                            )}
                            <p
                              className={`font-semibold text-[14px] ${sectionColor} flex-1`}
                            >
                              {getSectionDateLabel(date, daysUntil)}
                            </p>
                            <span className='text-[12px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'>
                              {dayOrders.length}
                            </span>
                          </div>

                          {/* VARIANTE 2: Style avec badge coloré (décommenter pour tester) */}
                          {/* <div className='flex items-center gap-2 py-1.5'>
                            <div
                              className={`px-2 py-1 rounded-md ${
                                daysUntil < 0
                                  ? 'bg-red-100 text-red-700'
                                  : daysUntil < 7
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <p className='font-semibold text-[12px]'>
                                {getSectionDateLabel(date, daysUntil)}
                              </p>
                            </div>
                            <span className='text-[11px] text-gray-500'>
                              {dayOrders.length} commande{dayOrders.length > 1 ? 's' : ''}
                            </span>
                          </div> */}

                          {/* VARIANTE 3: Style avec ligne de séparation (décommenter pour tester) */}
                          {/* <div className='space-y-1'>
                            <div className='flex items-baseline gap-2'>
                              <p
                                className={`font-bold text-[15px] ${sectionColor}`}
                              >
                                {getSectionDateLabel(date, daysUntil)}
                              </p>
                              <span className='text-[11px] text-gray-500'>
                                {dayOrders.length} commande{dayOrders.length > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div
                              className={`h-0.5 ${
                                daysUntil < 0
                                  ? 'bg-red-200'
                                  : daysUntil < 7
                                    ? 'bg-orange-200'
                                    : 'bg-gray-200'
                              }`}
                            ></div>
                          </div> */}

                          {/* VARIANTE 4: Style compact avec icône (décommenter pour tester) */}
                          {/* <div
                            className={`flex items-center gap-2 px-2 py-1.5 rounded ${
                              daysUntil < 0
                                ? 'bg-red-50 border border-red-200'
                                : daysUntil < 7
                                  ? 'bg-orange-50 border border-orange-200'
                                  : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                daysUntil < 0
                                  ? 'bg-red-500'
                                  : daysUntil < 7
                                    ? 'bg-orange-500'
                                    : 'bg-gray-400'
                              }`}
                            ></div>
                            <p
                              className={`font-medium text-[13px] ${sectionColor} flex-1`}
                            >
                              {getSectionDateLabel(date, daysUntil)}
                            </p>
                            <span className='text-[11px] font-semibold text-gray-600'>
                              {dayOrders.length}
                            </span>
                          </div> */}

                          {/* VARIANTE 5: Style avec fond subtil et ombre (décommenter pour tester) */}
                          {/* <div
                            className={`${sectionBg} border-l-2 ${
                              daysUntil < 0
                                ? 'border-red-400'
                                : daysUntil < 7
                                  ? 'border-orange-400'
                                  : 'border-gray-300'
                            } px-3 py-2.5 rounded-r-md shadow-sm`}
                          >
                            <div className='flex items-center justify-between'>
                              <p
                                className={`font-semibold text-[14px] ${sectionColor}`}
                              >
                                {getSectionDateLabel(date, daysUntil)}
                              </p>
                              <span className='text-[11px] font-medium text-gray-600 bg-white px-2 py-0.5 rounded-full'>
                                {dayOrders.length}
                              </span>
                            </div>
                          </div> */}

                          <div className='space-y-2 pl-2'>
                            {dayOrders.map((order) => getOrderCard(order))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </>
            ) : (
              <div>
                {/* Calendrier mensuel simple - Le composant MUI a déjà sa propre navigation */}
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale='fr'
                >
                  <DateCalendar
                    value={dayjs(selectedCalendarDay || currentDate)}
                    onChange={(newValue) => {
                      if (newValue) {
                        setSelectedCalendarDay(newValue.toDate());
                      }
                    }}
                    onMonthChange={(newMonth) => {
                      setCurrentDate(newMonth.toDate());
                    }}
                    slots={{
                      day: (dayProps: any) => {
                        const currentDay = dayProps.day.toDate();
                        const dayOrders = getOrdersForDate(currentDay);
                        const totalCount = dayOrders.length;

                        const renderDots = () => {
                          if (totalCount === 0) return null;
                          if (totalCount <= 3) {
                            return (
                              <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5 items-center'>
                                {dayOrders.map((order, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      order.type === 'BC'
                                        ? 'bg-blue-600'
                                        : 'bg-green-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            );
                          }
                          return (
                            <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5 items-center'>
                              {dayOrders.slice(0, 2).map((order, idx) => (
                                <div
                                  key={idx}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    order.type === 'BC'
                                      ? 'bg-blue-600'
                                      : 'bg-green-600'
                                  }`}
                                />
                              ))}
                              <span className='text-[8px] font-bold text-gray-600'>
                                +{totalCount - 2}
                              </span>
                            </div>
                          );
                        };

                        return (
                          <div className='relative'>
                            <PickersDay {...dayProps} />
                            {renderDots()}
                          </div>
                        );
                      },
                    }}
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      '& .MuiPickersCalendarHeader-root': {
                        paddingLeft: 1,
                        paddingRight: 1,
                      },
                      '& .MuiDayCalendar-header': {
                        justifyContent: 'space-around',
                      },
                      '& .MuiDayCalendar-weekContainer': {
                        justifyContent: 'space-around',
                      },
                      '& .MuiPickersDay-root': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </LocalizationProvider>

                {/* Liste des commandes du jour sélectionné */}
                {selectedCalendarDay && (
                  <>
                    <div className='border-t border-gray-200 my-4' />
                    <div>
                      <h3 className='font-semibold text-[14px] mb-3'>
                        {format(selectedCalendarDay, 'EEEE dd MMMM yyyy', {
                          locale: fr,
                        })}
                      </h3>
                      {getOrdersForDate(selectedCalendarDay).length > 0 ? (
                        <div className='space-y-3 pb-20'>
                          {getOrdersForDate(selectedCalendarDay).map((order) =>
                            getOrderCard(order)
                          )}
                        </div>
                      ) : (
                        <div className='text-center py-8 text-gray-500'>
                          <p className='text-[14px]'>Aucune commande ce jour</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Main Content - Plus de header fixe, on gagne de l'espace */}
          <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] overflow-y-auto px-4 pt-4 pb-7'>
            {/* Order Details Page - Full page view */}
            {mode === 'clients' && showOrderDetailsPage && selectedOrder ? (
              <div className='pb-20'>
                {/* Back button */}
                <button
                  onClick={() => {
                    setShowOrderDetailsPage(false);
                    setSelectedOrder(null);
                    setSelectedProductsInOrder([]);
                  }}
                  className='flex items-center gap-2 text-[#12895a] mb-3 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
                >
                  <ChevronLeft className='w-5 h-5' />
                  <span className='text-[14px] font-semibold'>Retour</span>
                </button>

                {/* Compact Header */}
                <div className='flex items-start justify-between mb-3 pb-3 border-b border-gray-200'>
                  <div className='flex-1'>
                    <h2 className='font-semibold text-[16px]'>
                      {selectedOrder.client}
                    </h2>
                    <p className='text-[11px] text-gray-600'>
                      {selectedOrder.number} • {selectedOrder.type}
                    </p>
                  </div>
                  <img
                    src={clientLogos[selectedOrder.client] || ''}
                    alt=''
                    className='w-10 h-10 rounded object-cover flex-shrink-0'
                  />
                </div>

                {/* Global Status Banner - Compact */}
                {(() => {
                  const allProductsOk = selectedOrder.items.every((item) => {
                    const product = products.find(
                      (p) => p.id === item.productId
                    );
                    return product && product.stock >= item.quantity;
                  });

                  return (
                    <div
                      className={`rounded-lg p-2 mb-3 ${
                        allProductsOk
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <p
                        className={`text-[12px] font-semibold ${
                          allProductsOk ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {allProductsOk
                          ? '✓ Stock suffisant'
                          : '⚠ Stock insuffisant'}
                      </p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          allProductsOk ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {allProductsOk
                          ? 'Tous les produits sont disponibles'
                          : 'Certains produits sont en rupture'}
                      </p>
                    </div>
                  );
                })()}

                {/* Product Selection Control - Compact */}
                <div className='flex items-center justify-between mb-2 py-1'>
                  <p className='text-[11px] text-gray-600 font-semibold'>
                    Produits ({selectedOrder.items.length})
                  </p>
                  <button
                    onClick={() => {
                      if (
                        selectedProductsInOrder.length ===
                        selectedOrder.items.length
                      ) {
                        setSelectedProductsInOrder([]);
                      } else {
                        setSelectedProductsInOrder(
                          selectedOrder.items.map((item) => item.productId)
                        );
                      }
                    }}
                    className='text-[11px] text-[#12895a] font-semibold hover:underline'
                  >
                    {selectedProductsInOrder.length ===
                    selectedOrder.items.length
                      ? 'Tout désélectionner'
                      : 'Tout sélectionner'}
                  </button>
                </div>

                {/* Products List - Compact */}
                <div className='space-y-2'>
                  {selectedOrder.items.map((item) => {
                    const product = products.find(
                      (p) => p.id === item.productId
                    );
                    if (!product) return null;

                    const hasStock = product.stock >= item.quantity;
                    const isSelected = selectedProductsInOrder.includes(
                      item.productId
                    );

                    return (
                      <div
                        key={item.productId}
                        onClick={() => {
                          setSelectedProductsInOrder((prev) =>
                            prev.includes(item.productId)
                              ? prev.filter((id) => id !== item.productId)
                              : [...prev, item.productId]
                          );
                        }}
                        className={`border rounded-lg p-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#12895a] border-2 bg-green-50'
                            : hasStock
                            ? 'border-gray-200 hover:border-gray-300'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        {/* Header: Checkbox + Name + Image */}
                        <div className='flex items-center gap-2 mb-1.5'>
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'bg-[#12895a] border-[#12895a]'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <span className='text-white text-[10px]'>✓</span>
                            )}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='font-semibold text-[13px] truncate'>
                              {product.name}
                            </p>
                            {!hasStock && (
                              <p className='text-[10px] text-red-600 font-semibold'>
                                ⚠ Stock insuffisant
                              </p>
                            )}
                          </div>
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt=''
                              className='w-10 h-10 rounded object-cover flex-shrink-0'
                            />
                          )}
                        </div>

                        {/* Stock info - Compact */}
                        <div className='space-y-0.5'>
                          <div className='flex justify-between text-[10px]'>
                            <span className='text-gray-600'>À livrer</span>
                            <span className='font-semibold'>
                              {item.quantity}
                            </span>
                          </div>
                          <div className='flex justify-between text-[10px]'>
                            <span className='text-gray-600'>Stock actuel</span>
                            <span
                              className={`font-semibold ${
                                hasStock ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {product.stock}
                            </span>
                          </div>

                          {/* Visual stock bar - Compact */}
                          <div className='relative h-1.5 bg-gray-200 rounded-full overflow-visible mt-1'>
                            {/* Stock bar */}
                            <div
                              className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                                hasStock ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{
                                width: `${Math.min(
                                  (product.stock / product.stockMax) * 100,
                                  100
                                )}%`,
                              }}
                            />

                            {/* Required quantity triangle */}
                            <div
                              className='absolute top-[-3px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-gray-700'
                              style={{
                                left: `${Math.min(
                                  (item.quantity / product.stockMax) * 100,
                                  100
                                )}%`,
                                transform: 'translateX(-50%)',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sticky Bottom Actions */}
                <div className='sticky bottom-0 mt-4 pt-3 pb-20 bg-white border-t border-gray-200 space-y-2'>
                  {/* Prepare order button */}
                  {(() => {
                    const allProductsOk = selectedOrder.items.every((item) => {
                      const product = products.find(
                        (p) => p.id === item.productId
                      );
                      return product && product.stock >= item.quantity;
                    });

                    return (
                      <button
                        disabled={!allProductsOk}
                        className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all ${
                          allProductsOk
                            ? 'bg-[#12895a] text-white hover:bg-[#107a4d]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Package className='w-4 h-4' />
                        Préparer la livraison
                      </button>
                    );
                  })()}

                  {/* Create production order button */}
                  <button
                    disabled={selectedProductsInOrder.length === 0}
                    onClick={() => {
                      if (selectedProductsInOrder.length > 0) {
                        // Calculate quantities for selected products
                        const quantities: Record<string, number> = {};
                        selectedProductsInOrder.forEach((productId) => {
                          const item = selectedOrder.items.find(
                            (i) => i.productId === productId
                          );
                          const product = products.find(
                            (p) => p.id === productId
                          );
                          if (item && product) {
                            const deficit = Math.max(
                              0,
                              item.quantity - product.stock
                            );
                            quantities[productId] = deficit;
                          }
                        });
                        setManufacturingQuantities(quantities);
                        setShowOrderDetailsPage(false);
                        setShowManufacturingOrder(true);
                      }
                    }}
                    className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[14px] transition-all ${
                      selectedProductsInOrder.length > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className='w-4 h-4' />
                    Créer un ordre de fabrication
                    {selectedProductsInOrder.length > 0 &&
                      ` (${selectedProductsInOrder.length})`}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Back button to return to selection */}
            {!showOrderDetailsPage && (
              <button
                onClick={() => setCurrentView('logistique-selection')}
                className='flex items-center gap-2 text-[#12895a] mb-2 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
              >
                <ChevronLeft className='w-5 h-5' />
                <span className='text-[14px] font-semibold'>Retour</span>
              </button>
            )}

            {/* View Toggle - Only for Clients mode */}
            {mode === 'clients' && !showOrderDetailsPage && (
              <div className='flex gap-4 items-center mb-4'>
                <p className='font-semibold text-[16px]'>Commandes</p>
                <div className='flex gap-2 ml-auto'>
                  <button
                    onClick={() => setView('list')}
                    className={`flex gap-2 items-center px-3 py-1 rounded ${
                      view === 'list'
                        ? 'bg-[#12895a] text-white'
                        : 'bg-white text-gray-500 border border-gray-300'
                    }`}
                  >
                    <ListIcon className='w-4 h-4' />
                    <span className='text-[12px] font-semibold'>Liste</span>
                  </button>
                  <button
                    onClick={() => setView('calendar')}
                    className={`flex gap-2 items-center px-3 py-1 rounded ${
                      view === 'calendar'
                        ? 'bg-[#12895a] text-white'
                        : 'bg-white text-gray-500 border border-gray-300'
                    }`}
                  >
                    <CalendarIcon className='w-4 h-4' />
                    <span className='text-[12px] font-semibold'>
                      Calendrier
                    </span>
                  </button>
                </div>
              </div>
            )}

            {mode === 'products' && (
              <div>
                {/* Simplified Time Range Selector - Only 2 buttons */}
                <div className='flex gap-2 mb-4'>
                  <button
                    onClick={() => {
                      setActiveMode('period');
                      setShowPeriodSelector(true);
                    }}
                    className={`flex-1 px-3 py-2 rounded text-[12px] font-semibold ${
                      activeMode === 'period'
                        ? 'bg-[#12895a] text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Période
                  </button>
                  <button
                    onClick={() => {
                      setActiveMode('documents');
                      setShowDocumentPickerModal(true);
                    }}
                    className={`flex-1 px-3 py-2 rounded text-[12px] font-semibold ${
                      activeMode === 'documents'
                        ? 'bg-[#12895a] text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Documents
                  </button>
                </div>

                {/* Navigation - Hide for documents mode */}
                {activeMode === 'period' && (
                  <div className='flex items-center justify-between mb-4'>
                    <button
                      onClick={() =>
                        setCurrentDate(
                          timeRange === 'week'
                            ? addDays(currentDate, -7)
                            : addDays(currentDate, -30)
                        )
                      }
                      className='p-2'
                    >
                      <ChevronLeft className='w-5 h-5' />
                    </button>
                    <p className='font-semibold text-[14px]'>
                      {format(
                        currentDate,
                        timeRange === 'week'
                          ? "'Semaine du' dd MMM yyyy"
                          : 'MMMM yyyy',
                        { locale: fr }
                      )}
                    </p>
                    <button
                      onClick={() =>
                        setCurrentDate(
                          timeRange === 'week'
                            ? addDays(currentDate, 7)
                            : addDays(currentDate, 30)
                        )
                      }
                      className='p-2'
                    >
                      <ChevronRight className='w-5 h-5' />
                    </button>
                  </div>
                )}

                {/* Range Info with Document Count Badge - Hide for documents mode */}
                {activeMode === 'period' && (
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <p className='text-[12px] font-semibold mb-1'>
                          Période :{' '}
                          {getDaysInRange().length > 0 ? (
                            <>
                              {format(getDaysInRange()[0], 'dd MMM', {
                                locale: fr,
                              })}{' '}
                              -{' '}
                              {format(
                                getDaysInRange()[getDaysInRange().length - 1],
                                'dd MMM',
                                { locale: fr }
                              )}
                            </>
                          ) : (
                            'Sélectionnez une période'
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const days = getDaysInRange();
                          const ordersInRange = orders.filter((order) =>
                            days.some((day) =>
                              isSameDay(order.deliveryDate, day)
                            )
                          );
                          setSelectedProduct(null);
                          setSelectedProductOrders(ordersInRange);
                          setShowDocumentsModal(true);
                        }}
                        className='bg-[#12895a] text-white px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-[#0f7049] transition-colors'
                      >
                        <span className='text-[11px] font-semibold'>
                          {
                            orders.filter((order) => {
                              const days = getDaysInRange();
                              return days.some((day) =>
                                isSameDay(order.deliveryDate, day)
                              );
                            }).length
                          }
                        </span>
                        <span className='text-[10px]'>doc(s)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Aggregated Products */}
                <div className='space-y-3 mb-4'>
                  {getAggregatedProducts().length > 0 ? (
                    getAggregatedProducts().map(
                      ({
                        product,
                        quantity,
                        deficit,
                        orders: productOrders,
                      }) => (
                        <div
                          key={product.id}
                          className='border border-gray-300 rounded-lg p-4 relative cursor-pointer hover:border-gray-400 transition-colors'
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedProductOrders(productOrders);
                            setShowDocumentsModal(true);
                          }}
                        >
                          <div className='flex flex-col gap-2'>
                            {/* First row: Image + Info + Button */}
                            <div className='flex items-start gap-3'>
                              {/* Product Image */}
                              <div className='w-12 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className='w-full h-full object-cover'
                                  />
                                ) : (
                                  <Package className='w-6 h-6 text-gray-400' />
                                )}
                              </div>

                              {/* Product Information */}
                              <div className='flex-1 min-w-0 space-y-2'>
                                {/* Line 1: Product name */}
                                <p className='font-semibold text-[16px] text-gray-900'>
                                  {product.name}
                                </p>

                                {/* Line 2: À livrer + Manque on same line */}
                                <div className='flex items-center gap-2'>
                                  <span className='text-[12px] text-gray-700 bg-gray-100 px-2 py-1 rounded-md font-medium whitespace-nowrap'>
                                    À livrer{' '}
                                    <span className='font-semibold text-gray-900'>
                                      {quantity}
                                    </span>{' '}
                                    u
                                  </span>

                                  {deficit > 0 ? (
                                    <span className='text-[12px] text-red-700 bg-red-50 px-2 py-1 rounded-md font-semibold whitespace-nowrap'>
                                      Manque {deficit} u
                                    </span>
                                  ) : (
                                    <span className='text-[12px] text-green-700 bg-green-50 px-2 py-1 rounded-md font-semibold whitespace-nowrap'>
                                      OK
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Line 4: Document counter (right-aligned) */}
                              <div className='text-right flex-shrink-0'>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProduct(product);
                                    setSelectedProductOrders(productOrders);
                                    setShowDocumentsModal(true);
                                  }}
                                  className='bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-semibold hover:bg-blue-200 transition-colors'
                                >
                                  {productOrders.length} doc(s)
                                </button>
                              </div>
                            </div>

                            {/* Second row: Stock Bar - Full width */}
                            <div className='flex gap-4 pt-2 items-center w-full'>
                              <div className='relative flex-1 h-[43px]'>
                                {/* Base slider */}
                                <div className='absolute h-[5px] left-0 bottom-[30px] w-full'>
                                  <div className='absolute bg-[#f5f5f6] inset-0 rounded' />
                                  <div
                                    className={`absolute h-[5px] left-0 top-0 rounded ${
                                      product.stock < product.stockMin
                                        ? 'bg-[#ea580c]'
                                        : 'bg-[#16a34a]'
                                    }`}
                                    style={{
                                      width: `${Math.min(
                                        80,
                                        (product.stock / product.stockMax) * 80
                                      )}%`,
                                    }}
                                  />
                                </div>

                                {/* Stock Min marker (left triangle) */}
                                <div
                                  className='absolute flex flex-col gap-1 items-center bottom-0'
                                  style={{
                                    left: `${
                                      (product.stockMin / product.stockMax) * 80
                                    }%`,
                                    transform: 'translateX(-50%)',
                                  }}
                                >
                                  <div className='h-[6px] w-[8.589px]'>
                                    <svg
                                      className='block size-full'
                                      fill='none'
                                      preserveAspectRatio='none'
                                      viewBox='0 0 9 6'
                                    >
                                      <path
                                        d={svgPathsStock.p44ee500}
                                        fill='#717680'
                                      />
                                    </svg>
                                  </div>
                                  <p className='font-normal text-[12px] leading-none text-center text-[#535862] whitespace-nowrap pb-1'>
                                    {product.stockMin} u
                                  </p>
                                </div>

                                {/* Stock Max marker (right triangle) */}
                                <div
                                  className='absolute flex flex-col gap-1 items-center bottom-0'
                                  style={{
                                    left: `80%`,
                                    transform: 'translateX(-50%)',
                                  }}
                                >
                                  <div className='h-[6px] w-[8.589px]'>
                                    <svg
                                      className='block size-full'
                                      fill='none'
                                      preserveAspectRatio='none'
                                      viewBox='0 0 9 6'
                                    >
                                      <path
                                        d={svgPathsStock.p44ee500}
                                        fill='#717680'
                                      />
                                    </svg>
                                  </div>
                                  <p className='font-normal text-[12px] leading-none text-center text-[#535862] whitespace-nowrap pb-1'>
                                    {product.stockMax} u
                                  </p>
                                </div>
                              </div>

                              {/* Badge: Lots + Stock total */}
                              <div className='self-start bg-[#f5f5f6] flex gap-1.5 items-center pl-0.5 pr-2.5 py-0.5 rounded-[48px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex-shrink-0 scale-[0.85]'>
                                <div
                                  className={`flex gap-1 items-center pl-1.5 pr-2.5 py-0.5 rounded-[48px] ${
                                    product.stock < product.stockMin
                                      ? 'bg-[#ea580c]'
                                      : 'bg-[#16a34a]'
                                  }`}
                                >
                                  <div className='relative shrink-0 size-[14px]'>
                                    <svg
                                      className='block size-full'
                                      fill='none'
                                      preserveAspectRatio='none'
                                      viewBox='0 0 16 16'
                                    >
                                      <path
                                        d={svgPathsStock.p15d46900}
                                        fill='white'
                                      />
                                    </svg>
                                  </div>
                                  <p className='font-normal text-[14px] text-center text-white'>
                                    {product.lots}
                                  </p>
                                </div>
                                <p
                                  className={`font-semibold text-[12px] text-center ${
                                    product.stock < product.stockMin
                                      ? 'text-[#ea580c]'
                                      : 'text-[#16a34a]'
                                  }`}
                                >
                                  {product.stock} u
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      <p className='text-[14px]'>
                        {activeMode === 'documents'
                          ? 'Sélectionnez des documents pour voir les produits'
                          : 'Aucun produit à livrer pour cette période'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Create Manufacturing Order Button */}
                {getAggregatedProducts().some((p) => p.deficit > 0) && (
                  <div className='h-[60px]'>
                    {/* Spacer to prevent content from being hidden behind sticky button */}
                  </div>
                )}
              </div>
            )}

            {mode === 'clients' && !showOrderDetailsPage && (
              <>
                {view === 'list' && (
                  <div className='space-y-4 pb-20'>
                    {getOrdersWithCurrentDates().map((order) => {
                      const totalQty = order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      );
                      const daysUntil = getDaysUntil(order.deliveryDate);

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
                          onClick={() => openOrderDetails(order)}
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
                                {order.items.length > 1 ? 's' : ''} • {totalQty}{' '}
                                unités
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {view === 'calendar' && (
                  <div>
                    {/* Time Range Selector */}
                    <div className='flex gap-2 mb-4'>
                      <button
                        onClick={() => {
                          setTimeRange('week');
                        }}
                        className={`px-3 py-1 rounded text-[12px] font-semibold ${
                          timeRange === 'week'
                            ? 'bg-[#12895a] text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Semaine
                      </button>
                      <button
                        onClick={() => {
                          setTimeRange('month');
                        }}
                        className={`px-3 py-1 rounded text-[12px] font-semibold ${
                          timeRange === 'month'
                            ? 'bg-[#12895a] text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Mois
                      </button>
                    </div>

                    {timeRange === 'week' && (
                      <>
                        {/* Navigation with Date Picker */}
                        <div className='flex items-center justify-between mb-4 gap-2'>
                          <button
                            onClick={() =>
                              setCurrentDate(addDays(currentDate, -7))
                            }
                            className='p-2'
                          >
                            <ChevronLeft className='w-5 h-5' />
                          </button>
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale='fr'
                          >
                            <DatePicker
                              value={dayjs(currentDate)}
                              onChange={(newValue) => {
                                if (newValue) {
                                  setCurrentDate(newValue.toDate());
                                }
                              }}
                              slotProps={{
                                textField: {
                                  variant: 'standard',
                                  sx: {
                                    '& .MuiInputBase-root': {
                                      fontSize: '14px',
                                      fontWeight: 600,
                                    },
                                    '& .MuiInput-underline:before': {
                                      borderBottom: 'none',
                                    },
                                    '& .MuiInput-underline:hover:before': {
                                      borderBottom: 'none',
                                    },
                                    '& .MuiInput-underline:after': {
                                      borderBottom: 'none',
                                    },
                                  },
                                },
                              }}
                              format='DD MMM YYYY'
                            />
                          </LocalizationProvider>
                          <button
                            onClick={() =>
                              setCurrentDate(addDays(currentDate, 7))
                            }
                            className='p-2'
                          >
                            <ChevronRight className='w-5 h-5' />
                          </button>
                        </div>

                        {/* Week Calendar Grid */}
                        <div className='space-y-2'>
                          {getDaysInRange().map((day) => {
                            const dayOrders = getOrdersForDate(day);
                            const isToday = isSameDay(day, now);

                            return (
                              <div
                                key={day.toISOString()}
                                className={`border rounded-lg p-3 ${
                                  isToday
                                    ? 'border-[#12895a] bg-green-50'
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className='flex justify-between items-center mb-2'>
                                  <p className='font-semibold text-[12px]'>
                                    {format(day, 'EEEE dd MMM', {
                                      locale: fr,
                                    })}
                                  </p>
                                  <span className='text-[10px] text-gray-500'>
                                    {dayOrders.length}{' '}
                                    {dayOrders.length > 1
                                      ? 'commandes'
                                      : 'commande'}
                                  </span>
                                </div>
                                {dayOrders.length > 0 && (
                                  <div className='space-y-1'>
                                    {dayOrders.map((order) => (
                                      <div
                                        key={order.id}
                                        onClick={() => openOrderDetails(order)}
                                        className={`text-[11px] p-2 rounded cursor-pointer transition-all ${
                                          order.type === 'BC'
                                            ? 'bg-blue-100/60 hover:bg-blue-200/60'
                                            : 'bg-orange-100/60 hover:bg-orange-200/60'
                                        }`}
                                      >
                                        <span className='font-semibold'>
                                          {order.client}
                                        </span>{' '}
                                        - {order.number} ({order.type})
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {timeRange === 'month' && (
                      <>
                        {/* MUI DateCalendar with badges */}
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale='fr'
                        >
                          <DateCalendar
                            value={dayjs(selectedCalendarDay || currentDate)}
                            onChange={(newValue) => {
                              if (newValue) {
                                setSelectedCalendarDay(newValue.toDate());
                              }
                            }}
                            onMonthChange={(newMonth) => {
                              setCurrentDate(newMonth.toDate());
                            }}
                            slots={{
                              day: (dayProps: any) => {
                                const currentDay = dayProps.day.toDate();
                                const dayOrders = getOrdersForDate(currentDay);
                                const totalCount = dayOrders.length;

                                // Render logic: show up to 3 dots, then 2 dots + count
                                const renderDots = () => {
                                  if (totalCount === 0) return null;

                                  // Show individual dots for 1-3 documents
                                  if (totalCount <= 3) {
                                    return (
                                      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5 items-center'>
                                        {dayOrders.map((order, idx) => (
                                          <div
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full ${
                                              order.type === 'BC'
                                                ? 'bg-blue-600'
                                                : 'bg-green-600'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    );
                                  }

                                  // For 4+ documents: show 2 dots + "+X"
                                  return (
                                    <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5 items-center'>
                                      {dayOrders
                                        .slice(0, 2)
                                        .map((order, idx) => (
                                          <div
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full ${
                                              order.type === 'BC'
                                                ? 'bg-blue-600'
                                                : 'bg-green-600'
                                            }`}
                                          />
                                        ))}
                                      <span className='text-[8px] font-bold text-gray-600'>
                                        +{totalCount - 2}
                                      </span>
                                    </div>
                                  );
                                };

                                return (
                                  <div className='relative'>
                                    <PickersDay {...dayProps} />
                                    {renderDots()}
                                  </div>
                                );
                              },
                            }}
                            sx={{
                              width: '100%',
                              maxWidth: '100%',
                              '& .MuiPickersCalendarHeader-root': {
                                paddingLeft: 1,
                                paddingRight: 1,
                              },
                              '& .MuiDayCalendar-header': {
                                justifyContent: 'space-around',
                              },
                              '& .MuiDayCalendar-weekContainer': {
                                justifyContent: 'space-around',
                              },
                              '& .MuiPickersDay-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                        </LocalizationProvider>

                        {/* Orders list for selected day */}
                        {selectedCalendarDay && (
                          <>
                            <div className='border-t border-gray-200 my-4' />
                            <div>
                              <h3 className='font-semibold text-[14px] mb-3'>
                                {format(
                                  selectedCalendarDay,
                                  'EEEE dd MMMM yyyy',
                                  {
                                    locale: fr,
                                  }
                                )}
                              </h3>
                              {getOrdersForDate(selectedCalendarDay).length >
                              0 ? (
                                <div className='space-y-3 pb-20'>
                                  {getOrdersForDate(selectedCalendarDay).map(
                                    (order) => {
                                      const totalQty = order.items.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0
                                      );
                                      const daysUntil = getDaysUntil(
                                        order.deliveryDate
                                      );

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
                                          onClick={() =>
                                            openOrderDetails(order)
                                          }
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
                                              src={
                                                clientLogos[order.client] || ''
                                              }
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
                                                  {format(
                                                    order.deliveryDate,
                                                    'dd/MM/yy',
                                                    { locale: fr }
                                                  )}
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
                                                {order.items.length > 1
                                                  ? 's'
                                                  : ''}{' '}
                                                différent
                                                {order.items.length > 1
                                                  ? 's'
                                                  : ''}{' '}
                                                • {totalQty} unités
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              ) : (
                                <div className='text-center py-8 text-gray-500'>
                                  <p className='text-[14px]'>
                                    Aucune commande ce jour
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Manufacturing Order Modal */}
          {showManufacturingOrder && (
            <div className='absolute inset-0 backdrop-blur-[2px] flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 w-[350px] max-h-[600px] overflow-y-auto shadow-xl'>
                <h2 className='font-semibold text-[18px] mb-4'>
                  Ordre de fabrication
                </h2>
                <p className='text-[12px] text-gray-600 mb-4'>
                  Ajustez la quantité à fabriquer pour chaque produit :
                </p>
                <div className='space-y-4 mb-6'>
                  {getAggregatedProducts().map(
                    ({ product, deficit, quantity, orders: productOrders }) => {
                      const currentManufacturingQty =
                        manufacturingQuantities[product.id] ??
                        Math.max(0, deficit);
                      const newStock = product.stock + currentManufacturingQty;
                      const maxManufacturing = product.stockMax - product.stock;
                      // Calculate slider position properly (80% is the visual max position)
                      const stockStartPercent =
                        (product.stock / product.stockMax) * 80;
                      const stockEndPercent = 80; // Max at 500u (stockMax position at 80%)
                      const rangePercent = stockEndPercent - stockStartPercent;
                      const sliderProgress =
                        maxManufacturing > 0
                          ? currentManufacturingQty / maxManufacturing
                          : 0;
                      const thumbPositionPercent =
                        stockStartPercent + rangePercent * sliderProgress;

                      // Orange bar width - ends exactly at cursor position
                      const orangeBarWidth =
                        thumbPositionPercent - stockStartPercent;

                      return (
                        <div
                          key={product.id}
                          className='border border-gray-300 rounded-lg p-4'
                        >
                          <div className='flex flex-col gap-3'>
                            {/* First row: Image + Info + Badge */}
                            <div className='flex items-start gap-3'>
                              {/* Product Image */}
                              <div className='w-12 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className='w-full h-full object-cover'
                                  />
                                ) : (
                                  <Package className='w-6 h-6 text-gray-400' />
                                )}
                              </div>

                              {/* Product Information */}
                              <div className='flex-1 min-w-0 space-y-1.5'>
                                {/* Line 1: Product name + Manufacturing badge */}
                                <div className='flex items-center justify-between gap-3'>
                                  <p className='font-semibold text-[16px] text-gray-900'>
                                    {product.name}
                                  </p>
                                  <div className='bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-md text-[12px] font-semibold whitespace-nowrap'>
                                    Fabriquer: {currentManufacturingQty} u
                                  </div>
                                </div>

                                {/* Line 2: À livrer + Manque */}
                                <div className='flex items-center gap-2 flex-wrap'>
                                  <span className='text-[12px] text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md font-medium whitespace-nowrap'>
                                    À livrer{' '}
                                    <span className='font-semibold text-gray-900'>
                                      {quantity}
                                    </span>{' '}
                                    u
                                  </span>

                                  {deficit > 0 ? (
                                    <span className='text-[12px] text-red-700 bg-red-50 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap'>
                                      Manque {deficit} u
                                    </span>
                                  ) : (
                                    <span className='text-[12px] text-green-700 bg-green-50 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap'>
                                      OK
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Second row: Interactive Stock Bar with Slider */}
                            <div className='flex gap-4 items-center w-full'>
                              <div className='relative flex-1 h-[50px]'>
                                {/* Base slider bar */}
                                <div className='absolute h-[5px] left-0 bottom-[37px] w-full'>
                                  <div className='absolute bg-[#f5f5f6] inset-0 rounded' />
                                  {/* Current stock (green/red) */}
                                  <div
                                    className={`absolute h-[5px] left-0 top-0 rounded ${
                                      product.stock < product.stockMin
                                        ? 'bg-[#ea580c]'
                                        : 'bg-[#16a34a]'
                                    }`}
                                    style={{
                                      width: `${Math.min(
                                        80,
                                        (product.stock / product.stockMax) * 80
                                      )}%`,
                                    }}
                                  />
                                  {/* Manufacturing quantity to add (orange) */}
                                  <div
                                    className='absolute h-[5px] top-0 rounded bg-orange-500'
                                    style={{
                                      left: `${stockStartPercent}%`,
                                      width: `${orangeBarWidth}%`,
                                    }}
                                  />
                                </div>

                                {/* Interactive slider */}
                                <input
                                  type='range'
                                  min='0'
                                  max={maxManufacturing}
                                  value={currentManufacturingQty}
                                  onChange={(e) => {
                                    setManufacturingQuantities({
                                      ...manufacturingQuantities,
                                      [product.id]: parseInt(e.target.value),
                                    });
                                  }}
                                  className='absolute bottom-[30px] h-[20px] opacity-0 cursor-pointer z-10'
                                  style={{
                                    left: `${stockStartPercent}%`,
                                    width: `${
                                      stockEndPercent - stockStartPercent
                                    }%`,
                                  }}
                                />

                                {/* Slider thumb indicator */}
                                <div
                                  className='absolute bottom-[32px] w-4 h-4 bg-orange-500 border-2 border-white rounded-full shadow-lg pointer-events-none z-20'
                                  style={{
                                    left: `${thumbPositionPercent}%`,
                                    transform: 'translateX(-50%)',
                                  }}
                                />

                                {/* Stock Min marker */}
                                <div
                                  className='absolute flex flex-col gap-1 items-center bottom-0'
                                  style={{
                                    left: `${
                                      (product.stockMin / product.stockMax) * 80
                                    }%`,
                                    transform: 'translateX(-50%)',
                                  }}
                                >
                                  <div className='h-[6px] w-[8.589px]'>
                                    <svg
                                      className='block size-full'
                                      fill='none'
                                      preserveAspectRatio='none'
                                      viewBox='0 0 9 6'
                                    >
                                      <path
                                        d={svgPathsStock.p44ee500}
                                        fill='#717680'
                                      />
                                    </svg>
                                  </div>
                                  <p className='font-normal text-[12px] leading-none text-center text-[#535862] whitespace-nowrap pb-1'>
                                    {product.stockMin} u
                                  </p>
                                </div>

                                {/* Stock Max marker */}
                                <div
                                  className='absolute flex flex-col gap-1 items-center bottom-0'
                                  style={{
                                    left: `80%`,
                                    transform: 'translateX(-50%)',
                                  }}
                                >
                                  <div className='h-[6px] w-[8.589px]'>
                                    <svg
                                      className='block size-full'
                                      fill='none'
                                      preserveAspectRatio='none'
                                      viewBox='0 0 9 6'
                                    >
                                      <path
                                        d={svgPathsStock.p44ee500}
                                        fill='#717680'
                                      />
                                    </svg>
                                  </div>
                                  <p className='font-normal text-[12px] leading-none text-center text-[#535862] whitespace-nowrap pb-1'>
                                    {product.stockMax} u
                                  </p>
                                </div>
                              </div>

                              {/* Badge: Lots + Stock total */}
                              <div className='self-start bg-[#f5f5f6] flex gap-1.5 items-center pl-0.5 pr-2.5 py-0.5 rounded-[48px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex-shrink-0 scale-[0.85]'>
                                <div
                                  className={`flex gap-1 items-center pl-1.5 pr-2.5 py-0.5 rounded-[48px] ${
                                    product.stock < product.stockMin
                                      ? 'bg-[#ea580c]'
                                      : 'bg-[#16a34a]'
                                  }`}
                                >
                                  <div className='relative shrink-0 size-[14px]'>
                                    <svg
                                      className='block size-full'
                                      fill='none'
                                      preserveAspectRatio='none'
                                      viewBox='0 0 16 16'
                                    >
                                      <path
                                        d={svgPathsStock.p15d46900}
                                        fill='white'
                                      />
                                    </svg>
                                  </div>
                                  <p className='font-normal text-[14px] text-center text-white'>
                                    {product.lots}
                                  </p>
                                </div>
                                <p
                                  className={`font-semibold text-[12px] text-center ${
                                    product.stock < product.stockMin
                                      ? 'text-[#ea580c]'
                                      : 'text-[#16a34a]'
                                  }`}
                                >
                                  {product.stock} u
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
                <div className='flex gap-3'>
                  <button
                    onClick={() => {
                      setShowManufacturingOrder(false);
                      setManufacturingQuantities({});
                    }}
                    className='flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold'
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      alert('Ordre de fabrication créé !');
                      setShowManufacturingOrder(false);
                      setManufacturingQuantities({});
                    }}
                    className='flex-1 bg-[#12895a] text-white py-2 rounded font-semibold'
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Period Selector Modal */}
          {showPeriodSelector && (
            <div className='absolute inset-0 backdrop-blur-[2px] flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 w-[350px] shadow-xl'>
                <h2 className='font-semibold text-[18px] mb-4'>
                  Choisir une période
                </h2>
                <div className='space-y-3'>
                  <button
                    onClick={() => {
                      setTimeRange('week');
                      setShowPeriodSelector(false);
                    }}
                    className='w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-semibold text-left px-4 transition-colors'
                  >
                    Semaine
                  </button>
                  <button
                    onClick={() => {
                      setTimeRange('month');
                      setShowPeriodSelector(false);
                    }}
                    className='w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-semibold text-left px-4 transition-colors'
                  >
                    Mois
                  </button>
                  <button
                    onClick={() => {
                      setShowPeriodSelector(false);
                      setShowCustomDatePicker(true);
                      setTimeRange('custom');
                    }}
                    className='w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-semibold text-left px-4 transition-colors'
                  >
                    Personnalisé
                  </button>
                </div>
                <div className='mt-4'>
                  <button
                    onClick={() => setShowPeriodSelector(false)}
                    className='w-full bg-gray-200 text-gray-700 py-2 rounded font-semibold'
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Document Picker Modal */}
          {showDocumentPickerModal && (
            <div className='absolute inset-0 backdrop-blur-[2px] flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg w-[350px] max-h-[600px] shadow-xl flex flex-col'>
                <div className='p-6 pb-4'>
                  <h2 className='font-semibold text-[18px] mb-4'>
                    Sélectionner des documents
                  </h2>

                  <p className='text-[12px] text-gray-600 mb-4'>
                    Sélectionnez les commandes à inclure dans la vue produits :
                  </p>
                </div>

                <div className='space-y-3 px-6 overflow-y-auto flex-1'>
                  {getOrdersWithCurrentDates().map((order) => {
                    const totalQty = order.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );
                    const daysUntil = getDaysUntil(order.deliveryDate);

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
                        onClick={() => openOrderDetails(order)}
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
                              {order.items.length > 1 ? 's' : ''} • {totalQty}{' '}
                              unités
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className='flex gap-3 p-6 pt-4 border-t border-gray-200 bg-white'>
                  <button
                    onClick={() => {
                      setShowDocumentPickerModal(false);
                    }}
                    className='flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold'
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setShowDocumentPickerModal(false);
                    }}
                    className='flex-1 bg-[#12895a] text-white py-2 rounded font-semibold'
                  >
                    Sélectionner
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Documents Modal */}
          {showDocumentsModal && (
            <div className='absolute inset-0 backdrop-blur-[2px] flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 w-[350px] max-h-[600px] overflow-y-auto shadow-xl'>
                <h2 className='font-semibold text-[18px] mb-2'>
                  {selectedProduct
                    ? selectedProduct.name
                    : 'Tous les documents'}
                </h2>

                {/* Total quantity - only show if a specific product is selected */}
                {selectedProduct && (
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
                    <p className='text-[14px] font-semibold text-gray-900'>
                      Total à livrer :{' '}
                      {selectedProductOrders.reduce((sum, order) => {
                        const item = order.items.find(
                          (i) => i.productId === selectedProduct.id
                        );
                        return sum + (item?.quantity || 0);
                      }, 0)}{' '}
                      unité
                      {selectedProductOrders.reduce((sum, order) => {
                        const item = order.items.find(
                          (i) => i.productId === selectedProduct.id
                        );
                        return sum + (item?.quantity || 0);
                      }, 0) > 1
                        ? 's'
                        : ''}
                    </p>
                  </div>
                )}

                <p className='text-[12px] text-gray-600 mb-4'>
                  Commandes concernées :
                </p>

                <div className='space-y-3 mb-6'>
                  {selectedProductOrders.map((order) => {
                    const productItem = selectedProduct
                      ? order.items.find(
                          (item) => item.productId === selectedProduct.id
                        )
                      : null;
                    const daysUntil = getDaysUntil(order.deliveryDate);

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
                        className='border border-gray-300 rounded-lg p-4 relative'
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

                            {/* Line 3: Quantity info */}
                            {selectedProduct ? (
                              <p className='text-[13px] text-gray-700'>
                                N° {order.number} • {productItem?.quantity || 0}{' '}
                                unité
                                {(productItem?.quantity || 0) > 1 ? 's' : ''}
                              </p>
                            ) : (
                              <div className='text-[13px] text-gray-700'>
                                <p className='mb-1'>N° {order.number}</p>
                                {order.items.map((item) => {
                                  const product = products.find(
                                    (p) => p.id === item.productId
                                  );
                                  return (
                                    <p
                                      key={item.productId}
                                      className='text-[12px]'
                                    >
                                      • {product?.name}: {item.quantity} unité
                                      {item.quantity > 1 ? 's' : ''}
                                    </p>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className='flex gap-3'>
                  <button
                    onClick={() => setShowDocumentsModal(false)}
                    className='flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold'
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Custom Date Picker Modal */}
          {showCustomDatePicker && (
            <div className='absolute inset-0 backdrop-blur-[2px] flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 w-[350px] max-h-[600px] overflow-y-auto shadow-xl'>
                <h2 className='font-semibold text-[18px] mb-4'>
                  Sélectionnez une période personnalisée
                </h2>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale='fr'
                >
                  <div className='space-y-4 mb-6'>
                    <div>
                      <label className='text-[12px] text-gray-600 mb-1 block'>
                        Début :
                      </label>
                      <DatePicker
                        value={customStartDate}
                        onChange={(newValue) => setCustomStartDate(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                          },
                        }}
                      />
                    </div>
                    <div>
                      <label className='text-[12px] text-gray-600 mb-1 block'>
                        Fin :
                      </label>
                      <DatePicker
                        value={customEndDate}
                        onChange={(newValue) => setCustomEndDate(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                          },
                        }}
                      />
                    </div>
                  </div>
                </LocalizationProvider>
                <div className='flex gap-3'>
                  <button
                    onClick={() => setShowCustomDatePicker(false)}
                    className='flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold'
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      if (customStartDate && customEndDate) {
                        setCurrentDate(customStartDate.toDate());
                        setShowCustomDatePicker(false);
                      }
                    }}
                    className='flex-1 bg-[#12895a] text-white py-2 rounded font-semibold'
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Button - Create Manufacturing Order */}
          {currentView === 'logistique' &&
            mode === 'products' &&
            getAggregatedProducts().some((p) => p.deficit > 0) && (
              <div className='absolute bottom-[75px] left-0 w-[393px] px-4 py-3 bg-white border-t border-gray-200 z-40'>
                <button
                  onClick={() => setShowManufacturingOrder(true)}
                  className='w-full bg-[#12895a] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2'
                >
                  <Plus className='w-5 h-5' />
                  Créer un ordre de fabrication
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
}
