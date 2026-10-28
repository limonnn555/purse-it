"use client";

import { useEffect, useMemo, useState } from "react";
import ContentCard, { type SavedAsset } from "@/components/ContentCard";
import { copyText, downloadFile } from "@/lib/browserTools";
import {
  AB_TESTS,
  leader,
  summarize,
  type AbEvent,
  type TestId,
  type Variant,
} from "@/lib/abTesting";
import {
  BRAND,
  CALENDAR,
  LANDING,
  PERSONA,
  POSTS,
  SCRIPTS,
  brandText,
  calendarText,
  landingText,
  personaText,
  postText,
  scriptText,
} from "@/lib/marketingContent";
import { scoreHeadline, toMarkdown } from "@/lib/marketingEngine";
import { supabase } from "@/lib/supabaseClient";

type LoadState = "loading" | "ready" | "unavailable";

const TEST_IDS = Object.keys(AB_TESTS) as TestId[];

async function withTimeout<T>(request: PromiseLike<T>, ms = 6000): Promise<T | null> {
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));
  return Promise.race([request, timeout]);
}

function SectionTitle({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
    </div>
  );
}

export default function MarketingEngine() {
  const [saved, setSaved] = useState<SavedAsset[]>([]);
  const [savedState, setSavedState] = useState<LoadState>("loading");
  const [events, setEvents] = useState<AbEvent[]>([]);
  const [eventsState, setEventsState] = useState<LoadState>("loading");
  const [headlineA, setHeadlineA] = useState(AB_TESTS.hero_headline.variants.A);
  const [headlineB, setHeadlineB] = useState(AB_TESTS.hero_headline.variants.B);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setSavedState("unavailable");
        setEventsState("unavailable");
        return;
      }
      const [assets, abEvents] = await Promise.all([
        withTimeout(
          supabase
            .from("marketing_assets")
            .select("id, created_at, asset_type, title, content")
            .order("created_at", { ascending: false })
            .limit(50)
        ),
        withTimeout(
          supabase
            .from("ab_events")
            .select("test_id, variant, event, visitor_id, is_test")
            .limit(5000)
        ),
      ]);
      if (assets && !assets.error && assets.data) {
        setSaved(assets.data as SavedAsset[]);
        setSavedState("ready");
      } else {
        setSavedState("unavailable");
      }
      if (abEvents && !abEvents.error && abEvents.data) {
        setEvents(abEvents.data as AbEvent[]);
        setEventsState("ready");
      } else {
        setEventsState("unavailable");
      }
    }
    load();
  }, []);

  function handleSaved(asset: SavedAsset) {
    setSaved((prev) => [asset, ...prev]);
    setSavedState("ready");
  }

  const results = useMemo(
    () =>
      TEST_IDS.map((id) => {
        const stats = summarize(events, id);
        return { id, stats, winner: leader(stats) };
      }),
    [events]
  );
  const testSessions = useMemo(
    () => new Set(events.filter((e) => e.is_test).map((e) => e.visitor_id)).size,
    [events]
  );

  const scoreA = scoreHeadline(headlineA);
  const scoreB = scoreHeadline(headlineB);
  const predicted =
    scoreA.score === scoreB.score ? "tie" : scoreA.score > scoreB.score ? "A" : "B";
  const scorerText = [
    `A (${scoreA.score}/100): ${headlineA}`,
    `B (${scoreB.score}/100): ${headlineB}`,
    `Predicted winner (simulated score, not audience data): ${predicted === "tie" ? "tie" : predicted}`,
  ].join("\n");

  function exportContentPack() {
    const assets = [
      { asset_type: "brand", title: "Brand system", content: brandText() },
      { asset_type: "persona", title: "Target persona", content: personaText() },
      { asset_type: "landing", title: "Landing page copy", content: landingText() },
      ...POSTS.map((p) => ({ asset_type: "post", title: `Post ${p.id}: ${p.title}`, content: postText(p) })),
      ...SCRIPTS.map((s) => ({ asset_type: "video", title: `Video ${s.id}: ${s.title}`, content: scriptText(s) })),
      { asset_type: "calendar", title: "14-day campaign calendar", content: calendarText() },
    ];
    downloadFile("purse-it-content-pack.md", toMarkdown(assets, "Purse It content pack"));
  }

  async function copySaved(asset: SavedAsset) {
    const ok = await copyText(asset.content);
    if (ok) {
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  return (
    <div className="space-y-14">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          All content below is <strong className="font-medium text-foreground">template-generated</strong>{" "}
          from real Purse It facts. It is not produced by an AI model.
        </p>
        <button
          type="button"
          onClick={exportContentPack}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Export full content pack (.md)
        </button>
      </div>

      <section aria-labelledby="brand">
        <SectionTitle title="Brand system" note="The rules every asset follows." />
        <div className="grid gap-4 lg:grid-cols-2">
          <ContentCard title="Brand system" type="brand" text={brandText()} onSaved={handleSaved}>
            <p className="text-base font-medium text-foreground">{BRAND.tagline}</p>
            <p className="mt-1">{BRAND.promise}</p>
            <ul className="mt-4 space-y-1">
              {BRAND.voice.map((v) => (
                <li key={v.trait}>
                  <span className="font-medium text-foreground">{v.trait}:</span> {v.note}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              {BRAND.colors.map((c) => (
                <div key={c.hex} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-5 w-5 rounded-full border border-border"
                    style={{ backgroundColor: c.hex }}
                    aria-hidden="true"
                  />
                  {c.name} <span className="tabular-nums">{c.hex}</span>
                </div>
              ))}
            </div>
            <p className="mt-4">{BRAND.typography}</p>
            <p className="mt-3">
              <span className="font-medium text-foreground">Do:</span> {BRAND.dos.join(" · ")}
            </p>
            <p className="mt-1">
              <span className="font-medium text-foreground">Don&apos;t:</span> {BRAND.donts.join(" · ")}
            </p>
          </ContentCard>

          <ContentCard title="Target persona" type="persona" text={personaText()} eyebrow="Persona" onSaved={handleSaved}>
            <p className="text-base font-medium text-foreground">
              {PERSONA.name}, {PERSONA.summary}
            </p>
            <p className="mt-1 text-xs">{PERSONA.label}</p>
            <p className="mt-3">
              <span className="font-medium text-foreground">Carries:</span> {PERSONA.carries.join(", ")}
            </p>
            <p className="mt-1">
              <span className="font-medium text-foreground">Today:</span> {PERSONA.today}
            </p>
            <p className="mt-1">
              <span className="font-medium text-foreground">Pains:</span> {PERSONA.pains.join("; ")}
            </p>
            <p className="mt-1">
              <span className="font-medium text-foreground">Goals:</span> {PERSONA.goals.join("; ")}
            </p>
            <p className="mt-1">
              <span className="font-medium text-foreground">Channels:</span> {PERSONA.channels.join(", ")}
            </p>
            <p className="mt-3">
              <span className="font-medium text-foreground">Objection:</span> {PERSONA.objection}
            </p>
            <p className="mt-1">
              <span className="font-medium text-foreground">Our answer:</span> {PERSONA.answer}
            </p>
          </ContentCard>
        </div>
      </section>

      <section aria-labelledby="landing">
        <SectionTitle title="Landing page copy" note="The words for the top of the home page." />
        <ContentCard title="Landing page copy" type="landing" text={landingText()} onSaved={handleSaved}>
          <p className="text-lg font-semibold text-foreground">{LANDING.headline}</p>
          <p className="mt-2">{LANDING.subhead}</p>
          <p className="mt-2 font-medium text-accent">{LANDING.cta}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {LANDING.benefits.map((b) => (
              <li key={b.title}>
                <p className="font-medium text-foreground">{b.title}</p>
                <p>{b.body}</p>
              </li>
            ))}
          </ul>
          <ol className="mt-4 list-inside list-decimal space-y-1">
            {LANDING.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <dl className="mt-4 space-y-2">
            {LANDING.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-foreground">{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </ContentCard>
      </section>

      <section aria-labelledby="posts">
        <SectionTitle title="10 social posts" note="One for each posting day in the campaign calendar." />
        <div className="grid gap-4 md:grid-cols-2">
          {POSTS.map((post) => (
            <ContentCard
              key={post.id}
              title={`Post ${post.id}: ${post.title}`}
              type="post"
              text={postText(post)}
              eyebrow={`Day ${post.day} · ${post.channel}`}
              onSaved={handleSaved}
            >
              <p>{post.caption}</p>
              {post.hashtags && <p className="mt-2 text-accent">{post.hashtags}</p>}
              <p className="mt-2 font-medium text-foreground">{post.cta}</p>
            </ContentCard>
          ))}
        </div>
      </section>

      <section aria-labelledby="videos">
        <SectionTitle title="3 video scripts" note="Short vertical videos, each with a hook, scenes, voiceover, and call to action." />
        <div className="grid gap-4 lg:grid-cols-3">
          {SCRIPTS.map((script) => (
            <ContentCard
              key={script.id}
              title={`Video ${script.id}: ${script.title}`}
              type="video"
              text={scriptText(script)}
              eyebrow={`Day ${script.day} · ${script.length}`}
              onSaved={handleSaved}
            >
              <p>
                <span className="font-medium text-foreground">Hook:</span> {script.hook}
              </p>
              <ol className="mt-2 list-inside list-decimal space-y-1">
                {script.scenes.map((scene) => (
                  <li key={scene}>{scene}</li>
                ))}
              </ol>
              <p className="mt-2">
                <span className="font-medium text-foreground">Voiceover:</span> {script.voiceover}
              </p>
              <p className="mt-2 font-medium text-foreground">{script.cta}</p>
            </ContentCard>
          ))}
        </div>
      </section>

      <section aria-labelledby="calendar">
        <SectionTitle title="14-day campaign calendar" note="Posts and videos spread across two weeks, with one day to review results." />
        <ContentCard title="14-day campaign calendar" type="calendar" text={calendarText()} onSaved={handleSaved}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide">
                  <th className="py-2 pr-3">Day</th>
                  <th className="py-2 pr-3">Theme</th>
                  <th className="py-2 pr-3">Asset</th>
                  <th className="py-2 pr-3">Channel</th>
                  <th className="py-2">Goal</th>
                </tr>
              </thead>
              <tbody>
                {CALENDAR.map((d) => (
                  <tr key={d.day} className="border-b border-border last:border-b-0">
                    <td className="py-2 pr-3 tabular-nums text-foreground">{d.day}</td>
                    <td className="py-2 pr-3">{d.theme}</td>
                    <td className="py-2 pr-3">{d.asset}</td>
                    <td className="py-2 pr-3">{d.channel}</td>
                    <td className="py-2">{d.goal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentCard>
      </section>

      <section aria-labelledby="ab">
        <SectionTitle
          title="A/B tests"
          note="Two live tests run on the home page. Each visitor sees one variant, and views and clicks are counted once per visitor. A view counts after the visitor first scrolls, moves the mouse, touches the screen, or presses a key, so automated page checks are not counted."
        />
        {eventsState === "unavailable" && (
          <p role="status" className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4 text-sm text-muted">
            Results are unavailable because the database didn&apos;t respond. The tests keep running, and the
            results will appear when the connection is back.
          </p>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          {results.map(({ id, stats, winner }) => (
            <div key={id} className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-base font-semibold">{AB_TESTS[id].name}</h3>
              <p className="mt-1 text-sm text-muted">{AB_TESTS[id].question}</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                      <th className="py-2 pr-3">Variant</th>
                      <th className="py-2 pr-3">Views</th>
                      <th className="py-2 pr-3">Clicks</th>
                      <th className="py-2">Click rate</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {(["A", "B"] as Variant[]).map((variant) => (
                      <tr key={variant} className="border-b border-border last:border-b-0">
                        <td className="py-3 pr-3 text-foreground">
                          <span className="font-medium">{variant}:</span> {AB_TESTS[id].variants[variant]}
                        </td>
                        <td className="py-3 pr-3">{stats[variant].views}</td>
                        <td className="py-3 pr-3">{stats[variant].clicks}</td>
                        <td className="py-3">{(stats[variant].rate * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm">
                <span className="font-medium">Leader: </span>
                {winner === "not-enough-data"
                  ? "not enough data yet (needs 20 views per variant)"
                  : winner === "tie"
                    ? "tie"
                    : `Variant ${winner}`}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          {testSessions} test session{testSessions === 1 ? "" : "s"} excluded from these results. Small samples
          can mislead, so treat early numbers as a signal, not a verdict.
        </p>

        <div className="mt-8">
          <ContentCard
            title="Headline scorer (simulated)"
            type="headline"
            text={scorerText}
            eyebrow="Compare two headlines"
            onSaved={handleSaved}
          >
            <p className="text-xs">
              A rule-based score from 0 to 100. It is a heuristic, not real audience data.
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {[
                { label: "A", value: headlineA, set: setHeadlineA, score: scoreA },
                { label: "B", value: headlineB, set: setHeadlineB, score: scoreB },
              ].map((item) => (
                <div key={item.label}>
                  <label className="text-xs font-medium text-foreground" htmlFor={`headline-${item.label}`}>
                    Headline {item.label}
                  </label>
                  <textarea
                    id={`headline-${item.label}`}
                    rows={2}
                    value={item.value}
                    onChange={(event) => item.set(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                  />
                  <p className="mt-2 text-sm font-medium text-foreground tabular-nums">
                    Score: {item.score.score}/100
                  </p>
                  <ul className="mt-1 space-y-0.5 text-xs">
                    {item.score.checks.map((check) => (
                      <li key={check.label} className="tabular-nums">
                        {check.points}/{check.max} · {check.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 font-medium text-foreground">
              Predicted winner (simulated): {predicted === "tie" ? "tie" : `Headline ${predicted}`}
            </p>
          </ContentCard>
        </div>
      </section>

      <section aria-labelledby="saved">
        <SectionTitle title="Saved marketing assets" note="Everything you saved from the cards above." />
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {savedState === "ready"
                ? `${saved.length} saved asset${saved.length === 1 ? "" : "s"}`
                : savedState === "loading"
                  ? "Loading saved assets..."
                  : "Saved assets are unavailable because the database didn't respond."}
            </p>
            <button
              type="button"
              disabled={saved.length === 0}
              onClick={() => downloadFile("purse-it-saved-assets.md", toMarkdown(saved, "Saved Purse It marketing assets"))}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background disabled:opacity-50"
            >
              Export all saved (.md)
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {saved.map((asset) => (
              <li
                key={asset.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{asset.title}</p>
                  <p className="text-xs text-muted">
                    {asset.asset_type} · {new Date(asset.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copySaved(asset)}
                  className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-surface"
                >
                  {copiedId === asset.id ? "Copied" : "Copy"}
                </button>
              </li>
            ))}
            {savedState === "ready" && saved.length === 0 && (
              <li className="text-sm text-muted">Nothing saved yet. Use Save on any card above.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
