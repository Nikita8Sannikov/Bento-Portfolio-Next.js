import { BentoEditorLoader } from "@/components/editor/BentoEditorLoader";
import { getTiles } from "@/lib/tiles/get-tiles";
import Link from "next/link";

export default async function AdminPage() {
  const tiles = await getTiles();
  return (
    <main className="min-h-screen overflow-x-hidden bg-neutral-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6">

          <Link href="/" className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:border-neutral-500 hover:text-white">
            Public portfolio
          </Link>
        </nav>

        {/* <BentoEditor initialTiles={initialTiles} /> */}
        <BentoEditorLoader initialTiles={tiles} />
      </div>
    </main>
  );
}
