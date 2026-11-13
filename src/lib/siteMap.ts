// Content for the integrated site: navigation, agent map, guided demo, build logs,
// prompt library, impact check, Version 2 roadmap, and testing summary.
// Pure data with no imports, so it can be checked directly with node (scripts/site.test.mjs).

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/core", label: "Core" },
  { href: "/research", label: "Research" },
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/marketing", label: "Marketing" },
  { href: "/chat", label: "Chat" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/demo", label: "Demo" },
  { href: "/docs", label: "Docs" },
];

// Every "agent" in Purse It is rule-based logic, not an AI model. The site says so.
export type Agent = {
  name: string;
  page: string;
  logic: string;
  input: string;
  output: string;
  saves: string;
  checkpoint: string;
};

export const AGENTS: Agent[] = [
  {
    name: "Design agent",
    page: "/",
    logic: "designEngine.ts",
    input: "Bag size and the items you carry",
    output: "A bag layout with a zone for every item",
    saves: "designs",
    checkpoint: "You review the layout before anything else happens",
  },
  {
    name: "Core agent",
    page: "/core",
    logic: "coreEngine.ts",
    input: "A description of your day",
    output: "A design core: title, priority zone, principles",
    saves: "core_outputs",
    checkpoint: "Saving is a button you press; a warning shows when the match is generic",
  },
  {
    name: "Research agent",
    page: "/research",
    logic: "researchEngine.ts",
    input: "Filters, search, and entries you add",
    output: "Competitors and substitutes grouped by risk",
    saves: "research_entries",
    checkpoint: "You decide which entries to add; required fields are validated",
  },
  {
    name: "Pricing agent",
    page: "/pricing",
    logic: "pricingEngine.ts",
    input: "Visitors, conversion, and plan mix per segment",
    output: "Simulated monthly and annual revenue",
    saves: "pricing_scenarios",
    checkpoint: "Every figure is labeled a simulation; you name and save a scenario",
  },
  {
    name: "Marketing agent",
    page: "/marketing",
    logic: "marketingContent.ts, abTesting.ts",
    input: "Real product facts and visitor events",
    output: "10 posts, 3 scripts, a 14-day calendar, A/B results",
    saves: "marketing_assets, ab_events",
    checkpoint: "Nothing is posted automatically; you copy, export, or save each card",
  },
  {
    name: "Advisor agent",
    page: "/chat",
    logic: "chatLogic.ts",
    input: "3 intake questions",
    output: "A recommended bag size, layout, and tip",
    saves: "chat_sessions, chat_feedback",
    checkpoint: "Guardrails block risky messages; flagged chats go to a person for review",
  },
];

export const DEMO_STEPS = [
  {
    title: "Design a bag",
    href: "/#disenar",
    action: "Pick a bag size and a few items, then generate the design.",
    look: "Every item gets a zone (main, front, side, or inner organizer).",
  },
  {
    title: "Get your design core",
    href: "/core",
    action: "Describe your day in a sentence, for example: office, laptop, keys, and a gym bag.",
    look: "A core with a priority zone and principles, and a warning if the match is generic.",
  },
  {
    title: "Ask the bag advisor",
    href: "/chat",
    action: "Answer the 3 questions with the chips, then try typing a price question.",
    look: "A recommended bag size, and a guardrail reply that flags the price question.",
  },
  {
    title: "Check the market research",
    href: "/research",
    action: "Filter by threat level and search for a product.",
    look: "Competitors and substitutes grouped by risk, with a Mexico-specific angle.",
  },
  {
    title: "Try the pricing simulator",
    href: "/pricing",
    action: "Switch between Conservative, Base, and Optimistic, then edit a conversion rate.",
    look: "Monthly and annual revenue update, and the scenario switches to Custom.",
  },
  {
    title: "See the records",
    href: "/dashboard",
    action: "Open the dashboard after the steps above.",
    look: "Live record counts, chat and A/B numbers, the testing summary, and the impact check.",
  },
];

