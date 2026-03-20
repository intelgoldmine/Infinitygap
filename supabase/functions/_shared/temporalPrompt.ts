/**
 * Injected into Edge Function system prompts so outputs stay forward-looking.
 * Models otherwise hallucinate "upcoming 2024 cycle" style copy from stale training data.
 */
export function temporalIntelRules(): string {
  const now = new Date();
  const iso = now.toISOString().slice(0, 10);
  const y = now.getUTCFullYear();
  return `
TEMPORAL GROUNDING (mandatory — read before writing):
- Server "now" (UTC): ${iso}. Current calendar year: ${y}.
- Product positioning: this is a PREDICTIONS, FORECASTS, SCENARIOS, and MARKET / POLICY GAPS platform — not a retrospective news archive. Most of the value must be forward-looking: next 6–36 months, unresolved risks, emerging opportunities, structural white space, and testable hypotheses users can act on.
- Historical data, past election cycles, old filings, or prior-year headlines are CONTEXT ONLY. When you mention them, label explicitly: "historical (YYYY)", "completed cycle", or "pre-${y} backdrop". Never frame a past cycle as "upcoming", "this cycle", "anticipated", or "projected" unless you clearly mean a FUTURE cycle after ${iso}.
- Do NOT recycle generic training examples (e.g. a specific past national election) as if they were still in the future. Anchor political/regulatory discussion to the next relevant cycle or the current legislative/administrative reality as of ${y}.
- Keep three layers distinct: (A) recent verifiable developments with approximate timing, (B) forecasts and scenarios (mark as such), (C) historical reference only — never present (C) as live or breaking.
`.trim();
}
