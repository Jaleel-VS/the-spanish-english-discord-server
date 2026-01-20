import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../components/StatusBadge';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-[#fb923c] selection:text-white">
      {/* Navigation / Header */}
      <header className="w-full max-w-5xl px-6 py-6 md:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="text-base sm:text-lg md:text-xl font-bold tracking-tight">
            {t('header.title')}<span className="text-[#fb923c]">{t('header.titleDot')}</span>{t('header.titleSuffix')}
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <LanguageSwitcher />
            <StatusBadge />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl px-6 py-12 border-t border-slate-800 flex justify-center items-center text-slate-500 text-sm">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </footer>

      {/* DevTools - only in development */}
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  );
}
