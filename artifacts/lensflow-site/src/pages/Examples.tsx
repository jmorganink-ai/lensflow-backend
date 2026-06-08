import { motion } from "framer-motion";
import { ArrowRight, Film, PlayCircle, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const campaigns = [
  {
    title: "AI Presenter Video",
    subtitle: "Mia — Waterfront lifestyle listing",
    detail: "Mia narrates a Mosman waterfront home with property-specific copy written by Claude AI, voice by ElevenLabs, and lipsync rendered in HeyGen.",
    video: "/videos/mia-presenter.mp4",
    poster: "/presenters/mia-poster.jpg",
    icon: Video,
    tag: "Most popular",
    specs: ["60–90 second runtime", "16:9 broadcast format", "MP4 ready to upload"],
  },
  {
    title: "Social Reel",
    subtitle: "Mia — Short-form vertical reel",
    detail: "Short-form vertical content cut for Instagram Reels, TikTok and Facebook Stories. Same listing, same AI presenter, different format.",
    video: "/videos/mia-reel.mp4",
    poster: "/presenters/mia-poster.jpg",
    icon: Film,
    tag: "Instagram ready",
    specs: ["9:16 vertical format", "15–30 second runtime", "Caption overlay included"],
  },
  {
    title: "Oliver — Investment Presenter",
    subtitle: "Oliver — Inner-city investment apartment",
    detail: "Oliver's sharper delivery positions the property around yield, opportunity and lifestyle upside — built for investors and developer campaigns.",
    video: "/videos/oliver-presenter.mp4",
    poster: "/presenters/oliver-poster.jpg",
    icon: PlayCircle,
    tag: "Investment ready",
    specs: ["60–90 second runtime", "16:9 broadcast format", "MP4 ready to upload"],
  },
  {
    title: "Sophie — Family Home",
    subtitle: "Sophie — Suburban family listing",
    detail: "Sophie speaks to families the way they actually think about a home — schools, space and lifestyle. Warm and genuine without overselling.",
    video: "/videos/sophie-presenter.mp4",
    poster: "/presenters/sophie-poster.jpg",
    icon: Video,
    tag: "Family homes",
    specs: ["60–90 second runtime", "16:9 broadcast format", "MP4 ready to upload"],
  },
  {
    title: "Reel Creator Showcase",
    subtitle: "Full campaign reel — multiple listings",
    detail: "LensFlow's Reel Creator assembles property highlights, presenter narration and social-ready cuts from the same listing URL in one flow.",
    video: "/videos/reel-creator.mp4",
    poster: "/presenters/mia-poster.jpg",
    icon: Film,
    tag: "Campaign kit",
    specs: ["Multi-format output", "Social + broadcast cuts", "Download + share ready"],
  },
];

const beforeAfter = [
  {
    label: "Before — raw listing",
    src: "/quality-before.jpg",
    caption: "The standard listing photo every agent has. Decent image, zero engagement when posted to socials.",
  },
  {
    label: "LensFlow output",
    src: "/quality-presenter.jpg",
    caption: "Mia narrates the listing on camera. Property-specific script, professional lipsync, broadcast quality.",
    highlight: true,
  },
  {
    label: "After — campaign ready",
    src: "/quality-after.jpg",
    caption: "Final MP4 delivered. Social reels packaged. Caption copy included. Ready to post in minutes.",
  },
];

export default function Examples() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="border-b border-white/5 pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary">Campaign Examples</p>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              What LensFlow actually creates.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
              Every example below was generated from a real listing URL — no videographer, no editor, no studio.
              Paste a URL, pick a presenter, and this is what comes out.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/pipeline/">
                <Button className="h-12 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground">
                  Create Your Campaign <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Video examples */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((item) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                  <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {item.tag}
                  </span>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm font-medium text-primary">{item.subtitle}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                  <ul className="mt-5 space-y-2">
                    {item.specs.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Before → After */}
      <section className="border-y border-white/5 bg-card/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">The Transformation</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Before and after — one listing URL.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              This is what changes when you use LensFlow instead of waiting on a videographer.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {beforeAfter.map((item) => (
              <div
                key={item.label}
                className={`overflow-hidden rounded-[1.75rem] border bg-card ${
                  item.highlight ? "border-primary/40 shadow-[0_0_32px_rgba(201,154,46,0.12)]" : "border-white/10"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.src} alt={item.label} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${item.highlight ? "bg-primary text-primary-foreground" : "bg-white/20 text-white"}`}>
                    {item.label}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-6 text-muted-foreground">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign showcase image */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">Campaign Strategies</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Three campaign angles from one listing.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              LensFlow doesn't just make a video — it builds a full marketing strategy around your listing.
            </p>
          </div>
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
            <img src="/campaign-showcase.png" alt="LensFlow campaign strategies" className="w-full object-cover" />
          </div>
        </div>
      </section>

      {/* CTA — no pricing, just a clear next step */}
      <section className="border-t border-white/5 bg-card/40 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Ready to create yours?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Paste a listing URL, pick a presenter and your campaign is ready in minutes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href="/pipeline/">
              <Button className="w-full sm:w-auto h-14 rounded-2xl bg-primary px-8 text-base font-semibold text-primary-foreground sm:h-12 sm:rounded-full">
                Start Free — No Credit Card <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="/presenters">
              <Button variant="outline" className="w-full sm:w-auto h-12 rounded-2xl border-white/15 bg-white/5 px-8 text-base text-foreground sm:rounded-full">
                Meet the Presenters
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
