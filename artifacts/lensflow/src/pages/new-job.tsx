import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useCreateJob, useSimulateJob, useListElevenLabsVoices, getGetJobStatsQueryKey, getListJobsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2, ArrowRight, Mic, Loader2, Play, ChevronDown, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";

const PRESENTER_PRESETS = [
  {
    id: "mia",
    name: "Mia",
    specialty: "Waterfront · Lifestyle",
    voiceId: "x3PfG9wL6FOEApZ1VJ9H",
    voiceName: "emma",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=400",
  },
  {
    id: "oliver",
    name: "Oliver",
    specialty: "Inner-City · Investment",
    voiceId: "yXFr3XVHzrViCIHi1yoc",
    voiceName: "aussie voice",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=400",
  },
  {
    id: "sophie",
    name: "Sophie",
    specialty: "Family · Suburban",
    voiceId: "69h9o7wh5u0isWHzdogD",
    voiceName: "Australian real estate agent",
    photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=300&h=400",
  },
];

const PLATFORM_LABELS: Record<string, string> = {
  "realestate.com.au": "REA",
  "domain.com.au": "Domain",
  "onthehouse.com.au": "OnTheHouse",
  "allhomes.com.au": "AllHomes",
  "raywhite.com": "Ray White",
  "ljhooker.com": "LJ Hooker",
  "harcourts.com.au": "Harcourts",
  "mcgrath.com.au": "McGrath",
  "barryproperty.com.au": "Barry Plant",
};

function detectPlatform(url: string): { label: string; domain: string } | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname.replace("www.", "");
    for (const [domain, label] of Object.entries(PLATFORM_LABELS)) {
      if (host === domain || host.endsWith("." + domain)) {
        return { label, domain };
      }
    }
    if (host) return { label: host, domain: host };
  } catch {
    // not yet a valid URL
  }
  return null;
}

const formSchema = z.object({
  listingUrl: z.string().url("Please enter a valid URL"),
  voiceId: z.string().optional(),
  voiceName: z.string().optional(),
});

