# Infinitygap intelligence brief & PDF export — technical handoff

This document describes how **market intelligence briefs** are authored, rendered in the browser, and exported to **branded PDFs**. It is written so another engineer or AI can **match the UI/UX quality** and **technology approach** in a different codebase without copying components line-for-line.

---

## 1. Executive summary

| Aspect | Choice |
|--------|--------|
| **Content** | Markdown prose + embedded **JSON blocks** in custom `:::` fences |
| **Parse** | Regex + `JSON.parse` → ordered list of **text** or **typed blocks** |
| **Render** | React: `react-markdown` for prose; dedicated views per block type |
| **PDF** | **`html2pdf.js`** ( **html2canvas** rasterizes DOM → **jsPDF** builds A4 PDF ) |
| **Strategy** | **Single HTML layout** for screen and export; PDF adds a programmatic **header/footer** and **export-only CSS** |

The briefs feel like **mini analyst reports**: KPI cards, comparison tables, framework grids, scored insights, phased roadmaps, and a composite **score ring** with breakdown bars—not a plain wall of text.

---

## 2. Source file map

| Concern | Path |
|---------|------|
| Block grammar & JSON extraction | `src/lib/parseBlocks.ts` |
| TypeScript types for all blocks | `src/lib/blockTypes.ts` |
| Markdown → segment renderer | `src/components/BlockRenderer.tsx` |
| Metrics (KPI cards) | `src/components/blocks/MetricsBlockView.tsx` |
| Comparison table | `src/components/blocks/ComparisonBlockView.tsx` |
| Framework (multi-column panels) | `src/components/blocks/FrameworkBlockView.tsx` |
| Insights (ranked, scored list) | `src/components/blocks/InsightsBlockView.tsx` |
| Steps (vertical timeline) | `src/components/blocks/StepsBlockView.tsx` |
| Score (ring + bars) | `src/components/blocks/ScoreBlockView.tsx` |
| PDF assembly & html2pdf config | `src/lib/exportIntelBriefPdf.ts` |
| Public logo path constant | `src/lib/brandLogo.ts` |
| Export trigger UI | `src/components/saved/DownloadIntelPdfButton.tsx` |
| Inline / block markdown helpers | `src/components/InlineMarkdown.tsx`, `src/lib/markdownNormalize.ts` |
| Dashboard charts (separate from brief blocks) | `src/components/ui/chart.tsx` (Recharts) |

---

## 3. Content format: `:::` blocks

Blocks are embedded in raw string content using this pattern:

```text
:::metrics
[ JSON array of metric objects ]
:::

:::score
{ JSON object for score block }
:::

Plain markdown paragraphs can appear before, between, or after blocks.
```

**Supported block types** (must match regex in `parseBlocks.ts`):

`metrics` · `comparison` · `framework` · `insights` · `steps` · `score`

Each block’s inner body is **JSON**:

- Parsed with `JSON.parse`.
- On failure, a small **repair** pass removes trailing commas and can swap single quotes—then parse again.
- If still invalid, the raw JSON is shown inside a fenced code block as text so the page does not crash.

---

## 4. Data shapes (schemas)

These match `src/lib/blockTypes.ts` (summarized for implementers).

### 4.1 `metrics`

Array of:

- `label` (string)  
- `value` (string)  
- `trend`: `"up"` \| `"down"` \| `"neutral"`  
- `delta` (string, e.g. `"+12% QoQ"`)

### 4.2 `comparison`

Object:

- `title` (string)  
- `headers` (string[])  
- `rows` (string[][]) — each inner array is one row; cells can hold markdown strings  
- `verdict` (optional string, markdown)

### 4.3 `framework`

Object:

- `title` (string)  
- `type` (string — shown as a small badge, e.g. methodology name)  
- `sections`: array of `{ label, color, items[] }`  
  - `color` is a **token** mapped in UI: `emerald`, `red`, `blue`, `amber`, `purple`, `cyan` (fallback: cyan).  
  - `items` are strings; may be rendered as inline or block markdown depending on content heuristics.

### 4.4 `insights`

Object:

- `title` (string)  
- `items`: array of `{ text, score, tag }`  
  - `text`: markdown  
  - `score`: number (used for sort and badge color)  
  - `tag`: string (e.g. `CRITICAL`, `OPPORTUNITY`) — drives pill styling via keyword heuristics

### 4.5 `steps`

Object:

- `title` (string)  
- `items`: array of `{ phase, duration, tasks[], status }`  
  - `status`: `"critical"` \| `"active"` \| `"pending"` \| `"complete"`  
  - `tasks`: string[] (markdown per line)

### 4.6 `score`

Object:

- `title`, `label`, `summary` (summary: markdown)  
- `score`, `maxScore` (numbers)  
- `breakdown`: array of `{ category, score }`

---

## 5. Rendering pipeline (browser)

