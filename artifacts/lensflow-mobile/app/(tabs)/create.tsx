import {
  getGetJobStatsQueryKey,
  getListJobsQueryKey,
  useCreateJob,
  useCreateSelfRecordedJob,
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
import { uploadPhoto, uploadVideo } from "@/lib/api";
import { useColors } from "@/hooks/useColors";

const MUSIC_PRESETS = [
  { id: "uplifting", label: "Uplifting", emoji: "✨", desc: "Bright & positive" },
  { id: "cinematic", label: "Cinematic", emoji: "🎬", desc: "Epic & dramatic" },
  { id: "calm",      label: "Calm",      emoji: "🌿", desc: "Soft & ambient" },
  { id: "corporate", label: "Corporate", emoji: "💼", desc: "Professional" },
] as const;

const BG_BASE = "https://www.lensflow.com.au/api/backgrounds";
const BACKGROUND_PRESETS = [
  { id: "modern-living",    label: "Modern Living",  emoji: "🛋️", url: `${BG_BASE}/modern-living.jpg` },
  { id: "city-view",        label: "City View",       emoji: "🌆", url: `${BG_BASE}/city-view.jpg` },
  { id: "luxury-penthouse", label: "Penthouse",       emoji: "✨", url: `${BG_BASE}/luxury-penthouse.png` },
  { id: "waterfront",       label: "Waterfront",      emoji: "🌊", url: `${BG_BASE}/waterfront.png` },
  { id: "property-tour",    label: "Property Tour",   emoji: "▶️", url: `${BG_BASE}/property-tour.mp4` },
] as const;

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
  const createSelfRecordedJob = useCreateSelfRecordedJob();
  const simulateJob = useSimulateJob();
  const generateScript = useGenerateScript();

  const [mode, setMode] = useState<Mode>("url");
  const [path, setPath] = useState<Path>("self");
  const [outputType, setOutputType] = useState<"presenter" | "voice_photos">("presenter");
  const [listingUrl, setListingUrl] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [voiceName, setVoiceName] = useState("");
  const [musicTrack, setMusicTrack] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [enhancePhotos, setEnhancePhotos] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

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
          backgroundImageUrl: backgroundImageUrl || "",
          voiceId: voiceId || "",
          voiceName: voiceName || "",
          musicTrack: musicTrack || "",
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

  // Upload an existing video from the library, auto-generate the script, and
  // submit it directly via the self-recorded endpoint — bypassing the record screen.
  async function onPickVideo() {
    if (!validateProperty()) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow video library access to upload a recording.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 1,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setVideoUploading(true);
    try {
      const publicUrl = await uploadVideo({
        uri: asset.uri,
        fileName: asset.fileName ?? `video-${Date.now()}.mp4`,
        mimeType: asset.mimeType ?? "video/mp4",
        fileSize: asset.fileSize ?? undefined,
      });
      const { script, title } = await generateScript.mutateAsync({
        data: {
          inputMode: mode,
          listingUrl: mode === "url" ? listingUrl.trim() : undefined,
          propertyAddress: propertyAddress.trim() || undefined,
          propertyImages: photos.map((p) => p.publicUrl),
        },
      });
      const job = await createSelfRecordedJob.mutateAsync({
        data: {
          videoUrl: publicUrl,
          script,
          title: title ?? undefined,
          inputMode: mode,
          listingUrl: mode === "url" ? listingUrl.trim() : undefined,
          propertyAddress: propertyAddress.trim() || undefined,
          propertyImages: photos.map((p) => p.publicUrl),
          voiceId: voiceId || undefined,
          voiceName: voiceName || undefined,
          musicTrack: musicTrack || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetJobStatsQueryKey() });
      router.push(`/job/${job.id}`);
    } catch {
      Alert.alert("Upload Failed", "Could not upload your video. Please try again.");
    } finally {
      setVideoUploading(false);
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
          musicTrack: musicTrack || undefined,
          propertyImages: photos.map((p) => p.publicUrl),
          enhancePhotos: mode === "photos" && enhancePhotos ? true : undefined,
          outputType,
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
      setMusicTrack("");
      setBackgroundImageUrl("");
      setEnhancePhotos(false);

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

        {/* Background picker — self path only */}
        {path === "self" && (
          <View style={styles.field}>
            {label("VIRTUAL BACKGROUND (OPTIONAL)")}
            <View style={styles.musicGrid}>
              {BACKGROUND_PRESETS.map((bg) => {
                const selected = backgroundImageUrl === bg.url;
                return (
                  <Pressable
                    key={bg.id}
                    onPress={() => setBackgroundImageUrl(selected ? "" : bg.url)}
                    style={[
                      styles.musicCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: selected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    {bg.url.endsWith(".mp4") ? (
                      <Text style={styles.musicEmoji}>{bg.emoji}</Text>
                    ) : (
                      <Image
                        source={{ uri: bg.url }}
                        style={styles.bgThumb}
                        contentFit="cover"
                      />
                    )}
                    <Text style={[styles.musicLabel, { color: selected ? colors.primary : colors.foreground }]}>
                      {bg.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {backgroundImageUrl ? (
              <Text style={[styles.voiceNote, { color: colors.primary }]}>
                ✓ {BACKGROUND_PRESETS.find((b) => b.url === backgroundImageUrl)?.label} background selected
              </Text>
            ) : (
              <Text style={[styles.voiceNote, { color: colors.mutedForeground }]}>
                No background — solid dark backdrop
              </Text>
            )}
          </View>
        )}

        {/* Narration voice picker — self path only */}
        {path === "self" && (
          <View style={styles.field}>
            {label("AI NARRATION VOICE (OPTIONAL)")}
            <Text style={[styles.pathDesc, { color: colors.mutedForeground, marginBottom: 10 }]}>
              An AI voice narrates the script over your composed video.
            </Text>
            <View style={styles.presenterRow}>
              {PRESENTERS.map((p) => {
                const selected = voiceId === p.voiceId;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => {
                      setVoiceId(selected ? "" : p.voiceId);
                      setVoiceName(selected ? "" : p.voiceName);
                    }}
                    style={[
                      styles.presenter,
                      { borderColor: selected ? colors.primary : colors.border },
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
                ✓ {voiceName} narrates over your video
              </Text>
            ) : (
              <Text style={[styles.voiceNote, { color: colors.mutedForeground }]}>
                No narration — your recorded voice only
              </Text>
            )}
          </View>
        )}

        {/* Music picker — self path */}
        {path === "self" && (
          <View style={styles.field}>
            {label("BACKGROUND MUSIC (OPTIONAL)")}
            <View style={styles.musicGrid}>
              {MUSIC_PRESETS.map((m) => {
                const selected = musicTrack === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setMusicTrack(selected ? "" : m.id)}
                    style={[
                      styles.musicCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: selected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.musicEmoji}>{m.emoji}</Text>
                    <Text style={[styles.musicLabel, { color: selected ? colors.primary : colors.foreground }]}>
                      {m.label}
                    </Text>
                    <Text style={[styles.musicDesc, { color: colors.mutedForeground }]}>{m.desc}</Text>
                  </Pressable>
                );
              })}
            </View>
            {musicTrack ? (
              <Text style={[styles.voiceNote, { color: colors.primary }]}>
                ✓ {MUSIC_PRESETS.find((m) => m.id === musicTrack)?.label} music added to video
              </Text>
            ) : (
              <Text style={[styles.voiceNote, { color: colors.mutedForeground }]}>
                No music — audio from your recording only
              </Text>
            )}
          </View>
        )}

        {/* Output Type picker — AI path only */}
        {path === "ai" && (
          <View style={styles.field}>
            {label("OUTPUT TYPE")}
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => setOutputType("presenter")}
                style={[
                  styles.pathCard,
                  { flex: 1, backgroundColor: colors.card, borderColor: outputType === "presenter" ? colors.primary : colors.border },
                ]}
              >
                <Feather name="user" size={18} color={outputType === "presenter" ? colors.primary : colors.mutedForeground} />
                <Text style={[styles.pathTitle, { color: outputType === "presenter" ? colors.primary : colors.foreground }]}>
                  AI Presenter
                </Text>
                <Text style={[styles.pathDesc, { color: colors.mutedForeground }]}>
                  HeyGen avatar presents your listing
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOutputType("voice_photos")}
                style={[
                  styles.pathCard,
                  { flex: 1, backgroundColor: colors.card, borderColor: outputType === "voice_photos" ? colors.primary : colors.border },
                ]}
              >
                <Feather name="mic" size={18} color={outputType === "voice_photos" ? colors.primary : colors.mutedForeground} />
                <Text style={[styles.pathTitle, { color: outputType === "voice_photos" ? colors.primary : colors.foreground }]}>
                  Voice + Photos
                </Text>
                <Text style={[styles.pathDesc, { color: colors.mutedForeground }]}>
                  AI narration over photo slideshow
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Presenter picker — AI path, presenter output type only */}
        {path === "ai" && outputType === "presenter" && (
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

        {/* Music picker — AI path only (self path music picker is above) */}
        {path === "ai" && (
          <View style={styles.field}>
            {label("BACKGROUND MUSIC (OPTIONAL)")}
            <View style={styles.musicGrid}>
              {MUSIC_PRESETS.map((m) => {
                const selected = musicTrack === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setMusicTrack(selected ? "" : m.id)}
                    style={[
                      styles.musicCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: selected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.musicEmoji}>{m.emoji}</Text>
                    <Text style={[styles.musicLabel, { color: selected ? colors.primary : colors.foreground }]}>
                      {m.label}
                    </Text>
                    <Text style={[styles.musicDesc, { color: colors.mutedForeground }]}>{m.desc}</Text>
                  </Pressable>
                );
              })}
            </View>
            {musicTrack ? (
              <Text style={[styles.voiceNote, { color: colors.primary }]}>
                ✓ {MUSIC_PRESETS.find((m) => m.id === musicTrack)?.label} music added to video
              </Text>
            ) : (
              <Text style={[styles.voiceNote, { color: colors.mutedForeground }]}>
                No music — voiceover audio only
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

        {/* AI Photo Enhancement toggle — photo mode only */}
        {mode === "photos" && (
          <View style={styles.field}>
            {label("AI PHOTO ENHANCEMENT (OPTIONAL)")}
            <Pressable
              onPress={() => setEnhancePhotos((v) => !v)}
              style={[
                styles.enhanceCard,
                {
                  backgroundColor: colors.card,
                  borderColor: enhancePhotos ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={styles.enhanceEmoji}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.enhanceTitle, { color: enhancePhotos ? colors.primary : colors.foreground }]}>
                  Enhance my photos with AI
                </Text>
                <Text style={[styles.enhanceDesc, { color: colors.mutedForeground }]}>
                  Gemini relights, colour-balances &amp; declutters each photo for a premium listing look
                </Text>
              </View>
              {/* Toggle pill */}
              <View
                style={[
                  styles.togglePill,
                  { backgroundColor: enhancePhotos ? colors.primary : colors.secondary },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    { transform: [{ translateX: enhancePhotos ? 16 : 0 }] },
                  ]}
                />
              </View>
            </Pressable>
            <Text style={[styles.voiceNote, { color: enhancePhotos ? colors.primary : colors.mutedForeground }]}>
              {enhancePhotos
                ? "✓ AI will enhance your photos before compositing"
                : "No enhancement — original photos used directly"}
            </Text>
          </View>
        )}

        {/* Action */}
        <Pressable
          onPress={path === "self" ? onContinueSelf : onSubmit}
          disabled={submitting || preparing || videoUploading}
          style={({ pressed }) => [
            styles.submit,
            {
              backgroundColor: colors.primary,
              opacity: pressed || submitting || preparing || videoUploading ? 0.85 : 1,
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
        {/* Upload existing video — self path only */}
        {path === "self" && (
          <View style={{ alignItems: "center", marginTop: 4 }}>
            <Text style={[styles.voiceNote, { color: colors.mutedForeground, marginBottom: 10 }]}>— or —</Text>
            <Pressable
              onPress={onPickVideo}
              disabled={videoUploading || preparing}
              style={[
                styles.uploadVideoBtn,
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
            >
              {videoUploading ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Feather name="upload" size={16} color={colors.primary} />
              )}
              <Text style={[styles.uploadVideoBtnText, { color: colors.primary }]}>
                {videoUploading ? "Uploading\u2026" : "Upload from Library"}
              </Text>
            </Pressable>
          </View>
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
  uploadVideoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  uploadVideoBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
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
  musicGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  musicCard: {
    width: "47%",
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    gap: 3,
  },
  musicEmoji: { fontSize: 20, lineHeight: 26 },
  musicLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13.5, marginTop: 2 },
  musicDesc: { fontFamily: "Inter_400Regular", fontSize: 11, lineHeight: 15 },
  bgThumb: { width: "100%", height: 54, borderRadius: 6, marginBottom: 4 },
  enhanceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 2,
    padding: 14,
  },
  enhanceEmoji: { fontSize: 22, lineHeight: 28 },
  enhanceTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, marginBottom: 3 },
  enhanceDesc: { fontFamily: "Inter_400Regular", fontSize: 11.5, lineHeight: 16 },
  togglePill: {
    width: 36,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 2,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
