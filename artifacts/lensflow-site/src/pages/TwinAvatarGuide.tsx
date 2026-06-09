import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Camera, UserPlus, Upload, Sparkles, Play, Video, Clock, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TwinAvatarGuide() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;
    if (videoPlaying) {
      video.pause();
      setVideoPlaying(false);
    } else {
      video.play().catch(() => {});
      setVideoPlaying(true);
    }
  }

  const painPoints = [
    {
      icon: Camera,
      title: "Camera Shy",
      desc: "You freeze when the red light turns on. Every take feels worse than the last.",
    },
    {
      icon: UserPlus,
      title: "Lost Self-Esteem",
      desc: "You used to be confident. Now every recording chips away at what\'s left.",
    },
    {
      icon: Video,
      title: "Not Confident on Video",
      desc: "Your energy drops, your voice goes flat, and prospects tune out in seconds.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up & Access Twin Studio",
      body: "Create your LensFlow account and navigate to the Twin Avatar studio. It takes less than 60 seconds to get started.",
    },
    {
      number: "02",
      title: "Upload Your Footage",
      body: "Upload 2–3 minutes of yourself talking. The more natural the better — sitting, walking, gesturing. Our AI studies your expressions, posture, and voice.",
    },
    {
      number: "03",
      title: "Tell Us About You",
      body: "Fill in your details: name, agency, role, tone of voice, and typical client type. The AI uses this to simulate your personality accurately.",
    },
    {
      number: "04",
      title: "AI Simulates Your Character",
      body: "Our engine builds a digital twin that moves, sounds, and speaks like you. You\'ll review a preview before it goes live.",
    },
    {
      number: "05",
      title: "Approve & Deploy",
      body: "Your Twin Avatar is ready. Use it for every listing — no more reshoots, no more bad hair days, no more lost confidence.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO — Pain Point Hook */}
      <section className="relative overflow-hidden border-b border-white/5 pt-28 pb-0 lg:pt-0">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid lg:grid-cols-2 gap-0 items-end">
            <div className="py-16 lg:py-32 pr-0 lg:pr-12">
              <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary">Twin Avatar</p>
              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Your Confidence is Your Brand.<br />
                <span className="text-primary">Let AI Carry It.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-lg">
                Sales reps lose listings because they don\'t show up well on camera. LensFlow Twin Avatar eliminates camera shyness, self-doubt, and bad takes — forever.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="/pipeline/">
                  <Button className="h-14 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground">
                    Create My Twin Avatar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <button
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-14 rounded-full border border-white/15 bg-white/5 px-7 text-base font-medium text-foreground hover:bg-white/10 transition"
                >
                  See How It Works
                </button>
              </div>
            </div>

            {/* Video + Pain Points side */}
            <div className="hidden lg:block relative py-8 h-[600px]">
              <div className="absolute inset-0 rounded-t-[2rem] overflow-hidden bg-gradient-to-b from-primary/20 to-transparent">
                <video
                  ref={videoRef}
                  src="/videos/twin-avatar-guide.mp4"
                  poster="/presenters/twin-avatar-poster.jpg"
                  className="h-full w-full object-cover"
                  onEnded={() => setVideoPlaying(false)}
                />
                {!videoPlaying && (
                  <button
                    onClick={toggleVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
                  >
                    <div className="flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-black backdrop-blur">
                      <Play className="h-4 w-4" /> Watch the Guide
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="bg-card/40 border-y border-white/5 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center mb-12">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">The Real Problem</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Camera shy. Lost confidence. Bad takes.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              You know your properties. You know your market. But every time the camera turns on, your energy drops and your message gets lost.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {painPoints.map((p) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/8 bg-background p-7 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — steps */}
      <section id="how-it-works" className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center mb-14">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">How It Works</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Build your digital twin in 5 minutes.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              No studio. No makeup. No retakes. Upload once. Your twin works forever.
            </p>
          </div>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex gap-5 sm:gap-7 items-start rounded-2xl border border-white/8 bg-card p-6 sm:p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary font-serif text-xl font-bold">
                  {s.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BAR */}
      <section className="border-y border-white/5 bg-card/40 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock, title: "Always On", desc: "Your twin works 24/7 — no sick days, no reshoots, no delays." },
              { icon: Shield, title: "Brand Safe", desc: "Every video stays on-message. Zero off-script mistakes." },
              { icon: Star, title: "Consistent Quality", desc: "Lighting, framing, and delivery locked in — every single time." },
              { icon: Sparkles, title: "Your Personality", desc: "AI simulates your mannerisms, tone, and energy faithfully." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-white/8 bg-background p-6">
                <f.icon className="h-6 w-6 text-primary mb-3" />
                <h4 className="text-sm font-semibold">{f.title}</h4>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Stop losing listings to bad video.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Your Twin Avatar never gets nervous, never has a bad hair day, and never forgets the script. It\'s you — at your best — every time.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href="/pipeline/">
              <Button className="h-14 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground">
                Start Free — Create My Twin <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="/presenters">
              <Button variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-8 text-base text-foreground">
                Meet the AI Presenters
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
