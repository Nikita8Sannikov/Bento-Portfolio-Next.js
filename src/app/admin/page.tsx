import { BentoEditor } from "@/components/editor/BentoEditor";
import { initialTiles } from "@/data/initial-tiles";
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-neutral-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-neutral-400 hover:text-white">
            Public portfolio
          </Link>
        </nav>

        <BentoEditor initialTiles={initialTiles} />
      </div>
    </main>
  );
}
