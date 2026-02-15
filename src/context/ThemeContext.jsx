// src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getProfile, updateProfileTheme } from "../services/profileService";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState("light"); // 'light' or 'dark'
  const [loading, setLoading] = useState(true);

  // Apply theme to document root (for global styling)
  const applyThemeToDOM = (t) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.remove("safebite-light");
      root.classList.add("safebite-dark");
    } else {
      root.classList.remove("safebite-dark");
      root.classList.add("safebite-light");
    }
  };

  // Load theme from profile on user change
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (!user?.id) {
          // default
          setTheme("light");
          applyThemeToDOM("light");
          setLoading(false);
          return;
        }
        const profile = await getProfile(user.id);
        const t = profile?.theme || "light";
        setTheme(t);
        applyThemeToDOM(t);
      } catch (e) {
        console.error("Failed to load profile theme", e);
        setTheme("light");
        applyThemeToDOM("light");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  // Toggle (slider)
  const toggleTheme = async () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyThemeToDOM(next);

    // persist to Supabase (best-effort)
    if (user?.id) {
      try {
        await updateProfileTheme(user.id, next);
      } catch (e) {
        console.error("Failed to save theme", e);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
