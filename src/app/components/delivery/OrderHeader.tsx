import React from 'react';
import { clientLogos } from '../../../data/database';

interface OrderHeaderProps {
  client: string;
  documentNumber: string;
  statusBadge?: {
    label: string;
    bgColor: string;
    textColor: string;
  };
  onBackLinkClick?: () => void;
  backLinkLabel?: string;
}

export default function OrderHeader({
  client,
  documentNumber,
  statusBadge,
  onBackLinkClick,
  backLinkLabel,
}: OrderHeaderProps) {
  return (
    <div className='flex items-center gap-3 mb-1.5 pb-1.5 border-b border-gray-200'>
      {/* Logo à gauche */}
      <img
        src={clientLogos[client] || ''}
        alt={client}
        className='w-10 h-10 rounded object-cover flex-shrink-0'
      />

      {/* Infos au centre */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-0.5'>
          <h2 className='font-semibold text-[15px] leading-tight truncate'>
            {client}
          </h2>
          {/* Status Badge (optionnel) */}
          {statusBadge && (
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap ${statusBadge.bgColor} ${statusBadge.textColor}`}
            >
              {statusBadge.label}
            </span>
          )}
        </div>
        <p className='text-[10px] text-gray-600 leading-tight truncate'>
          {documentNumber}
        </p>
      </div>

      {/* Bouton de retour (optionnel, à droite) */}
      {onBackLinkClick && backLinkLabel && (
        <button
          onClick={onBackLinkClick}
          className='text-[10px] text-[#12895a] font-semibold hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0'
        >
          {backLinkLabel}
        </button>
      )}
    </div>
  );
}

