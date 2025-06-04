"use client";
import { useEffect, useState } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import SampleSelector from "@/components/SampleSelector";
import useIndexedDB from "@/hooks/useIndexedDB";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from "rehype-sanitize";

import intro from "@/samples/intro.md";
import features from "@/samples/features.md";
import usage from "@/samples/usage.md";


export default function Home() {
  const [markdown, setMarkdown] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const { setItem, getItem } = useIndexedDB<string>("documents");
  const samples = ["intro", "features", "usage"];
  const [selectedSample, setSelectedSample] = useState(samples[0]);

  // Sample content mapping
  const samplesContent: Record<string, string> = { intro, features, usage };

  useEffect(() => {
    getItem("lastDoc").then((saved) => {
      if (saved) setMarkdown(saved);
      else fetchSample(samples[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(markdown)
      .then((file) => setHtmlContent(String(file)));
    setItem("lastDoc", markdown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdown]);

  // <<--- İşte burada ---->>
  const fetchSample = (sample: string) => {
    setMarkdown(samplesContent[sample]);
  };

  const handleSampleSelect = (sample: string) => {
    setSelectedSample(sample);
    fetchSample(sample);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 gap-4 bg-background text-foreground">
      <div className="flex justify-between">
        <SampleSelector
          samples={samples}
          selected={selectedSample}
          onSelect={handleSampleSelect}
        />
        <ThemeSwitcher />
      </div>
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <Editor markdown={markdown} onMarkdownChange={setMarkdown} />
        <Preview htmlContent={htmlContent} />
      </div>
    </div>
  );
}
