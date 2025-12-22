import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { type Dayjs } from 'dayjs';
import OrderCard from '../orders/OrderCard';
import type { Order } from '../../../data/database';

interface CalendarViewProps {
  selectedCalendarDay: Date | null;
  currentDate: Date;
  orders: Order[];
  today: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onOrderClick: (order: Order) => void;
  getOrdersForDate: (date: Date) => Order[];
}

export default function CalendarView({
  selectedCalendarDay,
  currentDate,
  orders,
  today,
  onDateSelect,
  onMonthChange,
  onOrderClick,
  getOrdersForDate,
}: CalendarViewProps) {
  return (
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
              onDateSelect(newValue.toDate());
            }
          }}
          onMonthChange={(newMonth) => {
            onMonthChange(newMonth.toDate());
          }}
          slots={{
            day: (dayProps: PickersDayProps<Dayjs>) => {
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
                          order.type === 'BC' ? 'bg-blue-600' : 'bg-green-600'
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
                {getOrdersForDate(selectedCalendarDay).map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    today={today}
                    onClick={onOrderClick}
                  />
                ))}
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
  );
}

