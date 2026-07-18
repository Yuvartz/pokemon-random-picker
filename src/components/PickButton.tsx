import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ICONS } from "../theme/icons";
import { shadeColor } from "../utils/colorShade";
import { COLORS, RADIUS, SHADOWS, SPACING } from "../theme/colors";

type Props = {
  label: string;
  onPress: () => void;
  accent: string;
  /** While revealing: the ball spins fast and the button is disabled. */
  revealing?: boolean;
};

const IS_WEB = Platform.OS === "web";

/**
 * The RN Animated JS driver does not tick on web in this RN/RN-web
 * combination (and RN-web no longer supports `animationKeyframes`), so
 * on web the ball is driven by real injected CSS keyframe animations,
 * targeted via a data attribute (RN-web renders `dataSet` as data-*).
 */
function ensureWebKeyframes(): void {
  if (!IS_WEB || typeof document === "undefined") return;
  if (document.getElementById("pick-button-keyframes")) return;
  const style = document.createElement("style");
  style.id = "pick-button-keyframes";
  style.textContent = `
@keyframes poke-wobble {
  0% { transform: rotate(0deg); }
  6% { transform: rotate(-16deg); }
  13% { transform: rotate(14deg); }
  20% { transform: rotate(-10deg); }
  27% { transform: rotate(8deg); }
  33% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}
@keyframes poke-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
[data-ballanim="wobble"] { animation: poke-wobble 2.8s ease-in-out infinite; }
[data-ballanim="spin"] { animation: poke-spin 0.55s linear infinite; }
@media (prefers-reduced-motion: reduce) {
  [data-ballanim] { animation: none !important; }
}
`;
  document.head.appendChild(style);
}
ensureWebKeyframes();

/**
 * The app's hero button. A glossy gradient capsule in the current type
 * color with an animated capsule ball: it wobbles side to side while
 * idle (like a ball about to pop open) and spins during the reveal.
 * Respects the reduced-motion accessibility setting.
 */
export function PickButton({ label, onPress, accent, revealing }: Props) {
  const wobble = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false));
  }, []);

  // Native-only Animated loops (web uses CSS keyframes above).
  useEffect(() => {
    if (IS_WEB || reduceMotion || revealing) return;
    const tick = (to: number, duration: number) =>
      Animated.timing(wobble, {
        toValue: to,
        duration,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      });
    const loop = Animated.loop(
      Animated.sequence([
        tick(-1, 120),
        tick(1, 200),
        tick(-0.6, 160),
        tick(0.6, 160),
        tick(0, 120),
        Animated.delay(1900),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
      wobble.setValue(0);
    };
  }, [wobble, reduceMotion, revealing]);

  useEffect(() => {
    if (IS_WEB || !revealing || reduceMotion) return;
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 550,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => {
      loop.stop();
      spin.setValue(0);
    };
  }, [spin, revealing, reduceMotion]);

  const nativeBallRotate = revealing
    ? spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] })
    : wobble.interpolate({
        inputRange: [-1, 1],
        outputRange: ["-16deg", "16deg"],
      });

  const animatePress = (to: number) =>
    Animated.spring(pressScale, {
      toValue: to,
      useNativeDriver: !IS_WEB,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Animated.View style={IS_WEB ? undefined : { transform: [{ scale: pressScale }] }}>
      <Pressable
        onPress={onPress}
        disabled={revealing}
        onPressIn={() => !revealing && animatePress(0.965)}
        onPressOut={() => animatePress(1)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !!revealing, busy: !!revealing }}
        style={({ pressed }) =>
          IS_WEB && pressed && !revealing
            ? { transform: [{ scale: 0.97 }] }
            : undefined
        }
      >
        <LinearGradient
          colors={[
            shadeColor(accent, 0.25),
            accent,
            shadeColor(accent, -0.22),
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.button, { borderColor: shadeColor(accent, -0.35) }]}
        >
          {/* Glossy top shine */}
          <View style={styles.shine} pointerEvents="none" />
          <View style={styles.content}>
            <View
              {...(IS_WEB
                ? { dataSet: { ballanim: revealing ? "spin" : "wobble" } }
                : {})}
            >
              <Animated.Image
                source={ICONS.ball}
                style={[
                  styles.ball,
                  !IS_WEB && { transform: [{ rotate: nativeBallRotate }] },
                ]}
              />
            </View>
            <Text
              style={styles.label}
              allowFontScaling
              maxFontSizeMultiplier={1.4}
            >
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 64,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.sm,
    justifyContent: "center",
    overflow: "hidden",
    ...SHADOWS.raised,
  },
  shine: {
    position: "absolute",
    top: 5,
    left: 18,
    right: 18,
    height: 14,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  ball: {
    width: 42,
    height: 42,
  },
  label: {
    color: COLORS.buttonText,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    flexShrink: 1,
  },
});
