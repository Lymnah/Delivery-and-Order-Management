import { ChevronLeft, Package } from 'lucide-react';
import DescriptionIcon from '@mui/icons-material/Description';
import type { ViewType } from '../layout/NavBar';

interface LogistiqueSelectionProps {
  onNavigateToCommandes: () => void;
  onNavigateToProducts: () => void;
  onNavigateToDashboard: () => void;
}

export default function LogistiqueSelection({
  onNavigateToCommandes,
  onNavigateToProducts,
  onNavigateToDashboard,
}: LogistiqueSelectionProps) {
  return (
    <div className='bg-white relative w-[393px] h-[852px] mx-auto overflow-hidden'>
      {/* Page de sélection Logistique */}
      <div className='absolute bg-white top-[87px] left-0 w-[393px] h-[691px] overflow-y-auto px-4 py-7'>
        <div className='flex flex-col gap-6 items-center justify-center min-h-full'>
          <div className='text-center'>
            <p className='font-semibold text-[24px] mb-2'>Logistique</p>
            <p className='text-[14px] text-gray-600'>Sélectionnez une vue</p>
          </div>
          <div className='flex flex-col gap-4 w-full max-w-[280px]'>
            <button
              onClick={onNavigateToCommandes}
              className='bg-[#12895a] text-white px-6 py-5 rounded-lg font-semibold text-[16px] hover:bg-[#107a4d] transition-colors flex items-center justify-center gap-3 shadow-md'
            >
              <DescriptionIcon sx={{ fontSize: 28 }} />
              Commandes
            </button>
            <button
              onClick={onNavigateToProducts}
              className='bg-[#12895a] text-white px-6 py-5 rounded-lg font-semibold text-[16px] hover:bg-[#107a4d] transition-colors flex items-center justify-center gap-3 shadow-md'
            >
              <Package className='w-7 h-7' />
              OF
            </button>
          </div>
          <button
            onClick={onNavigateToDashboard}
            className='mt-4 flex items-center gap-2 text-[#12895a] text-[14px] font-semibold hover:underline'
          >
            <ChevronLeft className='w-4 h-4' />
            Retour au Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

