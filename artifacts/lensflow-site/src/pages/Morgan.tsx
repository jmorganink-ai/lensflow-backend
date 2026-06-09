import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Zap, Clock, Shield, Star, Sparkles, Bot, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MorganPage() {
  const features = [
    {
      icon: MessageCircle,
      title: "Only for LensFlow",
      desc: "Unlike generic AI chatbots, Morgan is trained exclusively on real estate marketing, property presentation, and the LensFlow platform.",
    },
    {
      icon: Zap,
      title: "Instant Answers",
      desc: "Pricing, features, presenter selection, video specs — Morgan answers in seconds, not hours. No waiting for a support ticket.",
    },
    {
      icon: Clock,
      title: "Available 24/7",
      desc: "Late night script idea? Weekend campaign question? Morgan is always on, always sharp, always helpful.",
    },
    {
      icon: Shield,
      title: "Your Privacy First",
      desc: "Conversations are encrypted and private. Morgan never sells, shares, or trains on your personal data.",
    },
  ];

  const useCases = [
    {
      title: "Which presenter suits my listing?",
      body: "Mia for waterfront, Oliver for investment, Sophie for family. Morgan matches your property to the perfect presenter instantly.",
    },
    {
      title: "How does pricing work?",
      body: "Morgan breaks down plans in plain English. No surprises, no hidden fees — just the right plan for your volume.",
    },
    {
      title: "What\'s the video quality?",
      body: "1080p, broadcast-ready, voiced by ElevenLabs, synced by HeyGen. Morgan explains every technical detail if you want it.",
    },
    {
      title: "Can I use my own voice?",
      body: "Twin Avatar lets you build a digital version of yourself. Morgan walks you through the upload and simulation process step by step.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5 pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary">Your Personal AI</p>
                <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                  Meet Morgan.<br />
                  <span className="text-primary">Your Marketing Brain.</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-lg">
                  Morgan isn\'t a generic chatbot. It\'s a real estate marketing specialist trained to answer questions, suggest campaigns, and guide you through every LensFlow feature.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="/pipeline/">
                    <Button className="h-14 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                      Try Morgan Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <button
                    onClick={() => document.getElementById("what-morgan-does")?.scrollIntoView({ behavior: "smooth" })}
                    className="h-14 rounded-full border border-white/15 bg-white/5 px-7 text-base font-medium text-foreground hover:bg-white/10 transition"
                  >
                    See What Morgan Does
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/20 via-background to-background p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Morgan AI</p>
                    <p className="text-xs text-muted-foreground">LensFlow Marketing Assistant</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl rounded-tl-none bg-card border border-white/5 p-4 text-sm text-muted-foreground">
                    G\'day! I\'m Morgan. Ask me about pricing, presenters, video quality, or how to use Twin Avatar. I\'m here to help.
                  </div>
                  <div className="rounded-2xl rounded-tr-none bg-primary/10 border border-primary/20 p-4 text-sm text-foreground ml-8">
                    Which presenter is best for a coastal $2M+ listing?
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-card border border-white/5 p-4 text-sm text-muted-foreground">
                    For prestige coastal properties, I recommend **Mia**. Her warm, aspirational delivery matches lifestyle buyers perfectly. Want me to start the campaign?
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  AI-powered responses tailored to real estate marketing
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-card/40 border-y border-white/5 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center mb-12">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">Why Morgan?</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Not just another chatbot.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Morgan is built for agents, by people who understand real estate marketing. No generic answers. No fluff.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/8 bg-background p-7"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="what-morgan-does" className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center mb-14">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-primary">What Morgan Can Do</p>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Questions Morgan answers instantly.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Everything from presenter selection to technical specs — Morgan knows LensFlow inside and out.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {useCases.map((uc) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 rounded-2xl border border-white/8 bg-card p-6 sm:p-8"
              >
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{uc.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{uc.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-white/5 bg-card/40 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Your marketing questions deserve better answers.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Stop Googling. Stop guessing. Morgan knows LensFlow, knows real estate, and knows how to get your listings seen.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href="/pipeline/">
              <Button className="h-14 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                Chat with Morgan <ArrowRight className="ml-2 h-4 w-4" />
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
