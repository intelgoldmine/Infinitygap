import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { industry, subFlow, keywords, detailed } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const keywordStr = (keywords || []).slice(0, 8).join(", ");
    const scope = subFlow ? `the "${subFlow}" money flow within the ${industry} industry` : `the ${industry} industry broadly`;

    const systemPrompt = `You are a ruthless market intelligence analyst who finds MONEY-MAKING OPPORTUNITIES. Your job is to identify exploitable gaps in money flows, underserved markets, arbitrage opportunities, and emerging plays that someone with capital could leverage RIGHT NOW.

You think like a private equity analyst, a venture capitalist, and a hedge fund strategist combined. Every gap you find must have a clear path to profit. You cross-reference industries to find where value leaks between sectors.

You MUST respond with valid JSON only — no markdown, no explanation outside the JSON.

KEY PRINCIPLES:
- Every gap must include estimated addressable market value
- Rate each opportunity by urgency (window closing), capital required, and expected ROI
- Identify who's already trying (and failing) and WHY they're failing
- Connect to adjacent industries that could provide unfair advantages
- Flag regulatory tailwinds/headwinds that create timing opportunities
- Note historical parallels — what worked before in similar situations`;

    const userPrompt = detailed
      ? `Analyze ${scope} for EXPLOITABLE MONEY-MAKING OPPORTUNITIES. Keywords: ${keywordStr}.

Return JSON with these exact keys:
{
  "analysis": "250-word deep analysis: Where is money flowing? Where is it STUCK? Where are the biggest inefficiencies? Who is overpaying? Who is underserved? What's about to break open? Be ruthlessly specific with numbers, company names, and dollar amounts.",
  "news": [{"title": "...", "summary": "30-word summary of why this matters for making money"}] (5 recent developments that create opportunities),
  "gaps": [{"title": "...", "detail": "60-word explanation: What's the gap, its estimated market value, why it exists, and how to exploit it", "value": "$X estimate", "urgency": "high|medium|low", "capital_needed": "low|medium|high"}] (6 exploitable gaps with profit potential),
  "alerts": [{"title": "...", "detail": "...", "level": "critical|high|medium|info"}] (4 time-sensitive market alerts — regulations changing, competitors failing, demand spikes, supply disruptions),
  "liveData": {"metric_name": value} (8 relevant quantitative metrics — market sizes, margins, growth rates, funding rounds, pricing trends, conversion rates, churn rates)
}`
      : `Give a money-flow brief for ${scope}. Keywords: ${keywordStr}.

Return JSON:
{
  "analysis": "150-word overview: Where does money flow in this space? Where are the biggest leaks, inefficiencies, and underserved segments? What's the smartest play right now?",
  "news": [{"title": "...", "summary": "..."}] (3 developments creating opportunities),
  "gaps": [{"title": "...", "detail": "...", "value": "$X estimate"}] (3 major exploitable gaps with estimated values)
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited, please wait" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { analysis: content, news: [], gaps: [], alerts: [], liveData: {} };
    }

    // Store snapshot
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (supabaseUrl && supabaseKey) {
        const sb = createClient(supabaseUrl, supabaseKey);
        await sb.from("intel_snapshots").insert({
          scope_type: subFlow ? "subflow" : "industry",
          scope_key: subFlow ? `${industry}::${subFlow}` : industry,
          analysis: parsed.analysis,
          gaps: parsed.gaps || [],
          alerts: parsed.alerts || [],
          live_data: parsed.liveData || {},
          news: parsed.news || [],
        });
      }
    } catch (snapErr) {
      console.error("Snapshot save error:", snapErr);
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("industry-intel error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
