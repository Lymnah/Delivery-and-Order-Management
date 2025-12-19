import {
  Factory,
  Package,
  Thermometer,
  Warehouse,
  Tag,
  Truck,
  QrCode,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardProps {
  onNavigate?: (module: string) => void;
}

interface OngoingTask {
  id: string;
  name: string;
  code: string;
  type: 'fabrication' | 'conditionnement';
  date: Date;
}

// Mock data pour les tâches en cours
const ongoingTasks: OngoingTask[] = [
  {
    id: '1',
    name: 'Pâte à tartiner',
    code: 'PAT-J07082028',
    type: 'fabrication',
    date: new Date(),
  },
  {
    id: '2',
    name: 'Seau 2kg',
    code: 'S2k-J07082028',
    type: 'conditionnement',
    date: new Date(),
  },
];

const dashboardModules = [
  {
    id: 'fabrication',
    label: 'Fabrication',
    color: 'bg-[#16a34a]',
    borderColor: 'border-[#16a34a]',
    icon: Factory,
  },
  {
    id: 'conditionnement',
    label: 'Conditionnement',
    color: 'bg-[#2563eb]',
    borderColor: 'border-[#2563eb]',
    icon: Package,
  },
  {
    id: 'traitement-thermique',
    label: 'Traitement thermique',
    color: 'bg-[#e11d48]',
    borderColor: 'border-[#d5d7da]',
    icon: Thermometer,
  },
  {
    id: 'stock',
    label: 'Stock',
    color: 'bg-[#ca8a04]',
    borderColor: 'border-[#ca8a04]',
    icon: Warehouse,
  },
  {
    id: 'labelisation',
    label: 'Labélisation',
    color: 'bg-[#ea580c]',
    borderColor: 'border-[#ea580c]',
    icon: Tag,
  },
  {
    id: 'logistique',
    label: 'Logistique',
    color: 'bg-[#9333ea]',
    borderColor: 'border-[#9333ea]',
    icon: Truck,
  },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const handleModuleClick = (moduleId: string) => {
    if (onNavigate) {
      onNavigate(moduleId);
    }
  };

  const getTaskColor = (type: 'fabrication' | 'conditionnement') => {
    return type === 'fabrication' ? 'bg-[#16a34a]' : 'bg-[#2563eb]';
  };

  return (
    <div className='bg-[#f5f5f6] relative w-[393px] h-[852px] mx-auto overflow-y-auto'>
      {/* Main Content */}
      <div className='pt-[84px] pb-[100px] px-4'>
        {/* Dashboard Modules Grid */}
        <div className='mb-4'>
          <div className='grid grid-cols-2 gap-4 mb-6'>
            {dashboardModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module.id)}
                  className={`${module.color} ${module.borderColor} border rounded-lg flex flex-col gap-3 items-center justify-center p-4 h-[140px] transition-all hover:opacity-90 active:scale-95`}
                >
                  <IconComponent className='w-16 h-16 text-white' />
                  <p className='font-semibold text-[14px] text-white text-center'>
                    {module.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ongoing Tasks Section */}
        <div className='bg-white rounded-lg p-4'>
          <p className='font-semibold text-[16px] text-[#181d27] mb-4'>
            Mes en cours
          </p>
          <div className='flex flex-col gap-2'>
            {ongoingTasks.map((task) => (
              <div
                key={task.id}
                className={`${getTaskColor(
                  task.type
                )} border rounded-lg flex items-center justify-between p-4 h-[68px]`}
              >
                <div className='flex flex-col gap-1'>
                  <p className='font-semibold text-[14px] text-white'>
                    {task.name}
                  </p>
                  <p className='font-normal text-[12px] text-white'>
                    {task.code}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <p className='font-normal text-[10px] text-white'>
                    {format(task.date, 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </p>
                  {task.type === 'conditionnement' && (
                    <button className='p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors'>
                      <QrCode className='w-4 h-4 text-white' />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Scanner Button - Fixed at bottom */}
      <button className='fixed bottom-[90px] right-4 bg-[#12895a] border border-[#12895a] rounded-full p-[18px] shadow-lg hover:bg-[#107a4d] transition-colors active:scale-95'>
        <QrCode className='w-5 h-5 text-white' />
      </button>
    </div>
  );
}

