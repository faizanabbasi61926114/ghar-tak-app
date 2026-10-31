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

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";

function SignInForm() {
  const colors = useColors();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const styles = useThemedStyles(() => StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background },
    logo: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
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
      fontSize: 14,
      color: colors.mutedForeground,
      textAlign: "center" as const,
      fontFamily: "Inter_400Regular",
      marginTop: 6,
      marginBottom: 28,
    },
    input: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    btn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 4,
    },
    btnText: {
      color: colors.primaryForeground,
      fontSize: 15,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
    toggle: { flexDirection: "row", justifyContent: "center", marginTop: 20, gap: 4 },
    toggleText: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    toggleLink: { fontSize: 14, color: colors.primary, fontFamily: "Inter_600SemiBold" },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Feather name="home" size={28} color="#fff" />
      </View>
      <Text style={styles.title}>
        {mode === "signin" ? "Welcome back" : "Create account"}
      </Text>
      <Text style={styles.subtitle}>
        {mode === "signin" ? "Sign in to your Ghar Tak account" : "Join your local hub"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={colors.mutedForeground}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.mutedForeground}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>{mode === "signin" ? "Sign In" : "Create Account"}</Text>
        )}
      </Pressable>
      <View style={styles.toggle}>
        <Text style={styles.toggleText}>
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
        </Text>
        <Pressable onPress={() => setMode(mode === "signin" ? "signup" : "signin")}>
          <Text style={styles.toggleLink}>{mode === "signin" ? "Sign up" : "Sign in"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

interface MenuItem {
  icon: string;
  label: string;
  route?: string;
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, signOut, loading, firebaseReady } = useAuth();
  const isWeb = Platform.OS === "web";

  const styles = useThemedStyles(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: isWeb ? 67 : insets.top + 16,
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    name: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    email: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    section: { paddingHorizontal: 20, marginTop: 24 },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
      textTransform: "uppercase" as const,
      letterSpacing: 1,
      marginBottom: 8,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 14,
    },
    rowLabel: { flex: 1, fontSize: 15, color: colors.foreground, fontFamily: "Inter_400Regular" },
    signOutBtn: {
      marginHorizontal: 20,
      marginTop: 32,
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    signOutText: { fontSize: 15, color: colors.destructive, fontFamily: "Inter_600SemiBold" },
    footer: { height: isWeb ? 34 : insets.bottom + 80 },
  }));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!firebaseReady && !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32, backgroundColor: colors.background }}>
        <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginTop: 16, textAlign: "center" }}>
          Firebase Not Configured
        </Text>
        <Text style={{ fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 8, textAlign: "center", lineHeight: 20 }}>
          Set your EXPO_PUBLIC_FIREBASE_* environment variables to enable sign-in.
        </Text>
      </View>
    );
  }

  if (!user) {
    return <SignInForm />;
  }

  const accountItems: MenuItem[] = [
    { icon: "shopping-bag", label: "My Orders", route: "/orders" },
    { icon: "heart", label: "Favorites", route: "/favorites" },
    { icon: "layout", label: "Provider Dashboard", route: "/dashboard" },
    { icon: "user-plus", label: "Become a Provider", route: "/become-provider" },
    { icon: "map-pin", label: "Saved Addresses" },
    { icon: "bell", label: "Notifications" },
  ];

  const toolItems: MenuItem[] = [
    { icon: "camera", label: "QR Scanner", route: "/qr-scanner" },
    { icon: "image", label: "Image Search", route: "/image-analyzer" },
    { icon: "message-circle", label: "AI Assistant", route: "/chatbot" },
  ];

  const supportItems: MenuItem[] = [
    { icon: "help-circle", label: "Help Center", route: "/support" },
    { icon: "mail", label: "Contact Us", route: "/contact" },
    { icon: "info", label: "About Ghar Tak", route: "/about" },
    { icon: "shield", label: "Privacy Policy" },
  ];

  const renderRow = (item: MenuItem) => (
    <Pressable
      key={item.label}
      style={styles.row}
      onPress={() => {
        if (item.route) router.push(item.route as any);
      }}
    >
      <Feather name={item.icon as any} size={20} color={colors.mutedForeground} />
      <Text style={styles.rowLabel}>{item.label}</Text>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );

  const handleSignOut = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signOut();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Feather name="user" size={32} color="#fff" />
        </View>
        <Text style={styles.name}>{(user as any).displayName ?? user.email}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {accountItems.map(renderRow)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tools</Text>
        {toolItems.map(renderRow)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {supportItems.map(renderRow)}
      </View>

      <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
      <View style={styles.footer} />
    </ScrollView>
  );
}
