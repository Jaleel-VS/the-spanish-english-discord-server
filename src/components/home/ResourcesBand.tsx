import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ResourceKindTile } from "@/components/resources/ResourceKindTile";
import type { CatalogueCounts } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import { resourceKinds } from "@/lib/resource-kinds";

/** A full-bleed ink page: the claim on the left, every resource kind as a tile on the axis. */
export function ResourcesBand({ counts }: { counts: CatalogueCounts }) {
	const { t } = useTranslation("home");

	return (
		<section
			aria-labelledby="resources-title"
			className="bg-inverse py-band text-inverse-ink"
		>
			<div className="frame gap-y-12">
				<div className="col-span-12 lg:col-span-4">
					<h2 id="resources-title" className="text-head" data-reveal>
						{t("resources.title")}
					</h2>
					<p className="mt-8 max-w-[34ch]" data-reveal style={stagger(1)}>
						{t("resources.body")}
					</p>
					<p className="mt-6" data-reveal style={stagger(2)}>
						<Link to="/resources" className="link">
							{t("resources.all")}
						</Link>
					</p>
				</div>
				<ul className="col-span-12 grid gap-gutter sm:grid-cols-2 lg:col-start-6 lg:col-span-7">
					{resourceKinds.map((kind, index) => (
						<li key={kind.id} data-reveal style={stagger(index + 2)}>
							<ResourceKindTile
								kind={kind}
								count={counts[kind.id]}
								tone="ink"
							/>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
