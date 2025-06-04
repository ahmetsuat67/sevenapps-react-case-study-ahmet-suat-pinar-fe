"use client";
import { ChangeEvent, useEffect } from "react";

interface EditorProps {
  markdown: string;
  onMarkdownChange: (content: string) => void;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function Editor({
  markdown,
  onMarkdownChange,
  fullscreen = false,
  onToggleFullscreen,
}: EditorProps) {
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
        Editor
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
      <textarea
        className="flex-1 resize-none p-4 bg-transparent outline-none font-mono min-h-[250px]"
        value={markdown}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onMarkdownChange(e.target.value)
        }
        placeholder="Enter markdown..."
      />
    </section>
  );
}
