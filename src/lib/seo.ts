/**
 * Link-preview (Open Graph) tags for one page: what Discord, WhatsApp, Slack
 * and others show when someone pastes its link. The root route sets the
 * site-wide ones (site name, image, card type); a page's own title,
 * description and URL replace the root's because tags are deduplicated by
 * `name`/`property`, the deepest route winning.
 */
export const SITE_URL = "https://the-spanish-english-discord-server.vercel.app";

export function pageMeta({
	title,
	documentTitle,
	description,
	path,
}: {
	/** The page's own name, shown as the preview's headline under the site name. */
	title: string;
	/** The browser tab's title, usually `title` plus a suffix. */
	documentTitle: string;
	description: string | undefined;
	path: string;
}) {
	return [
		{ title: documentTitle },
		{ name: "description", content: description },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:url", content: `${SITE_URL}${path}` },
		// Index routes report `/guides/`; links are shared without the slash.
		{
			property: "og:url",
			content: `${SITE_URL}${path.replace(/(.)\/$/, "$1")}`,
		},
	];
}
