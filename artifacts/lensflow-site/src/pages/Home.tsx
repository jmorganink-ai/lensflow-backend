import React, { useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, PlayCircle, Star, Shield, TrendingUp, Sparkles, Building, Video, CheckCircle2, XCircle, Users, Zap, Globe, Clock, Quote, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LeadCapture } from "@/components/LeadCapture";
import { UrgencyCounter } from "@/components/UrgencyCounter";

// Assets
import ogImage from "@assets/lensflow-brand/og-image.png";
import buildKitImage from "@assets/LensFlow-The-Build-Kit-every-tool-you-need_1780215479239.png";

const PRESENTERS = [
  {
    id: "mia",
    name: "Mia",
    tagline: "Waterfront & Lifestyle Specialist",
    specialty: "Coastal · Prestige · Instagram-first",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=533",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/workspace/f7c7da45b9a6460583b70fafd2405651/voices/x3PfG9wL6FOEApZ1VJ9H/92204d06-e00b-4d09-bbfc-3903c47a4c57.mp3",
    badge: "Most Popular",
  },
  {
    id: "oliver",
    name: "Oliver",
    tagline: "Inner-City & Investment Authority",
    specialty: "Urban · Off-the-plan · High-net-worth",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=533",
    previewUrl: "https://api.us.elevenlabs.io/v1/voices/yXFr3XVHzrViCIHi1yoc/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiJmN2M3ZGE0NWI5YTY0NjA1ODNiNzBmYWZkMjQwNTY1MSIsImZpbGVuYW1lIjoiYzZlNTZjZDctMTIwZC00MjM4LWFhYWUtZWZkNTRhNWI0YzM2Lm1wMyIsInRpbWVzdGFtcCI6MTc4MDIxMDgwMDAwMDAwMH0%3D",
    badge: null,
  },
  {
    id: "sophie",
    name: "Sophie",
    tagline: "Family Homes & Suburban Estates",
    specialty: "Family · Acreage · Off-market",
    photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400&h=533",
    previewUrl: "https://api.us.elevenlabs.io/v1/voices/69h9o7wh5u0isWHzdogD/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiJmN2M3ZGE0NWI5YTY0NjA1ODNiNzBmYWZkMjQwNTY1MSIsImZpbGVuYW1lIjoiYzBlMWJmMjUtZDEwNC00ZjY1LTg1ZTctNjE3ZDU5MjhmMDk5Lm1wMyIsInRpbWVzdGFtcCI6MTc4MDIxMDgwMDAwMDAwMH0%3D",
    badge: "New",
  },
  {
    id: "james",
    name: "James",
    tagline: "Commercial & Rural Properties",
    specialty: "Commercial · Rural · Development",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=533",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3",
    badge: null,
  },
];

