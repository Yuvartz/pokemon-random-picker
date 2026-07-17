import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import {
  COLORS,
  MIN_TOUCH,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";
import { DEFAULT_THEME } from "../theme/typeColors";
import { useSettings } from "../context/SettingsContext";

type SwitchRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function SettingSwitchRow({ label, value, onValueChange }: SwitchRowProps) {
  const { isRTL } = useSettings();
  return (
    <View style={[styles.row, isRTL && styles.rowRTL]}>
      <Text
        style={[
          styles.label,
          {
            textAlign: isRTL ? "right" : "left",
            writingDirection: isRTL ? "rtl" : "ltr",
          },
        ]}
      >
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        trackColor={{
          false: COLORS.surfaceStrong,
          true: DEFAULT_THEME.accent,
        }}
        thumbColor={COLORS.card}
      />
    </View>
  );
}

type SegmentedRowProps<T extends string> = {
  label: string;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
};

export function SettingSegmentedRow<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: SegmentedRowProps<T>) {
  const { isRTL } = useSettings();
  return (
    <View style={styles.segmentedContainer}>
      <Text
        style={[
          styles.label,
          isRTL && styles.labelRTL,
          { writingDirection: isRTL ? "rtl" : "ltr" },
        ]}
      >
        {label}
      </Text>
      <View style={[styles.segments, isRTL && styles.rowRTL]}>
        {options.map((option) => {
          const active = option.value === selected;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              accessibilityRole="button"
              accessibilityLabel={`${label}: ${option.label}`}
              accessibilityState={{ selected: active }}
              style={({ pressed }) => [
                styles.segment,
                active && styles.segmentActive,
                pressed && styles.segmentPressed,
              ]}
            >
              <Text
                style={[styles.segmentText, active && styles.segmentTextActive]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: MIN_TOUCH,
    paddingVertical: SPACING.sm,
    gap: SPACING.m,
  },
  rowRTL: {
    flexDirection: "row-reverse",
  },
  label: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.text,
    flexShrink: 1,
  },
  labelRTL: {
    textAlign: "right",
  },
  segmentedContainer: {
    paddingVertical: SPACING.sm,
  },
  segments: {
    flexDirection: "row",
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    minHeight: MIN_TOUCH,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.s,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: {
    backgroundColor: COLORS.card,
    ...SHADOWS.subtle,
  },
  segmentPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },
  segmentText: {
    ...TYPOGRAPHY.label,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  segmentTextActive: {
    color: COLORS.text,
    fontWeight: "800",
  },
});
