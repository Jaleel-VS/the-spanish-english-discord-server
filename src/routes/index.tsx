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

  const handleClick = () => {
    window.open(
      "https://discord.gg/spanish-english",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const testimonials: testimonialsItem[] = [
    {
      quote: "This is a great community!",
      name: "Alice",
      title: "Member",
      imageUrl: image,
    },
    {
      name: "Bob",
      quote: "I've learned so much in this community",
      title: "Member",
    },
  ];


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

        <div className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
          {t("home:hero.descriptionStart")}
          <FlipWords words={cities} className="text-[#fb923c] font-medium" />
          {t("home:hero.descriptionEnd")}
        </div>

        <div className="pt-6 flex flex-col items-center justify-center gap-6">
          <AnimatedBorderButton
            borderRadius="10rem"
            onClick={handleClick}
            role="link"
            className="group cursor-pointer relative px-10 py-5 bg-[#fb923c] text-slate-950 font-bold 
			text-xl rounded-full transition-all duration-300 hover:bg-[#f97316] hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {t("home:cta.join")}
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                fillRule="evenodd"
                d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </AnimatedBorderButton>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
            <Link
              to="/coming-soon"
              className="hover:text-[#fb923c] transition-colors duration-200"
            >
              {t("common:links.newToDiscord")}
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/coming-soon"
              className="hover:text-[#fb923c] transition-colors duration-200"
            >
              {t("common:links.guidelines")}
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/resources"
              className="hover:text-[#fb923c] transition-colors duration-200"
            >
              {t("common:links.resources")}
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/coming-soon"
              className="hover:text-[#fb923c] transition-colors duration-200"
            >
              {t("common:links.support")}
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center items-center ">
        <h2 className="text-center text-3xl md:text-4xl font-bold leading-tight tracking-tighter">
          {t("home:testimonials.title")}
        </h2>

        <InfiniteMovingCards items={testimonials} />
      </section>
    </div>
  );

}
