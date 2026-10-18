import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "motion/react";
import {
  A11Y_STORAGE_KEY,
  REDUCED_MOTION_QUERY,
  applyPrefs,
  defaultPrefs,
  readPrefs,
  writePrefs,
  type AccessibilityPrefs,
} from "@/lib/accessibility";

type AccessibilityContextValue = {
  prefs: AccessibilityPrefs;
  // False until saved settings are read after hydration.
  ready: boolean;
  systemReducedMotion: boolean;
  update: (change: Partial<AccessibilityPrefs>) => void;
  reset: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null,
);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Server and first client render use defaults so hydration matches; the boot script has already
  // applied the saved attributes to <html>, and they're left alone until storage is read.
  const [prefs, setPrefs] = useState<AccessibilityPrefs | null>(null);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const syncMotion = () => setSystemReducedMotion(media.matches);
    // Another tab changed the settings.
    const syncStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === A11Y_STORAGE_KEY)
        setPrefs(readPrefs());
    };
    syncMotion();
    setPrefs(readPrefs());
    media.addEventListener("change", syncMotion);
    window.addEventListener("storage", syncStorage);
    return () => {
      media.removeEventListener("change", syncMotion);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  useEffect(() => {
    if (prefs) applyPrefs(document.documentElement, prefs, systemReducedMotion);
  }, [prefs, systemReducedMotion]);

  const update = useCallback((change: Partial<AccessibilityPrefs>) => {
    setPrefs((current) => {
      const next = { ...(current ?? readPrefs()), ...change };
      writePrefs(next);
      return next;
    });
  }, []);
  const reset = useCallback(() => {
    writePrefs(defaultPrefs);
    setPrefs(defaultPrefs);
  }, []);

  const value = useMemo(
    () => ({
      prefs: prefs ?? defaultPrefs,
      ready: prefs !== null,
      systemReducedMotion,
      update,
      reset,
    }),
    [prefs, systemReducedMotion, update, reset],
  );
  // Until settings load, motion follows the OS as before; afterwards the effective setting drives it,
  // and every component reads it through useReducedMotionConfig.
  const reducedMotion = !prefs
    ? "user"
    : prefs.reduceMotion || systemReducedMotion
      ? "always"
      : "never";

  return (
    <AccessibilityContext.Provider value={value}>
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context)
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider",
    );
  return context;
}

// Hydration-safe: false on the server and the first client render, then the live effective setting.
export function useReducedMotionSetting() {
  const { ready, prefs, systemReducedMotion } = useAccessibility();
  return ready && (prefs.reduceMotion || systemReducedMotion);
}
