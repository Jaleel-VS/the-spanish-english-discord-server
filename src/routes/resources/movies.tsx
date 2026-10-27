import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FilterGroup } from "@/components/resources/FilterGroup";
import { ResourcePage } from "@/components/resources/ResourcePage";
import { resources } from "@/i18n";
import { movieSearchSchema, resourceLanguages } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import { listMovies } from "@/server/catalog.functions";

export const Route = createFileRoute("/resources/movies")({
	validateSearch: movieSearchSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) => listMovies({ data: deps }),
	head: ({ match }) => ({
		meta: [{ title: resources[match.context.language].resources.meta.movies }],
	}),
	component: MoviesPage,
});

function MoviesPage() {
	const { t, i18n } = useTranslation("resources");
	const language = i18n.language === "es" ? "es" : "en";
	const regions = new Intl.DisplayNames([language], { type: "region" });
	const result = Route.useLoaderData();
	const search = Route.useSearch();
	const filtered = Boolean(search.language || search.genre);

	return (
		<ResourcePage
			kind="movies"
			lead={t("movies.lead")}
			filters={
				<>
					<FilterGroup
						label={t("filter.language")}
						param="language"
						current={search.language}
						options={[
							{ value: undefined, label: t("filter.all") },
							...resourceLanguages.map((value) => ({
								value,
								label: t(`language.${value}`),
							})),
						]}
					/>
					<FilterGroup
						label={t("filter.genre")}
						param="genre"
						current={search.genre}
						options={[
							{ value: undefined, label: t("filter.all") },
							...result.genres.map((genre) => ({
								value: genre,
								label: t(`genre.${genre}`),
							})),
						]}
					/>
				</>
			}
		>
			{result.items.length === 0 ? (
				<p className="col-span-12 lg:col-start-6 lg:col-span-7">
					{t("movies.empty")}{" "}
					{filtered && (
						<Link to="." search={{}} className="link">
							{t("filter.clear")}
						</Link>
					)}
				</p>
			) : (
				<ol className="col-span-12 grid grid-cols-1 gap-x-gutter gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
					{result.items.map((movie, index) => (
						<li key={movie.id} style={stagger(index % 3)} data-reveal>
							<a
								href={movie.url}
								target="_blank"
								rel="noopener noreferrer"
								className="group block"
							>
								<span className="block text-small text-muted tabular-nums">
									{movie.releaseYear} · {regions.of(movie.country)}
								</span>
								<span
									className="mt-2 block text-lead font-semibold leading-tight tracking-[-0.02em] group-hover:underline"
									lang={
										movie.audioLanguage === "both"
											? undefined
											: movie.audioLanguage
									}
								>
									{movie.title}
									<span
										aria-hidden="true"
										className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1"
									>
										↗
									</span>
								</span>
								<span className="sr-only"> ({t("opens")})</span>
								<span className="mt-3 block max-w-[46ch]">
									{movie.description[language]}
								</span>
								<span className="mt-3 block text-muted">
									{t(`language.${movie.audioLanguage}`)} ·{" "}
									{t(`genre.${movie.genre}`)}
								</span>
							</a>
						</li>
					))}
				</ol>
			)}

			{result.totalPages > 1 && (
				<nav
					aria-label={t("movies.page", {
						page: result.page,
						total: result.totalPages,
					})}
					className="col-span-12 mt-16 flex items-baseline gap-8 lg:col-start-6"
				>
					{result.page > 1 && (
						<Link
							from={Route.fullPath}
							search={(prev) => ({ ...prev, page: result.page - 1 })}
							className="link"
						>
							{t("movies.previous")}
						</Link>
					)}
					<span className="text-muted">
						{t("movies.page", { page: result.page, total: result.totalPages })}
					</span>
					{result.page < result.totalPages && (
						<Link
							from={Route.fullPath}
							search={(prev) => ({ ...prev, page: result.page + 1 })}
							className="link"
						>
							{t("movies.next")}
						</Link>
					)}
				</nav>
			)}
		</ResourcePage>
	);
}
