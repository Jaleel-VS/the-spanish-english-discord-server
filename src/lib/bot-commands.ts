import type { Localized } from "./catalog";

/**
 * A bot's member-facing commands, kept in content/bots/<slug>.commands.ts next
 * to the bot's page. The page lists them by category; each opens in a dialog
 * with its usage and, when there is more to say, Markdown `details`.
 * Moderator-only commands are left out on purpose.
 */

/** Who can run a command: anyone, or only members with a learning role. */
export const commandAudiences = ["everyone", "learners"] as const;
export type CommandAudience = (typeof commandAudiences)[number];

export interface BotCommand {
	/** URL-safe and unique within the bot; used as `?cmd=<id>`. */
	id: string;
	/** As typed, with the prefix: `;hardcore`, `/vocab add`. */
	name: string;
	aliases?: string[];
	category: string;
	who: CommandAudience;
	/** One sentence, shown in the list. */
	summary: Localized;
	/** Example invocations and what each does. */
	usage?: { syntax: string; does: Localized }[];
	/** Markdown for the dialog, below the usage. */
	details?: Localized;
}

export interface BotCommands {
	categories: { id: string; label: Localized }[];
	commands: BotCommand[];
}

/** A command as the page receives it: one language, details already rendered. */
export interface CommandView {
	id: string;
	name: string;
	aliases: string[];
	category: string;
	who: CommandAudience;
	summary: string;
	usage: { syntax: string; does: string }[];
	detailsHtml: string | null;
}

export interface CommandReference {
	categories: { id: string; label: string }[];
	commands: CommandView[];
}
