import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../theme/colors";

type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props) {
  return (
    <View style={styles.container} accessible accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dangerBackground,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.sm,
    marginVertical: SPACING.s,
  },
  text: {
    color: COLORS.danger,
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    textAlign: "center",
  },
});
