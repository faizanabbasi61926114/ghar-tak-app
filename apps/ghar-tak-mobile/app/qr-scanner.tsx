import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";

function parseQRCode(data: string): { pathname: string; params?: Record<string, string> } | null {
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
  return { pathname: "/search", params: { q: data } };
}

function WebFallback({ colors, insets }: { colors: ReturnType<typeof useColors>; insets: ReturnType<typeof import("react-native-safe-area-context").useSafeAreaInsets> }) {
  const [manualCode, setManualCode] = useState("");

  const handleManual = () => {
    const code = manualCode.trim();
    if (!code) return;
    const destination = parseQRCode(code);
    if (destination) router.push(destination as any);
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
    body: { flex: 1, padding: 24, justifyContent: "center" },
    notice: {
      backgroundColor: colors.secondary,
      borderRadius: 14,
      padding: 20,
      alignItems: "center",
      gap: 12,
      marginBottom: 24,
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
    footer: { height: 34 },
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>QR Scanner</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.notice}>
          <Feather name="monitor" size={36} color={colors.mutedForeground} />
          <Text style={styles.noticeText}>
            Camera scanning is available on iOS and Android via the Expo Go app. On web, enter a code manually.
          </Text>
        </View>
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
            onSubmitEditing={handleManual}
          />
          <Pressable style={styles.goBtn} onPress={handleManual}>
            <Text style={styles.goBtnText}>Go</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.footer} />
    </View>
  );
}

export default function QRScannerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const isWeb = Platform.OS === "web";

  if (isWeb) {
    return <WebFallback colors={colors} insets={insets} />;
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const destination = parseQRCode(data);
    if (destination) {
      router.push(destination as any);
    }
  };

  const handleManual = () => {
    const code = manualCode.trim();
    if (!code) return;
    const destination = parseQRCode(code);
    if (destination) router.push(destination as any);
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
    rescanBtn: {
      backgroundColor: "#7c3aed",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      marginTop: 20,
    },
    rescanText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
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
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
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

          <View style={styles.frame} />

          {scanned && (
            <Pressable style={styles.rescanBtn} onPress={() => setScanned(false)}>
              <Text style={styles.rescanText}>Tap to Scan Again</Text>
            </Pressable>
          )}

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
              onSubmitEditing={handleManual}
            />
            <Pressable style={styles.goBtn} onPress={handleManual}>
              <Text style={styles.goBtnText}>Go</Text>
            </Pressable>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
