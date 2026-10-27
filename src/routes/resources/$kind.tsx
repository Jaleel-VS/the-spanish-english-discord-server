import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FilterGroup } from "@/components/resources/FilterGroup";
import { ResourcePage } from "@/components/resources/ResourcePage";
import { resources } from "@/i18n";
import {
	genres,
	levels,
	type Resource,
	resourceLanguages,
	resourceSearchSchema,
} from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import {
	findResourceKind,
	type ResourceKindConfig,
} from "@/lib/resource-kinds";
import { INVITE_URL } from "@/lib/site";
import { listResources } from "@/server/catalog.functions";

export const Route = createFileRoute("/resources/$kind")({
	validateSearch: resourceSearchSchema,
	beforeLoad: ({ params }) => {
		const kind = findResourceKind(params.kind);
		if (!kind) throw notFound();
		return { kind };
	},
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		listResources({ data: { kind: context.kind.id, search: deps } }),
	head: ({ match }) => {
		const copy = resources[match.context.language].resources;
		return {
			meta: [
				{
					title: `${copy.kinds[match.context.kind.id].title} · ${copy.meta.suffix}`,
				},
			],
		};
	},
	component: ResourceKindPage,
});

function ResourceKindPage() {
	const { t, i18n } = useTranslation("resources");
	const language = i18n.language === "es" ? "es" : "en";
	const { kind } = Route.useRouteContext();
	const listing = Route.useLoaderData();
	const search = Route.useSearch();
	const offers = (filter: ResourceKindConfig["filters"][number]) =>
		(kind.filters as readonly string[]).includes(filter);
	const filtered = Boolean(
		(offers("language") && search.language) ||
			(offers("level") && search.level) ||
			(offers("genre") && search.genre),
	);
	const all = { value: undefined, label: t("filter.all") };

	return (
		<ResourcePage
			kind={kind.id}
			lead={t(`kinds.${kind.id}.lead`)}
			filters={
				listing.totalCount > 0 || filtered ? (
					<>
						{offers("language") && (
							<FilterGroup
								label={t("filter.language")}
								param="language"
								current={search.language}
								options={[
									all,
									...resourceLanguages.map((value) => ({
										value,
										label: t(`language.${value}`),
									})),
								]}
							/>
						)}
						{offers("level") && (
							<FilterGroup
								label={t("filter.level")}
								param="level"
								current={search.level}
								options={[
									all,
									...levels.map((value) => ({
										value,
										label: t(`level.${value}`),
									})),
								]}
							/>
						)}
						{offers("genre") && (
							<FilterGroup
								label={t("filter.genre")}
								param="genre"
								current={search.genre}
								options={[
									all,
									...genres
										.filter((value) => listing.genres.includes(value))
										.map((value) => ({ value, label: t(`genre.${value}`) })),
								]}
							/>
						)}
					</>
				) : undefined
			}
		>
			{listing.items.length === 0 ? (
				<p className="col-span-12 max-w-[44ch] lg:col-start-6 lg:col-span-7">
					{filtered ? (
						<>
							{t("empty.filtered")}{" "}
							<Link to="." search={{}} className="link">
								{t("filter.clear")}
							</Link>
						</>
					) : (
						<>
							{t("empty.none")}{" "}
							<a href={INVITE_URL} rel="noopener" className="link">
								{t("empty.suggest")}
							</a>
						</>
					)}
				</p>
			) : (
				<ol className="col-span-12 grid grid-cols-1 gap-x-gutter gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
					{listing.items.map((item, index) => (
						<li key={item.id} style={stagger(index % 3)} data-reveal>
							<Entry item={item} language={language} />
						</li>
					))}
				</ol>
			)}

			{listing.totalPages > 1 && (
				<nav
					aria-label={t("pagination.label", {
						page: listing.page,
						total: listing.totalPages,
					})}
					className="col-span-12 mt-16 flex items-baseline gap-8 lg:col-start-6"
				>
					{listing.page > 1 && (
						<Link
							from={Route.fullPath}
							search={(prev) => ({ ...prev, page: listing.page - 1 })}
							className="link"
						>
							{t("pagination.previous")}
						</Link>
					)}
					<span className="text-muted">
						{t("pagination.label", {
							page: listing.page,
							total: listing.totalPages,
						})}
					</span>
					{listing.page < listing.totalPages && (
						<Link
							from={Route.fullPath}
							search={(prev) => ({ ...prev, page: listing.page + 1 })}
							className="link"
						>
							{t("pagination.next")}
						</Link>
					)}
				</nav>
			)}
		</ResourcePage>
	);
}

/** One entry: a small line of facts, the title as the link, the description, then language and level. */
function Entry({ item, language }: { item: Resource; language: "en" | "es" }) {
	const { t } = useTranslation("resources");
	const regions = new Intl.DisplayNames([language], { type: "region" });
	const facts = [
		item.releaseYear,
		item.country ? regions.of(item.country) : null,
		item.creator,
	].filter(Boolean);
	const tags = [
		t(`language.${item.language}`),
		item.level ? t(`level.${item.level}`) : null,
		item.genre ? t(`genre.${item.genre}`) : null,
	].filter(Boolean);

	return (
		<a
			href={item.url}
			target="_blank"
			rel="noopener noreferrer"
			className="group block"
		>
			{facts.length > 0 && (
				<span className="block text-small text-muted tabular-nums">
					{facts.join(" · ")}
				</span>
			)}
			<span
				className="mt-2 block text-lead font-semibold leading-tight tracking-[-0.02em] group-hover:underline"
				lang={item.language === "both" ? undefined : item.language}
			>
				{item.title}
				<span
					aria-hidden="true"
					className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1"
				>
					↗
				</span>
			</span>
			<span className="sr-only"> ({t("opens")})</span>
			<span className="mt-3 block max-w-[46ch]">
				{item.description[language]}
			</span>
			<span className="mt-3 block text-muted">{tags.join(" · ")}</span>
		</a>
	);
}
