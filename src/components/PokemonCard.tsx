import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { PokemonArtwork } from "./PokemonArtwork";
import { TypeBadge } from "./TypeBadge";
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
import { getEvolutionStages } from "../utils/evolutions";
import type { PokemonData } from "../types/pokemon";

type Props = {
  pokemon: PokemonData;
  onSelectEvolution: (pokemon: PokemonData) => void;
};

export function formatPokedexNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

/** Classic collectible-card gold frame tones. */
const GOLD_FRAME = ["#F9E9A8", "#EFC94C", "#D9A425", "#F3D97E"] as const;
const SILVER_FRAME = ["#F4F6FA", "#CBD3DF", "#E8ECF2"] as const;

/**
 * The Pokémon presented as a collectible trading card: a gold gradient
 * frame, type-tinted inner panel, name + HP header, framed artwork
 * window, an ability entry with a type "energy dot", flavor text and a
 * stats strip. Inspired by classic card layouts but an original design.
 * Display-only — all controls live in the screen's top control bar.
 */
export function PokemonCard({ pokemon, onSelectEvolution }: Props) {
  const { settings, strings, isRTL } = useSettings();
  const { width } = useWindowDimensions();
  const isHebrew = settings.language === "he";
  const theme = getTypeTheme(pokemon.types[0]);
  const artworkSize = Math.min(width * 0.55, 250);
  const evolutionStages = getEvolutionStages(pokemon);
  const evolutionMemberCount = evolutionStages.reduce(
    (count, stage) => count + stage.length,
    0
  );
  const showEvolutionStrip = evolutionMemberCount > 1;
  const evolutionStripHeight =
    evolutionMemberCount * MIN_TOUCH +
    (evolutionStages.length - 1) * 14 +
    SPACING.s;

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
    <LinearGradient
      colors={GOLD_FRAME}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.goldFrame}
    >
      <LinearGradient
        colors={[theme.background, "#FFFFFF", theme.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Header: stage chip, HP */}
        <View style={[styles.headerRow, isRTL && styles.rowRTL]}>
          <View
            style={[
              styles.stageChip,
              { backgroundColor: COLORS.card, borderColor: theme.accent },
            ]}
          >
            <Text style={[styles.stageChipText, { color: theme.accent }]}>
              ⭐ {stageLabel}
            </Text>
          </View>
          <Text
            style={styles.hp}
            accessibilityLabel={`HP ${pokemon.stats.hp}`}
          >
            HP {pokemon.stats.hp} ❤️
          </Text>
        </View>

        <Text style={styles.primaryName} accessibilityRole="header">
          {primaryName}
        </Text>
        <Text style={styles.secondaryName}>{secondaryName}</Text>
        {evolvesFromName && (
          <Text style={[styles.evolvesFrom, { color: theme.accent }]}>
            🥚 {strings.evolvesFromLabel} {evolvesFromName}
          </Text>
        )}

        {/* Artwork in a silver frame, like the card's picture window */}
        <LinearGradient
          colors={SILVER_FRAME}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.artworkFrame}
        >
          <LinearGradient
            colors={["#FFFFFF", theme.background]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[
              styles.artworkWindow,
              showEvolutionStrip && {
                minHeight: Math.max(210, evolutionStripHeight),
              },
            ]}
          >
            <PokemonArtwork pokemon={pokemon} size={artworkSize} />
            {showEvolutionStrip && (
              <View
                style={styles.evolutionStripAnchor}
                pointerEvents="box-none"
              >
                <View style={styles.evolutionStrip}>
                  {evolutionStages.map((stage, stageIndex) => (
                  <React.Fragment key={`stage-${stageIndex}`}>
                    {stageIndex > 0 && (
                      <Text
                        style={styles.evolutionArrow}
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                      >
                        ↓
                      </Text>
                    )}
                    <View style={styles.evolutionStage}>
                      {stage.map((member) => {
                        const isCurrent = member.id === pokemon.id;
                        const memberTheme = getTypeTheme(member.types[0]);
                        const memberName = isHebrew
                          ? member.hebrewName
                          : member.englishName;
                        const accessibilityLabel = `${formatPokedexNumber(
                          member.id
                        )} ${memberName}${
                          isCurrent ? `, ${strings.currentPokemonLabel}` : ""
                        }`;

                        return (
                          <Pressable
                            key={member.id}
                            onPress={() => onSelectEvolution(member)}
                            accessibilityRole="button"
                            accessibilityLabel={accessibilityLabel}
                            accessibilityState={{ selected: isCurrent }}
                            hitSlop={2}
                            style={({ pressed }) => [
                              styles.evolutionMember,
                              {
                                borderColor: isCurrent
                                  ? memberTheme.accent
                                  : COLORS.borderStrong,
                                backgroundColor: isCurrent
                                  ? "#FFF7CC"
                                  : "rgba(255, 255, 255, 0.94)",
                              },
                              isCurrent && styles.evolutionMemberCurrent,
                              pressed && styles.evolutionMemberPressed,
                            ]}
                          >
                            <Image
                              source={{ uri: member.imageUrl }}
                              style={styles.evolutionThumbnail}
                              contentFit="contain"
                              cachePolicy="disk"
                              accessibilityElementsHidden
                              importantForAccessibility="no-hide-descendants"
                            />
                            {isCurrent && (
                              <View
                                style={[
                                  styles.currentMarker,
                                  { backgroundColor: memberTheme.accent },
                                ]}
                                pointerEvents="none"
                                accessibilityElementsHidden
                                importantForAccessibility="no-hide-descendants"
                              >
                                <Text style={styles.currentMarkerText}>✓</Text>
                              </View>
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  </React.Fragment>
                  ))}
                </View>
              </View>
            )}
          </LinearGradient>
        </LinearGradient>

        <View style={[styles.badgeRow, isRTL && styles.rowRTL]}>
          {pokemon.types.map((type) => (
            <TypeBadge
              key={type}
              type={type}
              label={translateType(type, settings.language)}
            />
          ))}
        </View>

        {/* Ability entry with a type-colored energy dot, like a card move */}
        <View
          style={[
            styles.abilityBlock,
            { backgroundColor: COLORS.card, borderColor: theme.accent },
          ]}
        >
          <View style={[styles.abilityHeader, isRTL && styles.rowRTL]}>
            <View style={[styles.abilityTitleWrap, isRTL && styles.rowRTL]}>
              <View
                style={[styles.energyDot, { backgroundColor: theme.accent }]}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              />
              <Text style={[styles.abilityName, { color: theme.accent }]}>
                {ability}
              </Text>
            </View>
            <Text style={styles.abilityLabel}>{strings.abilityLabel}</Text>
          </View>
          <Text style={[styles.abilityText, { textAlign, writingDirection }]}>
            {abilityDescription}
          </Text>
        </View>

        {/* Flavor text, like the card's italic lore line */}
        <View
          style={[styles.flavorBox, { borderColor: theme.accent }]}
        >
          <Text style={[styles.flavorText, { textAlign, writingDirection }]}>
            {description}
          </Text>
        </View>

        {/* Bottom info strip */}
        <View style={[styles.footerRow, isRTL && styles.rowRTL]}>
          <Text style={styles.footerText}>
            📏 {strings.heightLabel}: {pokemon.heightM} {strings.metersUnit}
          </Text>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>
            ⚖️ {strings.weightLabel}: {pokemon.weightKg} {strings.kilogramsUnit}
          </Text>
        </View>
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  goldFrame: {
    borderRadius: RADIUS.cardOuter,
    padding: 12,
    width: "100%",
    ...SHADOWS.card,
  },
  card: {
    borderRadius: RADIUS.card - 4,
    borderWidth: 1,
    borderColor: COLORS.whiteOverlay,
    padding: SPACING.m,
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
    borderWidth: 1.5,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  stageChipText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "800",
  },
  hp: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "900",
    color: "#C0392B",
  },
  primaryName: {
    ...TYPOGRAPHY.cardTitle,
    color: COLORS.text,
    textAlign: "center",
    marginTop: SPACING.xs,
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
  artworkFrame: {
    borderRadius: RADIUS.button,
    padding: 5,
    marginTop: SPACING.sm,
    ...SHADOWS.subtle,
  },
  artworkWindow: {
    minHeight: 210,
    borderRadius: RADIUS.button - 4,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.s,
    overflow: "hidden",
  },
  evolutionStripAnchor: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    direction: "ltr",
    alignItems: "flex-start",
    padding: 5,
  },
  evolutionStrip: {
    alignItems: "center",
    borderRadius: RADIUS.badge,
    borderWidth: 1,
    borderColor: "rgba(24, 32, 51, 0.16)",
    backgroundColor: "rgba(255, 255, 255, 0.78)",
    padding: 3,
    ...SHADOWS.subtle,
  },
  evolutionStage: {
    alignItems: "center",
    gap: 2,
  },
  evolutionMember: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  evolutionMemberCurrent: {
    borderWidth: 3,
    ...SHADOWS.subtle,
  },
  evolutionMemberPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.94 }],
  },
  evolutionThumbnail: {
    width: 40,
    height: 40,
  },
  evolutionArrow: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  currentMarker: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 17,
    height: 17,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },
  currentMarkerText: {
    color: COLORS.card,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "900",
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
    borderWidth: 1.5,
    padding: SPACING.m,
    marginBottom: SPACING.sm,
    ...SHADOWS.subtle,
  },
  abilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
    gap: SPACING.s,
  },
  abilityTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.s,
    flexShrink: 1,
  },
  energyDot: {
    width: 16,
    height: 16,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    borderColor: COLORS.whiteOverlay,
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
  flavorBox: {
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderStyle: "dashed",
    backgroundColor: COLORS.whiteOverlay,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  flavorText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    lineHeight: 21,
    fontStyle: "italic",
    color: COLORS.textSecondary,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.m,
    minHeight: MIN_TOUCH - 16,
  },
  footerDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.borderStrong,
  },
  footerText: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.text,
  },
});
