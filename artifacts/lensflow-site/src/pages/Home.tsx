import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Film,
  Menu,
  Play,
  PlayCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
  Volume2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SubmitForm } from "@/components/SubmitForm";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const heroMetrics = [
  { label: "Campaigns created", value: "4 assets" },
  { label: "Listings processed", value: "1 URL" },
  { label: "Time saved", value: "5+ hrs" },
  { label: "Estimated reach", value: "Social ready" },
];

const campaignOutputs = [
  {
    title: "AI presenter video",
    detail: "Mia or Oliver introduces the property with polished, listing-aware copy.",
    video: "/videos/sample-v1.mp4",
    icon: Video,
  },
  {
    title: "Social reel package",
    detail: "Short-form clips built for Instagram, Facebook, TikTok and LinkedIn.",
    video: "/videos/sample-v3.mp4",
    icon: Film,
  },
  {
    title: "Property presentation",
    detail: "Premium visuals, captions and agent-ready story beats from the same listing.",
    video: "/videos/sample-v5.mp4",
    icon: PlayCircle,
  },
];

const presenters = [
  {
    name: "Mia",
    role: "Luxury lifestyle presenter",
    line: "Warm, polished and ideal for coastal, prestige and family listings.",
    poster: "/presenters/mia-poster.jpg",
    video: "/presenters/mia.mp4",
  },
  {
    name: "Oliver",
    role: "Investment and city presenter",
    line: "Sharper, confident and suited to apartments, developers and investor campaigns.",
    poster: "/presenters/oliver-poster.jpg",
    video: "/presenters/oliver.mp4",
  },
];

const workflow = [
  {
    title: "Paste the listing",
    detail: "Start with a property URL, upload photos, add video or use the teleprompter.",
    icon: Sparkles,
  },
  {
    title: "Choose the presenter",
    detail: "Select Mia, Oliver or another LensFlow voice to match the listing style.",
    icon: Users,
  },
  {
    title: "Launch the campaign",
    detail: "Get the video, script, captions and presentation assets ready to publish.",
    icon: Zap,
  },
];

const valueItems = [
  { label: "Script creation", amount: "$50" },
  { label: "Voiceover", amount: "$75" },
  { label: "Video editing", amount: "$250" },
  { label: "Social media package", amount: "$150" },
];

const pricingHighlights = [
  {
    name: "Starter",
    price: "$79/mo",
    detail: "For agents who want scripts, teleprompter flow and a monthly campaign.",
  },
  {
    name: "Elite",
    price: "$199/mo",
    detail: "For agents who want AI presenter videos and a faster listing workflow.",
    featured: true,
  },
  {
    name: "Concierge",
    price: "$399/mo",
    detail: "For teams that want campaign copy, captions and launch support included.",
  },
];

