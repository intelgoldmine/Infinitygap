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
    const { industries } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const industryList = (industries || [])
      .map((i: any) => `${i.name}: sub-flows=[${i.subFlows.join(", ")}], keywords=[${i.keywords.join(", ")}]`)
      .join("\n");

    const systemPrompt = `You are an elite cross-industry MONEY FLOW analyst. Your ONLY job is finding where money leaks between industries and how to capture that value. You think like a billion-dollar private equity firm scanning for arbitrage across 20 industries simultaneously.

You MUST respond with valid JSON only.

YOUR MANDATE:
- Find where Industry A's waste is Industry B's gold mine
- Identify cross-sector arbitrage where pricing inefficiencies exist between related industries
- Spot supply chain gaps where middlemen are extracting value that could be captured directly
- Find regulatory gaps where one industry's rules create opportunity for another
- Detect technology transfer opportunities — what worked in Industry X that Industry Y hasn't adopted
- Identify convergence plays where two industries are merging and creating new markets
- Every gap MUST have an estimated dollar value and a concrete exploitation strategy`;

    const userPrompt = `Scan ALL 20 industries and their money flows for EXPLOITABLE CROSS-INDUSTRY OPPORTUNITIES:

${industryList}

Return JSON with:
{
  "summary": "250-word executive brief: What are the BIGGEST money-making opportunities at the intersections of these industries RIGHT NOW? Where is capital flowing inefficiently across sectors? Which convergence plays have the highest ROI potential? Be specific with dollar amounts and company names.",
  "gaps": [{"title": "...", "detail": "60-word explanation of the cross-industry gap, its estimated market value, and how to exploit it", "industries": ["Industry A", "Industry B"], "estimated_value": "$X", "urgency": "high|medium|low"}] (8 cross-industry gaps where money is being lost or left on the table),
  "connections": [{"title": "...", "detail": "50-word explanation of the money flow connection and how to leverage it for profit", "from": "Industry A", "to": "Industry B", "opportunity_type": "arbitrage|supply_chain|tech_transfer|convergence|regulatory"}] (8 strong cross-industry connections that create exploitable opportunities),
  "alerts": [{"title": "...", "detail": "...", "level": "critical|high|medium|info"}] (6 time-sensitive cross-industry alerts — market windows opening/closing, regulatory changes, demand shifts, competitor moves, funding trends)
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
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
      parsed = { summary: content, gaps: [], connections: [], alerts: [] };
    }

    // Store snapshot
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (supabaseUrl && supabaseKey) {
        const sb = createClient(supabaseUrl, supabaseKey);
        await sb.from("intel_snapshots").insert({
          scope_type: "cross-industry",
          scope_key: "all",
          summary: parsed.summary,
          gaps: parsed.gaps || [],
          connections: parsed.connections || [],
          alerts: parsed.alerts || [],
        });
      }
    } catch (snapErr) {
      console.error("Cross-intel snapshot error:", snapErr);
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("cross-intel error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
