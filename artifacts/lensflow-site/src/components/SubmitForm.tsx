import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, ImagePlus, Upload, X, Loader2, ArrowRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@workspace/replit-auth-web";
import { useUpload } from "@workspace/object-storage-web";

const PRESENTER_PRESETS = [
  {
    id: "mia",
    name: "Mia",
    specialty: "Waterfront / Lifestyle",
    voiceId: "x3PfG9wL6FOEApZ1VJ9H",
    voiceName: "emma",
    photo: "/presenters/mia-poster.jpg",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/workspace/f7c7da45b9a6460583b70fafd2405651/voices/x3PfG9wL6FOEApZ1VJ9H/92204d06-e00b-4d09-bbfc-3903c47a4c57.mp3",
  },
  {
    id: "oliver",
    name: "Oliver",
    specialty: "Inner-City / Investment",
    voiceId: "yXFr3XVHzrViCIHi1yoc",
    voiceName: "aussie voice",
    photo: "/presenters/oliver-poster.jpg",
    previewUrl: "https://api.us.elevenlabs.io/v1/voices/yXFr3XVHzrViCIHi1yoc/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiJmN2M3ZGE0NWI5YTY0NjA1ODNiNzBmYWZkMjQwNTY1MSIsImZpbGVuYW1lIjoiYzZlNTZjZDctMTIwZC00MjM4LWFhYWUtZWZkNTRhNWI0YzM2Lm1wMyIsInRpbWVzdGFtcCI6MTc4MDIxMDgwMDAwMDAwMH0%3D",
  },
  {
    id: "sophie",
    name: "Sophie",
    specialty: "Family / Suburban",
    voiceId: "69h9o7wh5u0isWHzdogD",
    voiceName: "Australian real estate agent",
    photo: "/presenters/sophie-poster.jpg",
    previewUrl: "https://api.us.elevenlabs.io/v1/voices/69h9o7wh5u0isWHzdogD/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJjdXN0b20iLCJ3b3Jrc3BhY2VfaWQiOiJmN2M3ZGE0NWI5YTY0NjA1ODNiNzBmYWZkMjQwNTY1MSIsImZpbGVuYW1lIjoiYzBlMWJmMjUtZDEwNC00ZjY1LTg1ZTctNjE3ZDU5MjhmMDk5Lm1wMyIsInRpbWVzdGFtcCI6MTc4MDIxMDgwMDAwMDAwMH0%3D",
  },
  {
    id: "james",
    name: "James",
    specialty: "Commercial / Rural",
    voiceId: "J5tYJbZpL62OrQsj70q6",
    voiceName: "morgan voice",
    photo: "/presenters/james-poster.jpg",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3",
  },
];

const PENDING_JOB_KEY = "lensflow_pending_job";

export interface PendingJob {
  listingUrl: string;
  voiceId: string;
  voiceName: string;
  propertyImages: string[];
}

export function savePendingJob(job: PendingJob) {
  sessionStorage.setItem(PENDING_JOB_KEY, JSON.stringify(job));
}

