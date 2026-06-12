import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Film,
  Link2,
  MapPin,
  Play,
  PlayCircle,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SubmitForm } from "@/components/SubmitForm";

const heroMetrics = [
  { label: "From one", value: "Listing URL" },
  { label: "You get", value: "4 assets" },
  { label: "Turnaround", value: "Same day" },
  { label: "Built for", value: "AU agents" },
];

const beforeAfter = [
  {
    badge: "Before — raw listing",
    title: "Standard listing photo",
    detail:
      "What every agent has. A decent photo with zero engagement when it is posted to socials.",
    image: "/images/raw-listing.jpg",
    muted: true,
  },
  {
    badge: "LensFlow output",
    title: "AI presenter campaign",
    detail:
      "A branded presenter video, social reels and captions from the same listing — same day.",
    image: "/mia-portrait.jpg",
    muted: false,
  },
];

const campaignOutputs = [
  {
    title: "AI presenter video",
    detail: "Mia or Oliver introduces the property with polished, listing-aware copy.",
    video: "/videos/sample-v1.mp4",
    poster: "/videos/sample-v1-poster.jpg",
    icon: Video,
  },
  {
    title: "Social reel package",
    detail: "Short-form clips built for Instagram, Facebook, TikTok and LinkedIn.",
    video: "/videos/sample-v3.mp4",
    poster: "/videos/sample-v3-poster.jpg",
    icon: Film,
  },
  {
    title: "Property presentation",
    detail: "Premium visuals, captions and agent-ready story beats from the same listing.",
    video: "/videos/sample-v5.mp4",
    poster: "/videos/sample-v5-poster.jpg",
    icon: PlayCircle,
  },
];

const teleprompterScript = [
  { text: "Welcome to this ", gold: false },
  { text: "stunning waterfront", gold: true },
  { text: " masterpiece. Designed for ", gold: false },
  { text: "luxury living", gold: true },
  { text: " and effortless entertaining, this home offers breathtaking views and exceptional finishes throughout.", gold: false },
];

