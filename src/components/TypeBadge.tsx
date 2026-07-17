import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getTypeTheme } from "../theme/typeColors";
import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";
import type { TypeKey } from "../types/pokemon";

type Props = {
  type: TypeKey;
  label: string;
};

export function TypeBadge({ type, label }: Props) {
  const theme = getTypeTheme(type);
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: theme.accent, borderColor: theme.background },
      ]}
      accessibilityRole="text"
      accessible
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minHeight: 28,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    marginHorizontal: SPACING.xs,
    marginVertical: SPACING.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    ...TYPOGRAPHY.label,
    color: COLORS.buttonText,
  },
});
