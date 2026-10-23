// Google sign-in through Firebase. This module never imports the Firebase SDK, so it is safe anywhere,
// including prerender; the SDK loads lazily in the browser from ./firebase. Sign-in is only used to show
// the visitor's account and fill in the Contact form, so the copy never promises more than that.

export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export type AuthUser = {
  uid: string;
  // Either may be empty: Google accounts don't always share a display name.
  name: string;
  email: string;
  photoURL: string | null;
};

// "unknown" until the browser has checked for a saved session; "disabled" when config is missing.
export type AuthStatus = "disabled" | "unknown" | "signed-out" | "signed-in";

export const authCopy = {
  signIn: "Sign in with Google",
  signOut: "Sign out",
  signedIn: (user: AuthUser) => `Signed in as ${user.name || user.email}`,
  signedOut: "Signed out",
  signOutFailed: "Couldn't sign out. Please try again.",
  contactPrompt: "to fill in your name and email.",
};

// Set while signed in so a returning visitor's session is restored on load; everyone else downloads no
// Firebase code until they reach for sign-in.
export const SIGNED_IN_HINT_KEY = "portfolio-signed-in";

const configKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const satisfies readonly (keyof FirebaseWebConfig)[];

export function parseFirebaseConfig(
  values: Partial<Record<keyof FirebaseWebConfig, string | undefined>>,
): FirebaseWebConfig | null {
  const config: Partial<FirebaseWebConfig> = {};
  for (const key of configKeys) {
    const value = values[key]?.trim();
    if (!value) return null;
    config[key] = value;
  }
  return config as FirebaseWebConfig;
}

// Read on call rather than at module load, so tests can stub the env per case.
export function firebaseConfig() {
  return parseFirebaseConfig({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });
}

export function toAuthUser(user: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}): AuthUser {
  return {
    uid: user.uid,
    name: user.displayName?.trim() ?? "",
    email: user.email ?? "",
    photoURL: user.photoURL,
  };
}

export function initials(name: string, email: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length)
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  return email.charAt(0).toUpperCase() || "?";
}

export function errorCode(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
    ? error.code
    : undefined;
}

// null means say nothing: the visitor closed the popup themselves.
export function signInErrorMessage(code: string | undefined): string | null {
  switch (code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
    case "auth/user-cancelled":
      return null;
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.";
    case "auth/unauthorized-domain":
    case "auth/operation-not-allowed":
      return "Google sign-in isn't set up for this address yet.";
    case "auth/network-request-failed":
      return "Couldn't reach Google. Check your connection and try again.";
    default:
      return "Couldn't sign in with Google. Please try again.";
  }
}

export function readSignedInHint() {
  try {
    return localStorage.getItem(SIGNED_IN_HINT_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeSignedInHint(signedIn: boolean) {
  try {
    if (signedIn) localStorage.setItem(SIGNED_IN_HINT_KEY, "1");
    else localStorage.removeItem(SIGNED_IN_HINT_KEY);
  } catch {
    /* Without storage, a returning visitor just signs in again. */
  }
}
