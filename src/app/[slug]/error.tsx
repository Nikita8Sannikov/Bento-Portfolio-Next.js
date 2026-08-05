"use client";

import { useEffect } from "react";

type PortfolioErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function PortfolioError({
  error,
  reset,
}: PortfolioErrorProps) {
  useEffect(() => {
    console.error("Portfolio page failed:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="max-w-md text-center">
        <p className="text-sm text-neutral-500">
          Something went wrong
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Failed to load portfolio
        </h1>

        <p className="mt-4 text-neutral-400">
          The portfolio could not be loaded. Try again.
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