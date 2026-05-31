import { getGetJobQueryKey, useGetJob } from "@workspace/api-client-react";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StatusBadge } from "@/components/StatusBadge";
import { useColors } from "@/hooks/useColors";
import type { PipelineStep } from "@workspace/api-client-react";

const STEP_FALLBACK_LABELS: Record<string, string> = {
  enhance_photos: "AI Photo Glow-up",
  analyse_photos: "Analyse Photos",
  scrape_listing: "Read the Listing",
  generate_script: "Write the Script",
  create_voiceover: "Record Voiceover",
  presenter_video: "Generate Presenter",
  compose_video: "Compose Final Video",
};

export default function JobDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const jobQuery = useGetJob(id, {
    query: {
      queryKey: getGetJobQueryKey(id),
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        return status === "queued" || status === "processing" ? 1500 : false;
      },
    },
  });

  const job = jobQuery.data;
  const steps = useMemo(
    () => (job?.steps ?? []).slice().sort((a, b) => a.order - b.order),
    [job?.steps],
  );

  const scriptStep = steps.find((s) => s.name === "generate_script");
  const script = scriptStep?.outputData ?? null;
  const videoUrl = job?.videoUrl ?? null;

  const player = useVideoPlayer(videoUrl ?? "", (p) => {
    p.loop = false;
  });

  const [copied, setCopied] = useState(false);

  async function copyScript() {
    if (!script) return;
    await Clipboard.setStringAsync(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function shareJob() {
    const title = job?.listingTitle || job?.propertyAddress || "my LensFlow video";
    try {
      await Share.share({
        message: `Check out ${title} — created with LensFlow AI. https://www.lensflow.com.au`,
      });
    } catch {
      /* user cancelled */
    }
  }

  const title =
    job?.listingTitle || job?.propertyAddress || job?.listingUrl || "Property Video";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerTintColor: colors.foreground,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.headerBtn}>
              <Feather name="chevron-left" size={24} color={colors.foreground} />
            </Pressable>
          ),
          headerRight: () =>
            job ? (
              <Pressable onPress={shareJob} style={styles.headerBtn}>
                <Feather name="share" size={20} color={colors.foreground} />
              </Pressable>
            ) : null,
        }}
      />

      {jobQuery.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : !job ? (
        <View style={styles.center}>
          <Text style={{ color: colors.mutedForeground }}>Job not found.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 52,
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: 18,
          }}
        >
          {/* Title + status */}
          <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
          <View style={styles.statusRow}>
            <StatusBadge status={job.status} />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {job.inputMode === "photos" ? "From photos" : "From listing URL"}
            </Text>
          </View>

          {/* Final video */}
          {videoUrl ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Your Video
              </Text>
              <View style={[styles.videoWrap, { borderColor: colors.border }]}>
                <VideoView
                  player={player}
                  style={styles.video}
                  contentFit="contain"
                  allowsFullscreen
                  nativeControls
                />
              </View>
            </View>
          ) : (
            job.status !== "failed" && (
              <View
                style={[
                  styles.pendingVideo,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <ActivityIndicator color={colors.primary} />
                <Text style={[styles.pendingText, { color: colors.mutedForeground }]}>
                  Your video is being produced…
                </Text>
              </View>
            )
          )}

          {/* Pipeline timeline */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Pipeline
            </Text>
            <View style={styles.timeline}>
              {steps.map((step, i) => (
                <StepRow
                  key={step.id}
                  step={step}
                  isLast={i === steps.length - 1}
                  colors={colors}
                />
              ))}
            </View>
          </View>

          {/* Script */}
          {script && (
            <View style={styles.section}>
              <View style={styles.sectionHeadRow}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  AI Script
                </Text>
                <Pressable
                  onPress={copyScript}
                  style={[styles.copyBtn, { borderColor: colors.primary + "55" }]}
                >
                  <Feather
                    name={copied ? "check" : "copy"}
                    size={13}
                    color={colors.primary}
                  />
                  <Text style={[styles.copyText, { color: colors.primary }]}>
                    {copied ? "Copied" : "Copy"}
                  </Text>
                </Pressable>
              </View>
              <View
                style={[
                  styles.scriptBox,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.scriptText, { color: colors.foreground }]}>
                  {script}
                </Text>
              </View>
            </View>
          )}

          {/* Photos */}
          {!!job.propertyImages?.length && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Photos
              </Text>
              <View style={styles.photoGrid}>
                {(job.enhancedImages?.length ? job.enhancedImages : job.propertyImages).map(
                  (uri, idx) => (
                    <Image
                      key={`${uri}-${idx}`}
                      source={{ uri }}
                      style={[styles.photo, { borderColor: colors.border }]}
                      contentFit="cover"
                    />
                  ),
                )}
              </View>
            </View>
          )}

          {/* Actions */}
          <Pressable
            onPress={() => router.replace("/create")}
            style={({ pressed }) => [
              styles.newBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="plus" size={18} color={colors.primaryForeground} />
            <Text style={[styles.newBtnText, { color: colors.primaryForeground }]}>
              Create another video
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

function StepRow({
  step,
  isLast,
  colors,
}: {
  step: PipelineStep;
  isLast: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  const label = step.label || STEP_FALLBACK_LABELS[step.name] || step.name;

  let icon: keyof typeof Feather.glyphMap = "circle";
  let color = colors.mutedForeground;
  if (step.status === "complete") {
    icon = "check-circle";
    color = colors.primary;
  } else if (step.status === "running") {
    icon = "loader";
    color = "#60a5fa";
  } else if (step.status === "failed") {
    icon = "x-circle";
    color = colors.destructive;
  }

  return (
    <View style={styles.stepRow}>
      <View style={styles.stepIndicator}>
        {step.status === "running" ? (
          <ActivityIndicator color={color} size="small" />
        ) : (
          <Feather name={icon} size={20} color={color} />
        )}
        {!isLast && (
          <View
            style={[
              styles.connector,
              {
                backgroundColor:
                  step.status === "complete" ? colors.primary : colors.border,
              },
            ]}
          />
        )}
      </View>
      <View style={styles.stepBody}>
        <Text
          style={[
            styles.stepLabel,
            {
              color:
                step.status === "pending" ? colors.mutedForeground : colors.foreground,
            },
          ]}
        >
          {label}
        </Text>
        {step.status === "failed" && step.errorMessage && (
          <Text style={[styles.stepError, { color: colors.destructive }]}>
            {step.errorMessage}
          </Text>
        )}
        {step.status === "running" && (
          <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
            In progress…
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerBtn: { padding: 6 },
  title: { fontFamily: "Inter_700Bold", fontSize: 23, letterSpacing: -0.4 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  meta: { fontFamily: "Inter_400Regular", fontSize: 13 },
  section: { marginTop: 28 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 17, marginBottom: 12 },
  sectionHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  videoWrap: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: { width: "100%", aspectRatio: 16 / 9 },
  pendingVideo: {
    marginTop: 22,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 34,
    alignItems: "center",
    gap: 12,
  },
  pendingText: { fontFamily: "Inter_500Medium", fontSize: 14 },
  timeline: { gap: 0 },
  stepRow: { flexDirection: "row", gap: 14 },
  stepIndicator: { alignItems: "center", width: 24 },
  connector: { width: 2, flex: 1, marginVertical: 4, minHeight: 18 },
  stepBody: { flex: 1, paddingBottom: 22 },
  stepLabel: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  stepSub: { fontFamily: "Inter_400Regular", fontSize: 12.5, marginTop: 2 },
  stepError: { fontFamily: "Inter_400Regular", fontSize: 12.5, marginTop: 2 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  copyText: { fontFamily: "Inter_600SemiBold", fontSize: 12.5 },
  scriptBox: { borderRadius: 14, borderWidth: 1, padding: 16 },
  scriptText: { fontFamily: "Inter_400Regular", fontSize: 14.5, lineHeight: 23 },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photo: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    height: 54,
    borderRadius: 14,
    marginTop: 32,
  },
  newBtnText: { fontFamily: "Inter_700Bold", fontSize: 16 },
});
