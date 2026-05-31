import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

const META: Record<string, { label: string; color: string; bg: string }> = {
  queued: { label: "Queued", color: "#7e89a9", bg: "rgba(126,137,169,0.12)" },
  processing: { label: "Processing", color: "#60a5fa", bg: "rgba(96,165,250,0.14)" },
  complete: { label: "Complete", color: "#c8992d", bg: "rgba(200,153,45,0.14)" },
  failed: { label: "Failed", color: "#f87171", bg: "rgba(248,113,113,0.14)" },
};

export function StatusBadge({ status }: { status: string }) {
  const colors = useColors();
  const meta = META[status] ?? {
    label: status,
    color: colors.mutedForeground,
    bg: colors.secondary,
  };
  return (
    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
      {status === "processing" && (
        <View style={[styles.dot, { backgroundColor: meta.color }]} />
      )}
      <Text style={[styles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});
