import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, MIN_TOUCH, RADIUS, SPACING } from "../theme/colors";
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
          { borderColor: accent, opacity: pressed ? 0.7 : 1 },
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
            opacity: !isSpeaking ? 0.4 : pressed ? 0.7 : 1,
          },
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
    gap: SPACING.m,
  },
  rowRTL: {
    flexDirection: "row-reverse",
  },
  control: {
    minHeight: MIN_TOUCH,
    minWidth: 120,
    borderRadius: RADIUS.button,
    borderWidth: 2,
    paddingHorizontal: SPACING.m,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
  },
  controlText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
