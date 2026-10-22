"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Assumptions,
  ScenarioId,
  SCENARIOS,
  SEGMENTS,
  SegmentAssumptions,
  SegmentId,
  TIERS,
  calculateRevenue,
} from "@/lib/pricingEngine";
import { supabase } from "@/lib/supabaseClient";

type SavedScenario = {
  id: number;
  created_at: string;
  name: string;
  scenario: string;
  monthly_revenue: number;
  annual_revenue: number;
};

type ScenarioLabel = ScenarioId | "Custom";

const SCENARIO_IDS = Object.keys(SCENARIOS) as ScenarioId[];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const FIELDS: { key: keyof SegmentAssumptions; label: string; max?: number }[] = [
  { key: "monthlyVisitors", label: "Monthly visitors" },
  { key: "conversionRate", label: "Conversion rate (%)", max: 100 },
  { key: "plusShare", label: "Paying customers on Plus (%)", max: 100 },
];

function cloneAssumptions(source: Assumptions): Assumptions {
  return {
    carriers: { ...source.carriers },
    makers: { ...source.makers },
  };
}

export default function PricingSimulator() {
  const [scenario, setScenario] = useState<ScenarioLabel>("Base");
  const [assumptions, setAssumptions] = useState<Assumptions>(() =>
    cloneAssumptions(SCENARIOS.Base)
  );
  const [name, setName] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [saved, setSaved] = useState<SavedScenario[]>([]);
  const [listState, setListState] = useState<"loading" | "ready" | "unavailable">(
    "loading"
  );

  const result = useMemo(() => calculateRevenue(assumptions), [assumptions]);

  useEffect(() => {
    async function loadSaved() {
      if (!supabase) {
        setListState("unavailable");
        return;
      }
      const timeout = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 6000)
      );
      const result = await Promise.race([
        supabase
          .from("pricing_scenarios")
          .select("id, created_at, name, scenario, monthly_revenue, annual_revenue")
          .order("created_at", { ascending: false })
          .limit(5),
        timeout,
      ]);
      if (!result || result.error || !result.data) {
        setListState("unavailable");
        return;
      }
      setSaved(result.data as SavedScenario[]);
      setListState("ready");
    }
    loadSaved();
  }, []);

  function chooseScenario(id: ScenarioId) {
    setScenario(id);
    setAssumptions(cloneAssumptions(SCENARIOS[id]));
  }

  function updateField(
    segment: SegmentId,
    key: keyof SegmentAssumptions,
    raw: string,
    max?: number
  ) {
    const parsed = Number(raw);
    let value = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    if (max !== undefined) value = Math.min(value, max);
    setScenario("Custom");
    setAssumptions((prev) => ({
      ...prev,
      [segment]: { ...prev[segment], [key]: value },
    }));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !supabase) {
      if (!supabase) setSaveState("error");
      return;
    }
    setSaveState("saving");
    const { data, error } = await supabase
      .from("pricing_scenarios")
      .insert({
        name: name.trim(),
        scenario,
        assumptions,
        monthly_revenue: Math.round(result.monthlyTotal),
        annual_revenue: Math.round(result.annualTotal),
      })
      .select("id, created_at, name, scenario, monthly_revenue, annual_revenue")
      .single();

    if (error || !data) {
      setSaveState("error");
      return;
    }
    setSaved((prev) => [data as SavedScenario, ...prev].slice(0, 5));
    setSaveState("saved");
    setName("");
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <p className="text-sm font-medium text-muted">{tier.name}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {tier.monthlyPrice === 0 ? "$0" : money.format(tier.monthlyPrice)}
              <span className="text-sm font-normal text-muted"> / month</span>
            </p>
            <p className="mt-3 text-sm text-muted">{tier.tagline}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Revenue calculator</h2>
            <p className="mt-1 text-sm text-muted">
              Pick a scenario, then adjust any number to see revenue update.
            </p>
          </div>
          <div
            role="group"
            aria-label="Scenario"
            className="inline-flex rounded-full border border-border p-1 text-sm"
          >
            {SCENARIO_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => chooseScenario(id)}
                aria-pressed={scenario === id}
                className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
                  scenario === id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {SEGMENTS.map((segment) => (
            <div
              key={segment.id}
              className="rounded-xl border border-border bg-background p-5"
            >
              <p className="font-medium">{segment.name}</p>
              <div className="mt-4 space-y-3">
                {FIELDS.map((field) => (
                  <div key={field.key}>
                    <label
                      className="text-xs font-medium text-muted"
                      htmlFor={`${segment.id}-${field.key}`}
                    >
                      {field.label}
                    </label>
                    <input
                      id={`${segment.id}-${field.key}`}
                      type="number"
                      min={0}
                      max={field.max}
                      value={assumptions[segment.id][field.key] || ""}
                      placeholder="0"
                      onChange={(event) =>
                        updateField(segment.id, field.key, event.target.value, field.max)
                      }
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="text-xs uppercase tracking-wide text-muted">Monthly revenue</p>
            <p data-testid="monthly-total" className="mt-2 text-2xl font-semibold tabular-nums">
              {money.format(result.monthlyTotal)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="text-xs uppercase tracking-wide text-muted">Annual revenue</p>
            <p data-testid="annual-total" className="mt-2 text-2xl font-semibold tabular-nums">
              {money.format(result.annualTotal)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Assumptions</h2>
        <p className="mt-1 text-sm text-muted">
          Everything behind the numbers above ({scenario} scenario).
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-4">Assumption</th>
                {SEGMENTS.map((segment) => (
                  <th key={segment.id} className="py-2 pr-4">
                    {segment.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted">Monthly visitors</td>
                {SEGMENTS.map((s) => (
                  <td key={s.id} className="py-3 pr-4">
                    {assumptions[s.id].monthlyVisitors.toLocaleString("en-US")}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted">Conversion rate</td>
                {SEGMENTS.map((s) => (
                  <td key={s.id} className="py-3 pr-4">
                    {assumptions[s.id].conversionRate}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted">Paying customers</td>
                {SEGMENTS.map((s) => (
                  <td key={s.id} className="py-3 pr-4">
                    {result.segments[s.id].payingCustomers.toFixed(1)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted">Plus / Studio split</td>
                {SEGMENTS.map((s) => (
                  <td key={s.id} className="py-3 pr-4">
                    {assumptions[s.id].plusShare}% / {100 - assumptions[s.id].plusShare}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted">Monthly revenue</td>
                {SEGMENTS.map((s) => (
                  <td key={s.id} className="py-3 pr-4">
                    {money.format(result.segments[s.id].monthlyRevenue)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 text-muted">Tier prices</td>
                <td className="py-3 pr-4" colSpan={SEGMENTS.length}>
                  Plus {money.format(TIERS[1].monthlyPrice)} · Studio{" "}
                  {money.format(TIERS[2].monthlyPrice)} · Free{" "}
                  {money.format(0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <h2 className="text-lg font-semibold">Save this scenario</h2>
          <p className="mt-1 text-sm text-muted">
            Name it so you can compare it later.
          </p>
          <label className="mt-5 block text-sm font-medium" htmlFor="scenario-name">
            Scenario name <span className="text-accent">*</span>
          </label>
          <input
            id="scenario-name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="E.g. Launch month, 2 makers onboard"
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={saveState === "saving"}
            className="mt-5 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saveState === "saving" ? "Saving..." : "Save scenario"}
          </button>
          {saveState === "saved" && (
            <p className="mt-3 text-center text-xs text-muted">
              Scenario saved to your database.
            </p>
          )}
          {saveState === "error" && (
            <p className="mt-3 text-center text-xs text-muted">
              Couldn&apos;t save to the database (check your Supabase connection).
            </p>
          )}
        </form>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Saved scenarios</h2>
          <p className="mt-1 text-sm text-muted">Newest first.</p>
          <div className="mt-4 space-y-2">
            {saved.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-background px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <span className="whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                    {item.scenario}
                  </span>
                </div>
                <p className="mt-1 text-xs tabular-nums text-muted">
                  {money.format(item.monthly_revenue)} / month ·{" "}
                  {money.format(item.annual_revenue)} / year
                </p>
              </div>
            ))}
            {saved.length === 0 && listState === "loading" && (
              <p className="text-sm text-muted">Loading saved scenarios...</p>
            )}
            {saved.length === 0 && listState === "ready" && (
              <p className="text-sm text-muted">No saved scenarios yet.</p>
            )}
            {listState === "unavailable" && (
              <p role="status" className="text-sm text-muted">
                Saved scenarios are unavailable because the database didn&apos;t
                respond. The calculator above still works, and saving will work
                again once the connection is back.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
