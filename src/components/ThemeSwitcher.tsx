"use client";
import { useEffect, useState } from "react";
import useIndexedDB from "@/hooks/useIndexedDB";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");
  const { setItem, getItem } = useIndexedDB<string>("settings");

  useEffect(() => {
    getItem("theme").then((savedTheme) => {
      if (savedTheme && typeof savedTheme === "string") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    });
  }, [getItem]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
