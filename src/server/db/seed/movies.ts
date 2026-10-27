import type { Movie } from "@/lib/catalog";

export const movies: Movie[] = [
	{
		id: "the-shawshank-redemption",
		title: "The Shawshank Redemption",
		description: {
			en: "A banker convicted of murder forms an unlikely friendship in prison while holding on to hope.",
			es: "Un banquero condenado por asesinato entabla una amistad inesperada en la cárcel sin perder la esperanza.",
		},
		audioLanguage: "en",
		country: "US",
		genre: "drama",
		releaseYear: 1994,
		url: "https://www.imdb.com/title/tt0111161/",
	},
	{
		id: "inception",
		title: "Inception",
		description: {
			en: "A thief who steals secrets through shared dreams is asked to plant an idea instead.",
			es: "Un ladrón que roba secretos a través de sueños compartidos recibe el encargo de implantar una idea.",
		},
		audioLanguage: "en",
		country: "US",
		genre: "sci-fi",
		releaseYear: 2010,
		url: "https://www.imdb.com/title/tt1375666/",
	},
	{
		id: "the-kings-speech",
		title: "The King's Speech",
		description: {
			en: "King George VI works with an unorthodox speech therapist to overcome his stammer.",
			es: "El rey Jorge VI trabaja con un logopeda poco convencional para superar su tartamudez.",
		},
		audioLanguage: "en",
		country: "GB",
		genre: "drama",
		releaseYear: 2010,
		url: "https://www.imdb.com/title/tt1504320/",
	},
	{
		id: "el-laberinto-del-fauno",
		title: "El laberinto del fauno",
		description: {
			en: "In Spain in 1944, a girl escapes into a fantasy world while her stepfather hunts the guerrillas.",
			es: "En la España de 1944, una niña escapa a un mundo de fantasía mientras su padrastro persigue a los guerrilleros.",
		},
		audioLanguage: "es",
		country: "ES",
		genre: "fantasy",
		releaseYear: 2006,
		url: "https://www.imdb.com/title/tt0457430/",
	},
	{
		id: "roma",
		title: "Roma",
		description: {
			en: "A domestic worker in 1970s Mexico City, between family life and political unrest.",
			es: "Una trabajadora doméstica en la Ciudad de México de los años setenta, entre la vida familiar y la agitación política.",
		},
		audioLanguage: "es",
		country: "MX",
		genre: "drama",
		releaseYear: 2018,
		url: "https://www.imdb.com/title/tt6155172/",
	},
	{
		id: "el-secreto-de-sus-ojos",
		title: "El secreto de sus ojos",
		description: {
			en: "A retired court investigator writes a novel about an unsolved murder that has haunted him for twenty-five years.",
			es: "Un oficial de justicia retirado escribe una novela sobre un asesinato sin resolver que lo persigue desde hace veinticinco años.",
		},
		audioLanguage: "es",
		country: "AR",
		genre: "thriller",
		releaseYear: 2009,
		url: "https://www.imdb.com/title/tt1305806/",
	},
];
