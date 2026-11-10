import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FilterMenu } from "@/components/resources/FilterMenu";
import { ResourcePage } from "@/components/resources/ResourcePage";
import { ResourceRow } from "@/components/resources/ResourceRow";
import { SearchBox } from "@/components/resources/SearchBox";
import { resources } from "@/i18n";
import {
	audiences,
	genres,
	levels,
	regions,
	resourceLanguages,
	resourceSearchSchema,
	topics,
} from "@/lib/catalog";
import { findResourceKind, type ResourceFilter } from "@/lib/resource-kinds";
import { pageMeta } from "@/lib/seo";
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
		const kind = copy.kinds[match.context.kind.id];
		return {
			meta: pageMeta({
				title: kind.title,
				documentTitle: `${kind.title} · ${copy.meta.suffix}`,
				description: kind.lead,
				path: match.pathname,
			}),
		};
	},
	component: ResourceKindPage,
});

/** Each filter's options, in display order; labels live under the same key in the copy. */
const filterOptions: Record<ResourceFilter, readonly string[]> = {
	language: resourceLanguages,
	level: levels,
	region: regions,
	topic: topics,
	audience: audiences,
	genre: genres,
};

function ResourceKindPage() {
	const { t, i18n } = useTranslation("resources");
	const language = i18n.language === "es" ? "es" : "en";
	const { kind } = Route.useRouteContext();
	const listing = Route.useLoaderData();
	const search = Route.useSearch();
	const offered: readonly ResourceFilter[] = kind.filters;
	const active = offered.filter((filter) => search[filter]);
	const filtered = active.length > 0 || Boolean(search.q);
	const label = (filter: ResourceFilter, value: string) =>
		// Keys are `${filter}.${value}` for every filter, checked by the copy's types.
		t(`${filter}.${value}` as "level.beginner");

	return (
		<ResourcePage
			kind={kind.id}
			lead={t(`kinds.${kind.id}.lead`)}
			filters={
				listing.kindCount > 0 ? (
					<>
						<SearchBox
							current={search.q}
							keep={Object.fromEntries(
								active.map((filter) => [filter, search[filter]]),
							)}
						/>
						<nav
							aria-label={t("filter.label")}
							className="grid grid-cols-2 gap-3 lg:grid-cols-5"
						>
							{offered.map((filter) => (
								<FilterMenu
									key={filter}
									label={t(`filter.${filter}`)}
									param={filter}
									current={search[filter]}
									allLabel={t("filter.all")}
									options={filterOptions[filter].map((value) => ({
										value,
										label: label(filter, value),
										count: listing.facets[filter]?.[value] ?? 0,
									}))}
								/>
							))}
						</nav>
						{filtered && (
							<p className="flex flex-wrap items-center gap-2">
								{search.q && (
									<Chip label={`“${search.q}”`} remove={{ q: undefined }} />
								)}
								{active.map((filter) => (
									<Chip
										key={filter}
										label={label(filter, search[filter] as string)}
										remove={{ [filter]: undefined }}
									/>
								))}
								<Link
									to="."
									search={{}}
									resetScroll={false}
									className="link ml-2"
								>
									{t("filter.clear")}
								</Link>
							</p>
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
				<>
					<p
						className="col-span-12 mb-4 text-muted tabular-nums"
						aria-live="polite"
					>
						{t("showing", {
							shown: listing.totalCount,
							count: listing.kindCount,
						})}
					</p>
					<ol className="col-span-12">
						{listing.items.map((item, index) => (
							<li key={item.id}>
								<ResourceRow
									item={item}
									language={language}
									striped={index % 2 === 0}
								/>
							</li>
						))}
					</ol>
				</>
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

/** An active filter; the link drops it. */
function Chip({
	label,
	remove,
}: {
	label: string;
	remove: Record<string, undefined>;
}) {
	const { t } = useTranslation("resources");
	return (
		<Link
			to="."
			search={(prev: Record<string, unknown>) => ({
				...prev,
				...remove,
				page: undefined,
			})}
			resetScroll={false}
			aria-label={t("filter.remove", { label })}
			className="inline-flex items-center gap-1.5 bg-ink px-2 py-0.5 text-ground hover:bg-ink/85"
		>
			{label}
			<span aria-hidden="true">×</span>
		</Link>
	);
}
