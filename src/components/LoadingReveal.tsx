import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../theme/colors";
import { useSettings } from "../context/SettingsContext";
import { ALL_POKEMON } from "../data/pokemon";
import { getRandomPokemonId } from "../utils/random";

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
      <Animated.Text style={[styles.mark, { transform: [{ scale }] }]}>
        ?
      </Animated.Text>
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
  mark: {
    fontSize: 120,
    fontWeight: "800",
    color: COLORS.placeholder,
  },
  flashName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
    minHeight: 30,
  },
  caption: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
  },
});
