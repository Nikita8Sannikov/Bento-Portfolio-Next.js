import { notFound } from "next/navigation";
import { PublicBentoGrid } from "@/components/bento/PublicBentoGrid";
import { getPortfolioBySlug } from "@/data/portfolios/get-portfolio-by-slug";
import Link from "next/link";

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

type PortfolioPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PortfolioPage({
  params,
}: PortfolioPageProps) {
  const { slug } = await params;

  const portfolio = await getPortfolioBySlug(slug, {
    publishedOnly: true,
  });

  if (!portfolio) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm text-neutral-400">Fullstack Developer</p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl">
              Nikita
            </h1>

            <p className="mt-4 max-w-2xl text-neutral-400">
              I build web applications and API integrations using TypeScript,
              React, Next.js and Node.js.
            </p>
          </div>

          <Link
            href="/admin"
            className="
              shrink-0 rounded-xl border border-neutral-700
              px-4 py-2 text-sm text-neutral-300
              hover:border-neutral-500 hover:text-white
            "
          >
            Open editor
          </Link>
        </header>

        <PublicBentoGrid tiles={portfolio.tiles} />
      </div>
    </main>
  );
}