import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Pause, Star, Mic, Video, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const presenters = [
  {
    id: "mia",
    name: "Mia",
    role: "Luxury & Lifestyle Presenter",
    tagline: "Warm, polished and ideal for coastal, prestige and family listings.",
    bio: "Mia brings a natural warmth and aspirational tone that resonates with lifestyle buyers. Her delivery is confident without being salesy — perfect for beachside, prestige and family properties where emotion drives the decision.",
    poster: "/presenters/mia-poster.jpg",
    video: "/presenters/mia.mp4",
    audio: "/presenters/mia-preview.mp3",
    bestFor: ["Waterfront & coastal", "Prestige & luxury", "Family lifestyle", "Acreage & lifestyle"],
    color: "from-amber-900/30 to-black",
    accent: "border-amber-500/30",
  },
  {
    id: "oliver",
    name: "Oliver",
    role: "Investment & City Presenter",
    tagline: "Sharper, confident and suited to apartments, developers and investor campaigns.",
    bio: "Oliver's tone is direct, data-aware and professional — the voice investors trust. He positions properties in terms of opportunity, yield and lifestyle upside rather than just features. Built for urban, commercial and development campaigns.",
    poster: "/presenters/oliver-poster.jpg",
    video: "/presenters/oliver.mp4",
    audio: "/presenters/oliver-preview.mp3",
    bestFor: ["Apartments & units", "Investment properties", "Off-the-plan", "Commercial"],
    color: "from-blue-900/30 to-black",
    accent: "border-blue-500/30",
  },
  {
    id: "sophie",
    name: "Sophie",
    role: "Family & Suburban Presenter",
    tagline: "Friendly and relatable — perfect for family homes and suburban lifestyle.",
    bio: "Sophie is approachable, genuine and grounded. She speaks to families the way they actually think about a home — schools, neighbours, space and lifestyle. Her delivery is warm without overselling, making buyers feel at ease.",
    poster: "/presenters/sophie-poster.jpg",
    video: "/presenters/sophie.mp4",
    audio: "/presenters/sophie-preview.mp3",
    bestFor: ["Family homes", "Suburban streets", "First-home buyers", "Townhouses"],
    color: "from-rose-900/30 to-black",
    accent: "border-rose-500/30",
  },
];

function PresenterCard({ presenter }: { presenter: typeof presenters[0] }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`overflow-hidden rounded-[2rem] border ${presenter.accent} bg-card`}
    >
      <div className="grid lg:grid-cols-[360px_1fr]">
        {/* Video / poster */}
        <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-b ${presenter.color} lg:aspect-auto lg:min-h-[440px]`}>
          <video
            src={presenter.video}
            poster={presenter.poster}
            autoPlay muted loop playsInline
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Voice preview button */}
          <button
            onClick={toggleAudio}
            className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/70"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            {playing ? "Pause voice" : "Preview voice"}
          </button>
          <audio
            ref={audioRef}
            src={presenter.audio}
            onEnded={() => setPlaying(false)}
            preload="none"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center p-8 lg:p-10">
          <p className="text-sm uppercase tracking-[0.22em] text-primary">{presenter.role}</p>
          <h2 className="mt-2 font-serif text-4xl font-bold lg:text-5xl">{presenter.name}</h2>
          <p className="mt-4 text-lg font-medium text-foreground">{presenter.tagline}</p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{presenter.bio}</p>

          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Best for</p>
            <div className="flex flex-wrap gap-2">
              {presenter.bestFor.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 text-primary" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <a href={`/pipeline/?presenter=${presenter.id}`}>
              <Button className="h-12 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground">
                Use {presenter.name} for My Listing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Presenters() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="border-b border-white/5 pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary">AI Presenters</p>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Meet your AI presenting team.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
              Three Australian AI presenters, each matched to a different property type and buyer audience.
              Pick one per listing — LensFlow writes them a script specific to your property.
            </p>
          </div>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { icon: Mic, label: "Natural Australian voice" },
              { icon: Video, label: "Full lipsync & HD render" },
              { icon: Zap, label: "Script written by Claude AI" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-muted-foreground">
                <f.icon className="h-4 w-4 text-primary" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Presenter cards */}
      <section className="bg-background py-12 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-8 px-5">
          {presenters.map((p) => (
            <PresenterCard key={p.id} presenter={p} />
          ))}
        </div>
      </section>

      {/* How presenters are matched */}
      <section className="border-y border-white/5 bg-card/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">How It Works</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              The presenter is just the beginning.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              LensFlow reads your listing URL, writes a property-specific script with Claude AI,
              then renders your chosen presenter with ElevenLabs voice and HeyGen lipsync.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { step: "01", title: "Claude AI reads your listing", body: "Suburb, bedrooms, style and price point are extracted from the URL and used to write a script tailored to your exact property." },
              { step: "02", title: "Your presenter delivers it", body: "Mia, Oliver, Sophie or James narrate the script with a natural Australian accent, emotion and delivery matched to the listing type." },
              { step: "03", title: "HeyGen renders the video", body: "Professional lipsync, broadcast-quality render and finished MP4 — ready to post within minutes, not days." },
            ].map((s) => (
              <div key={s.step} className="rounded-[1.75rem] border border-white/10 bg-background p-7">
                <span className="font-serif text-5xl text-white/8">{s.step}</span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — no pricing */}
      <section className="bg-background py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Pick your presenter and go.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Start with a listing URL. Your AI presenter will handle the rest.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href="/pipeline/">
              <Button className="w-full sm:w-auto h-14 rounded-2xl bg-primary px-8 text-base font-semibold text-primary-foreground sm:h-12 sm:rounded-full">
                Start Free — No Credit Card <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="/examples">
              <Button variant="outline" className="w-full sm:w-auto h-12 rounded-2xl border-white/15 bg-white/5 px-8 text-base text-foreground sm:rounded-full">
                See Campaign Examples
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
