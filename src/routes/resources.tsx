import { createFileRoute, Outlet, Link, useMatches } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/resources')({
  component: ResourcesLayout,
});

function ResourcesLayout() {
  const { t } = useTranslation('resources');
  const matches = useMatches();
  const isSubPage = matches.some(
    (match) => match.fullPath.startsWith('/resources/') && match.fullPath !== '/resources/'
  );

  return (
    <div className="w-full">
      {isSubPage && (
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('nav.backToResources')}
        </Link>
      )}
      <Outlet />
    </div>
  );
}
