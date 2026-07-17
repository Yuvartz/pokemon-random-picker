import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSettings } from "../context/SettingsContext";
import { formatPokedexNumber } from "./PokemonCard";
import { COLORS, MIN_TOUCH, RADIUS, SPACING } from "../theme/colors";
import { getTypeTheme } from "../theme/typeColors";
import type { PokemonData } from "../types/pokemon";

type Props = {
  pokemon: PokemonData;
  onPress: () => void;
};

export function HistoryItem({ pokemon, onPress }: Props) {
  const { settings, isRTL } = useSettings();
  const name =
    settings.language === "he" ? pokemon.hebrewName : pokemon.englishName;
  const theme = getTypeTheme(pokemon.types[0]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${formatPokedexNumber(pokemon.id)} ${name}`}
      style={({ pressed }) => [
        styles.item,
        isRTL && styles.itemRTL,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.thumbWrap, { backgroundColor: theme.background }]}>
        <Image
          source={{ uri: pokemon.fallbackSpriteUrl }}
          style={styles.thumb}
          contentFit="contain"
          cachePolicy="disk"
        />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.number, { color: theme.accent }]}>
          {formatPokedexNumber(pokemon.id)}
        </Text>
        <Text style={styles.name}>{name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.badge,
    padding: SPACING.s,
    marginVertical: SPACING.xs,
    minHeight: MIN_TOUCH + 8,
    gap: SPACING.m,
  },
  itemRTL: {
    flexDirection: "row-reverse",
  },
  thumbWrap: {
    borderRadius: 12,
    padding: 4,
  },
  thumb: {
    width: 48,
    height: 48,
  },
  textWrap: {
    flex: 1,
  },
  number: {
    fontSize: 13,
    fontWeight: "800",
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
});
