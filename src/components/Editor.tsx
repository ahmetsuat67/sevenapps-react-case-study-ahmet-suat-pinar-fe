"use client";

import { ChangeEvent } from "react";

interface EditorProps {
  markdown: string;
  onMarkdownChange: (content: string) => void;
}

export default function Editor({ markdown, onMarkdownChange }: EditorProps) {
  return (
    <section className="flex flex-col flex-1 border border-gray-200 dark:border-gray-700 rounded">
      <header className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-medium text-sm">
        Editor
      </header>
      <textarea
        className="flex-1 resize-none p-4 bg-transparent outline-none font-mono"
        value={markdown}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onMarkdownChange(e.target.value)}
        placeholder="Enter markdown..."
      />
    </section>
  );
}
