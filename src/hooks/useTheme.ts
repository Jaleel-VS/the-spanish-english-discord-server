import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>("light");

  const setTheme = useCallback((theme: Theme) => {
    setThemeState(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const userPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  useEffect(() => {
    setTheme(userPrefersDark ? "dark" : "light");
  }, [setTheme, userPrefersDark]);

  return { theme, setTheme };
};
