"use client";

import {
  useActionState,
  useEffect,
  useRef,
} from "react";

import {
  loginAction,
  type LoginState,
} from "@/actions/auth-actions";

const initialState: LoginState = {
  error: null,
};

export function LoginForm() {
  const [state, formAction, isPending] =
    useActionState(loginAction, initialState);

  const emailInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  return (
    <form
      action={formAction}
      className="
        w-full max-w-md rounded-3xl
        border border-neutral-800
        bg-neutral-900 p-8
      "
    >
      <header className="mb-8">
        <p className="text-sm text-neutral-500">
          Portfolio administration
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Sign in
        </h1>
      </header>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm text-neutral-300">
            Email
          </span>

          <input
            ref={emailInputRef}
            type="email"
            name="email"
            required
            autoComplete="email"
            disabled={isPending}
            className="
              w-full rounded-xl border border-neutral-700
              bg-neutral-950 px-4 py-3 text-white
              outline-none
              focus:border-neutral-400
              disabled:opacity-60
            "
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-neutral-300">
            Password
          </span>

          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            disabled={isPending}
            className="
              w-full rounded-xl border border-neutral-700
              bg-neutral-950 px-4 py-3 text-white
              outline-none
              focus:border-neutral-400
              disabled:opacity-60
            "
          />
        </label>
      </div>

      <div className="mt-4 min-h-6">
        {state.error && (
          <p
            role="alert"
            className="text-sm text-red-400"
          >
            {state.error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="
          mt-4 w-full rounded-xl bg-white
          px-4 py-3 font-medium text-black
          hover:bg-neutral-200
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {isPending
          ? "Signing in..."
          : "Sign in"}
      </button>
    </form>
  );
}