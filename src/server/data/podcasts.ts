import type { Podcast } from "@/lib/catalog";

export const podcasts: Podcast[] = [
	{
		id: "spanishpod101",
		title: "SpanishPod101",
		description: {
			en: "Short lessons with native-speaker hosts, from first words to advanced listening.",
			es: "Lecciones cortas con presentadores nativos, desde las primeras palabras hasta la escucha avanzada.",
		},
		language: "es",
		level: "beginner",
		country: "MX",
		url: "https://www.spanishpod101.com/",
	},
	{
		id: "coffee-break-spanish",
		title: "Coffee Break Spanish",
		description: {
			en: "Structured courses in coffee-break-sized episodes, beginner to advanced.",
			es: "Cursos estructurados en episodios del tamaño de una pausa para el café, de principiante a avanzado.",
		},
		language: "es",
		level: "beginner",
		country: "ES",
		url: "https://coffeebreaklanguages.com/coffeebreakspanish/",
	},
	{
		id: "notes-in-spanish",
		title: "Notes in Spanish",
		description: {
			en: "Real conversation between a native speaker and an English-speaking learner.",
			es: "Conversación real entre un hablante nativo y una estudiante de habla inglesa.",
		},
		language: "both",
		level: "intermediate",
		country: "ES",
		url: "https://www.notesinspanish.com/",
	},
	{
		id: "espanolistos",
		title: "Españolistos",
		description: {
			en: "Colombian Spanish: grammar, vocabulary and culture with a Colombian teacher.",
			es: "Español de Colombia: gramática, vocabulario y cultura con una profesora colombiana.",
		},
		language: "both",
		level: "intermediate",
		country: "CO",
		url: "https://espanolistos.com/",
	},
	{
		id: "duolingo-spanish-podcast",
		title: "Duolingo Spanish Podcast",
		description: {
			en: "True stories told in clear Spanish, with English narration between scenes.",
			es: "Historias reales contadas en un español claro, con narración en inglés entre escenas.",
		},
		language: "both",
		level: "intermediate",
		country: null,
		url: "https://podcast.duolingo.com/spanish",
	},
	{
		id: "radio-ambulante",
		title: "Radio Ambulante",
		description: {
			en: "Award-winning long-form stories from across Latin America, entirely in Spanish.",
			es: "Crónicas premiadas de toda Latinoamérica, contadas íntegramente en español.",
		},
		language: "es",
		level: "advanced",
		country: null,
		url: "https://radioambulante.org/",
	},
];
