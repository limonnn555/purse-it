"use client";

import { useEffect, useState } from "react";
import { TESTING_SUMMARY } from "@/lib/siteMap";
import { supabase } from "@/lib/supabaseClient";

type ChatStats = {
  total_chats: number;
  external_chats: number;
  flagged_chats: number;
  guardrail_chats: number;
  ratings_count: number;
  avg_rating: number | null;
  human_requests: number;
};

type DemoStats = { total_ratings: number; external_ratings: number; avg_rating: number | null };

const TABLES = [
  { table: "designs", label: "Bag designs", page: "/" },
  { table: "core_outputs", label: "Design cores", page: "/core" },
  { table: "research_entries", label: "Research entries", page: "/research" },
  { table: "pricing_scenarios", label: "Pricing scenarios", page: "/pricing" },
  { table: "marketing_assets", label: "Marketing assets", page: "/marketing" },
  { table: "ab_events", label: "A/B events", page: "/marketing" },
] as const;

type Latest = {
  research: { name: string; category: string }[];
  pricing: { name: string; scenario: string; monthly_revenue: number }[];
  marketing: { title: string; asset_type: string }[];
};

async function withTimeout<T>(request: PromiseLike<T>, ms = 6000): Promise<T | null> {
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));
  return Promise.race([request, timeout]);
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [chat, setChat] = useState<ChatStats | null>(null);
  const [demo, setDemo] = useState<DemoStats | null>(null);
  const [latest, setLatest] = useState<Latest | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setStatus("unavailable");
        return;
      }
      const client = supabase;
      let answered = 0;

      await Promise.all([
        ...TABLES.map(async ({ table }) => {
          const result = await withTimeout(client.from(table).select("*", { count: "exact", head: true }));
          if (result && !result.error && result.count !== null) {
            answered += 1;
            setCounts((prev) => ({ ...prev, [table]: result.count }));
          } else {
            setCounts((prev) => ({ ...prev, [table]: null }));
          }
        }),
        (async () => {
          const result = await withTimeout(client.from("chat_stats").select("*").single());
          if (result && !result.error && result.data) {
            answered += 1;
            setChat(result.data as ChatStats);
          }
        })(),
        (async () => {
          const result = await withTimeout(client.from("demo_stats").select("*").single());
          if (result && !result.error && result.data) setDemo(result.data as DemoStats);
        })(),
        (async () => {
          const [research, pricing, marketing] = await Promise.all([
            withTimeout(client.from("research_entries").select("name, category").order("created_at", { ascending: false }).limit(5)),
            withTimeout(client.from("pricing_scenarios").select("name, scenario, monthly_revenue").order("created_at", { ascending: false }).limit(5)),
            withTimeout(client.from("marketing_assets").select("title, asset_type").order("created_at", { ascending: false }).limit(5)),
          ]);
          setLatest({
            research: (research?.data as Latest["research"]) ?? [],
            pricing: (pricing?.data as Latest["pricing"]) ?? [],
            marketing: (marketing?.data as Latest["marketing"]) ?? [],
          });
        })(),
      ]);

      setStatus(answered > 0 ? "ready" : "unavailable");
    }
    load();
  }, []);

  const demoTesters = demo ? Number(demo.external_ratings) : null;
  const totalExternal = demoTesters === null ? null : TESTING_SUMMARY.chatTesters + demoTesters;

  return (
    <div className="space-y-8">
      {status === "unavailable" && (
        <p role="status" className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
          The database didn&apos;t respond, so live numbers are unavailable right now. The testing
          summary and impact check below do not depend on it. Try again in a minute.
        </p>
      )}

      <section aria-label="Records">
        <h2 className="text-xl font-semibold tracking-tight">Records saved by the product</h2>
        <p className="mt-1 text-sm text-muted">Live counts from the database, one table per feature.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TABLES.map(({ table, label }) => (
            <Stat
              key={table}
              label={label}
              value={status === "loading" ? "…" : counts[table] ?? "—"}
            />
          ))}
          <Stat label="Advisor chats" value={status === "loading" ? "…" : chat?.total_chats ?? "—"} />
          <Stat label="Demo ratings" value={status === "loading" ? "…" : demo?.total_ratings ?? "—"} />
        </div>
      </section>

      <section aria-label="Latest records" className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="font-medium">Latest research entries</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {latest?.research.length ? (
              latest.research.map((row, i) => (
                <li key={i}>
                  <span className="text-foreground">{row.name}</span> · {row.category}
                </li>
              ))
            ) : (
              <li>{status === "loading" ? "Loading…" : "Nothing to show yet."}</li>
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="font-medium">Latest pricing scenarios</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {latest?.pricing.length ? (
              latest.pricing.map((row, i) => (
                <li key={i}>
                  <span className="text-foreground">{row.name}</span> · {row.scenario} ·{" "}
                  {money.format(Number(row.monthly_revenue))}/mo (simulated)
                </li>
              ))
            ) : (
              <li>{status === "loading" ? "Loading…" : "Nothing to show yet."}</li>
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="font-medium">Latest marketing assets</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {latest?.marketing.length ? (
              latest.marketing.map((row, i) => (
                <li key={i}>
                  <span className="text-foreground">{row.title}</span> · {row.asset_type}
                </li>
              ))
            ) : (
              <li>{status === "loading" ? "Loading…" : "Nothing to show yet."}</li>
            )}
          </ul>
        </div>
      </section>

      <section aria-label="Advisor numbers" className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold tracking-tight">Bag advisor numbers</h2>
        <p className="mt-1 text-sm text-muted">
          Totals only. Individual chats are write-only and cannot be read from the website.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Chats from testers" value={chat?.external_chats ?? "—"} />
          <Stat label="Flagged for a person" value={chat?.flagged_chats ?? "—"} />
          <Stat label="Guardrails triggered" value={chat?.guardrail_chats ?? "—"} />
          <Stat
            label="Average rating (1–5)"
            value={chat?.avg_rating != null ? Number(chat.avg_rating).toFixed(1) : "—"}
          />
        </div>
      </section>

      <section aria-label="Testing summary" className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold tracking-tight">Testing summary</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="External users, target" value={TESTING_SUMMARY.externalTarget} />
          <Stat label="Tested the advisor (/chat)" value={TESTING_SUMMARY.chatTesters} />
          <Stat label="Rated the demo (/demo)" value={demoTesters ?? "—"} />
          <Stat label="External users so far" value={totalExternal ?? "—"} />
        </div>
        <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-muted">
          <li>{TESTING_SUMMARY.logicTests} automated logic tests pass (pricing, marketing, advisor, site content).</li>
          <li>
            Full-site regression test:{" "}
            {TESTING_SUMMARY.regression.checks > 0
              ? `${TESTING_SUMMARY.regression.passed} of ${TESTING_SUMMARY.regression.checks} checks passed across ${TESTING_SUMMARY.regression.pages} pages on ${TESTING_SUMMARY.regression.date}.`
              : "not run yet."}
          </li>
          <li>
            Improvements made after testing: a Start over button and more color on the advisor, the A/B
            counting fix from the marketing tests, and a phone-width fix on /marketing.
          </li>
        </ul>
      </section>
    </div>
  );
}
