import { useMemo } from "react";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "./useColors";

/**
 * Memoises a screen's StyleSheet against the inputs it actually depends on:
 * the active palette, the web flag and the safe-area insets.
 *
 * Screens otherwise rebuild their entire style object on every render — which
 * happens on each keystroke in a search field or each cart quantity tap.
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(factory: () => T): T {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { top, bottom, left, right } = insets;

  return useMemo(
    () => StyleSheet.create(factory()),
    // The factory closes over the active theme and insets; those are its only inputs.
    [colors, isWeb, top, bottom, left, right],
  );
}
