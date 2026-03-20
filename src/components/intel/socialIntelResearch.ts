/** Compact blob passed to deep-dive so research is grounded in the same live scrape + synthesis. */
export function buildSocialIntelResearchContext(data: unknown): string {
  const d = data as {
    signals_collected?: number;
    synthesis?: {
      breaking?: Array<{ headline?: string; detail?: string }>;
      opportunities_from_signals?: Array<{ title?: string; detail?: string }>;
    };
    signal_preview?: {
      reddit_local?: Array<{ title?: string; subreddit?: string; country?: string }>;
      youtube?: Array<{ title?: string; channel?: string }>;
      country_news?: Array<{ title?: string; country?: string; source?: string }>;
      outlet_rss?: Array<{ title?: string; country?: string; feed_host?: string }>;
    };
    countries_scraped?: string[];
  };
  if (!d?.synthesis && !d?.signal_preview) return "";

  const lines: string[] = [];
  if (typeof d.signals_collected === "number") {
    lines.push(`Total live signals ingested for this run: ${d.signals_collected}`);
  }
  if (d.countries_scraped?.length) {
    lines.push(`Country codes scraped: ${d.countries_scraped.join(", ")}`);
  }
  (d.synthesis?.breaking || []).slice(0, 5).forEach((b) => {
    if (b?.headline) lines.push(`Breaking (synthesized): ${b.headline} — ${(b.detail || "").slice(0, 280)}`);
  });
  (d.synthesis?.opportunities_from_signals || []).slice(0, 3).forEach((o) => {
    if (o?.title) lines.push(`Opportunity signal: ${o.title} — ${(o.detail || "").slice(0, 200)}`);
  });

  const p = d.signal_preview;
  if (p?.reddit_local?.length) {
    lines.push("Sample local subreddit posts (raw):");
    p.reddit_local.forEach((r) =>
      lines.push(`  r/${r.subreddit || "?"} [${r.country || "?"}]: ${(r.title || "").slice(0, 140)}`),
    );
  }
  if (p?.youtube?.length) {
    lines.push("Sample YouTube titles (raw):");
    p.youtube.forEach((y) => lines.push(`  @${y.channel || "?"}: ${(y.title || "").slice(0, 140)}`));
  }
  if (p?.country_news?.length) {
    lines.push("Sample Google News by country (raw):");
    p.country_news.forEach((n) => lines.push(`  [${n.country || "?"}] ${(n.title || "").slice(0, 140)}`));
  }
  if (p?.outlet_rss?.length) {
    lines.push("Sample direct outlet RSS (raw):");
    p.outlet_rss.forEach((o) =>
      lines.push(`  [${o.country || "?"} ${o.feed_host || ""}] ${(o.title || "").slice(0, 140)}`),
    );
  }

  return lines.join("\n").slice(0, 12000);
}
