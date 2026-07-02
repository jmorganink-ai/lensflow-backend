import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Film, Play, Pause, PlayCircle, Video, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const campaigns = [
  {
    title: "Mia — Waterfront Lifestyle",
    subtitle: "Mosman, NSW · 4 bed · Prestige listing",
    detail: "Mia opens with an emotional hook tied to the lifestyle, then walks through the property highlights with listing-aware narration. Claude AI wrote the script from the listing URL — no brief required.",
    video: "/videos/mia-presenter.mp4",
    poster: "/presenters/mia-poster.jpg",
    icon: Video,
    tag: "Most popular",
    format: "16:9 · 60–90s · MP4",
    specs: ["Property-specific script by Claude AI", "Voice by ElevenLabs · Lipsync by D-ID", "Broadcast-quality 1080p render"],
    accent: "border-amber-500/30",
  },
  {
    title: "Mia — Short-Form Social Reel",
    subtitle: "Instagram · TikTok · Facebook Stories",
    detail: "The same Mia delivery cut into a punchy vertical format. Same listing, same presenter — different platform. Ready to post the moment it's done.",
    video: "/videos/mia-reel.mp4",
    poster: "/presenters/mia-poster.jpg",
    icon: Film,
    tag: "Social ready",
    format: "9:16 · 15–30s · Vertical",
    specs: ["Instagram Reels · TikTok · Stories", "Caption overlay included", "Same-day turnaround"],
    accent: "border-rose-500/20",
  },
  {
    title: "Oliver — Investment Presenter",
    subtitle: "Pyrmont, NSW · Apartments · Off-the-plan",
    detail: "Oliver positions the property around yield, lifestyle upside and capital growth — exactly how investors actually think. Confident tone, data-aware delivery.",
    video: "/videos/oliver-presenter.mp4",
    poster: "/presenters/oliver-poster.jpg",
    icon: Video,
    tag: "Investment ready",
    format: "16:9 · 60–90s · MP4",
    specs: ["Investor-focused copy", "Voice by ElevenLabs · Lipsync by D-ID", "Broadcast-quality render"],
    accent: "border-blue-500/20",
  },
  {
    title: "Sophie — Family Home",
    subtitle: "Epping, NSW · 4 bed · Suburban lifestyle",
    detail: "Sophie speaks to families the way they actually think about a home — schools, neighbours, space and lifestyle. Warm, genuine, never overselling.",
    video: "/videos/sophie-presenter.mp4",
    poster: "/presenters/sophie-poster.jpg",
    icon: Video,
    tag: "Family homes",
    format: "16:9 · 60–90s · MP4",
    specs: ["Family lifestyle framing", "Voice by ElevenLabs · Lipsync by D-ID", "Broadcast-quality 1080p render"],
    accent: "border-rose-500/20",
  },
  {
    title: "Reel Creator — Campaign Showcase",
    subtitle: "Multi-format · Full campaign output",
    detail: "LensFlow's Reel Creator assembles property highlights, presenter narration and social-ready cuts from the same listing URL in one automated flow.",
    video: "/videos/reel-creator.mp4",
    poster: "/presenters/mia-poster.jpg",
    icon: Film,
    tag: "Campaign kit",
    format: "Multi-format · All platforms",
    specs: ["Presenter video + social reels + captions", "All assets from one listing URL", "Download + share ready"],
    accent: "border-primary/30",
  },
];

function VideoCard({ item }: { item: typeof campaigns[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group overflow-hidden rounded-[1.75rem] border ${item.accent} bg-card`}
    >
      {/* Video */}
      <div className="relative aspect-video overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={item.video}
          poster={item.poster}
          muted
          loop
          playsInline
          autoPlay
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Controls overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={togglePlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </button>
        </div>

        {/* Badges */}
        <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {item.tag}
        </span>
        <button
          onClick={toggleMute}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        <span className="absolute bottom-3 right-4 text-[10px] text-white/60 font-mono">{item.format}</span>
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <item.icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold">{item.title}</h2>
        <p className="mt-0.5 text-xs font-medium text-primary">{item.subtitle}</p>
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
  );
}

export default function Examples() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Header — with property photo background */}
      <section className="relative border-b border-white/5 pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src="/property-4.jpg" alt="" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary">Campaign Examples</p>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Real presenters.<br />Real property campaigns.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
              Mia, Oliver and Sophie — each delivering property-specific scripts to real buyer audiences. No videographer, no studio, no waiting. This is what LensFlow produces.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/pipeline/">
                <Button className="h-12 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground">
                  Create Your Campaign <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="/presenters">
                <Button variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-base">
                  Meet the Presenters
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Video examples */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">Watch the Output</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Five formats. One listing URL.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
              Hover any card to play/pause. Click the speaker icon to unmute.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((item) => (
              <VideoCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Before → After with real property photos */}
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
            {[
              { label: "Before — raw listing", src: "/property-1.jpg", caption: "The standard listing photo every agent has. Decent image, zero engagement when posted to socials.", highlight: false },
              { label: "LensFlow presenter video", src: "/presenters/mia-poster.jpg", caption: "Mia narrates the listing on camera. Property-specific script, professional lipsync, broadcast quality.", highlight: true },
              { label: "After — campaign ready", src: "/property-luxury.jpg", caption: "Final MP4 delivered. Social reels packaged. Caption copy included. Ready to post in minutes.", highlight: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`overflow-hidden rounded-[1.75rem] border bg-card ${item.highlight ? "border-primary/40 shadow-[0_0_32px_rgba(201,154,46,0.12)]" : "border-white/10"}`}
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

      {/* Property photo grid */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-5">
          <p className="mb-6 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground">Properties marketed with LensFlow</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {["/property-2.jpg", "/property-3.jpg", "/property-5.jpg", "/property-6.jpg", "/property-7.jpg", "/property-8.jpg"].map((src, i) => (
              <div key={i} className="overflow-hidden rounded-2xl aspect-square">
                <img src={src} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
