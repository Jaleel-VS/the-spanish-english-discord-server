import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FlipWords } from "@/components/ui/flip-words";
import { SparklesCore } from "@/components/ui/sparkles";
import { AnimatedBorderButton } from "@/components/ui/moving-border";
import {
  InfiniteMovingCards,
  type testimonialsItem,
} from "@/components/ui/infinite-moving-cards";
import image from "@/assets/user-placeholder.png";

const cities = [
  "Madrid",
  "London",
  "Buenos Aires",
  "New York",
  "Bogotá",
  "Los Angeles",
  "Barcelona",
  "Toronto",
  "Lima",
  "Sydney",
  "Ciudad de México",
  "Dublin",
  "Santiago",
  "Miami",
  "Sevilla",
  "Manchester",
];

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation(["home", "common"]);

	return (
		<div className="relative min-h-[60vh] py-4 flex items-center justify-center">
			<SparklesCore
				id="hero-sparkles"
				background="transparent"
				minSize={0.4}
				maxSize={1.4}
				particleDensity={40}
				className="absolute inset-0"
				particleColor="#fb923c"
				speed={0.3}
			/>
			<section className="relative z-10 space-y-8 max-w-2xl mx-auto text-center flex flex-col items-center justify-center">
				<h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter text-foreground">
					{t("home:hero.title")} <br />
					<span className="italic text-[#fb923c]">
						{t("home:hero.titleHighlight")}
					</span>
				</h1>

				<p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
					{t("home:hero.descriptionStart")}
					<FlipWords words={cities} className="text-[#fb923c] font-medium" />
					{t("home:hero.descriptionEnd")}
				</p>

  return (
    <div className="relative flex-col gap-10 min-h-[60vh] py-4 flex items-center justify-center">
      <SparklesCore
        id="hero-sparkles"
        background="transparent"
        minSize={0.4}
        maxSize={1.4}
        particleDensity={40}
        className="absolute inset-0"
        particleColor="#fb923c"
        speed={0.3}
      />
      <section className="relative z-10 space-y-8 max-w-2xl mx-auto text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">
          {t("home:hero.title")} <br />
          <span className="italic text-[#fb923c]">
            {t("home:hero.titleHighlight")}
          </span>
        </h1>

					<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
						<Link
							to="/coming-soon"
							className="hover:text-[#fb923c] transition-colors duration-200"
						>
							{t("common:links.newToDiscord")}
						</Link>
						<span className="text-muted-foreground/40" aria-hidden>
							•
						</span>
						<Link
							to="/coming-soon"
							className="hover:text-[#fb923c] transition-colors duration-200"
						>
							{t("common:links.guidelines")}
						</Link>
						<span className="text-muted-foreground/40" aria-hidden>
							•
						</span>
						<Link
							to="/resources"
							className="hover:text-[#fb923c] transition-colors duration-200"
						>
							{t("common:links.resources")}
						</Link>
						<span className="text-muted-foreground/40" aria-hidden>
							•
						</span>
						<Link
							to="/coming-soon"
							className="hover:text-[#fb923c] transition-colors duration-200"
						>
							{t("common:links.support")}
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
