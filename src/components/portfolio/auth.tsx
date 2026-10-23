import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Unsubscribe } from "firebase/auth";
import { toast } from "sonner";
import {
  authCopy,
  errorCode,
  firebaseConfig,
  readSignedInHint,
  signInErrorMessage,
  toAuthUser,
  writeSignedInHint,
  type AuthStatus,
  type AuthUser,
} from "@/lib/auth";
import { loadFirebaseAuth, loadedFirebaseAuth } from "@/lib/firebase";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  // A sign-in or sign-out is in flight.
  pending: boolean;
  // Starts downloading the SDK on hover or focus, so the click can open the popup straight away.
  warm: () => void;
  signIn: () => void;
  signOut: () => void;
};

const noop = () => {};
const disabledAuth: AuthContextValue = {
  status: "disabled",
  user: null,
  pending: false,
  warm: noop,
  signIn: noop,
  signOut: noop,
};

// Outside the provider (isolated component tests, dock previews) sign-in simply isn't offered.
const AuthContext = createContext<AuthContextValue>(disabledAuth);

export function AuthProvider({
  children,
  disabled = false,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  // Inlined at build time, so the server and first client render agree and hydration matches.
  const config = useMemo(
    () => (disabled ? null : firebaseConfig()),
    [disabled],
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [known, setKnown] = useState(false);
  const [pending, setPending] = useState(false);
  const unsubscribe = useRef<Unsubscribe | null>(null);

  const connect = useCallback(async () => {
    if (!config) throw new Error("Firebase is not configured");
    const sdk = await loadFirebaseAuth(config);
    unsubscribe.current ??= sdk.subscribe((next) => {
      setUser(next ? toAuthUser(next) : null);
      setKnown(true);
      writeSignedInHint(next !== null);
    });
    return sdk;
  }, [config]);

  useEffect(() => {
    if (!config) return;
    // Only a returning visitor (or an already-loaded SDK) pays for the download on page load.
    if (readSignedInHint() || loadedFirebaseAuth())
      connect().catch(() => setKnown(true));
    else setKnown(true);
    return () => {
      unsubscribe.current?.();
      unsubscribe.current = null;
    };
  }, [config, connect]);

  const warm = useCallback(() => {
    if (config && !loadedFirebaseAuth()) connect().catch(noop);
  }, [config, connect]);

  const signIn = useCallback(() => {
    if (!config) return;
    setPending(true);
    const ready = loadedFirebaseAuth();
    // With the SDK loaded, the popup opens in the same task as the click, so browsers treat it as
    // user-initiated; otherwise it opens as soon as the download finishes.
    const popup = ready
      ? ready.signIn()
      : connect().then((sdk) => sdk.signIn());
    popup
      .then(
        (next) => {
          const signedIn = toAuthUser(next);
          setUser(signedIn);
          setKnown(true);
          writeSignedInHint(true);
          toast.success(authCopy.signedIn(signedIn));
        },
        (error: unknown) => {
          const message = signInErrorMessage(errorCode(error));
          if (message) toast.error(message);
        },
      )
      .finally(() => setPending(false));
  }, [config, connect]);

  const signOut = useCallback(() => {
    const ready = loadedFirebaseAuth();
    if (!ready) return;
    setPending(true);
    ready
      .signOut()
      .then(
        () => {
          setUser(null);
          writeSignedInHint(false);
          toast(authCopy.signedOut);
        },
        () => toast.error(authCopy.signOutFailed),
      )
      .finally(() => setPending(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () =>
      config
        ? {
            status: !known ? "unknown" : user ? "signed-in" : "signed-out",
            user,
            pending,
            warm,
            signIn,
            signOut,
          }
        : disabledAuth,
    [config, known, user, pending, warm, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
