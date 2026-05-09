import {
  moviesQueryOptions,
  moviesRouteSearchSchema,
  moviesRouteSearchToApi,
  parseMoviesRouteSearch,
  type MoviesResponse,
  type MoviesRouteSearch,
} from "@/api/movies";
import { FilterBar } from "@/components/FilterBar";
import { SpinnerLoader } from "@/components/ui/spinner-loader";
import { useMovies } from "@/hooks/useMovies";
import { cn } from "@/lib/utils";
import {
  createFileRoute,
  type NavigateOptions,
  useNavigate,
} from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/components/ui/pagination";

export function go(
  n: ReturnType<typeof useNavigate>,
  update: (prev: MoviesRouteSearch) => MoviesRouteSearch,
) {
  n({ search: (prev) => update(prev as MoviesRouteSearch) } as NavigateOptions);
}

export const Route = createFileRoute("/resources/movies")({
  validateSearch: moviesRouteSearchSchema,
  loaderDeps: ({ search }) => ({
    api: moviesRouteSearchToApi(parseMoviesRouteSearch(search)),
  }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(moviesQueryOptions(deps.api)),
  component: MoviesPage,
  pendingComponent: MoviesLoading,
  errorComponent: MoviesError,
});

function MoviesPage() {
  const { t } = useTranslation("resources");
  const { t: tc } = useTranslation("common");
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const movies = Route.useLoaderData() as MoviesResponse;
  const {
    filterConfigs,
    selected,
    handleFilterChange,
    handleRemoveFilter,
    searchDraft,
    setSearchDraft,
    clearAll,
    hasFilters,
  } = useMovies(movies, search, navigate);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      go(navigate, (p) => ({ ...p, page: nextPage }));
    },
    [navigate],
  );

  const handlePageSizeChange = useCallback(
    (nextPageSize: number) => {
      go(navigate, (p) => ({ ...p, page: 1, pageSize: nextPageSize }));
    },
    [navigate],
  );

  const { currentPage, totalPages } = movies.pagination;

  return (
    <div>
      <h1 className="text-3xl pt-2 pb-2 font-bold mb-3 text-foreground">
        {t("movies.title")}
      </h1>
      <p className="text-muted-foreground mb-6">{t("movies.description")}</p>

      <div className="space-y-3">
        <FilterBar
          filters={filterConfigs}
          selected={selected}
          onChange={handleFilterChange}
          onRemove={handleRemoveFilter}
        />

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            placeholder={t("movies.filter.search")}
            value={searchDraft}
            className="min-w-48 flex-1 rounded-md border border-border bg-background p-2 text-sm"
            onChange={(e) => setSearchDraft(e.target.value)}
          />
          {hasFilters && (
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground shrink-0"
              onClick={clearAll}
            >
              {tc("filter.clearAll")}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {movies.items.length === 0 ? (
          <p className="text-muted-foreground py-8">{t("movies.empty")}</p>
        ) : (
          <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {movies.items.map((movie) => (
              <div
                key={movie.id}
                className="group relative flex flex-col rounded-xl border border-border p-4 transition-all hover:border-[#fb923c]/50 hover:bg-muted/40"
              >
                <a
                  href={movie.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 flex gap-3"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-[#fb923c]">
                        {movie.title}
                      </h2>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-[#fb923c]" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {movie.country}
                    </p>
                  </div>
                </a>
                <a
                  href={movie.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 line-clamp-2 flex-1 text-sm text-muted-foreground"
                >
                  {movie.description}
                </a>
                <div className="flex flex-wrap *:transition-colors *:rounded-md *:px-2 *:py-0.5 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      go(navigate, (p) => ({
                        ...p,
                        page: 1,
                        audioLanguage:
                          p.audioLanguage === movie.audioLanguage
                            ? undefined
                            : movie.audioLanguage,
                      }))
                    }
                    className={cn(
                      search.audioLanguage === movie.audioLanguage
                        ? "bg-[#fb923c]/20 text-[#fb923c]"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {movie.audioLanguage === "both"
                      ? t("movies.badge.bilingual")
                      : movie.audioLanguage.toUpperCase()}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      go(navigate, (p) => ({
                        ...p,
                        page: 1,
                        genre:
                          p.genre === movie.genre ? undefined : movie.genre,
                      }))
                    }
                    className={cn(
                      "capitalize",
                      search.genre === movie.genre
                        ? "bg-[#fb923c]/20 text-[#fb923c]"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {movie.genre}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      go(navigate, (p) => ({
                        ...p,
                        page: 1,
                        country:
                          p.country === movie.country
                            ? undefined
                            : movie.country,
                      }))
                    }
                    className={cn(
                      search.country === movie.country
                        ? "bg-[#fb923c]/20 text-[#fb923c]"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {movie.country}
                  </button>
                </div>
              </div>
            ))}
          </div>
          { (
            <Pagination
              pageSize={search.pageSize}
              onPageSizeChange={handlePageSizeChange}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          </>
        )}
      </div>
    </div>
  );
}

function MoviesLoading() {
  const { t } = useTranslation("resources");
  return <SpinnerLoader message={t("movies.loading")} />;
}

function MoviesError({ error }: { error: Error }) {
  const { t } = useTranslation("resources");

  return (
    <div className="py-12 text-center">
      <p className="mb-2 text-red-400">{t("movies.error")}</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  );
}
