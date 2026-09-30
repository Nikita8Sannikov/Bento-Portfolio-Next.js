"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import {
  signIn,
  signOut,
} from "@/auth";

export type LoginState = {
  error: string | null;
};

export async function loginAction(
  previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });

    return {
      error: null,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Неверный email или пароль.",
      };
    }

    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  // Auth.js turns redirectTo into an absolute URL from the request host.
  // On Render that host is the internal bind address (0.0.0.0:10000), so the
  // browser receives a cached public page instead of a sign-out redirect.
  await signOut({
    redirect: false,
  });

  redirect("/");
}