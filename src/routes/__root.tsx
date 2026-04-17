import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { StatusBadge } from "../components/StatusBadge";
import { FloatingNav } from "@/components/ui/floating-navbar";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen overflow-hidden flex flex-col items-center selection:bg-[#fb923c] selection:text-white">
      {/* Navigation / Header */}
      <header className="w-full max-w-5xl px-6 py-6 md:py-8">
        <FloatingNav className="justify-between" navItems={[]}>
          <Link
            to="/"
            className="text-base sm:text-lg md:text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            {t("header.title")}
            <span className="text-[#fb923c]">{t("header.titleDot")}</span>
            {t("header.titleSuffix")}
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            <LanguageSwitcher />
            <StatusBadge />
          </div>
        </FloatingNav>
      </header>


      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <Outlet />
      </main>

			{/* Footer */}
			<footer className="w-full max-w-5xl px-6 py-12 border-t border-border flex justify-center items-center text-muted-foreground text-sm">
				<p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
			</footer>

      {/* DevTools - only in development */}
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  );
}
