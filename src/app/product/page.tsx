import Link from "next/link";
import { SEGMENTS, TIERS } from "@/lib/pricingEngine";

export const metadata = {
  title: "Product — Purse It",
};

type Cell = string | boolean;

const FEATURES: {
  name: string;
  description: string;
  status: "Live" | "Planned";
  free: Cell;
  plus: Cell;
  studio: Cell;
}[] = [
  {
    name: "Bag designer",
    description: "Pick a size and your items, get a compartment for each one.",
    status: "Live",
    free: true,
    plus: true,
    studio: true,
  },
  {
    name: "Design core",
    description: "Turn your routine into design principles and a priority zone.",
    status: "Live",
    free: true,
    plus: true,
    studio: true,
  },
  {
    name: "Saved designs history",
    description: "Come back to every design you generated.",
    status: "Planned",
    free: "3 saved",
    plus: "Unlimited",
    studio: "Unlimited",
  },
  {
    name: "Share design as image",
    description: "Send your bag layout to a friend or a maker.",
    status: "Planned",
    free: false,
    plus: true,
    studio: true,
  },
  {
    name: "Realistic preview",
    description: "See colors and materials on your design.",
    status: "Planned",
    free: false,
    plus: true,
    studio: true,
  },
  {
    name: "Compare designs",
    description: "Put two layouts side by side.",
    status: "Planned",
    free: false,
    plus: true,
    studio: true,
  },
  {
    name: "Maker-ready spec sheet",
    description: "Compartment dimensions a workshop can build from.",
    status: "Planned",
    free: false,
    plus: false,
    studio: true,
  },
  {
    name: "Manufacturing quote request",
    description: "Send a design to a maker and get an estimate.",
    status: "Planned",
    free: false,
    plus: false,
    studio: true,
  },
];

function renderCell(value: Cell) {
  if (value === true) return <span className="font-medium text-accent">Included</span>;
  if (value === false) return <span className="text-muted">—</span>;
  return <span>{value}</span>;
}

export default function ProductPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Product architecture
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">
        What Purse It does today, and what each plan unlocks
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Every feature, where it stands, and which plan includes it. Prices and
        revenue scenarios are on the{" "}
        <Link href="/pricing" className="text-accent hover:underline">
          pricing page
        </Link>
        .
      </p>

      <h2 className="mt-12 text-lg font-semibold">Feature map</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3">Feature</th>
              <th className="px-3 py-3">Status</th>
              {TIERS.map((tier) => (
                <th key={tier.id} className="px-3 py-3">
                  {tier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((feature) => (
              <tr key={feature.name} className="border-b border-border last:border-b-0">
                <td className="px-5 py-4">
                  <p className="font-medium">{feature.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{feature.description}</p>
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      feature.status === "Live"
                        ? "bg-accent/10 text-accent"
                        : "border border-border text-muted"
                    }`}
                  >
                    {feature.status}
                  </span>
                </td>
                <td className="px-3 py-4">{renderCell(feature.free)}</td>
                <td className="px-3 py-4">{renderCell(feature.plus)}</td>
                <td className="px-3 py-4">{renderCell(feature.studio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-lg font-semibold">Who it is for</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {SEGMENTS.map((segment) => (
          <div
            key={segment.id}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <p className="font-medium">{segment.name}</p>
            <p className="mt-2 text-sm text-muted">{segment.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
