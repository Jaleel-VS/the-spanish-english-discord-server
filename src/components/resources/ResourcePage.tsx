import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { photoCredits } from "@/lib/credits";
import { findResourceKind, type ResourceKind } from "@/lib/resource-kinds";

/**
 * Shared frame of each resource kind's page: its picture left of the axis,
 * then its title, lead and filters on the axis.
 */
export function ResourcePage({
	kind,
	lead,
	filters,
	children,
}: {
	kind: ResourceKind;
	lead: string;
	filters?: ReactNode;
	children: ReactNode;
}) {
	const { t } = useTranslation("resources");
	const image = findResourceKind(kind)?.image;
	const credit = photoCredits.find((photo) => photo.slug === image);

	return (
		<article className="pb-section">
			<div className="frame pt-[10vh] md:pt-[14vh]">
				<figure className="col-span-8 mb-12 lg:col-span-4 lg:row-span-3 lg:mb-0">
					<div className="aspect-[4/3] overflow-clip bg-surface" data-load>
						<img
							src={`/images/${image}.jpg`}
							alt={t(`kinds.${kind}.imageAlt`)}
							width={credit?.width}
							height={credit?.height}
							fetchPriority="high"
							className="h-full w-full object-cover grayscale contrast-[1.05]"
						/>
					</div>
				</figure>
				<h1 className="lines col-span-12 text-head lg:col-start-6 lg:col-span-7">
					<span className="line">
						<span data-line>{t(`kinds.${kind}.title`)}</span>
					</span>
				</h1>
				<p
					className="col-span-12 mt-8 max-w-[44ch] text-lead leading-[1.25] lg:col-start-6 lg:col-span-7"
					data-load
				>
					{lead}
				</p>
				{filters && (
					<div
						className="col-span-12 mt-14 flex flex-col gap-3 [--d:560ms] lg:col-start-6 lg:col-span-7"
						data-load
					>
						{filters}
					</div>
				)}
			</div>
			<div className="frame mt-16 md:mt-20">{children}</div>
			<p className="frame mt-20">
				<Link
					to="/resources"
					className="link col-span-12 lg:col-start-6 lg:col-span-7"
				>
					{t("back")}
				</Link>
			</p>
		</article>
	);
}
