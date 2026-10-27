import { useTranslation } from "react-i18next";
import { photoCredits } from "@/lib/credits";
import { stagger } from "@/lib/motion";
import { INVITE_URL } from "@/lib/site";
import type { Community } from "@/server/community.functions";

const strip = [
	{ slug: "mexico-city", alt: "cta.photos.one" },
	{ slug: "london", alt: "cta.photos.two" },
	{ slug: "buenos-aires", alt: "cta.photos.three" },
] as const;

/** Three cities butted edge to edge, then the closing statement on the accent field. */
export function Closing({ community }: { community: Community | null }) {
	const { t, i18n } = useTranslation("home");

	return (
		<section aria-labelledby="closing-title" className="mt-section">
			<div className="grid grid-cols-2 md:grid-cols-3">
				{strip.map((photo, index) => {
					const size = photoCredits.find(
						(credit) => credit.slug === photo.slug,
					);
					return (
						<div
							key={photo.slug}
							className={`overflow-clip bg-surface ${index === 0 ? "col-span-2 aspect-[4/3] md:col-span-1 md:aspect-auto" : "aspect-[4/3] md:aspect-auto"} md:h-[40svh]`}
						>
							<img
								src={`/images/${photo.slug}.jpg`}
								alt={t(photo.alt)}
								width={size?.width}
								height={size?.height}
								loading="lazy"
								className="h-full w-full object-cover object-[50%_35%] grayscale contrast-[1.05]"
							/>
						</div>
					);
				})}
			</div>

			<div className="frame relative bg-accent pt-16 pb-14 text-accent-ink lg:min-h-[44svh] lg:pb-16">
				<div className="col-span-12 lg:col-span-7">
					<h2 id="closing-title" className="text-head" data-reveal>
						{t("cta.title")}
					</h2>
					<p
						className="mt-8 max-w-[36ch] text-lead leading-[1.25]"
						data-reveal
						style={stagger(1)}
					>
						{community
							? t("cta.before", {
									members: community.members.toLocaleString(i18n.language),
								})
							: t("cta.beforeNoCount")}
						<a
							href={INVITE_URL}
							rel="noopener"
							className="underline decoration-4 underline-offset-[6px] transition-[text-underline-offset] duration-200 hover:underline-offset-[10px]"
						>
							{t("cta.link")}
						</a>
						{t("cta.after")}
					</p>
					<p className="mt-6" data-reveal style={stagger(2)}>
						{t("cta.small")}
					</p>
				</div>
				{community?.iconUrl && (
					<img
						src={community.iconUrl}
						alt={t("cta.iconAlt")}
						width={128}
						height={128}
						loading="lazy"
						className="col-span-12 mt-10 w-24 justify-self-end lg:absolute lg:right-margin lg:bottom-10 lg:mt-0 lg:w-32"
					/>
				)}
			</div>
		</section>
	);
}
