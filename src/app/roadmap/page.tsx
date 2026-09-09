export const metadata = {
  title: "Roadmap — Purse It",
};

const roadmap = [
  {
    phase: "Today",
    status: "Available",
    items: [
      "Choose bag size and daily items",
      "Generate a design with assigned compartments",
      "Save every generated design",
    ],
  },
  {
    phase: "Coming soon",
    status: "In development",
    items: [
      "More realistic design preview (colors, materials)",
      "Save and compare multiple designs per user",
      "Share the generated design as an image",
    ],
  },
  {
    phase: "Later",
    status: "Exploring",
    items: [
      "Estimated manufacturing quote per design",
      "Recommendations based on the user's lifestyle",
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
