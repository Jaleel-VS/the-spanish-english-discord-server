import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FilterGroup } from "@/components/resources/FilterGroup";
import { ResourcePage } from "@/components/resources/ResourcePage";
import { resources } from "@/i18n";
import { levels, podcastSearchSchema, resourceLanguages } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import { listPodcasts } from "@/server/catalog.functions";

export const Route = createFileRoute("/resources/podcasts")({
	validateSearch: podcastSearchSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) => listPodcasts({ data: deps }),
	head: ({ match }) => ({
		meta: [
			{ title: resources[match.context.language].resources.meta.podcasts },
		],
	}),
	component: PodcastsPage,
});

function PodcastsPage() {
	const { t, i18n } = useTranslation("resources");
	const language = i18n.language === "es" ? "es" : "en";
	const regions = new Intl.DisplayNames([language], { type: "region" });
	const podcasts = Route.useLoaderData();
	const search = Route.useSearch();
	const filtered = Boolean(search.language || search.level);

	return (
		<ResourcePage
			kind="podcasts"
			lead={t("podcasts.lead")}
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
						label={t("filter.level")}
						param="level"
						current={search.level}
						options={[
							{ value: undefined, label: t("filter.all") },
							...levels.map((value) => ({ value, label: t(`level.${value}`) })),
						]}
					/>
				</>
			}
		>
			{podcasts.length === 0 ? (
				<p className="col-span-12 lg:col-start-6 lg:col-span-7">
					{t("podcasts.empty")}{" "}
					{filtered && (
						<Link to="." search={{}} className="link">
							{t("filter.clear")}
						</Link>
					)}
				</p>
			) : (
				<table className="col-span-12 w-full border-collapse text-left">
					<thead className="sr-only md:not-sr-only">
						<tr className="text-small text-muted [&>th]:pb-4 [&>th]:font-normal">
							<th scope="col">{t("podcasts.columns.show")}</th>
							<th scope="col" className="md:w-[14%]">
								{t("podcasts.columns.language")}
							</th>
							<th scope="col" className="md:w-[14%]">
								{t("podcasts.columns.level")}
							</th>
							<th scope="col" className="md:w-[14%]">
								{t("podcasts.columns.from")}
							</th>
						</tr>
					</thead>
					<tbody>
						{podcasts.map((podcast, index) => (
							<tr
								key={podcast.id}
								className="grid grid-cols-3 gap-x-4 gap-y-2 py-7 md:table-row md:py-0 md:[&>*]:py-7 md:[&>*]:pr-6 md:[&>*]:align-top"
								style={stagger(index)}
								data-reveal
							>
								<th scope="row" className="col-span-3 font-normal">
									<a
										href={podcast.url}
										target="_blank"
										rel="noopener noreferrer"
										className="group inline-block"
									>
										<span className="text-lead font-semibold leading-tight tracking-[-0.02em] group-hover:underline">
											{podcast.title}
										</span>
										<span
											aria-hidden="true"
											className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1"
										>
											↗
										</span>
										<span className="sr-only"> ({t("opens")})</span>
									</a>
									<p className="mt-2 max-w-[56ch]">
										{podcast.description[language]}
									</p>
								</th>
								<td>{t(`language.${podcast.language}`)}</td>
								<td>{t(`level.${podcast.level}`)}</td>
								<td>
									{podcast.country
										? regions.of(podcast.country)
										: t("variousCountries")}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</ResourcePage>
	);
}
