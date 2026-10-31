import { useColorScheme } from "react-native";

import colors from "@/constants/colors";

/**
 * Returns the design tokens for the current color scheme.
 *
 * Both palettes are module-level constants so repeated renders share the same
 * object identity. That lets memoised style sheets and React Compiler output
 * stay stable instead of rebuilding on every keystroke.
 */
const PALETTES = {
  light: { ...colors.light, radius: colors.radius },
  dark: { ...colors.dark, radius: colors.radius },
} as const;

export type AppColors = typeof PALETTES.light;

export function useColors(): AppColors {
  const scheme = useColorScheme();
  return scheme === "dark" ? PALETTES.dark : PALETTES.light;
}
