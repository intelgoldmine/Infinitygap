import { Link } from "react-router-dom";
import { BrandHexMark } from "@/components/BrandHexMark";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_USD_MONTHLY } from "@/lib/pricing";
import { industries } from "@/lib/industryData";
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Layers,
  Radio,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

const totalFlows = industries.reduce((a, i) => a + i.subFlows.length, 0);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.35] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 100% 80% at 50% -40%, hsl(185 90% 48% / 0.18) 0%, transparent 55%)",
            "radial-gradient(ellipse 50% 45% at 100% 10%, hsl(265 82% 55% / 0.12) 0%, transparent 50%)",
            "radial-gradient(ellipse 45% 40% at 0% 90%, hsl(210 100% 56% / 0.1) 0%, transparent 55%)",
          ].join(", "),
        }}
      />

      {/* Nav */}
      <header className="relative z-20 border-b border-border/40 bg-background/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <BrandHexMark size="md" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base truncate leading-tight">
                <BrandWordmark />
              </span>
              <span className="text-[9px] font-mono text-muted-foreground tracking-wide">Maverick AI inside</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" className="text-xs font-mono" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button size="sm" className="text-xs font-mono gap-1" asChild>
              <Link to="/auth?mode=signup">
                Get started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.15em] text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Intel GoldMine · Maverick AI agent
          </div>

          <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-4xl">
            The intelligence layer for{" "}
            <span className="text-gradient-primary">capital, strategy,</span>
            <br className="hidden sm:block" /> and every industry money flow
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            <strong className="text-foreground font-semibold">Intel GoldMine</strong> is your intelligence platform.{" "}
            <strong className="text-foreground font-semibold">Maverick</strong> is the AI agent that maps {industries.length} industries and{" "}
            {totalFlows}+ money flows, pulls live signals from 11+ sources, and produces structured research — cross-industry scans, deep dives,
            and your own Intel Lab.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" className="h-12 px-8 text-sm font-semibold gap-2 shadow-lg shadow-primary/20" asChild>
              <Link to="/auth?mode=signup">
                Start Intel GoldMine
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-sm border-border/80 bg-card/50" asChild>
              <Link to="/auth">I already have an account</Link>
            </Button>
          </div>

          <div className="mt-14 grid sm:grid-cols-3 gap-4 max-w-3xl">
            {[
              { n: `${industries.length}`, l: "Industries modeled" },
              { n: `${totalFlows}+`, l: "Money flows tracked" },
              { n: "11+", l: "Live data sources" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-border/50 bg-card/40 px-4 py-3">
                <p className="text-2xl font-bold tabular-nums text-foreground">{s.n}</p>
                <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/40 bg-card/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary text-center mb-3">Inside the platform</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-center font-brand max-w-2xl mx-auto">
              Everything you need to see around corners
            </h2>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: Radio,
                  title: "Live market feed",
                  body: "Crypto, FX, commodities, VC & macro signals — refreshed on a steady cadence in one command center.",
                },
                {
                  icon: Globe2,
                  title: "Geo-scoped research",
                  body: "Snapshots and analysis tuned to regions you care about — not generic US-only takes.",
                },
                {
                  icon: BarChart3,
                  title: "Structured AI outputs",
                  body: "Metrics, frameworks, comparisons, and scores — not walls of unstructured text.",
                },
                {
                  icon: Layers,
                  title: "Intel Lab",
                  body: "Define primary vs secondary lanes, add free-text context, and run custom briefs plus follow-ups.",
                },
                {
                  icon: Zap,
                  title: "Cross-industry mode",
                  body: "Find gaps, deals, and bridges across all sectors in a single intelligence pass.",
                },
                {
                  icon: Shield,
                  title: "Built for operators",
                  body: "For founders, investors, and analysts who need evidence-backed views fast.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border/50 bg-background/60 p-5 hover:border-primary/25 hover:glow-border transition-all duration-300"
                >
                  <f.icon className="w-5 h-5 text-primary mb-3" />
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-border/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="max-w-xl mx-auto rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/10 via-card to-card p-8 sm:p-10 text-center glow-border-strong">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">Simple pricing</p>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-5xl sm:text-6xl font-bold tabular-nums">${SUBSCRIPTION_USD_MONTHLY}</span>
                <span className="text-xl text-muted-foreground font-medium">/month</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Full <strong className="text-foreground font-medium">Intel GoldMine</strong> access — Maverick runs live intel, AI briefs, deep
                dives, cross-industry analysis, and Intel Lab. Billed by your workspace; talk to your admin to activate.
              </p>
              <Button size="lg" className="mt-8 h-12 px-10 font-semibold gap-2" asChild>
                <Link to="/auth?mode=signup">
                  Get access
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Already subscribed?{" "}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border/40 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold font-brand">Ready to see your markets clearly?</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
              Create an account or sign in — your dashboard, live feed, and industries unlock after authentication.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="h-12 px-8 gap-2" asChild>
                <Link to="/auth?mode=signup">Create free account</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/40 py-6 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <BrandHexMark size="sm" />
            <span className="font-mono text-foreground">Intel GoldMine</span>
          </div>
          <p className="text-center sm:text-right">
            Maverick AI · World industry money-flow intelligence · Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