// Link for a demo step. The ?demo=N tag makes the "Back to the demo" bar appear on that page;
// the tester tag (if any) is carried along so their chats are labeled too.
export function demoHref(href: string, step: number, tester?: string | null): string {
  const [path, hash] = href.split("#");
  const query = `?demo=${step}${tester ? `&t=${encodeURIComponent(tester)}` : ""}`;
  return `${path}${query}${hash ? "#" + hash : ""}`;
}

export const BUILD_LOGS = [
  {
    week: "Week 1",
    title: "Bag designer and design core",
    dates: "Aug 20 – Sep 9, 2026",
    commits: 11,
    built: "The bag designer, the /core rule-based engine with saving to Supabase, and the English translation of the site.",
    fixed: "A warning when the generated core is generic (no clear keyword match).",
  },
  {
    week: "Week 2",
    title: "Research and benchmarking",
    dates: "Sep 28, 2026",
    commits: 6,
    built: "/research with an intake form, filters, a risk map, and the research_entries table seeded with real examples.",
    fixed: "The intake form failed silently when required fields were empty; it now shows validation.",
  },
  {
    week: "Week 3",
    title: "Product map and pricing simulator",
    dates: "Oct 21, 2026",
    commits: 10,
    built: "/product (features by plan, 2 customer segments) and /pricing (scenarios, editable inputs, saved scenarios), with a tested pricing engine.",
    fixed: "A stray leading zero in calculator inputs, and clear messages when the database does not respond.",
  },
  {
    week: "Week 4",
    title: "Marketing engine and A/B tests",
    dates: "Oct 28, 2026",
    commits: 12,
    built: "/marketing with a brand system, persona, 10 posts, 3 scripts, a 14-day calendar, two live A/B tests, and an upgraded home page.",
    fixed: "The hero flickered between variants, and automatic deploy checks were counted as visitors; a view now counts only after real interaction.",
  },
  {
    week: "Week 5",
    title: "Public bag advisor",
    dates: "Nov 4 – Nov 6, 2026",
    commits: 8,
    built: "/chat: 3 intake questions, rule-based recommendation, guardrails, a human checkpoint, ratings, and write-only storage.",
    fixed: "No way to undo a wrong answer (Start over button), and a tester said the page needed more color.",
  },
  {
    week: "Week 6",
    title: "Integrated venture site",
    dates: "Nov 2026",
    commits: 0,
    built: "/demo guided walkthrough with an agent map, /dashboard with live records and the impact check, this prompt library and build log, and a Version 2 roadmap.",
    fixed: "See the iteration log in the submission packet.",
  },
];

