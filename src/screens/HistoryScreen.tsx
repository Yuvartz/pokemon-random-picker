import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HistoryItem } from "../components/HistoryItem";
import { useSettings } from "../context/SettingsContext";
import { useHistory } from "../context/HistoryContext";
import { getPokemonById } from "../data/pokemon";
import {
  COLORS,
  MIN_TOUCH,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "History">;

export function HistoryScreen({ navigation }: Props) {
  const { strings, isRTL } = useSettings();
  const { history } = useHistory();

  const items = history
    .map((entry, index) => ({
      key: `${entry.selectedAt}-${index}`,
      pokemon: getPokemonById(entry.pokemonId),
    }))
    .filter((item) => item.pokemon != null);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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
          {strings.historyTitle}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={[
          styles.content,
          items.length === 0 && styles.emptyContent,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyMarkWrap}>
              <Text style={styles.emptyMark} accessible={false}>
                —
              </Text>
            </View>
            <Text
              style={[
                styles.empty,
                {
                  writingDirection: isRTL ? "rtl" : "ltr",
                },
              ]}
            >
              {strings.historyEmpty}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <HistoryItem
            pokemon={item.pokemon!}
            onPress={() =>
              navigation.navigate("Home", { pokemonId: item.pokemon!.id })
            }
          />
        )}
      />
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
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.l,
    paddingBottom: SPACING.xxxl,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  separator: {
    height: SPACING.sm,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xxl,
  },
  emptyMarkWrap: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.m,
  },
  emptyMark: {
    color: COLORS.placeholder,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "700",
  },
  empty: {
    textAlign: "center",
    color: COLORS.textSecondary,
    ...TYPOGRAPHY.body,
    maxWidth: 360,
  },
});
