import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      price: isAnnual ? "79" : "89",
      description: "Perfect for solo agents starting with AI video.",
      features: [
        "20 AI Videos per month",
        "All 4 AI presenters (Mia, Oliver, Sophie & James)",
        "ElevenLabs voiceover",
        "720p & 1080p rendering"
      ],
      cta: "Start 7-day Free Trial",
      link: "https://buy.stripe.com/bJe00jc29bWsa6r2eX2go04",
      highlight: false
    },
    {
      name: "Elite",
      price: isAnnual ? "199" : "219",
      description: "For top-producing agents who want maximum impact.",
      features: [
        "Unlimited AI Videos",
        "Custom Avatar Training",
        "Advanced Phoneme Lip Sync",
        "Priority Rendering",
        "REA/Domain Export",
        "4K resolution output"
      ],
      cta: "Start 7-day Free Trial",
      link: "https://buy.stripe.com/cNi14n1nv2lSemHbPx2go05",
      highlight: true
    },
    {
      name: "Concierge",
      price: isAnnual ? "399" : "449",
      description: "White-glove service for luxury agencies.",
      features: [
        "Everything in Elite",
        "White Glove Service",
        "Dedicated Account Manager",
        "Voice Cloning",
        "24hr Turnaround",
        "Custom branding & intros"
      ],
      cta: "Book a Call",
      link: "https://buy.stripe.com/8x27sLfel8Kgcez8Dl2go06",
      highlight: false
    }
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
      q: "Do I need any special equipment to film?",
      a: "None at all. LensFlow uses your existing property photos to generate the video, and our AI presenters deliver your script. You don't even need a microphone."
    },
    {
      q: "Can I train my own custom avatar?",
      a: "Yes! On the Elite and Concierge plans, you can submit a 2-minute video of yourself, and we'll train a custom digital twin that looks and sounds exactly like you."
    },
    {
      q: "Are the videos compatible with REA and Domain?",
      a: "Absolutely. Our export formats are specifically tailored to meet the exact specifications required by major Australian real estate portals."
    },
    {
      q: "What languages do the AI presenters speak?",
      a: "Our presenters are trained in Australian English and deliver natural-sounding scripts tailored to the local market. Additional language options are available on the Concierge and Enterprise plans."
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
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-serif text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-6 h-10">{tier.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                
                <a href={tier.link} target="_blank" rel="noopener noreferrer" className="block mb-8">
                  <Button 
                    className={`w-full rounded-full h-12 text-base font-medium ${
                      tier.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white/10 hover:bg-white/20 text-foreground"
                    }`}
                    data-testid={`btn-pricing-${tier.name.toLowerCase()}`}
                  >
                    {tier.cta}
                  </Button>
                </a>

                <div className="space-y-4">
                  {tier.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground/90">{feature}</span>
                    </div>
                  ))}
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

      <Footer />
    </div>
  );
}
