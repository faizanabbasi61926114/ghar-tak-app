import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors, type AppColors } from "@/hooks/useColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ApiError, getChatbotResponse } from "@/lib/api";

type Destination = { pathname: string; params?: Record<string, string> };

function parseQRCode(data: string): Destination | null {
  if (data.includes("store/")) {
    const id = data.split("store/")[1]?.split(/[^a-z0-9_-]/i)[0] ?? "";
    return id ? { pathname: "/store/[id]", params: { id } } : null;
  }
  if (data.includes("provider/")) {
    const id = data.split("provider/")[1]?.split(/[^a-z0-9_-]/i)[0] ?? "";
    return id ? { pathname: "/provider/[id]", params: { id } } : null;
  }
  if (data.includes("service/")) {
    const category = data.split("service/")[1]?.split(/[^a-z0-9_-]/i)[0] ?? "";
    return category ? { pathname: "/service/[category]", params: { category } } : null;
  }
  return null;
}

function UnknownCodeCard({
  code,
  colors,
  onScanAgain,
}: {
  code: string;
  colors: AppColors;
  onScanAgain?: () => void;
}) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askAI = async () => {
    setAsking(true);
    setError(null);
    try {
      const reply = await getChatbotResponse(
        `A user scanned a QR code that contains: "${code.slice(0, 500)}". In at most two short sentences, explain what this QR code likely contains or is used for. If it is a website link, mention which site it points to.`,
      );
      setAnswer(reply);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't ask the assistant. Please try again.");
    } finally {
      setAsking(false);
    }
  };

  const styles = useThemedStyles(() => StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      gap: 12,
    },
    label: {
      fontSize: 12,
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
      textTransform: "uppercase" as const,
      letterSpacing: 1,
    },
    code: { fontSize: 15, color: colors.foreground, fontFamily: "Inter_500Medium" },
    actions: { flexDirection: "row", gap: 10 },
    primaryBtn: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
    },
    primaryText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
    secondaryBtn: {
      flex: 1,
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
    },
    secondaryText: { color: colors.foreground, fontSize: 14, fontFamily: "Inter_600SemiBold" },
    answer: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      padding: 12,
      fontSize: 14,
      lineHeight: 20,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
    },
    error: { fontSize: 13, color: colors.destructive, fontFamily: "Inter_400Regular" },
    rescan: { alignSelf: "center", paddingVertical: 4 },
    rescanText: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_500Medium" },
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Unrecognized QR code</Text>
      <Text style={styles.code} numberOfLines={3}>{code}</Text>
      <View style={styles.actions}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push({ pathname: "/search", params: { q: code } })}
        >
          <Feather name="search" size={15} color="#fff" />
          <Text style={styles.primaryText}>Search Ghar Tak</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={askAI} disabled={asking}>
          {asking ? (
            <ActivityIndicator size="small" color={colors.foreground} />
          ) : (
            <>
              <Feather name="cpu" size={15} color={colors.foreground} />
              <Text style={styles.secondaryText}>Ask AI</Text>
            </>
          )}
        </Pressable>
      </View>
      {answer && <Text style={styles.answer}>{answer}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {onScanAgain && (
        <Pressable style={styles.rescan} onPress={onScanAgain}>
          <Text style={styles.rescanText}>Scan another code</Text>
        </Pressable>
      )}
    </View>
  );
}

function WebFallback({ colors, insets }: { colors: AppColors; insets: { top: number; bottom: number } }) {
  const [manualCode, setManualCode] = useState("");
  const [unknownCode, setUnknownCode] = useState<string | null>(null);

  const submit = (raw: string) => {
    const code = raw.trim();
    if (!code) return;
    const destination = parseQRCode(code);
    if (destination) {
      router.push(destination as any);
      return;
    }
    setUnknownCode(code);
  };

  const styles = useThemedStyles(() => StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 67,
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
    body: { flexGrow: 1, padding: 24, justifyContent: "center", gap: 16 },
    notice: {
      backgroundColor: colors.secondary,
      borderRadius: 14,
      padding: 20,
      alignItems: "center",
      gap: 12,
      marginBottom: 8,
    },
    noticeText: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "center" as const },
    label: { fontSize: 14, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
    row: { flexDirection: "row", gap: 10 },
    input: {
      flex: 1,
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 13,
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      borderWidth: 1,
      borderColor: colors.border,
    },
    goBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    goBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
    footer: { height: insets.bottom + 20 },
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>QR Scanner</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.notice}>
          <Feather name="monitor" size={36} color={colors.mutedForeground} />
          <Text style={styles.noticeText}>
            Camera scanning is available on iOS and Android via the Expo Go app. On web, enter a code manually.
          </Text>
        </View>
        <View>
          <Text style={styles.label}>Enter Code Manually</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={manualCode}
              onChangeText={setManualCode}
              placeholder="e.g. store/store1"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={() => submit(manualCode)}
            />
            <Pressable style={styles.goBtn} onPress={() => submit(manualCode)}>
              <Text style={styles.goBtnText}>Go</Text>
            </Pressable>
          </View>
        </View>
        {unknownCode && (
          <UnknownCodeCard
            code={unknownCode}
            colors={colors}
            onScanAgain={() => setUnknownCode(null)}
          />
        )}
      </ScrollView>
      <View style={styles.footer} />
    </View>
  );
}

