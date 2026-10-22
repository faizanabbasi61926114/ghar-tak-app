import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const FEATURES = [
  { icon: "map-pin", title: "Hyperlocal Discovery", desc: "Find stores and services within your neighborhood." },
  { icon: "zap", title: "AI-Powered Search", desc: "Search by text or photo and let AI find what you need." },
  { icon: "message-circle", title: "AI Assistant", desc: "Chat with our assistant for personalized recommendations." },
  { icon: "shield", title: "Trusted Providers", desc: "Verified local businesses and service professionals." },
];

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: isWeb ? 67 : insets.top + 12,
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 14,
    },
    backBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    title: { fontSize: 20, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    hero: { margin: 20, borderRadius: 20, padding: 24, alignItems: "center" },
    heroTitle: { fontSize: 28, fontWeight: "700" as const, color: "#fff", fontFamily: "Inter_700Bold", textAlign: "center" as const },
    heroSub: { fontSize: 15, color: "rgba(255,255,255,0.85)", fontFamily: "Inter_400Regular", textAlign: "center" as const, marginTop: 8, lineHeight: 22 },
    section: { paddingHorizontal: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 14 },
    featureCard: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 14,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "#f3e8ff",
      alignItems: "center",
      justifyContent: "center",
    },
    featureTitle: { fontSize: 15, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold" },
    featureDesc: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 3, lineHeight: 18 },
    footer: { height: isWeb ? 34 : insets.bottom + 20 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>About Ghar Tak</Text>
      </View>
      <ScrollView>
        <LinearGradient colors={["#7c3aed", "#5b21b6"]} style={styles.hero}>
          <Text style={styles.heroTitle}>Ghar Tak</Text>
          <Text style={styles.heroSub}>Your hyperlocal hub — connecting you with the best stores and services in your neighborhood.</Text>
        </LinearGradient>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What we offer</Text>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureCard}>
              <View style={styles.iconWrap}>
                <Feather name={f.icon as any} size={20} color="#7c3aed" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
