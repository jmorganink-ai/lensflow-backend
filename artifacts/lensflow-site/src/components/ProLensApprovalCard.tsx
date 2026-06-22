import { useState } from "react";
import type { JobDetail } from "@workspace/api-client-react";

interface ProLensApprovalCardProps {
  job: JobDetail;
  onDecision?: () => Promise<void> | void;
}

export function ProLensApprovalCard({ job, onDecision }: ProLensApprovalCardProps) {
  const [submitting, setSubmitting] = useState<"approve" | "reject" | null>(null);

  const beforeImages = job.propertyImages ?? [];
  const afterImages = job.proLensImages ?? [];

  if (!beforeImages.length || !afterImages.length) return null;
  if (!(job.status === "awaiting_approval" || job.proLensApproved == null)) return null;

  async function submitDecision(decision: "approve" | "reject") {
    if (submitting) return;
    setSubmitting(decision);
    try {
      await fetch(`/api/jobs/${job.id}/${decision === "approve" ? "approve-upgrade" : "reject-upgrade"}`, {
        method: "POST",
        credentials: "include",
      });
      await onDecision?.();
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="rounded-2xl border border-[#d4a017]/35 bg-card/80 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#f3c75f]">Pro Lens review</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare the original photos with the corrected Pro Lens versions before the render continues.
          </p>
        </div>
        <div className="rounded-full border border-[#d4a017]/40 bg-[#d4a017]/10 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#f3c75f]">
          Awaiting approval
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {beforeImages.map((beforeUrl, index) => {
          const afterUrl = afterImages[index];
          if (!afterUrl) return null;
          return (
            <div key={`${beforeUrl}-${afterUrl}-${index}`} className="grid gap-3 rounded-xl border border-white/10 p-3 md:grid-cols-2">
              <div>
                <div className="mb-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Before</div>
                <img src={beforeUrl} alt={`Original property photo ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" />
              </div>
              <div>
                <div className="mb-2 text-[11px] font-mono uppercase tracking-wider text-[#f3c75f]">After</div>
                <img src={afterUrl} alt={`Pro Lens upgraded property photo ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => submitDecision("reject")}
          disabled={submitting !== null}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-white/10 bg-background px-4 text-sm font-semibold text-foreground transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting === "reject" ? "Rejecting..." : "Reject upgrade"}
        </button>
        <button
          type="button"
          onClick={() => submitDecision("approve")}
          disabled={submitting !== null}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[#d4a017] px-4 text-sm font-semibold text-[#1f1400] transition hover:bg-[#e0b13a] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting === "approve" ? "Approving..." : "Approve Pro Lens"}
        </button>
      </div>
    </div>
  );
}