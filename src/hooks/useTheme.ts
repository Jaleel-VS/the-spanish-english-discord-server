import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

export const useTheme = () => {
  const getInitialTheme = useCallback(() => {

    if(typeof window === "undefined") return "light";

    const saved = localStorage.getItem("theme") as Theme;
    if (saved) return saved;

    const userPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    return userPrefersDark ? "dark" : "light";
  }, []);

  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  const setTheme = useCallback((theme: Theme) => {
    setThemeState(theme);
    localStorage.setItem("theme", theme);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  return { theme, setTheme };
};
