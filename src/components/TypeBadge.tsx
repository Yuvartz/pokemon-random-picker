import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getTypeTheme } from "../theme/typeColors";
import { RADIUS, SPACING } from "../theme/colors";
import type { TypeKey } from "../types/pokemon";

type Props = {
  type: TypeKey;
  label: string;
};

export function TypeBadge({ type, label }: Props) {
  const theme = getTypeTheme(type);
  return (
    <View
      style={[styles.badge, { backgroundColor: theme.accent }]}
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
    borderRadius: RADIUS.badge,
    paddingHorizontal: SPACING.m,
    paddingVertical: 6,
    marginHorizontal: SPACING.xs,
    marginVertical: SPACING.xs,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
