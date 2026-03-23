import { useMemo, useState } from "react";
import { projects, type ComplianceState, type Project } from "./data";

type FilterValue = "all" | ComplianceState;

type AppProps = {
  initialProjects?: Project[];
};

const filters: Array<{ label: string; value: FilterValue }> = [
  { label: "All projects", value: "all" },
  { label: "Fully compliant", value: "compliant" },
  { label: "Still in progress", value: "in-progress" },
];

const statusClasses: Record<ComplianceState, string> = {
  compliant: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  "in-progress": "bg-amber-500/15 text-amber-200 ring-amber-400/30",
};

const statusCopy: Record<ComplianceState, string> = {
  compliant: "Yes",
  "in-progress": "No",
};

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

export function App({ initialProjects = projects }: AppProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return initialProjects.filter((project) => {
      const matchesFilter = filter === "all" || project.status === filter;
      const matchesQuery =
        normalized.length === 0 ||
        project.name.toLowerCase().includes(normalized) ||
        project.language.toLowerCase().includes(normalized) ||
        project.summary.toLowerCase().includes(normalized);

      return matchesFilter && matchesQuery;
    });
  }, [filter, initialProjects, query]);

  const compliantCount = initialProjects.filter(
    (project) => project.status === "compliant",
  ).length;

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.18),transparent_30%),linear-gradient(180deg,_#020617_0%,_#111827_45%,_#020617_100%)]" />
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1 text-sm font-medium tracking-wide text-sky-200">
            Vanilla parity tracker
          </span>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Are we Minecraft yet?
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
                A modern scoreboard for server software chasing full vanilla
                behavior, edge cases, and weird Minecraft quirks.
              </p>
            </div>
            <a
              className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              href="https://github.com/mudkipdev/areweminecraftyet/issues"
              rel="noreferrer"
              target="_blank"
            >
              Suggest a project
            </a>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Tracked projects" value={String(initialProjects.length)} />
          <StatCard label="Fully compliant" value={String(compliantCount)} />
          <StatCard
            label="Still in progress"
            value={String(initialProjects.length - compliantCount)}
          />
          <StatCard label="Interactive filters" value="Live" />
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex-1">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                Search projects
              </span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-400/60"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, language, or notes"
                type="search"
                value={query}
              />
            </label>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-300">Status</p>
              <div className="flex flex-wrap gap-2">
                {filters.map((option) => {
                  const active = option.value === filter;

                  return (
                    <button
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "border-sky-300 bg-sky-300 text-slate-950"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-slate-400/60"
                      }`}
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr className="text-left text-sm uppercase tracking-[0.2em] text-slate-400">
                    <th className="px-5 py-4 font-medium">Project</th>
                    <th className="px-5 py-4 font-medium">Language</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Snapshot</th>
                    <th className="px-5 py-4 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-950/40">
                  {filteredProjects.map((project) => (
                    <tr className="align-top transition hover:bg-white/[0.03]" key={project.name}>
                      <td className="px-5 py-5">
                        <p className="text-base font-semibold text-white">{project.name}</p>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                          {project.summary}
                        </p>
                      </td>
                      <td className="px-5 py-5 text-sm text-slate-300">{project.language}</td>
                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ring-1 ${statusClasses[project.status]}`}
                        >
                          {statusCopy[project.status]}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-sm text-slate-300">
                        <span className="block font-medium text-slate-200">
                          {project.focus}
                        </span>
                        <span className="mt-1 block text-slate-400">{project.version}</span>
                      </td>
                      <td className="px-5 py-5">
                        <a
                          className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:border-sky-300 hover:bg-sky-400/20"
                          href={project.sourceUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          GitHub
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProjects.length === 0 ? (
              <div className="border-t border-white/10 px-5 py-6 text-sm text-slate-400">
                No projects match that filter yet.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
