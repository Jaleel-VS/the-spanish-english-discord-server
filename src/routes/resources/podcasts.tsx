
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Flag } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type Podcast,
  podcastsQueryOptions,
  reportDeadLink,
} from "../../api/podcasts";
import { FilterBar, type FilterConfig } from "../../components/FilterBar";
import { SpinnerLoader } from "@/components/ui/spinner-loader";
import { useGenericInMemoryFilter } from "@/hooks/useGenericInMemoryFilter";

export const Route = createFileRoute("/resources/podcasts")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(podcastsQueryOptions),
  component: PodcastsPage,
  pendingComponent: PodcastsLoading,
  errorComponent: PodcastsError,
});

function PodcastsPage() {
  const { t } = useTranslation("resources");
  const filterConfigs = useMemo((): FilterConfig[] => {
    return [
      {
        key: "level",
        label: t("podcasts.filter.level"),
        options: [
          { value: "beginner", label: t("podcasts.filter.levelOption.beginner") },
          {
            value: "intermediate",
            label: t("podcasts.filter.levelOption.intermediate"),
          },
          { value: "advanced", label: t("podcasts.filter.levelOption.advanced") },
        ],
      },
      {
        key: "language",
        label: t("podcasts.filter.language"),
        options: [
          { value: "es", label: t("podcasts.filter.languageOption.es") },
          { value: "en", label: t("podcasts.filter.languageOption.en") },
          { value: "both", label: t("podcasts.filter.languageOption.both") },
        ],
      },
    ];
  }, [t]);
  const podcasts = Route.useLoaderData() as Podcast[];
  const { selected, toggleFilter, removeFilter, clearFilters, isFilterActive } =
    useGenericInMemoryFilter<Record<string, string[]>>({});
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());
  const [reportingId, setReportingId] = useState<string | null>(null);

  const handleReport = async (podcastId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (reportedIds.has(podcastId) || reportingId === podcastId) return;

    setReportingId(podcastId);
    try {
      await reportDeadLink(podcastId);
      setReportedIds((prev) => new Set(prev).add(podcastId));
    } catch (error) {
      console.error("Failed to report dead link:", error);
    } finally {
      setReportingId(null);
    }
  };

  const filteredPodcasts = useMemo(() => {
    return podcasts.filter((podcast: Podcast) => {
      return Object.entries(selected).every(([key, values]) => {
        if (values.length === 0) return true;
        return values.includes(String(podcast[key as keyof Podcast]));
      });
    });
  }, [podcasts, selected]);

  return (
    <div>
      <h1 className="text-3xl pt-2 pb-2 font-bold mb-3 text-foreground">
        {t("podcasts.title")}
      </h1>
      <p className="text-muted-foreground mb-6">{t("podcasts.description")}</p>

      <FilterBar
        filters={filterConfigs}
        selected={selected}
        onChange={toggleFilter}
        onRemove={removeFilter}
        onClear={clearFilters}
      />

      <div className="mt-6">
        {filteredPodcasts.length === 0 ? (
          <p className="text-muted-foreground py-8">{t("podcasts.empty")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPodcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="group relative flex flex-col p-4 rounded-xl border border-border hover:border-[#fb923c]/50 hover:bg-muted/40 transition-all"
              >
                <button
                  type="button"
                  onClick={(e) => handleReport(podcast.id, e)}
                  disabled={
                    reportedIds.has(podcast.id) || reportingId === podcast.id
                  }
                  className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all z-10 ${
                    reportedIds.has(podcast.id)
                      ? "bg-green-500/20 text-green-400 opacity-100"
                      : reportingId === podcast.id
                        ? "bg-muted text-muted-foreground opacity-100"
                        : "bg-muted/80 text-muted-foreground hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100"
                  }`}
                  title={
                    reportedIds.has(podcast.id)
                      ? t("podcasts.report.reported")
                      : t("podcasts.report.deadLink")
                  }
                >
                  <Flag
                    className={`w-3.5 h-3.5 ${reportingId === podcast.id ? "animate-pulse" : ""}`}
                  />
                </button>
                <a
                  href={podcast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 mb-3"
                >
                  <img
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-sm text-foreground group-hover:text-[#fb923c] transition-colors leading-tight">
                        {podcast.title}
                      </h2>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#fb923c] shrink-0 transition-colors" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {podcast.country}
                    </p>
                  </div>
                </a>
                <a
                  href={podcast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1"
                >
                  {podcast.description}
                </a>
                <div className="flex flex-wrap *:transition-colors *:rounded-md *:px-2 *:py-0.5 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleFilter("language", podcast.language)}
                    className={`${
                      isFilterActive("language", podcast.language)
                        ? "bg-[#fb923c]/20 text-[#fb923c]"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {podcast.language === "both"
                      ? t("podcasts.badge.bilingual")
                      : podcast.language.toUpperCase()}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFilter("level", podcast.level)}
                    className={`capitalize ${
                      isFilterActive("level", podcast.level)
                        ? "bg-[#fb923c]/20 text-[#fb923c]"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {podcast.level}
                  </button>
                  <span className="bg-muted text-muted-foreground">
                    {podcast.topic}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PodcastsLoading() {
  const { t } = useTranslation("resources");
  return <SpinnerLoader message={t("podcasts.loading")} />;
}

function PodcastsError({ error }: { error: Error }) {
  const { t } = useTranslation("resources");

  return (
    <div className="text-center py-12">
      <p className="text-red-400 mb-2">{t("podcasts.error")}</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  );
}
