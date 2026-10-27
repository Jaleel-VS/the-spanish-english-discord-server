import {
	createRootRoute,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouter,
} from "@tanstack/react-router";
import { type ReactNode, useEffect, useMemo } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { createI18n, resources } from "@/i18n";
import { resolveLanguage } from "@/i18n/language";
import { getCommunity } from "@/server/community.functions";
import appCss from "@/styles.css?url";

const SITE_URL = "https://the-spanish-english-discord-server.vercel.app";

export const Route = createRootRoute({
	beforeLoad: () => ({ language: resolveLanguage() }),
	loader: () => getCommunity(),
	staleTime: 5 * 60 * 1000,
	head: ({ match, loaderData }) => {
		const copy = resources[match.context.language].common.meta;
		const description = loaderData
			? copy.description.replace(
					"{{members}}",
					loaderData.members.toLocaleString(match.context.language),
				)
			: copy.descriptionNoCount;
		return {
			meta: [
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ title: copy.title },
				{ name: "description", content: description },
				{ name: "theme-color", content: "#0f1e3d" },
				{ property: "og:type", content: "website" },
				{ property: "og:url", content: `${SITE_URL}/` },
				{ property: "og:title", content: copy.title },
				{ property: "og:description", content: description },
				{ property: "og:image", content: `${SITE_URL}/images/splash.jpg` },
				{ name: "twitter:card", content: "summary_large_image" },
			],
			links: [
				{ rel: "stylesheet", href: appCss },
				{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
			],
		};
	},
	shellComponent: RootDocument,
	component: RootLayout,
	notFoundComponent: NotFound,
	errorComponent: RootError,
});

function RootDocument({ children }: { children: ReactNode }) {
	const { language } = Route.useRouteContext();
	const i18n = useMemo(() => createI18n(language), [language]);

	return (
		<html lang={language} suppressHydrationWarning>
			<head>
				{/* Gates entrance animations, so content stays visible without JavaScript. */}
				<script>document.documentElement.classList.add("js")</script>
				<HeadContent />
			</head>
			<body>
				<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
				<Scripts />
			</body>
		</html>
	);
}

function RootLayout() {
	const { t } = useTranslation();
	useRevealOnScroll();

	return (
		<>
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:fixed focus:left-margin focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-3 focus:text-accent-ink"
			>
				{t("nav.skip")}
			</a>
			<SiteHeader />
			<main id="main">
				<Outlet />
			</main>
			<SiteFooter />
		</>
	);
}

/** Adds `is-in` once to each `[data-reveal]` element as it scrolls into view. */
function useRevealOnScroll() {
	const router = useRouter();
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add("is-in");
					observer.unobserve(entry.target);
				}
			},
			{ rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
		);
		const observeNew = () => {
			for (const element of document.querySelectorAll(
				"[data-reveal]:not(.is-in)",
			)) {
				observer.observe(element);
			}
		};
		observeNew();
		const unsubscribe = router.subscribe("onRendered", observeNew);
		return () => {
			unsubscribe();
			observer.disconnect();
		};
	}, [router]);
}

function NotFound() {
	const { t } = useTranslation();
	return (
		<section className="frame pt-[28vh] pb-section">
			<h1 className="col-span-12 text-head lg:col-start-6 lg:col-span-7">
				{t("notFound.title")}
			</h1>
			<p className="col-span-12 mt-8 lg:col-start-6 lg:col-span-5">
				{t("notFound.body")}
			</p>
			<p className="col-span-12 mt-6 lg:col-start-6 lg:col-span-5">
				<Link to="/" className="link">
					{t("notFound.home")}
				</Link>
			</p>
		</section>
	);
}

function RootError({ reset }: { reset: () => void }) {
	const { t } = useTranslation();
	const router = useRouter();
	return (
		<section className="frame pt-[28vh] pb-section">
			<h1 className="col-span-12 text-head lg:col-start-6 lg:col-span-7">
				{t("error.title")}
			</h1>
			<p className="col-span-12 mt-8 lg:col-start-6 lg:col-span-5">
				{t("error.body")}
			</p>
			<p className="col-span-12 mt-6 lg:col-start-6 lg:col-span-5">
				<button
					type="button"
					className="button"
					onClick={() => {
						reset();
						router.invalidate();
					}}
				>
					{t("error.retry")}
				</button>
			</p>
		</section>
	);
}
