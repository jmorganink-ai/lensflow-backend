import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, XCircle, ArrowRight, Crown, Sparkles, Video, Film } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      badge: null,
      price: isAnnual ? "79" : "89",
      videoLimit: "1 video / month",
      description: "You film. We write the script and run the teleprompter.",
      icon: Film,
      features: [
        "1 listing video per month",
        "AI-generated script from listing URL",
        "Scrolling teleprompter on your phone",
        "Self-record & upload from library",
        "720p video output",
        "REA & Domain compatible",
      ],
      notIncluded: [
        "AI presenter (no HeyGen / D-ID)",
        "ElevenLabs voiceover",
        "Voice + Photos slideshow",
        "Morgan marketing campaign",
      ],
      cta: "Start 7-day Free Trial",
      link: "https://buy.stripe.com/bJe00jc29bWsa6r2eX2go04",
      highlight: false,
    },
    {
      name: "Elite",
      badge: "Most Popular",
      price: isAnnual ? "199" : "219",
      videoLimit: "1 video / month",
      description: "The complete AI pipeline. Your listing, fully produced.",
      icon: Video,
      features: [
        "1 listing video per month",
        "AI presenter (Mia, Oliver, Sophie, James)",
        "ElevenLabs voice cloning & narration",
        "Voice + Photos slideshow option",
        "AI script from listing URL or photos",
        "Photo enhancement & Ken Burns",
        "4K rendering · REA & Domain export",
      ],
      notIncluded: [
        "Morgan marketing campaign",
        "Digital twin avatar",
      ],
      cta: "Start 7-day Free Trial",
      link: "https://buy.stripe.com/cNi14n1nv2lSemHbPx2go05",
      highlight: true,
    },
    {
      name: "Concierge",
      badge: null,
      price: isAnnual ? "399" : "449",
      videoLimit: "2 videos / month",
      description: "Full pipeline plus Morgan runs your marketing.",
      icon: Sparkles,
      features: [
        "2 listing videos per month",
        "Everything in Elite",
        "Morgan marketing campaign",
        "Social captions & email copy",
        "Content calendar scheduling",
        "Dedicated account manager",
        "White-glove onboarding · 24hr turnaround",
      ],
      notIncluded: [
        "Digital twin avatar",
      ],
      cta: "Book a Call",
      link: "https://buy.stripe.com/8x27sLfel8Kgcez8Dl2go06",
      highlight: false,
    },
  ];

  const enterpriseTier = {
    name: "Enterprise",
    price: isAnnual ? "1,799" : "1,999",
    description: "Full-agency rollout with dedicated infrastructure, multi-seat access, and a bespoke AI pipeline built around your brand.",
    features: [
      "Unlimited videos across unlimited agents",
      "Up to 20 custom AI presenter avatars",
      "Full white-label platform (your brand, your domain)",
      "Dedicated rendering infrastructure",
      "API access for CRM & portal integrations",
      "Custom voice cloning for every agent",
      "Franchise & multi-office management dashboard",
      "SLA-backed 4hr turnaround guarantee",
      "Quarterly strategy sessions with LensFlow team",
      "Priority onboarding & migration support"
    ],
    cta: "Contact Sales",
    link: "mailto:sales@lensflow.com.au"
  };

  const faqs = [
    {
      q: "What's the difference between Starter and Elite?",
      a: "Starter is for agents who want to film themselves — you get the AI script, a scrolling teleprompter on your phone, and 1 finished video per month. Elite hands the whole thing to an AI presenter: the script writes itself, ElevenLabs narrates it, and HeyGen or D-ID renders the final video without you lifting a camera."
    },
    {
      q: "What does the Morgan marketing campaign include?",
      a: "On Concierge, Morgan (our Claude-powered AI) generates your social captions, property email copy, and an Instagram/Facebook content calendar from the same listing data used to build your video — so your whole marketing push goes out in one click."
    },
    {
      q: "Are the videos compatible with REA and Domain?",
      a: "Yes. Every plan exports in a format that meets the exact upload specs for realestate.com.au and Domain. Starter (720p) meets the minimum; Elite and Concierge output full 4K."
    },
    {
      q: "Can I upgrade my plan mid-month?",
      a: "Absolutely — upgrades take effect immediately and we'll prorate the difference. Downgrades take effect at the start of your next billing cycle."
    },
    {
      q: "What happens if I want my own digital twin?",
      a: "That's the Twin Avatar Solution ($599/mo). You submit a short selfie video, we train your personal AI clone, and it presents every listing exactly like you — voice, mannerisms, and all. It includes 3 videos per month plus Morgan as your PA."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="pt-32 pb-24 lg:pt-48">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6">
              Pricing that scales with your <span className="text-primary italic">listings</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Generate endless marketing collateral without the camera crew. Choose the plan that fits your agency.
            </p>

            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
              <Switch 
                checked={isAnnual} 
                onCheckedChange={setIsAnnual} 
                data-testid="switch-billing-cycle"
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Annually
                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">Save 10%</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={tier.name}
                className={`relative rounded-3xl p-8 border ${
                  tier.highlight 
                    ? "bg-primary/5 border-primary/50 shadow-2xl shadow-primary/10" 
                    : "bg-card border-white/5"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full">
                    {tier.badge}
                  </div>
                )}

                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tier.highlight ? "bg-primary/20" : "bg-white/5"}`}>
                    <tier.icon className={`w-4.5 h-4.5 ${tier.highlight ? "text-primary" : "text-muted-foreground"}`} size={18} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold">{tier.name}</h3>
                </div>

                {/* Video limit badge */}
                <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Video size={11} /> {tier.videoLimit}
                </div>

                <p className="text-sm text-muted-foreground mb-5">{tier.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                
                <a href={tier.link} target="_blank" rel="noopener noreferrer" className="block mb-7">
                  <Button 
                    className={`w-full rounded-full h-12 text-base font-medium ${
                      tier.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white/10 hover:bg-white/20 text-foreground"
                    }`}
                    data-testid={`btn-pricing-${tier.name.toLowerCase()}`}
                  >
                    {tier.cta}
                  </Button>
                </a>

                <div className="space-y-3">
                  {tier.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" size={17} />
                      <span className="text-foreground/90">{feature}</span>
                    </div>
                  ))}
                  {tier.notIncluded.length > 0 && (
                    <div className="pt-3 mt-1 border-t border-white/5 space-y-3">
                      {tier.notIncluded.map((item, j) => (
                        <div key={j} className="flex items-start gap-3 text-sm">
                          <XCircle className="w-4.5 h-4.5 text-muted-foreground/40 shrink-0 mt-0.5" size={17} />
                          <span className="text-muted-foreground/50">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            No credit card required · 7-day free trial · Cancel anytime
          </p>

          {/* Enterprise Tier */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-6xl mx-auto mt-8"
          >
            <div className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 md:p-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-4 left-8 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground text-sm font-bold px-4 py-1 rounded-full">
                Enterprise
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-serif text-3xl font-bold mb-3">Full Agency Rollout</h3>
                  <p className="text-muted-foreground mb-6">{enterpriseTier.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold">${enterpriseTier.price}</span>
                    <span className="text-muted-foreground">/mo</span>
                    <span className="ml-3 text-sm text-muted-foreground">{isAnnual ? "billed annually" : "billed monthly"}</span>
                  </div>
                  <a href={enterpriseTier.link}>
                    <Button className="rounded-full h-12 px-8 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90" data-testid="btn-pricing-enterprise">
                      {enterpriseTier.cta} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {enterpriseTier.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <section className="py-24 bg-card border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="grid gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-background border border-white/5">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Twin Avatar prestige teaser */}
      <section className="py-20 px-6 bg-background border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/8 via-card to-card p-8 md:p-12 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -top-3 left-8">
              <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
                <Crown className="w-3 h-3" /> Prestige Package
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center pt-4">
              <div>
                <h3 className="font-serif text-3xl font-bold mb-3">
                  Twin Avatar Solution
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Create your own human-like digital twin that presents every listing
                  exactly like you — in 90 seconds flat. Includes Morgan as your
                  Personal Marketing Advisor PA.
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">$599</span>
                  <span className="text-muted-foreground">/mo</span>
                  <span className="ml-3 text-sm text-muted-foreground">· 3 videos · extra $499 each</span>
                </div>
                <Link href="/twin-avatar">
                  <Button className="rounded-full h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                    Explore Twin Avatar <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Your own digital twin avatar",
                  "Voice cloning — sounds like you",
                  "Morgan PA for Marketing",
                  "90-second 4K listing videos",
                  "3 videos per month",
                  "REA & Domain-ready export",
                  "Concierge onboarding",
                  "Extra projects at $499 each",
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
