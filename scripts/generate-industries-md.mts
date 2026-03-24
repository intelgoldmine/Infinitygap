import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { industries } from "../src/lib/industryData.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "docs", "industries-and-subcategories.md");

function escCell(s: string): string {
  return s.replace(/\|/g, "\\|");
}

const lines: string[] = [];
lines.push("# Industries and money-flow subcategories");
lines.push("");
lines.push(
  "Canonical source in code: [`src/lib/industryData.ts`](../src/lib/industryData.ts) (`export const industries`).",
);
lines.push("");
lines.push("Regenerate this file after editing industry data:");
lines.push("");
lines.push("```bash");
lines.push("npm run docs:industries");
lines.push("```");
lines.push("");
lines.push("---");
lines.push("");
const subCount = industries.reduce((n, i) => n + i.subFlows.length, 0);
lines.push("| Metric | Count |");
lines.push("|--------|-------|");
lines.push(`| Industries | ${industries.length} |`);
lines.push(`| Money-flow subcategories (subFlows) | ${subCount} |`);
lines.push("");

for (const ind of industries) {
  lines.push(`## ${ind.name}`);
  lines.push("");
  lines.push(`- **ID:** \`${ind.id}\``);
  lines.push(`- **Slug:** \`${ind.slug}\``);
  lines.push(`- **Icon:** ${ind.icon}`);
  lines.push(`- **Description:** ${ind.description}`);
  lines.push("");
  lines.push("| Sub ID | Name | Short name |");
  lines.push("|--------|------|------------|");
  for (const sf of ind.subFlows) {
    lines.push(`| \`${sf.id}\` | ${escCell(sf.name)} | ${escCell(sf.shortName)} |`);
  }
  lines.push("");
}

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(outPath, lines.join("\n"), "utf8");
console.log("Wrote", outPath);
