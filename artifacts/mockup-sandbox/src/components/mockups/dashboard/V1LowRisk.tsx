import { ArrowRight, CheckCircle2, FileText, Clock, XCircle, Play, Sparkles, Link2, ImageIcon, Video, Mic, Users, DollarSign, BarChart2, Star, TrendingUp, RefreshCw, MapPin } from "lucide-react";

export function V1LowRisk() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 space-y-6 font-sans">

      {/* Hero */}
      <div className="relative rounded-xl border border-[#f59e0b]/20 bg-gradient-to-br from-[#111118] to-[#0a0a0f] p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.06),transparent_60%)]" />
        <div className="relative">
          <p className="text-xs text-[#6b7280] font-mono mb-2">Good morning, John.</p>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Create Luxury Property Campaigns{" "}
            <span className="text-[#f59e0b]">in Minutes</span>
          </h1>
          <p className="text-[#9ca3af] text-sm leading-relaxed max-w-xl mb-4">
            Turn listings, photos and videos into AI-powered marketing campaigns, presenter reels, property walkthroughs and social media content.
          </p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f59e0b] text-black rounded-lg text-sm font-semibold hover:bg-[#f59e0b]/90 shadow-lg shadow-[#f59e0b]/20">
            <Sparkles className="w-4 h-4" />
            Generate Property Campaign
          </button>
        </div>
        {/* Quick launch */}
        <div className="relative grid grid-cols-4 gap-3 mt-5">
          {[
            { icon: Link2, label: "Property URL", desc: "Paste listing link" },
            { icon: ImageIcon, label: "Upload Photos", desc: "Photo walkthrough" },
            { icon: Video, label: "Upload Video", desc: "Your footage" },
            { icon: Mic, label: "Teleprompter", desc: "Self-record" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col gap-1.5 p-3 rounded-lg border border-[#1f1f2e] bg-[#111118] hover:border-[#f59e0b]/30 cursor-pointer transition-all group">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#f59e0b]/10 flex items-center justify-center group-hover:bg-[#f59e0b]/20">
                  <Icon className="w-3.5 h-3.5 text-[#f59e0b]" />
                </div>
                <span className="text-xs font-semibold">{label}</span>
              </div>
              <span className="text-[11px] text-[#6b7280] font-mono">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: "Campaigns Created", value: "12", icon: CheckCircle2, color: "text-[#f59e0b]" },
          { title: "Properties Processed", value: "38", icon: FileText, color: "text-blue-400" },
          { title: "Marketing Hours Saved", value: "48h", icon: Clock, color: "text-emerald-400" },
          { title: "Failed", value: "2", icon: XCircle, color: "text-red-400" },
        ].map(({ title, value, icon: Icon, color }) => (
          <div key={title} className="bg-[#111118] border border-[#1f1f2e] p-4 rounded-lg relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#6b7280] mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs font-mono uppercase tracking-wider">{title}</span>
            </div>
            <div className="text-3xl font-bold font-mono">{value}</div>
          </div>
        ))}
      </div>

      {/* Presenter Studio */}
      <div className="border border-[#1f1f2e] rounded-lg bg-[#111118] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f2e]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#f59e0b]" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">AI Presenter Studio</span>
            <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 rounded">Ready</span>
          </div>
        </div>
        <div className="p-4 grid grid-cols-4 gap-3">
          {[
            { name: "Mia", spec: "Luxury listings", color: "from-rose-500/20 to-rose-500/5", accent: "text-rose-400", border: "border-rose-500/20" },
            { name: "Oliver", spec: "Corporate premium", color: "from-blue-500/20 to-blue-500/5", accent: "text-blue-400", border: "border-blue-500/20" },
            { name: "Liam", spec: "Confident sales", color: "from-amber-500/20 to-amber-500/5", accent: "text-amber-400", border: "border-amber-500/20" },
            { name: "Sophie", spec: "Lifestyle reels", color: "from-emerald-500/20 to-emerald-500/5", accent: "text-emerald-400", border: "border-emerald-500/20" },
          ].map(p => (
            <div key={p.name} className={`rounded-lg border ${p.border} bg-gradient-to-br ${p.color} p-4 flex flex-col items-center gap-2 text-center`}>
              <div className={`w-12 h-12 rounded-full border ${p.border} bg-black/40 flex items-center justify-center text-lg font-bold ${p.accent}`}>
                {p.name[0]}
              </div>
              <div>
                <p className="font-semibold text-sm">{p.name}</p>
                <p className={`text-[11px] font-mono ${p.accent}`}>{p.spec}</p>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className={`w-2.5 h-2.5 fill-current ${p.accent}`} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="border border-[#1f1f2e] rounded-lg bg-[#111118] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f2e]">
          <h2 className="text-sm font-semibold">Recent Campaigns</h2>
          <span className="text-xs text-[#f59e0b] font-mono cursor-pointer">View all →</span>
        </div>
        {[
          { title: "14 Harbour View Dr, Mosman NSW", status: "complete", time: "2h ago" },
          { title: "8/32 St Kilda Rd, Melbourne VIC", status: "processing", time: "5h ago" },
          { title: "3 Bondi Beach Rd, Sydney NSW", status: "queued", time: "Yesterday" },
        ].map((j, i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b border-[#1a1a25] hover:bg-[#0f0f1a] cursor-pointer">
            <div>
              <p className="text-sm font-medium">{j.title}</p>
              <p className="text-xs text-[#6b7280] font-mono mt-0.5">{j.time}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border uppercase tracking-wider ${
                j.status === "complete" ? "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20" :
                j.status === "processing" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              }`}>{j.status}</span>
              <ArrowRight className="w-4 h-4 text-[#4b5563]" />
            </div>
          </div>
        ))}
      </div>

      {/* Marketing Value */}
      <div className="border border-[#1f1f2e] rounded-lg bg-[#111118] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f2e]">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#f59e0b]" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Marketing Value Generated</span>
          </div>
          <span className="text-[10px] font-mono text-[#6b7280] border border-[#1f1f2e] px-1.5 py-0.5 rounded">12 campaigns</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-3 mb-3">
            {[
              { label: "Script Creation", val: "$600" },
              { label: "Voiceover", val: "$900" },
              { label: "Video Production", val: "$3,000" },
              { label: "Social Package", val: "$1,800" },
            ].map(({ label, val }) => (
              <div key={label} className="bg-[#0a0a0f] border border-[#1f1f2e] rounded-lg p-3">
                <p className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wide mb-1">{label}</p>
                <p className="text-xl font-bold font-mono">{val}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20">
            <span className="text-sm font-mono font-semibold text-[#f59e0b] uppercase tracking-wider">Estimated Value Today</span>
            <span className="text-2xl font-bold font-mono text-[#f59e0b]">$6,300</span>
          </div>
        </div>
      </div>

    </div>
  );
}
