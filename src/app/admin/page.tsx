import { logoutAction } from "@/actions/auth-actions";
import { auth } from "@/auth";
import { BentoEditorLoader } from "@/components/editor/BentoEditorLoader";
import { getPortfolioBySlug } from "@/data/portfolios/get-portfolio-by-slug";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const portfolio = await getPortfolioBySlug("nikita");

  if (!portfolio) {
    throw new Error('Portfolio with slug "nikita" was not found');
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-neutral-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex justify-between">
          <Link
            href="/"
            className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:border-neutral-500 hover:text-white"
          >
            Public portfolio
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="
        rounded-xl border border-neutral-700
        px-4 py-2 text-sm text-neutral-300
        hover:border-neutral-500 hover:text-white
      "
            >
              Sign out
            </button>
          </form>
        </nav>

        {/* <BentoEditor initialTiles={initialTiles} /> */}
        <BentoEditorLoader
          portfolioId={portfolio.id}
          initialTiles={portfolio.tiles}
        />
      </div>
    </main>
  );
}
