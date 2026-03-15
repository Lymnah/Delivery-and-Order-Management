import {
  Truck,
  QrCode,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import React from 'react';
import { useDashboardStats } from './hooks/useDashboardStats';
import { clientLogos } from '../data/database';

interface DashboardProps {
  onNavigate?: (module: string) => void;
}

const dashboardModules = [
  {
    id: 'logistique',
    label: 'Logistique',
    color: 'bg-[#9333ea]',
    borderColor: 'border-[#9333ea]',
    icon: Truck,
  },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const stats = useDashboardStats(today);

  const handleModuleClick = (moduleId: string) => {
    if (onNavigate) {
      onNavigate(moduleId);
    }
  };

  const statCards = [
    {
      label: 'Commandes du jour',
      value: stats.todayOrdersCount,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'En préparation',
      value: stats.inPreparationCount,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Prêt à expédier',
      value: stats.readyToShipCount,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'En retard',
      value: stats.overdueCount,
      icon: AlertTriangle,
      color: stats.overdueCount > 0 ? 'text-red-600' : 'text-gray-400',
      bg: stats.overdueCount > 0 ? 'bg-red-50' : 'bg-gray-50',
    },
  ];

  return (
    <div className='bg-[#f5f5f6] relative flex-1 w-full overflow-y-auto'>
      {/* Main Content */}
      <div className='pt-4 pb-4 px-4'>
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

        {/* Live Stats Section */}
        <div className='bg-white rounded-lg p-4 mb-4'>
          <p className='font-semibold text-[16px] text-[#181d27] mb-3'>
            Tableau de bord
          </p>
          <div className='grid grid-cols-2 gap-3'>
            {statCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.label}
                  className={`${card.bg} rounded-lg p-3 flex flex-col gap-1`}
                >
                  <div className='flex items-center gap-2'>
                    <IconComponent className={`w-4 h-4 ${card.color}`} />
                    <span className={`text-[20px] font-bold ${card.color}`}>
                      {card.value}
                    </span>
                  </div>
                  <span className='text-[11px] font-medium text-gray-600'>
                    {card.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Orders Preview */}
        {stats.todayOrders.length > 0 && (
          <div className='bg-white rounded-lg p-4'>
            <div className='flex items-center justify-between mb-3'>
              <p className='font-semibold text-[14px] text-[#181d27]'>
                Commandes du jour
              </p>
              <button
                onClick={() => onNavigate && onNavigate('logistique')}
                className='text-[12px] text-[#12895a] font-semibold flex items-center gap-1'
              >
                Voir tout
                <ChevronRight className='w-3 h-3' />
              </button>
            </div>
            <div className='flex flex-col gap-2'>
              {stats.todayOrders.map((order) => {
                const lifecycleColors: Record<string, { bg: string; text: string; label: string }> = {
                  TO_PREPARE: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'A préparer' },
                  IN_PREPARATION: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'En prépa.' },
                  READY_TO_SHIP: { bg: 'bg-green-100', text: 'text-green-700', label: 'Prêt' },
                  SHIPPED: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Expédié' },
                };
                const badge = lifecycleColors[order.lifecycle] || { bg: 'bg-gray-100', text: 'text-gray-600', label: order.lifecycle };

                return (
                  <button
                    key={order.id}
                    onClick={() => onNavigate && onNavigate('logistique')}
                    className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left'
                  >
                    <img
                      src={clientLogos[order.client] || ''}
                      alt=''
                      className='w-8 h-8 rounded-lg object-contain border border-gray-100 bg-gray-50 flex-shrink-0'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-[13px] font-semibold text-gray-900 truncate'>
                        {order.client}
                      </p>
                      <p className='text-[11px] text-gray-500'>
                        {order.sourceType} &bull; {order.itemsCount} art.
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Scanner Button - Bottom right, above NavBar */}
      <button className='absolute bottom-4 right-4 bg-[#12895a] border border-[#12895a] rounded-full p-[18px] shadow-lg hover:bg-[#107a4d] transition-colors active:scale-95 z-10'>
        <QrCode className='w-5 h-5 text-white' />
      </button>
    </div>
  );
}
