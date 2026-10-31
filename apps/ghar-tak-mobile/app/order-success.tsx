import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";

export default function OrderSuccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const styles = useThemedStyles(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    },
    circle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "#22c55e20",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 26,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "center" as const,
    },
    subtitle: {
      fontSize: 15,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginTop: 10,
      textAlign: "center" as const,
      lineHeight: 22,
    },
    orderIdText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginTop: 6,
      textAlign: "center" as const,
    },
    primaryBtn: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 15,
      paddingHorizontal: 40,
      marginTop: 32,
      width: "100%" as const,
      alignItems: "center",
    },
    primaryBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
    secondaryBtn: {
      backgroundColor: colors.secondary,
      borderRadius: 14,
      paddingVertical: 15,
      paddingHorizontal: 40,
      marginTop: 12,
      width: "100%" as const,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryBtnText: { color: colors.foreground, fontSize: 16, fontFamily: "Inter_500Medium" },
  }));

  return (
    <View style={[styles.container, { paddingTop: isWeb ? 0 : insets.top }]}>
      <View style={styles.circle}>
        <Feather name="check-circle" size={52} color="#22c55e" />
      </View>
      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.subtitle}>
        Your order has been received. We'll prepare it shortly and deliver it to your address.
      </Text>
      {orderId && (
        <Text style={styles.orderIdText}>Order ID: {orderId.replace("order_", "#")}</Text>
      )}

      <Pressable style={styles.primaryBtn} onPress={() => router.push("/orders" as any)}>
        <Text style={styles.primaryBtnText}>View My Orders</Text>
      </Pressable>
      <Pressable style={styles.secondaryBtn} onPress={() => router.replace("/(tabs)" as any)}>
        <Text style={styles.secondaryBtnText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}
