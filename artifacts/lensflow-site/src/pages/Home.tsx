import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Film,
  PlayCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
  Zap,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SubmitForm } from "@/components/SubmitForm";
import { Link } from "wouter";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const presenters = [
  { name: "Mia", role: "Waterfront / Lifestyle", poster: "/presenters/mia-poster.jpg", video: "/presenters/mia.mp4", color: "from-amber-900/40" },
  { name: "Oliver", role: "Inner-City / Investment", poster: "/presenters/oliver-poster.jpg", video: "/presenters/oliver.mp4", color: "from-blue-900/40" },
  { name: "Sophie", role: "Family / Suburban", poster: "/presenters/sophie-poster.jpg", video: "/presenters/sophie.mp4", color: "from-rose-900/40" },
];

const steps = [
  { num: "01", icon: Link2, title: "Paste your listing URL", body: "LensFlow reads the suburb, bedrooms, style and price point from the URL. Claude AI writes a listing-specific script in under 10 seconds. No brief. No back-and-forth." },
  { num: "02", icon: Users, title: "Pick your AI presenter", body: "Mia, Oliver or Sophie deliver your script with a natural Australian voice and lip-sync. No videographer to book, no studio, no waiting days for an edit." },
  { num: "03", icon: Zap, title: "Get your full campaign", body: "Finished MP4 presenter video, social reels, caption pack and campaign copy — all ready inside the 48-hour traffic window when your listing has the most eyes." },
];

const valueItems = [
  { label: "Script creation", amount: "$50" },
  { label: "Professional voiceover", amount: "$75" },
  { label: "Video editing & render", amount: "$250" },
  { label: "Social media package", amount: "$150" },
];

