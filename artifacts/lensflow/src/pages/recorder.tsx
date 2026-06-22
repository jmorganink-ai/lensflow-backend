import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useGetJob, getGetJobQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, Video, Square, Download, RotateCcw, Mic, MicOff, Settings, X } from "lucide-react";
import { Link } from "wouter";

type RecorderState = "idle" | "countdown" | "recording" | "done";

export default function Recorder() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: job } = useGetJob(id!, { query: { enabled: !!id, queryKey: getGetJobQueryKey(id!) } });

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scriptRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [state, setState] = useState<RecorderState>("idle");
  const [countdown, setCountdown] = useState(3);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [scrollSpeed, setScrollSpeed] = useState(25);
  const [textSize, setTextSize] = useState(28);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  const script = job?.steps?.find((s: any) => s.name === "generate_script" && s.status === "complete")?.outputData ?? "";

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setCameraError(null);
    } catch (err: any) {
      setCameraError(err.message ?? "Camera access denied");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  function startCountdown() {
    setState("countdown");
    setCountdown(3);
    let count = 3;
    const timer = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(timer);
        setCountdown(0);
        startRecording();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }

  function startRecording() {
    if (!stream) return;
    chunksRef.current = [];
    scrollPosRef.current = 0;
    if (scriptRef.current) scriptRef.current.style.transform = "translateY(0px)";

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setDownloadUrl(URL.createObjectURL(blob));
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setState("recording");
    startScroll();
  }

  function startScroll() {
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    const speed = 52 - scrollSpeed;
    scrollIntervalRef.current = setInterval(() => {
      scrollPosRef.current -= 1;
      if (scriptRef.current) {
        scriptRef.current.style.transform = `translateY(${scrollPosRef.current}px)`;
        const totalHeight = scriptRef.current.scrollHeight;
        if (Math.abs(scrollPosRef.current) > totalHeight + 100) stopRecording();
      }
    }, speed);
  }

  function stopRecording() {
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setState("done");
  }

  function reset() {
    setDownloadUrl(null);
    scrollPosRef.current = 0;
    if (scriptRef.current) scriptRef.current.style.transform = "translateY(0px)";
    setState("idle");
  }

  function toggleAudio() {
    if (stream) {
      stream.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
      setAudioMuted((m) => !m);
    }
  }

  function handleDownload() {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `lensflow-recording-${id}.webm`;
    a.click();
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />

      {/* Dark overlay at top & bottom */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />

      {/* Camera error state */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/90 text-white p-8 text-center">
          <Video className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Camera Access Required</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">{cameraError}</p>
          <button onClick={startCamera} className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold">
            Try Again
          </button>
        </div>
      )}

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 pt-5">
        <Link href={`/jobs/${id}`}>
          <button className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium backdrop-blur-sm bg-black/30 px-3 py-2 rounded-full border border-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Job
          </button>
        </Link>
        <div className="flex items-center gap-2">
          {state === "recording" && (
            <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-400/30">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">REC</span>
            </div>
          )}
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 text-white/70 hover:text-white backdrop-blur-sm bg-black/30 px-3 py-2 rounded-full border border-white/10 transition-colors"
          >
            {audioMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="flex items-center gap-1.5 text-white/70 hover:text-white backdrop-blur-sm bg-black/30 px-3 py-2 rounded-full border border-white/10 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute top-16 right-5 z-30 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-64">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white text-sm font-semibold">Settings</span>
            <button onClick={() => setShowSettings(false)}><X className="w-4 h-4 text-white/50" /></button>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Scroll Speed</label>
              <input type="range" min={5} max={48} value={scrollSpeed}
                onChange={(e) => {
                  setScrollSpeed(Number(e.target.value));
                  if (state === "recording") { if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current); startScroll(); }
                }}
                className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] text-white/30 mt-1"><span>Slow</span><span>Fast</span></div>
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Text Size</label>
              <input type="range" min={18} max={48} value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] text-white/30 mt-1"><span>Small</span><span>Large</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Teleprompter script */}
      {script && state !== "done" && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none px-8 max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 px-6 py-4" style={{ maxHeight: "45vh" }}>
            {/* Focus gradient top/bottom */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
            <div ref={scriptRef} className="text-white font-semibold leading-relaxed text-center transition-none" style={{ fontSize: `${textSize}px` }}>
              {script}
            </div>
          </div>
          <p className="text-center text-[10px] text-white/30 mt-2 uppercase tracking-widest font-mono">
            {state === "idle" ? "Script ready — press record" : state === "recording" ? "Script scrolling…" : ""}
          </p>
        </div>
      )}

      {!script && state !== "done" && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-center px-8">
          <p className="text-white/30 text-sm">No script found — complete the pipeline first to auto-load your script.</p>
        </div>
      )}

      {/* Countdown overlay */}
      {state === "countdown" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <span className="text-white font-bold" style={{ fontSize: "20vw", lineHeight: 1, textShadow: "0 0 60px rgba(0,0,0,0.8)" }}>
            {countdown > 0 ? countdown : "GO"}
          </span>
        </div>
      )}

      {/* Done overlay */}
      {state === "done" && downloadUrl && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Video className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Take Saved!</h2>
            <p className="text-muted-foreground text-sm mb-6">Your recording is ready to download.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDownload} className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
                <Download className="w-4 h-4" /> Download Recording
              </button>
              <button onClick={reset} className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-colors">
                <RotateCcw className="w-4 h-4" /> Record Again
              </button>
              <Link href={`/jobs/${id}`}>
                <button className="w-full py-3 text-muted-foreground hover:text-foreground rounded-full font-medium transition-colors text-sm">
                  Use AI Presenter Instead →
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      {(state === "idle" || state === "recording") && (
        <div className="absolute bottom-8 inset-x-0 z-20 flex items-center justify-center gap-8">
          {state === "idle" ? (
            <button
              onClick={startCountdown}
              disabled={!stream || !!cameraError}
              className="w-20 h-20 rounded-full bg-red-600 border-4 border-white shadow-2xl hover:bg-red-500 transition-colors disabled:opacity-40 flex items-center justify-center"
            >
              <Video className="w-8 h-8 text-white" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-red-600 border-4 border-white shadow-2xl hover:bg-red-500 transition-colors flex items-center justify-center"
            >
              <Square className="w-8 h-8 text-white fill-white" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
