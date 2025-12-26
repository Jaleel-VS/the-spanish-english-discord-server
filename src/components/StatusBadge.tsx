
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDiscordStats } from '../hooks/useDiscordStats';

// Format number to readable format (e.g., 12543 -> 12.5k, 150234 -> 150k)
function formatCount(count: number): string {
  if (count === 0) return '0';
  if (count < 1000) return count.toString();

  const k = count / 1000;
  // Show decimal if less than 100k, otherwise round
  return k < 100 ? k.toFixed(1) : Math.round(k).toString();
}

export const StatusBadge: React.FC = () => {
  const { t } = useTranslation('common');
  const { online, total, loading, error } = useDiscordStats('spanish-english');

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
        </span>
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {t('status.loading')}
        </span>
      </div>
    );
  }

  // Show error state (fallback to static text)
  if (error) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fb923c]"></span>
        </span>
        <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
          150k members
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-full">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fb923c]"></span>
      </span>
      <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
        {t('status.combined', {
          online: formatCount(online),
          total: formatCount(total)
        })}
      </span>
    </div>
  );
};
