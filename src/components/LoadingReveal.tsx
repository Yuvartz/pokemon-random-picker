import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from "react-native";
import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";
import { useSettings } from "../context/SettingsContext";
import { ALL_POKEMON } from "../data/pokemon";
import { getRandomPokemonId } from "../utils/random";
import { ICONS } from "../theme/icons";

/**
 * The ~1 second reveal animation: a pulsing question mark while a few
 * random Pokémon names flash by. Respects the reduced-motion setting.
 */
export function LoadingReveal() {
  const { settings, strings } = useSettings();
  const scale = useRef(new Animated.Value(1)).current;
  const [flashName, setFlashName] = useState("???");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false));
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.25,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale, reduceMotion]);

  useEffect(() => {
    const interval = setInterval(() => {
      const pokemon = ALL_POKEMON[getRandomPokemonId() - 1];
      if (pokemon) {
        setFlashName(
          settings.language === "he" ? pokemon.hebrewName : pokemon.englishName
        );
      }
    }, 150);
    return () => clearInterval(interval);
  }, [settings.language]);

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={strings.loadingLabel}
      accessibilityRole="progressbar"
    >
      <View style={styles.markWrap}>
        <Animated.Image
          source={ICONS.question}
          style={[styles.markImage, { transform: [{ scale }] }]}
        />
      </View>
      <Text style={styles.flashName}>{flashName}</Text>
      <Text style={styles.caption}>{strings.loadingLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl * 2,
  },
  markWrap: {
    width: 160,
    height: 160,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.raised,
  },
  markImage: {
    width: 110,
    height: 110,
  },
  flashName: {
    ...TYPOGRAPHY.screenTitle,
    color: COLORS.text,
    marginTop: SPACING.l,
    minHeight: 30,
    textAlign: "center",
  },
  caption: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
    textAlign: "center",
  },
});
