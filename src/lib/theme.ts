/**
 * Light and dark mode. The page follows the device's setting until the
 * visitor picks one with the header toggle; that choice is kept on this device.
 * The theme lives on `<html data-theme>`: the inline `themeScript` sets it
 * before the first paint (no light flash on a dark page), and styles.css keys
 * the dark palette and Tailwind's `dark:` variant on it. Without JavaScript the
 * attribute is absent and the device's setting applies through the media query.
 */

export type Theme = "light" | "dark";

const KEY = "theme";
const systemDark = "(prefers-color-scheme: dark)";

/** Runs in <head> before the body renders. Kept tiny and dependency-free. */
export const themeScript = `(function(){var t;try{t=localStorage.getItem("${KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("${systemDark}").matches?"dark":"light";document.documentElement.dataset.theme=t})()`;

export function currentTheme(): Theme {
	const set = document.documentElement.dataset.theme;
	if (set === "light" || set === "dark") return set;
	return matchMedia(systemDark).matches ? "dark" : "light";
}

/** The visitor's choice, or null while the page follows the device. */
export function storedTheme(): Theme | null {
	try {
		const value = localStorage.getItem(KEY);
		return value === "light" || value === "dark" ? value : null;
	} catch {
		return null;
	}
}

/** Applies a theme picked by the visitor and remembers it. */
export function chooseTheme(theme: Theme) {
	document.documentElement.dataset.theme = theme;
	try {
		localStorage.setItem(KEY, theme);
	} catch {
		// Private mode without storage: the choice lasts for this page.
	}
}

/**
 * Calls `listener` whenever the page's theme changes, whether from the toggle
 * or, while the visitor has not picked one, from the device's setting.
 */
export function onThemeChange(listener: (theme: Theme) => void): () => void {
	const media = matchMedia(systemDark);
	const followDevice = () => {
		if (!storedTheme())
			document.documentElement.dataset.theme = media.matches ? "dark" : "light";
	};
	const observer = new MutationObserver(() => listener(currentTheme()));
	observer.observe(document.documentElement, {
		attributeFilter: ["data-theme"],
	});
	media.addEventListener("change", followDevice);
	return () => {
		observer.disconnect();
		media.removeEventListener("change", followDevice);
	};
}
