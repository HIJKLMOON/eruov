import { useState, type ReactNode } from "react";
import ThemeContext from "./ThemeContext";

interface themeProviderProps {
  children: ReactNode;
}

const ThemeContextProvider = ({ children }: themeProviderProps) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