export default function QRScannerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [unknownCode, setUnknownCode] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const isWeb = Platform.OS === "web";

  if (isWeb) {
    return <WebFallback colors={colors} insets={insets} />;
  }

  const handleCode = async (data: string, haptic: boolean) => {
    const destination = parseQRCode(data);
    if (haptic) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (destination) {
      router.push(destination as any);
      return;
    }
    setScanned(true);
    setUnknownCode(data);
  };

  const rescan = () => {
    setScanned(false);
    setUnknownCode(null);
  };

  const styles = useThemedStyles(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    camera: { flex: 1 },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
    },
    topBar: {
      position: "absolute" as const,
      top: insets.top + 8,
      left: 16,
      right: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    backBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
    titleWrap: { flex: 1 },
    title: { fontSize: 18, fontWeight: "700" as const, color: "#fff", fontFamily: "Inter_700Bold" },
    subtitle: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" },
    frame: {
      width: 240,
      height: 240,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: "#7c3aed",
      backgroundColor: "transparent",
    },
    hint: {
      position: "absolute" as const,
      bottom: insets.bottom + 120,
      left: 20,
      right: 20,
      alignItems: "center",
    },
    hintText: { fontSize: 14, color: "rgba(255,255,255,0.8)", fontFamily: "Inter_400Regular", textAlign: "center" as const },
    manualSection: {
      position: "absolute" as const,
      bottom: insets.bottom + 16,
      left: 16,
      right: 16,
      flexDirection: "row",
      gap: 10,
    },
    input: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 13,
      fontSize: 15,
      color: "#fff",
      fontFamily: "Inter_400Regular",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
    },
    goBtn: {
      backgroundColor: "#7c3aed",
      borderRadius: 12,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    goBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
    resultOverlay: {
      position: "absolute" as const,
      bottom: insets.bottom + 16,
      left: 16,
      right: 16,
    },
    permContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, backgroundColor: colors.background },
    permTitle: { fontSize: 20, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold", marginTop: 16, textAlign: "center" as const },
    permSub: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 8, textAlign: "center" as const },
    permBtn: {
      marginTop: 24,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 32,
      alignItems: "center",
    },
    permBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  }));

  if (!permission) {
    return (
      <View style={styles.permContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permContainer}>
        <Feather name="camera-off" size={48} color={colors.mutedForeground} />
        <Text style={styles.permTitle}>Camera Permission Required</Text>
        <Text style={styles.permSub}>Allow camera access to scan QR codes.</Text>
        <Pressable style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Allow Camera</Text>
        </Pressable>
        <Pressable style={{ marginTop: 12 }} onPress={() => router.back()}>
          <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : ({ data }) => handleCode(data, true)}
      >
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color="#fff" />
            </Pressable>
            <View style={styles.titleWrap}>
              <Text style={styles.title}>QR Scanner</Text>
              <Text style={styles.subtitle}>Point at a Ghar Tak QR code</Text>
            </View>
          </View>

          {!unknownCode && (
            <>
              <View style={styles.frame} />

              <View style={styles.hint}>
                <Text style={styles.hintText}>Or enter a code manually below</Text>
              </View>

              <View style={styles.manualSection}>
                <TextInput
                  style={styles.input}
                  value={manualCode}
                  onChangeText={setManualCode}
                  placeholder="e.g. store/store1"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  autoCapitalize="none"
                  returnKeyType="go"
                  onSubmitEditing={() => {
                    const code = manualCode.trim();
                    if (code) handleCode(code, false);
                  }}
                />
                <Pressable
                  style={styles.goBtn}
                  onPress={() => {
                    const code = manualCode.trim();
                    if (code) handleCode(code, false);
                  }}
                >
                  <Text style={styles.goBtnText}>Go</Text>
                </Pressable>
              </View>
            </>
          )}

          {unknownCode && (
            <View style={styles.resultOverlay}>
              <UnknownCodeCard code={unknownCode} colors={colors} onScanAgain={rescan} />
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}
