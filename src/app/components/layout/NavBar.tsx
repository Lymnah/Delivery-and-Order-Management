import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

export type ViewType =
  | 'dashboard'
  | 'logistique'
  | 'logistique-commandes'
  | 'delivery-preparation'
  | 'manufacturing-order';

interface NavBarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function NavBar({ currentView, onViewChange }: NavBarProps) {
  return (
    <div className='bg-[#12895a] flex items-center justify-around w-full h-[75px] flex-none'>
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
        onClick={() => onViewChange('logistique-commandes')}
        className='flex flex-col items-center text-white'
      >
        {(currentView === 'logistique' ||
          currentView === 'logistique-commandes' ||
          currentView === 'delivery-preparation') && (
          <div className='w-16 h-1 bg-white rounded-b-lg mb-5'></div>
        )}
        <DescriptionIcon
          sx={{
            fontSize: 28,
            marginBottom:
              currentView === 'logistique' ||
              currentView === 'logistique-commandes' ||
              currentView === 'delivery-preparation'
                ? '0px'
                : '4px',
            opacity:
              currentView === 'logistique' ||
              currentView === 'logistique-commandes' ||
              currentView === 'delivery-preparation'
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

