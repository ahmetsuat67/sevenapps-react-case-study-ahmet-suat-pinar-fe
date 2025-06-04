"use client";
import { useEffect } from "react";

interface PreviewProps {
  htmlContent: string;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function Preview({
  htmlContent,
  fullscreen = false,
  onToggleFullscreen,
}: PreviewProps) {
  useEffect(() => {
    if (!fullscreen || !onToggleFullscreen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggleFullscreen();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [fullscreen, onToggleFullscreen]);

  return (
    <section
      className={
        `flex flex-col flex-1 border border-gray-200 dark:border-gray-700 rounded ` +
        (fullscreen ? "fixed inset-0 z-50 bg-background p-8" : "")
      }
      style={fullscreen ? { maxWidth: "100vw", maxHeight: "100vh" } : {}}
    >
      <header className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-medium text-sm flex justify-between items-center">
        Preview
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label="Toggle fullscreen"
            className="text-lg px-2"
          >
            ⛶
          </button>
        )}
      </header>
      <article
        className="markdown-body flex-1 overflow-auto p-4"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </section>
  );
}
