import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  COLORS,
  MIN_TOUCH,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";
import { useSettings } from "../context/SettingsContext";

type Props = {
  accent: string;
  isSpeaking: boolean;
  onReplay: () => void;
  onStop: () => void;
};

export function SpeechControls({ accent, isSpeaking, onReplay, onStop }: Props) {
  const { strings, isRTL } = useSettings();

  return (
    <View style={[styles.row, isRTL && styles.rowRTL]}>
      <Pressable
        onPress={onReplay}
        accessibilityRole="button"
        accessibilityLabel={strings.replaySpeech}
        style={({ pressed }) => [
          styles.control,
          { borderColor: accent },
          pressed && styles.controlPressed,
        ]}
      >
        <Text style={[styles.controlText, { color: accent }]}>
          🔊 {strings.replaySpeech}
        </Text>
      </Pressable>
      <Pressable
        onPress={onStop}
        disabled={!isSpeaking}
        accessibilityRole="button"
        accessibilityLabel={strings.stopSpeech}
        accessibilityState={{ disabled: !isSpeaking }}
        style={({ pressed }) => [
          styles.control,
          {
            borderColor: COLORS.danger,
          },
          pressed && isSpeaking && styles.controlPressed,
          !isSpeaking && styles.controlDisabled,
        ]}
      >
        <Text style={[styles.controlText, { color: COLORS.danger }]}>
          ⏹ {strings.stopSpeech}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: SPACING.s,
  },
  rowRTL: {
    flexDirection: "row-reverse",
  },
  control: {
    minHeight: MIN_TOUCH,
    minWidth: 0,
    flex: 1,
    borderRadius: RADIUS.s,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.s,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
  },
  controlPressed: {
    backgroundColor: COLORS.surfaceMuted,
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  controlDisabled: {
    backgroundColor: COLORS.surfaceMuted,
    borderColor: COLORS.border,
    opacity: 0.46,
  },
  controlText: {
    ...TYPOGRAPHY.label,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    textAlign: "center",
  },
});
