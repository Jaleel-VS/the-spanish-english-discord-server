import {
  MoviesRouteSearch,
  moviesRouteSearchDefaults,
  type MoviesResponse,
} from "@/api/movies";
import { FilterConfig } from "@/components/FilterBar";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { go } from "@/routes/resources/movies";

/**
 * This hook is used to return the filter configs 
 * for movies, it uses the query params from the route. Related files: resources/movies.tsx, api/movies.ts
 * @param movies - The movies data
 * @param s - The search state from the useSearch hook of the route
 * @param navigate - The navigate function from the useNavigate hook of the route
 * @returns The filter configs, the selected filters, the handle filter 
 * change function, the handle remove filter function, the search draft, the set 
 * search draft function, the clear all function, and the has filters function
 */
export const useMovies = (
  movies: MoviesResponse,
  s: ReturnType<typeof useSearch>,
  navigate: ReturnType<typeof useNavigate>,
) => {
  const { t } = useTranslation("resources");

  const genres = [...new Set(movies.items.map((m) => m.genre))].sort();
  const countries = [...new Set(movies.items.map((m) => m.country))].sort();

  const filterConfigs = useMemo((): FilterConfig[] => {
    return [
      {
        key: "audioLanguage",
        label: t("movies.filter.audioLanguage"),
        options: [
          { value: "en", label: t("movies.filter.audio.en") },
          { value: "es", label: t("movies.filter.audio.es") },
          { value: "both", label: t("movies.filter.audio.both") },
        ],
      },
      {
        key: "genre",
        label: t("movies.filter.genre"),
        options: genres.map((g) => ({ value: g, label: g })),
      },
      {
        key: "country",
        label: t("movies.filter.country"),
        options: countries.map((c) => ({ value: c, label: c })),
      },
      {
        key: "archived",
        label: t("movies.filter.archived.label"),
        excludeChipValues: ["false"],
        options: [
          { value: "false", label: t("movies.filter.archived.false") },
          { value: "true", label: t("movies.filter.archived.true") },
        ],
      },
    ];
  }, [t, genres, countries]);

  const selected = useMemo(
    () => ({
      audioLanguage: s.audioLanguage ? [s.audioLanguage] : [],
      genre: s.genre ? [s.genre] : [],
      country: s.country ? [s.country] : [],
      archived: [s.includeArchived ? "true" : "false"],
    }),
    [s],
  );

  const handleFilterChange = (key: string, value: string) => {
    go(navigate, (p) => {
      const page = 1;
      if (key === "audioLanguage") {
        const next =
          p.audioLanguage === value
            ? undefined
            : (value as MoviesRouteSearch["audioLanguage"]);
        return { ...p, page, audioLanguage: next };
      }
      if (key === "genre") {
        const next = p.genre === value ? undefined : value;
        return { ...p, page, genre: next };
      }
      if (key === "country") {
        const next = p.country === value ? undefined : value;
        return { ...p, page, country: next };
      }
      if (key === "archived") {
        return { ...p, page, includeArchived: value === "true" };
      }
      return p;
    });
  };

  const handleRemoveFilter = (key: string, value: string) => {
    go(navigate, (p) => {
      const page = 1;
      if (key === "audioLanguage" && p.audioLanguage === value) {
        return { ...p, page, audioLanguage: undefined };
      }
      if (key === "genre" && p.genre === value) {
        return { ...p, page, genre: undefined };
      }
      if (key === "country" && p.country === value) {
        return { ...p, page, country: undefined };
      }
      if (key === "archived" && value === "true") {
        return { ...p, page, includeArchived: false };
      }
      return p;
    });
  };

  const [searchDraft, setSearchDraft] = useState(s.search);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = searchDraft.trim();
      if (next === s.search.trim()) return;
      go(navigate, (p) => ({ ...p, search: next, page: 1 }));
    }, 300);
    return () => clearTimeout(id);
  }, [searchDraft, s.search, navigate]);

  const clearAll = () => {
    setSearchDraft("");
    go(navigate, (p) => ({
      ...moviesRouteSearchDefaults(),
      pageSize: p.pageSize,
    }));
  };

  const hasFilters =
    Boolean(s.search.trim()) ||
    Boolean(s.audioLanguage) ||
    Boolean(s.genre) ||
    Boolean(s.country) ||
    s.includeArchived;

  return {
    filterConfigs,
    selected,
    handleFilterChange,
    handleRemoveFilter,
    searchDraft,
    setSearchDraft,
    clearAll,
    hasFilters,
  };
};