### 5.1 Entry: `BlockRenderer`

Input: `ContentSegment[]` from `parseBlocks(content)`.

For each segment:

1. **`text`** — Wrapped in a prose container (`prose-infinitygap`, ~13px body). **ReactMarkdown** + **remark-gfm** with **custom components**:

   - **H1**: compact, semibold, primary tone.  
   - **H2**: smaller, uppercase, wide tracking — reads as **section labels**.  
   - **H3**: subtle subsection.  
   - **Lists**: custom bullet (small primary dot), relaxed line height.  
   - **Links**: primary color, external `target="_blank"`.  
   - **Code**: inline pill vs block in muted bordered box.  
   - **Blockquote**: left border primary, muted italic.  
   - **HR**: light separator.

2. **Structured types** — Routed to the matching `*BlockView` component with `data` cast from parsed JSON.

Vertical rhythm: outer `space-y-1`; individual blocks use `my-4` so sections breathe.

### 5.2 Visual language (shared across blocks)

- **Cards**: `glass-panel` class — frosted / bordered surfaces; often `hover:glow-border` on web.  
- **Icons**: **lucide-react** at ~16px beside small uppercase-style titles (`text-xs font-semibold tracking-wide`).  
- **Color semantics**: emerald = positive / complete, red = risk / critical, amber = caution, blue = informational tiers, primary = brand accent.  
- **Density**: information-rich but not cluttered; heavy use of **uppercase micro-labels** and **tabular numbers** where appropriate.

### 5.3 Per-block UI behavior

**Metrics (`MetricsBlockView`)**

- Responsive grid: 2 columns → 4 on large screens.  
- Each metric: micro label, large bold value, optional **trend chip** with icon (`TrendingUp` / `TrendingDown` / `Minus`) and colored background.

**Score (`ScoreBlockView`)**

- **Not Recharts**: custom **SVG** “donut” (two circles: background track + arc).  
- Arc length from `strokeDasharray` / `strokeDashoffset` from `score / maxScore`.  
- Center: big score + `/ max` caption.  
- Side panel: status **pill**, markdown summary, **horizontal bar chart** per breakdown row (div with width % and tier color from same helper as ring).

**Insights (`InsightsBlockView`)**

- Items **sorted by score descending**.  
- Each row: glass card; left **square badge** with score and tier border/bg; markdown body; **tag pill** with keyword-based colors (`critical`, `high`, `opportunity`, etc.).

**Comparison (`ComparisonBlockView`)**

- Outer glass panel; header with **Scale** icon + title.  
- **Horizontal scroll** on narrow viewports for wide tables.  
- Table: uppercase header row, primary tint on non-first columns, row borders, hover row background.  
- Optional **verdict** footer: top border, light primary tint background.

**Framework (`FrameworkBlockView`)**

- Title row: **Layers** icon + title + type badge.  
- **1 or 2 column grid** of panels; each section has dot + uppercase label + tinted border/bg from `colorMap`.  
- Bulleted items with colored dots; markdown in items.

**Steps (`StepsBlockView`)**

- Vertical **timeline**: column of status icons (`AlertCircle`, `Clock`, `Circle`, `CheckCircle2`) in circles, connector line to next step.  
- Per step: phase title, duration chip, task list with markdown.

---

## 6. PDF export pipeline

Implemented in **`src/lib/exportIntelBriefPdf.ts`**. Public API:

```ts
downloadIntelBriefPdf({
  contentElement: HTMLElement,  // DOM root to clone (must exist in document)
  documentTitle?: string,       // default: "Intelligence Brief"
})
```

### 6.1 High-level steps

1. **Theme** — `document.documentElement.classList.contains("dark")` → `"dark"` \| `"light"`.  
2. **Dynamic import** — `html2pdf.js` loaded only when exporting (code-split).  
3. **Wrapper element** — Off-screen `div` with:
   - `data-pdf-export="true"`  
   - Fixed **width 800px**, padding ~36–44px, `box-sizing: border-box`  
   - Classes: `pdf-export-scope`, theme (`dark` or not), `bg-background`, `text-foreground`, `antialiased`  
   - **Top border** 4px solid — brand orange (dark) vs blue (light) in HSL literals  
   - **Font**: `'DM Sans', 'Inter', system-ui, sans-serif'` on wrapper  
4. **Injected `<style>`** — Rules scoped under `[data-pdf-export="true"]` for:
   - `.pdf-export-blocks` text color  
   - **Glass panels**: strip `backdrop-filter`, force solid `background` from CSS variables  
   - **Tables**: collapse, borders, cell padding, header row background  
   - **Links**, **pre**, **blockquote** tuned for print rasterization  
