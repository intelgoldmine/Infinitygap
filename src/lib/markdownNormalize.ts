/**
 * Pre-process AI/markdown strings so react-markdown parses emphasis reliably.
 * Models sometimes emit full-width asterisks or spaces inside ** ** which breaks GFM.
 */
export function normalizeMarkdownInput(content: string): string {
  if (!content) return content;
  let s = content.replace(/\uFF0A/g, "*");
  s = s.replace(/\*\*\s+/g, "**").replace(/\s+\*\*/g, "**");
  return s;
}
