import { useGetJobStats } from "@workspace/api-client-react";
import { Image } from "expo-image";
import React from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/lib/auth";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const stats = useGetJobStats().data;

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "LensFlow Agent";

  function confirmLogout() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => logout() },
    ]);
  }

  const rows: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }[] = [
    {
      icon: "globe",
      label: "Visit lensflow.com.au",
      onPress: () => Linking.openURL("https://www.lensflow.com.au"),
    },
    {
      icon: "help-circle",
      label: "Help & Support",
      onPress: () =>
        Linking.openURL("mailto:support@lensflow.com.au?subject=LensFlow%20Support"),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 110,
          paddingHorizontal: 18,
        }}
      >
        {/* Profile header */}
        <View style={styles.profileHead}>
          {user?.profileImageUrl ? (
            <Image source={{ uri: user.profileImageUrl }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.primary + "22", alignItems: "center", justifyContent: "center" },
              ]}
            >
              <Text style={[styles.avatarLetter, { color: colors.primary }]}>
                {fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={[styles.name, { color: colors.foreground }]}>{fullName}</Text>
          {!!user?.email && (
            <Text style={[styles.email, { color: colors.mutedForeground }]}>
              {user.email}
            </Text>
          )}
        </View>

        {/* Quick stats */}
        <View
          style={[
            styles.statBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Stat label="Videos" value={stats?.complete ?? 0} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Stat label="Scripts" value={stats?.scriptsGenerated ?? 0} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Stat label="Hrs Saved" value={stats?.timeSavedHours ?? 0} colors={colors} />
        </View>

        {/* Links */}
        <View style={styles.section}>
          {rows.map((r) => (
            <Pressable
              key={r.label}
              onPress={r.onPress}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={[styles.rowIcon, { backgroundColor: colors.secondary }]}>
                <Feather name={r.icon} size={16} color={colors.primary} />
              </View>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>
                {r.label}
              </Text>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        {/* Logout */}
        <Pressable
          onPress={confirmLogout}
          style={({ pressed }) => [
            styles.logout,
            { borderColor: colors.destructive + "55", opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="log-out" size={17} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>
            Sign out
          </Text>
        </Pressable>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          LensFlow AI · Mobile
        </Text>
      </ScrollView>
    </View>
  );
}

function Stat({
  label,
  value,
  colors,
}: {
  label: string;
  value: number;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHead: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 84, height: 84, borderRadius: 42, marginBottom: 14 },
  avatarLetter: { fontFamily: "Inter_700Bold", fontSize: 34 },
  name: { fontFamily: "Inter_700Bold", fontSize: 22 },
  email: { fontFamily: "Inter_400Regular", fontSize: 14, marginTop: 3 },
  statBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    marginBottom: 26,
  },
  stat: { flex: 1, alignItems: "center", gap: 3 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 22 },
  statLabel: { fontFamily: "Inter_500Medium", fontSize: 12 },
  divider: { width: StyleSheet.hairlineWidth, height: 34 },
  section: { gap: 10, marginBottom: 26 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 13,
    borderRadius: 13,
    borderWidth: 1,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 15 },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    height: 52,
    borderRadius: 13,
    borderWidth: 1,
  },
  logoutText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  version: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 22,
  },
});
