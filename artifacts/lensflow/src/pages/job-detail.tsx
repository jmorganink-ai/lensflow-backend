import { useParams, useLocation } from "wouter";
import { useGetJob, useDeleteJob, useSimulateJob, getGetJobQueryKey, getGetJobStatsQueryKey, getListJobsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2, ExternalLink, CheckCircle2, Loader2, Circle, XCircle, Play, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JobStatusBadge } from "@/pages/dashboard";

const STEP_LABELS: Record<string, string> = {
  scrape_listing: "Scrape Listing",
  generate_script: "Generate Script",
  create_voiceover: "Create Voiceover",
  presenter_video: "Presenter Video",
  compose_video: "Compose Video",
};

const STEP_DESCRIPTIONS: Record<string, string> = {
  scrape_listing: "Extract property data, images, and metadata from the listing URL.",
  generate_script: "Generate a compelling AI-written video script from listing data.",
  create_voiceover: "Synthesize professional voiceover audio from the script.",
  presenter_video: "Render a presenter avatar delivering the voiceover.",
  compose_video: "Combine all elements into the final video output.",
};

function StepIcon({ status }: { status: string }) {
  if (status === "complete") return <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />;
  if (status === "running") return <Loader2 className="w-5 h-5 text-blue-400 shrink-0 animate-spin" />;
  if (status === "failed") return <XCircle className="w-5 h-5 text-destructive shrink-0" />;
  return <Circle className="w-5 h-5 text-muted-foreground/30 shrink-0" />;
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const deleteJob = useDeleteJob();
  const simulateJob = useSimulateJob();

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
  const canSimulate = !!id && job?.status !== "processing";

  function handleSimulate() {
    if (!id) return;
    simulateJob.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetJobQueryKey(id) });
        toast({
          title: "Simulation Started",
          description: "Pipeline is now running through all 5 stages.",
        });
      },
      onError: () => {
        toast({
          title: "Could not start simulation",
          description: "The job may already be processing.",
          variant: "destructive",
        });
      },
    });
  }

  function handleDelete() {
    if (!id) return;
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
              {job.listingTitle || job.listingUrl}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
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
            </div>
            <div className="flex items-center gap-3 pt-1">
              <JobStatusBadge status={job.status} />
              <span className="text-xs text-muted-foreground font-mono" data-testid="text-created-at">
                Started {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
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
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {STEP_DESCRIPTIONS[step.name]}
                  </p>
                  {step.errorMessage && (
                    <p className="text-xs text-destructive mt-2 font-mono bg-destructive/5 p-2 rounded border border-destructive/20">
                      {step.errorMessage}
                    </p>
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
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 flex items-center gap-4">
          <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary">Pipeline Complete</p>
            <p className="text-xs text-muted-foreground mt-0.5">All 5 stages finished successfully. You can re-run the simulation at any time.</p>
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

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-mono text-foreground truncate">{value}</div>
    </div>
  );
}
