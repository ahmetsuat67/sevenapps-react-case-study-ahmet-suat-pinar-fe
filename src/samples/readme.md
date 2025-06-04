# Markdown Playground

**Markdown Playground** is a client-side Next.js application that provides a live, responsive Markdown editor with real-time preview. It includes features such as sample file loading, light/dark theme toggling, keyboard shortcuts, full-screen editing/preview, IndexedDB persistence via Dexie.js, dynamic parser loading for performance, and HTML export.

---
## 🌐 Live Demo

Try the app online at [Live Markdown Playground](https://livemarkdownplayground.vercel.app/)  
(or copy & paste: `https://livemarkdownplayground.vercel.app/`)
---
## ✨ Features

- 📄 **Live Markdown Editing & Preview**

  - Type Markdown on the left pane and see the HTML-rendered output instantly on the right pane.
  - Supports GitHub Flavored Markdown (GFM) syntax (tables, task lists, strikethrough, etc.).
  - Syntax highlighting for code blocks via `rehype-highlight`.

- 🎨 **Light/Dark Theme Toggle**

  - Uses a custom hook to detect and apply `data-theme="light" | "dark"`.
  - Persists user’s theme selection in IndexedDB so that it remains after refresh.

- 🔀 **Sample File Selector**

  - Includes three built-in `.md` samples: `intro.md`, `features.md`, and `usage.md`.
  - Dropdown allows you to switch between samples; the last-selected sample and its content are saved in IndexedDB.

- 💾 **IndexedDB Persistence (Dexie.js)**

  - All Markdown content (per sample) is auto-saved with a 500 ms debounce.
  - Uses Dexie.js to store each sample’s content under its own key (e.g., `"intro"`, `"features"`, `"usage"`).
  - On load, the app retrieves both the last-used sample name and that sample’s content.

- ⌨️ **Keyboard Shortcuts**

  - `Ctrl + S` / `Cmd + S`: Manually save the current sample’s Markdown to IndexedDB.
  - `Ctrl + 1`, `Ctrl + 2`, `Ctrl + 3`: Instantly switch to `intro`, `features`, or `usage`.
  - `Esc`: Exit full-screen mode.
  - Floating “⌨️” button opens a modal listing all available shortcuts.

- 🔳 **Full-Screen Mode**

  - Each pane (Editor or Preview) can be toggled to full-screen.
  - In full-screen, `Esc` will exit back to the split view.

- 📥 **Export HTML**

  - “Download HTML” button serializes the current preview into a standalone `.html` file.
  - Includes a minimal `<head>` with basic styles and Dark/Light mode support.

- 🚀 **Dynamic Parser Loading (Chunk Splitting)**

  - The Markdown-to-HTML pipeline (Unified, `remark-parse`, `remark-rehype`, `rehype-sanitize`, `rehype-stringify`, GFM, highlight) is loaded via dynamic imports.
  - Ensures the main bundle stays small; parser code is only downloaded when needed.

- 📱 **Responsive Design**

  - On desktop (≥ 768 px), Editor and Preview panes display side-by-side.
  - On mobile (< 768 px), panes stack vertically for easy scrolling.
  - Each pane has a minimum width (320 px) on desktop and a fixed aspect ratio to preserve readability.

---

## 🧱 Tech Stack

| Layer              | Tools / Libraries                                                                |
| ------------------ | -------------------------------------------------------------------------------- |
| Framework          | Next.js 15 (App Router)                                                          |
| Language           | TypeScript                                                                       |
| Styling            | Tailwind CSS 4                                                                   |
| Persistence        | IndexedDB via Dexie.js                                                           |
| Markdown Parser    | Unified + `remark-parse`, `remark-rehype`, `rehype-sanitize`, `rehype-stringify` |
| Extensions         | `remark-gfm` (GitHub Flavored Markdown), `rehype-highlight` (code syntax)        |
| Routing            | Dynamic imports + `next/dynamic`                                                 |
| Utilities          | `useDebouncedValue` hook for debounce                                            |
| Linter & Formatter | ESLint (with Next.js config)                                                     |

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ahmetsuat67/sevenapps-react-case-study-ahmet-suat-pinar-fe.git
   cd sevenapps-react-case-study-ahmet-suat-pinar-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000) by default.

---

## 🚀 Build & Start (Production)

1. **Build the app**

   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

