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
  updateOrderStatus,
  createPickingTaskFromSalesOrder,
  getPickingTask,
  getSalesOrder,
  getDeliveryNote,
  type Product,
  type Order,
  type DeliveryNoteStatus,
  type SalesOrderStatus,
  type PickingTaskStatus,
  type SalesOrder,
  type PickingTask,
  type DeliveryNote,
  type UnifiedOrder,
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
import DeliveryNoteDetailsPage from './components/delivery/DeliveryNoteDetailsPage';
import ManufacturingOrderModal from './components/modals/ManufacturingOrderModal';
import PeriodSelectorModal from './components/modals/PeriodSelectorModal';
import DocumentPickerModal from './components/modals/DocumentPickerModal';
import DocumentsModal from './components/modals/DocumentsModal';
import CustomDatePickerModal from './components/modals/CustomDatePickerModal';
import OrderCard from './components/orders/OrderCard';
import OrdersListInline from './components/logistics/OrdersListInline';
import OrdersListView from './components/logistics/OrdersListView';
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
import { mapLegacyStatusToNew, isLegacyStatus } from './utils/statusHelpers';

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
    getOrdersForAtelier,
    getOrdersForDateAtelier,
    getSortedOrdersAtelier,
    unifiedOrders,
    getSortedUnifiedOrdersByPriority,
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
  const [showDeliveryNoteDetails, setShowDeliveryNoteDetails] = useState(false);
  const [selectedProductsInOrder, setSelectedProductsInOrder] = useState<
    string[]
  >([]);
  const [selectedPickingTask, setSelectedPickingTask] =
    useState<PickingTask | null>(null);
  const [selectedSalesOrder, setSelectedSalesOrder] =
    useState<SalesOrder | null>(null);
  const [selectedDeliveryNote, setSelectedDeliveryNote] =
    useState<DeliveryNote | null>(null);
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
    return getOrdersForDateAtelier(date);
  };

  const getSortedOrdersByUrgency = () => {
    return getSortedOrdersAtelier();
  };

  const getAggregatedProducts = () => {
    return aggregatedProducts;
  };

  const getOrderCard = (order: Order | UnifiedOrder) => {
    if ('sourceType' in order) {
      // UnifiedOrder
      return (
        <OrderCard
          key={order.id}
          unifiedOrder={order}
          today={now}
          onClick={(unifiedOrder: UnifiedOrder | Order) => {
            if ('sourceType' in unifiedOrder) {
              handleUnifiedOrderClick(unifiedOrder);
            }
          }}
        />
      );
    } else {
      // Legacy Order
      return (
        <OrderCard
          key={order.id}
          order={order}
          today={now}
          onClick={(legacyOrder: Order | UnifiedOrder) => {
            if (!('sourceType' in legacyOrder)) {
              openOrderDetails(legacyOrder);
            }
          }}
        />
      );
    }
  };

  // Function to update order status
  const handleStatusUpdate = (
    orderId: string,
    newStatus: DeliveryNoteStatus | SalesOrderStatus | PickingTaskStatus
  ) => {
    // For legacy Order, use updateOrderStatus
    // For new types (SalesOrder, PickingTask, DeliveryNote), status is managed by backend functions
    if (selectedOrder && selectedOrder.id === orderId) {
      updateOrderStatus(orderId, newStatus as any);
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus as any,
      });
    }
    // Update selectedDeliveryNote if it's the same
    if (
      selectedDeliveryNote &&
      selectedDeliveryNote.deliveryNoteId === orderId
    ) {
      // Fetch updated DeliveryNote from database (backend functions already updated it)
      const updatedDeliveryNote = getDeliveryNote(orderId);
      if (updatedDeliveryNote) {
        setSelectedDeliveryNote(updatedDeliveryNote);
        // Also update legacy Order for backward compatibility
        setSelectedOrder({
          ...selectedOrder!,
          status: newStatus as any,
        });
      }
    }
    // Update selectedSalesOrder if it's the same
    if (selectedSalesOrder && selectedSalesOrder.salesOrderId === orderId) {
      setSelectedSalesOrder({
        ...selectedSalesOrder,
        status: newStatus as SalesOrderStatus,
      });
    }
    // Update selectedPickingTask if it's the same
    if (selectedPickingTask && selectedPickingTask.pickingTaskId === orderId) {
      setSelectedPickingTask({
        ...selectedPickingTask,
        status: newStatus as PickingTaskStatus,
      });
    }
    // Force re-render by updating orders list
    // The useOrders hook will handle this automatically
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setSelectedProductsInOrder([]);
    setShowOrderDetailsPage(false);
    setShowDeliveryPreparation(false);
    setShowDeliveryNoteDetails(false);
    setSelectedPickingTask(null);
    setSelectedSalesOrder(null);

    // Try to find corresponding SalesOrder if BC
    if (order.type === 'BC') {
      const salesOrder = getSalesOrder(order.id);
      if (salesOrder) {
        setSelectedSalesOrder(salesOrder);
      }
      setShowOrderDetailsPage(true);
    } else if (order.type === 'BL') {
      // BL: Navigate based on status (support both legacy and new statuses)
      const status = order.status as string;

      // Map legacy status to new if needed
      const mappedStatus = isLegacyStatus(status)
        ? mapLegacyStatusToNew(status, 'BL')
        : status;

      if (mappedStatus === 'READY_TO_SHIP' || status === 'READY_TO_SHIP') {
        setShowOrderDetailsPage(true);
      } else if (
        mappedStatus === 'SHIPPED' ||
        status === 'SHIPPED' ||
        status === 'IN_PROGRESS'
      ) {
        setShowDeliveryPreparation(true);
      } else if (
        mappedStatus === 'SHIPPED' ||
        mappedStatus === 'INVOICED' ||
        status === 'SHIPPED' ||
        status === 'INVOICED'
      ) {
        setShowDeliveryNoteDetails(true);
      } else {
        // Default fallback
        setShowOrderDetailsPage(true);
      }
    }
  };

  // Handle creating BP from BC
  const handleCreatePickingTask = (salesOrderId: string) => {
    try {
      const pickingTask = createPickingTaskFromSalesOrder(salesOrderId);
      setSelectedPickingTask(pickingTask);
      setShowOrderDetailsPage(false);
      setShowDeliveryPreparation(true);
      setCurrentView('delivery-preparation');
    } catch (error) {
      console.error('Error creating picking task:', error);
      // Could show error toast here
    }
  };

  // Handle viewing active picking task
  const handleViewPickingTask = (pickingTaskId: string) => {
    const pickingTask = getPickingTask(pickingTaskId);
    if (pickingTask) {
      setSelectedPickingTask(pickingTask);
      setShowOrderDetailsPage(false);
      setShowDeliveryNoteDetails(false);
      setShowDeliveryPreparation(true);
      // Stay in logistique-commandes view, showDeliveryPreparation will handle the display
    }
  };

  // Handle unified order action (from Master List)
  const handleUnifiedOrderAction = (unifiedOrder: UnifiedOrder) => {
    if (unifiedOrder.lifecycle === 'TO_PREPARE') {
      // BC: Create BP and prepare
      if (unifiedOrder.sourceType === 'BC') {
        handleCreatePickingTask(unifiedOrder.sourceId);
      }
    } else if (unifiedOrder.lifecycle === 'IN_PREPARATION') {
      // BP: Continue picking
      if (unifiedOrder.sourceType === 'BP') {
        handleViewPickingTask(unifiedOrder.sourceId);
      }
    } else if (unifiedOrder.lifecycle === 'READY_TO_SHIP') {
      // BL: View delivery note details
      if (unifiedOrder.sourceType === 'BL') {
        const deliveryNote = getDeliveryNote(unifiedOrder.sourceId);
        if (deliveryNote) {
          // Store DeliveryNote directly - DeliveryNoteDetailsPage accepts it directly
          setSelectedDeliveryNote(deliveryNote);
          setSelectedOrder(null); // Clear legacy order
          setShowDeliveryNoteDetails(true);
        }
      }
    } else if (unifiedOrder.lifecycle === 'SHIPPED') {
      // BL: View delivery note details (read-only)
      if (unifiedOrder.sourceType === 'BL') {
        const deliveryNote = getDeliveryNote(unifiedOrder.sourceId);
        if (deliveryNote) {
          // Store DeliveryNote directly - DeliveryNoteDetailsPage accepts it directly
          setSelectedDeliveryNote(deliveryNote);
          setSelectedOrder(null); // Clear legacy order
          setShowDeliveryNoteDetails(true);
        }
      }
    }
  };

  // Handle unified order click (navigate to details)
  const handleUnifiedOrderClick = (unifiedOrder: UnifiedOrder) => {
    if (unifiedOrder.sourceType === 'BC') {
      const salesOrder = getSalesOrder(unifiedOrder.sourceId);
      if (salesOrder) {
        setSelectedSalesOrder(salesOrder);
        // No longer need to create Order - OrderDetailsPage accepts SalesOrder directly
        setSelectedOrder(null); // Clear legacy order
        setShowOrderDetailsPage(true);
      }
    } else if (unifiedOrder.sourceType === 'BP') {
      handleViewPickingTask(unifiedOrder.sourceId);
    } else if (unifiedOrder.sourceType === 'BL') {
      const deliveryNote = getDeliveryNote(unifiedOrder.sourceId);
      if (deliveryNote) {
        // Store DeliveryNote directly - DeliveryNoteDetailsPage accepts it directly
        setSelectedDeliveryNote(deliveryNote);
        setSelectedOrder(null); // Clear legacy order
        setShowDeliveryNoteDetails(true);
      }
    }
  };

  // Handle viewing sales order (BC parent)
  const handleViewSalesOrder = (salesOrderId: string) => {
    const salesOrder = getSalesOrder(salesOrderId);
    if (salesOrder) {
      setSelectedSalesOrder(salesOrder);
      // No longer need to create Order - OrderDetailsPage accepts SalesOrder directly
      setSelectedOrder(null); // Clear legacy order
      setShowDeliveryPreparation(false);
      setShowOrderDetailsPage(true);
    }
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
          onNavigateToOF={() => {
            setShowManufacturingOrder(true);
          }}
          onNavigateToDashboard={() => setCurrentView('dashboard')}
        />
      ) : currentView === 'delivery-preparation' &&
        (selectedPickingTask || selectedOrder) ? (
        <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
          <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] flex flex-col overflow-hidden'>
            <DeliveryPreparationPage
              pickingTask={selectedPickingTask || undefined}
              order={
                selectedPickingTask ? undefined : selectedOrder || undefined
              }
              onBack={() => {
                setShowDeliveryPreparation(false);
                setSelectedPickingTask(null);
                setCurrentView('logistique-commandes');
                if (selectedSalesOrder || selectedOrder) {
                  setShowOrderDetailsPage(true);
                }
              }}
              onValidationComplete={(deliveryNoteId) => {
                // After validation, navigate to delivery note details page
                // The BL was created automatically by completePickingTask()
                if (deliveryNoteId) {
                  // Get the created DeliveryNote
                  const deliveryNote = getDeliveryNote(deliveryNoteId);
                  if (deliveryNote) {
                    // Store DeliveryNote directly
                    setSelectedDeliveryNote(deliveryNote);
                    // Also keep legacy Order for backward compatibility
                    const orderFromDeliveryNote: Order = {
                      id: deliveryNote.deliveryNoteId,
                      number: deliveryNote.number,
                      type: 'BL',
                      client: deliveryNote.client,
                      deliveryDate: deliveryNote.deliveryDate,
                      items: deliveryNote.lines.map((line) => ({
                        productId: line.productId,
                        quantity: line.quantity,
                      })),
                      createdAt: deliveryNote.createdAt,
                      totalHT: 0, // Calculate if needed
                      status: deliveryNote.status,
                    };
                    setSelectedOrder(orderFromDeliveryNote);
                  }
                }
                setShowDeliveryPreparation(false);
                setSelectedPickingTask(null);
                setShowDeliveryNoteDetails(true);
                setCurrentView('logistique-commandes');
              }}
              onStatusUpdate={handleStatusUpdate}
              onRedirectToStockCheck={() => {
                setShowDeliveryPreparation(false);
                setSelectedPickingTask(null);
                setShowOrderDetailsPage(true);
              }}
              onRedirectToDetails={() => {
                setShowDeliveryPreparation(false);
                setSelectedPickingTask(null);
                setShowDeliveryNoteDetails(true);
              }}
              onViewSalesOrder={handleViewSalesOrder}
            />
          </div>
        </div>
      ) : currentView === 'logistique-commandes' ? (
        // Vue Commandes - Sections par jour + Bouton bascule Liste/Calendrier + Filtres rapides
        <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
          <div
            className={`absolute bg-white top-[87px] left-0 w-[393px] h-[691px] px-4 pt-4 ${
              mode === 'clients' &&
              showOrderDetailsPage &&
              (selectedSalesOrder || selectedOrder)
                ? 'flex flex-col overflow-hidden'
                : 'overflow-y-auto pb-7'
            }`}
          >
            {/* Order Details Page - Full page view */}
            {mode === 'clients' &&
            showOrderDetailsPage &&
            (selectedSalesOrder || selectedOrder) ? (
              <OrderDetailsPage
                salesOrder={selectedSalesOrder || undefined}
                order={
                  selectedSalesOrder ? undefined : selectedOrder || undefined
                }
                selectedProductsInOrder={selectedProductsInOrder}
                onBack={() => {
                  setShowOrderDetailsPage(false);
                  setSelectedOrder(null);
                  setSelectedSalesOrder(null);
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
                  const items = selectedSalesOrder
                    ? selectedSalesOrder.items
                    : selectedOrder!.items;
                  setSelectedProductsInOrder(
                    items.map((item) => item.productId)
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
                onCreatePickingTask={handleCreatePickingTask}
                onViewPickingTask={handleViewPickingTask}
                onPrepareDelivery={() => {
                  setShowOrderDetailsPage(false);
                  setShowDeliveryPreparation(true);
                  setCurrentView('delivery-preparation');
                }}
                onStatusUpdate={handleStatusUpdate}
              />
            ) : mode === 'clients' &&
              showDeliveryPreparation &&
              (selectedPickingTask || selectedOrder) ? (
              <DeliveryPreparationPage
                pickingTask={selectedPickingTask || undefined}
                order={
                  selectedPickingTask ? undefined : selectedOrder || undefined
                }
                onBack={() => {
                  setShowDeliveryPreparation(false);
                  setSelectedPickingTask(null);
                  setShowOrderDetailsPage(false);
                  setSelectedOrder(null);
                  setSelectedSalesOrder(null);
                }}
                onValidationComplete={(deliveryNoteId) => {
                  if (deliveryNoteId) {
                    const deliveryNote = getDeliveryNote(deliveryNoteId);
                    if (deliveryNote) {
                      // Store DeliveryNote directly - DeliveryNoteDetailsPage accepts it directly
                      setSelectedDeliveryNote(deliveryNote);
                      setSelectedOrder(null); // Clear legacy order
                    }
                  }
                  setShowDeliveryPreparation(false);
                  setSelectedPickingTask(null);
                  setShowDeliveryNoteDetails(true);
                }}
                onStatusUpdate={handleStatusUpdate}
                onRedirectToStockCheck={() => {
                  setShowDeliveryPreparation(false);
                  setSelectedPickingTask(null);
                  setShowOrderDetailsPage(true);
                }}
                onRedirectToDetails={() => {
                  setShowDeliveryPreparation(false);
                  setSelectedPickingTask(null);
                  setShowDeliveryNoteDetails(true);
                }}
                onViewSalesOrder={handleViewSalesOrder}
              />
            ) : mode === 'clients' &&
              showDeliveryNoteDetails &&
              (selectedDeliveryNote || selectedOrder) ? (
              <DeliveryNoteDetailsPage
                deliveryNote={selectedDeliveryNote || undefined}
                order={
                  selectedDeliveryNote ? undefined : selectedOrder || undefined
                }
                deliveryNoteId={
                  selectedDeliveryNote?.deliveryNoteId || selectedOrder?.id
                }
                onBack={() => {
                  setShowDeliveryNoteDetails(false);
                  setSelectedDeliveryNote(null);
                  setSelectedOrder(null);
                }}
                onStatusUpdate={handleStatusUpdate}
                onViewPickingTask={(pickingTaskId) => {
                  handleViewPickingTask(pickingTaskId);
                }}
                onViewSalesOrder={handleViewSalesOrder}
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
                  <div className='flex items-center gap-2'>
                    {mode === 'products' && (
                      <button
                        onClick={() => {
                          setShowManufacturingOrder(true);
                        }}
                        className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12895a] text-white text-[12px] font-semibold hover:bg-[#107a4d] transition-colors'
                      >
                        <Plus className='w-4 h-4' />
                        OF
                      </button>
                    )}
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
                  // NOUVEAU SYSTÈME : Utiliser OrdersListView avec Unified Orders
                  (() => {
                    const sortedOrders = getSortedUnifiedOrdersByPriority();
                    return (
                      <OrdersListView
                        unifiedOrders={sortedOrders}
                        useUnifiedView={true}
                        timeRange={timeRange}
                        activeMode={activeMode}
                        filterReferenceDate={filterReferenceDate}
                        today={now}
                        onFilterChange={(filterKey) => {
                          setTimeRange(filterKey);
                          setActiveMode('period');
                          if (filterKey !== 'all') {
                            setFilterReferenceDate(now);
                          }
                        }}
                        onResetDate={() => setFilterReferenceDate(now)}
                        onNavigatePeriod={navigatePeriod}
                        onOrderClick={(order) => {
                          if ('sourceType' in order) {
                            handleUnifiedOrderClick(order);
                          } else {
                            openOrderDetails(order);
                          }
                        }}
                      />
                    );
                  })()
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
            {mode === 'clients' &&
            showOrderDetailsPage &&
            (selectedSalesOrder || selectedOrder) ? (
              <OrderDetailsPage
                salesOrder={selectedSalesOrder || undefined}
                order={
                  selectedSalesOrder ? undefined : selectedOrder || undefined
                }
                selectedProductsInOrder={selectedProductsInOrder}
                onBack={() => {
                  setShowOrderDetailsPage(false);
                  setSelectedOrder(null);
                  setSelectedSalesOrder(null);
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
                  const items = selectedSalesOrder
                    ? selectedSalesOrder.items
                    : selectedOrder!.items;
                  setSelectedProductsInOrder(
                    items.map((item) => item.productId)
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
                onCreatePickingTask={handleCreatePickingTask}
                onViewPickingTask={handleViewPickingTask}
                onPrepareDelivery={() => {
                  setShowOrderDetailsPage(false);
                  setShowDeliveryPreparation(true);
                  setCurrentView('delivery-preparation');
                }}
                onStatusUpdate={handleStatusUpdate}
              />
            ) : mode === 'clients' &&
              showDeliveryNoteDetails &&
              (selectedDeliveryNote || selectedOrder) ? (
              <DeliveryNoteDetailsPage
                deliveryNote={selectedDeliveryNote || undefined}
                order={
                  selectedDeliveryNote ? undefined : selectedOrder || undefined
                }
                deliveryNoteId={
                  selectedDeliveryNote?.deliveryNoteId || selectedOrder?.id
                }
                onBack={() => {
                  setShowDeliveryNoteDetails(false);
                  setSelectedDeliveryNote(null);
                  setSelectedOrder(null);
                }}
                onStatusUpdate={handleStatusUpdate}
                onViewPickingTask={(pickingTaskId) => {
                  handleViewPickingTask(pickingTaskId);
                }}
                onViewSalesOrder={handleViewSalesOrder}
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
              orders={getOrdersForAtelier()}
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
