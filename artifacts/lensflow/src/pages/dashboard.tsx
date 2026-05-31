import React, { useState } from "react";
import { useGetJobStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { FileText, CheckCircle2, XCircle, ArrowRight, Play, ChevronDown, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import buildKitImage from "@assets/LensFlow-The-Build-Kit-every-tool-you-need_1780215479239.png";
import { useAuth } from "@workspace/replit-auth-web";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { data: stats, isLoading } = useGetJobStats();
  const { user } = useAuth();
  const firstName = user?.firstName ?? user?.email?.split("@")[0] ?? null;

  if (isLoading) {
    return <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded"></div>)}
      </div>
      <div className="h-64 bg-muted rounded mt-8"></div>
    </div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {firstName ? `${getGreeting()}, ${firstName}.` : "Pipeline Overview"}
        </h1>
        <p className="text-muted-foreground">
          {stats?.total === 0
            ? "No videos yet — paste your first listing URL to get started."
            : `${stats?.complete ?? 0} video${(stats?.complete ?? 0) !== 1 ? "s" : ""} completed · ${stats?.processing ?? 0} running · ${stats?.queued ?? 0} queued.`}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Videos Completed" value={stats?.complete ?? 0} icon={CheckCircle2} color="text-primary" />
        <StatCard title="Scripts Generated" value={stats?.scriptsGenerated ?? 0} icon={FileText} color="text-blue-400" />
        <StatCard
          title="Hours Saved"
          value={stats?.timeSavedHours ?? 0}
          icon={Clock}
          color="text-emerald-400"
          suffix="h"
          tooltip="Estimated vs. manual filming & editing (~4 hrs/video)"
        />
        <StatCard title="Failed" value={stats?.failed ?? 0} icon={XCircle} color="text-destructive" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Jobs</h2>
          <div className="flex items-center gap-4">
            <Link href="/jobs" className="text-xs text-muted-foreground font-mono hover:text-primary transition-colors">
              View all
            </Link>
            <Link href="/jobs/new" className="text-sm text-primary hover:underline font-mono flex items-center gap-1">
              Start New <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="border border-border rounded-lg bg-card overflow-hidden">
          {stats?.recentJobs?.length === 0 ? (
            <div className="py-14 px-8 flex flex-col items-center justify-center text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Play className="w-6 h-6 text-primary ml-0.5" />
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-foreground">No videos yet</p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Paste a property listing URL and LensFlow will automatically write the script, record the voiceover, and render a presenter video.
                </p>
              </div>
              <Link
                href="/jobs/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded text-sm font-mono font-medium hover:bg-primary/90 transition-colors"
              >
                Generate Your First Video <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {stats?.recentJobs?.map((job) => (
                <Link 
                  key={job.id} 
                  href={`/jobs/${job.id}`}
                  className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex flex-col gap-1 overflow-hidden pr-4">
                    <div className="font-medium truncate">{job.listingTitle || job.listingUrl}</div>
                    <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                      <span>ID: {job.id.slice(0, 8)}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <JobStatusBadge status={job.status} />
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <RoadmapCard />
    </div>
  );
}

function RoadmapCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-mono font-medium uppercase tracking-wider">Production Roadmap</span>
          <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded">URL → VIDEO ENGINE</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-border">
          <img
            src={buildKitImage}
            alt="LensFlow full pipeline architecture — vendor map from URL scrape to MP4 delivery"
            className="w-full"
          />
          <div className="p-4 flex items-center gap-2 text-xs text-muted-foreground font-mono border-t border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Build window 4–8 weeks · ~$2.54 cost/video · $3.95/vid margin at 20 vids/mo
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, suffix, tooltip }: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  suffix?: string;
  tooltip?: string;
}) {
  return (
    <div className="bg-card border border-border p-4 rounded-lg flex flex-col gap-2 relative overflow-hidden group" title={tooltip}>
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
        <Icon className={`w-24 h-24 ${color}`} />
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs font-mono uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-3xl font-bold font-mono">
        {value}{suffix && <span className="text-xl ml-0.5 text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

export function JobStatusBadge({ status }: { status: string }) {
  const colors = {
    queued: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    complete: "bg-primary/10 text-primary border-primary/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20"
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-mono border ${colors[status as keyof typeof colors] || colors.queued}`}>
      {status}
    </span>
  );
}
