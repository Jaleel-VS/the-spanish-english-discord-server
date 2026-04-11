import type React from "react";
import { useLanguage } from "../contexts/LanguageContext";

export const LanguageSwitcher: React.FC = () => {
	const { language, toggleLanguage } = useLanguage();

	return (
		<button
			type="button"
			onClick={toggleLanguage}
			className="flex items-center gap-2 px-4 py-2 bg-muted/50 border border-border rounded-full hover:bg-muted transition-all duration-200 text-sm font-medium"
			aria-label="Toggle language"
		>
			<span
				className={`transition-colors duration-200 ${language === "en" ? "text-foreground" : "text-muted-foreground"}`}
			>
				EN
			</span>
			<div className="w-px h-4 bg-border" />
			<span
				className={`transition-colors duration-200 ${language === "es" ? "text-foreground" : "text-muted-foreground"}`}
			>
				ES
			</span>
		</button>
	);
};
