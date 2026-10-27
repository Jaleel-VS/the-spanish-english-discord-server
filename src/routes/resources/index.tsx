import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ResourceKindTile } from "@/components/resources/ResourceKindTile";
import { resources } from "@/i18n";
import { stagger } from "@/lib/motion";
import { resourceKinds } from "@/lib/resource-kinds";
import { INVITE_URL } from "@/lib/site";
import { getCatalogueCounts } from "@/server/catalog.functions";

export const Route = createFileRoute("/resources/")({
	loader: () => getCatalogueCounts(),
	head: ({ match }) => ({
		meta: [{ title: resources[match.context.language].resources.meta.index }],
	}),
	component: ResourcesIndex,
});

/** The directory of every resource kind; one band per kind, built from `resourceKinds`. */
function ResourcesIndex() {
	const { t } = useTranslation("resources");
	const counts = Route.useLoaderData();
	const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

	return (
		<article className="pb-section">
			<div className="frame items-end gap-y-8 pt-[10vh] md:pt-[14vh]">
				<div className="col-span-12 lg:col-start-6 lg:col-span-7 lg:row-start-1">
					<h1 className="lines text-head">
						<span className="line">
							<span data-line>{t("index.title")}</span>
						</span>
					</h1>
					<p className="mt-8 max-w-[44ch] text-lead leading-[1.25]" data-load>
						{t("index.lead")}
					</p>
				</div>
				<div
					className="col-span-12 max-w-[32ch] [--d:480ms] lg:col-span-4 lg:row-start-1 lg:mb-[0.3em]"
					data-load
				>
					<p className="font-medium">{t("index.summary", { count: total })}</p>
					<p className="mt-3">
						<a href={INVITE_URL} rel="noopener" className="link">
							{t("index.suggest")}
						</a>
					</p>
				</div>
			</div>

			<ul className="frame mt-16 gap-y-gutter md:mt-20">
				{resourceKinds.map((kind, index) => (
					<li
						key={kind.id}
						className="col-span-12 md:col-span-6"
						style={stagger(index)}
						data-reveal
					>
						<ResourceKindTile
							kind={kind}
							count={counts[kind.id]}
							eager={index < 4}
						/>
					</li>
				))}
			</ul>
		</article>
	);
}
