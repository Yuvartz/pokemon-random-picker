import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { PokemonArtwork } from "./PokemonArtwork";
import { TypeBadge } from "./TypeBadge";
import { SpeechControls } from "./SpeechControls";
import { useSettings } from "../context/SettingsContext";
import { getTypeTheme } from "../theme/typeColors";
import { COLORS, RADIUS, SPACING } from "../theme/colors";
import { translateType } from "../localization/typeNames";
import type { PokemonData } from "../types/pokemon";

type Props = {
  pokemon: PokemonData;
  isSpeaking: boolean;
  onReplaySpeech: () => void;
  onStopSpeech: () => void;
};

export function formatPokedexNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

export function PokemonCard({
  pokemon,
  isSpeaking,
  onReplaySpeech,
  onStopSpeech,
}: Props) {
  const { settings, strings, isRTL } = useSettings();
  const { width } = useWindowDimensions();
  const isHebrew = settings.language === "he";
  const theme = getTypeTheme(pokemon.types[0]);
  const artworkSize = Math.min(width * 0.62, 280);

  const primaryName = isHebrew ? pokemon.hebrewName : pokemon.englishName;
  const secondaryName = isHebrew ? pokemon.englishName : pokemon.hebrewName;
  const ability = isHebrew ? pokemon.primaryAbilityHe : pokemon.primaryAbilityEn;
  const abilityDescription = isHebrew
    ? pokemon.abilityDescriptionHe
    : pokemon.abilityDescriptionEn;
  const description = isHebrew ? pokemon.descriptionHe : pokemon.descriptionEn;
  const textAlign = isRTL ? "right" : "left";
  const writingDirection = isRTL ? "rtl" : "ltr";

  return (
    <View style={styles.card}>
      <Text style={[styles.pokedexNumber, { color: theme.accent }]}>
        {formatPokedexNumber(pokemon.id)}
      </Text>

      <View style={styles.artworkWrap}>
        <PokemonArtwork pokemon={pokemon} size={artworkSize} />
      </View>

      <Text style={styles.primaryName} accessibilityRole="header">
        {primaryName}
      </Text>
      <Text style={styles.secondaryName}>{secondaryName}</Text>

      <View style={[styles.badgeRow, isRTL && styles.rowRTL]}>
        {pokemon.types.map((type) => (
          <TypeBadge
            key={type}
            type={type}
            label={translateType(type, settings.language)}
          />
        ))}
      </View>

      <View style={styles.infoBlock}>
        <Text style={[styles.infoLabel, { textAlign, writingDirection }]}>
          {strings.abilityLabel}
        </Text>
        <Text
          style={[styles.infoValue, { textAlign, writingDirection, color: theme.accent }]}
        >
          {ability}
        </Text>
        <Text style={[styles.infoText, { textAlign, writingDirection }]}>
          {abilityDescription}
        </Text>
      </View>

      <View style={[styles.measurementsRow, isRTL && styles.rowRTL]}>
        <View style={styles.measurement}>
          <Text style={styles.infoLabel}>{strings.heightLabel}</Text>
          <Text style={styles.measurementValue}>
            {pokemon.heightM} {strings.metersUnit}
          </Text>
        </View>
        <View style={styles.measurement}>
          <Text style={styles.infoLabel}>{strings.weightLabel}</Text>
          <Text style={styles.measurementValue}>
            {pokemon.weightKg} {strings.kilogramsUnit}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { textAlign, writingDirection }]}>
        {description}
      </Text>

      <SpeechControls
        accent={theme.accent}
        isSpeaking={isSpeaking}
        onReplay={onReplaySpeech}
        onStop={onStopSpeech}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.l,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  pokedexNumber: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  artworkWrap: {
    alignItems: "center",
    marginVertical: SPACING.s,
  },
  primaryName: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
  secondaryName: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.s,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: SPACING.m,
  },
  rowRTL: {
    flexDirection: "row-reverse",
  },
  infoBlock: {
    marginBottom: SPACING.m,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  infoText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  measurementsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: 16,
    backgroundColor: "#F6F7FA",
  },
  measurement: {
    alignItems: "center",
  },
  measurementValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: SPACING.l,
  },
});