function PresenterCard({ presenter }: { presenter: typeof PRESENTERS[0] }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-2xl overflow-hidden aspect-[3/4] relative group bg-card cursor-pointer"
    >
      <img
        src={presenter.photo}
        alt={presenter.name}
        className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      {presenter.badge && (
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full">
          {presenter.badge}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-base font-semibold leading-tight">{presenter.name}</div>
            <div className="text-xs text-primary mt-0.5">{presenter.tagline}</div>
            <div className="text-[10px] text-muted-foreground mt-1 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{presenter.specialty}</div>
          </div>
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center flex-shrink-0 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
            title={playing ? "Stop preview" : "Hear voice"}
          >
            {playing ? <Pause className="w-4 h-4 text-primary-foreground" /> : <Play className="w-4 h-4 text-primary-foreground ml-0.5" />}
          </button>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={presenter.previewUrl}
        onEnded={() => setPlaying(false)}
        preload="none"
      />
    </motion.div>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-hidden font-sans">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img src={ogImage} alt="" className="w-full h-full object-cover object-center mix-blend-overlay blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>The Future of Proptech</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="font-serif text-5xl lg:text-[78px] leading-[1.1] font-bold text-foreground mb-6">
                AI Videos That Sell Properties <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-200">Faster in 2026</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-xl lg:text-[21px] text-muted-foreground leading-relaxed mb-10 max-w-xl">
                Professional 4K listing videos with photoreal AI presenters. No filming required.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pipeline/">
                    <Button size="lg" data-testid="hero-btn-start" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform font-medium">
                      Start Creating Videos Now
                    </Button>
                  </Link>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /> Join <UrgencyCounter /> real estate agents already generating reels
                  </p>
                  <LeadCapture source="hero" />
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+15}`} alt="Agent" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="mt-1 block">Trusted by Australia's top agencies</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-card">
                <img src={ogImage} alt="LensFlow Interface" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="bg-background/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-mono text-sm tracking-wider">GENERATING_REEL</span>
                    </div>
                  </div>
                  <Button size="icon" className="w-14 h-14 rounded-full bg-primary/90 text-primary-foreground backdrop-blur hover:bg-primary">
                    <PlayCircle className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Trends Section */}
      <section id="trends" className="py-24 bg-card border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-[34px] font-bold mb-4">2026 Real Estate Marketing Trends</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="w-8 h-8 text-primary" />,
                title: "AI Avatars & Lip Sync",
                desc: "Replace hours of filming with professional AI presenters."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-primary" />,
                title: "Short-Form Video",
                desc: "Daily Reels and TikToks drive most leads."
              },
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Personal AI Twins",
                desc: "Your digital version works 24/7."
              }
            ].map((trend, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 + 0.2, duration: 0.6 } }
                }}
                className="p-8 rounded-3xl bg-background border border-white/5 hover:border-primary/30 transition-colors group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {trend.icon}
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-3">{trend.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{trend.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="font-serif text-3xl md:text-[34px] font-bold mb-6">Create listing videos in minutes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">No cameras, no lighting setup, no awkward retakes. Just upload your assets and let AI do the heavy lifting.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Upload Photos", desc: "Drag and drop your high-res property photos into the studio." },
              { step: "02", title: "Paste Script", desc: "Add your property description or let our AI write it for you." },
              { step: "03", title: "Choose Presenter", desc: "Select a professional AI avatar or use your custom digital twin." },
              { step: "04", title: "Generate Video", desc: "Download your 4K video formatted perfectly for every social platform." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-[80px] font-serif font-bold text-primary/10 leading-none mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Compare Section */}
      <section id="compare" className="py-24 bg-card/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-[34px] font-bold mb-4">The Old Way vs. LensFlow AI</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-3xl bg-background border border-white/5 opacity-70">
              <h3 className="text-xl text-muted-foreground font-semibold mb-6 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Traditional Videography
              </h3>
              <ul className="space-y-4">
                {["$500 - $1,500 per property", "Takes 3-5 days to deliver", "Requires you to be on-site", "Multiple awkward takes", "Costs extra for social formats"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white/20" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none" />
              <h3 className="text-xl text-primary font-semibold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> LensFlow AI Studio
              </h3>
              <ul className="space-y-4">
                {["Fraction of the cost", "Delivered in minutes", "Zero time on-site", "Perfect pitch, every time", "Export to all formats instantly"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Presenters Showcase */}
      <section id="presenters" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl md:text-[34px] font-bold mb-4">Premium AI Presenters</h2>
              <p className="text-xl text-muted-foreground">Choose from our diverse roster of highly realistic avatars, meticulously designed for luxury real estate.</p>
            </div>
            <Link href="/pipeline/">
              <Button variant="outline" className="rounded-full border-primary/50 text-foreground hover:bg-primary/10">
                Try a Presenter
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {PRESENTERS.map((p) => (
              <PresenterCard key={p.id} presenter={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 5b. The Engine Section */}
      <section className="py-24 relative bg-card/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Built for scale</div>
              <h2 className="font-serif text-3xl md:text-[34px] font-bold">Paste URL → Video.<br/><span className="text-primary italic">Here's the engine.</span></h2>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">Every step is modular, monitored, and production-hardened. From scraping the listing to delivering a finished MP4 — no human in the loop.</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <img
              src={buildKitImage}
              alt="LensFlow pipeline architecture — full vendor map from URL scrape to MP4 delivery"
              className="w-full"
            />
          </motion.div>
          <div className="flex items-center justify-center mt-6 gap-2 text-xs text-muted-foreground font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Build window 4–8 weeks · Cost per 60s video ~$2.54 · Margin $3.95/vid at 20 vids/mo
          </div>
        </div>
      </section>

      {/* 6. Cinematic Section */}
      <section className="py-32 relative overflow-hidden bg-card border-y border-white/5">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Command attention. <br/>
                <span className="text-primary italic">Without the camera crew.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                In a market where every agent has an iPhone, professional production value is your unfair advantage. LensFlow generates studio-quality listing videos from photos and a script in minutes.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Photorealistic 4K human presenters",
                  "Perfect lip-sync in 40+ languages",
                  "Cinematic camera moves generated from static photos",
                  "Automated captioning and social formatting"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground/90 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/pipeline/">
                <Button data-testid="cta-btn-generate" size="lg" className="rounded-full h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-medium">
                  Generate Your Reel Free
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
              }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 pt-12">
                <div className="rounded-3xl overflow-hidden aspect-[4/5] border border-white/10 relative group">
                  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop" alt="Luxury Home" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="rounded-3xl overflow-hidden aspect-square border border-white/10 relative group">
                  <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" alt="Modern Interior" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden aspect-square border border-white/10 relative group">
                  <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop" alt="Kitchen" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="rounded-3xl overflow-hidden aspect-[4/5] border border-white/10 relative group">
                  <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop" alt="Living Room" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Trusted by industry leaders</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Sarah Mitchell",
                agency: "Ray White Bondi",
                quote: "Cut our listing video time from 2 days to 15 minutes. It's completely transformed our marketing workflow.",
                img: "https://i.pravatar.cc/150?img=47"
              },
              {
                name: "James Okafor",
                agency: "McGrath Mosman",
                quote: "Vendors love the AI presenter — looks completely real. They are amazed at how quickly we can get campaigns live.",
                img: "https://i.pravatar.cc/150?img=11"
              },
              {
                name: "Priya Sharma",
                agency: "Barry Plant",
                quote: "The lip-sync is flawless. I use LensFlow for every single listing now, and the engagement on socials is through the roof.",
                img: "https://i.pravatar.cc/150?img=44"
              },
              {
                name: "Tom Hennessy",
                agency: "LJ Hooker",
                quote: "No more awkward reshoots or coordinating with videographers. Just perfect pitch delivery every time.",
                img: "https://i.pravatar.cc/150?img=33"
              }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-white/5 p-8 rounded-3xl flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-primary/40 mb-6" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground mb-8">"{testimonial.quote}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.agency}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Stats/Trust Section */}
      <section className="py-20 border-y border-white/5 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 text-center">
            <div>
              <div className="font-serif text-4xl font-bold text-primary mb-2">10k+</div>
              <div className="text-muted-foreground">Videos Generated</div>
            </div>
            <div>
              <div className="font-serif text-4xl font-bold text-primary mb-2">90%</div>
              <div className="text-muted-foreground">Cost Reduction</div>
            </div>
            <div>
              <div className="font-serif text-4xl font-bold text-primary mb-2">40+</div>
              <div className="text-muted-foreground">Languages Supported</div>
            </div>
            <div>
              <div className="font-serif text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Studio Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access / Velvet Rope Section */}
      <section className="py-32 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20 shadow-[0_0_30px_rgba(201,154,46,0.3)]">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Gain the unfair advantage.</h2>
          <p className="text-xl text-muted-foreground mb-12">
            LensFlow is currently in an exclusive early-access phase for top-performing Australian agencies. Request access below to secure your spot.
          </p>
          <div className="flex justify-center">
            <LeadCapture source="velvet-rope" />
          </div>
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="py-32 relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop')] opacity-10 mix-blend-multiply object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Building className="w-12 h-12 mx-auto mb-8 opacity-80" />
            <h2 className="font-serif text-4xl lg:text-[56px] font-bold mb-6 text-primary-foreground">
              Ready to dominate 2026?
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Join the top 1% of agents using LensFlow AI to scale their listing marketing infinitely.
            </p>
            <Link href="/pipeline/">
              <Button size="lg" className="h-16 px-10 rounded-full bg-background text-foreground hover:bg-background/90 text-xl font-semibold hover:scale-105 transition-transform shadow-xl">
                Start Creating Videos Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
