import { notFound } from "next/navigation";

type Project = {
  title: string;
  description: string | null;
  url: string | null;
};

type Portfolio = {
  title: string;
  slug: string;
  bio: string | null;
  user: { name: string | null };
  projects: Project[];
};

async function getPortfolio(slug: string): Promise<Portfolio | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/p/${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );

  if (res.status === 400) return null;
  if (!res.ok) throw new Error("Failed to load portfolio");

  return res.json();
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-4xl font-bold">{portfolio.title}</h1>
      {portfolio.user.name && (
        <p className="mt-2 text-neutral-500">by {portfolio.user.name}</p>
      )}
      {portfolio.bio && <p className="mt-6 text-lg">{portfolio.bio}</p>}

      <h2 className="mt-12 text-2xl font-semibold">Projects</h2>
      {portfolio.projects.length === 0 ? (
        <p className="mt-4 text-neutral-500">No projects yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {portfolio.projects.map((project) => (
            <li key={project.title} className="rounded-lg border p-4">
              <h3 className="font-semibold">{project.title}</h3>
              {project.description && (
                <p className="mt-1 text-neutral-600">{project.description}</p>
              )}
              {project.url && (
                <a
                  href={project.url}
                  className="mt-2 inline-block text-blue-600 underline"
                >
                  View project
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}