import type { Language } from "@/i18n";

/** The two Markdown collections: how-tos about the server, and one page per bot. */
export const collections = ["guides", "bots"] as const;
export type Collection = (typeof collections)[number];

/** Front matter of a guide or bot page, plus which language the file was found in. */
export interface DocumentSummary {
	slug: string;
	/** The language the text is in; may differ from the visitor's when only one translation exists. */
	language: Language;
	title: string;
	summary: string;
	order: number;
	/** ISO date string, or null when the file does not say. */
	updated: string | null;
	prefix?: string;
	repository?: string;
}

export interface Document extends DocumentSummary {
	/** Rendered Markdown. Written by maintainers, so it is trusted HTML. */
	html: string;
}
