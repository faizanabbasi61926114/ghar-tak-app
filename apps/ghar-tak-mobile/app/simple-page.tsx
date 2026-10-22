import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function SimplePageScreen() {
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
    title: { fontSize: 20, fontWeight: "700" as const, color: colors.primary, fontFamily: "Inter_700Bold" },
    content: { padding: 24 },
    heading: { fontSize: 26, fontWeight: "700" as const, color: colors.primary, fontFamily: "Inter_700Bold", marginBottom: 20 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    para: { fontSize: 15, color: colors.foreground, fontFamily: "Inter_400Regular", lineHeight: 24 },
    code: {
      fontFamily: "Inter_500Medium",
      backgroundColor: colors.secondary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
      color: colors.primary,
    },
    footer: { height: isWeb ? 34 : insets.bottom + 20 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>A Simple Page</Text>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.heading}>A Simple Page</Text>
          <View style={styles.card}>
            <Text style={styles.para}>
              This is a simple page rendered as a React Native screen in the Ghar Tak mobile app at the <Text style={styles.code}>/simple-page</Text> route.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.para}>
              In this Expo/React Native application, pages are created using React components and file-based routing powered by Expo Router — similar to Next.js Pages Router.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.para}>
              Every file inside the <Text style={styles.code}>app/</Text> directory automatically becomes a navigable route. Shared layouts are defined in <Text style={styles.code}>_layout.tsx</Text> files.
            </Text>
          </View>
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
