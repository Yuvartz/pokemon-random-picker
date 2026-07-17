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
import { COLORS, MIN_TOUCH, SPACING } from "../theme/colors";
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
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>{isRTL ? "→" : "←"}</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          {strings.historyTitle}
        </Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <Text style={styles.empty}>{strings.historyEmpty}</Text>
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
  },
  empty: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.l,
  },
});
