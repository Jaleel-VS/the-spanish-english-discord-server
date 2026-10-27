import { createServerFn } from "@tanstack/react-start";
import { INVITE_CODE } from "@/lib/site";

export interface Community {
	members: number;
	online: number;
	iconUrl: string | null;
}

const TTL_MS = 5 * 60 * 1000;
let cached: { value: Community; expires: number } | undefined;
let inflight: Promise<Community | null> | undefined;

interface InviteResponse {
	approximate_member_count: number;
	approximate_presence_count: number;
	guild: { id: string; icon: string | null };
}

async function fetchCommunity(): Promise<Community | null> {
	try {
		const response = await fetch(
			`https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true`,
			{ signal: AbortSignal.timeout(3000) },
		);
		if (!response.ok) return cached?.value ?? null;
		const invite = (await response.json()) as InviteResponse;
		const value: Community = {
			members: invite.approximate_member_count,
			online: invite.approximate_presence_count,
			iconUrl: invite.guild.icon
				? `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.png?size=256`
				: null,
		};
		cached = { value, expires: Date.now() + TTL_MS };
		return value;
	} catch {
		return cached?.value ?? null;
	}
}

/**
 * Live member and online counts from Discord's public invite endpoint.
 * Cached per server instance so visitors never hit Discord's rate limit;
 * `null` when Discord has never answered, and the page then omits the numbers.
 */
export const getCommunity = createServerFn({ method: "GET" }).handler(() => {
	if (cached && cached.expires > Date.now()) return cached.value;
	inflight ??= fetchCommunity().finally(() => {
		inflight = undefined;
	});
	return inflight;
});
