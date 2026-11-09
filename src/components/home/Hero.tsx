import { useTranslation } from "react-i18next";
import { FOUNDED_YEAR, INVITE_URL } from "@/lib/site";
import type { Community } from "@/server/community.functions";

/**
 * Masthead band with the server's own splash art, then the headline on the
 * 42% axis. Under it the same headline in the other language: the page is a
 * parallel text, and the two halves of the exchange read side by side.
 */
export function Hero({ community }: { community: Community | null }) {
	const { t, i18n } = useTranslation(["home", "common"]);
	const other = i18n.language === "es" ? "en" : "es";
	const tOther = i18n.getFixedT(other, "home");
	const format = (value: number) => value.toLocaleString(i18n.language);

	return (
		<section aria-labelledby="hero-title">
			{/* The server's own artwork, shown whole: full width on phones, height-capped and centred on wide screens. */}
			<figure className="mx-margin">
				<img
					src="/images/splash.jpg"
					alt={t("hero.imageAlt")}
					width={2048}
					height={1152}
					fetchPriority="high"
					className="mx-auto block aspect-video w-full bg-[#8ec8f6] object-contain lg:h-[52svh] lg:w-auto"
					data-load
				/>
			</figure>

			<div className="frame items-end pt-10 pb-[72px] md:pt-14 lg:pb-12">
				<div className="col-span-12 lg:col-start-6 lg:col-span-7 lg:row-start-1">
					<h1 id="hero-title" className="lines text-[12.5vw] md:text-display">
						<span className="line">
							<span data-line className="[--i:0]">
								{t("hero.line1")}
							</span>
						</span>
						<span className="line">
							<span data-line className="[--i:1]">
								{t("hero.line2")}
							</span>
						</span>
					</h1>
					<p lang={other} className="mt-4 text-lead text-muted" data-load>
						{tOther("hero.line1")} {tOther("hero.line2")}
					</p>
				</div>

				<div
					className="col-span-12 mt-8 max-w-[32ch] [--d:480ms] lg:col-span-4 lg:row-start-1 lg:mt-0 lg:mb-[0.35em]"
					data-load
				>
					<p>{t("hero.sentence", { year: FOUNDED_YEAR })}</p>
					{community && (
						<p className="mt-3 font-medium">
							{t("hero.members", { members: format(community.members) })}
							{" · "}
							{t("hero.online", { online: format(community.online) })}
						</p>
					)}
					<a href={INVITE_URL} className="button mt-6 lg:hidden" rel="noopener">
						{t("common:nav.join")}
						<span className="arrow" aria-hidden="true">
							→
						</span>
					</a>
				</div>
			</div>
		</section>
	);
}
