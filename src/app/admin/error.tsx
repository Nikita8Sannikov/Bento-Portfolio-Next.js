"use client";

import { useEffect } from "react";

type AdminErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function AdminError({
  error,
  reset,
}: AdminErrorProps) {
  useEffect(() => {
    console.error("Admin page failed:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold">
          Editor unavailable
        </h1>

        <p className="mt-4 text-neutral-400">
          The portfolio editor could not be loaded.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-white px-4 py-2 font-medium text-black"
        >
          Try again
        </button>
      </div>
    </main>
  );
}