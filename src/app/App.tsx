import React, { useState } from 'react';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import type { Dayjs } from 'dayjs';
import {
  products,
  orders,
  clientLogos,
  type Product,
  type Order,
} from '../data/database';
import Dashboard from './Dashboard';
import ProductCard from './components/ProductCard';
import StatusBar from './components/layout/StatusBar';
import TabBar from './components/layout/TabBar';
import NavBar, { type ViewType } from './components/layout/NavBar';
import HomeIndicator from './components/layout/HomeIndicator';
import LogistiqueSelection from './components/logistics/LogistiqueSelection';
import LogistiqueCommandes from './components/logistics/LogistiqueCommandes';
import OrderDetailsPage from './components/orders/OrderDetailsPage';
import DeliveryPreparationPage from './components/delivery/DeliveryPreparationPage';
import ManufacturingOrderModal from './components/modals/ManufacturingOrderModal';
import PeriodSelectorModal from './components/modals/PeriodSelectorModal';
import DocumentPickerModal from './components/modals/DocumentPickerModal';
import DocumentsModal from './components/modals/DocumentsModal';
import CustomDatePickerModal from './components/modals/CustomDatePickerModal';
import OrderCard from './components/orders/OrderCard';
import OrdersListInline from './components/logistics/OrdersListInline';
import { useCurrentDate } from './hooks/useCurrentDate';
import { useOrders } from './hooks/useOrders';
import { useProducts } from './hooks/useProducts';
import { useFilters } from './hooks/useFilters';
import { getOrdersWithCurrentDates } from './utils/orderHelpers';
import {
  getDaysUntil,
  getSectionDateLabel,
  groupOrdersByDate,
} from './utils/dateHelpers';

// Set dayjs locale globally
dayjs.locale('fr');

