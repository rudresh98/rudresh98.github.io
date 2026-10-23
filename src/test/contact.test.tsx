import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/components/portfolio/auth";
import { Route } from "@/routes/contact";
import { enableFirebase } from "./firebase-env";

const firebase = await vi.hoisted(async () =>
  (await import("./firebase-mock")).createFirebaseMock(),
);
vi.mock("@/lib/firebase", () => firebase.module);

const ContactPage = Route.options.component!;
const renderContact = () =>
  render(
    <AuthProvider>
      <ContactPage />
    </AuthProvider>,
  );
const field = (name: string) =>
  screen.getByRole("textbox", { name }) as HTMLInputElement;

beforeEach(() => firebase.reset());

describe("Contact form with Google sign-in", () => {
  it("doesn't mention sign-in when Firebase isn't configured", () => {
    renderContact();
    expect(
      screen.queryByRole("button", { name: "Sign in with Google" }),
    ).not.toBeInTheDocument();
  });

  it("fills empty name and email fields after signing in, keeping typed values", async () => {
    enableFirebase();
    renderContact();
    fireEvent.change(field("Name"), { target: { value: "Ada L." } });

    fireEvent.click(
      await screen.findByRole("button", { name: "Sign in with Google" }),
    );
    await waitFor(() =>
      expect(field("Work email")).toHaveValue("ada@example.com"),
    );
    expect(field("Name")).toHaveValue("Ada L.");
    expect(
      screen.queryByRole("button", { name: "Sign in with Google" }),
    ).not.toBeInTheDocument();
  });
});
