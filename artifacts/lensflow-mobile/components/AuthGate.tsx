import { LinearGradient } from "expo-linear-gradient";
import React, { type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/lib/auth";
import { useColors } from "@/hooks/useColors";

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, login } = useAuth();
  const colors = useColors();

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#0a0e1a", "#070a12"]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.loginContainer}>
        <View style={styles.loginInner}>
          <View
            style={[
              styles.logoBadge,
              { backgroundColor: colors.primary + "1a", borderColor: colors.primary + "33" },
            ]}
          >
            <Feather name="aperture" size={34} color={colors.primary} />
          </View>
          <Text style={[styles.brand, { color: colors.foreground }]}>LensFlow AI</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            Turn any property listing into a polished AI presenter video — in one tap.
          </Text>

          <View style={styles.features}>
            {[
              { icon: "edit-3", label: "AI scripts written by Claude" },
              { icon: "mic", label: "Studio-grade ElevenLabs voiceover" },
              { icon: "video", label: "Photoreal presenter video" },
            ].map((f) => (
              <View key={f.label} style={styles.featureRow}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: colors.primary + "14" },
                  ]}
                >
                  <Feather name={f.icon as any} size={15} color={colors.primary} />
                </View>
                <Text style={[styles.featureText, { color: colors.foreground }]}>
                  {f.label}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={login}
            style={({ pressed }) => [
              styles.loginButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="log-in" size={18} color={colors.primaryForeground} />
            <Text style={[styles.loginButtonText, { color: colors.primaryForeground }]}>
              Sign in to continue
            </Text>
          </Pressable>
          <Text style={[styles.legal, { color: colors.mutedForeground }]}>
            Secure sign-in · LensFlow
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loginContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
  loginInner: { alignItems: "center" },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 20,
  },
  brand: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  tagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 320,
  },
  features: { alignSelf: "stretch", gap: 14, marginBottom: 36 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { fontFamily: "Inter_500Medium", fontSize: 15, flex: 1 },
  loginButton: {
    alignSelf: "stretch",
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loginButtonText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  legal: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 16,
  },
});
