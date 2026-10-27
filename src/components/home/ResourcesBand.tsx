import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { CatalogueCounts } from "@/lib/catalog";
import { photoCredits } from "@/lib/credits";
import { stagger } from "@/lib/motion";
import { INVITE_URL } from "@/lib/site";

/**
 * The catalogue hub: a full-bleed ink page with the claim on the left and the
 * two catalogues on the axis, each with its picture.
 */
export function ResourcesBand({ counts }: { counts: CatalogueCounts }) {
	const { t } = useTranslation(["home", "resources"]);

	const entries = [
		{
			to: "/resources/podcasts",
			title: t("resources.podcasts"),
			count: t("resources.podcastsCount", { count: counts.podcasts }),
			image: "radio",
			alt: t("resources:podcasts.imageAlt"),
		},
		{
			to: "/resources/movies",
			title: t("resources.movies"),
			count: t("resources.moviesCount", { count: counts.movies }),
			image: "cinema",
			alt: t("resources:movies.imageAlt"),
		},
	] as const;

	return (
		<section
			id="resources"
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
					<p className="mt-6 max-w-[34ch]" data-reveal style={stagger(2)}>
						<a href={INVITE_URL} rel="noopener" className="link">
							{t("resources.suggest")}
						</a>
					</p>
				</div>
				<ul className="col-span-12 grid gap-gutter sm:grid-cols-2 lg:col-start-6 lg:col-span-7">
					{entries.map((entry, index) => {
						const credit = photoCredits.find(
							(photo) => photo.slug === entry.image,
						);
						return (
							<li key={entry.to} data-reveal style={stagger(index + 2)}>
								<Link to={entry.to} className="group block">
									<span className="block aspect-[4/3] overflow-clip">
										<img
											src={`/images/${entry.image}.jpg`}
											alt={entry.alt}
											width={credit?.width}
											height={credit?.height}
											loading="lazy"
											className="h-full w-full object-cover grayscale contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
										/>
									</span>
									<span className="mt-5 block text-head group-hover:underline">
										{entry.title}
									</span>
									<span className="mt-2 flex items-baseline gap-2">
										{entry.count}
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
