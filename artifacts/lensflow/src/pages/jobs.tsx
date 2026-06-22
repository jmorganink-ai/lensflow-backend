import { useListJobs, getListJobsQueryKey, JobStatus } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, ArrowRight, Film } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { JobStatusBadge } from "@/pages/dashboard";
import type { Job } from "@workspace/api-client-react";

const STATUS_FILL: Record<string, number> = {
  [JobStatus.queued]: 1,
  [JobStatus.processing]: 3,
  [JobStatus.complete]: 5,
  [JobStatus.failed]: 0,
};

function StepProgress({ job }: { job: Job }) {
  const filled = STATUS_FILL[job.status] ?? 0;
  const isFailed = job.status === JobStatus.failed;
  const isRunning = job.status === JobStatus.processing;
  return (
    <div className="flex items-center gap-1 shrink-0" title={`Pipeline: ${job.status}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={[
            "h-1.5 w-4 rounded-full transition-colors",
            isFailed
              ? "bg-destructive/50"
              : i < filled
              ? "bg-primary"
              : isRunning && i === filled
              ? "bg-primary/40 animate-pulse"
              : "bg-muted",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

export default function JobsList() {
  const { data: jobs = [], isLoading } = useListJobs({
    query: { queryKey: getListJobsQueryKey() },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">My Videos</h1>
          <p className="text-muted-foreground">All your listing videos in one place.</p>
        </div>
        <Link
          href="/jobs/new"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-mono font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Video
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="border border-border rounded-lg bg-card py-20 flex flex-col items-center justify-center text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Film className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1.5">
            <p className="font-semibold text-foreground">No videos yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Paste a listing URL and LensFlow writes the script, records the voiceover, and renders a presenter video automatically.
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
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {jobs.length} video{jobs.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-border">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex flex-col gap-1 overflow-hidden pr-4 flex-1">
                  <div className="font-medium truncate">
                    {job.listingTitle || <span className="text-muted-foreground font-mono text-sm">{job.listingUrl}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono flex items-center gap-2 flex-wrap">
                    {job.listingTitle && (
                      <>
                        <span className="truncate max-w-xs">{job.listingUrl}</span>
                        <span>·</span>
                      </>
                    )}
                    <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                    {job.voiceName && (
                      <>
                        <span>·</span>
                        <span className="text-primary/70">{job.voiceName}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <StepProgress job={job} />
                  <JobStatusBadge status={job.status} />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
