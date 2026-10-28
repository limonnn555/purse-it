// Template-generated marketing content. Every claim is drawn from what Purse It
// really does today. Nothing here comes from an AI model.

export const SITE_URL = "https://purse-it.vercel.app";

export const BRAND = {
  name: "Purse It",
  tagline: "Your bag, designed around what you carry.",
  promise: "Every item gets a place.",
  voice: [
    { trait: "Practical", note: "Plain words and real items: keys, laptop, charger." },
    { trait: "Friendly", note: "Talks like a helpful friend, not a brand." },
    { trait: "Honest", note: "Says what it does (simple rules, not magic) and that it is early access." },
  ],
  colors: [
    { name: "Ink", hex: "#1c1917" },
    { name: "Paper", hex: "#fafaf9" },
    { name: "Accent blue", hex: "#2563eb" },
    { name: "Stone", hex: "#78716c" },
  ],
  typography: "System sans-serif. Semibold headlines, tight tracking, generous spacing.",
  dos: ["Name real items", "Keep sentences short", "Say \"free to try\" only for what is free today"],
  donts: ["\"AI-powered\" or \"revolutionary\"", "Invented numbers or testimonials", "Promising features still planned"],
};

export const PERSONA = {
  label: "Fictional composite persona, based on one customer conversation and our competitor research.",
  name: "Daniela Ruiz",
  summary: "27, product designer in Mexico City",
  carries: ["Laptop", "Phone", "Wallet", "Keys", "Charger", "Water bottle", "Sketchbook"],
  today: "Throws everything into a backpack and digs around for it.",
  pains: [
    "Digging for her keys while late",
    "Charger tangled with everything else",
    "Laptop pressed against the water bottle",
  ],
  goals: ["Quick access to the daily essentials", "Protect the laptop", "A bag that looks intentional"],
  channels: ["Instagram", "TikTok", "WhatsApp"],
  objection: "\"An organizer insert is cheaper, and I can use the bag I already own.\"",
  answer: "Start free: see the layout first, then decide whether a new bag is worth it.",
};

export const LANDING = {
  headline: "Design the perfect bag for what you carry every day",
  subhead:
    "Tell us what you carry and what size bag you want. Purse It instantly builds a design with a compartment made for each item.",
  cta: "Design my bag, it's free",
  benefits: [
    { title: "A place for every item", body: "Each item goes to the zone that matches how fast you need it." },
    { title: "See it before you commit", body: "Get a clear layout first, with no account needed." },
    { title: "Built from your routine", body: "Describe your day and get design principles for your bag." },
  ],
  steps: ["Pick a bag size and your items.", "Generate the design.", "Save it and come back to it."],
  faq: [
    { q: "Is it free?", a: "Yes. Designing a bag is free today and needs no account." },
    { q: "Does it use AI?", a: "No. It uses simple, explainable rules, so you can see why each item landed where it did." },
    { q: "Can I order the bag?", a: "Not yet. Today Purse It gives you the design. Maker quotes are planned." },
  ],
  closing: "Open the designer and give your stuff a place.",
};

export type Post = {
  id: number;
  day: number;
  channel: string;
  title: string;
  caption: string;
  hashtags: string;
  cta: string;
};

