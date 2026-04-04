import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	BookOpen,
	GraduationCap,
	Headphones,
	MessageCircle,
	Music,
	Video,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources/")({
	component: ResourcesIndex,
});

const resources = [
	{ key: "podcasts", to: "/resources/podcasts", icon: Headphones },
	{ key: "videos", to: "/resources/videos", icon: Video },
	{ key: "books", to: "/resources/books", icon: BookOpen },
	{ key: "courses", to: "/resources/courses", icon: GraduationCap },
	{ key: "conversation", to: "/resources/conversation", icon: MessageCircle },
	{ key: "music", to: "/resources/music", icon: Music },
] as const;

function ResourcesIndex() {
	const { t } = useTranslation("resources");
	const navigate = useNavigate();
	const [hovered, setHovered] = useState<number | null>(null);

	return (
		<div className="w-full">
			<h1 className="text-3xl md:text-4xl font-bold mb-3">
				{t("index.title")}
			</h1>
			<p className="text-slate-400 mb-10">{t("index.description")}</p>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{resources.map(({ key, to, icon: Icon }, index) => (
					<button
						type="button"
						key={key}
						onClick={() => navigate({ to })}
						onMouseEnter={() => setHovered(index)}
						onMouseLeave={() => setHovered(null)}
						className={cn(
							"group relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border border-slate-800 bg-slate-900/50 cursor-pointer transition-all duration-300 ease-out",
							hovered !== null &&
								hovered !== index &&
								"blur-sm scale-[0.98] opacity-60",
							hovered === index &&
								"border-[#fb923c]/50 bg-slate-800/50 scale-[1.02]",
						)}
					>
						<div
							className={cn(
								"p-3 rounded-lg bg-slate-800 transition-colors duration-300",
								hovered === index && "bg-[#fb923c]/10",
							)}
						>
							<Icon
								className={cn(
									"w-8 h-8 text-slate-400 transition-colors duration-300",
									hovered === index && "text-[#fb923c]",
								)}
							/>
						</div>
						<span
							className={cn(
								"text-sm font-medium text-slate-300 transition-colors duration-300",
								hovered === index && "text-white",
							)}
						>
							{t(`index.tiles.${key}`)}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}
