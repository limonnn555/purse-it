import { ROADMAP_V2 } from "@/lib/siteMap";

export const metadata = {
  title: "Roadmap — Purse It",
};

const roadmap = [
  {
    phase: "Today",
    status: "Live",
    items: [
      "Design a bag around the items you carry, with a zone for each one",
      "Design core, bag advisor chat, market research, product map, and pricing simulator",
      "Marketing content system with two live A/B tests",
      "Dashboard with live records, and a guided demo with an agent map",
    ],
  },
  {
    phase: "Version 2",
    status: "Planned next",
    items: ROADMAP_V2.map((item) => `${item.title}: ${item.why}`),
  },
  {
    phase: "Later",
    status: "Exploring",
    items: [
      "Save and compare multiple designs per user, with accounts",
      "More realistic design preview (colors, materials)",
      "Estimated manufacturing quote per design",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Roadmap
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Where Purse It is headed
      </h1>
      <p className="mt-4 text-muted">
        Here&apos;s how we plan to keep improving the way custom bags get
        designed.
      </p>

      <ol className="mt-10 space-y-6">
        {roadmap.map((phase) => (
          <li
            key={phase.phase}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{phase.phase}</h2>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                {phase.status}
              </span>
            </div>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
              {phase.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