export const POSTS: Post[] = [
  {
    id: 1,
    day: 1,
    channel: "Instagram",
    title: "What's actually in your bag?",
    caption:
      "Open your bag. Phone, keys, charger, and a water bottle somewhere at the bottom. Most bags give you one big hole and wish you luck. What are you carrying today? Tell us in the comments.",
    hashtags: "#whatsinmybag #everydaycarry #bagdesign",
    cta: `Try the free designer: ${SITE_URL}`,
  },
  {
    id: 2,
    day: 2,
    channel: "TikTok",
    title: "The keys problem",
    caption:
      "POV: you're late and your keys are somewhere in the bag. Give every item a place. Free tool, link in bio.",
    hashtags: "#bagtok #organizewithme #everydaycarry",
    cta: "Design yours free, link in bio.",
  },
  {
    id: 3,
    day: 3,
    channel: "Instagram",
    title: "Your bag in 4 zones",
    caption:
      "Main compartment for the big stuff. Front pocket for what you grab all day. Side pocket for the bottle. Inner organizer for the small things. Swipe to see where your items would go.",
    hashtags: "#bagorganization #everydaycarry #productdesign",
    cta: `Build your layout: ${SITE_URL}`,
  },
  {
    id: 4,
    day: 5,
    channel: "LinkedIn",
    title: "We compared 13 bag products",
    caption:
      "We looked at 13 existing products and alternatives, from custom-print sites to modular backpacks and packing organizers. Most custom-bag tools start with colors and fabric. We start with what you carry. Here is the research behind Purse It.",
    hashtags: "#productdesign #startups #research",
    cta: `See the research: ${SITE_URL}/research`,
  },
  {
    id: 5,
    day: 6,
    channel: "Instagram Stories",
    title: "Poll: organizer or a designed bag?",
    caption:
      "Honest question: do you use an organizer insert in your bag, or a bag designed around your stuff? Vote, and tell us why.",
    hashtags: "#poll #bagorganizer",
    cta: "Reply with what you use today.",
  },
  {
    id: 6,
    day: 8,
    channel: "WhatsApp Status",
    title: "Quick share",
    caption:
      "I found a free tool that lays out your bag around what you carry. Pick your items, get the layout.",
    hashtags: "",
    cta: SITE_URL,
  },
  {
    id: 7,
    day: 9,
    channel: "X / Threads",
    title: "From routine to design core",
    caption:
      "Describe your day. Purse It turns it into a few design principles for your bag and tells you which zone to prioritize. Office routine, travel, school, workout: each gets a different core.",
    hashtags: "#bagdesign #everydaycarry",
    cta: `Try it: ${SITE_URL}/core`,
  },
  {
    id: 8,
    day: 11,
    channel: "Instagram Reels",
    title: "Pick, generate, done",
    caption:
      "Pick a size. Tick what you carry. Generate. In about a minute you have a bag layout with a place for every item. Free to try.",
    hashtags: "#bagdesign #everydaycarry #organizewithme",
    cta: `Design yours: ${SITE_URL}`,
  },
  {
    id: 9,
    day: 12,
    channel: "Instagram",
    title: "How it works, no AI hype",
    caption:
      "Purse It uses simple rules, not a mystery model. Each item goes to the zone that matches how fast you need it. That is why you can always see why your phone is in the front pocket.",
    hashtags: "#transparency #productdesign #bagdesign",
    cta: `Read how it works: ${SITE_URL}/docs`,
  },
  {
    id: 10,
    day: 14,
    channel: "Instagram + email",
    title: "Early access: tell us what's missing",
    caption:
      "Purse It is in early access. The designer is free to try, and we're building the rest in the open. What would make it useful for you?",
    hashtags: "#earlyaccess #bagdesign",
    cta: `Try it and tell us: ${SITE_URL}`,
  },
];

export type Script = {
  id: number;
  day: number;
  title: string;
  length: string;
  hook: string;
  scenes: string[];
  voiceover: string;
  cta: string;
};

export const SCRIPTS: Script[] = [
  {
    id: 1,
    day: 4,
    title: "The keys problem",
    length: "15 seconds, vertical video",
    hook: "You're late. Where are your keys?",
    scenes: [
      "Hand digging through a full bag, items falling out.",
      "Cut to the Purse It design: keys in the Inner organizer.",
      "Neat bag opened, keys right where they should be.",
    ],
    voiceover: "Most bags are one big hole. Give every item a place.",
    cta: "Design yours free. Link in bio.",
  },
  {
    id: 2,
    day: 7,
    title: "Design a bag in a minute",
    length: "30 seconds, screen recording",
    hook: "Let's design a bag around what I carry.",
    scenes: [
      "Screen: pick the Medium size.",
      "Tick Phone, Laptop, Keys, Charger, Water bottle.",
      "Click Generate design and show the zones filling in.",
      "Zoom on the front pocket and the inner organizer.",
    ],
    voiceover:
      "Pick a size, tick what you carry, and get a layout with a place for every item.",
    cta: "Try it free at purse-it.vercel.app.",
  },
  {
    id: 3,
    day: 10,
    title: "From routine to design core",
    length: "30 seconds, screen recording plus voiceover",
    hook: "What if your bag was designed from your routine?",
    scenes: [
      "Type a routine: \"I work in an office, carry a laptop, and bike to work.\"",
      "Generate and show the title, priority zone, and principles.",
      "Switch to a travel routine and show a different result.",
    ],
    voiceover:
      "Describe your day and Purse It gives you design principles for your bag. A different routine gives a different answer.",
    cta: "Try the design core. Link in bio.",
  },
];

