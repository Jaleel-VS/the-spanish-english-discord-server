import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	chooseTheme,
	currentTheme,
	onThemeChange,
	type Theme,
} from "@/lib/theme";

/**
 * Light/dark switch: one button whose icon morphs from a sun (a small disc
 * and eight rays) to a moon (a bigger disc with a bite taken by a mask).
 * The icon's state comes from the page's `dark:` styles, not React state, so
 * it is right from the first paint and only animates when pressed. A toggle
 * button (`aria-pressed` on "Dark mode") rather than a label that flips.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
	const { t } = useTranslation();
	const [theme, setTheme] = useState<Theme | null>(null);
	const mask = `moon-${useId().replace(/[^\w-]/g, "")}`;

	useEffect(() => {
		setTheme(currentTheme());
		return onThemeChange(setTheme);
	}, []);

	const rays = [0, 45, 90, 135, 180, 225, 270, 315];

	return (
		<button
			type="button"
			aria-pressed={theme === "dark"}
			title={t("nav.dark")}
			onClick={() => chooseTheme(currentTheme() === "dark" ? "light" : "dark")}
			className={`inline-flex size-11 cursor-pointer items-center justify-center transition-colors duration-150 hover:bg-surface ${className}`}
		>
			<span className="sr-only">{t("nav.dark")}</span>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				className="size-5 overflow-visible"
			>
				<mask id={mask}>
					<rect width="24" height="24" fill="white" />
					<circle
						cx="31"
						cy="7"
						r="7"
						fill="black"
						className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out dark:-translate-x-[13px]"
					/>
				</mask>
				<circle
					cx="12"
					cy="12"
					r="9"
					fill="currentColor"
					mask={`url(#${mask})`}
					className="origin-center scale-[0.5] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out dark:scale-100"
				/>
				<g
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					className="origin-center motion-safe:transition-[rotate,scale,opacity] motion-safe:duration-500 motion-safe:ease-out dark:rotate-45 dark:scale-50 dark:opacity-0"
				>
					{rays.map((angle) => (
						<line
							key={angle}
							x1="12"
							y1="2"
							x2="12"
							y2="4.5"
							transform={`rotate(${angle} 12 12)`}
						/>
					))}
				</g>
			</svg>
		</button>
	);
}
