import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSettings } from "../context/SettingsContext";
import { formatPokedexNumber } from "./PokemonCard";
import {
  COLORS,
  MIN_TOUCH,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";
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
        {
          borderStartColor: theme.accent,
          backgroundColor: pressed ? theme.background : COLORS.card,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      <View
        style={[
          styles.thumbWrap,
          { backgroundColor: theme.background, borderColor: theme.accent },
        ]}
      >
        <Image
          source={{ uri: pokemon.fallbackSpriteUrl }}
          style={styles.thumb}
          contentFit="contain"
          cachePolicy="disk"
        />
      </View>
      <View style={styles.textWrap}>
        <Text
          style={[
            styles.number,
            { color: theme.accent, textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {formatPokedexNumber(pokemon.id)}
        </Text>
        <Text
          style={[
            styles.name,
            {
              textAlign: isRTL ? "right" : "left",
              writingDirection: isRTL ? "rtl" : "ltr",
            },
          ]}
        >
          {name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStartWidth: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.s,
    minHeight: 76,
    gap: SPACING.sm,
    ...SHADOWS.subtle,
  },
  itemRTL: {
    flexDirection: "row-reverse",
  },
  thumbWrap: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    padding: SPACING.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  thumb: {
    width: 50,
    height: 50,
  },
  textWrap: {
    flex: 1,
    minWidth: MIN_TOUCH,
  },
  number: {
    ...TYPOGRAPHY.caption,
    fontWeight: "800",
    marginBottom: 2,
  },
  name: {
    ...TYPOGRAPHY.bodyStrong,
    fontSize: 18,
    lineHeight: 24,
    color: COLORS.text,
  },
});
