import { vi } from "vitest";

// Turns Google sign-in on for one test; setup.ts blanks these again before the next.
export function enableFirebase() {
  vi.stubEnv("VITE_FIREBASE_API_KEY", "test-api-key");
  vi.stubEnv("VITE_FIREBASE_AUTH_DOMAIN", "test.firebaseapp.com");
  vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "test");
  vi.stubEnv("VITE_FIREBASE_STORAGE_BUCKET", "test.firebasestorage.app");
  vi.stubEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "1");
  vi.stubEnv("VITE_FIREBASE_APP_ID", "1:1:web:1");
}
