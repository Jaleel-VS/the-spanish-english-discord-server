import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import comingSoonEN from "./locales/en/coming-soon.json";
import commonEN from "./locales/en/common.json";
import homeEN from "./locales/en/home.json";
import resourcesEN from "./locales/en/resources.json";
import comingSoonES from "./locales/es/coming-soon.json";
import commonES from "./locales/es/common.json";
import homeES from "./locales/es/home.json";
import resourcesES from "./locales/es/resources.json";

const resources = {
	en: {
		common: commonEN,
		home: homeEN,
		comingSoon: comingSoonEN,
		resources: resourcesEN,
	},
	es: {
		common: commonES,
		home: homeES,
		comingSoon: comingSoonES,
		resources: resourcesES,
	},
};

// Get saved language from localStorage or default to English
const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
	resources,
	lng: savedLanguage,
	fallbackLng: "en",
	defaultNS: "common",
	interpolation: {
		escapeValue: false, // React already escapes values
	},
});

export default i18n;
