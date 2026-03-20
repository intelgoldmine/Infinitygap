import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BLOCK_INSTRUCTIONS = `
## STRUCTURED OUTPUT BLOCKS

You are a world-class market opportunity analyst. Your responses MUST contain structured data blocks using this exact syntax:

### METRICS BLOCK
:::metrics
[{"label":"Addressable Market","value":"$4.2T","trend":"up","delta":"+12.3%"}]
:::

### COMPARISON BLOCK
:::comparison
{"title":"...","headers":["Criteria","A","B"],"rows":[["Revenue Potential","$2B","$500M"]],"verdict":"..."}
:::

### FRAMEWORK BLOCK
:::framework
{"title":"Opportunity Analysis","type":"swot","sections":[{"label":"Strengths","color":"emerald","items":["..."]}]}
:::

### INSIGHTS BLOCK
:::insights
{"title":"Key Findings","items":[{"text":"...","score":9,"tag":"High ROI"}]}
:::

### STEPS BLOCK
:::steps
{"title":"Exploitation Roadmap","items":[{"phase":"Phase 1","duration":"Weeks 1-4","tasks":["..."],"status":"critical"}]}
:::

### SCORE BLOCK
:::score
{"title":"Opportunity Score","score":7.8,"maxScore":10,"label":"Strong Play","summary":"...","breakdown":[{"category":"Market Size","score":9}]}
:::

RULES:
1. ALWAYS use 3-5 structured blocks per report
2. JSON must be valid
3. Put narrative text BETWEEN blocks
4. Be extremely specific with dollar amounts, margins, company names, market sizes
5. Score and rate EVERY opportunity
6. The ::: delimiters must be on their own line
7. NEVER label blocks before them — flow naturally into ::: syntax
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, context, industryName, subFlowName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are NEXUS ATLAS, an elite MONEY-MAKING intelligence engine. You produce comprehensive business opportunity reports that a private equity firm would pay $100,000 for.

${BLOCK_INSTRUCTIONS}

Your reports MUST include:
1. Executive summary (2-3 sentences on the MONEY opportunity)
2. METRICS block with 4+ quantitative findings (market sizes, margins, growth rates, funding data)
3. INSIGHTS block with 4+ scored findings (each rated by ROI potential)
4. FRAMEWORK block — Opportunity SWOT: Strengths (why this gap exists), Weaknesses (barriers to entry), Opportunities (how to exploit), Threats (competitors/regulation)
5. COMPARISON block — compare exploitation strategies, existing players, or market approaches
6. STEPS block — concrete action plan with capital requirements, timeline, and milestones
7. SCORE block — overall opportunity score with breakdown: Market Size, Timing, Competition, Margins, Scalability, Risk

CRITICAL RULES:
- Every insight must connect to MAKING MONEY
- Cross-reference with adjacent industries — where can someone bring a solution from another field?
- Identify what has been tried before and WHY it failed (and what's changed)
- Include specific company names, pricing, and market data
- Rate urgency: is this window opening or closing?
- Estimate capital required and expected ROI timeline`;

    const userPrompt = `Generate a comprehensive BUSINESS OPPORTUNITY deep-dive on: "${topic}"

${industryName ? `Industry: ${industryName}` : ""}
${subFlowName ? `Money flow: ${subFlowName}` : ""}
${context ? `Context: ${context}` : ""}

ANALYZE EVERYTHING:
- What is the exact market gap and its dollar value?
- Who is currently trying to solve this and WHY are they failing?
- What solutions from OTHER industries could be applied here?
- What regulatory/technology/market changes make THIS the right moment?
- What's the minimum viable play (low capital) vs. the full play (high capital)?
- What are the unit economics? Customer acquisition cost? Lifetime value? Margins?
- Who are the ideal first customers and how do you reach them?
- What partnerships or acquisitions would accelerate this?
- What's the 12-month, 24-month, and 36-month projection?
- Historical parallels: what similar plays succeeded/failed and what can we learn?

Be RUTHLESSLY specific. No generic advice. Every recommendation must have a number attached.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
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
    const report = aiData.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("deep-dive error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
