import Link from "next/link";

export default function PortfolioNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
      <h1 className="text-4xl font-semibold">
        Portfolio not found
      </h1>

      <p className="text-neutral-400">
        This portfolio does not exist or is not published.
      </p>

      <Link
        href="/"
        className="rounded-xl bg-white px-4 py-2 text-black"
      >
        Go home
      </Link>
    </main>
  );
}