import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Home Page</h1>
      <p>This is the home page</p>
      <Link href="/admin">Admin</Link>
    </main>
  )
}