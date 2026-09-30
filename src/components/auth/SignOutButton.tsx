"use client";

import { useState } from "react";

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);

    try {
      const csrfResponse = await fetch("/api/auth/csrf");
      const csrfPayload = (await csrfResponse.json()) as {
        csrfToken?: string;
      };

      if (!csrfResponse.ok || !csrfPayload.csrfToken) {
        throw new Error("Could not start sign out");
      }

      const signOutResponse = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Auth-Return-Redirect": "1",
        },
        body: new URLSearchParams({
          csrfToken: csrfPayload.csrfToken,
          callbackUrl: "/",
        }),
      });

      if (!signOutResponse.ok) {
        throw new Error("Sign out failed");
      }

      window.location.assign("/");
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleSignOut();
      }}
      disabled={isPending}
      className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:border-neutral-500 hover:text-white disabled:opacity-60"
    >
      Sign out
    </button>
  );
}
