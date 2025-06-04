"use client";
import React from "react";

interface Props {
  htmlContent: string;
}

export default function ExportHTMLButton({ htmlContent }: Props) {
  const handleDownload = () => {
    const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Markdown Export</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: sans-serif; background: #fff; color: #111; margin: 2rem; }
    @media (prefers-color-scheme: dark) {
      body { background: #111; color: #eee; }
    }
    .markdown-body { max-width: 700px; margin: auto; }
  </style>
</head>
<body>
  <article class="markdown-body">
    ${htmlContent}
  </article>
</body>
</html>`;
    const blob = new Blob([htmlString], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-preview.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="px-4 py-2 rounded border border-gray-200 dark:border-gray-700 bg-background hover:bg-gray-100 dark:hover:bg-gray-900 transition text-sm"
      onClick={handleDownload}
      title="Download HTML"
      type="button"
    >
      ⬇️ Download HTML
    </button>
  );
}