const proofPoints = [
  "Listing URL to campaign kit",
  "Mia and Oliver ready",
  "Real estate focused outputs",
  "Built for Australian agents",
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main>
        {/* Hero Section — Cinematic Storytelling */}
        <section className="relative min-h-screen bg-[#06080F] text-white flex flex-col overflow-hidden border-b border-white/5">
          {/* Background glows */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#C9A84C]/5 to-transparent pointer-events-none" />
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#C9A84C]/8 blur-[150px] rounded-full pointer-events-none" />

          {/* Main content */}
          <div className="flex-1 flex flex-col items-center justify-start pt-36 md:pt-44 px-4 pb-20 z-10 w-full max-w-7xl mx-auto">
            <div className="max-w-4xl w-full text-center flex flex-col items-center gap-8">

              {/* Phase 1 — The Old Way */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col items-center gap-4"
              >
                <span className="px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[#E8D5A3] bg-[#C9A84C]/10 rounded-full border border-[#C9A84C]/20 uppercase">
                  THE OLD WAY
                </span>
                <p className="text-lg md:text-xl text-gray-500 font-light tracking-wide line-through decoration-gray-700 decoration-2">
                  Film every listing. Edit. Wait a week.
                </p>
              </motion.div>

              {/* Phase 2 — Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05]"
              >
                YOUR DIGITAL<br />
                <span className="text-gradient-gold">TWIN IS HERE.</span>
              </motion.h1>

              {/* Phase 3 — Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl leading-relaxed tracking-wide"
              >
                Record once. Your AI clone presents every listing in under 2 minutes.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-5 mt-4"
              >
                <Link href="/twin-avatar">
                  <button className="w-full sm:w-auto bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] text-[#06080F] px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] hover:scale-105 transition-all duration-300">
                    Clone Yourself Free
                  </button>
                </Link>
                <Link href="/examples">
                  <button className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg text-white border border-gray-800 hover:border-gray-500 hover:bg-white/5 transition-all duration-300">
                    <Play className="w-5 h-5 group-hover:text-[#C9A84C] transition-colors" fill="currentColor" />
                    Watch It Work
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Cinematic Video Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="w-full mt-20 relative"
            >
              {/* Glow behind video */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#C9A84C]/10 blur-[120px] rounded-[100px] pointer-events-none" />

              <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl md:rounded-[2.5rem] border border-[#C9A84C]/20 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] group bg-[#0A0D14]">

                {/* Property background image */}
                <img
                  src="/images/luxury-home-golden-hour.png"
                  alt="Luxury Australian property at golden hour"
                  className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out opacity-80"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#06080F]/80 via-transparent to-transparent" />

                {/* REC badge */}
                <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-3">
                  <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-xl flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold tracking-widest text-white">REC</span>
                  </div>
                </div>

                {/* Bottom UI controls */}
                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">

                  {/* AI Presenter + waveform */}
                  <div className="flex items-center gap-5 bg-black/60 backdrop-blur-xl px-5 py-3.5 md:px-6 md:py-4 rounded-2xl border border-white/10 shadow-xl">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8D5A3] flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                      <Play className="w-5 h-5 md:w-6 md:h-6 text-black ml-1" fill="currentColor" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#E8D5A3] animate-pulse" />
                        <span className="text-xs md:text-sm font-semibold text-white tracking-widest uppercase">
                          AI Presenter Active
                        </span>
                      </div>
                      {/* Waveform */}
                      <div className="flex items-end gap-[3px] h-6 md:h-8">
                        {[...Array(32)].map((_, i) => (
                          <div
                            key={i}
                            className="w-[2px] md:w-1 bg-gradient-to-t from-[#C9A84C] to-[#E8D5A3] rounded-full waveform-bar opacity-80"
                            style={{
                              animationDelay: `${i * 0.05}s`,
                              height: `${Math.max(10, Math.min(100, 20 + Math.sin(i * 0.5) * 40 + (i % 7) * 8))}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Volume + time */}
                  <div className="hidden md:flex items-center gap-4 bg-black/60 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-xl">
                    <div className="flex items-center gap-4">
                      <Volume2 className="w-5 h-5 text-gray-400" />
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] rounded-full" />
                      </div>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10 mx-2" />
                    <span className="text-sm font-medium text-gray-400 tracking-wider">0:42 / 1:55</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Two-card feature section */}
        <section className="bg-[#06080F] border-b border-white/5 py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-2">

              {/* Card 01 — Create Your AI Twin */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] hover:border-[#C9A84C]/30 transition-colors duration-300">
                <div className="relative h-72 overflow-hidden bg-black">
                  <img
                    src="/images/twin-digital.png"
                    alt="Create your AI digital twin"
                    className="h-full w-full object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-transparent to-transparent" />
                </div>
                <div className="p-8">
                  <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#C9A84C] uppercase">
                    01 ——
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    Create Your AI Twin
                  </h3>
                  <p className="mt-3 text-base leading-7 text-gray-400">
                    Build a hyper-realistic digital twin in minutes. Record once and your AI clone is ready to present every listing — in your face, your voice, your style.
                  </p>
                </div>
              </div>

              {/* Card 02 — Your AI Avatar. Your Voice. */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] hover:border-[#C9A84C]/30 transition-colors duration-300">
                <div className="relative h-72 overflow-hidden bg-black">
                  <img
                    src="/images/mia-teleprompter.png"
                    alt="AI avatar presenting your listing"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-transparent to-transparent" />
                </div>
                <div className="p-8">
                  <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#C9A84C] uppercase">
                    02 ——
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    Your AI Avatar. Your Voice.
                  </h3>
                  <p className="mt-3 text-base leading-7 text-gray-400">
                    AI presents your listings with your script and style — reading your words, in your voice, looking straight at camera. Natural eye contact. Confident delivery. Every time.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="border-b border-white/5 bg-background py-16">
          <div className="mx-auto grid max-w-7xl gap-4 px-6 md:grid-cols-4">
            {proofPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
              >
                <CheckCircle2 className="h-5 w-5 flex-none text-primary" />
                <span className="text-sm text-muted-foreground">{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="examples" className="bg-background py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                  Campaign Output
                </p>
                <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                  One listing becomes a full marketing launch.
                </h2>
              </div>
              <p className="max-w-md text-base leading-7 text-muted-foreground">
                LensFlow should feel like an AI marketing department. That means
                video, social, presenter and campaign assets in one flow.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {campaignOutputs.map((item) => (
                <motion.article
                  key={item.title}
                  whileHover={{ y: -6 }}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-card"
                >
                  <div className="relative aspect-[9/13] overflow-hidden bg-black">
                    <video
                      src={item.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      Ready to publish
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="presenters" className="border-y border-white/5 bg-card/40 py-24 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                Mia and Oliver
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                Your AI presenters are the product difference.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                A normal dashboard sells tasks. LensFlow sells a marketing team:
                presenter, scriptwriter, editor and social coordinator working
                from the same listing.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Mia for lifestyle listings", "Oliver for investment listings"].map((line) => (
                  <div key={line} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-primary" />
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {presenters.map((presenter) => (
                <article
                  key={presenter.name}
                  className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-background"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-black">
                    <video
                      src={presenter.video}
                      poster={presenter.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="text-2xl font-semibold text-white">
                        {presenter.name}
                      </div>
                      <div className="mt-1 text-sm text-primary">
                        {presenter.role}
                      </div>
                    </div>
                  </div>
                  <p className="p-5 text-sm leading-6 text-muted-foreground">
                    {presenter.line}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-background py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                How It Works
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                Built around the first action an agent should take.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[1.75rem] border border-white/10 bg-card p-7"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="font-serif text-5xl text-white/10">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="compare" className="border-y border-white/5 bg-card/40 py-24 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_0.85fr] lg:items-start">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                Marketing Value
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                Show agents what LensFlow creates for them.
              </h2>
              <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-background">
                {valueItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border-b border-white/5 px-6 py-4 last:border-b-0"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">{item.amount}</span>
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
              <h3 className="font-serif text-3xl font-semibold">
                From admin software to operating system.
              </h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                The experience should open with campaign creation, not market
                briefs or job logs. Every screen should answer the agent's real
                question: what marketing did this create for me today?
              </p>
              <div className="mt-7 space-y-3">
                {[
                  "Generate campaign first",
                  "Recent campaigns instead of recent jobs",
                  "Presenter status visible",
                  "Marketing value shown in dollars",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-24 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                Output Quality
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                Premium enough for luxury listings. Fast enough for every week.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                LensFlow should lead with finished marketing assets: polished
                video, clean listing story, confident presenter and social-ready
                format.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { src: "/quality-before.jpg", label: "Listing media" },
                { src: "/quality-presenter.jpg", label: "AI presenter" },
                { src: "/quality-after.jpg", label: "Campaign output" },
              ].map((image) => (
                <div
                  key={image.label}
                  className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-card"
                >
                  <img
                    src={image.src}
                    alt={image.label}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="p-4 text-sm font-medium text-muted-foreground">
                    {image.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-y border-white/5 bg-card/40 py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                  Packages
                </p>
                <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                  Price the platform like an AI marketing team.
                </h2>
              </div>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-foreground hover:bg-white/10"
                >
                  See Full Pricing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {pricingHighlights.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-[1.75rem] border p-7 ${
                    plan.featured
                      ? "border-primary/50 bg-primary/10"
                      : "border-white/10 bg-background"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {plan.detail}
                      </p>
                    </div>
                    {plan.featured && (
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="mt-8 font-serif text-4xl font-semibold">
                    {plan.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-24 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                Trust Layer
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                A calm, premium system agents can trust.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: Shield, title: "Brand safe", detail: "Property-first copy and professional presenter tone." },
                { icon: Clock, title: "Fast turnaround", detail: "Campaign creation starts from a listing URL." },
                { icon: Users, title: "Team friendly", detail: "Built for agents, agencies and premium vendors." },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-card p-6">
                  <item.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-5 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-card py-20">
          <div className="absolute inset-0">
            <video
              src="/videos/oliver-featured.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-background/80" />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
              Ready To Build
            </p>
            <h2 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">
              Make LensFlow feel like the marketing department agents wish they had.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Start with the campaign, show the presenter, prove the output and
              make the value obvious.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#hero-form">
                <Button className="h-12 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                  Generate Property Campaign
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-base text-foreground hover:bg-white/10"
                >
                  Compare Packages
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
