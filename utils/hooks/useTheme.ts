import * as React from "react";

export const useTheme = () => {
  const [theme, setTheme] = React.useState<string | undefined>("");

  React.useLayoutEffect(() => {
    const currentTheme = JSON.parse(localStorage.getItem("theme")!);

    if (!currentTheme) {
      localStorage.setItem("theme", JSON.stringify("light"));
      setTheme("light");
    } else {
      setTheme(currentTheme);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme!));
    document.body.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return [theme, toggleTheme] as const;
};
