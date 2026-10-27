import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { CatalogueCounts } from "@/lib/catalog";
import { photoCredits } from "@/lib/credits";
import { stagger } from "@/lib/motion";
import { resourceKinds } from "@/lib/resource-kinds";

/**
 * A full-bleed ink page: the claim on the left, every resource kind on the
 * axis with its picture, and the way through to the resources page.
 */
export function ResourcesBand({ counts }: { counts: CatalogueCounts }) {
	const { t } = useTranslation(["home", "resources"]);

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
				<ul className="col-span-12 grid gap-x-gutter gap-y-12 sm:grid-cols-2 lg:col-start-6 lg:col-span-7">
					{resourceKinds.map((kind, index) => {
						const credit = photoCredits.find(
							(photo) => photo.slug === kind.image,
						);
						return (
							<li key={kind.id} data-reveal style={stagger(index + 2)}>
								<Link to={kind.to} className="group block">
									<span className="block aspect-[4/3] overflow-clip">
										<img
											src={`/images/${kind.image}.jpg`}
											alt={t(`resources:kinds.${kind.id}.imageAlt`)}
											width={credit?.width}
											height={credit?.height}
											loading="lazy"
											className="h-full w-full object-cover grayscale contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
										/>
									</span>
									<span className="mt-5 block text-head group-hover:underline">
										{t(`resources:kinds.${kind.id}.title`)}
									</span>
									<span className="mt-2 flex items-baseline gap-2">
										{t(`resources:kinds.${kind.id}.count`, {
											count: counts[kind.id],
										})}
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
			</div>
		</section>
	);
}
