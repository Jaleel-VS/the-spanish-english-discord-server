import { useTranslation } from "react-i18next";
import { type Resource, regionOf } from "@/lib/catalog";

/**
 * One entry as a row: picture, title (the link; the whole row is its hit area),
 * creator, one line of description, then tags. `striped` rows sit on the
 * surface colour, so their light tags use the page colour and vice versa.
 */
export function ResourceRow({
	item,
	language,
	striped,
}: {
	item: Resource;
	language: "en" | "es";
	striped: boolean;
}) {
	const { t } = useTranslation("resources");
	const region = regionOf(item.country);
	const place =
		region !== "other"
			? t(`region.${region}`)
			: item.country
				? new Intl.DisplayNames([language], { type: "region" }).of(item.country)
				: null;
	const strong = [
		t(`language.${item.language}`),
		item.level ? t(`level.${item.level}`) : null,
	];
	const light = [
		item.genre ? t(`genre.${item.genre}`) : null,
		item.releaseYear ? String(item.releaseYear) : null,
		place,
		...item.topics.map((topic) => t(`topic.${topic}`)),
		item.audience ? t(`audience.${item.audience}`) : null,
	];
	const round = item.kind === "youtube" || item.kind === "musicians";

	return (
		<div
			className={`group relative grid grid-cols-[3.5rem_1fr] items-start gap-x-4 gap-y-2 px-4 py-4 md:grid-cols-[3.5rem_minmax(0,19rem)_1fr] md:items-center md:gap-x-6 ${striped ? "bg-surface" : ""}`}
		>
			{item.imageUrl ? (
				<img
					src={item.imageUrl}
					alt=""
					width={56}
					height={56}
					loading="lazy"
					decoding="async"
					referrerPolicy="no-referrer"
					className={`row-span-2 size-14 bg-surface object-cover ${round ? "rounded-full" : ""}`}
				/>
			) : (
				<span
					aria-hidden="true"
					className={`row-span-2 flex size-14 items-center justify-center bg-ink font-semibold text-ground ${round ? "rounded-full" : ""}`}
				>
					{initials(item.title)}
				</span>
			)}
			<span className="md:row-span-2">
				<a
					href={item.url}
					target="_blank"
					rel="noopener noreferrer"
					lang={item.language === "both" ? undefined : item.language}
					className="text-lead font-semibold leading-tight tracking-[-0.02em] after:absolute after:inset-0 group-hover:underline"
				>
					{item.title}&nbsp;
					<span aria-hidden="true" className="text-body text-muted">
						↗
					</span>
					<span className="sr-only"> ({t("opens")})</span>
				</a>
				{item.creator && (
					<span className="mt-1 block text-small text-muted">
						{item.creator}
					</span>
				)}
			</span>
			<span className="col-start-2 text-muted md:col-start-3">
				{item.description[language]}
			</span>
			<span className="col-span-2 flex flex-wrap gap-1.5 text-small md:col-span-1 md:col-start-3">
				{strong.filter(Boolean).map((tag) => (
					<span key={tag} className="bg-ink px-2 py-0.5 text-ground">
						{tag}
					</span>
				))}
				{light.filter(Boolean).map((tag) => (
					<span
						key={tag}
						className={`px-2 py-0.5 ${striped ? "bg-ground" : "bg-surface"}`}
					>
						{tag}
					</span>
				))}
			</span>
		</div>
	);
}

function initials(title: string): string {
	const words = title.split(/\s+/).filter((word) => /^\p{L}/u.test(word));
	return words
		.slice(0, 2)
		.map((word) => word[0].toUpperCase())
		.join("");
}
