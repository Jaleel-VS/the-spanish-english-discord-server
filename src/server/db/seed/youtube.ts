import type { SeedEntry } from "./entry";

/**
 * `imageUrl` is the channel's avatar (its page's og:image, at 176px). Copy it
 * by hand when adding a channel: YouTube rate-limits scripted page fetches.
 */
export const youtube: SeedEntry[] = [
	{
		id: "pupina-plomer",
		title: "Pupina Plomer",
		creator: "Florencia Plomer",
		description: {
			en: "An Argentine historian on women's history, Latin America and beyond, in 20–50 minute videos plus a weekly live stream. Fast, natural Argentine Spanish.",
			es: "Una historiadora argentina sobre historia de las mujeres, Latinoamérica y más, en videos de 20 a 50 minutos y un directo semanal. Español argentino rápido y natural.",
		},
		language: "es",
		level: "advanced",
		country: "AR",
		topics: ["history", "culture"],
		audience: "native",
		imageUrl:
			"https://yt3.googleusercontent.com/QiZgzQ7tY6x_9kplokH79HUSYUS0h_MDYdS99UCCMxajC2L9cCn0RSWrK3cNbhpZx7kmyxzlFQ=s176-c-k-c0x00ffffff-no-rj",
		url: "https://www.youtube.com/@pupinaplomer/videos",
	},
];
