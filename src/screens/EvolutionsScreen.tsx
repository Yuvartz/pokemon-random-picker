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
import { COLORS, MIN_TOUCH, RADIUS, SPACING } from "../theme/colors";
import type { PokemonData } from "../types/pokemon";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Evolutions">;

export function EvolutionsScreen({ navigation, route }: Props) {
  const { settings, strings, isRTL } = useSettings();
  const pokemon = getPokemonById(route.params.pokemonId);

  if (!pokemon) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <Text style={styles.empty}>{strings.errorGeneric}</Text>
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
            backgroundColor: isCurrent ? memberTheme.background : COLORS.card,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
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
        <Text style={styles.memberName}>{name}</Text>
        {isCurrent && (
          <Text style={[styles.currentTag, { color: memberTheme.accent }]}>
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
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>{isRTL ? "→" : "←"}</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          {strings.evolutionsTitle}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {stages.length === 1 && stages[0].length === 1 ? (
          <>
            {renderMember(stages[0][0])}
            <Text style={styles.empty}>{strings.noEvolutions}</Text>
          </>
        ) : (
          stages.map((stage, index) => (
            <View key={index} style={styles.stageBlock}>
              <Text style={[styles.stageLabel, { color: theme.accent }]}>
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
    backgroundColor: "#F2F3F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.s,
  },
  headerRTL: {
    flexDirection: "row-reverse",
  },
  backButton: {
    minWidth: MIN_TOUCH,
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 26,
    color: COLORS.text,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  content: {
    padding: SPACING.m,
    paddingBottom: SPACING.xl,
    alignItems: "center",
  },
  stageBlock: {
    alignItems: "center",
    width: "100%",
  },
  stageLabel: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.s,
  },
  stageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.m,
  },
  member: {
    alignItems: "center",
    borderWidth: 3,
    borderRadius: RADIUS.card,
    padding: SPACING.m,
    minWidth: 130,
    minHeight: MIN_TOUCH,
  },
  memberImage: {
    width: 96,
    height: 96,
  },
  memberNumber: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: SPACING.xs,
  },
  memberName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  currentTag: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  arrow: {
    fontSize: 28,
    marginVertical: SPACING.s,
  },
  empty: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: SPACING.l,
  },
});
