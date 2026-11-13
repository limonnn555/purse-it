// Full-site regression test: checks every page of a running site.
// Usage: node scripts/regression.mjs [baseUrl]   (default: https://purse-it.vercel.app)
// For each route it checks: HTTP 200, the expected heading, all 11 navigation links in the
// page, a footer, and no crash text. It also checks the link-preview image.
import { NAV_LINKS } from "../src/lib/siteMap.ts";

const base = (process.argv[2] || "https://purse-it.vercel.app").replace(/\/$/, "");

const routes = [
  { path: "/", heading: "" },
  { path: "/roadmap", heading: "Where Purse It is headed" },
  { path: "/core", heading: "" },
  { path: "/research", heading: "" },
  { path: "/product", heading: "" },
  { path: "/pricing", heading: "" },
  { path: "/marketing", heading: "" },
  { path: "/chat", heading: "Not sure which bag fits your day" },
  { path: "/dashboard", heading: "What Purse It has recorded, tested, and checked" },
  { path: "/demo", heading: "See everything Purse It does in 5 minutes" },
  { path: "/docs", heading: "How does Purse It work?" },
];

let passed = 0;
let failed = 0;
const failures = [];

function check(name, ok, detail = "") {
  if (ok) {
    passed += 1;
  } else {
    failed += 1;
    failures.push(`${name}${detail ? " — " + detail : ""}`);
  }
}

for (const route of routes) {
  const response = await fetch(base + route.path, { redirect: "follow" });
  const html = await response.text();
  check(`${route.path} returns 200`, response.status === 200, `got ${response.status}`);
  check(`${route.path} has an h1`, /<h1[\s>]/.test(html));
  if (route.heading) check(`${route.path} shows its heading`, html.includes(route.heading));
  for (const link of NAV_LINKS) {
    check(`${route.path} links to ${link.href}`, html.includes(`href="${link.href}"`));
  }
  check(`${route.path} has the footer`, html.includes("Designs made to fit what you carry every day"));
  check(`${route.path} has no crash text`, !/Application error|Internal Server Error/.test(html));
}

const image = await fetch(base + "/opengraph-image");
check("/opengraph-image returns an image", image.status === 200 && (image.headers.get("content-type") || "").startsWith("image/"));

const missing = await fetch(base + "/this-page-does-not-exist");
check("unknown pages return 404", missing.status === 404, `got ${missing.status}`);

console.log(`Regression test on ${base}`);
console.log(`${passed} of ${passed + failed} checks passed (${routes.length + 2} pages checked)`);
if (failed > 0) {
  console.log("Failures:");
  for (const line of failures) console.log(" - " + line);
  process.exit(1);
}