export const PROMPT_LIBRARY = [
  {
    title: "Planning prompt (used every week)",
    week: "All weeks",
    prompt:
      "ROLE: You are my disciplined AI-native product architect and coding partner. COURSE RULE: Do not let me code before the plan is clear. TASK: Help me complete this week's Build Discipline Packet, then create a precise implementation prompt for Codex or Claude Code. CONSTRAINTS: Free tools only. Next.js/React + Tailwind + Vercel + GitHub + Supabase when data is needed. Build small, testable features. No paid APIs required; if AI output is simulated, label it clearly. Require acceptance criteria before coding.",
  },
  {
    title: "Research page",
    week: "Week 2",
    prompt:
      "Build the /research page for Purse It: a research intake form to log competitors/examples (name, category, region, description, threat level, link), a filterable/searchable table, a risk map grouped by threat level, a dashboard summary widget, and Supabase persistence in a research_entries table. Seed it with 5 real global examples and 8 real competitors/substitutes I researched, including a Mexico-specific angle.",
  },
  {
    title: "Product map and pricing simulator",
    week: "Week 3",
    prompt:
      "Build /product and /pricing for Purse It: a product feature map showing which of 3 plans (Free MX$0, Plus MX$99, Studio MX$299) includes each feature, 2 customer segments (Everyday Carriers and Bag Makers), and a revenue calculator with Conservative/Base/Optimistic scenarios, editable inputs, an assumptions table, and named scenarios saved to a Supabase pricing_scenarios table. Keep the math in a pure pricingEngine module with 2 logic tests. No paid APIs, and label every figure as a simulation.",
  },
  {
    title: "Marketing engine",
    week: "Week 4",
    prompt:
      "Build /marketing and upgrade the home page for Purse It: a brand system, one target persona, landing page copy, exactly 10 social posts, 3 video scripts, and a 14-day campaign calendar, all template-generated from real product facts and labeled as such; content cards with Copy, Export, and Save buttons that persist to a Supabase marketing_assets table; two live A/B tests on the home page (hero headline and main button) logged to an ab_events table, counting unique visitors and excluding test sessions; a simulated headline scorer; and a credible home page. No paid APIs, no invented testimonials, and everything must still render if the database is down.",
  },
  {
    title: "Public guided assistant",
    week: "Week 5",
    prompt:
      "Build /chat for Purse It: a guided, rule-based bag advisor (no AI API, labeled clearly) with a chat UI, exactly 3 intake questions, and rules that return a bag size, layout, and tip reusing the existing design engine. Add guardrails for personal data (never echo or store it), abuse, medical/legal/financial advice, order or price requests, and off-topic messages; a human checkpoint that flags risky or low-confidence chats; storage in Supabase with write-only public access and an aggregate stats view; thumbs, a 1-5 rating, and an optional comment; and everything must still work if the database does not respond. Put the logic in a pure module with Node tests.",
  },
  {
    title: "Integrated venture site",
    week: "Week 6",
    prompt:
      "Integrate Purse It into one venture site: full navigation to every page; a /dashboard that shows live record counts and recent records from Supabase, the chat and A/B stats, a testing summary, and a practical impact check; a /demo guided walkthrough of the 6 modules with an agent map (all agents are rule-based and labeled) and a rating box saved to a write-only demo_feedback table; a prompt library and build log in /docs; and a Version 2 roadmap. Keep the logic in a pure module with Node tests, add a regression script that checks every route on the live site, and make every page degrade gracefully when the database does not respond.",
  },
];

export const IMPACT_CHECK = [
  {
    risk: "Visitors' personal data",
    handling:
      "No names or contact details are collected. The chat blocks emails, phone numbers, and card-like numbers: they are never shown back or saved. Chat and rating tables are write-only, so nobody can read another visitor's answers.",
    limit: "Only the public database key is used, so there is no account system; a real launch would add one.",
  },
  {
    risk: "Misleading claims",
    handling:
      "Every agent is rule-based and the pages say so. Prices and revenue are labeled simulations, plans are marked live or planned, and there are no invented testimonials, user counts, or press logos.",
    limit: "The A/B tests have too few visitors to name a winner, and the pages say that too.",
  },
  {
    risk: "Fair and accessible use",
    handling:
      "No account or payment is needed to use anything. Pages use plain language, work on a phone (the menu collapses and there is no sideways scrolling), and every control can be used with a keyboard.",
    limit: "The site is in English only, and the advisor understands keywords, so unusual wording gets a general suggestion.",
  },
];

export const ROADMAP_V2 = [
  {
    title: "Weather and context suggestions",
    why: "A tester suggested adapting the recommendation to the day's weather, for example a rain-ready compartment.",
    note: "Needs a free outside weather service and a new guardrail for what the advisor may say about it.",
  },
  {
    title: "Share a design as an image",
    why: "People want to send their generated layout to a friend or a bag maker.",
    note: "Export the bag diagram as a picture, with no personal data in it.",
  },
];

export const TESTING_SUMMARY = {
  externalTarget: 5,
  chatTesters: 3,
  logicTests: 11,
  // Filled in from the live regression run (scripts/regression.mjs).
  regression: { date: "Nov 13, 2026", checks: 172, passed: 172, pages: 13 },
};
