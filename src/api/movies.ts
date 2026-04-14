

export interface Movie {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	language: "en" | "es" | "both";
	level: "beginner" | "intermediate" | "advanced";
	country: string;
	topic: string;
	url: string;
}