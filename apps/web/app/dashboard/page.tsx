"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

type Me = { id: string; email: string; name: string | null };
type Portfolio = {
  id: string;
  title: string;
  slug: string;
  bio: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [error, setError] = useState("");

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (!saved) {
      router.replace("/login");
      return;
    }
    setToken(saved);
    Promise.all([
      api<Me>("/auth/me", { token: saved }),
      api<Portfolio[]>("/portfolios", { token: saved }),
    ])
      .then(([user, list]) => {
        setMe(user);
        setPortfolios(list);
      })
      .catch(logout);
  }, [router, logout]);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setError("");

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    try {
      const created = await api<Portfolio>("/portfolios", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: form.get("title"),
          slug: form.get("slug"),
          bio: form.get("bio") || undefined,
        }),
      });
      setPortfolios((prev) => [created, ...prev]);
      formEl.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create portfolio",
      );
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    setError("");
    try {
      await api(`/portfolios/${id}`, { method: "DELETE", token });
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete portfolio",
      );
    }
  }

  if (!me) return <p className="p-8">Loading...</p>;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hello, {me.name ?? me.email}</h1>
        <button onClick={logout} className="rounded border px-3 py-2">
          Log out
        </button>
      </div>

      <h2 className="mt-12 text-xl font-semibold">New portfolio</h2>
      <form onSubmit={handleCreate} className="mt-4 space-y-3">
        <input
          name="title"
          placeholder="Title"
          required
          className="w-full rounded border px-3 py-2"
        />
        <input
          name="slug"
          placeholder="slug (e.g. my-portfolio)"
          required
          className="w-full rounded border px-3 py-2"
        />
        <textarea
          name="bio"
          placeholder="Short bio (optional)"
          className="w-full rounded border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Create
        </button>
      </form>

      <h2 className="mt-12 text-xl font-semibold">Your portfolios</h2>
      {portfolios.length === 0 ? (
        <p className="mt-4 text-neutral-500">Nothing here yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {portfolios.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold">{p.title}</p>
                <Link
                  href={`/p/${p.slug}`}
                  className="text-sm text-blue-600 underline"
                >
                  /p/{p.slug}
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/dashboard/${p.id}`} className="text-sm underline">
                  Manage
                </Link>
                
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
