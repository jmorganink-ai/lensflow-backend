import { ArrowRight, Sparkles, Link2, ImageIcon, Video, Mic, Play, BarChart2, TrendingUp, TrendingDown, DollarSign, Globe, Zap, ChevronRight, Star, CheckCircle2, FileText, Clock } from "lucide-react";

export function V3Cosmic() {
  return (
    <div className="min-h-screen bg-[#05050d] text-white font-sans overflow-x-hidden">

      {/* ── Campaign Hero ── */}
      <div className="relative overflow-hidden px-6 pt-8 pb-6">
        {/* ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#f59e0b]/6 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-0 w-[400px] h-[300px] bg-purple-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#f59e0b]/25 bg-[#f59e0b]/8 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
            <span className="text-[11px] font-mono text-[#f59e0b] uppercase tracking-widest">Luxury Real Estate Marketing OS</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight leading-none mb-4">
            Create Property Campaigns<br />
            <span className="bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
              That Win Listings
            </span>
          </h1>
          <p className="text-[#9ca3af] text-base leading-relaxed max-w-xl mx-auto mb-7">
            AI script → ElevenLabs voiceover → HeyGen presenter video → social media pack.<br />
            <span className="text-white/60">Under 5 minutes. Every listing.</span>
          </p>
          <button className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black rounded-xl font-bold text-base shadow-2xl shadow-[#f59e0b]/30 hover:shadow-[#f59e0b]/40 hover:scale-[1.02] transition-all">
            <Sparkles className="w-5 h-5" />
            Generate Property Campaign
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 launch modes */}
        <div className="relative grid grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { icon: Link2, label: "Property URL", desc: "Paste any listing link", hot: true },
            { icon: ImageIcon, label: "Photo Campaign", desc: "Upload property photos" },
            { icon: Video, label: "Upload Video", desc: "Use your footage" },
            { icon: Mic, label: "Teleprompter", desc: "Self-record with script", hot: false },
          ].map(({ icon: Icon, label, desc, hot }) => (
            <button key={label} className={`group relative flex flex-col gap-2 p-4 rounded-xl border transition-all text-left ${hot ? "border-[#f59e0b]/40 bg-[#f59e0b]/6 hover:bg-[#f59e0b]/10" : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"}`}>
              {hot && <div className="absolute top-2 right-2 text-[9px] font-mono bg-[#f59e0b] text-black px-1.5 py-0.5 rounded-full">Popular</div>}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hot ? "bg-[#f59e0b]/15" : "bg-white/6"}`}>
                <Icon className={`w-4.5 h-4.5 ${hot ? "text-[#f59e0b]" : "text-white/50"}`} style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-[11px] text-[#6b7280] mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="px-6 py-4 grid grid-cols-4 gap-3">
        {[
          { label: "Campaigns Created", val: "12", delta: "+3 this week", icon: CheckCircle2, color: "#f59e0b" },
          { label: "Properties Processed", val: "38", delta: "24 suburbs mapped", icon: Globe, color: "#60a5fa" },
          { label: "Marketing Hours Saved", val: "48h", delta: "vs manual production", icon: Clock, color: "#34d399" },
          { label: "Est. Value Generated", val: "$6.3k", delta: "agency savings", icon: DollarSign, color: "#a78bfa" },
        ].map(({ label, val, delta, icon: Icon, color }) => (
          <div key={label} className="relative rounded-xl border border-white/6 bg-white/2 p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-50" style={{ background: `radial-gradient(ellipse at top right, ${color}08, transparent 60%)` }} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color }}>{label}</p>
                <p className="text-3xl font-black font-mono tracking-tight">{val}</p>
                <p className="text-[11px] text-[#4b5563] mt-1">{delta}</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-4 grid grid-cols-12 gap-4">

        {/* ── AI Presenters ── */}
        <div className="col-span-5 rounded-xl border border-white/6 bg-white/2 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#f59e0b]">AI Presenter Studio</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/8 px-1.5 py-0.5 rounded">4 Active</span>
          </div>

          <div className="p-3 grid grid-cols-2 gap-2">
            {[
              { name: "Mia", spec: "Luxury listings", tag: "⭐ Top rated", color: "#f43f5e", bg: "from-rose-500/15 to-transparent" },
              { name: "Oliver", spec: "Corporate premium", tag: "Most used", color: "#60a5fa", bg: "from-blue-500/15 to-transparent" },
              { name: "Liam", spec: "Confident sales", tag: "New", color: "#f59e0b", bg: "from-amber-500/15 to-transparent" },
              { name: "Sophie", spec: "Lifestyle reels", tag: "Trending", color: "#34d399", bg: "from-emerald-500/15 to-transparent" },
            ].map(p => (
              <button key={p.name} className={`group flex flex-col items-center gap-2 p-3 rounded-xl border border-white/6 bg-gradient-to-br ${p.bg} hover:border-white/15 transition-all`}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black" style={{ background: `${p.color}20`, border: `2px solid ${p.color}30`, color: p.color }}>
                  {p.name[0]}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">{p.name}</p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: p.color }}>{p.spec}</p>
                  <p className="text-[9px] text-[#6b7280] mt-1">{p.tag}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-[10px] px-3 py-1 rounded-full font-mono transition-opacity" style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}30` }}>
                  Select →
                </button>
              </button>
            ))}
          </div>

          {/* Value section */}
          <div className="p-3 border-t border-white/5">
            <div className="rounded-lg bg-[#f59e0b]/8 border border-[#f59e0b]/15 p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#f59e0b] mb-0.5">Est. value — 12 campaigns</p>
                <p className="text-2xl font-black font-mono text-[#f59e0b]">$6,300</p>
              </div>
              <div className="text-right text-[10px] font-mono text-[#6b7280] space-y-0.5">
                <p>Script $600</p>
                <p>Voice $900</p>
                <p>Video $3,000</p>
                <p>Social $1,800</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Campaigns ── */}
        <div className="col-span-7 rounded-xl border border-white/6 bg-white/2 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
            <span className="text-[11px] font-mono uppercase tracking-widest">Recent Campaigns</span>
            <button className="text-[11px] text-[#f59e0b] font-mono hover:text-[#f59e0b]/80">View all →</button>
          </div>
          <div className="flex-1 divide-y divide-white/4">
            {[
              { title: "14 Harbour View Dr, Mosman NSW", presenter: "Mia", type: "Luxury", status: "complete", time: "2h ago", color: "#f43f5e" },
              { title: "8/32 St Kilda Rd, Melbourne VIC", presenter: "Oliver", type: "Corporate", status: "processing", time: "5h ago", color: "#60a5fa" },
              { title: "3 Bondi Beach Rd, Sydney NSW", presenter: "Sophie", type: "Lifestyle", status: "queued", time: "Yesterday", color: "#34d399" },
              { title: "12 Chapel St, Prahran VIC", presenter: "Liam", type: "Sales", status: "complete", time: "2d ago", color: "#f59e0b" },
              { title: "21 The Corso, Manly NSW", presenter: "Mia", type: "Luxury", status: "complete", time: "3d ago", color: "#f43f5e" },
            ].map((j, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-white/2 cursor-pointer group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{ background: `${j.color}18`, color: j.color, border: `1px solid ${j.color}28` }}>
                  {j.presenter[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{j.title}</p>
                  <p className="text-[11px] text-[#6b7280] font-mono">{j.presenter} · {j.type} · {j.time}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-mono border uppercase tracking-wider ${
                  j.status === "complete" ? "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20" :
                  j.status === "processing" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                }`}>{j.status}</span>
                <ChevronRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Market Intelligence ── */}
      <div className="px-6 pb-6">
        <div className="rounded-xl border border-white/6 bg-white/2 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span className="text-[11px] font-mono uppercase tracking-widest">AU Market Intelligence</span>
              <span className="text-[10px] font-mono text-[#4b5563] border border-white/8 px-1.5 py-0.5 rounded">Updated 3h ago</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Mosman", "Toorak", "Bondi", "South Yarra", "Brighton"].map(m => (
                <span key={m} className="px-2 py-0.5 bg-[#f59e0b]/8 text-[#f59e0b] border border-[#f59e0b]/15 rounded-full text-[10px] font-mono">{m}</span>
              ))}
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm font-semibold mb-4 text-white/80">Sydney and Melbourne luxury property demand at 18-month high, driven by offshore buyer return</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Median Price", val: "$1.24M", trend: "up", sub: "▲ 4.2% YoY" },
                { label: "Days on Market", val: "21d", trend: "down", sub: "▼ 8d faster" },
                { label: "Clearance Rate", val: "74%", trend: "up", sub: "▲ 6% this qtr" },
                { label: "New Listings", val: "+12%", trend: "up", sub: "▲ strong supply" },
              ].map(({ label, val, trend, sub }) => (
                <div key={label} className="bg-[#05050d] border border-white/6 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wide">{label}</p>
                    {trend === "up"
                      ? <TrendingUp className="w-3 h-3 text-emerald-400" />
                      : <TrendingDown className="w-3 h-3 text-rose-400" />}
                  </div>
                  <p className="text-2xl font-black font-mono">{val}</p>
                  <p className={`text-[10px] font-mono mt-0.5 ${trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function Globe({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircle2({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
