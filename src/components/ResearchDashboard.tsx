"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_OPTIONS,
  ResearchCategory,
  ResearchEntry,
  THREAT_LEVELS,
  ThreatLevel,
  filterEntries,
  groupByThreatLevel,
} from "@/lib/researchEngine";
import { supabase } from "@/lib/supabaseClient";

const THREAT_STYLES: Record<ThreatLevel, string> = {
  Low: "bg-accent/10 text-accent",
  Medium: "bg-amber-500/10 text-amber-600",
  High: "bg-red-500/10 text-red-600",
};

export default function ResearchDashboard() {
  const [entries, setEntries] = useState<ResearchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<ResearchCategory | "All">(
    "All"
  );
  const [query, setQuery] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ResearchCategory>("Competitor");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>("Medium");
  const [url, setUrl] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    async function loadEntries() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("research_entries")
        .select("*")
        .order("created_at", { ascending: true });
      if (data) setEntries(data as ResearchEntry[]);
      setLoading(false);
    }
    loadEntries();
  }, []);

  const filtered = useMemo(
    () => filterEntries(entries, { category: categoryFilter, query }),
    [entries, categoryFilter, query]
  );
  const globalExamples = useMemo(
    () => entries.filter((entry) => entry.category === "Global Example"),
    [entries]
  );
  const riskGroups = useMemo(() => groupByThreatLevel(entries), [entries]);

  async function handleAddEntry(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !region.trim() || !description.trim() || !supabase) return;

    setSaveState("saving");
    const { data, error } = await supabase
      .from("research_entries")
      .insert({
        name,
        category,
        region,
        description,
        threat_level: threatLevel,
        url: url.trim() || null,
      })
      .select("*")
      .single();

    if (error || !data) {
      setSaveState("error");
      return;
    }

    setEntries((prev) => [...prev, data as ResearchEntry]);
    setSaveState("saved");
    setName("");
    setRegion("");
    setDescription("");
    setUrl("");
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-semibold">{entries.length}</p>
          <p className="mt-1 text-xs text-muted">Entries tracked</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-semibold">{globalExamples.length}</p>
          <p className="mt-1 text-xs text-muted">Global examples</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-semibold">
            {entries.filter((e) => e.category !== "Global Example").length}
          </p>
          <p className="mt-1 text-xs text-muted">Competitors / substitutes</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-semibold">{riskGroups.High.length}</p>
          <p className="mt-1 text-xs text-muted">High risk</p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <form
          onSubmit={handleAddEntry}
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <h2 className="text-lg font-semibold">Add a research entry</h2>
          <p className="mt-1 text-sm text-muted">
            Log a global example, competitor, or substitute you found.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="research-name">
                Name <span className="text-accent">*</span>
              </label>
              <input
                id="research-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="E.g. Tom Bihn"
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium" htmlFor="research-category">
                  Category
                </label>
                <select
                  id="research-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as ResearchCategory)
                  }
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="research-threat">
                  Threat level
                </label>
                <select
                  id="research-threat"
                  value={threatLevel}
                  onChange={(event) =>
                    setThreatLevel(event.target.value as ThreatLevel)
                  }
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                >
                  {THREAT_LEVELS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="research-region">
                Region <span className="text-accent">*</span>
              </label>
              <input
                id="research-region"
                type="text"
                required
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                placeholder="E.g. Global, Mexico, US"
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="research-description">
                Description <span className="text-accent">*</span>
              </label>
              <textarea
                id="research-description"
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                placeholder="What do they do, and why would someone pick them instead of Purse It?"
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="research-url">
                Link (optional)
              </label>
              <input
                id="research-url"
                type="text"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saveState === "saving"}
            className="mt-6 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saveState === "saving" ? "Saving..." : "Add to research"}
          </button>

          {saveState === "saved" && (
            <p className="mt-3 text-center text-xs text-muted">
              Entry saved to your database.
            </p>
          )}
          {saveState === "error" && (
            <p className="mt-3 text-center text-xs text-muted">
              Couldn&apos;t save to the database (check your Supabase
              connection).
            </p>
          )}
        </form>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Risk map</h2>
          <p className="mt-1 text-sm text-muted">
            Every entry grouped by how much of a threat it is to Purse It.
          </p>

          <div className="mt-6 space-y-5">
            {THREAT_LEVELS.map((level) => (
              <div key={level}>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${THREAT_STYLES[level]}`}
                  >
                    {level} risk
                  </span>
                  <span className="text-xs text-muted">
                    {riskGroups[level].length}
                  </span>
                </div>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {riskGroups[level].map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs"
                    >
                      {entry.name}
                    </li>
                  ))}
                  {riskGroups[level].length === 0 && (
                    <li className="text-xs text-muted">No entries yet.</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Global examples</h2>
        <p className="mt-1 text-sm text-muted">
          Companies around the world building something similar to Purse It.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {globalExamples.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <p className="text-sm font-semibold">{entry.name}</p>
              <p className="mt-1 text-xs text-muted">{entry.region}</p>
              <p className="mt-3 text-sm text-muted">{entry.description}</p>
              {entry.url && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs font-medium text-accent hover:underline"
                >
                  Visit site
                </a>
              )}
            </div>
          ))}
          {globalExamples.length === 0 && !loading && (
            <p className="text-sm text-muted">
              No global examples saved yet.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">All research entries</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value as ResearchCategory | "All"
                )
              }
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            >
              <option value="All">All categories</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, region, or keyword..."
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Region</th>
                <th className="py-2 pr-4">Risk</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-border">
                  <td className="py-3 pr-4 font-medium">
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-accent hover:underline"
                      >
                        {entry.name}
                      </a>
                    ) : (
                      entry.name
                    )}
                  </td>
                  <td className="py-3 pr-4 text-muted">{entry.category}</td>
                  <td className="py-3 pr-4 text-muted">{entry.region}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${THREAT_STYLES[entry.threat_level]}`}
                    >
                      {entry.threat_level}
                    </span>
                  </td>
                  <td className="py-3 text-muted">{entry.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted">
              {loading
                ? "Loading research entries..."
                : "No entries match your filter."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
