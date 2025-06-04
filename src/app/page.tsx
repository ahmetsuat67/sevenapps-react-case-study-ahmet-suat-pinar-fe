"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Editor from "@/components/Editor";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import SampleSelector from "@/components/SampleSelector";
import ShortcutsButton from "@/components/ShortcutsButton";
import useIndexedDB from "@/hooks/useIndexedDB";
import example from "@/samples/example.md";
import intro from "@/samples/intro.md";
import features from "@/samples/features.md";
import usage from "@/samples/usage.md";
import readme from "@/samples/readme.md";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import dynamic from "next/dynamic";
import ExportHTMLButton from "@/components/ExportHTMLButton";

const Preview = dynamic(() => import("@/components/Preview"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const parseMarkdown = async (markdown: string): Promise<string> => {
  const [
    { unified },
    remarkParse,
    remarkRehype,
    rehypeStringify,
    rehypeSanitize,
    remarkGfm,
    rehypeHighlight,
  ] = await Promise.all([
    import("unified"),
    import("remark-parse"),
    import("remark-rehype"),
    import("rehype-stringify"),
    import("rehype-sanitize"),
    import("remark-gfm"),
    import("rehype-highlight"),
  ]);

  const file = await unified()
    .use(remarkParse.default)
    .use(remarkRehype.default)
    .use(rehypeSanitize.default)
    .use(remarkGfm.default)
    .use(rehypeHighlight.default, { detect: true, ignoreMissing: true })
    .use(rehypeStringify.default)
    .process(markdown);

  return String(file);
};

export default function Home() {
  const { setItem: setDocItem, getItem: getDocItem } =
    useIndexedDB<string>("documents");
  const { setItem: setSetting, getItem: getSetting } =
    useIndexedDB<string>("settings");

  const samples = useMemo(
    () => ["readme","example","intro", "features", "usage"],
    []
  );

  const samplesContent: Record<string, string> = useMemo(
    () => ({
      readme,
      example,
      intro,
      features,
      usage,
    }),
    []
  );

  const [selectedSample, setSelectedSample] = useState(samples[0]);
  const [markdown, setMarkdown] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [editorFullscreen, setEditorFullscreen] = useState(false);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);

  const debouncedMarkdown = useDebouncedValue(markdown, 500);

  useEffect(() => {
    getSetting("lastSample").then((savedSample) => {
      const safeSample =
        savedSample && samples.includes(savedSample) ? savedSample : samples[0];
      setSelectedSample(safeSample);

      getDocItem(safeSample).then((savedDoc) => {
        if (
          savedDoc !== null &&
          savedDoc !== undefined &&
          savedDoc.trim() !== ""
        ) {
          setMarkdown(savedDoc);
        } else {
          setMarkdown(samplesContent[safeSample]);
        }
      });
    });
  }, []);

  const handleSampleSelect = useCallback(
    (sample: string) => {
      setSelectedSample(sample);
      setSetting("lastSample", sample);
      getDocItem(sample).then((savedDoc) => {
        if (
          savedDoc !== null &&
          savedDoc !== undefined &&
          savedDoc.trim() !== ""
        ) {
          setMarkdown(savedDoc);
        } else {
          setMarkdown(samplesContent[sample]);
        }
      });
    },
    [getDocItem, setSetting, samplesContent]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();

        setDocItem(selectedSample, markdown);
      }

      if ((e.ctrlKey || e.metaKey) && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        const idx = Number(e.key) - 1;
        const sample = samples[idx];
        if (sample) {
          setSelectedSample(sample);
          setSetting("lastSample", sample);

          getDocItem(sample).then((savedDoc) => {
            if (
              savedDoc !== null &&
              savedDoc !== undefined &&
              savedDoc.trim() !== ""
            ) {
              setMarkdown(savedDoc);
            } else {
              setMarkdown(samplesContent[sample]);
            }
          });
        }
      }

      if (e.key === "Escape") {
        if (editorFullscreen) setEditorFullscreen(false);
        if (previewFullscreen) setPreviewFullscreen(false);
      }
    },
    [
      markdown,
      samples,
      samplesContent,
      setSetting,
      setDocItem,
      selectedSample,
      getDocItem,
      editorFullscreen,
      previewFullscreen,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    let cancelled = false;

    parseMarkdown(debouncedMarkdown).then((html) => {
      if (!cancelled) setHtmlContent(html);
    });

    setDocItem(selectedSample, debouncedMarkdown);

    return () => {
      cancelled = true;
    };
  }, [debouncedMarkdown, selectedSample, setDocItem]);

  if (editorFullscreen) {
    return (
      <>
        <Editor
          markdown={markdown}
          onMarkdownChange={setMarkdown}
          fullscreen
          onToggleFullscreen={() => setEditorFullscreen(false)}
        />
        <ShortcutsButton />
      </>
    );
  }
  if (previewFullscreen) {
    return (
      <>
        <Preview
          htmlContent={htmlContent}
          fullscreen
          onToggleFullscreen={() => setPreviewFullscreen(false)}
        />
        <ShortcutsButton />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4 gap-4 bg-background text-foreground">
      <div className="flex justify-between">
        <SampleSelector
          samples={samples}
          selected={selectedSample}
          onSelect={handleSampleSelect}
        />
        <div className="flex gap-2">
          <ExportHTMLButton htmlContent={htmlContent} />
          <ThemeSwitcher />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <Editor
          markdown={markdown}
          onMarkdownChange={setMarkdown}
          onToggleFullscreen={() => setEditorFullscreen(true)}
        />
        <Preview
          htmlContent={htmlContent}
          onToggleFullscreen={() => setPreviewFullscreen(true)}
        />
      </div>
      <ShortcutsButton />
    </div>
  );
}
