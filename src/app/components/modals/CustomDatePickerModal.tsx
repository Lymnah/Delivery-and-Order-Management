import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';

interface CustomDatePickerModalProps {
  customStartDate: Dayjs | null;
  customEndDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CustomDatePickerModal({
  customStartDate,
  customEndDate,
  onStartDateChange,
  onEndDateChange,
  onConfirm,
  onClose,
}: CustomDatePickerModalProps) {
  return (
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
                onChange={onStartDateChange}
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
                onChange={onEndDateChange}
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
            onClick={onClose}
            className='flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold'
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 bg-[#12895a] text-white py-2 rounded font-semibold'
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

