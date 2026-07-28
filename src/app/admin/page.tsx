import { BentoGrid } from "@/components/bento/BentoGrid";
import { initialTiles } from "@/data/initial-tiles";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400">Bento Portfolio</p>
            <h1 className="text-3xl font-bold">Portfolio editor</h1>
          </div>

          <button
            type="button"
            className="rounded-xl bg-white px-4 py-2 font-medium text-black"
          >
            Add tile
          </button>
        </header>

        <BentoGrid tiles={initialTiles} />
      </div>
    </main>
  );
}
