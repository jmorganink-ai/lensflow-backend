import { useParams, useLocation } from "wouter";
import { useGetJob, useDeleteJob, useSimulateJob, useSendJobToCrm, getGetJobQueryKey, getGetJobStatsQueryKey, getListJobsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { ArrowLeft, Trash2, ExternalLink, CheckCircle2, Loader2, Circle, XCircle, Play, RotateCcw, Volume2, Mic, Copy, Check, Download, Plus, Share2, Video, Camera, Send } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JobStatusBadge } from "@/pages/dashboard";

const STEP_LABELS: Record<string, string> = {
  enhance_photos: "AI Photo Glow-up",
  analyse_photos: "Analyse Photos",
  scrape_listing: "Scrape Listing",
  generate_script: "Generate Script",
  create_voiceover: "Create Voiceover",
  presenter_video: "Presenter Video",
  compose_video: "Compose Video",
};

const STEP_DESCRIPTIONS: Record<string, string> = {
  enhance_photos: "AI relights, colour-balances, declutters and sky-replaces your photos for a premium magazine-listing look.",
  analyse_photos: "Claude Vision analyses your uploaded photos to identify the property type, features, and selling points.",
  scrape_listing: "Extract property data and metadata from the listing URL.",
  generate_script: "Generate a compelling AI-written presenter script from listing data.",
  create_voiceover: "Synthesize professional voiceover audio from the script.",
  presenter_video: "Render a photoreal AI presenter avatar delivering the voiceover.",
  compose_video: "Composite all elements into a single shareable 4K video file.",
};


function StepIcon({ status }: { status: string }) {
  if (status === "complete") return <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />;
  if (status === "running") return <Loader2 className="w-5 h-5 text-blue-400 shrink-0 animate-spin" />;
  if (status === "failed") return <XCircle className="w-5 h-5 text-destructive shrink-0" />;
  return <Circle className="w-5 h-5 text-muted-foreground/30 shrink-0" />;
}

