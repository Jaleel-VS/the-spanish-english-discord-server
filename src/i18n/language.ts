import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import {
	isLanguage,
	LANGUAGE_COOKIE,
	type Language,
	pickFromAcceptLanguage,
	readLanguageCookie,
} from "./index";

/**
 * The visitor's language. Server: the cookie they chose, else their browser's
 * Accept-Language, else English. Browser: the cookie, else whatever the server
 * rendered into <html lang>, so a first visit keeps its detected language.
 */
export const resolveLanguage = createIsomorphicFn()
	.server(
		(): Language =>
			readLanguageCookie(getRequestHeader("cookie")) ??
			pickFromAcceptLanguage(getRequestHeader("accept-language")) ??
			"en",
	)
	.client((): Language => {
		const rendered = document.documentElement.lang;
		return (
			readLanguageCookie(document.cookie) ??
			(isLanguage(rendered) ? rendered : "en")
		);
	});

export function persistLanguage(language: Language) {
	// biome-ignore lint/suspicious/noDocumentCookie: one first-party preference cookie; the Cookie Store API is not in Safari < 18.4.
	document.cookie = `${LANGUAGE_COOKIE}=${language}; path=/; max-age=31536000; samesite=lax`;
}
