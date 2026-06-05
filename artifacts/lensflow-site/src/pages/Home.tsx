import { Link } from "wouter";
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
        <section className="relative overflow-hidden border-b border-white/5 pt-28 lg:pt-32">
          <div className="absolute inset-0">
            <video
              src="/videos/lensflow-reel-creator-v1.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/15" />
          </div>

          <div className="relative z-10 mx-auto grid max-w-7xl items-end gap-10 px-6 pb-16 lg:grid-cols-[minmax(0,1fr)_470px] lg:pb-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl"
            >
              <motion.div
                variants={fadeInUp}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
              >
                <Sparkles className="h-4 w-4" />
                LensFlow AI marketing department
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-serif text-5xl font-bold leading-[1.03] tracking-normal text-foreground md:text-6xl lg:text-[76px]"
              >
                Create Luxury Property Campaigns in Minutes
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl"
              >
                Turn listings, photos and videos into AI presenter campaigns,
                social reels and premium property presentations without chasing
                a videographer.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <a href="#hero-form">
                  <Button className="h-12 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                    Generate Property Campaign
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
                <a href="#examples">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-base text-foreground hover:bg-white/10"
                  >
                    View Campaign Examples
                  </Button>
                </a>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-10 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4"
              >
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-background/60 p-4 backdrop-blur"
                  >
                    <div className="text-2xl font-semibold text-foreground">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              id="hero-form"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="rounded-[2rem] border border-white/10 bg-card/90 p-5 shadow-2xl shadow-black/35 backdrop-blur-xl"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">
                    Start New Campaign
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold">
                    Generate Property Campaign
                  </h2>
                </div>
                <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  AI Presenter Ready
                </div>
              </div>
              <SubmitForm />
            </motion.div>
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
