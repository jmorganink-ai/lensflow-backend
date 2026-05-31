import {
  getGetJobStatsQueryKey,
  getListJobsQueryKey,
  useCreateJob,
  useSimulateJob,
  useGenerateScript,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PRESENTERS, detectPlatform, isValidUrl } from "@/constants/presenters";
import { uploadPhoto } from "@/lib/api";
import { useColors } from "@/hooks/useColors";

type Mode = "url" | "photos";
type Path = "self" | "ai";
interface Photo {
  uri: string;
  publicUrl: string;
}

export default function CreateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createJob = useCreateJob();
  const simulateJob = useSimulateJob();
  const generateScript = useGenerateScript();

  const [mode, setMode] = useState<Mode>("url");
  const [path, setPath] = useState<Path>("self");
  const [listingUrl, setListingUrl] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [voiceName, setVoiceName] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [preparing, setPreparing] = useState(false);

  const platform = detectPlatform(listingUrl);

  function validateProperty(): boolean {
    if (mode === "url" && !isValidUrl(listingUrl)) {
      Alert.alert("Invalid URL", "Please enter a valid listing URL (https://…).");
      return false;
    }
    if (mode === "photos" && photos.length === 0) {
      Alert.alert("Add photos", "Upload at least one property photo to continue.");
      return false;
    }
    return true;
  }

  async function pickPhotos() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow photo access to upload property photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10,
    });
    if (result.canceled) return;

    setUploading((n) => n + result.assets.length);
    for (const asset of result.assets) {
      uploadPhoto({
        uri: asset.uri,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        fileSize: asset.fileSize,
      })
        .then((publicUrl) => {
          setPhotos((prev) => [...prev, { uri: asset.uri, publicUrl }]);
        })
        .catch(() => {
          Alert.alert("Upload failed", "One of the photos could not be uploaded.");
        })
        .finally(() => setUploading((n) => n - 1));
    }
  }

  function removePhoto(uri: string) {
    setPhotos((prev) => prev.filter((p) => p.uri !== uri));
  }

  // Film-myself path: generate the AI script up front, then open the
  // teleprompter/record screen with it.
  async function onContinueSelf() {
    if (!validateProperty()) return;

    setPreparing(true);
    try {
      const { script, title } = await generateScript.mutateAsync({
        data: {
          inputMode: mode,
          listingUrl: mode === "url" ? listingUrl.trim() : undefined,
          propertyAddress: propertyAddress.trim() || undefined,
          propertyImages: photos.map((p) => p.publicUrl),
        },
      });

      router.push({
        pathname: "/record",
        params: {
          script,
          title: title ?? "",
          inputMode: mode,
          listingUrl: mode === "url" ? listingUrl.trim() : "",
          propertyAddress: propertyAddress.trim(),
          propertyImages: JSON.stringify(photos.map((p) => p.publicUrl)),
        },
      });
    } catch {
      Alert.alert(
        "Couldn’t write your script",
        "Something went wrong preparing your teleprompter script. Please try again.",
      );
    } finally {
      setPreparing(false);
    }
  }

  async function onSubmit() {
    if (!validateProperty()) return;

    setSubmitting(true);
    try {
      const job = await createJob.mutateAsync({
        data: {
          inputMode: mode,
          listingUrl: mode === "url" ? listingUrl.trim() : undefined,
          propertyAddress: propertyAddress.trim() || undefined,
          voiceId: voiceId || undefined,
          voiceName: voiceName || undefined,
          propertyImages: photos.map((p) => p.publicUrl),
        },
      });

      queryClient.invalidateQueries({ queryKey: getGetJobStatsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });

      // Reset for the next run.
      setListingUrl("");
      setPropertyAddress("");
      setPhotos([]);
      setVoiceId("");
      setVoiceName("");

      router.push(`/job/${job.id}`);

      // Kick off the server-side pipeline. The job already exists, so navigate
      // first, then surface a failure if the pipeline can't be started.
      try {
        await simulateJob.mutateAsync({ id: job.id });
      } catch {
        Alert.alert(
          "Pipeline didn’t start",
          "Your video was created but processing couldn’t be started. Pull down to refresh on the job screen, or try again.",
        );
      }
    } catch {
      Alert.alert("Could not start", "Something went wrong creating the video. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const label = (text: string) => (
    <Text style={[styles.label, { color: colors.mutedForeground }]}>{text}</Text>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 18,
        }}
      >
        <Text style={[styles.h1, { color: colors.foreground }]}>New Video</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Generate a professional presenter video automatically.
        </Text>

        {/* Mode toggle */}
        <View
          style={[
            styles.toggle,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          {(["url", "photos"] as Mode[]).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              style={[
                styles.toggleBtn,
                mode === m && { backgroundColor: colors.primary },
              ]}
            >
              <Feather
                name={m === "url" ? "link" : "image"}
                size={15}
                color={mode === m ? colors.primaryForeground : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.toggleText,
                  { color: mode === m ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                {m === "url" ? "Listing URL" : "Property Photos"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* URL input */}
        {mode === "url" ? (
          <View style={styles.field}>
            {label("TARGET URL")}
            <View
              style={[
                styles.inputWrap,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="link-2" size={16} color={colors.mutedForeground} />
              <TextInput
                value={listingUrl}
                onChangeText={setListingUrl}
                placeholder="https://realestate.com.au/property/…"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                style={[styles.input, { color: colors.foreground }]}
              />
              {platform && (
                <View style={[styles.tag, { borderColor: colors.primary + "55" }]}>
                  <Text style={[styles.tagText, { color: colors.primary }]}>{platform}</Text>
                </View>
              )}
            </View>
            <Pressable
              onPress={() =>
                setListingUrl(
                  "https://www.realestate.com.au/property/4-bed-house-in-mosman-nsw-2088-145832674",
                )
              }
            >
              <Text style={[styles.sample, { color: colors.primary }]}>
                ✦ Try a sample listing
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.field}>
            {label("PROPERTY ADDRESS (OPTIONAL)")}
            <View
              style={[
                styles.inputWrap,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="map-pin" size={16} color={colors.mutedForeground} />
              <TextInput
                value={propertyAddress}
                onChangeText={setPropertyAddress}
                placeholder="12 Ocean View Rd, Mosman NSW"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { color: colors.foreground }]}
              />
            </View>
          </View>
        )}

        {/* Path choice */}
        <View style={styles.field}>
          {label("HOW DO YOU WANT TO MAKE IT?")}
          <View style={styles.pathRow}>
            <Pressable
              onPress={() => setPath("self")}
              style={[
                styles.pathCard,
                {
                  backgroundColor: colors.card,
                  borderColor: path === "self" ? colors.primary : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.pathIcon,
                  { backgroundColor: path === "self" ? colors.primary : colors.secondary },
                ]}
              >
                <Feather
                  name="video"
                  size={18}
                  color={path === "self" ? colors.primaryForeground : colors.mutedForeground}
                />
              </View>
              <Text style={[styles.pathTitle, { color: colors.foreground }]}>Film myself</Text>
              <Text style={[styles.pathDesc, { color: colors.mutedForeground }]}>
                Record on your phone while the script scrolls.
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setPath("ai")}
              style={[
                styles.pathCard,
                {
                  backgroundColor: colors.card,
                  borderColor: path === "ai" ? colors.primary : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.pathIcon,
                  { backgroundColor: path === "ai" ? colors.primary : colors.secondary },
                ]}
              >
                <Feather
                  name="zap"
                  size={18}
                  color={path === "ai" ? colors.primaryForeground : colors.mutedForeground}
                />
              </View>
              <Text style={[styles.pathTitle, { color: colors.foreground }]}>Let AI do it</Text>
              <Text style={[styles.pathDesc, { color: colors.mutedForeground }]}>
                An AI presenter films and voices it for you.
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Presenter picker — AI path only */}
        {path === "ai" && (
        <View style={styles.field}>
          {label("CHOOSE A PRESENTER")}
          <View style={styles.presenterRow}>
            {PRESENTERS.map((p) => {
              const selected = voiceId === p.voiceId;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => {
                    setVoiceId(p.voiceId);
                    setVoiceName(p.voiceName);
                  }}
                  style={[
                    styles.presenter,
                    {
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Image source={{ uri: p.photo }} style={styles.presenterImg} contentFit="cover" />
                  <LinearOverlay />
                  {selected && (
                    <View style={[styles.check, { backgroundColor: colors.primary }]}>
                      <Feather name="check" size={11} color={colors.primaryForeground} />
                    </View>
                  )}
                  <View style={styles.presenterMeta}>
                    <Text style={styles.presenterName}>{p.name}</Text>
                    <Text style={[styles.presenterSpec, { color: colors.primary }]}>
                      {p.specialty}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          {voiceId ? (
            <Text style={[styles.voiceNote, { color: colors.primary }]}>
              ✓ Live ElevenLabs voiceover enabled
            </Text>
          ) : (
            <Text style={[styles.voiceNote, { color: colors.mutedForeground }]}>
              No presenter selected — voiceover will be simulated
            </Text>
          )}
        </View>
        )}

        {/* Photos */}
        <View style={styles.field}>
          {label(
            mode === "photos"
              ? "PROPERTY PHOTOS (REQUIRED)"
              : "PROPERTY PHOTOS (OPTIONAL)",
          )}
          <View style={styles.photoGrid}>
            {photos.map((p) => (
              <View key={p.uri} style={styles.photoItem}>
                <Image source={{ uri: p.uri }} style={styles.photoImg} contentFit="cover" />
                <Pressable
                  onPress={() => removePhoto(p.uri)}
                  style={styles.photoRemoveHit}
                >
                  <View style={styles.photoRemove}>
                    <Feather name="x" size={12} color="#fff" />
                  </View>
                </Pressable>
              </View>
            ))}
            {uploading > 0 &&
              Array.from({ length: uploading }).map((_, i) => (
                <View
                  key={`up-${i}`}
                  style={[
                    styles.photoItem,
                    styles.photoLoading,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <ActivityIndicator color={colors.primary} size="small" />
                </View>
              ))}
            <Pressable
              onPress={pickPhotos}
              style={[
                styles.addPhoto,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="plus" size={22} color={colors.mutedForeground} />
              <Text style={[styles.addPhotoText, { color: colors.mutedForeground }]}>
                Add
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Action */}
        <Pressable
          onPress={path === "self" ? onContinueSelf : onSubmit}
          disabled={submitting || preparing}
          style={({ pressed }) => [
            styles.submit,
            {
              backgroundColor: colors.primary,
              opacity: pressed || submitting || preparing ? 0.85 : 1,
            },
          ]}
        >
          {submitting || preparing ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <>
              <Feather
                name={path === "self" ? "video" : "zap"}
                size={18}
                color={colors.primaryForeground}
              />
              <Text style={[styles.submitText, { color: colors.primaryForeground }]}>
                {path === "self" ? "Start Recording" : "Generate Video"}
              </Text>
            </>
          )}
        </Pressable>
        {path === "self" && (
          <Text style={[styles.actionHint, { color: colors.mutedForeground }]}>
            We’ll write your script, then you read it aloud while the camera rolls.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

function LinearOverlay() {
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "55%",
        backgroundColor: "rgba(7,10,18,0.65)",
      }}
    />
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.5 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, marginTop: 4, marginBottom: 22 },
  toggle: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    marginBottom: 22,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    height: 40,
    borderRadius: 9,
  },
  toggleText: { fontFamily: "Inter_600SemiBold", fontSize: 13.5 },
  field: { marginBottom: 24 },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 9,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 13,
  },
  input: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14.5 },
  tag: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tagText: { fontFamily: "Inter_600SemiBold", fontSize: 10 },
  sample: { fontFamily: "Inter_500Medium", fontSize: 12.5, marginTop: 10 },
  pathRow: { flexDirection: "row", gap: 10 },
  pathCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    padding: 14,
  },
  pathIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  pathTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14.5 },
  pathDesc: { fontFamily: "Inter_400Regular", fontSize: 11.5, marginTop: 3, lineHeight: 16 },
  actionHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 17,
  },
  presenterRow: { flexDirection: "row", gap: 10 },
  presenter: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
  },
  presenterImg: { width: "100%", height: "100%" },
  check: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  presenterMeta: { position: "absolute", left: 8, right: 8, bottom: 8 },
  presenterName: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#fff" },
  presenterSpec: { fontFamily: "Inter_500Medium", fontSize: 9, marginTop: 1 },
  voiceNote: { fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 10 },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoItem: {
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: "hidden",
  },
  photoImg: { width: "100%", height: "100%" },
  photoRemoveHit: { position: "absolute", top: 0, right: 0, padding: 4 },
  photoRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoLoading: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  addPhoto: {
    width: 76,
    height: 76,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  addPhotoText: { fontFamily: "Inter_500Medium", fontSize: 11 },
  submit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    height: 54,
    borderRadius: 14,
    marginTop: 6,
  },
  submitText: { fontFamily: "Inter_700Bold", fontSize: 16 },
});
