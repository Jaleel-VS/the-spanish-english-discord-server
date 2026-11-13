import type { BotCommands } from "@/lib/bot-commands";

/**
 * Rai's commands for members, read from its source (github.com/r-hensley/Rai)
 * in November 2026. Moderator commands are not listed.
 */
export const rai: BotCommands = {
	categories: [
		{ id: "practice", label: { en: "Language practice", es: "Práctica de idiomas" } },
		{ id: "stats", label: { en: "Profile & stats", es: "Perfil y estadísticas" } },
		{ id: "questions", label: { en: "Questions", es: "Preguntas" } },
		{ id: "community", label: { en: "Community", es: "Comunidad" } },
	],
	commands: [
		{
			id: "hardcore",
			name: ";hardcore",
			aliases: [";hc"],
			category: "practice",
			who: "learners",
			summary: {
				en: "Only lets you write in the language you're learning; Rai deletes the rest.",
				es: "Solo te deja escribir en el idioma que aprendes; Rai borra lo demás.",
			},
			usage: [
				{
					syntax: ";hc",
					does: { en: "Turn hardcore on, or off again.", es: "Activa el modo hardcore, o lo desactiva." },
				},
				{
					syntax: ";hc 30",
					does: {
						en: "Turn it on with a goal: locked on until 30% of your messages are in your target language.",
						es: "Lo activa con una meta: no se puede quitar hasta que el 30 % de tus mensajes estén en el idioma que aprendes.",
					},
				},
			],
			details: {
				en: `### How it works

- You need exactly one learning role, Learning Spanish or Learning English. That role decides your target language.
- While it's on, Rai deletes your messages in the other language. If a deleted message was long, Rai sends it back to you by DM.
- A few channels are left out, so you can still ask for help in your own language there.

### Goals and levels

A goal is measured over your last 30 days of messages, the same figure \`;ul\` shows. You can raise a goal later but never lower it, and you can't remove hardcore yourself until you reach it; a server admin can. Your role shows how high you aimed:

| Role | Goal |
| --- | --- |
| Hardcore | None, or under 50% |
| Super hardcore | 50% to 89% |
| Ultra hardcore | 90% or more |

Rai asks you to confirm before it sets a goal. It also warns that a 100% goal is effectively impossible, so it is a permanent lock.`,
				es: `### Cómo funciona

- Necesitas exactamente un rol de aprendizaje, Learning Spanish o Learning English. Ese rol decide tu idioma meta.
- Mientras está activo, Rai borra tus mensajes en el otro idioma. Si un mensaje borrado era largo, Rai te lo devuelve por mensaje privado.
- Algunos canales quedan fuera, para que ahí puedas pedir ayuda en tu propio idioma.

### Metas y niveles

La meta se mide sobre tus mensajes de los últimos 30 días, la misma cifra que muestra \`;ul\`. Puedes subir la meta más adelante pero nunca bajarla, y no puedes quitarte el modo hardcore hasta alcanzarla; un administrador del servidor sí puede. Tu rol muestra lo alto que apuntaste:

| Rol | Meta |
| --- | --- |
| Hardcore | Ninguna, o menos del 50 % |
| Super hardcore | Del 50 % al 89 % |
| Ultra hardcore | 90 % o más |

Rai te pide confirmación antes de fijar una meta. También avisa de que una meta del 100 % es prácticamente imposible, así que el bloqueo es permanente.`,
			},
		},
		{
			id: "pencil",
			name: ";pencil",
			category: "practice",
			who: "everyone",
			summary: {
				en: "Adds a pencil to your name to say you'd like to be corrected.",
				es: "Añade un lápiz a tu nombre para indicar que quieres que te corrijan.",
			},
			usage: [
				{ syntax: ";pencil", does: { en: "Add the pencil.", es: "Añade el lápiz." } },
				{ syntax: ";eraser", does: { en: "Remove it.", es: "Lo quita." } },
			],
		},
		{
			id: "user",
			name: ";user",
			aliases: [";u"],
			category: "stats",
			who: "everyone",
			summary: {
				en: "A profile: activity and which languages someone has been writing in.",
				es: "Un perfil: actividad y en qué idiomas ha escrito alguien.",
			},
			usage: [
				{ syntax: ";u", does: { en: "Your own profile.", es: "Tu propio perfil." } },
				{ syntax: ";u @member", does: { en: "Someone else's.", es: "El de otra persona." } },
			],
		},
		{
			id: "ul",
			name: ";ul",
			category: "stats",
			who: "everyone",
			summary: {
				en: "Your language percentages over the last 30 days and the last 24 hours.",
				es: "Tus porcentajes de idioma de los últimos 30 días y de las últimas 24 horas.",
			},
		},
		{
			id: "lb",
			name: ";lb",
			category: "stats",
			who: "everyone",
			summary: {
				en: "The leaderboard: the 25 most active members this month.",
				es: "La clasificación: los 25 miembros más activos de este mes.",
			},
			usage: [
				{ syntax: ";lb", does: { en: "Across the server.", es: "En todo el servidor." } },
				{
					syntax: ";lb #channel",
					does: { en: "Only in the channels you name.", es: "Solo en los canales que indiques." },
				},
			],
		},
		{
			id: "chlb",
			name: ";chlb",
			category: "stats",
			who: "everyone",
			summary: {
				en: "The same leaderboard for the channel you're in.",
				es: "La misma clasificación para el canal en el que estás.",
			},
		},
		{
			id: "vc",
			name: ";vc",
			aliases: [";vclb"],
			category: "stats",
			who: "everyone",
			summary: {
				en: "The voice leaderboard: who has spent the most time in voice channels.",
				es: "La clasificación de voz: quién ha pasado más tiempo en los canales de voz.",
			},
		},
		{
			id: "question",
			name: ";question",
			aliases: [";q"],
			category: "questions",
			who: "everyone",
			summary: {
				en: "Opens a question in a questions channel so it isn't lost in the chat.",
				es: "Abre una pregunta en un canal de preguntas para que no se pierda en el chat.",
			},
			usage: [
				{
					syntax: ";q your question",
					does: { en: "Open a question with that title.", es: "Abre una pregunta con ese título." },
				},
				{
					syntax: ";q",
					does: { en: "List the open questions.", es: "Muestra las preguntas abiertas." },
				},
				{
					syntax: ";q a 3",
					does: { en: "Mark question 3 as answered.", es: "Marca la pregunta 3 como respondida." },
				},
			],
		},
		{
			id: "inrole",
			name: ";inrole",
			category: "community",
			who: "everyone",
			summary: {
				en: "Lists the members who have a role.",
				es: "Muestra los miembros que tienen un rol.",
			},
			usage: [
				{ syntax: ";inrole Nerd", does: { en: "Everyone with the role.", es: "Todos los que tienen el rol." } },
				{
					syntax: ";inrole Nerd --count",
					does: { en: "Just how many.", es: "Solo cuántos son." },
				},
			],
		},
	],
};