const platformFeatures = [
  {
    icon: Video,
    title: "AI presenter videos",
    detail: "Mia or Oliver introduce every listing with polished, listing-aware delivery.",
  },
  {
    icon: Smartphone,
    title: "Eye-contact teleprompter",
    detail: "Read your script while looking straight down the lens for natural delivery.",
  },
  {
    icon: Users,
    title: "Become your own twin",
    detail: "Clone yourself once and let your AI digital twin present every listing.",
  },
  {
    icon: Wand2,
    title: "Property enhancement studio",
    detail: "Turn ordinary listing photos into bright, magazine-grade visuals.",
  },
  {
    icon: Film,
    title: "Social reel packages",
    detail: "Short-form clips formatted for Instagram, Facebook, TikTok and LinkedIn.",
  },
  {
    icon: FileText,
    title: "Listing-aware scripts",
    detail: "Copy written from the real listing — features, suburb, lifestyle and price.",
  },
  {
    icon: Bot,
    title: "Morgan AI assistant",
    detail: "Your in-app marketing strategist for captions, hooks and campaign ideas.",
  },
  {
    icon: CalendarCheck,
    title: "Same-day campaign kit",
    detail: "Video, reels, captions and a presentation ready to publish the same day.",
  },
  {
    icon: MapPin,
    title: "Market briefs",
    detail: "Suburb insight and selling points to back every campaign you launch.",
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

const flowSteps = [
  {
    icon: Link2,
    step: "01",
    title: "Paste the listing URL",
    detail: "Drop in a realestate.com.au or Domain link, or upload your own photos and video.",
  },
  {
    icon: FileText,
    step: "02",
    title: "AI writes the script",
    detail: "LensFlow reads the listing and drafts a listing-aware script in your tone.",
  },
  {
    icon: Wand2,
    step: "03",
    title: "Enhance the visuals",
    detail: "The Enhancement Studio lifts ordinary photos into magazine-grade frames.",
  },
  {
    icon: Smartphone,
    step: "04",
    title: "Present it your way",
    detail: "Pick Mia or Oliver, or read it yourself with the eye-contact teleprompter.",
  },
  {
    icon: Video,
    step: "05",
    title: "AI records in 4K",
    detail: "Your presenter delivers the pitch with cinematic b-roll and clean audio.",
  },
  {
    icon: Film,
    step: "06",
    title: "Package the socials",
    detail: "Reels, captions and a property presentation are formatted for every channel.",
  },
  {
    icon: CalendarCheck,
    step: "07",
    title: "Launch — same day",
    detail: "The full campaign kit lands ready to publish while the listing is still fresh.",
  },
];

const adminPoints = [
  "Campaign created first — listing URL in, assets out",
  "AI presenter video, not just a script",
  "Social reels packaged and ready to post",
  "Marketing value shown in dollars, not credits",
];

const calmCards = [
  {
    icon: Shield,
    title: "Brand safe",
    detail: "Property-first copy and a professional presenter tone on every listing.",
  },
  {
    icon: Clock,
    title: "Same-day delivery",
    detail: "From listing URL to a finished campaign in minutes, not days.",
  },
  {
    icon: Users,
    title: "Built for agents",
    detail: "Designed around how Australian real estate agents actually work.",
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
        {/* Hero */}
        <section className="relative min-h-screen overflow-hidden border-b border-white/5 bg-[#0A0A0A] text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero-2026.jpg"
              alt="Modern luxury Australian property at golden hour"
              className="h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/70 to-[#06080F]" />
            <div className="absolute inset-0 bg-gradient-radial-gold" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-24 pt-36 md:pt-40">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-4 py-2 text-sm font-medium text-[#E8D5A3]">
                <Sparkles className="h-4 w-4 text-[#C9A84C]" />
                Australia's AI real estate video platform
              </span>

              <h1 className="mt-8 font-serif text-5xl font-bold leading-[1.05] md:text-7xl">
                Your listing goes live.
                <br />
                <span className="relative inline-block text-gradient-gold">
                  Your video should too.
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-gradient-to-r from-[#C9A84C] via-[#C9A84C] to-transparent" />
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-[#E8D5A3]/80 md:text-xl">
                Real estate agents lose their listing's peak 48-hour traffic
                window waiting on a videographer. LensFlow turns your listing URL
                into a professional AI presenter video, social reels and a full
                campaign kit — same day.
              </p>

              <div className="mt-10 flex flex-col gap-5 sm:flex-row">
                <a href="#hero-form">
                  <button className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] px-8 py-4 text-lg font-bold text-[#0A0A0A] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] sm:w-auto">
                    Generate Campaign Now
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </a>
                <Link href="/examples">
                  <button className="group flex w-full items-center justify-center gap-3 rounded-full border border-[#C9A84C]/30 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:border-[#C9A84C]/60 hover:bg-white/5 sm:w-auto">
                    <Play className="h-5 w-5 transition-colors group-hover:text-[#C9A84C]" fill="currentColor" />
                    Watch Example
                  </button>
                </Link>
              </div>

              <div className="mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {heroMetrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="text-xl font-semibold text-white">{metric.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#E8D5A3]/50">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Start your campaign — funnel form */}
        <section
          id="hero-form"
          className="scroll-mt-24 border-b border-white/5 bg-background py-20 lg:py-24"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                Start your campaign
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                Paste your listing. Get your campaign.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Drop in a listing URL, choose your presenter and add photos if
                you have them. LensFlow builds the presenter video, social reels
                and captions — same day.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Takes 10 seconds to start",
                  "No credit card required",
                  "Built for Australian agents",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 flex-none text-primary" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-card p-6 sm:p-8">
              <SubmitForm />
            </div>
          </div>
        </section>

        {/* Proof points */}
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

        {/* Before / After */}
        <section className="bg-background py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                The difference
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                Same listing. A completely different result.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {beforeAfter.map((card) => (
                <motion.article
                  key={card.title}
                  whileHover={{ y: -6 }}
                  className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={card.image}
                      alt={card.title}
                      className={`h-full w-full object-cover ${card.muted ? "saturate-[0.8]" : ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                        card.muted
                          ? "bg-black/60 text-white"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <div className="p-7">
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {card.detail}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Campaign outputs */}
        <section id="examples" className="border-y border-white/5 bg-card/40 py-24 lg:py-28">
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
                LensFlow should feel like an AI marketing department — video,
                social, presenter and campaign assets in one flow.
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
                      poster={item.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
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

        {/* Teleprompter showcase */}
        <section id="teleprompter" className="relative overflow-hidden bg-background py-24 lg:py-28">
          <div className="absolute inset-0 bg-gradient-radial-gold opacity-60" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                Eye-contact teleprompter
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                Luxury property videos in minutes.
                <br />
                <span className="text-gradient-gold">Read. Record. Connect.</span>
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                LensFlow's intelligent teleprompter lets you read your script
                while looking directly at the camera — natural eye contact,
                confident delivery and cinematic 4K quality, every time.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="/twin-avatar">
                  <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] px-7 py-3.5 font-bold text-[#0A0A0A] transition-all duration-300 hover:scale-105 sm:w-auto">
                    <Users className="h-5 w-5" />
                    Upload Your Face
                  </button>
                </Link>
                <a href="/pipeline/">
                  <button className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-bold text-foreground transition-all duration-300 hover:bg-white/10 sm:w-auto">
                    <Video className="h-5 w-5 text-primary" />
                    Start Recording
                  </button>
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Eye, label: "Eye-contact teleprompter" },
                  { icon: Users, label: "Become Mia or Oliver" },
                  { icon: Wand2, label: "Property enhancement studio" },
                ].map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <feature.icon className="h-5 w-5 flex-none text-primary" />
                    <span className="text-sm leading-5 text-muted-foreground">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
                <img
                  src="/images/teleprompter-agent.jpg"
                  alt="Agent reading a script from the LensFlow teleprompter"
                  className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Teleprompter overlay card */}
              <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-[#C9A84C]/30 bg-[#0A0A0A]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-md sm:left-8 sm:right-8 lg:-left-8 lg:right-8">
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2 text-primary">
                    <Play className="h-4 w-4" fill="currentColor" />
                    <span className="text-xs font-medium text-white/70">00:12</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      Teleprompter
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-6 text-white/85">
                  {teleprompterScript.map((part, index) => (
                    <span key={index} className={part.gold ? "font-semibold text-[#E8D5A3]" : ""}>
                      {part.text}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Full platform feature grid */}
        <section id="features" className="border-y border-white/5 bg-card/40 py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                Everything in one platform
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                Not one feature. A whole marketing department.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {platformFeatures.map((feature) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -4 }}
                  className="rounded-[1.5rem] border border-white/10 bg-background p-7"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Presenters */}
        <section id="presenters" className="bg-background py-24 lg:py-28">
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
                      preload="metadata"
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

        {/* 2026 flowchart */}
        <section id="process" className="border-y border-white/5 bg-card/40 py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                The 2026 workflow
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                How LensFlow produces the best videos.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Seven steps from a cold listing URL to a published campaign — the
                modern way to market property.
              </p>
            </div>

            <div className="relative mx-auto max-w-3xl">
              {/* vertical line */}
              <div className="absolute bottom-4 left-[27px] top-4 w-[2px] bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/40 to-transparent md:left-[31px]" />

              <div className="space-y-6">
                {flowSteps.map((stage) => (
                  <motion.div
                    key={stage.step}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.45 }}
                    className="relative flex gap-6"
                  >
                    <div className="relative z-10 flex h-14 w-14 flex-none items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#0A0A0A] text-primary shadow-[0_0_24px_rgba(201,168,76,0.18)]">
                      <stage.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 rounded-[1.5rem] border border-white/10 bg-background p-6">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-2xl text-primary">{stage.step}</span>
                        <h3 className="text-lg font-semibold">{stage.title}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {stage.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Admin software -> AI marketing team */}
        <section className="bg-background py-24 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.85fr] lg:items-start">
            <div className="rounded-[1.75rem] border border-primary/25 bg-primary/10 p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-3xl font-semibold">
                From admin software to an AI marketing team.
              </h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                Most platforms show you job logs. LensFlow shows you finished
                marketing assets. Every screen answers the agent's real question:
                what did this create for me today?
              </p>
              <div className="mt-7 space-y-3">
                {adminPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-primary" />
                    {item}
                  </div>
                ))}
              </div>
              <a href="#hero-form" className="mt-8 inline-block">
                <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] px-7 py-3.5 font-bold text-[#0A0A0A] transition-all duration-300 hover:scale-105">
                  Start Free — No Credit Card
                  <ArrowRight className="h-5 w-5" />
                </button>
              </a>
            </div>

            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                Marketing Value
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
                See the value, in dollars.
              </h2>
              <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-card">
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
          </div>
        </section>

        {/* A calm, premium system */}
        <section className="border-y border-white/5 bg-card/40 py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">
                Built for agents
              </p>
              <h2 className="mx-auto max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-5xl">
                A calm, premium system agents can rely on.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {calmCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[1.75rem] border border-white/10 bg-background p-8"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {card.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing highlights */}
        <section id="pricing" className="bg-background py-24 lg:py-28">
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
                      : "border-white/10 bg-card"
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
                  <div className="mt-6 text-3xl font-bold text-foreground">{plan.price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden border-t border-white/5 bg-[#0A0A0A] py-28 text-white">
          <div className="absolute inset-0 bg-gradient-radial-gold opacity-70" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">
              Ready to start
            </p>
            <h2 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
              The marketing department agents wish they had.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#E8D5A3]/75">
              Start with the campaign, show the presenter, prove the output and
              make the value obvious — same day, every listing.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#hero-form">
                <button className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] px-9 py-4 text-lg font-bold text-[#0A0A0A] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] sm:w-auto">
                  Start Free — No Credit Card
                  <ArrowRight className="h-5 w-5" />
                </button>
              </a>
              <Link href="/pricing">
                <button className="w-full rounded-full border border-white/15 bg-white/5 px-9 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-white/10 sm:w-auto">
                  Compare Packages
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
