import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
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
import { useData } from "@/context/DataContext";

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const { serviceProviders, serviceCategories } = useData();
  const provider = serviceProviders.find((p) => p.id === id);
  const catName = provider
    ? serviceCategories.find((c) => c.id === provider.serviceCategory)?.name
    : null;

  // Message modal state
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgName, setMsgName] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendMessage = async () => {
    if (!msgName.trim() || !msgEmail.trim() || !msgBody.trim()) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: msgName,
          email: msgEmail,
          message: msgBody,
          providerId: provider?.id,
          providerName: provider?.name,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSent(true);
    } catch {
      Alert.alert("Send Failed", "Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    imageWrap: { position: "relative" as const },
    heroImage: { width: "100%" as const, height: 220 },
    backBtn: {
      position: "absolute" as const,
      top: isWeb ? 67 : insets.top + 8,
      left: 16,
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.4)",
      alignItems: "center", justifyContent: "center",
    },
    content: { padding: 20 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    name: { fontSize: 22, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold", flex: 1 },
    badge: {
      backgroundColor: colors.primary + "20", borderRadius: 12,
      paddingHorizontal: 10, paddingVertical: 4, marginBottom: 14,
      alignSelf: "flex-start" as const,
    },
    badgeText: { fontSize: 12, color: colors.primary, fontFamily: "Inter_600SemiBold" },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    ratingText: { fontSize: 15, fontWeight: "600" as const, color: "#f59e0b", fontFamily: "Inter_600SemiBold" },
    desc: { fontSize: 14, color: colors.mutedForeground, lineHeight: 20, fontFamily: "Inter_400Regular", marginBottom: 20 },
    infoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
    infoText: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", flex: 1 },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 20 },
    btnRow: { flexDirection: "row", gap: 12, marginTop: 8 },
    primaryBtn: {
      flex: 1, backgroundColor: colors.primary, borderRadius: 14,
      paddingVertical: 14, alignItems: "center",
    },
    primaryBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
    secondaryBtn: {
      flex: 1, backgroundColor: colors.secondary, borderRadius: 14,
      paddingVertical: 14, alignItems: "center",
      borderWidth: 1, borderColor: colors.border,
    },
    secondaryBtnText: { fontSize: 15, color: colors.foreground, fontFamily: "Inter_600SemiBold" },
    footer: { height: isWeb ? 34 : insets.bottom + 20 },
    // Modal styles
    modalOverlay: {
      flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20, borderTopRightRadius: 20,
      padding: 24, paddingBottom: isWeb ? 32 : insets.bottom + 24,
    },
    modalHandle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: colors.border, alignSelf: "center", marginBottom: 16,
    },
    modalTitle: { fontSize: 18, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 4 },
    modalSub: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginBottom: 20 },
    label: { fontSize: 13, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 5 },
    input: {
      backgroundColor: colors.secondary,
      borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11,
      fontSize: 14, color: colors.foreground, fontFamily: "Inter_400Regular",
      marginBottom: 14, borderWidth: 1, borderColor: colors.border,
    },
    textArea: { height: 90, textAlignVertical: "top" as const },
    sendBtn: {
      backgroundColor: colors.primary, borderRadius: 12,
      paddingVertical: 14, alignItems: "center",
      flexDirection: "row", justifyContent: "center", gap: 8,
    },
    sendBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
    successBox: { alignItems: "center", padding: 24, gap: 10 },
    successTitle: { fontSize: 18, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    successSub: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "center" as const },
    closeBtn: {
      marginTop: 8, paddingVertical: 10, paddingHorizontal: 28,
      borderRadius: 10, borderWidth: 1, borderColor: colors.border,
    },
    closeBtnText: { fontSize: 14, color: colors.foreground, fontFamily: "Inter_500Medium" },
    errorBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40, gap: 16 },
    errorText: { fontSize: 18, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold" },
  });

  if (!provider) {
    return (
      <View style={styles.errorBox}>
        <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
        <Text style={styles.errorText}>Provider not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontFamily: "Inter_500Medium" }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: provider.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.name}>{provider.name}</Text>
            <View style={styles.ratingRow}>
              <Feather name="star" size={18} color="#f59e0b" />
              <Text style={styles.ratingText}>{Number(provider.rating ?? 0).toFixed(1)}</Text>
            </View>
          </View>

          {catName && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{catName}</Text>
            </View>
          )}

          {provider.description ? <Text style={styles.desc}>{provider.description}</Text> : null}

          <View style={styles.infoRow}>
            <Feather name="map-pin" size={18} color={colors.primary} />
            <Text style={styles.infoText}>{provider.location.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="clock" size={18} color="#16a34a" />
            <Text style={styles.infoText}>{provider.availability}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.btnRow}>
            <Pressable
              style={styles.primaryBtn}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                Alert.alert("Booking", "Booking flow coming soon!");
              }}
            >
              <Text style={styles.primaryBtnText}>Book Now</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSent(false);
                setMsgOpen(true);
              }}
            >
              <Text style={styles.secondaryBtnText}>Message</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.footer} />
      </ScrollView>

      {/* Message bottom sheet */}
      <Modal visible={msgOpen} transparent animationType="slide" onRequestClose={() => setMsgOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={() => setMsgOpen(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            {sent ? (
              <View style={styles.successBox}>
                <Feather name="check-circle" size={52} color="#22c55e" />
                <Text style={styles.successTitle}>Message Sent!</Text>
                <Text style={styles.successSub}>The provider will get back to you soon.</Text>
                <Pressable style={styles.closeBtn} onPress={() => setMsgOpen(false)}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>Message {provider.name}</Text>
                <Text style={styles.modalSub}>Your message will be forwarded to the provider.</Text>
                <Text style={styles.label}>Your Name</Text>
                <TextInput style={styles.input} value={msgName} onChangeText={setMsgName} placeholder="Full name" placeholderTextColor={colors.mutedForeground} />
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={msgEmail} onChangeText={setMsgEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.mutedForeground} />
                <Text style={styles.label}>Message</Text>
                <TextInput style={[styles.input, styles.textArea]} value={msgBody} onChangeText={setMsgBody} placeholder={`Hi ${provider.name}, I'd like to enquire about...`} multiline placeholderTextColor={colors.mutedForeground} />
                <Pressable style={styles.sendBtn} onPress={handleSendMessage} disabled={sending}>
                  {sending
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Feather name="send" size={16} color="#fff" />
                  }
                  <Text style={styles.sendBtnText}>{sending ? "Sending…" : "Send Message"}</Text>
                </Pressable>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
