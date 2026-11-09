"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";

type Project = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
};

type Portfolio = {
  id: string;
  title: string;
  slug: string;
  bio: string | null;
  projects: Project[];
};

export default function ManagePortfolioPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (!saved) {
      router.replace("/login");
      return;
    }
    setToken(saved);
    api<Portfolio>(`/portfolios/${id}`, { token: saved })
      .then(setPortfolio)
      .catch(() => router.replace("/dashboard"));
  }, [id, router]);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setError("");

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    try {
      const created = await api<Project>(`/portfolios/${id}/projects`, {
        method: "POST",
        token,
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description") || undefined,
          url: form.get("url") || undefined,
        }),
      });
      setPortfolio((prev) => prev && { ...prev, projects: [...prev.projects, created] });
      formEl.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add project");
    }
  }

  async function handleDelete(projectId: string) {
    if (!token) return;
    setError("");
    try {
      await api(`/portfolios/${id}/projects/${projectId}`, { method: "DELETE", token });
      setPortfolio(
        (prev) => prev && { ...prev, projects: prev.projects.filter((p) => p.id !== projectId) },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  }

  if (!portfolio) return <p className="p-8">Loading...</p>;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/dashboard" className="text-sm text-neutral-500 underline">
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{portfolio.title}</h1>
      <Link href={`/p/${portfolio.slug}`} className="text-sm text-blue-600 underline">
        View public page (/p/{portfolio.slug})
      </Link>

      <h2 className="mt-12 text-xl font-semibold">Add a project</h2>
      <form onSubmit={handleAdd} className="mt-4 space-y-3">
        <input name="title" placeholder="Title" required className="w-full rounded border px-3 py-2" />
        <textarea
          name="description"
          placeholder="Description (optional)"
          className="w-full rounded border px-3 py-2"
        />
        <input
          name="url"
          type="url"
          placeholder="https://github.com/... (optional)"
          className="w-full rounded border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Add project
        </button>
      </form>

      <h2 className="mt-12 text-xl font-semibold">Projects</h2>
      {portfolio.projects.length === 0 ? (
        <p className="mt-4 text-neutral-500">No projects yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {portfolio.projects.map((project) => (
            <li key={project.id} className="flex items-start justify-between rounded-lg border p-4">
              <div>
                <p className="font-semibold">{project.title}</p>
                {project.description && <p className="text-neutral-600">{project.description}</p>}
                {project.url && (
                  <a href={project.url} className="text-sm text-blue-600 underline">
                    {project.url}
                  </a>
                )}
              </div>
              <button onClick={() => handleDelete(project.id)} className="text-sm text-red-600">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}