export function loadPendingJob(): PendingJob | null {
  try {
    const raw = sessionStorage.getItem(PENDING_JOB_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingJob() {
  sessionStorage.removeItem(PENDING_JOB_KEY);
}

interface UploadedPhoto {
  publicUrl: string;
  previewSrc: string;
  name: string;
}

export function SubmitForm() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const [listingUrl, setListingUrl] = useState("");
  const [selectedPresenter, setSelectedPresenter] = useState(PRESENTER_PRESETS[0]);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [urlError, setUrlError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const { uploadFile } = useUpload();

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) return;
      setUploadingCount((n) => n + imageFiles.length);
      await Promise.all(
        imageFiles.map(async (file) => {
          const localPreview = URL.createObjectURL(file);
          const result = await uploadFile(file);
          if (result) {
            setUploadedPhotos((prev) => [
              ...prev,
              { publicUrl: result.publicUrl, previewSrc: localPreview, name: file.name },
            ]);
          } else {
            URL.revokeObjectURL(localPreview);
          }
          setUploadingCount((n) => n - 1);
        })
      );
    },
    [uploadFile]
  );

  function toggleVoicePreview(presenter: typeof PRESENTER_PRESETS[0], e: React.MouseEvent) {
    e.stopPropagation();
    const audio = audioRefs.current[presenter.id];
    if (!audio) return;
    if (playingId === presenter.id) {
      audio.pause();
      audio.currentTime = 0;
      setPlayingId(null);
    } else {
      if (playingId) {
        audioRefs.current[playingId]?.pause();
      }
      audio.play().catch(() => {});
      setPlayingId(presenter.id);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUrlError("");

    if (!listingUrl.trim()) {
      setUrlError("Please enter a listing URL");
      return;
    }
    try {
      new URL(listingUrl);
    } catch {
      setUrlError("Please enter a valid URL (e.g. https://realestate.com.au/...)");
      return;
    }

    const pendingJob: PendingJob = {
      listingUrl: listingUrl.trim(),
      voiceId: selectedPresenter.voiceId,
      voiceName: selectedPresenter.voiceName,
      propertyImages: uploadedPhotos.map((p) => p.publicUrl),
    };

    if (isAuthenticated) {
      // Already signed in: create job directly, redirect to pipeline
      setSubmitting(true);
      createJobAndRedirect(pendingJob);
    } else {
      // Save job, trigger auth: pipeline will pick it up after sign-in
      savePendingJob(pendingJob);
      login();
    }
  }

  async function createJobAndRedirect(job: PendingJob) {
    try {
      const createRes = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(job),
      });
      if (!createRes.ok) throw new Error("Failed to create job");
      const created = await createRes.json() as { id: string };

      await fetch(`/api/jobs/${created.id}/simulate`, {
        method: "POST",
        credentials: "include",
      });

      clearPendingJob();
      window.location.href = `/pipeline/jobs/${created.id}`;
    } catch {
      setSubmitting(false);
      setUrlError("Something went wrong. Please try again.");
    }
  }

  const busy = uploadingCount > 0 || submitting || authLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-2">
      {/* Listing URL */}
      <div>
        <div className="relative">
          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="url"
            value={listingUrl}
            onChange={(e) => { setListingUrl(e.target.value); setUrlError(""); }}
            placeholder="Paste listing URL - realestate.com.au, Domain, etc."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-background/60 border border-white/10 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:bg-background transition-all"
          />
        </div>
        {urlError && <p className="mt-1.5 text-xs text-destructive font-mono">{urlError}</p>}
        <button
          type="button"
          onClick={() => setListingUrl("https://www.realestate.com.au/property/4-bed-house-in-mosman-nsw-2088-145832674")}
          className="mt-2 text-[10px] font-mono text-primary/70 hover:text-primary transition-colors"
        >
          Try sample listing
        </button>
      </div>

      {/* Presenter Picker */}
      <div>
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Choose Presenter</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESENTER_PRESETS.map((p) => {
            const isSelected = selectedPresenter.id === p.id;
            const isPlaying = playingId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPresenter(p)}
                className={`relative flex flex-col rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  isSelected ? "border-primary shadow-[0_0_14px_rgba(201,154,46,0.35)]" : "border-white/10 hover:border-white/30"
                }`}
              >
                {/* Photo — 3:4 rectangle */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#1a1430] to-[#0f0f1a]">
                  <img
                    src={p.photo}
                    alt={p.name}
                    className="w-full h-full object-cover object-[center_15%]"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => toggleVoicePreview(p, e)}
                    className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 hover:bg-primary/80 flex items-center justify-center transition-colors"
                    title="Preview voice"
                  >
                    {isPlaying ? <Pause className="w-2.5 h-2.5 text-white" /> : <Play className="w-2.5 h-2.5 text-white ml-px" />}
                  </button>
                </div>
                {/* Footer label — always visible, never clipped */}
                <div className="bg-card px-1.5 py-1.5 min-h-[2.75rem]">
                  <div className="text-[11px] font-semibold text-white leading-none">{p.name}</div>
                  <div className="text-[9px] text-primary font-mono leading-tight mt-0.5 line-clamp-2">{p.specialty}</div>
                </div>
                <audio
                  ref={(el) => { audioRefs.current[p.id] = el; }}
                  src={p.previewUrl}
                  onEnded={() => setPlayingId(null)}
                  preload="none"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <ImagePlus className="w-3 h-3" />
          Property Photos
          <span className="normal-case tracking-normal font-sans opacity-50 ml-1">optional</span>
        </label>
        <div
          className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer ${
            isDragging ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          {uploadedPhotos.length === 0 && uploadingCount === 0 ? (
            <div className="flex items-center gap-3 px-4 py-4 text-muted-foreground/50">
              <Upload className="w-5 h-5 shrink-0" />
              <span className="text-xs font-mono">Drop photos here or click to browse</span>
            </div>
          ) : (
            <div className="p-2 grid grid-cols-5 gap-1.5">
              {uploadedPhotos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={photo.previewSrc} alt={photo.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedPhotos((prev) => prev.filter((_, j) => j !== i));
                        URL.revokeObjectURL(photo.previewSrc);
                      }}
                      className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              ))}
              {uploadingCount > 0 && Array.from({ length: uploadingCount }).map((_, i) => (
                <div key={`u-${i}`} className="aspect-square rounded-lg bg-white/5 flex items-center justify-center">
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                </div>
              ))}
              {(uploadedPhotos.length + uploadingCount) < 10 && (
                <div className="aspect-square rounded-lg border border-dashed border-white/10 flex items-center justify-center text-white/20 hover:text-primary/40 transition-colors">
                  <ImagePlus className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          )}
        </div>
        <AnimatePresence>
          {uploadedPhotos.length > 0 && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-[10px] text-primary font-mono"
            >
              {uploadedPhotos.length} photo{uploadedPhotos.length !== 1 ? "s" : ""} ready - will compose as slideshow background
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={busy}
        size="lg"
        className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base transition-all hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Starting pipeline...</>
        ) : uploadingCount > 0 ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading {uploadingCount} photo{uploadingCount !== 1 ? "s" : ""}...</>
        ) : isAuthenticated ? (
          <>Generate My Video <ArrowRight className="w-4 h-4 ml-2" /></>
        ) : (
          <>Get Started - Sign In Free <ArrowRight className="w-4 h-4 ml-2" /></>
        )}
      </Button>

      {!isAuthenticated && !authLoading && (
        <p className="text-center text-[11px] text-muted-foreground/60">
          Takes 10 seconds / No credit card required
        </p>
      )}
    </form>
  );
}
