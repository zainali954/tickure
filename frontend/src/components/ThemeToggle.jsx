import { Moon02Icon, Sun02Icon } from "hugeicons-react";
import React, { useState, useEffect, useCallback } from "react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync with localStorage for persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  }, []);
  

  return (
    <button
      onClick={toggleTheme}
      className="w-full text-sm flex items-center gap-2 p-3 bg-zinc-200 dark:bg-zinc-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
    >
      {isDarkMode ? (
        <Moon02Icon size={18}/>
      ) : (
        <Sun02Icon size={18}/>
      )}
      <span>{isDarkMode ? "Night Mode" : "Light Mode"}</span>
    </button>
  );
};

export default ThemeToggle;
