import { Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

interface ResourceTileProps {
  to: string;
  icon: LucideIcon;
  title: string;
}

export function ResourceTile({ to, icon: Icon, title }: ResourceTileProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-[#fb923c]/50 hover:bg-slate-800/50 transition-all duration-200"
    >
      <div className="p-3 rounded-lg bg-slate-800 group-hover:bg-[#fb923c]/10 transition-colors duration-200">
        <Icon className="w-8 h-8 text-slate-400 group-hover:text-[#fb923c] transition-colors duration-200" />
      </div>
      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200">
        {title}
      </span>
    </Link>
  );
}
