"use client";

type GlobalErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  console.error("Application failed:", error);

  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white">
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold">
              Application error
            </h1>

            <p className="mt-4 text-neutral-400">
              An unexpected error occurred.
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
      </body>
    </html>
  );
}