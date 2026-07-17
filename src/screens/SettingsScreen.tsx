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
import {
  COLORS,
  MIN_TOUCH,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";
import { DEFAULT_THEME } from "../theme/typeColors";
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
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backIcon}>{isRTL ? "→" : "←"}</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          {strings.settingsTitle}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
              pressed && styles.clearButtonPressed,
            ]}
          >
            <Text style={styles.clearButtonText}>
              {strings.clearHistoryLabel}
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={[styles.aboutHeader, isRTL && styles.headerRTL]}>
            <View
              style={[
                styles.aboutAccent,
                { backgroundColor: DEFAULT_THEME.accent },
              ]}
            />
            <Text
              style={[styles.aboutTitle, isRTL && styles.textRTL]}
              accessibilityRole="header"
            >
              {strings.aboutTitle}
            </Text>
          </View>
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
  section: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    marginBottom: SPACING.m,
    ...SHADOWS.subtle,
  },
  clearButton: {
    minHeight: MIN_TOUCH,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    backgroundColor: COLORS.dangerBackground,
    paddingHorizontal: SPACING.m,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  clearButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.danger,
  },
  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.s,
    marginTop: SPACING.s,
    marginBottom: SPACING.s,
  },
  aboutAccent: {
    width: 4,
    height: 20,
    borderRadius: RADIUS.pill,
  },
  aboutTitle: {
    ...TYPOGRAPHY.sectionTitle,
    color: COLORS.text,
    flex: 1,
  },
  aboutText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    paddingBottom: SPACING.s,
  },
  textRTL: {
    textAlign: "right",
  },
});
