"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Me = { id: string; email: string; name: string | null };

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    api<Me>("/auth/me", { token })
      .then(setMe)
      .catch(() => {
        localStorage.removeItem("token");
        router.replace("/login");
      });
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (!me) return <p className="p-8">Loading...</p>;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Hello, {me.name ?? me.email}</h1>
      <button onClick={logout} className="mt-6 rounded border px-3 py-2">
        Log out
      </button>
    </main>
  );
}