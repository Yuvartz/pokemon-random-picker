import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSettings } from "../context/SettingsContext";
import { getPokemonById } from "../data/pokemon";
import { getEvolutionStages } from "../utils/evolutions";
import { formatPokedexNumber } from "../components/PokemonCard";
import { getTypeTheme } from "../theme/typeColors";
import {
  COLORS,
  MIN_TOUCH,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";
import type { PokemonData } from "../types/pokemon";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Evolutions">;

export function EvolutionsScreen({ navigation, route }: Props) {
  const { settings, strings, isRTL } = useSettings();
  const pokemon = getPokemonById(route.params.pokemonId);

  if (!pokemon) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.errorState}>
          <Text style={styles.empty}>{strings.errorGeneric}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const stages = getEvolutionStages(pokemon);
  const theme = getTypeTheme(pokemon.types[0]);

  const stageLabel = (index: number) =>
    index === 0 ? strings.stageBasic : `${strings.stagePrefix} ${index}`;

  const renderMember = (member: PokemonData) => {
    const memberTheme = getTypeTheme(member.types[0]);
    const isCurrent = member.id === pokemon.id;
    const name =
      settings.language === "he" ? member.hebrewName : member.englishName;
    return (
      <Pressable
        key={member.id}
        onPress={() => navigation.navigate("Home", { pokemonId: member.id })}
        accessibilityRole="button"
        accessibilityLabel={`${formatPokedexNumber(member.id)} ${name}`}
        style={({ pressed }) => [
          styles.member,
          {
            borderColor: isCurrent ? memberTheme.accent : COLORS.border,
            borderWidth: isCurrent ? 2 : 1,
            backgroundColor:
              pressed || isCurrent ? memberTheme.background : COLORS.card,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          },
        ]}
      >
        <View
          style={[
            styles.memberAccent,
            { backgroundColor: memberTheme.accent },
          ]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <Image
          source={{ uri: member.imageUrl }}
          style={styles.memberImage}
          contentFit="contain"
          cachePolicy="disk"
          accessible
          accessibilityLabel={member.englishName}
        />
        <Text style={[styles.memberNumber, { color: memberTheme.accent }]}>
          {formatPokedexNumber(member.id)}
        </Text>
        <Text
          style={[
            styles.memberName,
            { writingDirection: isRTL ? "rtl" : "ltr" },
          ]}
        >
          {name}
        </Text>
        {isCurrent && (
          <Text
            style={[
              styles.currentTag,
              {
                color: memberTheme.accent,
                borderColor: memberTheme.accent,
                backgroundColor: COLORS.card,
              },
            ]}
          >
            {strings.currentPokemonLabel}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={strings.cancel}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backIcon}>{isRTL ? "→" : "←"}</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          {strings.evolutionsTitle}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {stages.length === 1 && stages[0].length === 1 ? (
          <View style={styles.emptyState}>
            <View style={styles.singleMemberWrap}>
              {renderMember(stages[0][0])}
            </View>
            <Text
              style={[
                styles.empty,
                { writingDirection: isRTL ? "rtl" : "ltr" },
              ]}
            >
              {strings.noEvolutions}
            </Text>
          </View>
        ) : (
          stages.map((stage, index) => (
            <View key={index} style={styles.stageBlock}>
              <Text
                style={[
                  styles.stageLabel,
                  {
                    color: theme.accent,
                    backgroundColor: theme.background,
                    borderColor: theme.accent,
                  },
                ]}
              >
                {stageLabel(index)}
              </Text>
              <View style={[styles.stageRow, isRTL && styles.headerRTL]}>
                {stage.map(renderMember)}
              </View>
              {index < stages.length - 1 && (
                <Text style={styles.arrow} accessibilityElementsHidden>
                  ⬇️
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 64,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.s,
    backgroundColor: COLORS.backgroundRaised,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRTL: {
    flexDirection: "row-reverse",
  },
  backButton: {
    minWidth: MIN_TOUCH,
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.s,
  },
  backButtonPressed: {
    backgroundColor: COLORS.surfaceStrong,
    transform: [{ scale: 0.96 }],
  },
  headerSpacer: {
    minWidth: MIN_TOUCH,
    minHeight: MIN_TOUCH,
  },
  backIcon: {
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.text,
  },
  title: {
    ...TYPOGRAPHY.screenTitle,
    color: COLORS.text,
    textAlign: "center",
  },
  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.l,
    paddingBottom: SPACING.xxxl,
    alignItems: "center",
  },
  stageBlock: {
    alignItems: "center",
    width: "100%",
  },
  stageLabel: {
    ...TYPOGRAPHY.label,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.sm,
    overflow: "hidden",
  },
  stageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.sm,
    width: "100%",
  },
  member: {
    alignItems: "center",
    borderRadius: RADIUS.button,
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.sm,
    minWidth: 144,
    maxWidth: 210,
    flexGrow: 1,
    flexBasis: 144,
    minHeight: MIN_TOUCH,
    ...SHADOWS.subtle,
  },
  memberAccent: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: 3,
    borderBottomLeftRadius: RADIUS.pill,
    borderBottomRightRadius: RADIUS.pill,
  },
  memberImage: {
    width: 104,
    height: 104,
  },
  memberNumber: {
    ...TYPOGRAPHY.caption,
    fontWeight: "800",
    marginTop: SPACING.xs,
  },
  memberName: {
    ...TYPOGRAPHY.bodyStrong,
    fontSize: 17,
    lineHeight: 23,
    color: COLORS.text,
    textAlign: "center",
  },
  currentTag: {
    ...TYPOGRAPHY.caption,
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    marginTop: SPACING.xs,
    overflow: "hidden",
  },
  arrow: {
    fontSize: 24,
    lineHeight: 32,
    color: COLORS.textMuted,
    marginVertical: SPACING.sm,
  },
  emptyState: {
    width: "100%",
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.backgroundRaised,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACING.l,
  },
  singleMemberWrap: {
    width: "100%",
    maxWidth: 220,
    flexDirection: "row",
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.l,
  },
  empty: {
    textAlign: "center",
    color: COLORS.textSecondary,
    ...TYPOGRAPHY.body,
    marginTop: SPACING.l,
    maxWidth: 360,
  },
});
