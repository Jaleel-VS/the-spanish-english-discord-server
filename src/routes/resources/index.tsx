import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { resources } from "@/i18n";
import { photoCredits } from "@/lib/credits";
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
				{resourceKinds.map((kind, index) => {
					const credit = photoCredits.find(
						(photo) => photo.slug === kind.image,
					);
					return (
						<li
							key={kind.id}
							className="col-span-12 md:col-span-6"
							style={stagger(index)}
							data-reveal
						>
							<Link
								to={kind.to}
								className="group flex h-full items-center gap-5 bg-surface p-4 transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--surface)_85%,var(--ink))] md:gap-6 md:p-5"
							>
								<span className="aspect-[4/3] w-28 shrink-0 overflow-clip md:w-40">
									<img
										src={`/images/${kind.image}.jpg`}
										alt={t(`kinds.${kind.id}.imageAlt`)}
										width={credit?.width}
										height={credit?.height}
										loading={index < 4 ? undefined : "lazy"}
										className="h-full w-full object-cover grayscale contrast-[1.05]"
									/>
								</span>
								<span className="flex min-w-0 flex-1 flex-col gap-1">
									<span className="flex flex-wrap items-baseline justify-between gap-x-4">
										<span className="text-lead font-semibold tracking-[-0.02em] group-hover:underline">
											{t(`kinds.${kind.id}.title`)}
										</span>
										<span className="flex items-baseline gap-2 whitespace-nowrap font-medium">
											{t(`kinds.${kind.id}.count`, { count: counts[kind.id] })}
											<span
												aria-hidden="true"
												className="inline-block transition-transform duration-300 group-hover:translate-x-1"
											>
												→
											</span>
										</span>
									</span>
									<span className="text-muted">
										{t(`kinds.${kind.id}.body`)}
									</span>
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</article>
	);
}
