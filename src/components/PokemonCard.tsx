import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { PokemonArtwork } from "./PokemonArtwork";
import { TypeBadge } from "./TypeBadge";
import { SpeechControls } from "./SpeechControls";
import { PrimaryButton } from "./PrimaryButton";
import { useSettings } from "../context/SettingsContext";
import { getTypeTheme } from "../theme/typeColors";
import {
  COLORS,
  MIN_TOUCH,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";
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
    <View
      style={[
        styles.frame,
        { backgroundColor: theme.accent, borderColor: theme.accent },
      ]}
    >
      <View
        style={[
          styles.foilLine,
          { backgroundColor: COLORS.whiteOverlay },
        ]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={[styles.card, { borderColor: theme.background }]}>
        {/* Header: stage chip, name, HP */}
        <View style={[styles.headerRow, isRTL && styles.rowRTL]}>
          <View
            style={[
              styles.stageChip,
              {
                backgroundColor: theme.background,
                borderColor: theme.accent,
              },
            ]}
          >
            <Text style={[styles.stageChipText, { color: theme.accent }]}>
              {stageLabel}
            </Text>
          </View>
          <View
            style={[
              styles.hpBadge,
              {
                backgroundColor: theme.background,
                borderColor: theme.accent,
              },
            ]}
          >
            <Text
              style={[styles.hp, { color: theme.accent }]}
              accessibilityLabel={`HP ${pokemon.stats.hp}`}
            >
              HP {pokemon.stats.hp}
            </Text>
          </View>
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
        <View
          style={[styles.nameRule, { backgroundColor: theme.accent }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />

        {/* Artwork window */}
        <View
          style={[
            styles.artworkWindow,
            { borderColor: theme.accent, backgroundColor: theme.background },
          ]}
        >
          <View
            style={[
              styles.artworkHalo,
              {
                width: artworkSize * 0.76,
                height: artworkSize * 0.76,
                borderRadius: artworkSize,
                borderColor: theme.accent,
              },
            ]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
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
          style={[
            styles.abilityBlock,
            {
              backgroundColor: theme.background,
              borderColor: theme.accent,
            },
          ]}
        >
          <View style={[styles.abilityHeader, isRTL && styles.rowRTL]}>
            <Text style={[styles.abilityLabel, { textAlign }]}>
              {strings.abilityLabel}
            </Text>
            <Text
              style={[
                styles.abilityName,
                {
                  color: theme.accent,
                  textAlign,
                  writingDirection,
                },
              ]}
            >
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
            <Text style={styles.footerLabel}>{strings.heightLabel}</Text>
            <Text style={styles.footerValue}>
              {pokemon.heightM} {strings.metersUnit}
            </Text>
          </View>
          <View style={styles.footerDivider} />
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
    borderRadius: RADIUS.cardOuter,
    borderWidth: 1,
    padding: SPACING.s,
    width: "100%",
    overflow: "visible",
    ...SHADOWS.card,
  },
  foilLine: {
    position: "absolute",
    top: 4,
    left: 26,
    right: 26,
    height: 2,
    borderRadius: RADIUS.pill,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    padding: SPACING.ml,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.s,
  },
  rowRTL: {
    flexDirection: "row-reverse",
  },
  stageChip: {
    minHeight: 30,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  stageChipText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "800",
  },
  hpBadge: {
    minHeight: 34,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  hp: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
  },
  primaryName: {
    ...TYPOGRAPHY.cardTitle,
    color: COLORS.text,
    textAlign: "center",
    marginTop: SPACING.s,
  },
  secondaryName: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  evolvesFrom: {
    ...TYPOGRAPHY.caption,
    fontWeight: "700",
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  nameRule: {
    alignSelf: "center",
    width: 40,
    height: 3,
    borderRadius: RADIUS.pill,
    marginTop: SPACING.sm,
    opacity: 0.8,
  },
  artworkWindow: {
    minHeight: 220,
    borderWidth: 2,
    borderRadius: RADIUS.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.s,
    marginTop: SPACING.sm,
    overflow: "hidden",
  },
  artworkHalo: {
    position: "absolute",
    borderWidth: 1,
    opacity: 0.16,
    backgroundColor: COLORS.whiteOverlay,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  abilityBlock: {
    borderRadius: RADIUS.s,
    borderWidth: 1,
    padding: SPACING.m,
    marginBottom: SPACING.sm,
  },
  abilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
    gap: SPACING.s,
  },
  abilityLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  abilityName: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
    flexShrink: 1,
  },
  abilityText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.text,
  },
  flavorText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    lineHeight: 21,
    fontStyle: "italic",
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    borderTopWidth: 2,
    paddingTop: SPACING.sm,
    marginBottom: SPACING.m,
  },
  footerItem: {
    flex: 1,
    alignItems: "center",
    minWidth: MIN_TOUCH,
  },
  footerDivider: {
    width: 1,
    minHeight: 36,
    backgroundColor: COLORS.border,
  },
  footerLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    lineHeight: 15,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footerValue: {
    ...TYPOGRAPHY.label,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 2,
  },
  evolutionsButton: {
    marginTop: SPACING.m,
  },
});
