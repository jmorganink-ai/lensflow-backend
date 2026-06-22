import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  CheckCircle2, Crown, Clock, Video, Mic, Star,
  ChevronRight, ArrowRight, Shield, Users, Sparkles, Phone,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const PRESTIGE = [
  "48-hour delivery guarantee",
  "4K professional video output",
  "AI-written script tailored to the listing",
  "Choice of Mia, Oliver, Sophie or James",
  "3 social media cut-downs (Reels/TikTok ready)",
  "Background music + colour grade",
  "REA & Domain-ready export",
  "One round of revisions included",
];

const SIGNATURE = [
  "Everything in Prestige",
  "24-hour priority delivery",
  "Custom digital twin avatar (trained on you)",
  "Voice cloning — sounds exactly like you",
  "Unlimited revisions",
  "Full campaign pack: captions, email, social calendar",
  "Dedicated account manager",
  "Direct WhatsApp line to your producer",
];

const HOW = [
  {
    step: "01",
    title: "You send us the listing",
    body: "Paste a REA or Domain URL, or share the address and a few photos. That's it.",
  },
  {
    step: "02",
    title: "We handle everything",
    body: "Our team writes the script, generates the AI presenter video, adds music, captions and colour grade.",
  },
  {
    step: "03",
    title: "You get a finished video",
    body: "Delivered to your inbox — 4K, platform-ready, with social cuts — within 48 hours.",
  },
];

const TESTIMONIALS = [
  {
    quote: "I listed a $4.2M home in Mosman on a Friday. By Saturday morning the video was in my inbox. We had three inspection requests before the weekend was over.",
    name: "Sarah Chen",
    agency: "LJ Hooker · Mosman",
    initials: "SC",
  },
  {
    quote: "I don't have time to learn software. Concierge means I email a link and two days later I have a video my vendors are blown away by.",
    name: "Marcus Webb",
    agency: "Ray White · South Yarra",
    initials: "MW",
  },
  {
    quote: "The Signature package paid for itself on the first listing. My vendors shared the video before I even uploaded it.",
    name: "Priya Sharma",
    agency: "McGrath · North Shore",
    initials: "PS",
  },
];

export default function Concierge() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="pt-32 pb-24">

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-24">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
              <Crown className="w-3.5 h-3.5" /> White-Glove Service
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl lg:text-7xl font-bold leading-tight mb-6">
              We make the video.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-200">You close the deal.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Hand us the listing URL. Our team scripts, records, edits and delivers a 4K AI presenter video — ready for REA, Domain, and socials — in 48 hours or less.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:concierge@lensflow.com.au?subject=Concierge+Enquiry">
                <Button className="rounded-full h-14 px-10 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/25">
                  Book a Concierge Call <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <Link href="/pricing">
                <Button variant="outline" className="rounded-full h-14 px-8 text-base border-white/10 hover:bg-white/5">
                  See self-serve plans <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Trust bar */}
        <section className="border-y border-white/5 bg-white/[0.02] py-6 mb-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              {["48-hour delivery", "4K resolution", "REA & Domain ready", "Real humans reviewing every video", "Money-back guarantee"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-6 mb-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold mb-4">How it works</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">Three steps. Zero effort on your part.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-8">
            {HOW.map((h) => (
              <motion.div key={h.step} variants={fadeUp} className="relative bg-white/[0.03] border border-white/8 rounded-2xl p-8">
                <div className="text-5xl font-black text-primary/20 mb-4 font-mono">{h.step}</div>
                <h3 className="font-semibold text-lg mb-2">{h.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{h.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Packages */}
        <section className="max-w-5xl mx-auto px-6 mb-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold mb-4">Choose your package</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">One-off projects, no subscription required.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 gap-8">

            {/* Prestige */}
            <motion.div variants={fadeUp} className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">Prestige</span>
              </div>
              <div className="mb-2">
                <span className="text-6xl font-black">$1,500</span>
                <span className="text-muted-foreground ml-2">per listing</span>
              </div>
              <p className="text-muted-foreground text-sm mb-8">Professional AI presenter video, delivered in 48 hours. Perfect for any listing where quality matters.</p>
              <ul className="space-y-3 mb-10 flex-1">
                {PRESTIGE.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="mailto:concierge@lensflow.com.au?subject=Prestige+Package+Enquiry">
                <Button className="w-full rounded-full h-12 font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                  Book Prestige <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </motion.div>

            {/* Signature */}
            <motion.div variants={fadeUp} className="relative bg-gradient-to-b from-primary/10 to-transparent border-2 border-primary/40 rounded-3xl p-10 flex flex-col">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">Most Requested</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">Signature</span>
              </div>
              <div className="mb-2">
                <span className="text-6xl font-black">$2,200</span>
                <span className="text-muted-foreground ml-2">per listing</span>
              </div>
              <p className="text-muted-foreground text-sm mb-8">Your own digital twin + full campaign pack. 24-hour priority delivery. For prestige listings that deserve the best.</p>
              <ul className="space-y-3 mb-10 flex-1">
                {SIGNATURE.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="mailto:concierge@lensflow.com.au?subject=Signature+Package+Enquiry">
                <Button className="w-full rounded-full h-12 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/25">
                  Book Signature <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            Need ongoing Concierge production? <a href="/pricing" className="text-primary hover:underline">Our $399/mo plan</a> gives you priority access every month.
          </motion.p>
        </section>

        {/* What's included detail */}
        <section className="max-w-5xl mx-auto px-6 mb-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold mb-4">What you get in every video</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Video, title: "4K Presenter Video", desc: "Your AI presenter delivers the script on screen with natural lip-sync and movement." },
              { icon: Mic, title: "Professional Voiceover", desc: "ElevenLabs ultra-realistic narration — warm, clear, Australian accent options." },
              { icon: Sparkles, title: "AI-Written Script", desc: "Claude reads the listing and writes a compelling, property-specific script in seconds." },
              { icon: Clock, title: "48-Hour Delivery", desc: "Your video is in your inbox before most agents have even thought about theirs." },
              { icon: Shield, title: "REA & Domain Ready", desc: "Delivered in the exact spec each platform requires — no re-encoding needed." },
              { icon: Users, title: "Social Cut-Downs", desc: "Reels, TikTok, and Story-sized versions included in every Prestige+ package." },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="max-w-5xl mx-auto px-6 mb-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold mb-4">Agents who never looked back</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="bg-white/[0.03] border border-white/8 rounded-2xl p-7 flex flex-col gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{t.initials}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.agency}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
                <Phone className="w-3.5 h-3.5" /> Limited spots available
              </motion.div>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl lg:text-5xl font-bold mb-6">
                Ready to hand it over?
              </motion.h2>
              <motion.p variants={fadeUp} className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                Email us the listing. We'll have a finished video back to you in 48 hours.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:concierge@lensflow.com.au?subject=Concierge+Enquiry">
                  <Button className="rounded-full h-14 px-10 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/25">
                    Email concierge@lensflow.com.au <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </motion.div>
              <motion.p variants={fadeUp} className="text-xs text-muted-foreground mt-6">
                Response within 2 business hours · money-back guarantee if not satisfied
              </motion.p>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
