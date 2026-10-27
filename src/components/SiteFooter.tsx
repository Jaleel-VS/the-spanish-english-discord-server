import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { photoCredits } from "@/lib/credits";
import { resourceKinds } from "@/lib/resource-kinds";
import { FOUNDED_YEAR, INVITE_URL, REPOSITORY_URL } from "@/lib/site";
import { LanguageSwitch } from "./LanguageSwitch";

/** Inverted close: four short columns on top, the name across the full width below. */
export function SiteFooter() {
	const { t } = useTranslation(["common", "resources"]);
	const year = new Date().getFullYear();

	return (
		<footer className="grid min-h-[72svh] grid-rows-[auto_1fr_auto] bg-inverse pt-10 pb-6 text-inverse-ink">
			<div className="frame gap-y-10 text-small leading-[1.5]">
				<FooterColumn title={t("footer.server")}>
					<a href={INVITE_URL} className="link" rel="noopener">
						discord.gg/spanish-english
					</a>
					<span>{t("footer.since", { year: FOUNDED_YEAR })}</span>
				</FooterColumn>
				<FooterColumn title={t("footer.pages")}>
					<Link to="/" className="link">
						{t("nav.home")}
					</Link>
					<Link to="/resources" className="link">
						{t("nav.resources")}
					</Link>
					{resourceKinds.map((kind) => (
						<Link key={kind.id} to={kind.to} className="link">
							{t(`resources:kinds.${kind.id}.title`)}
						</Link>
					))}
				</FooterColumn>
				<FooterColumn title={t("footer.language")}>
					<LanguageSwitch className="self-start" />
					<a href={REPOSITORY_URL} className="link" rel="noopener">
						{t("footer.source")}
					</a>
				</FooterColumn>
				<FooterColumn title={t("footer.credits")}>
					<span>{t("footer.illustration")}</span>
					{photoCredits.map((credit) => (
						<span key={credit.slug}>
							<a
								href={credit.sourceUrl}
								className="link"
								rel="noopener"
								title={credit.title}
							>
								{credit.place}
							</a>
							: {credit.creator},{" "}
							<a
								href={credit.licenceUrl}
								className="link"
								rel="noopener license"
							>
								{credit.licence}
							</a>
						</span>
					))}
				</FooterColumn>
			</div>

			<div aria-hidden="true" />

			<div className="px-margin">
				<svg
					viewBox="0 0 1000 150"
					className="block w-full fill-current"
					role="img"
					aria-label={t("footer.wordmark")}
				>
					<text
						x="0"
						y="122"
						fontSize="148"
						fontWeight="600"
						textLength="1000"
						lengthAdjust="spacingAndGlyphs"
					>
						{t("footer.wordmark")}
					</text>
				</svg>
				<p className="mt-5 text-small text-inverse-muted">
					{t("footer.legal", { year })}
				</p>
			</div>
		</footer>
	);
}

function FooterColumn({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="col-span-6 flex flex-col gap-1.5 text-inverse-muted md:col-span-3">
			<h2 className="mb-1 text-small font-semibold tracking-normal text-inverse-ink">
				{title}
			</h2>
			{children}
		</div>
	);
}
