import test from "node:test";
import assert from "node:assert/strict";
import { scoreHeadline } from "../src/lib/marketingEngine.ts";
import { leader, pickVariant, summarize } from "../src/lib/abTesting.ts";
import { CALENDAR, POSTS, SCRIPTS } from "../src/lib/marketingContent.ts";

test("headline scorer rewards a clear, reader-focused headline over a vague, hype-filled one", () => {
  const clear = scoreHeadline("Stop throwing your stuff in a bag. Give each thing a place.");
  const hype = scoreHeadline("Revolutionary AI-powered synergy platform");

  assert.equal(clear.score, 85);
  assert.equal(hype.score, 12);
  assert.ok(clear.score > hype.score);
  assert.equal(hype.checks.find((c) => c.label === "No hype words").points, 0);
  assert.equal(scoreHeadline("   ").score, 0);
});

test("A/B counting uses unique visitors, excludes test sessions, and names a leader only with enough data", () => {
  const events = [
    { test_id: "hero_headline", variant: "A", event: "view", visitor_id: "v1", is_test: false },
    { test_id: "hero_headline", variant: "A", event: "view", visitor_id: "v1", is_test: false },
    { test_id: "hero_headline", variant: "A", event: "view", visitor_id: "v2", is_test: false },
    { test_id: "hero_headline", variant: "A", event: "click", visitor_id: "v1", is_test: false },
    { test_id: "hero_headline", variant: "A", event: "click", visitor_id: "v1", is_test: false },
    { test_id: "hero_headline", variant: "B", event: "view", visitor_id: "v3", is_test: false },
    { test_id: "hero_headline", variant: "B", event: "click", visitor_id: "v3", is_test: false },
    { test_id: "hero_headline", variant: "A", event: "view", visitor_id: "t1", is_test: true },
    { test_id: "hero_cta", variant: "B", event: "view", visitor_id: "v9", is_test: false },
  ];

  const stats = summarize(events, "hero_headline");
  assert.deepEqual(stats.A, { views: 2, clicks: 1, rate: 0.5 });
  assert.deepEqual(stats.B, { views: 1, clicks: 1, rate: 1 });
  assert.equal(summarize(events, "hero_headline", { includeTestSessions: true }).A.views, 3);

  assert.equal(leader(stats), "not-enough-data");
  assert.equal(
    leader({ A: { views: 20, clicks: 4, rate: 0.2 }, B: { views: 25, clicks: 10, rate: 0.4 } }),
    "B"
  );
  assert.equal(
    leader({ A: { views: 20, clicks: 5, rate: 0.25 }, B: { views: 20, clicks: 5, rate: 0.25 } }),
    "tie"
  );
  assert.equal(pickVariant(0.2), "A");
  assert.equal(pickVariant(0.7), "B");
});

test("content system has exactly 10 posts, 3 video scripts, and a consistent 14-day calendar", () => {
  assert.equal(POSTS.length, 10);
  assert.equal(SCRIPTS.length, 3);
  assert.equal(CALENDAR.length, 14);
  assert.deepEqual(CALENDAR.map((d) => d.day), Array.from({ length: 14 }, (_, i) => i + 1));

  for (const post of POSTS) {
    assert.equal(CALENDAR[post.day - 1].asset, `Post ${post.id}`);
  }
  for (const script of SCRIPTS) {
    assert.equal(CALENDAR[script.day - 1].asset, `Video ${script.id}`);
  }
});
