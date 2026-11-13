import type { BotCommands } from "@/lib/bot-commands";

/**
 * Hablemos's commands for members, from its source
 * (github.com/Jaleel-VS/hablemos-discordpy-bot), November 2026.
 */
export const hablemos: BotCommands = {
	categories: [
		{ id: "vocab", label: { en: "Vocabulary notes", es: "Notas de vocabulario" } },
		{ id: "league", label: { en: "Language League", es: "Liga de Idiomas" } },
		{ id: "help", label: { en: "Help & privacy", es: "Ayuda y privacidad" } },
	],
	commands: [
		{
			id: "vocab-add",
			name: "/vocab add",
			category: "vocab",
			who: "everyone",
			summary: {
				en: "Save a word or phrase with its translation; your notes are private.",
				es: "Guarda una palabra o frase con su traducción; tus notas son privadas.",
			},
		},
		{
			id: "vocab-list",
			name: "/vocab list",
			category: "vocab",
			who: "everyone",
			summary: { en: "See all your notes.", es: "Muestra todas tus notas." },
		},
		{
			id: "vocab-search",
			name: "/vocab search",
			category: "vocab",
			who: "everyone",
			summary: {
				en: "Search your notes by word or translation.",
				es: "Busca en tus notas por palabra o traducción.",
			},
		},
		{
			id: "vocab-delete",
			name: "/vocab delete",
			category: "vocab",
			who: "everyone",
			summary: { en: "Delete a note.", es: "Borra una nota." },
		},
		{
			id: "vocab-export",
			name: "/vocab export",
			category: "vocab",
			who: "everyone",
			summary: {
				en: "Download all your notes as a CSV file.",
				es: "Descarga todas tus notas en un archivo CSV.",
			},
		},
		{
			id: "league-join",
			name: "/league join",
			category: "league",
			who: "everyone",
			summary: {
				en: "Join the Language League, the weekly leaderboard.",
				es: "Únete a la Liga de Idiomas, la clasificación semanal.",
			},
		},
		{
			id: "league-view",
			name: "/league view",
			category: "league",
			who: "everyone",
			summary: {
				en: "See the Spanish, English or combined rankings.",
				es: "Muestra la clasificación en español, en inglés o combinada.",
			},
		},
		{
			id: "league-stats",
			name: "/league stats",
			category: "league",
			who: "everyone",
			summary: { en: "See league statistics.", es: "Muestra las estadísticas de la liga." },
		},
		{
			id: "league-leave",
			name: "/league leave",
			category: "league",
			who: "everyone",
			summary: { en: "Leave the league.", es: "Sal de la liga." },
		},
		{
			id: "help",
			name: "/help",
			category: "help",
			who: "everyone",
			summary: {
				en: "All the bot's commands and features, by category.",
				es: "Todos los comandos y funciones del bot, por categorías.",
			},
		},
		{
			id: "deletemydata",
			name: "/deletemydata",
			category: "help",
			who: "everyone",
			summary: {
				en: "Delete everything the bot stores about you.",
				es: "Borra todo lo que el bot guarda sobre ti.",
			},
		},
	],
};