2. **Start in production mode**

   ```bash
   npm run start
   # or
   yarn start
   # or
   pnpm start
   ```

   The production server also listens on [http://localhost:3000](http://localhost:3000).

---

## 📚 Project Structure

```
├── next.config.js         # Next.js configuration (raw-loader for .md files, dynamic imports)
├── package.json
├── postcss.config.js
├── tsconfig.json
├── public/
│   └── (static assets, if any)
└── src/
    ├── app/
    │   ├── globals.css    # Global Tailwind & CSS resets
    │   ├── layout.tsx     # Root layout (font imports, HTML <head> metadata)
    │   └── page.tsx       # Main Home component with Editor + Preview
    ├── components/        # UI components
    │   ├── Editor.tsx
    │   ├── Preview.tsx
    │   ├── SampleSelector.tsx
    │   ├── ThemeSwitcher.tsx
    │   ├── ShortcutsButton.tsx
    │   └── ExportHTMLButton.tsx
    ├── hooks/             # Custom React hooks
    │   ├── useIndexedDB.ts
    │   └── useDebouncedValue.ts
    samples/
│   ├── intro.md
│   ├── features.md
│   └── usage.md
    └──types/             # Custom TypeScript type declarations (e.g. for `.md?raw` imports)
        └── declarations.d.ts
```

- **`samples/intro.md`**, **`samples/features.md`**, **`samples/usage.md`**
  Default Markdown files loaded by SampleSelector.
- **`Editor.tsx`**
  A `<textarea>` for editing Markdown, “Editor” header with full-screen toggle button.
- **`Preview.tsx`**
  A sanitized, highlighted `<article>` to render HTML. Full-screen toggle included.
- **`ThemeSwitcher.tsx`**
  Toggles between light/dark, setting `data-theme` on `<html>` and persisting to IndexedDB.
- **`ShortcutsButton.tsx`**
  Floating ☰ button that opens a modal listing keyboard shortcuts. Responds to light/dark.
- **`ExportHTMLButton.tsx`**
  Serializes the current `htmlContent` into a downloadable `.html` file with basic styling.
- **`useIndexedDB.ts`**
  Wraps Dexie.js with generic `getItem` / `setItem` for both `"settings"` and `"documents"` stores.
- **`useDebouncedValue.ts`**
  Returns a debounced version of state to throttle parse/save.

---

## 📖 How It Works

1. **App Initialization**

   - On mount, `getSetting("lastSample")` is called. If found, `selectedSample` is set. Otherwise, fallback to `"intro"`.
   - Then, `getDocItem(sampleName)` fetches the Markdown from IndexedDB. If none, the built-in `.md` sample is used.

2. **Editing & Debouncing**

   - As the user types, `markdown` state updates immediately.
   - After 500 ms of no typing, the debounced value triggers:

     - The Markdown is parsed (via dynamically imported `unified`, `remark`, `rehype`).
     - Parsed HTML is stored in `htmlContent`.
     - The debounced Markdown is saved to IndexedDB under the key of the current sample.

3. **Keyboard Shortcuts**

   - `Ctrl + S`: Immediately calls `setDocItem(sampleName, markdown)` to save.
   - `Ctrl + 1/2/3`: Switches to `"intro"`/`"features"`/`"usage"`, updates `selectedSample`, and loads that sample’s content (saved or default).
   - `Esc`: Exits full-screen mode if active.

4. **Theme Switching**

   - Clicking the ThemeSwitcher toggles between `"light"` and `"dark"`.
   - The `<html data-theme="…">` attribute is updated, and Tailwind classes react accordingly.
   - The choice is saved in IndexedDB so that on reload, the same theme is reapplied.

5. **Full-Screen Mode**

   - Each pane (Editor or Preview) has a “⛶” button in its header.
   - Clicking it renders that pane in a fixed, full-viewport layout.
   - Pressing `Esc` exits full-screen.

6. **Export HTML**

   - Clicking “Download HTML” serializes the `htmlContent` into a standalone HTML document with minimal CSS.
   - A Blob is created and downloaded as `markdown-preview.html`.

---

## 🚧 Trade-Offs & Notes

- **IndexedDB Complexity**

  - Instead of storing a single “lastDoc”, we now store one record per sample. This ensures that each sample’s edits persist independently.

- **Dynamic Imports**

  - The Markdown parser is split into a separate chunk. This optimizes initial bundle size but introduces a small delay on first use (loading time visible).

- **No Server-Side Rendering for Parser**

  - Because we dynamically import the parsing libraries (`unified`, `remark`, etc.), parsing only happens client-side. SSR will not render the Markdown preview.

- **Debounce Delay**

  - We use a 500 ms debounce to balance performance with UX. You may adjust this value in `useDebouncedValue.ts`.

- **Theme Detection**

  - We rely on a `data-theme` attribute and Tailwind’s `dark:` classes. If you prefer OS-based `(prefers-color-scheme)`, you could adjust accordingly.

---

**Thank you for trying out Markdown Playground!**
Happy writing and testing your Markdown.
