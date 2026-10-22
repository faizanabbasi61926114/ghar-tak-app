import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useData } from "@/context/DataContext";

export default function ServiceCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const { serviceCategories, serviceProviders } = useData();
  const cat = serviceCategories.find((c) => c.id === category);
  const providers = serviceProviders.filter((p) => p.serviceCategory === category);

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
    title: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    list: { padding: 16 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#f3e8ff",
      alignItems: "center",
      justifyContent: "center",
    },
    info: { flex: 1 },
    name: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    desc: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginTop: 3,
      lineHeight: 18,
    },
    meta: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 },
    metaText: { fontSize: 12, color: colors.foreground, fontFamily: "Inter_500Medium" },
    metaMuted: { fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    availability: {
      fontSize: 12,
      color: "#16a34a",
      fontFamily: "Inter_500Medium",
      marginTop: 4,
    },
    empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60 },
    emptyText: { fontSize: 16, color: colors.mutedForeground, fontFamily: "Inter_500Medium", marginTop: 12 },
    footer: { height: isWeb ? 34 : insets.bottom + 20 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>{cat?.name ?? "Service Providers"}</Text>
      </View>

      {providers.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="users" size={40} color={colors.mutedForeground} />
          <Text style={styles.emptyText}>No providers in this category</Text>
        </View>
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          scrollEnabled={!!providers.length}
          ListFooterComponent={<View style={styles.footer} />}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({ pathname: "/provider/[id]", params: { id: item.id } })
              }
            >
              <View style={styles.avatar}>
                <Feather name="user" size={26} color={colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.meta}>
                  <Feather name="star" size={12} color="#f59e0b" />
                  <Text style={styles.metaText}>{item.rating}</Text>
                  <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                  <Text style={styles.metaMuted}>{item.location.address}</Text>
                </View>
                <Text style={styles.availability}>{item.availability}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
