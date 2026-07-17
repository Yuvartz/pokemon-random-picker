import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type Settings,
} from "../services/storage";
import { getStrings, type Strings } from "../localization/strings";

type SettingsContextValue = {
  settings: Settings;
  /** True once persisted settings have been loaded. */
  ready: boolean;
  strings: Strings;
  isRTL: boolean;
  updateSettings: (patch: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadSettings().then((loaded) => {
      if (!cancelled) {
        setSettings(loaded);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void saveSettings(next);
      return next;
    });
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      ready,
      strings: getStrings(settings.language),
      isRTL: settings.language === "he",
      updateSettings,
    }),
    [settings, ready, updateSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return context;
}
