export type ResearchCategory = "Global Example" | "Competitor" | "Substitute";
export type ThreatLevel = "Low" | "Medium" | "High";

export const CATEGORY_OPTIONS: ResearchCategory[] = [
  "Global Example",
  "Competitor",
  "Substitute",
];

export const THREAT_LEVELS: ThreatLevel[] = ["Low", "Medium", "High"];

export type ResearchEntry = {
  id: number;
  created_at: string;
  name: string;
  category: ResearchCategory;
  region: string;
  description: string;
  threat_level: ThreatLevel;
  url: string | null;
};

export type ResearchFilter = {
  category: ResearchCategory | "All";
  query: string;
};

export function filterEntries(
  entries: ResearchEntry[],
  filter: ResearchFilter
): ResearchEntry[] {
  const query = filter.query.trim().toLowerCase();

  return entries.filter((entry) => {
    const matchesCategory =
      filter.category === "All" || entry.category === filter.category;
    const matchesQuery =
      !query ||
      entry.name.toLowerCase().includes(query) ||
      entry.description.toLowerCase().includes(query) ||
      entry.region.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
}

export function groupByThreatLevel(
  entries: ResearchEntry[]
): Record<ThreatLevel, ResearchEntry[]> {
  const groups: Record<ThreatLevel, ResearchEntry[]> = {
    Low: [],
    Medium: [],
    High: [],
  };
  for (const entry of entries) {
    groups[entry.threat_level].push(entry);
  }
  return groups;
}
