import { marked } from "marked";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import type { Language } from "@/i18n";
import type { Collection, Document, DocumentSummary } from "@/lib/documents";

/**
 * Markdown documents under content/<collection>/<slug>.<lang>.md, bundled into
 * the server build at compile time (so they exist on Vercel's functions too).
 * The visitor's language is served when it exists, else the other; the page
 * tells the reader when that happens.
 */

const files = import.meta.glob("../../content/*/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

const frontMatterSchema = z.object({
	title: z.string().min(1),
	summary: z.string().min(1),
	/** Sort key within the collection; lower first. Ties break on title. */
	order: z.number().int().default(100),
	updated: z.coerce.date().optional(),
	/** Bots only: the command prefix and where the code lives. */
	prefix: z.string().optional(),
	repository: z.url().optional(),
});

interface Source {
	summary: DocumentSummary;
	body: string;
}

/** Parsed once at startup; a malformed file fails the build/boot loudly rather than a page quietly. */
const documents = new Map<string, Source>();
for (const [path, raw] of Object.entries(files)) {
	const match = /\/content\/(guides|bots)\/([a-z0-9-]+)\.(en|es)\.md$/.exec(
		path,
	);
	if (!match) throw new Error(`Unexpected content file name: ${path}`);
	const [, collection, slug, language] = match;
	const parts = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
	if (!parts) throw new Error(`${path} has no front matter`);
	const meta = frontMatterSchema.parse(parseYaml(parts[1]));
	documents.set(`${collection}/${slug}.${language}`, {
		summary: {
			slug,
			language: language as Language,
			...meta,
			updated: meta.updated?.toISOString() ?? null,
		},
		body: parts[2],
	});
}

function pick(
	collection: Collection,
	slug: string,
	language: Language,
): Source | undefined {
	return (
		documents.get(`${collection}/${slug}.${language}`) ??
		documents.get(`${collection}/${slug}.${language === "en" ? "es" : "en"}`)
	);
}

/** Every document in a collection, in `order`, in the visitor's language where available. */
export function listDocuments(
	collection: Collection,
	language: Language,
): DocumentSummary[] {
	const slugs = new Set(
		[...documents.keys()]
			.filter((key) => key.startsWith(`${collection}/`))
			.map((key) => key.slice(collection.length + 1).replace(/\.(en|es)$/, "")),
	);
	return [...slugs]
		.flatMap((slug) => pick(collection, slug, language)?.summary ?? [])
		.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

/** One document rendered to HTML, or null when the slug does not exist. */
export async function getDocument(
	collection: Collection,
	slug: string,
	language: Language,
): Promise<Document | null> {
	const source = pick(collection, slug, language);
	if (!source) return null;
	return {
		...source.summary,
		html: await marked.parse(source.body, { gfm: true }),
	};
}
