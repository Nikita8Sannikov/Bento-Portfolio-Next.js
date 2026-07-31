"use server";

import { AuthError } from "next-auth";

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
  await signOut({
    redirectTo: "/",
  });
}