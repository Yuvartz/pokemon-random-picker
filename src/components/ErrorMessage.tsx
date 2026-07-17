import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme/colors";

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
    backgroundColor: "#FDF1EF",
    borderRadius: RADIUS.badge,
    borderWidth: 1,
    borderColor: "#F2C7C0",
    padding: SPACING.m,
    marginVertical: SPACING.s,
  },
  text: {
    color: COLORS.danger,
    fontSize: 15,
    textAlign: "center",
  },
});
