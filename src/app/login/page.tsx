import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="
      flex min-h-screen items-center justify-center
      bg-neutral-950 px-4 py-8 text-white
    ">
      <LoginForm />
    </main>
  );
}