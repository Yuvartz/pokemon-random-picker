import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { COLORS } from "../theme/colors";
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
        <Text style={styles.placeholderMark}>?</Text>
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
    borderRadius: 24,
    backgroundColor: "#EDEFF4",
  },
  placeholderMark: {
    fontSize: 72,
    fontWeight: "800",
    color: COLORS.placeholder,
  },
  placeholderText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
