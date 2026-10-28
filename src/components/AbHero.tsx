"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AB_TESTS, pickVariant, type TestId, type Variant } from "@/lib/abTesting";
import { supabase } from "@/lib/supabaseClient";

const TESTS: TestId[] = ["hero_headline", "hero_cta"];

function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked; the test then simply cannot remember the visitor.
  }
}

function visitorId(): string {
  let id = readStore("purseit_visitor");
  if (!id) {
    id = crypto.randomUUID();
    writeStore("purseit_visitor", id);
  }
  return id;
}

// Visiting /?ab_test=1 marks this browser as a test session, so its events
// are excluded from the results shown on /marketing.
function isTestSession(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get("ab_test") === "1") {
      writeStore("purseit_ab_test", "1");
    }
  } catch {
    // ignore
  }
  return readStore("purseit_ab_test") === "1";
}

function assign(test: TestId): Variant {
  const stored = readStore(`purseit_ab_${test}`);
  if (stored === "A" || stored === "B") return stored;
  const variant = pickVariant(Math.random());
  writeStore(`purseit_ab_${test}`, variant);
  return variant;
}

async function logEvent(test: TestId, variant: Variant, event: "view" | "click") {
  if (!supabase) return;
  const key = `purseit_ab_logged_${test}_${event}`;
  if (readStore(key)) return;
  const { error } = await supabase.from("ab_events").insert({
    test_id: test,
    variant,
    event,
    visitor_id: visitorId(),
    is_test: isTestSession(),
  });
  if (!error) writeStore(key, "1");
}

export default function AbHero() {
  const [variants, setVariants] = useState<Record<TestId, Variant>>({
    hero_headline: "A",
    hero_cta: "A",
  });
  // The server always renders variant A, so the text stays hidden until the
  // visitor's own variant is known. Otherwise B visitors would see A flash first.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function start() {
      const next: Record<TestId, Variant> = {
        hero_headline: assign("hero_headline"),
        hero_cta: assign("hero_cta"),
      };
      setVariants(next);
      setReady(true);
      for (const test of TESTS) {
        await logEvent(test, next[test], "view");
      }
    }
    start();
  }, []);

  function handleCtaClick() {
    for (const test of TESTS) {
      void logEvent(test, variants[test], "click");
    }
  }

  // No fade: visibility must never depend on an animation that could stall.
  const reveal = ready ? "" : "ab-pending opacity-0";

  return (
    <div>
      <noscript>
        <style>{".ab-pending{opacity:1 !important}"}</style>
      </noscript>
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Purse It · Early access
      </p>
      <h1
        className={`mt-4 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl ${reveal}`}
      >
        {AB_TESTS.hero_headline.variants[variants.hero_headline]}
      </h1>
      <p className="mt-6 max-w-lg text-lg text-muted">
        Tell us what you carry and what size bag you want. Purse It instantly
        builds a design with a compartment made for each item. Free to try, no
        account needed.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="#disenar"
          onClick={handleCtaClick}
          className={`rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 ${reveal}`}
        >
          {AB_TESTS.hero_cta.variants[variants.hero_cta]}
        </a>
        <Link
          href="/docs"
          className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-background"
        >
          How it works
        </Link>
      </div>
    </div>
  );
}
