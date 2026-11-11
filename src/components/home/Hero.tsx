import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PixelSky } from "@/components/PixelSky";
import { FOUNDED_YEAR, INVITE_URL } from "@/lib/site";
import type { Community } from "@/server/community.functions";

/** Remembers on this device that the visitor paused the sky. */
const PAUSED_KEY = "sky-paused";

/**
 * Masthead band with the server's own splash art in a dithered pixel sky of
 * the same blue, then the headline on the 42% axis. Under it the same
 * headline in the other language: the page is a parallel text, and the two
 * halves of the exchange read side by side.
 */
export function Hero({ community }: { community: Community | null }) {
	const { t, i18n } = useTranslation(["home", "common"]);
	const other = i18n.language === "es" ? "en" : "es";
	const tOther = i18n.getFixedT(other, "home");
	const format = (value: number) => value.toLocaleString(i18n.language);
	const [paused, setPaused] = useState(false);
	// False until the sky has started; the button only shows when it can move.
	const [animates, setAnimates] = useState(false);

	useEffect(() => {
		setPaused(localStorage.getItem(PAUSED_KEY) === "1");
	}, []);
	const toggle = () => {
		const next = !paused;
		setPaused(next);
		if (next) localStorage.setItem(PAUSED_KEY, "1");
		else localStorage.removeItem(PAUSED_KEY);
	};

	return (
		<section aria-labelledby="hero-title">
			<PixelSky
				paused={paused}
				onAnimates={setAnimates}
				className="absolute inset-x-0 top-0 -z-10 h-[60svh] lg:h-[82svh]"
			/>
			{/*
			 * The server's own artwork with its sky and clouds cut away, so the shop
			 * stands in the pixel sky, centred and sized by height. The artist's
			 * signature sits beside it as a separate layer so it stays readable on
			 * the night sky.
			 */}
			<figure className="relative mx-margin">
				<div
					className="relative mx-auto aspect-[1156/1114] h-[min(52svh,64vw)]"
					data-load
				>
					<img
						src="/images/splash-cutout.webp"
						alt={t("hero.imageAlt")}
						width={1156}
						height={1114}
						fetchPriority="high"
						className="block size-full"
					/>
					<img
						src="/images/splash-signature.png"
						alt=""
						width={64}
						height={36}
						className="absolute right-0 bottom-0 w-[5.5%] dark:invert"
					/>
				</div>
				{animates && (
					<button
						type="button"
						onClick={toggle}
						className="mt-3 ml-auto flex items-center gap-2 text-small text-muted transition-colors duration-150 hover:text-ink lg:absolute lg:right-0 lg:bottom-0 lg:mt-0"
					>
						<svg
							aria-hidden="true"
							viewBox="0 0 10 10"
							className="size-2.5"
							fill="currentColor"
						>
							{paused ? (
								<path d="M2 1h2v8H2zM4 2h2v6H4zM6 3h2v4H6zM8 4h1v2H8z" />
							) : (
								<path d="M2 1h2v8H2zM6 1h2v8H6z" />
							)}
						</svg>
						{paused ? t("hero.skyPlay") : t("hero.skyPause")}
					</button>
				)}
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
