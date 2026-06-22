import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { StatusBadge } from "@/components/StatusBadge";
import type { Job } from "@workspace/api-client-react";

export function JobCard({ job }: { job: Job }) {
  const colors = useColors();
  const router = useRouter();

  const title =
    job.listingTitle || job.propertyAddress || job.listingUrl || "Property Video";
  const thumb = job.propertyImages?.[0];

  return (
    <Pressable
      onPress={() => router.push(`/job/${job.id}`)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.thumb, { backgroundColor: colors.secondary }]}>
        {thumb ? (
          <Image source={{ uri: thumb }} style={styles.thumbImg} contentFit="cover" />
        ) : (
          <Feather
            name={job.inputMode === "photos" ? "image" : "link"}
            size={20}
            color={colors.mutedForeground}
          />
        )}
      </View>
      <View style={styles.body}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: colors.foreground }]}
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.sub, { color: colors.mutedForeground }]}
        >
          {job.inputMode === "photos" ? "From photos" : "From listing URL"}
        </Text>
        <View style={styles.badgeRow}>
          <StatusBadge status={job.status} />
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%" },
  body: { flex: 1, gap: 3 },
  title: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 12 },
  badgeRow: { flexDirection: "row", marginTop: 4 },
});