function useCopyToClipboard(timeout = 1500) {
  const [copied, setCopied] = useState(false);
  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    });
  }
  return { copied, copy };
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const deleteJob = useDeleteJob();
  const simulateJob = useSimulateJob();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { data: job, isLoading, isError } = useGetJob(id!, {
    query: {
      enabled: !!id,
      queryKey: getGetJobQueryKey(id!),
      refetchInterval: (query) => {
        const status = (query.state.data as any)?.status;
        return (status === "queued" || status === "processing") ? 1500 : false;
      },
    },
  });

  const isSimulating = job?.status === "processing" || job?.status === "queued";
  const canSimulate = !!id && job?.status !== "processing" && job?.status !== "queued";

  function handleSimulate() {
    if (!id) return;
    simulateJob.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetJobQueryKey(id) });
        toast({
          title: "Pipeline Started",
          description: "All 5 stages are now running.",
        });
      },
      onError: () => {
        toast({
          title: "Could not start pipeline",
          description: "The job may already be processing. Refresh the page.",
          variant: "destructive",
        });
      },
    });
  }

  function handleDelete() {
    if (!id) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 4000);
      return;
    }
    setConfirmingDelete(false);
    deleteJob.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetJobStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
        toast({ title: "Job Deleted", description: "The pipeline job has been removed." });
        setLocation("/");
      },
      onError: () => {
        toast({ title: "Delete Failed", description: "Could not delete the job.", variant: "destructive" });
      },
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-10 w-2/3 bg-muted rounded" />
        <div className="h-4 w-1/3 bg-muted rounded" />
        <div className="h-64 bg-muted rounded mt-6" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
        <XCircle className="w-12 h-12 text-destructive opacity-50" />
        <h2 className="text-xl font-semibold">Job Not Found</h2>
        <p className="text-muted-foreground text-sm">This job may have been deleted or the ID is invalid.</p>
        <Link href="/" className="text-primary text-sm hover:underline font-mono">Back to Dashboard</Link>
      </div>
    );
  }

  const completedSteps = job.steps?.filter(s => s.status === "complete").length ?? 0;
  const totalSteps = job.steps?.length ?? 5;
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-mono mb-4 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight truncate max-w-xl">
              {job.listingTitle || job.propertyAddress || job.listingUrl || "Property Video"}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              {job.listingUrl ? (
                <a
                  href={job.listingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground font-mono hover:text-primary transition-colors flex items-center gap-1 truncate max-w-xs"
                  data-testid="link-listing-url"
                >
                  {job.listingUrl}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                  <Camera className="w-3 h-3 shrink-0" />
                  {job.propertyAddress || "From property photos"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <JobStatusBadge status={job.status} />
              <span className="text-xs text-muted-foreground font-mono" data-testid="text-created-at">
                Started {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <ShareButton jobId={job.id} />
            <Button
              size="sm"
              onClick={handleSimulate}
              disabled={!canSimulate || simulateJob.isPending}
              className="font-mono text-xs uppercase tracking-wider relative overflow-hidden group"
              data-testid="button-simulate-pipeline"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Running...
                </>
              ) : job.status === "complete" || job.status === "failed" ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Re-run Pipeline
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Run Pipeline
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleteJob.isPending}
              className="text-destructive hover:text-destructive hover:border-destructive/50 font-mono text-xs"
              data-testid="button-delete-job"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Pipeline Progress</span>
          <span className="text-xs font-mono text-primary">{completedSteps}/{totalSteps} stages</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
            data-testid="progress-bar"
          />
        </div>
        {isSimulating && (
          <p className="text-[11px] font-mono text-muted-foreground animate-pulse">
            Pipeline running — page auto-refreshes every 1.5s
          </p>
        )}
      </div>

      {/* Pipeline Steps */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Pipeline Stages</span>
          {isSimulating && (
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="divide-y divide-border">
          {(job.steps ?? []).map((step, idx) => {
            const isLast = idx === (job.steps?.length ?? 0) - 1;
            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-5 transition-colors duration-300 ${step.status === "running" ? "bg-blue-500/5" : ""}`}
                data-testid={`step-${step.name}`}
              >
                {/* Connector + icon */}
                <div className="flex flex-col items-center shrink-0 pt-0.5">
                  <StepIcon status={step.status} />
                  {!isLast && (
                    <div className={`w-px flex-1 mt-2 min-h-[28px] transition-colors duration-700 ${step.status === "complete" ? "bg-primary/40" : "bg-border"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground/50">0{step.order}</span>
                      <span className={`font-medium text-sm transition-colors duration-300 ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
                        {STEP_LABELS[step.name] ?? step.label}
                      </span>
                    </div>
                    {step.status !== "pending" && (
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all duration-300 ${
                        step.status === "complete" ? "text-primary bg-primary/10 border-primary/20" :
                        step.status === "running" ? "text-blue-400 bg-blue-400/10 border-blue-400/20 animate-pulse" :
                        "text-destructive bg-destructive/10 border-destructive/20"
                      }`}>
                        {step.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {STEP_DESCRIPTIONS[step.name]}
                    </p>
                  </div>
                  {step.errorMessage && (
                    <p className="text-xs text-destructive mt-2 font-mono bg-destructive/5 p-2 rounded border border-destructive/20">
                      {step.errorMessage}
                    </p>
                  )}
                  {step.name === "analyse_photos" && step.outputData && step.status === "complete" && (
                    <div className="mt-3 p-3 bg-card border border-border rounded-lg space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                        <Camera className="w-3 h-3" /> Vision Analysis
                      </div>
                      {step.outputData.split("\n").filter(Boolean).map((line, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="text-primary mt-0.5">▸</span>
                          <span className="text-foreground/80">{line}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {step.name === "scrape_listing" && step.outputData && step.status === "complete" && (
                    <div className="mt-3 p-3 bg-card border border-border rounded-lg space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Extracted Metadata</div>
                      {step.outputData.split("\n").filter(Boolean).map((line, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="text-primary mt-0.5">▸</span>
                          <span className="text-foreground/80">{line}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {step.name === "generate_script" && step.outputData && step.status === "complete" && (
                    <ScriptPanel script={step.outputData} jobTitle={job.listingTitle ?? undefined} jobId={id!} />
                  )}
                  {step.name === "create_voiceover" && step.outputUrl && step.status === "complete" && (
                    <div className="mt-3 p-3 bg-primary/5 border border-primary/15 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-primary uppercase tracking-wider">
                        <Volume2 className="w-3.5 h-3.5" /> ElevenLabs Voiceover
                      </div>
                      <audio controls src={step.outputUrl} className="w-full h-8" style={{ height: "32px" }} />
                    </div>
                  )}
                  {step.name === "presenter_video" && step.outputUrl && step.status === "complete" && (
                    <div className="mt-3 p-3 bg-primary/5 border border-primary/15 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-primary uppercase tracking-wider">
                        <Play className="w-3.5 h-3.5" /> HeyGen Presenter Video
                      </div>
                      <video controls src={step.outputUrl} className="w-full rounded" style={{ maxHeight: "320px" }} />
                    </div>
                  )}
                  {step.name === "compose_video" && step.outputUrl && step.status === "complete" && (
                    <div className="mt-3 p-3 bg-primary/5 border border-primary/15 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-primary uppercase tracking-wider">
                        <Play className="w-3.5 h-3.5" /> Final Video — Ready to Publish
                      </div>
                      <video controls src={step.outputUrl} className="w-full rounded" style={{ maxHeight: "360px" }} />
                      <a
                        href={step.outputUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-primary hover:underline"
                      >
                        <Download className="w-3 h-3" /> Download MP4
                      </a>
                    </div>
                  )}
                  {(step.startedAt || step.completedAt) && (
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-muted-foreground/60">
                      {step.startedAt && <span>Started: {format(new Date(step.startedAt), "HH:mm:ss")}</span>}
                      {step.completedAt && <span>Done: {format(new Date(step.completedAt), "HH:mm:ss")}</span>}
                      {step.startedAt && step.completedAt && (
                        <span className="text-primary/60">
                          {((new Date(step.completedAt).getTime() - new Date(step.startedAt).getTime()) / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Photo Glow-up: before / after */}
      {job.inputMode === "photos" && (job.propertyImages?.length ?? 0) > 0 && (
        <PhotoGlowUp
          originals={job.propertyImages ?? []}
          enhanced={job.enhancedImages ?? []}
        />
      )}

      {/* Video Output */}
      {job.status === "complete" && job.videoUrl && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Output Video</span>
          <a
            href={job.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-mono font-medium hover:bg-primary/90 transition-colors"
            data-testid="link-video-output"
          >
            <Play className="w-4 h-4" /> View Video
          </a>
        </div>
      )}

      {/* Completion Banner */}
      {job.status === "complete" && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 space-y-4">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">Pipeline Complete</p>
              <p className="text-xs text-muted-foreground mt-0.5">Script generated, voiceover synthesised, and video composition finished. Ready to share.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-primary/10 pt-4">
            {job.videoUrl && (
              <NativeShareButton videoUrl={job.videoUrl} title={job.listingTitle || job.propertyAddress || "LensFlow video"} />
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/jobs/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-xs font-mono font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> New Listing
              </Link>
              <SendToCrmButton jobId={job.id} />
              <button
                type="button"
                onClick={() => simulateJob.mutate({ id: job.id })}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded text-xs font-mono hover:border-primary/40 hover:text-primary transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Re-run Pipeline
              </button>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground text-xs font-mono hover:text-primary transition-colors"
              >
                View All Videos <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <MetaCard label="Job ID" value={job.id.slice(0, 8) + "..."} />
        <MetaCard label="Created" value={format(new Date(job.createdAt), "MMM d, yyyy")} />
        <MetaCard label="Last Updated" value={formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true })} />
      </div>
    </div>
  );
}

function ScriptPanel({ script, jobTitle, jobId }: { script: string; jobTitle?: string; jobId: string }) {
  const { copied, copy } = useCopyToClipboard();

  function downloadScript() {
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(jobTitle ?? "listing-script").replace(/[^a-z0-9-_ ]/gi, "").toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-3 p-3 bg-primary/5 border border-primary/15 rounded-lg space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[11px] font-mono text-primary uppercase tracking-wider">
          <Mic className="w-3.5 h-3.5" /> AI-Generated Script
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href={`/jobs/${jobId}/record`}>
            <button
              type="button"
              className="flex items-center gap-1.5 text-[10px] font-mono text-primary hover:text-primary/80 transition-colors border border-primary/40 hover:border-primary px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20"
              title="Open teleprompter recorder"
            >
              <Video className="w-3 h-3" /> Record Yourself
            </button>
          </Link>
          <button
            type="button"
            onClick={downloadScript}
            className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors border border-border/50 hover:border-primary/40 px-2 py-0.5 rounded"
            title="Download script as .txt"
          >
            <Download className="w-3 h-3" /> .txt
          </button>
          <button
            type="button"
            onClick={() => copy(script)}
            className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors border border-border/50 hover:border-primary/40 px-2 py-0.5 rounded"
          >
            {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans italic">
        {script}
      </p>
    </div>
  );
}

function ShareButton({ jobId }: { jobId: string }) {
  const { copied, copy } = useCopyToClipboard();
  const shareUrl = `${window.location.origin}/pipeline/jobs/${jobId}`;
  return (
    <button
      type="button"
      onClick={() => copy(shareUrl)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border hover:border-primary/40 hover:text-primary text-muted-foreground rounded text-xs font-mono transition-colors"
      title="Copy link to this job"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Share2 className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}

function NativeShareButton({ videoUrl, title }: { videoUrl: string; title: string }) {
  const { toast } = useToast();
  const { copied, copy } = useCopyToClipboard(2000);

  const caption = `Just listed! ${title} — see this AI-powered property video 🏠✨\n\n#realestate #propertymarketing #lensflow`;

  const platforms = [
    {
      label: "Facebook",
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}&quote=${encodeURIComponent(caption)}`,
    },
    {
      label: "LinkedIn",
      color: "#0A66C2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(videoUrl)}`,
    },
    {
      label: "WhatsApp",
      color: "#25D366",
      href: `https://wa.me/?text=${encodeURIComponent(`${caption}\n\n${videoUrl}`)}`,
    },
    {
      label: "X / Twitter",
      color: "#000",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(videoUrl)}`,
    },
    {
      label: "Instagram",
      color: "#E1306C",
      href: "https://www.instagram.com",
      copyFirst: true,
    },
    {
      label: "TikTok",
      color: "#010101",
      href: "https://www.tiktok.com",
      copyFirst: true,
    },
  ] as const;

  async function openPlatform(p: (typeof platforms)[number]) {
    if ("copyFirst" in p && p.copyFirst) {
      try { await navigator.clipboard.writeText(videoUrl); } catch { /* ok */ }
      toast({ title: `Link copied!`, description: `Paste your video link when you open ${p.label}.` });
    }
    window.open(p.href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Share to</p>
      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => openPlatform(p)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: p.color }}
          >
            {"copyFirst" in p && p.copyFirst && <Copy className="w-3 h-3 opacity-70" />}
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => copy(videoUrl)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-xs font-mono hover:border-primary/40 hover:text-primary text-muted-foreground transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}

function SendToCrmButton({ jobId }: { jobId: string }) {
  const { toast } = useToast();
  const sendToCrm = useSendJobToCrm();
  const [sent, setSent] = useState(false);

  function handleSend() {
    sendToCrm.mutate(
      { id: jobId, data: {} },
      {
        onSuccess: (result) => {
          setSent(true);
          toast({ title: "Sent to HubSpot", description: result.message });
        },
        onError: () => {
          toast({
            title: "CRM Delivery Failed",
            description: "Could not reach HubSpot. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <button
      type="button"
      onClick={handleSend}
      disabled={sendToCrm.isPending || sent}
      className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded text-xs font-mono hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-60"
    >
      {sendToCrm.isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : sent ? (
        <Check className="w-3.5 h-3.5 text-primary" />
      ) : (
        <Send className="w-3.5 h-3.5" />
      )}
      {sent ? "Sent to CRM" : "Send to HubSpot"}
    </button>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-mono text-foreground truncate">{value}</div>
    </div>
  );
}

function PhotoGlowUp({ originals, enhanced }: { originals: string[]; enhanced: string[] }) {
  const hasEnhanced = enhanced.length > 0;
  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Camera className="w-4 h-4 text-primary" />
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          AI Photo Glow-up
        </span>
        {hasEnhanced && (
          <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
            {enhanced.length} enhanced
          </span>
        )}
      </div>
      {!hasEnhanced && (
        <p className="text-xs text-muted-foreground">
          Enhancing your photos… the AI-improved versions will appear here once the glow-up step completes.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {originals.map((orig, i) => {
          const after = enhanced[i];
          return (
            <div key={i} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <figure className="space-y-1">
                  <img
                    src={orig}
                    alt={`Original photo ${i + 1}`}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover rounded border border-border"
                  />
                  <figcaption className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/70 text-center">
                    Before
                  </figcaption>
                </figure>
                <figure className="space-y-1">
                  {after ? (
                    <img
                      src={after}
                      alt={`Enhanced photo ${i + 1}`}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover rounded border border-primary/30 ring-1 ring-primary/20"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] rounded border border-dashed border-border flex items-center justify-center bg-muted/30">
                      <Loader2 className="w-4 h-4 text-muted-foreground/50 animate-spin" />
                    </div>
                  )}
                  <figcaption className="text-[9px] font-mono uppercase tracking-wider text-primary text-center">
                    After
                  </figcaption>
                </figure>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
