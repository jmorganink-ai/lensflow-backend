import { useGetJobStats, useListJobs } from "@workspace/api-client-react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { JobCard } from "@/components/JobCard";
import { useAuth } from "@/lib/auth";
import { useColors } from "@/hooks/useColors";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const statsQuery = useGetJobStats();
  const jobsQuery = useListJobs();

  const stats = statsQuery.data;
  const jobs = jobsQuery.data ?? [];

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([statsQuery.refetch(), jobsQuery.refetch()]);
    setRefreshing(false);
  }

  const firstName = user?.firstName || "there";

  const statCards = [
    { label: "Completed", value: stats?.complete ?? 0, icon: "check-circle" },
    { label: "Scripts", value: stats?.scriptsGenerated ?? 0, icon: "edit-3" },
    { label: "Hours Saved", value: stats?.timeSavedHours ?? 0, icon: "clock" },
    { label: "Failed", value: stats?.failed ?? 0, icon: "alert-triangle" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 18,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              Welcome back
            </Text>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {firstName} 👋
            </Text>
          </View>
          <View
            style={[
              styles.logoDot,
              { borderColor: colors.primary + "33", backgroundColor: colors.primary + "1a" },
            ]}
          >
            <Feather name="aperture" size={20} color={colors.primary} />
          </View>
        </View>

        {/* Primary CTA */}
        <Pressable
          onPress={() => router.push("/create")}
          style={({ pressed }) => [styles.ctaWrap, { opacity: pressed ? 0.9 : 1 }]}
        >
          <LinearGradient
            colors={["#d9ad3f", "#c8992d"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            <View style={styles.ctaIcon}>
              <Feather name="plus" size={22} color={colors.primaryForeground} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.ctaTitle, { color: colors.primaryForeground }]}>
                Create a new video
              </Text>
              <Text style={[styles.ctaSub, { color: "rgba(10,14,26,0.7)" }]}>
                From a listing URL or your photos
              </Text>
            </View>
            <Feather name="arrow-right" size={20} color={colors.primaryForeground} />
          </LinearGradient>
        </Pressable>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {statCards.map((s) => (
            <View
              key={s.label}
              style={[
                styles.statCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name={s.icon as any} size={16} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {statsQuery.isLoading ? "—" : s.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* My Videos */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            My Videos
          </Text>
          {jobs.length > 0 && (
            <Text style={[styles.count, { color: colors.mutedForeground }]}>
              {jobs.length}
            </Text>
          )}
        </View>

        {jobsQuery.isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
        ) : jobs.length === 0 ? (
          <View
            style={[
              styles.empty,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name="film" size={26} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No videos yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Tap “Create a new video” to run your first pipeline.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: { fontFamily: "Inter_400Regular", fontSize: 13 },
  name: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.5 },
  logoDot: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  ctaWrap: { marginBottom: 22 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
  },
  ctaIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(10,14,26,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTitle: { fontFamily: "Inter_700Bold", fontSize: 17 },
  ctaSub: { fontFamily: "Inter_500Medium", fontSize: 12.5, marginTop: 2 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 26,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: "47%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 24 },
  statLabel: { fontFamily: "Inter_500Medium", fontSize: 12 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18 },
  count: { fontFamily: "Inter_500Medium", fontSize: 14 },
  empty: {
    alignItems: "center",
    gap: 8,
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});
