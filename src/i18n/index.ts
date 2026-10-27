import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "@/locales/en/common.json";
import homeEn from "@/locales/en/home.json";
import resourcesEn from "@/locales/en/resources.json";
import commonEs from "@/locales/es/common.json";
import homeEs from "@/locales/es/home.json";
import resourcesEs from "@/locales/es/resources.json";

export const languages = ["en", "es"] as const;
export type Language = (typeof languages)[number];
export const LANGUAGE_COOKIE = "language";

export const resources = {
	en: { common: commonEn, home: homeEn, resources: resourcesEn },
	es: { common: commonEs, home: homeEs, resources: resourcesEs },
} as const;

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: "common";
		resources: (typeof resources)["en"];
	}
}

export function isLanguage(value: unknown): value is Language {
	return languages.includes(value as Language);
}

/**
 * One instance per render root: per request on the server, so concurrent
 * requests in different languages never share state, and once per language
 * in the browser. All resources are bundled (a few KB), so init is synchronous.
 */
export function createI18n(language: Language): i18n {
	const instance = i18next.createInstance();
	instance.use(initReactI18next).init({
		resources,
		lng: language,
		fallbackLng: "en",
		supportedLngs: languages,
		defaultNS: "common",
		interpolation: { escapeValue: false },
		initAsync: false,
	});
	return instance;
}

/** Highest-weighted supported language in an Accept-Language header. */
export function pickFromAcceptLanguage(
	header: string | undefined,
): Language | undefined {
	if (!header) return undefined;
	const ranked = header
		.split(",")
		.map((part) => {
			const [tag, ...params] = part.trim().split(";");
			const q = params.find((p) => p.trim().startsWith("q="));
			return {
				primary: tag.split("-")[0].toLowerCase(),
				q: q ? Number(q.trim().slice(2)) : 1,
			};
		})
		.filter((entry) => entry.q > 0)
		.sort((a, b) => b.q - a.q);
	return ranked.find((entry) => isLanguage(entry.primary))?.primary as
		| Language
		| undefined;
}

export function readLanguageCookie(
	cookieHeader: string | undefined,
): Language | undefined {
	const value = cookieHeader
		?.split(";")
		.map((cookie) => cookie.trim())
		.find((cookie) => cookie.startsWith(`${LANGUAGE_COOKIE}=`))
		?.slice(LANGUAGE_COOKIE.length + 1);
	return isLanguage(value) ? value : undefined;
}