const trustPoints = [
  { icon: Shield, title: "Brand safe", detail: "Property-first copy and professional presenter tone on every listing." },
  { icon: Clock, title: "Same-day delivery", detail: "From listing URL to finished campaign in minutes, not days." },
  { icon: Users, title: "Built for agents", detail: "Designed around how Australian real estate agents actually work." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-20 lg:pt-28 border-b border-white/5 overflow-hidden">
        {/* background reel */}
        <div className="absolute inset-0 pointer-events-none">
          <video
            src="/videos/lensflow-reel-creator-v1.mp4"
            autoPlay muted loop playsInline
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5">
          {/* top copy — always full width */}
          <motion.div
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-3xl pb-8 pt-6 lg:pb-12"
          >
            <motion.div variants={fadeInUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Solve the 48-hour listing window
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-serif text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl">
              Your Listing Goes Live Today.<br className="hidden sm:block" /> Your Video Should Too.
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Most agents lose their listing's peak traffic window waiting on a videographer. LensFlow turns your listing URL into a professional AI presenter video, social reels and full campaign kit — same day, no bookings, no editing.
            </motion.p>

            {/* ── MOBILE CTA — visible on phones, hidden ≥sm ── */}
            <motion.div variants={fadeInUp} className="mt-7 flex flex-col gap-3 sm:hidden">
              <a href="/pipeline/">
                <Button className="w-full h-14 rounded-2xl bg-primary text-base font-semibold text-primary-foreground">
                  Start Free — No Credit Card <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#examples">
                <Button variant="outline" className="w-full h-12 rounded-2xl border-white/15 bg-white/5 text-base text-foreground">
                  See Examples
                </Button>
              </a>
            </motion.div>

            {/* ── DESKTOP CTA row — hidden on phones ── */}
            <motion.div variants={fadeInUp} className="mt-7 hidden sm:flex flex-wrap gap-3">
              <a href="#hero-form">
                <Button className="h-12 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground">
                  Generate Property Campaign <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#examples">
                <Button variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-base text-foreground">
                  View Campaign Examples
                </Button>
              </a>
              <a href="/mobile/">
                <Button variant="outline" className="h-12 rounded-full border-primary/40 bg-primary/10 px-7 text-base text-primary">
                  Download the App
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* stats strip — always visible */}
          <div className="grid grid-cols-2 gap-3 pb-10 sm:grid-cols-4 lg:pb-14">
            {[
              { value: "4 assets", label: "Per campaign" },
              { value: "< 10 min", label: "Turnaround" },
              { value: "$525", label: "Value created" },
              { value: "Social ready", label: "Every output" },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-white/10 bg-background/60 px-4 py-4 backdrop-blur">
                <div className="text-2xl font-semibold">{m.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>

          {/* desktop form — hidden on mobile (they tapped the CTA above) */}
          <div id="hero-form" className="hidden sm:block max-w-xl pb-14 lg:pb-20">
            <div className="rounded-[2rem] border border-white/10 bg-card/90 p-6 shadow-2xl shadow-black/35 backdrop-blur-xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">Start New Campaign</p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold">Generate Property Campaign</h2>
                </div>
                <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">AI Presenter Ready</span>
              </div>
              <SubmitForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF STRIP ────────────────────────────────────────── */}
      <section className="border-b border-white/5 bg-background py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Campaign ready in minutes, not days",
            "Mia · Oliver · Sophie — Australian AI presenters",
            "Script by Claude AI · Voice by ElevenLabs",
            "Built for Australian real estate agents",
          ].map((p) => (
            <div key={p} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm text-muted-foreground">{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BEFORE / AFTER ──────────────────────────────────────── */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">The LensFlow Difference</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
              From raw listing to campaign-ready — instantly.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Paste a listing URL. LensFlow turns it into polished video, presenter narration and social content — no photographer, no editor, no wait.
            </p>
          </div>

          {/* Before → After comparison */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-card">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src="/quality-before.jpg" alt="Raw listing photo" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Before — raw listing</span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground">Standard listing photo</h3>
                <p className="mt-2 text-sm text-muted-foreground">What you send to your photographer. Decent. Generic. Does nothing when shared on socials.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-primary/30 bg-card shadow-[0_0_32px_rgba(201,154,46,0.12)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <video
                  src="/presenters/mia.mp4"
                  poster="/presenters/mia-poster.jpg"
                  autoPlay muted loop playsInline
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">LensFlow output</span>
              </div>
              <div className="p-5">
                <div className="mb-2 inline-flex rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">AI Presenter Video</div>
                <h3 className="font-semibold text-foreground">Professional presenter video</h3>
                <p className="mt-2 text-sm text-muted-foreground">Mia narrates your listing with property-specific copy, natural lipsync and broadcast-quality render.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-card">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src="/quality-after.jpg" alt="Campaign output" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">After — campaign ready</span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground">Full campaign kit</h3>
                <p className="mt-2 text-sm text-muted-foreground">Social reels, caption pack, presenter MP4 and campaign copy — all in one flow from the same listing URL.</p>
              </div>
            </div>
          </div>

          {/* campaign showcase image */}
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10">
            <div className="relative">
              <img src="/campaign-showcase.png" alt="LensFlow campaign strategies" className="w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-20 sm:flex-row sm:items-end sm:justify-between">
                <p className="text-sm font-medium text-white/80">Three campaign strategies — generated from one listing URL.</p>
                <a href="/pricing" className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 text-center">
                  Start free →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXAMPLES / CAMPAIGN OUTPUTS ─────────────────────────── */}
      <section id="examples" className="border-t border-white/5 bg-card/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 lg:flex lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">Campaign Output</p>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
                One listing. A full marketing launch.
              </h2>
            </div>
            <p className="mt-4 max-w-sm text-base leading-7 text-muted-foreground lg:mt-0">
              LensFlow acts like an AI marketing department — video, social and presenter assets from a single listing URL.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "AI Presenter Video", detail: "Mia introduces the property with polished, listing-aware narration and full lipsync.", video: "/videos/mia-presenter.mp4", poster: "/presenters/mia-poster.jpg", icon: Video, badge: "Main deliverable" },
              { title: "Social Reel", detail: "Short-form vertical cuts for Instagram, TikTok and Facebook Stories — ready to post.", video: "/videos/mia-reel.mp4", poster: "/presenters/mia-poster.jpg", icon: Film, badge: "Social ready" },
              { title: "Reel Creator", detail: "LensFlow assembles property highlights, presenter narration and social-ready cuts from one listing URL.", video: "/videos/reel-creator.mp4", poster: "/presenters/oliver-poster.jpg", icon: PlayCircle, badge: "Campaign kit" },
            ].map((item) => (
              <motion.article
                key={item.title}
                whileHover={{ y: -5 }}
                className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-card"
              >
                <div className="relative aspect-[9/13] overflow-hidden bg-black">
                  <img src={item.poster} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                  <video
                    src={item.video}
                    poster={item.poster}
                    autoPlay muted loop playsInline
                    className="relative h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">{item.badge}</span>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-primary/60">Claude AI · ElevenLabs · HeyGen · Shotstack</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND VIDEO ─────────────────────────────────────────── */}
      <section className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">See It In Action</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              From listing URL to live campaign — in minutes.
            </h2>
          </div>
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-2xl">
            <video controls playsInline poster="/presenters/mia-poster.jpg" className="w-full" style={{ aspectRatio: "16/9" }}>
              <source src="/videos/lensflow-brand.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ── PRESENTERS ──────────────────────────────────────────── */}
      <section id="presenters" className="border-y border-white/5 bg-card/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">AI Presenters</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Your AI presenters are the product difference.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Three Australian AI presenters, each matched to a different property type. Pick one per listing — or let LensFlow suggest the best fit.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {presenters.map((p) => (
              <article key={p.name} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-background group">
                <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-b ${p.color} to-black`}>
                  <video
                    src={p.video}
                    poster={p.poster}
                    autoPlay muted loop playsInline
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-xl font-semibold text-white sm:text-2xl">{p.name}</div>
                    <div className="mt-0.5 text-xs text-primary sm:text-sm">{p.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { name: "Mia", line: "Warm, polished and ideal for coastal, prestige and family listings." },
              { name: "Oliver", line: "Sharper, confident and suited to apartments, developers and investor campaigns." },
              { name: "Sophie", line: "Friendly and relatable — perfect for family homes and suburban lifestyle." },
            ].map((p) => (
              <div key={p.name} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <Star className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">{p.line}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">How It Works</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Three steps. Full campaign.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="rounded-[1.75rem] border border-white/10 bg-card p-7">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="font-serif text-5xl text-white/8">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE / COMPARE ─────────────────────────────────────── */}
      <section id="compare" className="border-y border-white/5 bg-card/40 py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">Marketing Value</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
              $525 of marketing. Created in one flow.
            </h2>
            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-background">
              {valueItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-white/5 px-6 py-4 last:border-b-0">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold">{item.amount}</span>
                </div>
              ))}
              <div className="flex items-center justify-between bg-primary/10 px-6 py-5">
                <span className="font-semibold text-primary">Total created today</span>
                <span className="text-3xl font-bold text-primary">$525</span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-primary/25 bg-primary/10 p-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-2xl font-semibold sm:text-3xl">
              From admin software to AI marketing team.
            </h3>
            <p className="mt-4 leading-7 text-muted-foreground">
              Most platforms show you job logs. LensFlow shows you finished marketing assets. Every screen answers the agent's real question: what did this create for me today?
            </p>
            <div className="mt-7 space-y-3">
              {["Campaign created first — listing URL in, assets out", "AI presenter video, not just a script", "Social reels packaged and ready to post", "Marketing value shown in dollars, not credits"].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <a href="/pipeline/">
                <Button className="w-full sm:w-auto h-12 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground">
                  Start Free — No Credit Card <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ── TRUST ───────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-card/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">Trust Layer</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              A calm, premium system agents can rely on.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {trustPoints.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-background p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-card py-20">
        <div className="absolute inset-0 pointer-events-none">
          <video src="/videos/oliver-featured.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">Ready to Start</p>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
            The marketing department agents wish they had.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Start with the campaign, show the presenter, prove the output and make the value obvious — same day, every listing.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href="/pipeline/">
              <Button className="w-full sm:w-auto h-14 rounded-2xl bg-primary px-8 text-base font-semibold text-primary-foreground sm:h-12 sm:rounded-full">
                Start Free — No Credit Card <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Link href="/pricing">
              <Button variant="outline" className="w-full sm:w-auto h-12 rounded-2xl border-white/15 bg-white/5 px-8 text-base text-foreground sm:rounded-full">
                Compare Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