5. **Header** (programmatic DOM, not React):
   - Flex row: **logo** `<img>` (`crossOrigin="anonymous"`, height 48px, src = `origin + BRAND_LOGO_PATH`) + title stack  
   - Title stack: small uppercase **brand line** (muted), **H1** (document title), subtitle “Showcase intelligence brief”  
   - Right column: “Generated” + localized full date/time string  
6. **Body** — `contentElement.cloneNode(true)` appended inside a div with class `pdf-export-blocks`.  
7. **Footer** — flex: left “∞ INFINITYGAP” + confidentiality / disclaimer; right UTC ISO-like stamp.  
8. **Mount** — `document.body.appendChild(wrapper)`.  
9. **Wait** — `document.fonts.ready`; logo load; `waitForImages` on all `img` in subtree.  
10. **html2pdf** — `.set(options).from(wrapper).save()`.  
11. **Cleanup** — `removeChild(wrapper)` in `finally`.

### 6.2 html2pdf / html2canvas / jsPDF options (as implemented)

- **Margins**: `[10, 10, 10, 10]` (mm).  
- **Image**: JPEG, quality `0.98`.  
- **enableLinks**: `true`.  
- **html2canvas**: `scale: 2`, `useCORS: true`, `allowTaint: false`, `backgroundColor` white or black by theme, `windowWidth: 800`, `scrollY: -window.scrollY`.  
- **jsPDF**: `unit: "mm"`, `format: "a4"`, `orientation: "portrait"`.  
- **pagebreak**: `["avoid-all", "css", "legacy"]`.  
- **Filename**: `Infinitygap-Intel-Brief-YYYY-MM-DD.pdf`.

### 6.3 Trigger from UI

`DownloadIntelPdfButton` resolves `document.getElementById(contentRootId)`, then calls `downloadIntelBriefPdf`. Parent views (e.g. trial showcase, region analytics) must expose a **stable `id`** on the root of the brief content.

---

## 7. Branding & assets

- **Logo path**: `BRAND_LOGO_PATH` in `src/lib/brandLogo.ts` (e.g. `/Final Logo.png` under `public/`).  
- PDF header uses **absolute URL** so canvas can fetch the image when CORS allows.  
- Header copy references product URL (as in `exportIntelBriefPdf.ts`); keep in sync with deployment domain if you fork.

---

## 8. Charts: brief blocks vs dashboards

- **Intel brief blocks** intentionally favor **SVG** (score ring) and **CSS width bars** (breakdown) so **html2canvas** captures them predictably.  
- **Recharts** is used elsewhere (`chart.tsx` + dashboard pages) for interactive analytics; those are **not** the core of the `:::…` brief PDF pipeline.  
- If you add Recharts inside exportable briefs, test carefully: some SVG/compositing features rasterize poorly; prefer simple charts or pre-rendered static assets for PDF-critical views.

---

## 9. Replicating this stack elsewhere (checklist)

1. **Authoring**: Either keep `:::type` + JSON, or use MDX / custom components—same idea: **structured segments** interleaved with markdown.  
2. **Render**: One React tree (or equivalent) that maps types to **small, focused** presentational components.  
3. **Prose**: Markdown with **strict typographic mapping** (small base size, clear H2 section strips, readable lists).  
4. **PDF**:  
   - Build a **fixed-width** export root (e.g. 800px).  
   - Add **print-specific CSS** (no backdrop blur; solid surfaces; explicit table borders).  
   - **Wait for fonts and images**.  
   - Use **html2pdf.js** or the same pair (**html2canvas** + **jsPDF**) with **scale ≥ 2** for sharpness.  
5. **Legal / product footer**: Disclaimer line in footer; UTC timestamp for auditability.

---

## 10. Known limitations & pitfalls

| Issue | Mitigation |
|-------|------------|
| `backdrop-filter` smears or blanks in canvas | Stripped in PDF scope; solid backgrounds |
| Blurry PDF text | Increase `scale`; avoid odd subpixel layouts |
| Logo missing in PDF | CORS + absolute URL; `crossOrigin` on img |
| Very long briefs | Page breaks; `pagebreak` modes; consider splitting sections |
| Dark mode contrast | Separate HSL constants for light/dark in export wrapper |

---

## 11. Related npm packages

- `html2pdf.js` — PDF generation from HTML  
- `react-markdown`, `remark-gfm` — prose  
- `tailwindcss` — utility styling (including CSS variables for theme)  
- `lucide-react` — icons  
- `recharts` — charts in other parts of the app (not required for core brief blocks)

---

## 12. Regenerating this doc

This file is **hand-authored** from the current codebase. After large refactors, compare against:

- `src/lib/exportIntelBriefPdf.ts`  
- `src/components/BlockRenderer.tsx`  
- `src/lib/parseBlocks.ts`  
- `src/lib/blockTypes.ts`  

---

*Last aligned with repository layout and behavior as of the doc’s addition to `docs/pdf-report-pipeline-handoff.md`.*
