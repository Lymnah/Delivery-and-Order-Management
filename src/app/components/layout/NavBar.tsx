import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

export type ViewType =
  | 'dashboard'
  | 'logistique-selection'
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
          currentView === 'logistique-commandes' ||
          currentView === 'delivery-preparation') && (
          <div className='w-16 h-1 bg-white rounded-b-lg mb-5'></div>
        )}
        <DescriptionIcon
          sx={{
            fontSize: 28,
            marginBottom:
              currentView === 'logistique' ||
              currentView === 'logistique-selection' ||
              currentView === 'logistique-commandes' ||
              currentView === 'delivery-preparation'
                ? '0px'
                : '4px',
            opacity:
              currentView === 'logistique' ||
              currentView === 'logistique-selection' ||
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