export default function App() {
  // Navigation state
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Hooks
  const now = useCurrentDate();
  const {
    orders: ordersWithCurrentDates,
    getOrdersForDate: getOrdersForDateHelper,
    getSortedOrders,
  } = useOrders(now);

  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [mode, setMode] = useState<'clients' | 'products'>('clients');

  const {
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
  } = useFilters(now);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetailsPage, setShowOrderDetailsPage] = useState(false);
  const [showDeliveryPreparation, setShowDeliveryPreparation] = useState(false);
  const [selectedProductsInOrder, setSelectedProductsInOrder] = useState<
    string[]
  >([]);
  const [currentDate, setCurrentDate] = useState(addDays(now, 7));
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
  const getDaysInRange = (): Date[] => {
    if (timeRange === 'week') {
      const start = startOfWeek(currentDate, { locale: fr });
      const end = endOfWeek(currentDate, { locale: fr });
      const days: Date[] = [];
      let current = start;
      while (current <= end) {
        days.push(current);
        current = addDays(current, 1);
      }
      return days;
    } else if (timeRange === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const days: Date[] = [];
      let current = start;
      while (current <= end) {
        days.push(current);
        current = addDays(current, 1);
      }
      return days;
    } else if (timeRange === 'custom' && customStartDate && customEndDate) {
      const days: Date[] = [];
      let current = customStartDate.toDate();
      while (current <= customEndDate.toDate()) {
        days.push(current);
        current = addDays(current, 1);
      }
      return days;
    }
    return [];
  };

  // Use hooks for products aggregation
  const aggregatedProducts = useProducts({
    today: now,
    activeMode,
    timeRange,
    filterReferenceDate,
    currentView,
    getDaysInRange,
  });

  // Helper functions
  const getOrdersForDate = (date: Date) => {
    return getOrdersForDateHelper(date);
  };

  const getSortedOrdersByUrgency = () => {
    return getSortedOrders();
  };

  const getAggregatedProducts = () => {
    return aggregatedProducts;
  };

  const getOrderCard = (order: Order) => {
    return (
      <OrderCard
        key={order.id}
        order={order}
        today={now}
        onClick={openOrderDetails}
      />
    );
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setSelectedProductsInOrder([]);
    setShowOrderDetailsPage(true);
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
        <LogistiqueSelection
          onNavigateToCommandes={() => {
            setMode('clients');
            setView('list');
            setTimeRange('all');
            setFilterReferenceDate(now);
            setCurrentView('logistique-commandes');
          }}
          onNavigateToProducts={() => {
            setMode('products');
            setCurrentView('logistique');
          }}
          onNavigateToDashboard={() => setCurrentView('dashboard')}
        />
      ) : currentView === 'delivery-preparation' && selectedOrder ? (
        <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
          <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] flex flex-col overflow-hidden'>
            <DeliveryPreparationPage
              order={selectedOrder}
              onBack={() => {
                setShowDeliveryPreparation(false);
                setCurrentView('logistique-commandes');
                setShowOrderDetailsPage(true);
              }}
              onValidationComplete={() => {
                setShowDeliveryPreparation(false);
                setCurrentView('logistique-commandes');
                setShowOrderDetailsPage(true);
              }}
            />
          </div>
        </div>
      ) : currentView === 'logistique-commandes' ? (
        // Vue Commandes - Sections par jour + Bouton bascule Liste/Calendrier + Filtres rapides
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
                onBack={() => {
                  setShowOrderDetailsPage(false);
                  setSelectedOrder(null);
                  setSelectedProductsInOrder([]);
                }}
                onSelectionToggle={(productId) => {
                  setSelectedProductsInOrder((prev) =>
                    prev.includes(productId)
                      ? prev.filter((id) => id !== productId)
                      : [...prev, productId]
                  );
                }}
                onSelectAll={() => {
                  setSelectedProductsInOrder(
                    selectedOrder.items.map((item) => item.productId)
                  );
                }}
                onDeselectAll={() => {
                  setSelectedProductsInOrder([]);
                }}
                onCreateManufacturingOrder={(quantities) => {
                  setManufacturingQuantities(quantities);
                  setShowOrderDetailsPage(false);
                  setShowManufacturingOrder(true);
                }}
                onPrepareDelivery={() => {
                  setShowOrderDetailsPage(false);
                  setShowDeliveryPreparation(true);
                  setCurrentView('delivery-preparation');
                }}
              />
            ) : (
              <>
                {/* Back button */}
                <button
                  onClick={() => setCurrentView('logistique-selection')}
                  className='flex items-center gap-2 text-[#12895a] mb-3 -ml-2 px-2 py-1 hover:bg-gray-100 rounded transition-all'
                >
                  <ChevronLeft className='w-5 h-5' />
                  <span className='text-[14px] font-semibold'>Retour</span>
                </button>

                {/* Header avec bouton bascule Liste/Calendrier et Mode */}
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setMode('clients')}
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
                        setMode('products');
                        setActiveMode('period');
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
                      onClick={() =>
                        setView(view === 'list' ? 'calendar' : 'list')
                      }
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
                  <div>
                    {/* Filtres rapides pour produits */}
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
                              setActiveMode('period');
                              // Réinitialiser la date de référence quand on change de filtre
                              if (filter.key !== 'all') {
                                setFilterReferenceDate(now);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap ${
                              timeRange === filter.key &&
                              activeMode === 'period'
                                ? 'bg-[#12895a] text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>

                      {/* Navigation par période (flèches) - affichée uniquement pour today, week, month */}
                      {timeRange !== 'all' && activeMode === 'period' && (
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

                    {/* Aggregated Products */}
                    <div className='space-y-3 pb-20'>
                      {getAggregatedProducts().length > 0 ? (
                        getAggregatedProducts().map(
                          ({
                            product,
                            quantity,
                            deficit,
                            orders: productOrders,
                          }) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              quantity={quantity}
                              deficit={deficit}
                              orders={productOrders}
                              onCardClick={() => {
                                setSelectedProduct(product);
                                setSelectedProductOrders(productOrders);
                                setShowDocumentsModal(true);
                              }}
                              onDocumentsClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product);
                                setSelectedProductOrders(productOrders);
                                setShowDocumentsModal(true);
                              }}
                            />
                          )
                        )
                      ) : (
                        <div className='text-center py-8 text-gray-500'>
                          <p className='text-[14px]'>
                            Aucun produit à livrer pour cette période
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : view === 'list' ? (
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
                          const [year, month, day] = dateKey
                            .split('-')
                            .map(Number);
                          const date = new Date(
                            year,
                            month - 1,
                            day,
                            0,
                            0,
                            0,
                            0
                          );
                          const dayOrders = grouped[dateKey];
                          const daysUntil = getDaysUntil(date, now);

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
                              {getOrdersForDate(selectedCalendarDay).map(
                                (order) => getOrderCard(order)
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
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Main Content - Plus de header fixe, on gagne de l'espace */}
          <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] overflow-y-auto px-4 pt-4 pb-7'>
            {/* Order Details Page - Full page view */}
            {mode === 'clients' && showOrderDetailsPage && selectedOrder ? (
              <OrderDetailsPage
                order={selectedOrder}
                selectedProductsInOrder={selectedProductsInOrder}
                onBack={() => {
                  setShowOrderDetailsPage(false);
                  setSelectedOrder(null);
                  setSelectedProductsInOrder([]);
                }}
                onSelectionToggle={(productId) => {
                  setSelectedProductsInOrder((prev) =>
                    prev.includes(productId)
                      ? prev.filter((id) => id !== productId)
                      : [...prev, productId]
                  );
                }}
                onSelectAll={() => {
                  setSelectedProductsInOrder(
                    selectedOrder.items.map((item) => item.productId)
                  );
                }}
                onDeselectAll={() => {
                  setSelectedProductsInOrder([]);
                }}
                onCreateManufacturingOrder={(quantities) => {
                  setManufacturingQuantities(quantities);
                  setShowOrderDetailsPage(false);
                  setShowManufacturingOrder(true);
                }}
                onPrepareDelivery={() => {
                  setShowOrderDetailsPage(false);
                  setShowDeliveryPreparation(true);
                  setCurrentView('delivery-preparation');
                }}
              />
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
                        <ProductCard
                          key={product.id}
                          product={product}
                          quantity={quantity}
                          deficit={deficit}
                          orders={productOrders}
                          onCardClick={() => {
                            setSelectedProduct(product);
                            setSelectedProductOrders(productOrders);
                            setShowDocumentsModal(true);
                          }}
                          onDocumentsClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setSelectedProductOrders(productOrders);
                            setShowDocumentsModal(true);
                          }}
                        />
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
                  <OrdersListInline
                    orders={ordersWithCurrentDates}
                    today={now}
                    onOrderClick={openOrderDetails}
                  />
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
                                        order.deliveryDate,
                                        now
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
            <ManufacturingOrderModal
              aggregatedProducts={getAggregatedProducts()}
              manufacturingQuantities={manufacturingQuantities}
              onClose={() => {
                setShowManufacturingOrder(false);
                setManufacturingQuantities({});
              }}
              onConfirm={() => {
                alert('Ordre de fabrication créé !');
                setShowManufacturingOrder(false);
                setManufacturingQuantities({});
              }}
              onQuantityChange={(productId, qty) => {
                setManufacturingQuantities({
                  ...manufacturingQuantities,
                  [productId]: qty,
                });
              }}
            />
          )}

          {/* Period Selector Modal */}
          {showPeriodSelector && (
            <PeriodSelectorModal
              onSelectWeek={() => {
                setTimeRange('week');
                setShowPeriodSelector(false);
              }}
              onSelectMonth={() => {
                setTimeRange('month');
                setShowPeriodSelector(false);
              }}
              onSelectCustom={() => {
                setShowPeriodSelector(false);
                setShowCustomDatePicker(true);
                setTimeRange('custom');
              }}
              onClose={() => setShowPeriodSelector(false)}
            />
          )}

          {/* Document Picker Modal */}
          {showDocumentPickerModal && (
            <DocumentPickerModal
              orders={ordersWithCurrentDates}
              today={now}
              onOrderClick={openOrderDetails}
              onClose={() => setShowDocumentPickerModal(false)}
              onConfirm={() => setShowDocumentPickerModal(false)}
            />
          )}

          {/* Documents Modal */}
          {showDocumentsModal && (
            <DocumentsModal
              selectedProduct={selectedProduct}
              selectedProductOrders={selectedProductOrders}
              today={now}
              onClose={() => setShowDocumentsModal(false)}
            />
          )}

          {/* Custom Date Picker Modal */}
          {showCustomDatePicker && (
            <CustomDatePickerModal
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onStartDateChange={setCustomStartDate}
              onEndDateChange={setCustomEndDate}
              onConfirm={() => {
                if (customStartDate && customEndDate) {
                  setCurrentDate(customStartDate.toDate());
                  setShowCustomDatePicker(false);
                }
              }}
              onClose={() => setShowCustomDatePicker(false)}
            />
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
