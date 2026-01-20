import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { podcastsQueryOptions, type Podcast } from '../../api/podcasts';
import { FilterBar, type FilterConfig } from '../../components/FilterBar';

export const Route = createFileRoute('/resources/podcasts')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(podcastsQueryOptions),
  component: PodcastsPage,
  pendingComponent: PodcastsLoading,
  errorComponent: PodcastsError,
});

const filterConfigs: FilterConfig[] = [
  {
    key: 'level',
    label: 'Level',
    options: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
  },
  {
    key: 'language',
    label: 'Language',
    options: [
      { value: 'es', label: 'Spanish' },
      { value: 'en', label: 'English' },
      { value: 'both', label: 'Bilingual' },
    ],
  },
];

function PodcastsPage() {
  const { t } = useTranslation('resources');
  const { data: podcasts } = useSuspenseQuery(podcastsQueryOptions);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const filteredPodcasts = useMemo(() => {
    return podcasts.filter((podcast) => {
      return Object.entries(selected).every(([key, values]) => {
        if (values.length === 0) return true;
        return values.includes(String(podcast[key as keyof Podcast]));
      });
    });
  }, [podcasts, selected]);

  const toggleFilter = (key: string, value: string) => {
    setSelected((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const removeFilter = (key: string, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((v) => v !== value),
    }));
  };

  const clearFilters = () => setSelected({});

  const isFilterActive = (key: string, value: string) => {
    return (selected[key] || []).includes(value);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{t('podcasts.title')}</h1>
      <p className="text-slate-400 mb-6">{t('podcasts.description')}</p>

      <FilterBar
        filters={filterConfigs}
        selected={selected}
        onChange={toggleFilter}
        onRemove={removeFilter}
        onClear={clearFilters}
      />

      <div className="mt-6">
        {filteredPodcasts.length === 0 ? (
          <p className="text-slate-500 py-8">{t('podcasts.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPodcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="group flex flex-col p-4 rounded-xl border border-slate-800 hover:border-[#fb923c]/50 hover:bg-slate-800/30 transition-all"
              >
                <a
                  href={podcast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 mb-3"
                >
                  <img
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-sm group-hover:text-[#fb923c] transition-colors leading-tight">
                        {podcast.title}
                      </h2>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#fb923c] flex-shrink-0 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {podcast.country}
                    </p>
                  </div>
                </a>
                <a
                  href={podcast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 line-clamp-2 mb-3 flex-1"
                >
                  {podcast.description}
                </a>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    onClick={() => toggleFilter('language', podcast.language)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      isFilterActive('language', podcast.language)
                        ? 'bg-[#fb923c]/20 text-[#fb923c]'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {podcast.language === 'both' ? 'EN/ES' : podcast.language.toUpperCase()}
                  </button>
                  <button
                    onClick={() => toggleFilter('level', podcast.level)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors ${
                      isFilterActive('level', podcast.level)
                        ? 'bg-[#fb923c]/20 text-[#fb923c]'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {podcast.level}
                  </button>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
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
  const { t } = useTranslation('resources');

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-[#fb923c] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-400">{t('podcasts.loading')}</p>
    </div>
  );
}

function PodcastsError({ error }: { error: Error }) {
  const { t } = useTranslation('resources');

  return (
    <div className="text-center py-12">
      <p className="text-red-400 mb-2">{t('podcasts.error')}</p>
      <p className="text-sm text-slate-500">{error.message}</p>
    </div>
  );
}
