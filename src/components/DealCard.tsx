'use client';

import { memo } from 'react';
import { Deal, Contact, PipelineStage } from '@/types';
import { LeadSourceBadge } from './LeadSourceBadge';
import { Clock, DollarSign, Calendar } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface DealCardProps {
  deal: Deal;
  contact?: Contact;
  onClick?: () => void;
  isDragging?: boolean;
}

function DealCardComponent({
  deal,
  contact,
  onClick,
  isDragging,
}: DealCardProps) {
  const { locale, t } = useLanguage();

  const daysInStage = Math.floor(
    (Date.now() - deal.updatedAt) / (1000 * 60 * 60 * 24)
  );

  const formatScheduledDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (locale === 'fr') {
      return new Intl.DateTimeFormat('fr-CA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 truncate text-sm">
            {deal.title}
          </h4>
          <p className="text-xs text-slate-600 mt-1 truncate">
            {contact?.name || 'Unknown Contact'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <LeadSourceBadge source={deal.source} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-600">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-sm font-semibold text-slate-900">
              ${deal.value.toLocaleString()}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {deal.assignedTo}
          </span>
        </div>

        {deal.scheduledDate && (
          <div className="flex items-center gap-1 text-blue-600">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {t('pipeline.scheduledFor')} {formatScheduledDate(deal.scheduledDate)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">
            {daysInStage} day{daysInStage !== 1 ? 's' : ''} in stage
          </span>
        </div>
      </div>
    </div>
  );
}

export const DealCard = memo(DealCardComponent);