export default function NewJob() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createJob = useCreateJob();
  const simulateJob = useSimulateJob();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: voices = [], isLoading: voicesLoading } = useListElevenLabsVoices();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { listingUrl: "", voiceId: "", voiceName: "" },
  });

  const selectedVoiceName = form.watch("voiceName");
  const selectedVoiceId = form.watch("voiceId");
  const watchedUrl = form.watch("listingUrl");
  const detectedPlatform = detectPlatform(watchedUrl);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setVoiceOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function playPreview(url: string, e: React.MouseEvent) {
    e.stopPropagation();
    setPreviewSrc(url);
    setTimeout(() => audioRef.current?.play(), 50);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    createJob.mutate(
      {
        data: {
          listingUrl: values.listingUrl,
          voiceId: values.voiceId || undefined,
          voiceName: values.voiceName || undefined,
        },
      },
      {
        onSuccess: (job) => {
          queryClient.invalidateQueries({ queryKey: getGetJobStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
          // Auto-start the pipeline immediately — no extra click needed
          simulateJob.mutate({ id: job.id }, {
            onSuccess: () => {
              toast({ title: "Pipeline Running", description: "All 5 stages are now processing automatically." });
            },
          });
          setLocation(`/jobs/${job.id}`);
        },
        onError: () => {
          toast({ title: "Submission Failed", description: "Could not start the pipeline. Please try again.", variant: "destructive" });
        },
      }
    );
  }

  // Group voices: cloned first, then premade
  const clonedVoices = voices.filter((v) => v.category === "cloned");
  const otherVoices = voices.filter((v) => v.category !== "cloned");

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">New Pipeline Run</h1>
        <p className="text-muted-foreground">Submit a property listing URL to automatically generate a professional presenter video.</p>
      </div>

      <div className="bg-card border border-border p-6 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Listing URL */}
            <FormField
              control={form.control}
              name="listingUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Target URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="https://realestate.com.au/property/..."
                        className="pl-10 h-12 bg-background border-border font-mono text-sm"
                        {...field}
                      />
                      {detectedPlatform && (
                        <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none">
                          <span className="flex items-center gap-1.5 text-[10px] font-mono text-primary border border-primary/30 bg-primary/5 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            {detectedPlatform.label}
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["realestate.com.au", "domain.com.au", "onthehouse.com.au", "allhomes.com.au"].map((site) => (
                      <button
                        key={site}
                        type="button"
                        onClick={() => form.setValue("listingUrl", `https://${site}/property/`)}
                        className="text-[10px] font-mono text-muted-foreground border border-border/50 px-2 py-0.5 rounded hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        {site}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Presenter Presets */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-mono text-muted-foreground flex items-center gap-2">
                <Mic className="w-3.5 h-3.5" />
                Choose Presenter
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRESENTER_PRESETS.map((p) => {
                  const isSelected = selectedVoiceId === p.voiceId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        form.setValue("voiceId", p.voiceId);
                        form.setValue("voiceName", p.voiceName);
                      }}
                      className={`relative rounded-lg overflow-hidden aspect-[3/4] group border-2 transition-all ${
                        isSelected ? "border-primary shadow-[0_0_12px_rgba(var(--primary),0.4)]" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <img src={p.photo} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-xs font-semibold">{p.name}</div>
                        <div className="text-[9px] text-primary font-mono leading-tight mt-0.5">{p.specialty}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voice Picker */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-mono text-muted-foreground flex items-center gap-2">
                <Mic className="w-3.5 h-3.5" />
                Or Pick From Library
                {voicesLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              </label>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setVoiceOpen((o) => !o)}
                  className="w-full h-12 flex items-center justify-between px-4 bg-background border border-border rounded-md font-mono text-sm hover:border-primary/50 transition-colors"
                >
                  <span className={selectedVoiceName ? "text-foreground" : "text-muted-foreground"}>
                    {selectedVoiceName || (voicesLoading ? "Loading voices…" : "Select a voice (optional)")}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${voiceOpen ? "rotate-180" : ""}`} />
                </button>

                {voiceOpen && (
                  <div className="absolute z-50 top-full mt-1 w-full max-h-72 overflow-y-auto bg-card border border-border rounded-md shadow-xl">
                    {/* No voice option */}
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue("voiceId", "");
                        form.setValue("voiceName", "");
                        setVoiceOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border"
                    >
                      <span className="text-sm text-muted-foreground font-mono">— No voice (simulation only)</span>
                    </button>

                    {/* Cloned voices */}
                    {clonedVoices.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-[10px] uppercase tracking-widest font-mono text-primary/70 bg-primary/5">
                          Your Cloned Voices
                        </div>
                        {clonedVoices.map((v) => (
                          <VoiceOption
                            key={v.voice_id}
                            voice={v}
                            selected={selectedVoiceId === v.voice_id}
                            onSelect={() => {
                              form.setValue("voiceId", v.voice_id);
                              form.setValue("voiceName", v.name);
                              setVoiceOpen(false);
                            }}
                            onPreview={v.preview_url ? (e) => playPreview(v.preview_url!, e) : undefined}
                          />
                        ))}
                      </>
                    )}

                    {/* Premade/other voices */}
                    {otherVoices.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-[10px] uppercase tracking-widest font-mono text-muted-foreground bg-muted/30">
                          Library Voices
                        </div>
                        {otherVoices.map((v) => (
                          <VoiceOption
                            key={v.voice_id}
                            voice={v}
                            selected={selectedVoiceId === v.voice_id}
                            onSelect={() => {
                              form.setValue("voiceId", v.voice_id);
                              form.setValue("voiceName", v.name);
                              setVoiceOpen(false);
                            }}
                            onPreview={v.preview_url ? (e) => playPreview(v.preview_url!, e) : undefined}
                          />
                        ))}
                      </>
                    )}

                    {!voicesLoading && voices.length === 0 && (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground font-mono">
                        No voices found in your ElevenLabs account.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedVoiceId && (
                <p className="text-[11px] text-primary font-mono">
                  ✓ ElevenLabs TTS will run live for the voiceover step
                </p>
              )}
              {!selectedVoiceId && (
                <p className="text-[11px] text-muted-foreground font-mono">
                  No voice selected — voiceover step will be simulated
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={createJob.isPending}
                className="font-mono uppercase tracking-wider h-12 px-8"
              >
                {createJob.isPending ? "Starting pipeline..." : "Generate Video"}
                {!createJob.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Hidden audio player for previews */}
      {previewSrc && <audio ref={audioRef} src={previewSrc} className="hidden" />}

      {/* What happens next */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">What happens next</div>
        <div className="space-y-3">
          {[
            { n: "01", label: "Scrape Listing Data", desc: "LensFlow reads your listing URL to extract property details.", live: false },
            { n: "02", label: "Generate AI Script", desc: "Claude AI writes a professional 45-second presenter script.", live: true, badge: "LIVE · Claude AI" },
            { n: "03", label: "Synthesize Voiceover", desc: "Your chosen presenter's voice records the script.", live: !!selectedVoiceId, badge: selectedVoiceId ? "LIVE · ElevenLabs" : "Simulated" },
            { n: "04", label: "Render Presenter Avatar", desc: "A photoreal AI avatar presents your listing on camera.", live: false },
            { n: "05", label: "Final Video Composition", desc: "All elements are composited into a single shareable video file.", live: false },
          ].map((step) => (
            <div key={step.n} className="flex items-start gap-3">
              <span className="text-primary font-mono text-xs w-5 shrink-0 pt-0.5">{step.n}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">{step.label}</span>
                  {step.badge && (
                    <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${step.live ? "text-primary border-primary/30 bg-primary/5" : "text-muted-foreground border-border"}`}>
                      {step.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VoiceOption({
  voice,
  selected,
  onSelect,
  onPreview,
}: {
  voice: { voice_id: string; name: string; category: string; labels?: Record<string, string> | null };
  selected: boolean;
  onSelect: () => void;
  onPreview?: (e: React.MouseEvent) => void;
}) {
  const accent = voice.labels?.accent ?? null;
  const gender = voice.labels?.gender ?? null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors ${selected ? "bg-primary/10" : ""}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${selected ? "bg-primary" : "bg-muted-foreground/30"}`} />
        <div className="min-w-0">
          <span className={`text-sm font-mono block truncate ${selected ? "text-primary" : "text-foreground"}`}>{voice.name}</span>
          {(accent || gender) && (
            <span className="text-[10px] text-muted-foreground font-mono">{[gender, accent].filter(Boolean).join(" · ")}</span>
          )}
        </div>
      </div>
      {onPreview && (
        <button
          type="button"
          onClick={onPreview}
          className="shrink-0 ml-2 p-1 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
          title="Preview voice"
        >
          <Play className="w-3.5 h-3.5" />
        </button>
      )}
    </button>
  );
}
