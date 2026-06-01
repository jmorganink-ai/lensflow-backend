import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingDown, Zap, Grid } from "lucide-react";

const YOUTUBE_ID = "haDt7Zw4Fjw";

const stats = [
  { label: "Cheaper", value: "~2,000×", icon: TrendingDown },
  { label: "Faster", value: "~10,000×", icon: Zap },
  { label: "Coverage", value: "Every listing", icon: Grid },
];

const timeline = [
  {
    year: "2016",
    title: "The video",
    body: "An agency in Hampton Park made my family a property video. Full production crew. Godfather-themed skit. Beautiful work. We watched it once together at the kitchen table.",
    tags: ["~1 week", "~$5,000"],
    accent: false,
  },
  {
    year: "2023",
    title: "The realisation",
    body: "I checked the YouTube link nine years later. 221 views. 2 likes. A week of someone's life and five grand of my family's money — for a video almost nobody saw.",
    tags: ["the math never worked"],
    accent: false,
  },
  {
    year: "2026",
    title: "LensFlow",
    body: "Paste a Domain or REA URL. Sixty seconds later, you've got a finished, branded, voiced, captioned video for every listing. The same output the production company sold us — at 2,000× less cost, 10,000× faster.",
    tags: ["$2.54", "60 sec", "ready now"],
    accent: true,
  },
];

export default function Origin() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-4"
          >
            <span className="text-xs font-mono tracking-widest text-primary/70 uppercase">
              § Origin · 2016 – 2026
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* ── LEFT: Story ── */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6"
              >
                My family paid{" "}
                <span className="text-primary italic">$5,000</span> for a
                video.
                <br />
                <span className="text-muted-foreground">
                  221 people watched it.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base text-muted-foreground leading-relaxed mb-12 max-w-md border-l-2 border-primary/40 pl-4 italic"
              >
                That's the moment that started LensFlow — and the math problem
                we exist to solve.
              </motion.p>

              {/* Timeline */}
              <div className="relative space-y-0">
                <div className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-white/8" />

                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="relative flex gap-6 pb-10"
                  >
                    {/* Year marker */}
                    <div className="flex-shrink-0 w-16 pt-1 text-right">
                      <span
                        className={`text-xs font-mono font-semibold tracking-wider ${
                          item.accent ? "text-primary" : "text-muted-foreground/60"
                        }`}
                      >
                        {item.year}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="relative flex-shrink-0 flex items-start justify-center w-2 pt-2">
                      <div
                        className={`w-2 h-2 rounded-full border ${
                          item.accent
                            ? "bg-primary border-primary"
                            : "bg-background border-white/20"
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                      <h3
                        className={`font-semibold text-base mb-1.5 ${
                          item.accent ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {item.body}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2.5 py-1 rounded-full font-mono ${
                              item.accent
                                ? "bg-primary/15 text-primary border border-primary/30"
                                : "bg-white/5 text-muted-foreground border border-white/10"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-2"
              >
                <a href="#hero-form">
                  <Button className="rounded-full h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                    Try one on your listing <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* ── RIGHT: Proof panel ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="space-y-4 lg:sticky lg:top-28"
            >
              <div className="rounded-2xl border border-white/8 bg-card overflow-hidden">
                {/* Panel header */}
                <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-primary/70 uppercase">
                    § The Proof · Same House
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/50">
                    86 Fontana Close, Sunshine West
                  </span>
                </div>

                {/* 2016 video */}
                <div className="p-4 space-y-2 border-b border-white/8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                        YouTube
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">2016</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50 font-mono">
                      INDUSTRY MEDIA
                    </span>
                  </div>

                  {/* YouTube embed */}
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
                      title="86 Fontana Close – 2016 production video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  {/* 2016 stats */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { k: "COST", v: "~$5,000" },
                      { k: "TIME", v: "~1 week" },
                      { k: "VIEWS", v: "221 / 9 yrs" },
                    ].map(({ k, v }) => (
                      <div
                        key={k}
                        className="rounded-lg bg-white/4 px-3 py-2 text-center"
                      >
                        <p className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-0.5">
                          {k}
                        </p>
                        <p className="text-xs font-semibold text-foreground font-mono">
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider arrow */}
                <div className="flex items-center justify-center py-3 gap-3 bg-white/2 border-b border-white/8">
                  <div className="flex-1 h-px bg-primary/20 ml-6" />
                  <span className="text-[10px] font-mono text-primary/70 tracking-widest whitespace-nowrap">
                    same house · ten years later →
                  </span>
                  <div className="flex-1 h-px bg-primary/20 mr-6" />
                </div>

                {/* 2026 — LensFlow version */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                        LensFlow
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">2026</span>
                    </div>
                    <span className="text-[10px] text-primary/60 font-mono">
                      AI GENERATED
                    </span>
                  </div>

                  {/* Placeholder video frame */}
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center border border-primary/20">
                    <div className="text-center px-6">
                      <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        LensFlow version coming soon
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Same listing · AI presenter · $2.54
                      </p>
                    </div>
                  </div>

                  {/* 2026 stats */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { k: "COST", v: "$2.54" },
                      { k: "TIME", v: "60 sec" },
                      { k: "VIEWS", v: "every portal" },
                    ].map(({ k, v }) => (
                      <div
                        key={k}
                        className="rounded-lg bg-primary/8 px-3 py-2 text-center border border-primary/15"
                      >
                        <p className="text-[9px] font-mono text-primary/50 uppercase tracking-widest mb-0.5">
                          {k}
                        </p>
                        <p className="text-xs font-semibold text-primary font-mono">
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comparison stats */}
              <div className="grid grid-cols-3 gap-3">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="rounded-xl bg-card border border-white/8 px-4 py-4 text-center"
                  >
                    <p className="text-xl font-bold text-primary font-mono mb-0.5">
                      {s.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom founder quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 border-t border-white/5 pt-16"
        >
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="font-serif text-2xl md:text-3xl text-foreground/90 leading-relaxed mb-6">
              "Built by someone who paid the{" "}
              <span className="text-primary italic">$5,000 bill.</span>"
            </p>
            <p className="text-sm text-muted-foreground font-mono tracking-wide">
              — John Morgan · Founder, LensFlow · Melbourne
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
