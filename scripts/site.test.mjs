import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, existsSync } from "node:fs";
import {
  NAV_LINKS,
  AGENTS,
  DEMO_STEPS,
  demoHref,
  BUILD_LOGS,
  PROMPT_LIBRARY,
  IMPACT_CHECK,
  ROADMAP_V2,
} from "../src/lib/siteMap.ts";

test("every navigation link points to a real page, and /dashboard and /demo are linked", () => {
  const pages = readdirSync("src/app", { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => "/" + d.name);
  for (const link of NAV_LINKS) {
    if (link.href === "/") continue;
    assert.ok(pages.includes(link.href), `${link.href} has no page in src/app`);
    assert.ok(existsSync(`src/app${link.href}/page.tsx`), `${link.href} has no page.tsx`);
  }
  const hrefs = NAV_LINKS.map((l) => l.href);
  assert.ok(hrefs.includes("/dashboard") && hrefs.includes("/demo"));
  assert.equal(new Set(hrefs).size, hrefs.length, "duplicate nav links");
});

test("the agent map and the guided demo are complete and point to existing pages", () => {
  assert.equal(AGENTS.length, 6);
  assert.equal(DEMO_STEPS.length, 6);
  // Steps for the founder's tools must say there is nothing to fill in.
  for (const step of DEMO_STEPS.filter((x) => x.kind === "look")) {
    assert.ok(step.action.toLowerCase().includes("just look"), `${step.title} should say "just look"`);
  }
  const hrefs = NAV_LINKS.map((l) => l.href);
  for (const agent of AGENTS) {
    assert.ok(hrefs.includes(agent.page), `${agent.name} points to ${agent.page}`);
    for (const field of ["logic", "input", "output", "saves", "checkpoint"]) {
      assert.ok(agent[field].length > 0, `${agent.name} is missing ${field}`);
    }
    const first = agent.logic.split(",")[0].trim();
    assert.ok(existsSync(`src/lib/${first}`), `${first} does not exist`);
  }
  assert.equal(demoHref("/chat", 3), "/chat?demo=3");
  assert.equal(demoHref("/#disenar", 1, "ana"), "/?demo=1&t=ana#disenar");
  for (const step of DEMO_STEPS) {
    assert.ok(hrefs.includes(step.href.split("#")[0] || "/"), `${step.title} links to ${step.href}`);
    assert.ok(step.action.length > 0 && step.look.length > 0);
    assert.ok(["try", "look"].includes(step.kind), `${step.title} needs a kind`);
  }
});

test("build logs, prompt library, impact check, and roadmap have the required content", () => {
  assert.equal(BUILD_LOGS.length, 6);
  assert.deepEqual(BUILD_LOGS.map((b) => b.week), ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"]);
  assert.ok(PROMPT_LIBRARY.length >= 5);
  for (const item of PROMPT_LIBRARY) assert.ok(item.prompt.length > 80, item.title);
  assert.ok(IMPACT_CHECK.length >= 3);
  for (const item of IMPACT_CHECK) assert.ok(item.handling.length > 0 && item.limit.length > 0);
  assert.ok(ROADMAP_V2.length >= 2);
});
