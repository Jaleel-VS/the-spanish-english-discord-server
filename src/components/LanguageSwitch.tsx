import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { isLanguage, type Language } from "@/i18n";
import { persistLanguage } from "@/i18n/language";

/** Offers the other language, named in that language ("Español" / "English"). */
export function LanguageSwitch({ className }: { className?: string }) {
	const { t, i18n } = useTranslation();
	const router = useRouter();
	const current: Language = isLanguage(i18n.language) ? i18n.language : "en";
	const other: Language = current === "en" ? "es" : "en";

	return (
		<button
			type="button"
			lang={other}
			className={`link cursor-pointer ${className ?? ""}`}
			onClick={() => {
				persistLanguage(other);
				router.invalidate();
			}}
		>
			<span className="sr-only">{t("nav.language")}: </span>
			{t(`languages.${other}`)}
		</button>
	);
}
