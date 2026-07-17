import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  COLORS,
  MIN_TOUCH,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";

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
        { backgroundColor: color },
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
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
    borderWidth: 1,
    borderColor: COLORS.whiteOverlay,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.raised,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ translateY: 1 }, { scale: 0.99 }],
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  buttonDisabled: {
    opacity: 0.48,
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.buttonText,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    textAlign: "center",
  },
});
