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
  create_voiceover: "Generate Voiceover",
  presenter_video: "Generate Presenter",
  compose_video: "Final Video Render",
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
              className={`font-mono text-xs transition-all ${confirmingDelete ? "bg-destructive text-white border-destructive hover:bg-destructive/90 hover:border-destructive" : "text-destructive hover:text-destructive hover:border-destructive/50"}`}
              data-testid="button-delete-job"
            >
              {deleteJob.isPending ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              )}
              {confirmingDelete ? "Confirm Delete?" : "Delete"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── VIDEO HERO — shown at the top when the job is complete ── */}
      {job.status === "complete" && job.videoUrl && (
        <div className="bg-card border border-primary/30 rounded-xl overflow-hidden shadow-lg shadow-primary/5">
          <video
            controls
            src={job.videoUrl}
            className="w-full"
            style={{ maxHeight: "480px", background: "#000" }}
            data-testid="hero-video-player"
          />
          <div className="p-4 flex items-center justify-between gap-3 flex-wrap border-t border-border">
            <span className="text-sm font-semibold text-foreground truncate flex-1">
              {job.listingTitle || job.propertyAddress || "Your listing video"}
            </span>
            <DownloadVideoButton url={job.videoUrl} large />
          </div>
        </div>
      )}

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
                      <DownloadVideoButton url={step.outputUrl} />
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

      {/* Completion Banner — action buttons only */}
      {job.status === "complete" && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 space-y-4">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">Pipeline Complete</p>
              <p className="text-xs text-muted-foreground mt-0.5">Script generated, voiceover synthesised, and video composition finished. Ready to share.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap border-t border-primary/10 pt-4">
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
      )}

      {/* ── SOCIAL SHARING — bottom of page, prominent ── */}
      {job.status === "complete" && job.videoUrl && (
        <NativeShareButton videoUrl={job.videoUrl} title={job.listingTitle || job.propertyAddress || "LensFlow video"} />
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

function DownloadVideoButton({ url, large }: { url: string; large?: boolean }) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network error");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = "lensflow-video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      toast({
        title: "Download Failed",
        description: "Could not download the video. Try right-clicking the video player and selecting Save.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  }, [url, downloading, toast]);

  if (large) {
    return (
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-mono font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
      >
        {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {downloading ? "Downloading…" : "Download Video"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
    >
      {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
      {downloading ? "Downloading…" : "Download MP4"}
    </button>
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      title="Copy link to this job (requires login to view)"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Share2 className="w-3.5 h-3.5" />}
      {copied ? "Link Copied" : "Copy Job Link"}
    </button>
  );
}

function NativeShareButton({ videoUrl, title }: { videoUrl: string; title: string }) {
  const { toast } = useToast();
  const { copied, copy } = useCopyToClipboard(2000);

  const caption = `Just listed! ${title} — see this AI-powered property video 🏠✨\n\n#realestate #propertymarketing #lensflow`;

  async function openWithCopy(href: string, platform: string) {
    try { await navigator.clipboard.writeText(videoUrl); } catch { /* ok */ }
    toast({ title: "Link copied!", description: `Paste your video link when ${platform} opens.` });
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Share Your Video</p>
        <p className="text-xs text-muted-foreground mt-0.5">Post it to social media or send directly to your client.</p>
      </div>

      {/* Primary platforms — large buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}&quote=${encodeURIComponent(caption)}`, "_blank", "noopener,noreferrer")}
          className="flex flex-col items-center gap-2 py-4 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-85"
          style={{ background: "#1877F2" }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
          Facebook
        </button>
        <button
          type="button"
          onClick={() => openWithCopy("https://www.tiktok.com/upload", "TikTok")}
          className="flex flex-col items-center gap-2 py-4 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-85"
          style={{ background: "#010101" }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          TikTok
        </button>
        <button
          type="button"
          onClick={() => openWithCopy("https://www.instagram.com", "Instagram")}
          className="flex flex-col items-center gap-2 py-4 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-85"
          style={{ background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          Instagram
        </button>
      </div>

      {/* Secondary: copy link + WhatsApp */}
      <div className="flex gap-2 flex-wrap border-t border-border pt-3">
        <button
          type="button"
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${caption}\n\n${videoUrl}`)}`, "_blank", "noopener,noreferrer")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-white transition-opacity hover:opacity-85"
          style={{ background: "#25D366" }}
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(videoUrl)}`, "_blank", "noopener,noreferrer")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-white transition-opacity hover:opacity-85"
          style={{ background: "#0A66C2" }}
        >
          LinkedIn
        </button>
        <button
          type="button"
          onClick={() => copy(videoUrl)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-xs font-mono hover:border-primary/40 hover:text-primary text-muted-foreground transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy Video Link"}
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
