import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { PokemonArtwork } from "./PokemonArtwork";
import { TypeBadge } from "./TypeBadge";
import { SpeechControls } from "./SpeechControls";
import { PrimaryButton } from "./PrimaryButton";
import { useSettings } from "../context/SettingsContext";
import { getTypeTheme } from "../theme/typeColors";
import { COLORS, MIN_TOUCH, RADIUS, SPACING } from "../theme/colors";
import { translateType } from "../localization/typeNames";
import { getPokemonById } from "../data/pokemon";
import { hasEvolutionFamily } from "../utils/evolutions";
import type { PokemonData } from "../types/pokemon";

type Props = {
  pokemon: PokemonData;
  isSpeaking: boolean;
  onReplaySpeech: () => void;
  onStopSpeech: () => void;
  onShowEvolutions: () => void;
};

export function formatPokedexNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

/**
 * The Pokémon presented as a collectible-style trading card: a
 * type-colored frame, name + HP header, evolution stage chip, framed
 * artwork window, ability entry, flavor-text description and a stats
 * footer. Original design — not a copy of any official card layout.
 */
export function PokemonCard({
  pokemon,
  isSpeaking,
  onReplaySpeech,
  onStopSpeech,
  onShowEvolutions,
}: Props) {
  const { settings, strings, isRTL } = useSettings();
  const { width } = useWindowDimensions();
  const isHebrew = settings.language === "he";
  const theme = getTypeTheme(pokemon.types[0]);
  const artworkSize = Math.min(width * 0.55, 250);

  const primaryName = isHebrew ? pokemon.hebrewName : pokemon.englishName;
  const secondaryName = isHebrew ? pokemon.englishName : pokemon.hebrewName;
  const ability = isHebrew ? pokemon.primaryAbilityHe : pokemon.primaryAbilityEn;
  const abilityDescription = isHebrew
    ? pokemon.abilityDescriptionHe
    : pokemon.abilityDescriptionEn;
  const description = isHebrew ? pokemon.descriptionHe : pokemon.descriptionEn;
  const textAlign = isRTL ? ("right" as const) : ("left" as const);
  const writingDirection = isRTL ? ("rtl" as const) : ("ltr" as const);

  const stageLabel =
    pokemon.evolutionStage === 0
      ? strings.stageBasic
      : `${strings.stagePrefix} ${pokemon.evolutionStage}`;
  const evolvesFrom =
    pokemon.evolvesFromId != null ? getPokemonById(pokemon.evolvesFromId) : null;
  const evolvesFromName = evolvesFrom
    ? isHebrew
      ? evolvesFrom.hebrewName
      : evolvesFrom.englishName
    : null;

  return (
    <View style={[styles.frame, { backgroundColor: theme.accent }]}>
      <View style={styles.card}>
        {/* Header: stage chip, name, HP */}
        <View style={[styles.headerRow, isRTL && styles.rowRTL]}>
          <View style={[styles.stageChip, { backgroundColor: theme.background }]}>
            <Text style={[styles.stageChipText, { color: theme.accent }]}>
              {stageLabel}
            </Text>
          </View>
          <Text
            style={styles.hp}
            accessibilityLabel={`HP ${pokemon.stats.hp}`}
          >
            HP {pokemon.stats.hp}
          </Text>
        </View>
        <Text style={styles.primaryName} accessibilityRole="header">
          {primaryName}
        </Text>
        <Text style={styles.secondaryName}>{secondaryName}</Text>
        {evolvesFromName && (
          <Text style={[styles.evolvesFrom, { color: theme.accent }]}>
            {strings.evolvesFromLabel} {evolvesFromName}
          </Text>
        )}

        {/* Artwork window */}
        <View
          style={[
            styles.artworkWindow,
            { borderColor: theme.accent, backgroundColor: theme.background },
          ]}
        >
          <PokemonArtwork pokemon={pokemon} size={artworkSize} />
        </View>

        <View style={[styles.badgeRow, isRTL && styles.rowRTL]}>
          {pokemon.types.map((type) => (
            <TypeBadge
              key={type}
              type={type}
              label={translateType(type, settings.language)}
            />
          ))}
        </View>

        {/* Ability entry, styled like a card move */}
        <View
          style={[styles.abilityBlock, { backgroundColor: theme.background }]}
        >
          <View style={[styles.abilityHeader, isRTL && styles.rowRTL]}>
            <Text style={[styles.abilityLabel, { textAlign }]}>
              {strings.abilityLabel}
            </Text>
            <Text style={[styles.abilityName, { color: theme.accent }]}>
              {ability}
            </Text>
          </View>
          <Text
            style={[styles.abilityText, { textAlign, writingDirection }]}
          >
            {abilityDescription}
          </Text>
        </View>

        {/* Flavor text */}
        <Text style={[styles.flavorText, { textAlign, writingDirection }]}>
          {description}
        </Text>

        {/* Card footer */}
        <View style={[styles.footerRow, { borderTopColor: theme.background }]}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>{strings.pokedexNumber}</Text>
            <Text style={[styles.footerValue, { color: theme.accent }]}>
              {formatPokedexNumber(pokemon.id)}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>{strings.heightLabel}</Text>
            <Text style={styles.footerValue}>
              {pokemon.heightM} {strings.metersUnit}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>{strings.weightLabel}</Text>
            <Text style={styles.footerValue}>
              {pokemon.weightKg} {strings.kilogramsUnit}
            </Text>
          </View>
        </View>

        <SpeechControls
          accent={theme.accent}
          isSpeaking={isSpeaking}
          onReplay={onReplaySpeech}
          onStop={onStopSpeech}
        />

        {hasEvolutionFamily(pokemon) && (
          <PrimaryButton
            label={`🧬 ${strings.evolutionsButton}`}
            onPress={onShowEvolutions}
            color={theme.accent}
            style={styles.evolutionsButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: RADIUS.card + 6,
    padding: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.m,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowRTL: {
    flexDirection: "row-reverse",
  },
  stageChip: {
    borderRadius: RADIUS.badge,
    paddingHorizontal: SPACING.m,
    paddingVertical: 4,
  },
  stageChipText: {
    fontSize: 13,
    fontWeight: "800",
  },
  hp: {
    fontSize: 20,
    fontWeight: "900",
    color: "#C0392B",
  },
  primaryName: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  secondaryName: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  evolvesFrom: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 2,
  },
  artworkWindow: {
    borderWidth: 3,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.s,
    marginTop: SPACING.s,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: SPACING.s,
    marginBottom: SPACING.s,
  },
  abilityBlock: {
    borderRadius: 14,
    padding: SPACING.m,
    marginBottom: SPACING.s,
  },
  abilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  abilityLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  abilityName: {
    fontSize: 18,
    fontWeight: "800",
  },
  abilityText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  flavorText: {
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: SPACING.s,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 2,
    paddingTop: SPACING.s,
    marginBottom: SPACING.m,
  },
  footerItem: {
    alignItems: "center",
    minWidth: MIN_TOUCH,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
  },
  footerValue: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  evolutionsButton: {
    marginTop: SPACING.m,
  },
});
