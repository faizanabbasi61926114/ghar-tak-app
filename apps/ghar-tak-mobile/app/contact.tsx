import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { getBaseUrl } from "@/lib/api";

export default function ContactScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert("Missing fields", "Please fill in all fields before sending.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${getBaseUrl()}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Failed");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSent(true);
      setName(""); setEmail(""); setMessage("");
    } catch {
      Alert.alert("Send Failed", "Could not send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      width: 38, height: 38, borderRadius: 19,
      backgroundColor: colors.secondary,
      alignItems: "center", justifyContent: "center",
    },
    title: { fontSize: 20, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    content: { padding: 20 },
    subtitle: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginBottom: 24, lineHeight: 20 },
    label: { fontSize: 14, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
    input: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingHorizontal: 16, paddingVertical: 13,
      fontSize: 15, color: colors.foreground,
      fontFamily: "Inter_400Regular", marginBottom: 16,
      borderWidth: 1, borderColor: colors.border,
    },
    textArea: { height: 120, textAlignVertical: "top" as const },
    sendBtn: {
      backgroundColor: loading ? colors.mutedForeground : colors.primary,
      borderRadius: 14, paddingVertical: 15,
      alignItems: "center", marginTop: 4, flexDirection: "row" as const, justifyContent: "center",
    },
    sendBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold", marginLeft: 6 },
    contactRow: {
      flexDirection: "row", alignItems: "center", gap: 12,
      paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    contactText: { fontSize: 14, color: colors.foreground, fontFamily: "Inter_400Regular" },
    footer: { height: isWeb ? 34 : insets.bottom + 20 },
    successBox: { alignItems: "center", padding: 32, gap: 12 },
    successTitle: { fontSize: 18, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    successSub: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "center" as const },
    anotherBtn: {
      marginTop: 8, paddingVertical: 10, paddingHorizontal: 24,
      borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    },
    anotherBtnText: { fontSize: 14, color: colors.foreground, fontFamily: "Inter_500Medium" },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Contact Us</Text>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Have a question or feedback? We'd love to hear from you.</Text>

          <View style={{ marginBottom: 24 }}>
            {[
              { icon: "mail", text: "support@gharak.app" },
              { icon: "phone", text: "+92 331 5033761" },
              { icon: "map-pin", text: "241-B, B Block, Jubilee Town, Lahore" },
            ].map((item) => (
              <View key={item.text} style={styles.contactRow}>
                <Feather name={item.icon as any} size={18} color={colors.primary} />
                <Text style={styles.contactText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {sent ? (
            <View style={styles.successBox}>
              <Feather name="check-circle" size={56} color="#22c55e" />
              <Text style={styles.successTitle}>Message Sent!</Text>
              <Text style={styles.successSub}>We'll get back to you within 24 hours.</Text>
              <Pressable style={styles.anotherBtn} onPress={() => setSent(false)}>
                <Text style={styles.anotherBtnText}>Send another</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.label}>Your Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={colors.mutedForeground} />
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={colors.mutedForeground} keyboardType="email-address" autoCapitalize="none" />
              <Text style={styles.label}>Message</Text>
              <TextInput style={[styles.input, styles.textArea]} value={message} onChangeText={setMessage} placeholder="How can we help?" placeholderTextColor={colors.mutedForeground} multiline />
              <Pressable style={styles.sendBtn} onPress={handleSend} disabled={loading}>
                {loading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Feather name="send" size={16} color="#fff" />
                }
                <Text style={styles.sendBtnText}>{loading ? "Sending…" : "Send Message"}</Text>
              </Pressable>
            </>
          )}
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
