import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  SettingSegmentedRow,
  SettingSwitchRow,
} from "../components/SettingRow";
import { useSettings } from "../context/SettingsContext";
import { useHistory } from "../context/HistoryContext";
import { stopSpeech } from "../services/speech";
import { COLORS, MIN_TOUCH, RADIUS, SPACING } from "../theme/colors";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export function SettingsScreen({ navigation }: Props) {
  const { settings, strings, isRTL, updateSettings } = useSettings();
  const { clearHistory } = useHistory();

  const confirmClearHistory = () => {
    Alert.alert(
      strings.clearHistoryConfirmTitle,
      strings.clearHistoryConfirmMessage,
      [
        { text: strings.cancel, style: "cancel" },
        { text: strings.clear, style: "destructive", onPress: clearHistory },
      ]
    );
  };

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
          {strings.settingsTitle}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <SettingSegmentedRow
            label={strings.languageLabel}
            options={[
              { value: "he", label: strings.languageHebrew },
              { value: "en", label: strings.languageEnglish },
            ]}
            selected={settings.language}
            onSelect={(language) => {
              stopSpeech();
              updateSettings({ language });
            }}
          />
        </View>

        <View style={styles.section}>
          <SettingSwitchRow
            label={strings.autoSpeechLabel}
            value={settings.autoSpeech}
            onValueChange={(autoSpeech) => updateSettings({ autoSpeech })}
          />
          <SettingSegmentedRow
            label={strings.speechRateLabel}
            options={[
              { value: "slow", label: strings.rateSlow },
              { value: "normal", label: strings.rateNormal },
              { value: "fast", label: strings.rateFast },
            ]}
            selected={settings.speechRate}
            onSelect={(speechRate) => updateSettings({ speechRate })}
          />
          <SettingSwitchRow
            label={strings.hapticsLabel}
            value={settings.haptics}
            onValueChange={(haptics) => updateSettings({ haptics })}
          />
        </View>

        <View style={styles.section}>
          <Pressable
            onPress={confirmClearHistory}
            accessibilityRole="button"
            accessibilityLabel={strings.clearHistoryLabel}
            style={({ pressed }) => [
              styles.clearButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={styles.clearButtonText}>
              {strings.clearHistoryLabel}
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.aboutTitle, isRTL && styles.textRTL]}
            accessibilityRole="header"
          >
            {strings.aboutTitle}
          </Text>
          <Text
            style={[
              styles.aboutText,
              isRTL && styles.textRTL,
              { writingDirection: isRTL ? "rtl" : "ltr" },
            ]}
          >
            {strings.aboutText}
          </Text>
        </View>
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
  },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  clearButton: {
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: "700",
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
  textRTL: {
    textAlign: "right",
  },
});
