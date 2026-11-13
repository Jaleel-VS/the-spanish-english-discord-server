import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { INVITE_URL } from "@/lib/site";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Wordmark at the left margin, the page links on the 42% axis (column 6),
 * theme, language and the one action at the right margin. On a phone the
 * links fold behind a menu word (<details> keeps that working without
 * JavaScript); the theme toggle stays beside it.
 */
export function SiteHeader() {
	const { t } = useTranslation();

	const links = (
		<>
			<Link
				to="/resources"
				className="link"
				activeProps={{ "aria-current": "page" }}
			>
				{t("nav.resources")}
			</Link>
			<Link
				to="/guides"
				className="link"
				activeProps={{ "aria-current": "page" }}
			>
				{t("nav.guides")}
			</Link>
			<Link
				to="/bots"
				className="link"
				activeProps={{ "aria-current": "page" }}
			>
				{t("nav.bots")}
			</Link>
		</>
	);

	return (
		<header className="frame relative items-center pt-6 pb-6 lg:pt-[44px]">
			<Link
				to="/"
				className="col-span-6 text-body font-semibold tracking-[-0.02em] lg:col-span-5"
			>
				Spanish-English
			</Link>

			<nav
				aria-label={t("nav.main")}
				className="hidden gap-5 lg:col-span-3 lg:col-start-6 lg:flex xl:gap-7"
			>
				{links}
			</nav>

			<div className="hidden items-center justify-end gap-4 lg:col-span-4 lg:col-start-9 lg:flex xl:gap-6">
				<ThemeToggle className="-mx-3" />
				<LanguageSwitch />
				{/* Narrower padding below xl, where the action group shares the row with the links. */}
				<a href={INVITE_URL} className="button lg:max-xl:px-4" rel="noopener">
					{t("nav.join")}
				</a>
			</div>

			<div className="col-span-6 flex items-center justify-end gap-1 lg:hidden">
				<ThemeToggle />
				<details className="group">
					<summary className="flex min-h-11 cursor-pointer list-none items-center font-medium [&::-webkit-details-marker]:hidden">
						<span className="group-open:hidden">{t("nav.menu")}</span>
						<span className="hidden group-open:inline">{t("nav.close")}</span>
					</summary>
					<nav
						aria-label={t("nav.main")}
						className="absolute inset-x-0 z-40 mt-4 hidden flex-col gap-5 bg-surface px-margin py-8 text-lead group-open:flex"
					>
						{links}
						<LanguageSwitch className="self-start" />
						<a href={INVITE_URL} className="button self-start" rel="noopener">
							{t("nav.join")}
						</a>
					</nav>
				</details>
			</div>
		</header>
	);
}
