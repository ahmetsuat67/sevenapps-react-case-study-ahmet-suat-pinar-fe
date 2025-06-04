"use client";
import { useState, useEffect } from "react";
import useIndexedDB from "@/hooks/useIndexedDB";

export default function ShortcutsButton() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { getItem } = useIndexedDB<string>("settings");

  useEffect(() => {
    // İlk yüklemede IndexedDB'den tema bilgisini al
    getItem("theme").then((savedTheme) => {
      if (savedTheme && typeof savedTheme === "string") {
        setTheme(savedTheme as "light" | "dark");
      }
    });

    // <html data-theme> değişimini izlemek için MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          const newTheme =
            document.documentElement.getAttribute("data-theme") || "light";
          setTheme(newTheme as "light" | "dark");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [getItem]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-3 ${
          theme === "dark"
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-gray-100 hover:bg-gray-200"
        } rounded-full shadow`}
        title="Show keyboard shortcuts"
        aria-label="Shortcuts"
      >
        ⌨️
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Keyboard Shortcuts</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <b>Ctrl</b> + <b>S</b> / <b>Cmd</b> + <b>S</b>{" "}
                <span className="ml-2 text-gray-500">Save current document</span>
              </li>
              <li>
                <b>Ctrl</b> + <b>1</b> / <b>Ctrl</b> + <b>2</b> / <b>Ctrl</b> +{" "}
                <b>3</b> / <b>Ctrl</b> + <b>4</b> / <b>Ctrl</b> + <b>5</b>{" "}
                <span className="ml-2 text-gray-500">
                  Switch sample ( Readme/ Example / Intro / Features / Usage)
                </span>
              </li>
              <li>
                <b>Esc</b>{" "}
                <span className="ml-2 text-gray-500">Exit fullscreen</span>
              </li>
            </ul>
            <button
              className="mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 w-full"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
