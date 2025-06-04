"use client";

interface PreviewProps {
  htmlContent: string;
}

export default function Preview({ htmlContent }: PreviewProps) {
  return (
    <section className="flex flex-col flex-1 border border-gray-200 dark:border-gray-700 rounded">
      <header className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-medium text-sm">
        Preview
      </header>
      <article
        className="markdown-body flex-1 overflow-auto p-4"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </section>
  );
}
