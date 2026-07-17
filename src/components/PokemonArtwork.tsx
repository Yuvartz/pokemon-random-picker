import React, { useEffect, useState } from "react";
import { Image as RNImage, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { ICONS } from "../theme/icons";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../theme/colors";
import { useSettings } from "../context/SettingsContext";
import type { PokemonData } from "../types/pokemon";

type Props = {
  pokemon: PokemonData;
  size: number;
};

/**
 * Loads the official artwork with disk caching (expo-image).
 * Falls back to the small game sprite, then to a question-mark placeholder.
 */
export function PokemonArtwork({ pokemon, size }: Props) {
  const { strings } = useSettings();
  // 0 = official artwork, 1 = fallback sprite, 2 = placeholder
  const [sourceLevel, setSourceLevel] = useState(0);

  useEffect(() => {
    setSourceLevel(0);
  }, [pokemon.id]);

  if (sourceLevel >= 2) {
    return (
      <View
        style={[styles.placeholder, { width: size, height: size }]}
        accessible
        accessibilityLabel={strings.imageUnavailable}
      >
        <RNImage
          source={ICONS.question}
          style={{ width: size * 0.45, height: size * 0.45 }}
        />
        <Text style={styles.placeholderText}>{strings.imageUnavailable}</Text>
      </View>
    );
  }

  const uri = sourceLevel === 0 ? pokemon.imageUrl : pokemon.fallbackSpriteUrl;

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size }}
      contentFit="contain"
      cachePolicy="disk"
      transition={200}
      onError={() => setSourceLevel((level) => level + 1)}
      accessible
      accessibilityLabel={pokemon.englishName}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  placeholderMark: {
    fontSize: 72,
    lineHeight: 82,
    fontWeight: "800",
    color: COLORS.placeholder,
  },
  placeholderText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: SPACING.s,
  },
});
