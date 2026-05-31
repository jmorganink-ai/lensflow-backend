import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useCreateJob, useListElevenLabsVoices, getGetJobStatsQueryKey, getListJobsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2, ArrowRight, Mic, Loader2, Play, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";

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
          toast({ title: "Pipeline Initiated", description: "Job successfully queued for processing." });
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
                      <Link2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="https://realestate.com.au/property/..."
                        className="pl-10 h-12 bg-background border-border font-mono text-sm"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Voice Picker */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-mono text-muted-foreground flex items-center gap-2">
                <Mic className="w-3.5 h-3.5" />
                Voiceover Voice
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
                {createJob.isPending ? "Initializing..." : "Engage Pipeline"}
                {!createJob.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Hidden audio player for previews */}
      {previewSrc && <audio ref={audioRef} src={previewSrc} className="hidden" />}

      <div className="text-xs text-muted-foreground font-mono space-y-2">
        <div className="uppercase tracking-widest text-foreground mb-4">Pipeline Stages:</div>
        <div className="flex items-center gap-4 opacity-50"><span className="text-primary">01</span> Scrape Listing Data</div>
        <div className="flex items-center gap-4 opacity-50"><span className="text-primary">02</span> Generate AI Script</div>
        <div className="flex items-center gap-4">
          <span className="text-primary">03</span>
          <span className={selectedVoiceId ? "text-primary" : ""}>Synthesize Voiceover</span>
          {selectedVoiceId && <span className="text-primary text-[10px] border border-primary/30 px-1.5 py-0.5 rounded">LIVE · ElevenLabs</span>}
        </div>
        <div className="flex items-center gap-4 opacity-50"><span className="text-primary">04</span> Render Presenter Avatar</div>
        <div className="flex items-center gap-4 opacity-50"><span className="text-primary">05</span> Final Video Composition</div>
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
