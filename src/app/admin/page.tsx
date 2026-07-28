"use client";
export default function AdminPage() {
  return (
    <main>
      <header>
        <div>
          <p>Bento Portfolio</p>
          <h1>Portfolio editor</h1>
        </div>

        <button type="button" onClick={() => console.log("Add tile")}>
          Add tile
        </button>
      </header>
    </main>
  );
}
