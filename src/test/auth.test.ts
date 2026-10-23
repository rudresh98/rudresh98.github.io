import { describe, expect, it } from "vitest";

import {
  authCopy,
  errorCode,
  firebaseConfig,
  initials,
  parseFirebaseConfig,
  signInErrorMessage,
  toAuthUser,
} from "@/lib/auth";
import { enableFirebase } from "./firebase-env";

const complete = {
  apiKey: "key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo",
  storageBucket: "demo.firebasestorage.app",
  messagingSenderId: "1",
  appId: "1:1:web:1",
};

describe("Firebase config", () => {
  it("accepts a complete config and trims each value", () => {
    expect(parseFirebaseConfig({ ...complete, apiKey: "  key  " })).toEqual(
      complete,
    );
  });

  it("turns sign-in off when any value is missing or blank", () => {
    for (const key of Object.keys(complete) as (keyof typeof complete)[]) {
      expect(parseFirebaseConfig({ ...complete, [key]: undefined })).toBeNull();
      expect(parseFirebaseConfig({ ...complete, [key]: "  " })).toBeNull();
    }
  });

  it("reads the build-time env", () => {
    expect(firebaseConfig()).toBeNull();
    enableFirebase();
    expect(firebaseConfig()).toMatchObject({
      projectId: "test",
      authDomain: "test.firebaseapp.com",
    });
  });
});

describe("Signed-in user", () => {
  it("keeps only what the site uses, tolerating missing profile fields", () => {
    expect(
      toAuthUser({
        uid: "u1",
        displayName: " Ada Lovelace ",
        email: "ada@example.com",
        photoURL: "https://example.com/ada.png",
      }),
    ).toEqual({
      uid: "u1",
      name: "Ada Lovelace",
      email: "ada@example.com",
      photoURL: "https://example.com/ada.png",
    });
    expect(
      toAuthUser({ uid: "u2", displayName: null, email: null, photoURL: null }),
    ).toEqual({ uid: "u2", name: "", email: "", photoURL: null });
  });

  it("builds avatar initials from the name, then the email", () => {
    expect(initials("Ada King Lovelace", "ada@example.com")).toBe("AK");
    expect(initials("ada", "")).toBe("A");
    expect(initials("", "zoe@example.com")).toBe("Z");
    expect(initials("", "")).toBe("?");
  });

  it("names the account in the sign-in message", () => {
    const user = { uid: "u", name: "", email: "a@b.co", photoURL: null };
    expect(authCopy.signedIn(user)).toBe("Signed in as a@b.co");
    expect(authCopy.signedIn({ ...user, name: "Ada" })).toBe(
      "Signed in as Ada",
    );
  });
});

describe("Sign-in errors", () => {
  it("stays quiet when the visitor closes the popup", () => {
    for (const code of [
      "auth/popup-closed-by-user",
      "auth/cancelled-popup-request",
      "auth/user-cancelled",
    ])
      expect(signInErrorMessage(code)).toBeNull();
  });

  it("explains blocked popups, missing setup, and network trouble", () => {
    expect(signInErrorMessage("auth/popup-blocked")).toMatch(/Allow pop-ups/);
    expect(signInErrorMessage("auth/unauthorized-domain")).toMatch(
      /isn't set up/,
    );
    expect(signInErrorMessage("auth/operation-not-allowed")).toMatch(
      /isn't set up/,
    );
    expect(signInErrorMessage("auth/network-request-failed")).toMatch(
      /Couldn't reach Google/,
    );
    expect(signInErrorMessage(undefined)).toMatch(/Please try again/);
  });

  it("reads Firebase error codes defensively", () => {
    expect(errorCode({ code: "auth/popup-blocked" })).toBe(
      "auth/popup-blocked",
    );
    expect(errorCode(new Error("offline"))).toBeUndefined();
    expect(errorCode(null)).toBeUndefined();
    expect(errorCode({ code: 42 })).toBeUndefined();
  });
});
