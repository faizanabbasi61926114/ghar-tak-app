import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";

const FAQS = [
  { q: "How do I place an order?", a: "Browse stores on the Stores tab, tap a store, then select products and tap 'Browse & Order'." },
  { q: "How does AI image search work?", a: "Open Image Search from the Home screen, take or upload a photo, and our AI will identify products and search for them." },
  { q: "How do I become a provider?", a: "Tap 'Become a Provider' in your profile and fill in your business details. Approval takes 1-2 business days." },
  { q: "Can I track my order?", a: "Order tracking is coming soon. You'll receive push notifications when your order status changes." },
  { q: "How do I contact a service provider?", a: "Open any provider's detail page and tap the 'Message' button to start a conversation." },
];

export default function SupportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const styles = useThemedStyles(() => StyleSheet.create({
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
    content: { padding: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 14 },
    faqItem: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    faqHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 14,
      gap: 12,
    },
    faqQ: { flex: 1, fontSize: 14, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold" },
    faqA: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", lineHeight: 20, padding: 14, paddingTop: 0 },
    quickHelp: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 24,
    },
    helpCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      alignItems: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    helpLabel: { fontSize: 13, color: colors.foreground, fontFamily: "Inter_500Medium", textAlign: "center" as const },
    footer: { height: isWeb ? 34 : insets.bottom + 20 },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Help & Support</Text>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.quickHelp}>
            <Pressable style={styles.helpCard} onPress={() => router.push("/contact")}>
              <Feather name="mail" size={22} color={colors.primary} />
              <Text style={styles.helpLabel}>Email Us</Text>
            </Pressable>
            <Pressable style={styles.helpCard} onPress={() => router.push("/chatbot")}>
              <Feather name="message-circle" size={22} color="#2563eb" />
              <Text style={styles.helpLabel}>AI Chat</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQS.map((faq, i) => (
            <Pressable key={i} style={styles.faqItem} onPress={() => setOpenFaq(openFaq === i ? null : i)}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQ}>{faq.q}</Text>
                <Feather name={openFaq === i ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedForeground} />
              </View>
              {openFaq === i && <Text style={styles.faqA}>{faq.a}</Text>}
            </Pressable>
          ))}
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
