import * as Haptics from "expo-haptics";

/** Light touch feedback; silently does nothing if haptics are unavailable. */
export function lightTap(enabled: boolean): void {
  if (!enabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
    // Haptics are best-effort only.
  });
}
