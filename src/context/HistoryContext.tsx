import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  loadHistory,
  saveHistory,
  MAX_HISTORY_ENTRIES,
  type HistoryEntry,
} from "../services/storage";

type HistoryContextValue = {
  history: HistoryEntry[];
  addToHistory: (pokemonId: number) => void;
  clearHistory: () => void;
};

const HistoryContext = createContext<HistoryContextValue | undefined>(
  undefined
);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadHistory().then((loaded) => {
      if (!cancelled) setHistory(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const addToHistory = useCallback((pokemonId: number) => {
    setHistory((prev) => {
      const next = [
        { pokemonId, selectedAt: Date.now() },
        ...prev,
      ].slice(0, MAX_HISTORY_ENTRIES);
      void saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    void saveHistory([]);
  }, []);

  const value = useMemo(
    () => ({ history, addToHistory, clearHistory }),
    [history, addToHistory, clearHistory]
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextValue {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used inside HistoryProvider");
  }
  return context;
}
