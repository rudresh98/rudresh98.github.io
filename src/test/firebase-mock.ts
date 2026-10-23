import { vi } from "vitest";

// A stand-in for the lazy Firebase loader. A test file creates one through
// `await vi.hoisted(async () => (await import("./firebase-mock")).createFirebaseMock())`
// and wires it up with `vi.mock("@/lib/firebase", () => firebase.module)`.
export type FakeGoogleUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

export const googleUser: FakeGoogleUser = {
  uid: "u1",
  displayName: "Ada Lovelace",
  email: "ada@example.com",
  photoURL: null,
};

export function createFirebaseMock() {
  let listener: ((user: FakeGoogleUser | null) => void) | null = null;
  const state = { loaded: false, current: null as FakeGoogleUser | null };
  const sdk = {
    signIn: vi.fn(async () => {
      state.current = googleUser;
      return googleUser;
    }),
    signOut: vi.fn(async () => {
      state.current = null;
      listener?.(null);
    }),
    // Firebase reports the current session as soon as a listener subscribes.
    subscribe: vi.fn((next: (user: FakeGoogleUser | null) => void) => {
      listener = next;
      next(state.current);
      return () => {
        listener = null;
      };
    }),
  };
  const loadFirebaseAuth = vi.fn(async () => {
    state.loaded = true;
    return sdk;
  });
  return {
    state,
    sdk,
    loadFirebaseAuth,
    module: {
      loadFirebaseAuth,
      loadedFirebaseAuth: () => (state.loaded ? sdk : null),
    },
    reset() {
      state.loaded = false;
      state.current = null;
      listener = null;
      vi.clearAllMocks();
    },
  };
}
