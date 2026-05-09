import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	GraduationCap,
	Headphones,
	MessageCircle,
	Music,
	Megaphone,
	Video,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources/")({
	component: ResourcesIndex,
});

const resources = [
	{ key: "podcasts", to: "/resources/podcasts" as const, icon: Headphones },
	{ key: "videos", to: "/coming-soon" as const, icon: Video },
	{ key: "books", to: "/coming-soon" as const, icon: BookOpen },
	{ key: "courses", to: "/coming-soon" as const, icon: GraduationCap },
	{ key: "conversation", to: "/coming-soon" as const, icon: MessageCircle },
	{ key: "music", to: "/coming-soon" as const, icon: Music },
	{ key: "movies", to: "/resources/movies" as const, icon: Megaphone },
] as const;

function ResourcesIndex() {
	const { t } = useTranslation("resources");
	const [hovered, setHovered] = useState<number | null>(null);

	return (
		<div className="w-full">
			<h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
				{t("index.title")}
			</h1>
			<p className="text-muted-foreground mb-10">{t("index.description")}</p>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{resources.map(({ key, to, icon: Icon }, index) => (
					<Link
						key={key}
						to={to}
						onMouseEnter={() => setHovered(index)}
						onMouseLeave={() => setHovered(null)}
						className={cn(
							"group relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border border-border bg-card/50 cursor-pointer transition-all duration-300 ease-out no-underline text-inherit",
							hovered !== null &&
								hovered !== index &&
								"blur-sm scale-[0.98] opacity-60",
							hovered === index &&
								"border-[#fb923c]/50 bg-muted/50 scale-[1.02]",
						)}
					>
						<div
							className={cn(
								"p-3 rounded-lg bg-muted transition-colors duration-300",
								hovered === index && "bg-[#fb923c]/10",
							)}
						>
							<Icon
								className={cn(
									"w-8 h-8 text-muted-foreground transition-colors duration-300",
									hovered === index && "text-[#fb923c]",
								)}
							/>
						</div>
						<span
							className={cn(
								"text-sm font-medium text-muted-foreground transition-colors duration-300",
								hovered === index && "text-foreground",
							)}
						>
							{t(`index.tiles.${key}`)}
						</span>
					</Link>
				))}
			</div>
		</div>
	);
}
