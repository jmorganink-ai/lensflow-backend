import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetJobStatsQueryKey,
  getListJobsQueryKey,
  useCreateSelfRecordedJob,
} from "@workspace/api-client-react";

import { uploadVideo } from "@/lib/api";
import { useColors } from "@/hooks/useColors";

const SPEEDS = [
  { label: "Slow", value: 0.4 },
  { label: "Normal", value: 0.8 },
  { label: "Fast", value: 1.4 },
];

export default function RecordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{
    script?: string;
    title?: string;
    inputMode?: string;
    listingUrl?: string;
    propertyAddress?: string;
    propertyImages?: string;
    backgroundImageUrl?: string;
    voiceId?: string;
    voiceName?: string;
    musicTrack?: string;
  }>();

  const script = params.script ?? "";
  const title = params.title ?? "";

  const createSelfRecorded = useCreateSelfRecordedJob();

  const [camPerm, requestCamPerm] = useCameraPermissions();
  const [micPerm, requestMicPerm] = useMicrophonePermissions();

  const cameraRef = useRef<CameraView>(null);
  const scrollRef = useRef<ScrollView>(null);
  const offsetRef = useRef(0);
  const contentHeightRef = useRef(0);
  const viewHeightRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [facing, setFacing] = useState<"front" | "back">("front");
  const [speed, setSpeed] = useState(0.8);
  const [scrolling, setScrolling] = useState(false);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

  const stopTeleprompter = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setScrolling(false);
  };

  const startTeleprompter = () => {
    if (tickRef.current) return;
    setScrolling(true);
    tickRef.current = setInterval(() => {
      const maxOffset = Math.max(0, contentHeightRef.current - viewHeightRef.current);
      offsetRef.current = Math.min(offsetRef.current + speed, maxOffset);
      scrollRef.current?.scrollTo({ y: offsetRef.current, animated: false });
      if (offsetRef.current >= maxOffset) stopTeleprompter();
    }, 16);
  };

  const resetTeleprompter = () => {
    stopTeleprompter();
    offsetRef.current = 0;
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Restart the ticker when speed changes mid-scroll so the new speed applies.
  useEffect(() => {
    if (scrolling) {
      stopTeleprompter();
      startTeleprompter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  useEffect(() => () => stopTeleprompter(), []);

  async function ensurePermissions(): Promise<boolean> {
    let cam = camPerm?.granted;
    let mic = micPerm?.granted;
    if (!cam) cam = (await requestCamPerm()).granted;
    if (!mic) mic = (await requestMicPerm()).granted;
    if (!cam || !mic) {
      Alert.alert(
        "Camera & microphone needed",
        "Please allow camera and microphone access so you can film your video.",
      );
      return false;
    }
    return true;
  }

  async function handleFinish(uri: string) {
    setProcessing(true);
    try {
      const videoUrl = await uploadVideo({ uri });
      const images = params.propertyImages ? safeParseArray(params.propertyImages) : [];
      const job = await createSelfRecorded.mutateAsync({
        data: {
          videoUrl,
          script,
          title: title || undefined,
          inputMode: params.inputMode === "photos" ? "photos" : "url",
          listingUrl: params.listingUrl || undefined,
          propertyAddress: params.propertyAddress || undefined,
          propertyImages: images,
          backgroundImageUrl: params.backgroundImageUrl || undefined,
          voiceId: params.voiceId || undefined,
          voiceName: params.voiceName || undefined,
          musicTrack: params.musicTrack || undefined,
        },
      });

      queryClient.invalidateQueries({ queryKey: getGetJobStatsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
      router.replace(`/job/${job.id}`);
    } catch {
      setProcessing(false);
      Alert.alert(
        "Couldn’t save your video",
        "Your recording finished but we couldn’t upload it. Please try again.",
      );
    }
  }

  async function startRecording() {
    if (!cameraRef.current) return;
    if (!(await ensurePermissions())) return;

    setRecording(true);
    resetTeleprompter();
    startTeleprompter();
    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: 120 });
      if (video?.uri) {
        await handleFinish(video.uri);
      }
    } catch {
      Alert.alert("Recording failed", "Something went wrong while recording. Please try again.");
    } finally {
      setRecording(false);
      stopTeleprompter();
    }
  }

  function stopRecording() {
    cameraRef.current?.stopRecording();
  }

  // Missing script — can't run the teleprompter, so send the agent back to Create.
  if (!script.trim()) {
    return (
      <View style={[styles.center, { backgroundColor: "#000", paddingHorizontal: 32 }]}>
        <Feather name="alert-circle" size={34} color="rgba(255,255,255,0.8)" />
        <Text style={styles.processingText}>We couldn’t load your script.</Text>
        <Pressable
          onPress={() => router.replace("/(tabs)/create")}
          style={[styles.speedChip, { borderColor: colors.primary, paddingHorizontal: 20 }]}
        >
          <Text style={[styles.speedText, { color: colors.primary }]}>Back to Create</Text>
        </Pressable>
      </View>
    );
  }

  // Permission gate
  if (!camPerm || !micPerm) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  if (processing) {
    return (
      <View style={[styles.center, { backgroundColor: "#000" }]}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={styles.processingText}>Uploading your video…</Text>
        <Text style={[styles.processingText, { fontSize: 12, opacity: 0.65, marginTop: -6 }]}>
          We'll compose the final video in the background
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} disabled={recording}>
          <Feather name="x" size={22} color="#fff" />
        </Pressable>
        {title ? (
          <Text style={styles.topTitle} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View />
        )}
        <Pressable
          onPress={() => setFacing((f) => (f === "front" ? "back" : "front"))}
          style={styles.iconBtn}
          disabled={recording}
        >
          <Feather name="refresh-cw" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Background + enhancements indicator chips */}
      {(params.backgroundImageUrl || params.voiceId || params.musicTrack) && (
        <View style={[styles.chipsRow, { top: insets.top + 62 }]}>
          {!!params.backgroundImageUrl && (
            <View style={styles.chip}>
              <Feather name="image" size={11} color="#fff" />
              <Text style={styles.chipText}>BG</Text>
            </View>
          )}
          {!!params.voiceId && (
            <View style={styles.chip}>
              <Feather name="mic" size={11} color="#fff" />
              <Text style={styles.chipText}>{params.voiceName || "Narration"}</Text>
            </View>
          )}
          {!!params.musicTrack && (
            <View style={styles.chip}>
              <Feather name="music" size={11} color="#fff" />
              <Text style={styles.chipText}>{params.musicTrack}</Text>
            </View>
          )}
        </View>
      )}

      {/* Teleprompter overlay */}
      <View style={styles.prompterWrap} pointerEvents="box-none">
        <View style={styles.prompter}>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!scrolling}
            onLayout={(e) => {
              viewHeightRef.current = e.nativeEvent.layout.height;
            }}
            onContentSizeChange={(_, h) => {
              contentHeightRef.current = h;
            }}
            contentContainerStyle={{ paddingVertical: 24 }}
          >
            <Text style={styles.prompterText}>{script}</Text>
          </ScrollView>
        </View>
      </View>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 18 }]}>
        {/* Speed + teleprompter controls */}
        <View style={styles.speedRow}>
          {SPEEDS.map((s) => (
            <Pressable
              key={s.label}
              onPress={() => setSpeed(s.value)}
              style={[
                styles.speedChip,
                { borderColor: speed === s.value ? colors.primary : "rgba(255,255,255,0.35)" },
              ]}
            >
              <Text
                style={[
                  styles.speedText,
                  { color: speed === s.value ? colors.primary : "rgba(255,255,255,0.85)" },
                ]}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={scrolling ? stopTeleprompter : startTeleprompter}
            style={[styles.speedChip, { borderColor: "rgba(255,255,255,0.35)" }]}
          >
            <Feather name={scrolling ? "pause" : "play"} size={13} color="#fff" />
          </Pressable>
          <Pressable
            onPress={resetTeleprompter}
            style={[styles.speedChip, { borderColor: "rgba(255,255,255,0.35)" }]}
          >
            <Feather name="rotate-ccw" size={13} color="#fff" />
          </Pressable>
        </View>

        {/* Record button */}
        <View style={styles.recordRow}>
          <Pressable
            onPress={recording ? stopRecording : startRecording}
            style={styles.recordOuter}
          >
            <View
              style={[
                recording ? styles.recordInnerStop : styles.recordInner,
                { backgroundColor: recording ? "#fff" : colors.primary },
              ]}
            />
          </Pressable>
        </View>
        <Text style={styles.hint}>
          {recording ? "Tap to stop · script is scrolling" : "Tap to record · read the script aloud"}
        </Text>
      </View>
    </View>
  );
}

function safeParseArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  processingText: { color: "#fff", fontFamily: "Inter_500Medium", fontSize: 15 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    zIndex: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    marginHorizontal: 10,
  },
  prompterWrap: {
    position: "absolute",
    top: "18%",
    left: 14,
    right: 14,
    height: "42%",
  },
  prompter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 18,
    paddingHorizontal: 18,
    overflow: "hidden",
  },
  prompterText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 23,
    lineHeight: 34,
    textAlign: "center",
  },
  controls: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  speedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  speedChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  speedText: { fontFamily: "Inter_600SemiBold", fontSize: 12.5 },
  recordRow: { alignItems: "center", justifyContent: "center" },
  recordOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  recordInner: { width: 60, height: 60, borderRadius: 30 },
  recordInnerStop: { width: 30, height: 30, borderRadius: 7 },
  hint: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
    fontSize: 12.5,
    marginTop: 12,
  },
  chipsRow: {
    position: "absolute",
    left: 14,
    right: 14,
    flexDirection: "row",
    gap: 7,
    zIndex: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  chipText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 10.5,
    textTransform: "capitalize",
  },
});
