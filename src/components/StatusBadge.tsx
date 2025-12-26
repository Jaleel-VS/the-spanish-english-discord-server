
import React from 'react';
import { useTranslation } from 'react-i18next';

export const StatusBadge: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-full">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fb923c]"></span>
      </span>
      <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
        {t('status.members')}
      </span>
    </div>
  );
};
