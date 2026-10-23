import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AccountMenu } from "@/components/portfolio/account-menu";
import { AuthProvider } from "@/components/portfolio/auth";
import { SIGNED_IN_HINT_KEY } from "@/lib/auth";
import { enableFirebase } from "./firebase-env";
import { googleUser } from "./firebase-mock";

const firebase = await vi.hoisted(async () =>
  (await import("./firebase-mock")).createFirebaseMock(),
);
vi.mock("@/lib/firebase", () => firebase.module);
vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}));

function renderMenu({ disabled = false } = {}) {
  return render(
    <AuthProvider disabled={disabled}>
      <AccountMenu />
    </AuthProvider>,
  );
}
const signInButton = () =>
  screen.findByRole("button", { name: "Sign in with Google" });

beforeEach(() => firebase.reset());
afterEach(() => localStorage.clear());

describe("Account menu", () => {
  it("offers no sign-in when Firebase isn't configured", () => {
    renderMenu();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(firebase.loadFirebaseAuth).not.toHaveBeenCalled();
  });

  it("stays off in dock previews, even for a returning visitor", () => {
    enableFirebase();
    localStorage.setItem(SIGNED_IN_HINT_KEY, "1");
    renderMenu({ disabled: true });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(firebase.loadFirebaseAuth).not.toHaveBeenCalled();
  });

  it("downloads nothing for a first-time visitor until they sign in", async () => {
    enableFirebase();
    renderMenu();
    const button = await signInButton();
    expect(firebase.loadFirebaseAuth).not.toHaveBeenCalled();

    fireEvent.click(button);
    expect(
      await screen.findByRole("button", { name: "Account: Ada Lovelace" }),
    ).toBeInTheDocument();
    expect(firebase.sdk.signIn).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Signed in as Ada Lovelace");
    expect(localStorage.getItem(SIGNED_IN_HINT_KEY)).toBe("1");
  });

  it("opens the popup in the click itself once focus has loaded the SDK", async () => {
    enableFirebase();
    renderMenu();
    const button = await signInButton();
    fireEvent.focus(button);
    await waitFor(() => expect(firebase.state.loaded).toBe(true));

    fireEvent.click(button);
    // Synchronous: no download between the click and the popup, so browsers don't block it.
    expect(firebase.sdk.signIn).toHaveBeenCalledTimes(1);
    await screen.findByRole("button", { name: "Account: Ada Lovelace" });
  });

  it("stays quiet when the popup is closed, and explains a blocked one", async () => {
    enableFirebase();
    renderMenu();
    const button = await signInButton();

    firebase.sdk.signIn.mockRejectedValueOnce({
      code: "auth/popup-closed-by-user",
    });
    fireEvent.click(button);
    await waitFor(() => expect(button).toBeEnabled());
    expect(toast.error).not.toHaveBeenCalled();

    firebase.sdk.signIn.mockRejectedValueOnce({ code: "auth/popup-blocked" });
    fireEvent.click(button);
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/Allow pop-ups/),
      ),
    );
    expect(await signInButton()).toBeInTheDocument();
  });

  it("restores a returning visitor's session and signs out from the menu", async () => {
    enableFirebase();
    localStorage.setItem(SIGNED_IN_HINT_KEY, "1");
    firebase.state.current = googleUser;
    renderMenu();

    const trigger = await screen.findByRole("button", {
      name: "Account: Ada Lovelace",
    });
    expect(trigger).toHaveTextContent("AL");
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(await screen.findByText("ada@example.com")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(await signInButton()).toBeInTheDocument();
    expect(firebase.sdk.signOut).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith("Signed out");
    expect(localStorage.getItem(SIGNED_IN_HINT_KEY)).toBeNull();
  });

  it("forgets a stale session hint", async () => {
    enableFirebase();
    localStorage.setItem(SIGNED_IN_HINT_KEY, "1");
    renderMenu();
    expect(await signInButton()).toBeInTheDocument();
    await waitFor(() =>
      expect(localStorage.getItem(SIGNED_IN_HINT_KEY)).toBeNull(),
    );
  });
});
