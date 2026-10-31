import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { describeImage } from "@/lib/api";

export default function ImageAnalyzerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Camera roll access is needed to pick photos.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      base64: true,
      quality: 0.7,
    });
    if (!res.canceled && res.assets[0]) {
      const asset = res.assets[0];
      setImageUri(asset.uri);
      setResult(null);
      setError(null);
      if (asset.base64) {
        await analyzeImage(`data:image/jpeg;base64,${asset.base64}`);
      }
    }
  };

  const analyzeImage = async (dataUri: string) => {
    setLoading(true);
    setError(null);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const description = await describeImage(dataUri);
      setResult(description);
    } catch {
      setError("Could not analyze image. Make sure the API server is running.");
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
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    title: { fontSize: 20, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    content: { flex: 1, padding: 20 },
    uploadArea: {
      borderRadius: 16,
      borderWidth: 2,
      borderStyle: "dashed" as const,
      borderColor: colors.border,
      padding: 32,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.secondary,
      gap: 12,
    },
    uploadText: { fontSize: 15, color: colors.mutedForeground, fontFamily: "Inter_500Medium" },
    uploadSub: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "center" as const },
    image: { width: "100%" as const, height: 240, borderRadius: 16, marginBottom: 20 },
    analyzeBtn: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    analyzeBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
    resultCard: {
      backgroundColor: "#f3e8ff",
      borderRadius: 14,
      padding: 16,
      marginTop: 20,
    },
    resultLabel: { fontSize: 12, color: "#7c3aed", fontFamily: "Inter_600SemiBold", textTransform: "uppercase" as const, letterSpacing: 1 },
    resultText: { fontSize: 16, color: "#18181b", fontFamily: "Inter_600SemiBold", marginTop: 6 },
    searchBtn: {
      backgroundColor: "#7c3aed",
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 12,
    },
    searchBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
    errorText: { color: colors.destructive, fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 16, textAlign: "center" as const },
    footer: { height: isWeb ? 34 : insets.bottom + 20 },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Image Search</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            <Pressable style={styles.analyzeBtn} onPress={pickImage} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="refresh-cw" size={16} color="#fff" />
                  <Text style={styles.analyzeBtnText}>Choose Another</Text>
                </>
              )}
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.uploadArea} onPress={pickImage}>
            <Feather name="camera" size={40} color={colors.primary} />
            <Text style={styles.uploadText}>Tap to choose an image</Text>
            <Text style={styles.uploadSub}>Our AI will identify products and find them for you</Text>
          </Pressable>
        )}

        {loading && (
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <ActivityIndicator color={colors.primary} />
            <Text style={{ color: colors.mutedForeground, marginTop: 8, fontFamily: "Inter_400Regular" }}>
              Analyzing image...
            </Text>
          </View>
        )}

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Description</Text>
            <Text style={styles.resultText}>{result}</Text>
            <Pressable
              style={styles.searchBtn}
              onPress={() => {
                router.push({ pathname: "/search", params: { q: result } });
              }}
            >
              <Text style={styles.searchBtnText}>Search for this</Text>
            </Pressable>
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
