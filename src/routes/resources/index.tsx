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

			<ul className="mt-20 md:mt-28">
				{resourceKinds.map((kind, index) => {
					const credit = photoCredits.find(
						(photo) => photo.slug === kind.image,
					);
					return (
						<li
							key={kind.id}
							className={index % 2 === 0 ? "bg-surface" : "bg-ground"}
						>
							<Link
								to={kind.to}
								className="group frame items-end gap-y-6 py-12 md:py-16"
							>
								<span
									className="col-span-12 aspect-[4/3] overflow-clip sm:col-span-8 md:col-span-5 lg:col-span-4"
									data-reveal
								>
									<img
										src={`/images/${kind.image}.jpg`}
										alt={t(`kinds.${kind.id}.imageAlt`)}
										width={credit?.width}
										height={credit?.height}
										loading={index < 2 ? undefined : "lazy"}
										className="h-full w-full object-cover grayscale contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
									/>
								</span>
								<span
									className="col-span-12 md:col-start-7 md:col-span-6 lg:col-start-6 lg:col-span-5"
									style={stagger(1)}
									data-reveal
								>
									<span className="block text-head group-hover:underline">
										{t(`kinds.${kind.id}.title`)}
									</span>
									<span className="mt-4 block max-w-[44ch]">
										{t(`kinds.${kind.id}.body`)}
									</span>
								</span>
								<span
									className="col-span-12 flex items-baseline gap-2 font-medium lg:col-span-2 lg:justify-end"
									style={stagger(2)}
									data-reveal
								>
									{t(`kinds.${kind.id}.count`, { count: counts[kind.id] })}
									<span
										aria-hidden="true"
										className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
									>
										→
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
