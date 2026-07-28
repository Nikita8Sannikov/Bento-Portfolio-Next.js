import { BentoEditor } from "@/components/editor/BentoEditor";
import { initialTiles } from "@/data/initial-tiles";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <BentoEditor initialTiles={initialTiles} />
      </div>
    </main>
  );
}
