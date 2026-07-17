import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { COLORS, MIN_TOUCH, RADIUS, SPACING } from "../theme/colors";
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
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
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
      <Text style={[styles.label, isRTL && styles.labelRTL]}>{label}</Text>
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
              style={[styles.segment, active && styles.segmentActive]}
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
    paddingVertical: SPACING.s,
  },
  rowRTL: {
    flexDirection: "row-reverse",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    flexShrink: 1,
  },
  labelRTL: {
    textAlign: "right",
  },
  segmentedContainer: {
    paddingVertical: SPACING.s,
  },
  segments: {
    flexDirection: "row",
    marginTop: SPACING.s,
    backgroundColor: "#EEF0F5",
    borderRadius: RADIUS.badge,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    borderRadius: RADIUS.badge - 4,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: {
    backgroundColor: COLORS.card,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.text,
  },
});
