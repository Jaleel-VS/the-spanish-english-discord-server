import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { photoCredits } from "@/lib/credits";
import type { ResourceKindConfig } from "@/lib/resource-kinds";

/**
 * One resource kind as a compact tile: a small picture, the title with its
 * count, and a one-line description. The whole tile is the link.
 * `tone` picks the surface for the page it sits on.
 */
export function ResourceKindTile({
	kind,
	count,
	tone = "paper",
	eager = false,
}: {
	kind: ResourceKindConfig;
	count: number;
	tone?: "paper" | "ink";
	eager?: boolean;
}) {
	const { t } = useTranslation("resources");
	const credit = photoCredits.find((photo) => photo.slug === kind.image);

	return (
		<Link
			to="/resources/$kind"
			params={{ kind: kind.id }}
			className={`group flex h-full items-center gap-5 p-4 transition-colors duration-200 md:gap-6 md:p-5 ${
				tone === "ink"
					? "bg-[color-mix(in_oklab,var(--inverse-ink)_8%,transparent)] hover:bg-[color-mix(in_oklab,var(--inverse-ink)_14%,transparent)]"
					: "bg-surface hover:bg-[color-mix(in_oklab,var(--surface)_85%,var(--ink))]"
			}`}
		>
			<span className="aspect-[4/3] w-28 shrink-0 overflow-clip md:w-36">
				<img
					src={`/images/${kind.image}.jpg`}
					alt={t(`kinds.${kind.id}.imageAlt`)}
					width={credit?.width}
					height={credit?.height}
					loading={eager ? undefined : "lazy"}
					className="h-full w-full object-cover grayscale contrast-[1.05]"
				/>
			</span>
			<span className="flex min-w-0 flex-1 flex-col gap-1">
				<span className="flex flex-wrap items-baseline justify-between gap-x-4">
					<span className="text-lead font-semibold tracking-[-0.02em] group-hover:underline">
						{t(`kinds.${kind.id}.title`)}
					</span>
					<span
						className={`flex items-baseline gap-2 whitespace-nowrap ${count === 0 ? (tone === "ink" ? "text-inverse-muted" : "text-muted") : "font-medium"}`}
					>
						{count === 0
							? t("noneYet")
							: t(`kinds.${kind.id}.count`, { count })}
						<span
							aria-hidden="true"
							className="inline-block transition-transform duration-300 group-hover:translate-x-1"
						>
							→
						</span>
					</span>
				</span>
				<span className={tone === "ink" ? "text-inverse-muted" : "text-muted"}>
					{t(`kinds.${kind.id}.body`)}
				</span>
			</span>
		</Link>
	);
}