export type CalendarDay = {
  day: number;
  theme: string;
  asset: string;
  channel: string;
  goal: string;
};

export const CALENDAR: CalendarDay[] = [
  { day: 1, theme: "Start the conversation", asset: "Post 1", channel: "Instagram", goal: "Awareness" },
  { day: 2, theme: "Relatable pain", asset: "Post 2", channel: "TikTok", goal: "Awareness" },
  { day: 3, theme: "Explain the 4 zones", asset: "Post 3", channel: "Instagram", goal: "Understanding" },
  { day: 4, theme: "Show the problem", asset: "Video 1", channel: "TikTok / Reels", goal: "Awareness" },
  { day: 5, theme: "Credibility: the research", asset: "Post 4", channel: "LinkedIn", goal: "Trust" },
  { day: 6, theme: "Ask the audience", asset: "Post 5", channel: "Instagram Stories", goal: "Insight" },
  { day: 7, theme: "Show the product", asset: "Video 2", channel: "TikTok / Reels", goal: "Trial" },
  { day: 8, theme: "Word of mouth", asset: "Post 6", channel: "WhatsApp Status", goal: "Trial" },
  { day: 9, theme: "Design core", asset: "Post 7", channel: "X / Threads", goal: "Trial" },
  { day: 10, theme: "Routine to design", asset: "Video 3", channel: "TikTok / Reels", goal: "Trial" },
  { day: 11, theme: "Quick how-to", asset: "Post 8", channel: "Instagram Reels", goal: "Trial" },
  { day: 12, theme: "Be transparent", asset: "Post 9", channel: "Instagram", goal: "Trust" },
  { day: 13, theme: "Review the A/B results and reply to comments", asset: "No new post", channel: "All channels", goal: "Learning" },
  { day: 14, theme: "Invite feedback", asset: "Post 10", channel: "Instagram + email", goal: "Feedback" },
];

export function brandText(): string {
  return [
    `${BRAND.name}: ${BRAND.tagline}`,
    `Promise: ${BRAND.promise}`,
    `Voice: ${BRAND.voice.map((v) => `${v.trait} (${v.note})`).join("; ")}`,
    `Colors: ${BRAND.colors.map((c) => `${c.name} ${c.hex}`).join(", ")}`,
    `Typography: ${BRAND.typography}`,
    `Do: ${BRAND.dos.join("; ")}`,
    `Don't: ${BRAND.donts.join("; ")}`,
  ].join("\n");
}

export function personaText(): string {
  return [
    `${PERSONA.name}, ${PERSONA.summary} (${PERSONA.label})`,
    `Carries: ${PERSONA.carries.join(", ")}`,
    `Today: ${PERSONA.today}`,
    `Pains: ${PERSONA.pains.join("; ")}`,
    `Goals: ${PERSONA.goals.join("; ")}`,
    `Channels: ${PERSONA.channels.join(", ")}`,
    `Objection: ${PERSONA.objection}`,
    `Our answer: ${PERSONA.answer}`,
  ].join("\n");
}

export function landingText(): string {
  return [
    `Headline: ${LANDING.headline}`,
    `Subhead: ${LANDING.subhead}`,
    `Button: ${LANDING.cta}`,
    "",
    ...LANDING.benefits.map((b) => `${b.title}: ${b.body}`),
    "",
    `How it works: ${LANDING.steps.map((s, i) => `${i + 1}. ${s}`).join(" ")}`,
    "",
    ...LANDING.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`),
    "",
    LANDING.closing,
  ].join("\n");
}

export function postText(post: Post): string {
  return [
    `${post.channel} (day ${post.day}): ${post.title}`,
    post.caption,
    post.hashtags,
    post.cta,
  ]
    .filter(Boolean)
    .join("\n");
}

export function scriptText(script: Script): string {
  return [
    `${script.title} (${script.length}, day ${script.day})`,
    `Hook: ${script.hook}`,
    "Scenes:",
    ...script.scenes.map((scene, i) => `${i + 1}. ${scene}`),
    `Voiceover: ${script.voiceover}`,
    `CTA: ${script.cta}`,
  ].join("\n");
}

export function calendarText(): string {
  return CALENDAR.map(
    (d) => `Day ${d.day}: ${d.theme} | ${d.asset} | ${d.channel} | ${d.goal}`
  ).join("\n");
}
