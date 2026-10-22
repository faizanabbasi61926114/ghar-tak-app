import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const BENEFITS = [
  { icon: "users", text: "Reach thousands of local customers" },
  { icon: "trending-up", text: "Grow your business with analytics" },
  { icon: "zap", text: "AI-powered customer matching" },
  { icon: "shield", text: "Verified provider badge" },
];

export default function BecomeProviderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");

  const handleApply = async () => {
    if (!businessName || !category || !phone) {
      Alert.alert("Missing fields", "Please fill in all fields to apply.");
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Application Submitted!", "We'll review your application and get back to you within 1-2 business days.");
    setBusinessName(""); setCategory(""); setPhone("");
  };

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
    hero: { margin: 20, borderRadius: 20, padding: 22 },
    heroTitle: { fontSize: 22, fontWeight: "700" as const, color: "#fff", fontFamily: "Inter_700Bold" },
    heroSub: { fontSize: 14, color: "rgba(255,255,255,0.85)", fontFamily: "Inter_400Regular", marginTop: 6, lineHeight: 20 },
    benefitRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 },
    benefitText: { fontSize: 14, color: "rgba(255,255,255,0.9)", fontFamily: "Inter_400Regular" },
    form: { paddingHorizontal: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 16 },
    label: { fontSize: 14, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
    input: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 13,
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    applyBtn: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 4,
    },
    applyBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
    footer: { height: isWeb ? 34 : insets.bottom + 20 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Become a Provider</Text>
      </View>
      <ScrollView>
        <LinearGradient colors={["#7c3aed", "#5b21b6"]} style={styles.hero}>
          <Text style={styles.heroTitle}>Grow your business with Ghar Tak</Text>
          <Text style={styles.heroSub}>Join hundreds of local providers reaching customers in their neighborhood.</Text>
          {BENEFITS.map((b) => (
            <View key={b.text} style={styles.benefitRow}>
              <Feather name={b.icon as any} size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </LinearGradient>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Apply Now</Text>
          <Text style={styles.label}>Business Name</Text>
          <TextInput style={styles.input} value={businessName} onChangeText={setBusinessName} placeholder="Your business name" placeholderTextColor={colors.mutedForeground} />
          <Text style={styles.label}>Service Category</Text>
          <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="e.g. Plumber, Cleaner, Store" placeholderTextColor={colors.mutedForeground} />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+1 (555) 000-0000" placeholderTextColor={colors.mutedForeground} keyboardType="phone-pad" />
          <Pressable style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>Submit Application</Text>
          </Pressable>
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
