import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { COLORS, MIN_TOUCH, RADIUS, SPACING } from "../theme/colors";

type Props = {
  label: string;
  onPress: () => void;
  color: string;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  color,
  disabled,
  accessibilityHint,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={styles.label} allowFontScaling maxFontSizeMultiplier={1.5}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    minWidth: MIN_TOUCH,
    borderRadius: RADIUS.button,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
