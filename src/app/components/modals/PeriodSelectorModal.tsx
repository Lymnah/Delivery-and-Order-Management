interface PeriodSelectorModalProps {
  onSelectWeek: () => void;
  onSelectMonth: () => void;
  onSelectCustom: () => void;
  onClose: () => void;
}

export default function PeriodSelectorModal({
  onSelectWeek,
  onSelectMonth,
  onSelectCustom,
  onClose,
}: PeriodSelectorModalProps) {
  return (
    <div className='absolute inset-0 backdrop-blur-[2px] flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[350px] shadow-xl'>
        <h2 className='font-semibold text-[18px] mb-4'>Choisir une période</h2>
        <div className='space-y-3'>
          <button
            onClick={onSelectWeek}
            className='w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-semibold text-left px-4 transition-colors'
          >
            Semaine
          </button>
          <button
            onClick={onSelectMonth}
            className='w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-semibold text-left px-4 transition-colors'
          >
            Mois
          </button>
          <button
            onClick={onSelectCustom}
            className='w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-semibold text-left px-4 transition-colors'
          >
            Personnalisé
          </button>
        </div>
        <div className='mt-4'>
          <button
            onClick={onClose}
            className='w-full bg-gray-200 text-gray-700 py-2 rounded font-semibold'
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

