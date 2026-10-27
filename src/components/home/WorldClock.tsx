import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { stagger } from "@/lib/motion";

const cities = [
	{ key: "madrid", zone: "Europe/Madrid", language: "spanish" },
	{ key: "mexicoCity", zone: "America/Mexico_City", language: "spanish" },
	{ key: "bogota", zone: "America/Bogota", language: "spanish" },
	{
		key: "buenosAires",
		zone: "America/Argentina/Buenos_Aires",
		language: "spanish",
	},
	{ key: "london", zone: "Europe/London", language: "english" },
	{ key: "newYork", zone: "America/New_York", language: "english" },
	{ key: "losAngeles", zone: "America/Los_Angeles", language: "english" },
	{ key: "sydney", zone: "Australia/Sydney", language: "english" },
] as const;

/** Current time, re-read at the top of every minute. */
function useNow() {
	const [now, setNow] = useState(() => new Date());
	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | undefined;
		const tick = () => setNow(new Date());
		const timeout = setTimeout(
			() => {
				tick();
				interval = setInterval(tick, 60_000);
			},
			60_000 - (Date.now() % 60_000),
		);
		tick();
		return () => {
			clearTimeout(timeout);
			clearInterval(interval);
		};
	}, []);
	return now;
}

/**
 * The live thing on the page: the local time in eight member cities, rendered
 * on the server for the moment of the request and kept current in the browser.
 */
export function WorldClock({ online }: { online: number | undefined }) {
	const { t, i18n } = useTranslation("home");
	const now = useNow();

	return (
		<section aria-labelledby="clock-title" className="frame pt-section">
			<h2
				id="clock-title"
				className="col-span-12 text-head lg:pl-[3vw]"
				data-reveal
			>
				{t("clock.title")}
			</h2>

			<figure className="order-last col-span-8 col-start-5 mt-16 lg:order-none lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:mt-24 lg:self-end">
				<div className="aspect-[4/5] overflow-clip bg-surface">
					<img
						src="/images/puerta-del-sol.jpg"
						alt={t("clock.imageAlt")}
						width={1040}
						height={1300}
						loading="lazy"
						className="h-full w-full object-cover grayscale contrast-[1.05]"
					/>
				</div>
			</figure>

			<p
				aria-hidden="true"
				className="hidden text-small text-muted lg:col-start-7 lg:row-start-2 lg:mt-24 lg:block"
			>
				{t("clock.label")}
			</p>

			<div className="col-span-12 mt-12 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:mt-24">
				<table className="w-full border-collapse text-body">
					<caption className="sr-only">{t("clock.label")}</caption>
					<tbody>
						{cities.map((city, index) => (
							<tr
								key={city.key}
								className={
									index === 4
										? "[&>*]:pt-11"
										: "[&>*]:pt-[26px] first:[&>*]:pt-0"
								}
								style={stagger(index % 4)}
								data-reveal
							>
								<td className="text-muted">{t(`clock.${city.language}`)}</td>
								<th scope="row" className="text-left font-medium">
									{t(`clock.cities.${city.key}`)}
								</th>
								<td className="text-right tabular-nums">
									<time suppressHydrationWarning>
										{now.toLocaleTimeString(i18n.language, {
											hour: "2-digit",
											minute: "2-digit",
											timeZone: city.zone,
										})}
									</time>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<p className="mt-12 max-w-[34ch] text-lead leading-[1.25]" data-reveal>
					{online
						? t("clock.online", {
								online: online.toLocaleString(i18n.language),
							})
						: t("clock.onlineUnknown")}
				</p>
			</div>
		</section>
	);
}
