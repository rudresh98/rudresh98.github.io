import type { Unsubscribe, User } from "firebase/auth";
import type { FirebaseWebConfig } from "./auth";

// The only place the Firebase SDK is imported, and only dynamically: it never runs at module load or
// during prerender, and stays out of the main bundle until a visitor needs it.
export type FirebaseAuthSdk = {
  signIn: () => Promise<User>;
  signOut: () => Promise<void>;
  subscribe: (next: (user: User | null) => void) => Unsubscribe;
};

let pending: Promise<FirebaseAuthSdk> | null = null;
let loaded: FirebaseAuthSdk | null = null;

export function loadFirebaseAuth(config: FirebaseWebConfig) {
  pending ??= Promise.all([
    import("firebase/app"),
    import("firebase/auth"),
  ]).then(
    ([app, auth]) => {
      // Reuse the app across hot reloads instead of initializing it twice.
      const instance = auth.getAuth(
        app.getApps()[0] ?? app.initializeApp(config),
      );
      const provider = new auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      loaded = {
        // A popup, not a redirect: the auth domain is firebaseapp.com, and redirects break where
        // browsers block third-party storage.
        signIn: () =>
          auth.signInWithPopup(instance, provider).then(({ user }) => user),
        signOut: () => auth.signOut(instance),
        subscribe: (next) => auth.onAuthStateChanged(instance, next),
      };
      return loaded;
    },
    (error: unknown) => {
      // Let the next attempt retry the download.
      pending = null;
      throw error;
    },
  );
  return pending;
}

// Synchronous once loaded, so a click can open the popup in the same task and avoid popup blockers.
export function loadedFirebaseAuth() {
  return loaded;
}
