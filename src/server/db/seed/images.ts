/**
 * A podcast's cover from Apple Podcasts, looked up at seed time by the id in
 * its URL, or by `appleId` when it links to the show's own site. Returns null
 * for other links or when the lookup fails; the row then shows the title's initials.
 */
export async function lookUpImage(
	url: string,
	appleId?: string,
): Promise<string | null> {
	const id = appleId ?? /podcasts\.apple\.com\/.+\/id(\d+)/.exec(url)?.[1];
	if (!id) return null;
	try {
		const response = await fetch(`https://itunes.apple.com/lookup?id=${id}`, {
			signal: AbortSignal.timeout(10_000),
		});
		const body = (await response.json()) as {
			results?: { artworkUrl600?: string }[];
		};
		return body.results?.[0]?.artworkUrl600 ?? null;
	} catch {
		// Network trouble during a seed only costs the picture.
		return null;
	}
}
