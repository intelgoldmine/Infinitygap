import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BrandHexMark } from "@/components/BrandHexMark";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_USD_MONTHLY } from "@/lib/pricing";
import { industries } from "@/lib/industryData";
import { Reveal } from "@/components/motion/Reveal";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  Globe2,
  Layers,
  LayoutGrid,
  Radio,
  Shield,
  TrendingUp,
  Zap,
  PlayCircle,
  FlaskConical,
  BadgeCheck,
  Star,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const totalFlows = industries.reduce((a, i) => a + i.subFlows.length, 0);

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Head of Strategy, Fintech",
    text: "Intel GoldMine replaced three separate tools for us. The cross-industry connections alone justify the cost.",
  },
  {
    name: "Marcus T.",
    role: "VC Partner",
    text: "I use the Intel Lab before every investment committee. The depth of analysis is remarkable.",
  },
  {
    name: "Amara O.",
    role: "Policy Analyst",
    text: "Finally, market intelligence that actually understands emerging markets. Geo-scoped analysis is a game-changer.",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15]);
  const marqueeItems = [...industries, ...industries];

  return (
    <div className="min-h-screen bg-[hsl(40_18%_98%)] text-foreground flex flex-col relative overflow-x-hidden">
      {/* Nav — sits on dark hero */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-40 border-b border-white/10 bg-[hsl(226_58%_11%)]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[hsl(226_58%_11%)]/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[68px] sm:h-[72px] flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <BrandHexMark size="md" variant="onDark" />
            <BrandWordmark className="text-base sm:text-lg truncate" variant="onDark" />
          </Link>
          <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium">
            {[
              ["Explore", "#explore"],
              ["Features", "#features"],
              ["How it works", "#how-it-works"],
              ["Pricing", "#pricing"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 hidden sm:inline-flex"
              asChild
            >
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button
              size="sm"
              className="text-sm font-semibold gap-1.5 rounded-full px-4 sm:px-6 h-9 sm:h-10 bg-[hsl(38_92%_50%)] text-[hsl(226_58%_12%)] hover:bg-[hsl(38_92%_46%)] shadow-lg shadow-black/25 border border-white/10"
              asChild
            >
              <Link to="/auth?mode=signup">
                Get started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 flex-1">
        {/* Hero — full-bleed dark */}
        <section ref={heroRef} className="relative overflow-hidden bg-[hsl(226_58%_10%)] text-white">
          <div className="absolute inset-0 landing-hero-glow pointer-events-none" />
          <div className="absolute inset-0 landing-dot-light opacity-60 pointer-events-none" />
          <div className="absolute inset-0 landing-hero-vignette pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(140vw,900px)] h-[min(140vw,900px)] rounded-full bg-[hsl(226_65%_35%)]/25 blur-[120px] pointer-events-none" />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 lg:pt-16 pb-0">
              <p className="text-center lg:text-left text-[13px] sm:text-sm text-white/65 font-medium mb-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-white/95 shadow-sm">
                  <Activity className="w-3.5 h-3.5 text-[hsl(38_90%_58%)]" />
                  Maverick AI · live pipelines · geo snapshots
                </span>
                <span className="hidden sm:inline text-white/25">·</span>
                <span className="text-white/55 max-w-md sm:max-w-none">
                  Evidence-backed intelligence — not another noise feed.
                </span>
              </p>

              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-12 xl:gap-16 items-center"
              >
                <div className="text-center lg:text-left">
                  <motion.div variants={fadeUp} className="mb-5 sm:mb-6 flex justify-center lg:justify-start">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-3xl bg-[hsl(38_90%_50%)]/25 blur-3xl scale-125" />
                      <BrandHexMark size="lg" variant="onDark" className="relative w-[4.5rem] h-[4.5rem] sm:w-24 sm:h-24 drop-shadow-2xl" />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[13px] sm:text-sm text-white/80 mb-6 shadow-inner"
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="font-semibold text-white">Live</span>
                    <span className="text-white/25">·</span>
                    <span className="text-[hsl(38_90%_62%)] font-semibold">Research-grade briefs</span>
                  </motion.div>

                  <motion.h1
                    variants={fadeUp}
                    className="font-display text-[2.35rem] sm:text-5xl md:text-6xl xl:text-[3.65rem] font-bold tracking-[-0.03em] leading-[1.05]"
                  >
                    Turn noise into{" "}
                    <span className="text-gradient-gold bg-clip-text text-transparent">decisions</span>
                    <span className="text-white">.</span>
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    className="mt-5 sm:mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
                  >
                    <span className="text-white">{industries.length} industries</span> ·{" "}
                    <span className="text-white">{totalFlows}+ money flows</span> ·{" "}
                    <span className="text-white/90">11+ sources</span>
                    <span className="text-white/65"> — structured intel, geo scope, and cross-industry scans in one
                    workspace.</span>
                  </motion.p>

                  <motion.div
                    variants={fadeUp}
                    className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-[13px] sm:text-sm"
                  >
                    {[
                      { icon: TrendingUp, label: "Live signals", c: "text-emerald-300" },
                      { icon: Cpu, label: "Intel Lab", c: "text-sky-300" },
                      { icon: Globe2, label: "Geo-scoped", c: "text-amber-300" },
                    ].map(({ icon: Icon, label, c }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-white/85"
                      >
                        <Icon className={cn("w-3.5 h-3.5", c)} />
                        {label}
                      </span>
                    ))}
                  </motion.div>

                  <motion.div variants={fadeUp} className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                    <Button
                      size="lg"
                      className="h-12 sm:h-14 px-8 sm:px-10 text-base font-bold gap-2 rounded-full bg-[hsl(38_92%_50%)] text-[hsl(226_58%_12%)] hover:bg-[hsl(38_92%_46%)] shadow-xl shadow-black/30 border border-white/15"
                      asChild
                    >
                      <Link to="/auth?mode=signup">
                        Start free
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 sm:h-14 px-6 sm:px-8 text-base rounded-full border-white/25 bg-white/[0.04] text-white hover:bg-white/[0.09] hover:text-white backdrop-blur-sm"
                      asChild
                    >
                      <Link to="/auth" className="gap-2.5">
                        <PlayCircle className="w-4 h-4 text-[hsl(38_90%_58%)]" />
                        Sign in to explore
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                <motion.div variants={fadeUp} className="relative hidden lg:block">
                  <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[hsl(38_90%_50%)]/20 via-transparent to-[hsl(226_65%_45%)]/20 blur-2xl" />
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="shine-border relative rounded-2xl border border-white/15 bg-[hsl(226_40%_8%)] shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/10"
                  >
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/25">
                      <span className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                      </span>
                      <div className="flex-1 flex justify-center">
                        <span className="rounded-lg bg-black/30 border border-white/10 px-3 py-1 text-[11px] text-white/60 font-medium truncate max-w-[280px]">
                          app.intelgoldmine.com
                        </span>
                      </div>
                    </div>
                    <div className="relative aspect-[16/10.5] bg-black/40">
                      <img
                        src="/hero-visual.png"
                        alt=""
                        className="w-full h-full object-cover object-top opacity-[0.97]"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(226_58%_8%)]/90 via-transparent to-black/20 pointer-events-none" />
                    </div>
                    <div className="grid grid-cols-3 gap-px border-t border-white/10 bg-white/10 text-[11px]">
                      <div className="bg-black/35 backdrop-blur-md p-3 text-center">
                        <p className="font-bold text-[hsl(38_90%_58%)] tabular-nums">{industries.length}</p>
                        <p className="text-white/45">Industries</p>
                      </div>
                      <div className="bg-black/35 backdrop-blur-md p-3 text-center">
                        <p className="font-bold text-sky-300 tabular-nums">{totalFlows}+</p>
                        <p className="text-white/45">Flows</p>
                      </div>
                      <div className="bg-black/35 backdrop-blur-md p-3 text-center">
                        <p className="font-bold text-emerald-300 tabular-nums">11+</p>
                        <p className="text-white/45">Sources</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Mobile / tablet product shot */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-4 lg:hidden"
            >
              <div className="shine-border relative rounded-2xl overflow-hidden border border-white/15 bg-[hsl(226_40%_8%)] shadow-2xl ring-1 ring-white/10">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-black/30">
                  <span className="h-2 w-2 rounded-full bg-red-400/90" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/90" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/90" />
                </div>
                <img
                  src="/hero-visual.png"
                  alt="Intel GoldMine — market intelligence workspace"
                  className="w-full h-auto"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(226_58%_10%)]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Stats — part of hero */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 mt-10 sm:mt-14 border-t border-white/10 pt-8 sm:pt-10 pb-12 sm:pb-16">
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto lg:mx-0"
              >
                {[
                  { n: `${industries.length}`, l: "Industries mapped", color: "text-[hsl(38_90%_58%)]", icon: LayoutGrid },
                  { n: `${totalFlows}+`, l: "Money flows", color: "text-sky-300", icon: BarChart3 },
                  { n: "11+", l: "Live data sources", color: "text-emerald-300", icon: Radio },
                ].map((s) => (
                  <motion.div
                    key={s.l}
                    variants={fadeUp}
                    className="group text-center lg:text-left rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-3 py-5 sm:p-6 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="mx-auto lg:mx-0 mb-2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black/30 border border-white/10 text-white/70 group-hover:text-white transition-colors">
                      <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <p className={cn("text-2xl sm:text-4xl md:text-5xl font-bold tabular-nums font-display", s.color)}>
                      {s.n}
                    </p>
                    <p className="text-[10px] sm:text-xs text-white/45 mt-1 font-semibold uppercase tracking-wide">
                      {s.l}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Explore */}
        <section id="explore" className="relative border-y border-[hsl(40_12%_88%)] bg-[hsl(40_22%_96%)]">
          <div className="absolute inset-0 dot-pattern-fine opacity-[0.35] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 relative">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <p className="text-sm font-semibold text-primary tracking-[0.2em] uppercase mb-3">Explore</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-foreground tracking-tight leading-[1.1]">
                Three entry points. One intelligence stack.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-base sm:text-lg">
                Pick how you work — live pulse, custom lab, or cross-sector sweep.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
              {[
                {
                  title: "Live intel feed",
                  desc: "Crypto, FX, commodities, VC & macro — refreshed continuously.",
                  icon: Radio,
                  grad: "bg-gradient-to-br from-primary/30 via-primary/10 to-slate-900/80",
                  href: "#features",
                },
                {
                  title: "Intel Lab",
                  desc: "Scope industries & flows, add context, generate briefs + follow-ups.",
                  icon: FlaskConical,
                  grad: "bg-gradient-to-br from-amber-500/35 via-brand-orange/15 to-slate-900/85",
                  href: "#how-it-works",
                },
                {
                  title: "Cross-industry scan",
                  desc: "Gaps, deals, and bridges across all mapped sectors in one pass.",
                  icon: Layers,
                  grad: "bg-gradient-to-br from-violet-500/30 via-signal-violet/15 to-slate-900/85",
                  href: "#features",
                },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group relative flex flex-col rounded-[1.35rem] border border-border/60 bg-card overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={cn("relative h-36 sm:h-40 overflow-hidden", item.grad)}
                  >
                    <div className="absolute inset-0 bg-[url('/hero-visual.png')] bg-cover bg-center opacity-25 mix-blend-overlay group-hover:opacity-35 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-background/90 border border-border/50 shadow-md">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      Learn more
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee — dark */}
        <div className="border-y border-white/10 bg-[hsl(226_50%_13%)] overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-6 gap-12 sm:gap-16 text-sm text-white/55">
            {marqueeItems.map((ind, i) => (
              <span key={`${ind.slug}-${i}`} className="inline-flex items-center gap-3 shrink-0">
                <span className="text-xl grayscale contrast-125 opacity-90">{ind.icon}</span>
                <span className="font-semibold text-white/75 tracking-tight">{ind.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Showcase */}
        <section className="relative border-b border-border/50 bg-background overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-brand-orange/[0.05] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 lg:py-24 relative z-10">
            <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-sm font-semibold text-brand-orange tracking-[0.18em] uppercase mb-3">Product</p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-foreground tracking-tight leading-[1.12]">
                  A briefing room — not a spreadsheet with charts taped on.
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
                  Maverick turns flows, news, and market inputs into structured briefs you can act on. Geo and role follow
                  you everywhere.
                </p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {["Dashboard", "Intel Lab", "Cross-industry"].map((label) => (
                    <span
                      key={label}
                      className="inline-flex rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-[1.75rem] bg-gradient-to-br from-primary/25 via-brand-orange/15 to-transparent blur-2xl opacity-80" />
                <div className="shine-border relative rounded-2xl border border-border/50 bg-card overflow-hidden shadow-2xl rotate-[0.5deg] hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/og-image.png"
                    alt="Intel GoldMine workspace preview"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative bg-[hsl(40_18%_98%)] overflow-hidden">
          <div className="absolute inset-0 dot-pattern-fine opacity-40 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-28 relative">
            <Reveal className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <p className="text-sm font-semibold text-primary tracking-[0.2em] uppercase mb-3">Features</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                Built for speed readers &amp; deep divers
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Live inputs, structured AI, and scans that respect your geography — in layouts that stay legible at 11pm.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="lg:col-span-7 rounded-[1.5rem] border border-border/60 bg-card overflow-hidden shadow-xl shine-border group"
              >
                <div className="relative h-44 sm:h-52 overflow-hidden border-b border-border/50">
                  <img
                    src="/hero-visual.png"
                    alt=""
                    className="w-full h-full object-cover object-top opacity-90 group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/20 backdrop-blur-sm">
                    <Radio className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-7 sm:p-9">
                  <h3 className="text-2xl font-bold text-foreground">Live market feed</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl text-base">
                    Crypto, FX, commodities, VC & macro — tuned for decisions, not endless scrolling.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Macro", "FX", "Crypto", "VC"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted/80 border border-border/60 px-3 py-1 text-xs font-semibold text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="lg:col-span-5 rounded-[1.5rem] border border-border/60 bg-gradient-to-b from-brand-orange/[0.12] to-card p-8 sm:p-10 shadow-lg flex flex-col justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/15 text-brand-orange mb-6 border border-brand-orange/15">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Geo-scoped research</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed text-base">
                  Stop pretending “global” is useful. Tune intel to the markets you actually operate in.
                </p>
              </motion.div>

              {[
                {
                  icon: BarChart3,
                  title: "Structured AI outputs",
                  body: "Frameworks, scores, and comparisons — not walls of text.",
                  iconBg: "bg-signal-violet/12 text-signal-violet border-signal-violet/15",
                  span: "lg:col-span-4",
                  grad: "from-signal-violet/[0.08] to-card",
                },
                {
                  icon: Layers,
                  title: "Intel Lab",
                  body: "Your scope, your context — briefs and chat on demand.",
                  iconBg: "bg-signal-emerald/12 text-signal-emerald border-signal-emerald/15",
                  span: "lg:col-span-4",
                  grad: "from-signal-emerald/[0.08] to-card",
                },
                {
                  icon: Zap,
                  title: "Cross-industry scans",
                  body: "One pass to surface gaps and bridges across sectors.",
                  iconBg: "bg-brand-orange/12 text-brand-orange border-brand-orange/15",
                  span: "lg:col-span-4",
                  grad: "from-brand-orange/[0.08] to-card",
                },
              ].map((f) => (
                <motion.div
                  key={f.title}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={cn(
                    "rounded-[1.5rem] border border-border/60 bg-gradient-to-b p-8 shadow-md hover:shadow-lg transition-shadow",
                    f.span,
                    f.grad,
                  )}
                >
                  <div
                    className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border", f.iconBg)}
                  >
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </motion.div>
              ))}

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="lg:col-span-12 rounded-[1.5rem] border border-border/60 bg-gradient-to-r from-primary/[0.06] via-muted/30 to-brand-orange/[0.06] p-8 sm:p-10 flex flex-col md:flex-row md:items-center gap-8"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary border border-primary/15">
                  <Shield className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-foreground">Evidence-first, time-respecting UI</h3>
                  <p className="mt-2 text-muted-foreground max-w-3xl leading-relaxed">
                    For founders, investors, and analysts who need a clear view fast — without tab overload.
                  </p>
                </div>
                <Button className="rounded-full shrink-0 font-bold" asChild>
                  <Link to="/auth?mode=signup">
                    Get started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How it works — dark */}
        <section id="how-it-works" className="relative bg-[hsl(226_58%_11%)] text-white overflow-hidden">
          <div className="absolute inset-0 landing-dot-light opacity-40 pointer-events-none" />
          <div className="absolute inset-0 landing-hero-vignette opacity-50 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 relative z-10">
            <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <p className="text-sm font-semibold text-[hsl(38_90%_58%)] tracking-[0.2em] uppercase mb-3">How it works</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                From scope to signal in three moves
              </h2>
            </Reveal>

            <div className="relative grid md:grid-cols-3 gap-10 md:gap-6">
              <div className="hidden md:block absolute top-[2.35rem] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              {[
                {
                  step: "01",
                  title: "Set your scope",
                  body: "Industries, regions, and what matters — once, then it travels with you.",
                  icon: Globe2,
                },
                {
                  step: "02",
                  title: "Maverick synthesizes",
                  body: "11+ sources feed structured briefs — not copy-pasted headlines.",
                  icon: BarChart3,
                },
                {
                  step: "03",
                  title: "Decide with proof",
                  body: "Risks, scores, and opportunities surfaced where you read — not buried in footnotes.",
                  icon: CheckCircle2,
                },
              ].map((s, i) => (
                <Reveal key={s.step} delay={i * 0.12} className="relative text-center md:text-left">
                  <div className="flex md:block flex-col items-center">
                    <div className="relative z-10 mx-auto md:mx-0 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.07] border border-white/15 shadow-lg">
                      <s.icon className="w-7 h-7 text-[hsl(38_90%_58%)]" />
                    </div>
                    <span className="text-5xl sm:text-6xl font-display font-bold text-white/[0.07] mb-3 block">{s.step}</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{s.title}</h3>
                    <p className="mt-3 text-base text-white/60 leading-relaxed max-w-sm mx-auto md:mx-0">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gradient-to-b from-background to-[hsl(40_20%_96%)] border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
            <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
              <p className="text-sm font-semibold text-primary tracking-[0.2em] uppercase mb-3">Voices</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                Teams that outrun the news cycle
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <div className="relative h-full rounded-[1.35rem] border border-border/60 bg-card p-7 sm:p-8 shadow-lg flex flex-col overflow-hidden group hover:border-primary/20 transition-colors">
                    <Quote className="absolute top-5 right-5 w-10 h-10 text-primary/[0.08] group-hover:text-primary/15 transition-colors" />
                    <div className="flex gap-0.5 mb-5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-[hsl(38_90%_50%)] text-[hsl(38_90%_50%)]" />
                      ))}
                    </div>
                    <p className="text-base text-foreground leading-relaxed flex-1 font-medium">&ldquo;{t.text}&rdquo;</p>
                    <div className="mt-8 pt-6 border-t border-border/60">
                      <p className="text-sm font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.role}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-[hsl(40_18%_97%)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-28">
            <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
              <p className="text-sm font-semibold text-brand-orange tracking-[0.2em] uppercase mb-3">Pricing</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                One Pro tier. Everything unlocked.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Start free. Upgrade when you want full depth across every workflow.
              </p>
            </Reveal>

            <Reveal className="max-w-lg mx-auto">
              <div className="rounded-[1.5rem] border-2 border-primary/20 bg-card p-9 sm:p-11 text-center shadow-2xl relative overflow-hidden ring-4 ring-primary/[0.06]">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-brand-orange to-primary" />
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-orange/12 mb-5 border border-brand-orange/20">
                  <BadgeCheck className="w-7 h-7 text-brand-orange" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Pro</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-6xl sm:text-7xl font-bold tabular-nums text-foreground">
                    ${SUBSCRIPTION_USD_MONTHLY}
                  </span>
                  <span className="text-xl text-muted-foreground font-medium">/mo</span>
                </div>
                <p className="mt-6 text-muted-foreground leading-relaxed text-base">
                  Full access — live feeds, AI deep dives, cross-industry analysis, Intel Lab, and geo-scoped snapshots.
                </p>

                <ul className="mt-8 space-y-3.5 text-left max-w-sm mx-auto">
                  {[
                    "AI research & follow-up chat",
                    `${industries.length} industries · ${totalFlows}+ money flows`,
                    "Geo-scoped analysis & snapshots",
                    "Cross-industry intelligence",
                    "Custom Intel Lab sessions",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-signal-emerald shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground font-medium leading-snug">{line}</span>
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="mt-10 w-full h-12 sm:h-14 text-base font-bold rounded-full shadow-lg" asChild>
                  <Link to="/auth?mode=signup">
                    Get started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <p className="mt-5 text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/auth" className="text-primary hover:underline font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-16 sm:py-24 overflow-hidden bg-[hsl(226_58%_10%)] text-white">
          <div className="absolute inset-0 landing-dot-light opacity-50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-brand-orange/15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <Reveal>
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]">
                  Your markets won&apos;t wait for a quarterly PDF.
                </h2>
                <p className="mt-6 text-lg text-white/65 leading-relaxed max-w-xl mx-auto">
                  Get a workspace that looks as serious as the decisions you make.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    className="h-12 sm:h-14 px-10 text-base font-bold rounded-full bg-[hsl(38_92%_50%)] text-[hsl(226_58%_12%)] hover:bg-[hsl(38_92%_46%)] shadow-xl border border-white/10"
                    asChild
                  >
                    <Link to="/auth?mode=signup">Create free account</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 sm:h-14 px-8 text-base rounded-full border-white/25 bg-white/[0.05] text-white hover:bg-white/[0.1] hover:text-white"
                    asChild
                  >
                    <Link to="/auth">Sign in</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-[hsl(226_58%_8%)] text-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <BrandHexMark size="sm" variant="onDark" />
              <BrandWordmark className="text-lg" variant="onDark" />
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-sm">
              Market intelligence with geo scope, structured AI, and Maverick — your research copilot.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-white/35 mb-4">Product</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#explore" className="text-white/70 hover:text-white transition-colors">
                  Explore
                </a>
              </li>
              <li>
                <a href="#features" className="text-white/70 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white/70 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-white/35 mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-white/70 hover:text-white transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-white/70 hover:text-white transition-colors">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4 flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/35 mb-4">Account</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-full bg-[hsl(38_92%_50%)] text-[hsl(226_58%_12%)] hover:bg-[hsl(38_92%_46%)] font-semibold border border-white/10"
                  asChild
                >
                  <Link to="/auth?mode=signup">Get started</Link>
                </Button>
              </div>
            </div>
            <p className="text-xs text-white/40">© 2026 Intel GoldMine · Not financial advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
