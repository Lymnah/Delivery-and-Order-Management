import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import WifiIcon from '@mui/icons-material/Wifi';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';

export default function StatusBar() {
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

